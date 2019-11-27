var express = require('express');
var router = express.Router();
const Product = require('../models/product_model');
const Cart = require('../models/cart_model');

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

// Add to cart route
router.get('/add-to-cart/:id', (req, res, next) => {
  const id = req.params.id;
  Product.findById(id, (err, product) => {
    if(err)
      return res.redirect('/');
    
    let cart = new Cart(req.session.cart ? req.session.cart: {});
    cart.add(product, id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  })
  
});

router.get('/shopping-cart', (req, res, next) => {
  if(!req.session.cart)
      return res.render('shop/shopping-cart', {products: null});
  
  const cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
})

module.exports = router;
