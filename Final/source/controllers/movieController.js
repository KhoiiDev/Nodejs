const Category = require("../models/Category");
const Genre = require("../models/Genre");
const Country = require("../models/Country");
const Film = require("../models/Film");
const Comment = require("../models/Comment");
const { ObjectId } = require("mongodb");
const Episode = require("../models/Episode");
const Rating = require("../models/Rating");
const Bookmark = require("../models/Bookmark");

const movieController = {
  homePage: async (req, res) => {
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
  },

  category: async (req, res) => {
    try {
      const category = await Category.find();
      const genre = await Genre.find();
      const country = await Country.find();
      const page = req.query.page;
      const filmPerPage = 12;
      //film of category
      const categorySlug = await Category.findOne({
        slug: req.params.slug,
      }).populate({
        path: "film",
        options: {
          skip: (page - 1) * filmPerPage, // số bản ghi muốn bỏ qua
          limit: filmPerPage, // số bản ghi muốn lấy
        },
      });
      categorySlug.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const phimChieuRap = await Category.findOne({
        slug: "phim-chieu-rap",
      }).populate({
        path: "film",
        options: { limit: 10 },
      });

      phimChieuRap.film.sort((a, b) => b.createdAt - a.createdAt);

      const filmPage = await Category.findOne({
        slug: req.params.slug,
      }).populate("film");

      const totalFilm = filmPage.film.length;
      const url = req.url;

      res.render("movie/category", {
        category,
        genre,
        country,
        categorySlug,
        phimChieuRap,
        totalFilm,
        url,
        page,
        filmPerPage,
      });
    } catch (error) {
      console.log(error);
    }
  },

  genre: async (req, res) => {
    try {
      const category = await Category.find();
      const genre = await Genre.find();
      const country = await Country.find();

      const page = req.query.page;
      const filmPerPage = 12;
      const genreSlug = await Genre.findOne({ slug: req.params.slug }).populate(
        {
          path: "film",
          options: {
            skip: (page - 1) * filmPerPage, // số bản ghi muốn bỏ qua
            limit: filmPerPage, // số bản ghi muốn lấy
          },
        }
      );

      genreSlug.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const phimChieuRap = await Category.findOne({
        slug: "phim-chieu-rap",
      }).populate({
        path: "film",
        options: { limit: 10 },
      });

      phimChieuRap.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const filmPage = await Genre.findOne({
        slug: req.params.slug,
      }).populate("film");
      const totalFilm = filmPage.film.length;
      const url = req.url;

      res.render("movie/genre", {
        category,
        genre,
        country,
        genreSlug,
        phimChieuRap,
        filmPerPage,
        totalFilm,
        url,
        page,
      });
    } catch (error) {
      console.log(error);
    }
  },

  country: async (req, res) => {
    try {
      const category = await Category.find();
      const genre = await Genre.find();
      const country = await Country.find();

      const page = req.query.page;
      const filmPerPage = 12;
      const countrySlug = await Country.findOne({
        slug: req.params.slug,
      }).populate({
        path: "film",
        options: {
          skip: (page - 1) * filmPerPage, // số bản ghi muốn bỏ qua
          limit: filmPerPage, // số bản ghi muốn lấy
        },
      });

      countrySlug.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const phimChieuRap = await Category.findOne({
        slug: "phim-chieu-rap",
      }).populate({
        path: "film",
        options: { limit: 10 },
      });

      phimChieuRap.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const filmPage = await Country.findOne({
        slug: req.params.slug,
      }).populate("film");
      const totalFilm = filmPage.film.length;
      const url = req.url;

      res.render("movie/country", {
        category,
        genre,
        country,
        countrySlug,
        phimChieuRap,
        page,
        totalFilm,
        url,
        filmPerPage,
      });
    } catch (error) {
      console.log(error);
    }
  },

  detail: async (req, res) => {
    try {
      const category = await Category.find();
      const genre = await Genre.find();
      const country = await Country.find();
      const film = await Film.findOne({ slug: req.params.slug })
        .populate("category")
        .populate("genre")
        .populate("country");

      const user = req.user;

      const related = await Film.find({
        slug: { $ne: film.slug },
        genre: { $in: film.genre },
      });

      related.sort((a, b) => b.createdAt - a.createdAt); //sort

      // const rating = await Rating.find().populate("film");
      const ratingFilm = await Rating.find({ film: { $eq: film } }).populate(
        "film"
      );
      const total = ratingFilm.length;
      const scoreAverage = parseFloat(
        ratingFilm.reduce((acc, cur) => acc + cur.score, 0) / total
      ).toFixed(1);

      const phimChieuRap = await Category.findOne({
        slug: "phim-chieu-rap",
      }).populate({
        path: "film",
        options: { limit: 10 },
      });

      phimChieuRap.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      res.render("movie/detail", {
        category,
        genre,
        country,
        film,
        related,
        scoreAverage,
        total,
        phimChieuRap,
        user,
      });
    } catch (error) {
      console.log(error);
    }
  },

  watch: async (req, res) => {
    try {
      const category = await Category.find();
      const genre = await Genre.find();
      const country = await Country.find();
      const film = await Film.findOne({ slug: req.params.slug })
        .populate("category")
        .populate("genre")
        .populate("country");

      const comment = await Comment.find({ film: film }).sort({
        createdAt: "descending",
      }); ///

      const episode = await Episode.find({ film: { $eq: film } }).populate(
        "film"
      );

      const related = await Film.find({
        slug: { $ne: film.slug },
        genre: { $in: film.genre },
      });

      related.sort((a, b) => b.createdAt - a.createdAt); //sort

      film.viewCounts = film.viewCounts + 1;
      await film.save();

      const phimChieuRap = await Category.findOne({
        slug: "phim-chieu-rap",
      }).populate({
        path: "film",
        options: { limit: 10 },
      });

      phimChieuRap.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const user = req.user;

      res.render("movie/watch", {
        category,
        genre,
        country,
        film,
        comment,
        episode,
        related,
        user,
        phimChieuRap,
      });
    } catch (error) {
      console.log(error);
    }
  },

  episode: async (req, res) => {
    try {
      const category = await Category.find();
      const genre = await Genre.find();
      const country = await Country.find();

      const episodeFilm = await Episode.findOne({
        slug: req.params.slug,
      }).populate("film");
      const film = await Film.findOne({ slug: episodeFilm.film.slug })
        .populate("category")
        .populate("genre")
        .populate("country");
      const episode = await Episode.find({ film: { $eq: film } }).populate(
        "film"
      );
      const phimChieuRap = await Category.findOne({
        slug: "phim-chieu-rap",
      }).populate({
        path: "film",
        options: { limit: 10 },
      });

      phimChieuRap.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const related = await Film.find({
        slug: { $ne: episodeFilm.film.slug },
        genre: { $in: episodeFilm.film.genre },
      });

      related.sort((a, b) => b.createdAt - a.createdAt); //sort

      res.render("movie/episode", {
        category,
        genre,
        country,
        episode,
        episodeFilm,
        phimChieuRap,
        related,
      });
    } catch (error) {
      console.log(error);
    }
  },

  year: async (req, res) => {
    try {
      const category = await Category.find();
      const genre = await Genre.find();
      const country = await Country.find();

      const page = req.query.page;
      const filmPerPage = 12;
      const year = req.params.slug;
      const film = await Film.find({ YearFilm: year })
        .skip((page - 1) * filmPerPage)
        .limit(filmPerPage); // số bản ghi muốn lấy;

      film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const phimChieuRap = await Category.findOne({
        slug: "phim-chieu-rap",
      }).populate({
        path: "film",
        options: { limit: 10 },
      });

      phimChieuRap.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const filmPage = await Film.find({ YearFilm: year });
      const totalFilm = filmPage.length;
      const url = req.url;

      res.render("movie/yearFilm", {
        category,
        genre,
        country,
        film,
        year,
        phimChieuRap,
        page,
        filmPerPage,
        totalFilm,
        url,
      });
    } catch (error) {
      console.log(error);
    }
  },

  search: async (req, res) => {
    try {
      const category = await Category.find();
      const genre = await Genre.find();
      const country = await Country.find();

      const page = req.query.page;
      const filmPerPage = 12;

      const s = toLowerCaseNonAccentVietnamese(req.query.s); //từ khóa tìm kiếm

      let regex;
      if (/\s/.test(s)) {
        regex = new RegExp(s.split(" ").join("|"), "i");
      } else {
        regex = new RegExp(s, "i");
      }

      const film = await Film.find({ slug: regex })
        .skip((page - 1) * filmPerPage)
        .limit(filmPerPage);

      film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const phimChieuRap = await Category.findOne({
        slug: "phim-chieu-rap",
      }).populate({
        path: "film",
        options: { limit: 10 },
      });

      phimChieuRap.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const filmPage = await Film.find({ slug: regex });
      const totalFilm = filmPage.length;
      const url = req.url;

      res.render("movie/search", {
        category,
        genre,
        country,
        film,
        s,
        phimChieuRap,
        page,
        filmPerPage,
        totalFilm,
        url,
      });
    } catch (error) {
      console.log(error);
    }
  },

  filter: async (req, res) => {
    try {
      const category = await Category.find();
      const genre = await Genre.find();
      const country = await Country.find();

      const page = req.query.page;
      const filmPerPage = 12;
      const url = req.url;

      const { cate, coun, year, gen } = req.query; //từ khóa tìm kiếm
      let film;
      let filmPage;
      let totalFilm;

      if (cate == "cate" && coun == "coun" && year == "year" && gen == "gen") {
        film = await Film.find({})
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);
        filmPage = await Film.find();
        totalFilm = filmPage.length;
      } else if (coun == "coun" && year == "year" && gen == "gen") {
        const Cate = await Category.findById(cate);
        film = await Film.find({
          category: { $in: [Cate] },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          category: { $in: [Cate] },
        });
        totalFilm = filmPage.length;
      } else if (cate == "cate" && year == "year" && gen == "gen") {
        const Coun = await Country.findById(coun);
        film = await Film.find({
          country: Coun,
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          country: Coun,
        });
        totalFilm = filmPage.length;
      } else if (cate == "cate" && coun == "coun" && gen == "gen") {
        film = await Film.find({
          YearFilm: { $eq: Number(year) },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          YearFilm: { $eq: Number(year) },
        });
        totalFilm = filmPage.length;
      } else if (cate == "cate" && coun == "coun" && year == "year") {
        const Gen = await Genre.findById(gen);
        film = await Film.find({
          genre: { $in: [Gen] },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          genre: { $in: [Gen] },
        });
        totalFilm = filmPage.length;
      } else if (cate == "cate" && coun == "coun") {
        const Gen = await Genre.findById(gen);
        film = await Film.find({
          genre: { $in: [Gen] },
          YearFilm: { $eq: Number(year) },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          genre: { $in: [Gen] },
          YearFilm: { $eq: Number(year) },
        });
        totalFilm = filmPage.length;
      } else if (cate == "cate" && year == "year") {
        const Coun = await Country.findById(coun);
        const Gen = await Genre.findById(gen);
        film = await Film.find({
          genre: { $in: [Gen] },
          country: Coun,
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          genre: { $in: [Gen] },
          country: Coun,
        });
        totalFilm = filmPage.length;
      } else if (cate == "cate" && gen == "gen") {
        const Coun = await Country.findById(coun);
        film = await Film.find({
          country: Coun,
          YearFilm: { $eq: Number(year) },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          country: Coun,
          YearFilm: { $eq: Number(year) },
        });
        totalFilm = filmPage.length;
      } else if (coun == "coun" && year == "year") {
        const Cate = await Category.findById(cate);
        const Gen = await Genre.findById(gen);
        film = await Film.find({
          category: { $in: [Cate] },
          genre: { $in: [Gen] },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          category: { $in: [Cate] },
          genre: { $in: [Gen] },
        });
        totalFilm = filmPage.length;
      } else if (coun == "coun" && gen == "gen") {
        const Cate = await Category.findById(cate);
        film = await Film.find({
          category: { $in: [Cate] },
          YearFilm: { $eq: Number(year) },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          category: { $in: [Cate] },
          YearFilm: { $eq: Number(year) },
        });
        totalFilm = filmPage.length;
      } else if (year == "year" && gen == "gen") {
        const Cate = await Category.findById(cate);
        const Coun = await Country.findById(coun);
        film = await Film.find({
          category: { $in: [Cate] },
          country: Coun,
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          category: { $in: [Cate] },
          country: Coun,
        });
        totalFilm = filmPage.length;
      } else if (cate == "cate") {
        const Coun = await Country.findById(coun);
        const Gen = await Genre.findById(gen);
        film = await Film.find({
          country: Coun,
          genre: { $in: [Gen] },
          YearFilm: { $eq: Number(year) },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          country: Coun,
          genre: { $in: [Gen] },
          YearFilm: { $eq: Number(year) },
        });
        totalFilm = filmPage.length;
      } else if (coun == "coun") {
        const Cate = await Category.findById(cate);
        const Gen = await Genre.findById(gen);
        film = await Film.find({
          category: { $in: [Cate] },
          YearFilm: { $eq: Number(year) },
          genre: { $in: [Gen] },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          category: { $in: [Cate] },
          YearFilm: { $eq: Number(year) },
          genre: { $in: [Gen] },
        });
        totalFilm = filmPage.length;
      } else if (gen == "gen") {
        const Cate = await Category.findById(cate);
        const Coun = await Country.findById(coun);
        film = await Film.find({
          category: { $in: [Cate] },
          country: Coun,
          YearFilm: { $eq: Number(year) },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          category: { $in: [Cate] },
          country: Coun,
          YearFilm: { $eq: Number(year) },
        });
        totalFilm = filmPage.length;
      } else if (year == "year") {
        const Cate = await Category.findById(cate);
        const Coun = await Country.findById(coun);
        const Gen = await Genre.findById(gen);

        film = await Film.find({
          category: { $in: [Cate] },
          country: Coun,
          genre: { $in: [Gen] },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          category: { $in: [Cate] },
          country: Coun,
          genre: { $in: [Gen] },
        });
        totalFilm = filmPage.length;
      } else {
        const Cate = await Category.findById(cate);
        const Coun = await Country.findById(coun);
        const Gen = await Genre.findById(gen);
        film = await Film.find({
          category: { $in: [Cate] },
          country: Coun,
          genre: { $in: [Gen] },
          YearFilm: { $eq: Number(year) },
        })
          .skip((page - 1) * filmPerPage)
          .limit(filmPerPage);

        filmPage = await Film.find({
          category: { $in: [Cate] },
          country: Coun,
          genre: { $in: [Gen] },
          YearFilm: { $eq: Number(year) },
        });
        totalFilm = filmPage.length;
      }
      film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const phimChieuRap = await Category.findOne({
        slug: "phim-chieu-rap",
      }).populate({
        path: "film",
        options: { limit: 10 },
      });
      phimChieuRap.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      res.render("movie/filter", {
        category,
        genre,
        country,
        film,
        phimChieuRap,
        page,
        url,
        filmPerPage,
        totalFilm,
      });
    } catch (e) {
      console.log(e);
    }
  },

  // Add new Comment
  addComment: async (req, res) => {
    try {
      const { contentuser, nameuser, emailuser, filmId } = req.body;

      //convert type String to ObjectId
      let film = new ObjectId(filmId);

      let errors = [];

      if (!contentuser || !nameuser || !emailuser || !film) {
        errors.push({ message: "Please fill in all fields" });
      }

      //add to database
      const addNewComment = new Comment({
        Content: contentuser,
        Name: nameuser,
        Email: emailuser,
        film: film,
      });

      var findFilm = await Film.findById(film.toString());

      await addNewComment.save();

      // //flash message
      req.toastr.success("Thêm comment thành công");

      // chuyển về home
      res.redirect("/movie/watch/" + findFilm.slug);
    } catch (err) {
      console.log(err);
    }
  },
  rating: async (req, res) => {
    try {
      const { film, score } = req.body;

      // Tạo đánh giá mới trong bảng rating
      const ratingDoc = new Rating({
        film: film,
        score: score,
      });

      await ratingDoc.save();
      const filmSlug = await Film.findById(film);

      res.redirect("/movie/detail/" + filmSlug.slug);
    } catch (error) {
      console.log(error);
    }
  },
  // Add new Bookmark
  addBookMark: async (req, res) => {
    try {
      const { filmID, userID } = req.body;

      //convert type String to ObjectId
      let film = new ObjectId(filmID);
      let user = new ObjectId(userID);

      let errors = [];

      if (!film || !user) {
        errors.push({ message: "Please fill in all fields" });
      }

      // Check if bookmark already exists for user
      let bookmark = await Bookmark.findOne({ user: user });

      if (bookmark) {
        // If bookmark exists, add new film to the array and update bookmark
        bookmark.film.push(film);
        await bookmark.save();
      } else {
        // If bookmark does not exist, create new bookmark
        bookmark = new Bookmark({
          user: user,
          film: [film],
        });
        await bookmark.save();
      }

      //flash message
      req.toastr.success("Thêm bookmark thành công");

      // chuyển về đến trang bookmark
      res.redirect("/movie/bookmark/" + userID);
    } catch (err) {
      console.log(err);
    }
  },
  deleteFilm: async (req, res) => {
    const user = req.user;
    const filmID = req.body.filmID;

    try {
      // Tìm bookmark của user hiện tại
      const bookmark = await Bookmark.findOne({ user: user._id });

      if (!bookmark) {
        // Nếu không tìm thấy bookmark của user hiện tại, trả về lỗi
        req.toastr.error("Bookmark không tồn tại");
        return res.redirect("/");
      }

      // Xóa phim có id tương ứng khỏi mảng phim của bookmark
      bookmark.film.pull(filmID); // Sử dụng phương thức $pull để xóa phần tử khỏi mảng phim
      await bookmark.save(); // Lưu lại thay đổi

      // Trả về thông báo thành công và chuyển hướng về trang danh sách bookmark của user
      req.toastr.success("Xóa phim yêu thích thành công");
      return res.redirect(`/movie/bookmark/${user._id}`);
    } catch (err) {
      // Nếu có lỗi xảy ra, trả về trang chủ
      return res.redirect("/");
    }
  },
  // Get bookmark by user ID
  getBookmark: async (req, res) => {
    try {
      const category = await Category.find();
      const genre = await Genre.find();
      const country = await Country.find();

      const page = req.query.page;
      const filmPerPage = 12;

      const bookmark = await Bookmark.findOne({
        user: req.params.userID,
      }).populate({
        path: "film",
        options: {
          skip: (page - 1) * filmPerPage, // số bản ghi muốn bỏ qua
          limit: filmPerPage, // số bản ghi muốn lấy
        },
      });

      bookmark.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const phimChieuRap = await Category.findOne({
        slug: "phim-chieu-rap",
      }).populate({
        path: "film",
        options: { limit: 10 },
      });

      phimChieuRap.film.sort((a, b) => b.createdAt - a.createdAt); //sort

      const filmPage = await Bookmark.findOne({
        user: req.params.userID,
      }).populate("film");

      const totalFilm = filmPage.film.length;
      const url = req.url;

      res.render("movie/bookmark", {
        category,
        genre,
        country,
        bookmark,
        phimChieuRap,
        totalFilm,
        url,
        page,
        filmPerPage,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getPage: async (req, res) => {
    res.send(req.url.split("/"));
  },
};

function toLowerCaseNonAccentVietnamese(str) {
  str = str.toLowerCase();
  //     We can also use this instead of from line 11 to line 17
  //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
  //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
  //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
  //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
  //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
  //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
  //     str = str.replace(/\u0111/g, "d");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}

module.exports = movieController;
