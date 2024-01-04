const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");

const authController = {
  registerUser: async (req, res) => {
    try {
      const { username, fullname, email, password, password2 } = req.body;
      let errors = [];

      //check required fields
      if (!username || !fullname || !email || !password || !password2) {
        errors.push({ message: "Please fill in all fields" });
      }

      //check paswords match
      if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
      }

      //check password length
      if (password.length < 6) {
        errors.push({ message: "Password must be at least 6 characters" });
      }

      if (errors.length > 0) {
        res.render("register", { errors, layout: false });
      }

      User.findOne({ email: email }).then((user) => {
        if (user) {
          //user exists
          errors.push({ message: "Email is adready registered" });
          res.render("register", { errors, layout: false });
        }
      });

      User.findOne({ username: username }).then((user) => {
        if (user) {
          //user exists
          errors.push({ message: "Username is adready registered" });
          res.render("register", { errors, layout: false });
        }
      });

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      // //create new user
      const newUser = new User({
        username: username,
        fullname: fullname,
        email: email,
        password: hashed,
      });

      await newUser.save();

      //flash message
      req.toastr.success("Đăng kí tài khoản thành công");
      res.redirect("/login");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = authController;
