var express = require('express');
const csrf = require('csurf');
const passport = require('passport');
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

router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/user/profile', (req, res, next) => {
  res.render('user/profile')
})

module.exports = router;
