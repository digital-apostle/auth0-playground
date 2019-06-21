var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();

/* Show Token Summary Page */
router.get('/home', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  const access_token = req.query.access_token;
  const id_token = req.query.id_token;

  delete req.query.access_token;
  delete req.query.id_token;
  // console.log(req);

  console.log('response =' + res);

  res.render('home', {
    userProfile: userProfile.toString(),
    access_token : access_token,
    id_token : id_token,
    title: 'Home page'
  });
});

module.exports = router;
