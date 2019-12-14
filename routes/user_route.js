var express = require("express");
const csrf = require("csurf");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
var router = express.Router();

const csrfProtection = csrf();
router.use(csrfProtection);

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("user/profile");
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.use("/", notLoggedIn);

router.get("/signin", (req, res, next) => {
  const messages = req.flash("error");
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasError: messages.length > 0
  });
});

router.post(
  "/signin",
  [
    check("email")
      .notEmpty()
      .withMessage("Invalid Email"),
    check("password")
      .notEmpty()
      .withMessage("Invalid Password")
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let messages = [];
      errors.errors.forEach(err => {
        messages.push(err.msg);
      });
      return res.render("user/signin", {
        messages: messages,
        hasError: messages.length > 0
      });
    }
    next();
  },
  passport.authenticate("local.signin", {
    failureRedirect: "/user/signin",
    failureFlash: true
  }),
  function(req, res, next) {
    if (req.session.oldUrl) {
      const oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/user/profile");
    }
  }
);

router.get("/signup", (req, res, next) => {
  const messages = req.flash("error");
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasError: messages.length > 0
  });
});

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Invalid Email"),
    check("password")
      .isLength({ min: 4 })
      .withMessage("Invalid Password")
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let messages = [];
      errors.errors.forEach(err => {
        messages.push(err.msg);
      });
      return res.render("user/signup", {
        messages: messages,
        hasError: messages.length > 0
      });
    }
    next();
  },
  passport.authenticate("local.signup", {
    failureRedirect: "/user/signup",
    failureFlash: true
  }),
  function(req, res, next) {
    if (req.session.oldUrl) {
      const oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/user/profile");
    }
  }
);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return next();

  res.redirect("/");
}
