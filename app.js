var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const expressHbs = require("express-handlebars");
const session = require("express-session");
var logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo")(session);

require("./config/passport_config");
require("dotenv").config();

const indexRouter = require("./routes/index_route");
const userRouter = require("./routes/user_route");

var app = express();

// view engine setup
app.engine(".hbs", expressHbs({ defaultLayout: "layout", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Connect to mongodb
mongoose.connect(process.env.MONGO_DB_PATH, err => {
  if (err) console.log("Can not connect to mongo db");
  else console.log("Connect db Success");
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "mysecert",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    cookie: {
      maxAge: 180 * 60 * 1000
    }
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

// Set logged in user flage
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use("/", indexRouter);
app.use("/user", userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
