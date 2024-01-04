const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const passport = require("passport");
const { isAuth, isAdmin } = require("../config/auth");

const Category = require("../models/Category");
const Genre = require("../models/Genre");
const Country = require("../models/Country");
const Film = require("../models/Film");

router.get("/", async (req, res) => {
  try {
    const category = await Category.find({
      slug: { $ne: "phim-hot" },
    }).populate({
      path: "film",
      options: { limit: 16 },
    });
    const genre = await Genre.find();
    const country = await Country.find();
    const film = await Film.find();
    const phimHot = await Category.findOne({ slug: "phim-hot" }).populate(
      "film"
    );
    phimHot.film.sort((a, b) => b.createdAt - a.createdAt); //sort

    category.forEach((category) => {
      category.film.sort((a, b) => b.createdAt - a.createdAt); //sort
    });

    const phimChieuRap = await Category.findOne({
      slug: "phim-chieu-rap",
    }).populate({
      path: "film",
      options: { limit: 10 },
    });

    phimChieuRap.film.sort((a, b) => b.createdAt - a.createdAt); //sort

    res.render("movie/home", {
      category,
      genre,
      country,
      phimHot,
      phimChieuRap,
    });
  } catch (error) {
    console.log(error);
  }
});

//Register
router.get("/register", (req, res) => {
  res.render("register", { layout: false });
});

router.post("/register", authController.registerUser);

//Login
router.get("/login", (req, res, next) => {
  res.render("login", { layout: false, message: req.flash("error") });
});
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/movie",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      req.toastr.error(info.message);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.toastr.success("Đăng nhập thành công");
      return res.redirect("/movie");
    });
  })(req, res, next);
});

//Logout
router.get("/logout", isAuth, (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
