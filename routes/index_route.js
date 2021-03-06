var express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECERT_KEY);
var router = express.Router();
const Product = require("../models/product_model");
const Cart = require("../models/cart_model");
const Order = require("../models/order_model");

/* GET home page. */
router.get("/", function(req, res, next) {
  const successMsg = req.flash("success")[0];

  Product.find((err, products) => {
    if (err) console.log("Products ERR: ", err);

    let productChuncks = [];
    const CHUNK_SIZE = 3;

    for (let i = 0; i < products.length; i += CHUNK_SIZE) {
      productChuncks.push(products.slice(i, i + CHUNK_SIZE));
    }
    res.setHeader("Content-Type", "text/html");

    res.render("shop/index", {
      title: "Shoping Cart",
      products: productChuncks,
      successMsg: successMsg,
      noMsg: !successMsg
    });
  });
});

// Add to cart route
router.get("/add-to-cart/:id", (req, res, next) => {
  const id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) return res.redirect("/");

    let cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.add(product, id);
    req.session.cart = cart;
    res.redirect("/");
  });
});

router.get("/reduce/:id", (req, res, next) => {
  const id = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(id);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/remove/:id", (req, res, next) => {
  const id = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(id);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/shopping-cart", (req, res, next) => {
  const errMsg = req.flash("error")[0];
  if (!req.session.cart)
    return res.render("shop/shopping-cart", {
      products: null,
      errMsg: errMsg,
      noError: !errMsg
    });

  const cart = new Cart(req.session.cart);
  res.render("shop/shopping-cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    errMsg: errMsg,
    noError: !errMsg,
    isNotLoggedIn: !req.isAuthenticated()
  });
});

router.post("/checkout", isLoggedIn, (req, res, next) => {
  if (!req.session.cart) return res.redirect("shopping-cart");

  const cart = new Cart(req.session.cart);
  const amount = cart.totalPrice * 100;

  const stripeToken = req.body.id;

  stripe.charges.create(
    {
      amount,
      currency: "usd",
      source: stripeToken
    },
    function(err, charge) {
      if (err) {
        console.log("ERROR: ", err.message);
        req.flash("error", err.message);
        res.status(500);
        return res.send({ code: 500, msg: "Error Message: " + err.message });
        // return res.redirect("shopping-cart");
      }

      const order = new Order({
        userId: req.user,
        cart: cart,
        paymentId: charge.id
      });

      order.save(function(err, result) {
        req.flash("success", "Successfully bought products");
        req.session.cart = null;
        res.status(200);
        return res.send({ code: 200, msg: "Successfull added Message" });
      });
    }
  );
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  req.session.oldUrl = req.url;
  res.redirect("/user/signin");
}
