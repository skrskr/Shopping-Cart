var express = require('express');
var router = express.Router();
const Product = require('../models/product_model');

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

module.exports = router;
