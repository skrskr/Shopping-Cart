var express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECERT_KEY);
var router = express.Router();
const Product = require("../models/product_model");
const Cart = require("../models/cart_model");
const Order = require("../models/order_model");

/* GET home page. */
router.get("/", function(req, res, next) {
  const successMsg = req.flash("success")[0];
  // console.log("Success Message", successMsg);
  // console.log(!successMsg);

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
    console.log(req.session.cart);
    res.redirect("/");
  });
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
    noError: !errMsg
  });
});

/*
router.post("/checkout", (req, res, next) => {
  if (!req.session.cart) return res.redirect("shopping-cart");

  const cart = new Cart(req.session.cart);
  const amount = cart.totalPrice * 100;

  const stripeToken = req.body.id;

  console.log("1");

  // stripe.charges
  //   .create({
  //     amount,
  //     currency: "usd",
  //     source: stripeToken
  //   })
  //   .then(out => {
  //     console.log("2");
  //     console.log("Successfully Server");
  //     res.set("Content-Type", "application/json");
  //     res.end({ message: "Successfully Pruche Items" });
  //     next();
  //     console.log("3");
  //   })
  //   .catch(err => {
  //     console.log("4");
  //     console.log("Charage Failed");
  //     console.log("Error Server: ", err.message);
  //     res.set("Content-Type", "application/json");
  //     res.sendStatus(500).end({ message: err.message });
  //     console.log("5");
  //   });

  stripe.charges.create(
    {
      amount,
      currency: "usd",
      source: stripeToken
    },
    function(err, charge) {
      // console.log("Charge", charge);

      if (err) {
        console.log("ERROR: ", err.message);
        req.flash("error", err.message);
        return res.redirect("shopping-cart");
      }
      req.flash("success", "Successfully bought products");
      req.session.cart = null;
      console.log("success");
      // res.setHeader("Content-Type", "text/html");
      // res.redirect("/");
      // return res.send("/");
      // res.send('<script>window.location.href="/";</script>');
      // res.set("location", "/");
      // res.status(301).send();
      // res.send(301, "/");

      // res.set("Content-Type", "application/json");
      // res.end("end");
      // res.redirect("/");
      next();
    }
  );
  console.log("6");
});*/

router.post("/checkout", (req, res, next) => {
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

      console.log("UserID:", req.user);

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
