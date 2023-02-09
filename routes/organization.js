const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const passport = require('passport');


router
  .route('/register')
  .get((req, res) => {
    res.render('organizations/register');
  })
  .post(async (req, res, next) => {
    try {
      const { email, password, OrganizationName } = req.body;
      const Organization = new Organization({ email, OrganizationName });
      const registerdOrganization = await Organization.register(Organization, password);
      req.login(registerdOrganization, (err) => {
        if (err) next(err);
        res.redirect('/sponsors');
      });
    } catch (e) {
      res.redirect('/register');
    }
  });

router
  .route('/login')
  .get((req, res) => {
    res.render('organizations/login');
})
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',
    }),
    (req, res) => {
      req.flash('success', 'Welcome Back!');
      const redirectUrl = req.session.returnTo || '/sponsors';
      delete req.session.returnTo;
      res.redirect(redirectUrl);
  }
  );

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Successfully Logged Out!');
  res.redirect('/sponsors');
});

module.exports = router;
