const User = require('../models/user');

exports.dashboard = (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('member/dashboard', {
    pageTitle: 'Dashboard',
    user: req.session.user,
    responses: req.session.responses || []
  });
};

exports.dsa = (req, res) => {
  console.log('DSA route hit!');
  if (!req.session.user) return res.redirect('/login');
  res.render('member/dsa', {
    pageTitle: 'DSA',
    user: req.session.user,
    responses: req.session.responses || []
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.debug = (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('member/debug', {
    pageTitle: 'Debug',
    user: req.session.user,
    responses: req.session.responses || []
  });
};

exports.mvp = (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('member/mvp', {
    pageTitle: 'MVP',
    user: req.session.user,
    responses: req.session.responses || []
  });
};

exports.decision = (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('member/decision', {
    pageTitle: 'Decision',
    user: req.session.user,
    responses: req.session.responses || []
  });
};