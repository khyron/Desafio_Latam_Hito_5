const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,    // Database name
  process.env.DB_USER,        // Username
  process.env.DB_PASSWORD,    // Password
  {
    host: process.env.DB_HOST,      // Database host
    port: process.env.DB_PORT || 5432, // Database port (default 5432 for PostgreSQL)
    dialect: 'postgres',             // Database dialect
    logging: false,                  // Disable SQL query logging in console
    pool: {                          // Connection pool settings
      max: 5,                        // Maximum number of connections
      min: 0,                        // Minimum number of connections
      acquire: 30000,                // Maximum time (ms) to acquire connection
      idle: 10000                    // Maximum time (ms) a connection can be idle
    }
  }
);

module.exports = sequelize;