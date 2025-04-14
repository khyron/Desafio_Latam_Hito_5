const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const photosRouter = require('./routes/photos.route'); 
const authRouter = require('./routes/auth.route');
const { authenticate } = require('./middlewares/auth');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRouter); 
app.use('/api/photos', authenticate, photosRouter);

// Database connection - only in non-test environment
if (process.env.NODE_ENV !== 'test') {
  sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);  
  });
  
  module.exports = server;
} else {
  module.exports = app;
}