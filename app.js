require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

// ======= Database Connection =======
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ======= Middleware Setup =======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production'
  }
}));

// ======= Route Imports =======
const userRoutes = require('./routes/user');
const memberRoutes = require('./routes/member');
const analyzeRoutes = require('./routes/analyze'); 

// ======= Route Middlewares =======
app.use('/', userRoutes);          // All user auth routes
app.use('/member', memberRoutes);   // All member dashboard routes
app.use('/api/analyze', analyzeRoutes); // Code analysis API

// ======= View Engine Setup =======
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ======= Error Handling =======
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    error: process.env.NODE_ENV === 'development' ? err : 'Server Error' 
  });
});

// ======= Server Start =======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available Routes:');
  console.log('- GET    /                 (User routes)');
  console.log('- GET    /member           (Member routes)');
  console.log('- POST   /api/analyze      (Code analysis)');
});