const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

//load User model
const User = require("../models/User");

const customFields = {
  usernameField: "username",
  passportField: "password",
};

const verifyCallback = (username, password, done) => {
  //Match User
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return done(null, false, {
          message: "Username or Password incorrect",
        });
      }
      //Match password

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "Username or Password incorrect",
          });
        }
      });
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((userid, done) => {
  User.findById(userid)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});
