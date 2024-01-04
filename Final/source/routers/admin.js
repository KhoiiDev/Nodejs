const express = require("express");
const router = express.Router();
const uploadFile = require("../config/uploadFile");

//controllers
const countryController = require("../controllers/countryController");
const categoryController = require("../controllers/categoryController");
const episodeController = require("../controllers/episodeController");
const genreController = require("../controllers/genreController");
const filmController = require("../controllers/FilmController");
const userController = require("../controllers/userController");
const commentController = require("../controllers/commentController");

const upload = require("../config/uploadFile");

//middleware authenticate
// const isAdmin = require("../config/auth");

/////////////////////// Quản lý quốc gia///////////////////////
router.get("/country", countryController.showCountry);

// Thêm quốc gia
router.get("/addCountry", (req, res) => {
  res.render("admin/Country/addCountry", { layout: "adminLayout" });
});
router.post("/addCountry", countryController.newCountry);

//Sửa quốc gia
router.get("/editCountry/:id", countryController.getEditCountry);
router.post("/editCountry/:id", countryController.editCountry);

//Xóa quốc gia
router.post("/deleteCountry/:id", countryController.deleteCountry);

/////////////////////// Quản lý danh mục///////////////////////
router.get("/category", categoryController.showCategory);

// Thêm danh mục
router.get("/addCategory", (req, res) => {
  res.render("admin/Category/addCategory", { layout: "adminLayout" });
});
router.post("/addCategory", categoryController.newCategory);

//Sửa danh mục
router.get("/editCategory/:id", categoryController.getEditCategory);
router.post("/editCategory/:id", categoryController.editCategory);

//Xóa tập
router.post("/deleteCategory/:id", categoryController.deleteCategory);

///////////////////////// Quản lý tập phim ///////////////////////
router.get("/episode", episodeController.showEpisode);

// Thêm tập
router.get("/addEpisode", episodeController.getAddEpisode);
router.post("/addEpisode", episodeController.newEpisode);

//Sửa tập
router.get("/editEpisode/:id", episodeController.getEditEpisode);
router.post("/editEpisode/:id", episodeController.editEpisode);

//Xóa tập
router.post("/deleteEpisode/:id", episodeController.deleteEpisode);

/////////////////////// Quản lý thể loại ///////////////////////
// Show thể loại phim
router.get("/Genre", genreController.showGenre);

// Thêm thể loại
router.get("/addGenre", (req, res) => {
  res.render("admin/Genre/addGenre", { layout: "adminLayout" });
});
router.post("/addGenre", genreController.newGenre);

//Sửa thể loại
router.get("/editGenre/:id", genreController.getEditGenre);
router.post("/editGenre/:id", genreController.editGenre);

//Xóa thể loại
router.post("/deleteGenre/:id", genreController.deleteGenre);

/////////////////////// Quản lý phim ////////////////////////

// Show list film
router.get("/", filmController.showFilm);

// Thêm phim
router.get("/addFilm", filmController.getAddFilm);
router.post("/addFilm", upload.single("image"), filmController.newFilm);

//Sửa phim
router.get("/editFilm/:id", filmController.getEditFilm);
router.post("/editFilm/:id", upload.single("image"), filmController.editFilm);

//Xóa phim
router.post("/deleteFilm/:id", filmController.deleteFilm);

/////////////////////// Quản lý User ////////////////////////

// Show list User
router.get("/user", userController.showUser);

// Cập nhật lại trạng thái admin
router.post("/updateAdminStatus", userController.updateAdmin);

//Xóa User
router.post("/deleteUser/:id", userController.deleteUser);

/////////////////////// Quản lý Bình Luận ////////////////////////

// Show list comment
router.get("/comment", commentController.showComment);

//Xóa comment
router.post("/deleteComment/:id", commentController.deleteComment);

module.exports = router;
