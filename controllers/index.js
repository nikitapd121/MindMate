exports.home = (req, res) => {
  res.render('user', {
    pageTitle: 'Home',
    user: null // or false
  });
};
