var express = require('express');
var router = express.Router();
const User = require('../models/User.model')
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', isLoggedOut, function(req, res, next) {
  res.render('auth/signup.hbs');
});

router.post('/signup', (req, res, next)=>{
  console.log('the form data: ', req.body);
  
  const { username, password } = req.body;
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({

        username: req.body.username,
        password: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect('/')
    })
    .catch(error => next(error));
});


router.get('/login',isLoggedOut,  (req, res, next) =>{
  res.render('auth/login.hbs')
})

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  
  if (!username || !password) {
    res.render('auth/login.hbs', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  User.findOne({ username })
  .then(user =>{
    if(!user){
      res.render('auth/login', { errorMessage: 'Username is not registered. Try with another username' });
      return;
    } else if (bcryptjs.compareSync(password, user.password)){
      req.session.user = user
      console.log('SESSION =====> ', req.session);
      res.redirect('/users/profile');
    } else {
      res.render('auth/login.hbs', { errorMessage: 'Incorrect password.' });
    }
  })
  .catch(error => next(error));
});

router.get('/profile', (req, res, next)=> {
  const user = req.session.user
  console.log('SESSION =====> ', req.session);
  res.render('user-profile.hbs', {user})
})


router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/users/login")
  });
});

module.exports = router;
