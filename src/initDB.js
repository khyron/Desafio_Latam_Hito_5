require('dotenv').config({ path: '../.env' });  

console.log('Current directory:', __dirname);
console.log('Environment variables:', {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '*****' : 'undefined',
  DB_DATABASE: process.env.DB_DATABASE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT
});

const { Sequelize } = require('sequelize');
const path = require('path');
const Photo = require('./models/photo.model');
const User = require('./models/user.model');

(async () => {
  try {
    // Verify critical variables exist
    if (!process.env.DB_USER || !process.env.DB_DATABASE) {
      throw new Error('Missing required environment variables');
    }

    // 1. Admin connection to create database
    const adminConnection = new Sequelize({
      database: 'postgres',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD || null, 
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: console.log
    });

    console.log('Attempting to create database...');
    try {
      await adminConnection.query(`CREATE DATABASE ${process.env.DB_DATABASE};`);
      console.log('Database created successfully');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('Database already exists');
      } else {
        throw err;
      }
    }
    await adminConnection.close();

    // 2. Main application connection
    const sequelize = new Sequelize({
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD || null,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: console.log
    });

    await sequelize.authenticate();
    console.log('Connected to database successfully');

    // 3. Create tables
    console.log('Creating tables...');
    await User.sync({ force: true });
    await Photo.sync({ force: true });
    console.log('Tables created successfully');

    // 4. Insert sample data
    console.log('Inserting sample data...');
    await User.create({
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com'
    });
    await Photo.create({
      title: "Sample Photo",
      photographer: "Test User",
      camera_model: "Test Camera"
    });
    console.log('Sample data inserted');

    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Initialization failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
})();