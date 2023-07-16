require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var cors = require("cors");
const mongoose = require("mongoose");

const cookieSession = require("cookie-session");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("./models/userModel");

var userRouter = require("./routes/user");
var postRouter = require("./routes/post");
var apiRouter = require("./routes/api");

const mongoDB = process.env.DATABASE_KEY;

mongoose.set("strictQuery", false);
mongoose.set("debug", true);

async function main() {
  await mongoose.connect(`${mongoDB}`);
}

main().catch((err) => console.log(err));

var app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.set("trust proxy", 1);
app.use(
  cookieSession({
    name: "session",
    keys: [`${process.env.SECRET_KEY}`],
    maxAge: 168 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  }),
);

app.use(
  cors({
    origin: `${process.env.FRONT_END}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

//Login Authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // Passwords match!
          return done(null, user);
        } else {
          // Passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      });
    } catch (e) {
      return done(e);
    }
  }),
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
