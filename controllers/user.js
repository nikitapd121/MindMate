exports.login = (req, res) => {
  res.render('user/login', {
    pageTitle: 'Login',
    errorMessage: null
  });
};

exports.signup = (req, res) => {
  res.render('user/signup', {
    pageTitle: 'Sign Up',
    errorMessage: null
  });
};

exports.postsignup = (req, res) => {
  // Optional: save new user (not required for now)
  res.redirect('/login');
};

exports.postlogin = (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    req.session.user = { email }; // just a mock session
    return res.redirect('/');
  }

  res.render('user/login', {
    pageTitle: 'Login',
    errorMessage: 'Email and password required.'
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.home = (req, res) => {
  res.render('user', {
    pageTitle: 'Home'
  });
};

exports.about = (req, res) => {
  res.render('user/about', {
    pageTitle: 'About'
  });
};

exports.contact = (req, res) => {
  res.render('user/contact', {
    pageTitle: 'Contact'
  });
};

exports.dashboard = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

//   res.render('user/dashboard', {
//     pageTitle: 'Dashboard'
//   });
};
