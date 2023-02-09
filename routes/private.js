var express = require('express');
var router = express.Router();
const User = require('../models/User.model')
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


router.get('/',isLoggedIn, function(req, res, next) {
    res.render('private.hbs');
  });




module.exports = router;