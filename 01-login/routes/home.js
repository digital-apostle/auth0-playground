var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();

/* Show Token Summary Page */
router.get('/home', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  const access_token = req.query.access_token;
  const id_token = req.query.id_token;
  const expires_in = req.query.expires_in;

  res.render('home', {
    userProfile: userProfile.toString(),
    access_token : access_token,
    expires_in : expires_in,
    id_token : id_token,
    id_token_json : id_token,
    title: 'Home page'
  });
});

module.exports = router;
