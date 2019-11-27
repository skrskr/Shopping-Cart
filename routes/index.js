var express = require('express');
const csrf = require('csurf');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
var router = express.Router();
const csrfProtection = csrf();
const Product = require('../models/product_model');

router.use(csrfProtection)

/* GET home page. */
router.get('/', function(req, res, next) {
  
  Product.find((err, products) => {
    let productChuncks = [];
    const CHUNK_SIZE = 3;

    for(let i = 0; i < products.length; i+= CHUNK_SIZE){
      productChuncks.push(products.slice(i, i + CHUNK_SIZE));
    }
    res.render('shop/index', { title: 'Shoping Cart', products: productChuncks });
  });
});

router.get('/user/signup', (req, res, next) => {
  const messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasError: messages.length > 0});
})

router.post('/user/signup', [
  check('email').isEmail().withMessage('Invalid Email'),
  check('password').isLength({min: 4}).withMessage('Invalid Password'),
],
  (req, res, next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        let messages = [];        
        errors.errors.forEach(err => {
            messages.push(err.msg);
        })
        return res.render('user/signup',{messages: messages, hasError: messages.length > 0});
    }
    next();
  },
passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/user/profile', (req, res, next) => {
  res.render('user/profile')
})

module.exports = router;
