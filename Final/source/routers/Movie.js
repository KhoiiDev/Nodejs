const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../config/auth");
const movieController = require("../controllers/movieController");
const moment = require("moment");

router.get("/", movieController.homePage);

router.get("/category/:slug", movieController.category);

router.get("/genre/:slug", movieController.genre);

router.get("/country/:slug", movieController.country);

router.get("/detail/:slug", movieController.detail);

router.get("/watch/:slug", movieController.watch);

router.get("/episode/:slug", movieController.episode);

router.get("/year/:slug", movieController.year);

router.get("/search", movieController.search);

router.get("/filter", movieController.filter);

router.post("/comment", isAuth, movieController.addComment); // thêm comments

router.get("/bookmark/:userID", isAuth, movieController.getBookmark);

router.post("/bookmark", isAuth, movieController.addBookMark); // thêm BookMark

router.post("/deletefilmbookmark", isAuth, movieController.deleteFilm); // xóa BookMark

router.post("/rating", isAuth, movieController.rating);

//get page
router.get("/*/*/page/:number", movieController.getPage);

module.exports = router;
