const Film = require("../models/Film");
const Genre = require("../models/Genre");
const Country = require("../models/Country");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const uploadFile = require("../config/uploadFile");

const FilmController = {
  // Show all Film
  showFilm: async (req, res) => {
    try {
      const data = await Film.find({});

      const element = await Promise.all(
        data.map(async (data) => {
          const film = await Film.findById(data._id)
            .populate("genre")
            .populate("country")
            .populate("category");
          return film;
        })
      );

      res.render("admin/Film/FilmManager", {
        element,
        layout: "adminLayout",
      });
    } catch (err) {
      console.log(err);
    }
  },

  getAddFilm: async (req, res) => {
    try {
      //get data
      const genre = await Genre.find();
      const country = await Country.find();
      const category = await Category.find();

      res.render("admin/Film/addFilm", {
        genre,
        country,
        category,
        layout: "adminLayout",
      });
    } catch (err) {
      console.log(err);
    }
  },

  // Add new Film
  newFilm: async (req, res) => {
    try {
      const {
        nameFilm,
        slug,
        nameEng,
        genre,
        country,
        category,
        describe,
        director,
        actor,
        YearFilm,
        duration,
        resolutions,
        subtitle,
        trailer,
        season,
        episode,
        linkPhim,
      } = req.body;
      const image = req.file.filename;
      //convert type String to ObjectId
      let genreId;
      let categoryId;
      let countryId = new ObjectId(country);

      if (Array.isArray(genre)) {
        genreId = genre.map((genre) => new ObjectId(genre));
      } else {
        genreId = new ObjectId(genre);
      }
      //category has many film
      const categoryArr = Category.find();
      if (Array.isArray(category)) {
        categoryId = category.map((category) => new ObjectId(category));
      } else {
        categoryId = new ObjectId(category);
      }

      let errors = [];

      if (
        !nameFilm ||
        !nameEng ||
        !genre ||
        !country ||
        !category ||
        !describe ||
        !director ||
        !actor ||
        !YearFilm ||
        !duration ||
        !resolutions ||
        !subtitle ||
        !trailer ||
        !linkPhim
      ) {
        errors.push({ message: "Please fill in all fields" });
      }

      var film = await Film.findOne({ nameFilm: nameFilm });
      if (film) {
        errors.push({ message: "Film already exists." });
      }

      if (errors.length > 0) {
        //get data
        const genre = await Genre.find();
        const country = await Country.find();
        const category = await Category.find();
        return res.render("admin/Film/addFilm", {
          genre,
          country,
          category,
          errors,
          layout: "adminLayout",
        });
      }

      //add to database
      const addNewFilm = new Film({
        nameFilm: nameFilm,
        slug: slug,
        nameEng: nameEng,
        genre: genreId,
        duration: duration,
        describe: describe,
        category: categoryId,
        director: director,
        actor: actor,
        country: countryId,
        YearFilm: YearFilm,
        image: image,
        resolutions: resolutions,
        subtitle: subtitle,
        trailer: trailer,
        season: season,
        episode: episode,
        linkPhim: linkPhim,
      });

      await addNewFilm.save().then((film) => {
        const filmId = new ObjectId(film._id);
        film.populate("category").then(() => {
          film.category.forEach((category) => {
            category.film.push(filmId);
            category.save();
          });
        });
        film.populate("genre").then(() => {
          film.genre.forEach((genre) => {
            genre.film.push(filmId);
            genre.save();
          });
        });
        film.populate("country").then(() => {
          const country = film.country;
          country.film.push(filmId);
          country.save();
        });
      });

      //flash message
      req.toastr.success("Thêm phim thành công");

      // chuyển về home
      res.redirect("/admin");
    } catch (err) {
      console.log(err);
    }
  },
  //get Data for edit
  getEditFilm: async (req, res) => {
    const id = req.params.id;
    try {
      const data = await Film.findById(id)
        .populate("genre")
        .populate("country")
        .populate("category");
      const genre = await Genre.find();
      const country = await Country.find();
      const category = await Category.find();

      const genreOther = genre.filter(function (itemA) {
        return !data.genre.some(function (itemB) {
          return itemA.id === itemB.id;
        });
      });

      const countryOther = country.filter(function (item) {
        return item._id !== data.country._id;
      });

      const categoryOther = category.filter(function (itemA) {
        return !data.category.some(function (itemB) {
          return itemA.id === itemB.id;
        });
      });

      if (!data) {
        return res.status(404).send("Film not found");
      }
      res.render("admin/Film/editFilm", {
        data,
        genreOther,
        countryOther,
        categoryOther,
        layout: "adminLayout",
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  // edit Film
  editFilm: async (req, res) => {
    try {
      const id = req.params.id;
      //delete film
      const film = await Film.findByIdAndDelete(id).then((film) => {
        //delete film of category
        film.category.forEach((categoryId) => {
          Category.findById(categoryId).then((category) => {
            category.film = category.film.filter(function (item) {
              return item.toString() !== film._id.toString();
            });
            category.save();
          });
        });
        //delete film of genre
        film.genre.forEach((genreId) => {
          Genre.findById(genreId).then((genre) => {
            genre.film = genre.film.filter(function (item) {
              return item.toString() !== film._id.toString();
            });
            genre.save();
          });
        });
        //delete film of country
        Country.findById(film.country).then((country) => {
          country.film = country.film.filter(function (item) {
            return item.toString() !== film._id.toString();
          });
          country.save();
        });
      });

      const {
        nameFilm,
        slug,
        nameEng,
        genre,
        country,
        category,
        describe,
        director,
        actor,
        YearFilm,
        duration,
        resolutions,
        subtitle,
        trailer,
        season,
        episode,
        linkPhim,
      } = req.body;
      const image = req.file.filename;
      //convert type String to ObjectId
      let genreId;
      let categoryId;
      let countryId = new ObjectId(country);

      if (Array.isArray(genre)) {
        genreId = genre.map((genre) => new ObjectId(genre));
      } else {
        genreId = new ObjectId(genre);
      }
      //category has many film
      const categoryArr = Category.find();
      if (Array.isArray(category)) {
        categoryId = category.map((category) => new ObjectId(category));
      } else {
        categoryId = new ObjectId(category);
      }

      let errors = [];

      if (
        !nameFilm ||
        !nameEng ||
        !genre ||
        !country ||
        !category ||
        !describe ||
        !director ||
        !actor ||
        !YearFilm ||
        !duration ||
        !resolutions ||
        !subtitle ||
        !trailer ||
        !linkPhim
      ) {
        errors.push({ message: "Please fill in all fields" });
      }

      var filmExist = await Film.findOne({ nameFilm: nameFilm });
      if (filmExist) {
        errors.push({ message: "Film already exists." });
      }

      if (errors.length > 0) {
        return res.render("admin/Film/addFilm", {
          errors,
          layout: "adminLayout",
        });
      }

      //add to database
      const addNewFilm = new Film({
        nameFilm: nameFilm,
        slug: slug,
        nameEng: nameEng,
        genre: genreId,
        duration: duration,
        describe: describe,
        category: categoryId,
        director: director,
        actor: actor,
        country: countryId,
        YearFilm: YearFilm,
        image: image,
        resolutions: resolutions,
        subtitle: subtitle,
        trailer: trailer,
        season: season,
        episode: episode,
        linkPhim: linkPhim,
      });

      await addNewFilm.save().then((film) => {
        const filmId = new ObjectId(film._id);
        film.populate("category").then(() => {
          film.category.forEach((category) => {
            category.film.push(filmId);
            category.save();
          });
        });
        film.populate("genre").then(() => {
          film.genre.forEach((genre) => {
            genre.film.push(filmId);
            genre.save();
          });
        });
        film.populate("country").then(() => {
          const country = film.country;
          country.film.push(filmId);
          country.save();
        });
      });

      //flash message
      req.toastr.success("Chỉnh sửa phim thành công");
      res.redirect("/admin");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //delete Film
  deleteFilm: async (req, res) => {
    const id = req.params.id;

    try {
      //delete film
      const film = await Film.findByIdAndDelete(id).then((film) => {
        //delete film of category
        film.category.forEach((categoryId) => {
          Category.findById(categoryId).then((category) => {
            category.film = category.film.filter(function (item) {
              return item.toString() !== film._id.toString();
            });
            category.save();
          });
        });
        //delete film of genre
        film.genre.forEach((genreId) => {
          Genre.findById(genreId).then((genre) => {
            genre.film = genre.film.filter(function (item) {
              return item.toString() !== film._id.toString();
            });
            genre.save();
          });
        });
        //delete film of country
        Country.findById(film.country).then((country) => {
          country.film = country.film.filter(function (item) {
            return item.toString() !== film._id.toString();
          });
          country.save();
        });
      });
      if (!film) {
        return res.redirect("/admin");
      }

      //flash message
      req.toastr.success("Xóa phim thành công");
      return res.redirect("/admin");
    } catch (err) {
      return res.redirect("/admin");
    }
  },
};

module.exports = FilmController;
