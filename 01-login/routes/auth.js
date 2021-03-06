var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');

dotenv.config();

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  // use roles permissions etc to get Id RBAC
  scope: 'openid email profile offline_access'
}), function (req, res) {
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {

    /* If authentication failed, user will be set to false. 
    If an exception occurred, err will be set. 
    An optional info argument will be passed, 
    containing additional details provided 
    by the strategy's verify callback. */
    
    console.log('info= ', info);
    
    console.log('user= ', user);

    if (err) { return next(err); }

    if (!user) { return res.redirect('/login'); }
    

    //  we're preeparing to redirect, so set up the request object and add the tokens.  Add id_token to req.token and access_token to AuthHeader.
    var id_token = info.id_token;
    var access_token = info.access_token;
    var expires_in = info.expires_in;


    //req object
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;

      res.redirect(returnTo || '/home?access_token='+access_token+'&expires_in='+expires_in+'&id_token='+id_token);
    });

  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }
  var logoutURL = new URL(
    util.format('https://%s/logout', process.env.AUTH0_DOMAIN)
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

module.exports = router;
