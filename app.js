// app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Make session user available to all EJS views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Static files (for images/css/js if needed)
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const userRouter = require('./routes/user');
app.use('/', userRouter);

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});