var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();

/* Show Token Summary Page */
router.get('/home', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;

  // console.log(req);

  console.log('response =' + res);

  res.render('home', {
    userProfile: userProfile.toString(),
    title: 'Home page'
  });
});

module.exports = router;
