require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 20;
const express=require('express');
const app=express();
const path=require('path');
const session=require('express-session');
const mongoose=require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
app.use(session({
  secret: process.env.SESSION_SECRET||'Hello@321',
  resave: false,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  res.locals.user=req.session.user||null;
  next();
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

const userRoutes=require('./routes/user');
const memberRoutes=require('./routes/member');
app.use('/',userRoutes);
app.use('/member',memberRoutes);

const PORT=process.env.PORT||3000;
app.listen(PORT,"0.0.0.0",()=>{
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
