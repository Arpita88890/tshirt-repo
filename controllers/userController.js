const User = require('../models/User');

exports.loginForm = (req, res) => {
  res.render('login', { error: null });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && user.password === req.body.password) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};