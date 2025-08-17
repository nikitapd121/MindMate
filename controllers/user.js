// controllers/user.js
const User=require('../models/user');

exports.working=(req,res)=>{
  res.render('user/working',{
    pageTitle:'How It Works',
    errorMessage:null
  });
};

exports.login=(req,res)=>{
  res.render('user/login',{
    pageTitle:'Login',
    errorMessage:null
  });
};

exports.signup=(req,res)=>{
  res.render('user/signup',{
    pageTitle:'Sign Up',
    errorMessage:null
  });
};

exports.postsignup=async(req,res)=>{
  try{
    const{name,email,password}=req.body;
    console.log('Form input:',req.body);
    const user=newUser({name,email,password});
    await user.save();
    console.log('User saved:',user);
    res.redirect('/login');
  } 
  catch(err){
    console.error('Error saving user:', err);
    res.status(500).send('Signup failed');
  }
};

exports.postlogin=async(req,res)=>{
  const{email,password}=req.body;
  try{
    const user=await User.findOne({email,password});
    if(!user){
      return res.redirect('/signup');
    }
    req.session.user={
      id:user._id,
      name:user.name,
      email:user.email
    };
    res.redirect('/member/dashboard');
  }
  catch(err){
    console.error('Error during login:',err);
    res.status(500).send('Login failed');
  } 
};

exports.home=(req,res)=>{
  res.render('user',{
    pageTitle:'Home'
  });
};

exports.about=(req,res)=>{
  res.render('user/about',{
    pageTitle:'About'
  });
};

exports.contact=(req,res)=>{
  res.render('user/contact',{
    pageTitle:'Contact'
  });
};
