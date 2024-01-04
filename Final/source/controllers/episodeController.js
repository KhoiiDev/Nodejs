const Episode = require("../models/Episode");
const Film = require("../models/Film");
const Category = require("../models/Category");

const episodeController = {
  // Show all Episode
  showEpisode: async (req, res) => {
    try {
      const data = await Episode.find({}).populate("film");
      res.render("admin/Episode/EpisodeManager", {
        data,
        layout: "adminLayout",
      });
    } catch (err) {
      console.log(err);
    }
  },

  getAddEpisode: async (req, res) => {
    const categoryEpisode = await Category.find({ slug: "phim-bo" });
    const filmEpisode = await Film.find({
      category: { $in: categoryEpisode },
    })
      .populate("category")
      .sort({ createdAt: "descending" });

    res.render("admin/Episode/addEpisode", {
      layout: "adminLayout",
      filmEpisode,
    });
  },

  // Add new Episode
  newEpisode: async (req, res) => {
    try {
      const { nameEpisode, slug, film, linkPhim, episode } = req.body;
      const categoryEpisode = await Category.find({ slug: "phim-bo" });
      const filmEpisode = await Film.find({
        category: { $in: categoryEpisode },
      })
        .populate("category")
        .sort({ createdAt: "descending" });

      let errors = [];
      if (!nameEpisode || !film || !linkPhim || !episode) {
        errors.push({ mesage: "Please fill all fields" });
      }
      if (errors.length > 0) {
        return res.render("admin/Episode/addEpisode", {
          errors,
          filmEpisode,
          layout: "adminLayout",
        });
      }

      Episode.findOne({
        nameEpisode: nameEpisode,
        slug: slug,
        film: film,
        linkPhim: linkPhim,
        episode: episode,
      }).then((episode) => {
        if (episode) {
          errors.push({ message: "Episode already exists" });
          res.render("admin/Episode/addEpisode", {
            errors,
            filmEpisode,
            layout: "adminLayout",
          });
        }
      });

      // add to database
      const newEpisode = new Episode({
        nameEpisode: nameEpisode,
        slug: slug,
        film: film,
        linkPhim: linkPhim,
        episode: episode,
      });
      await newEpisode.save();

      //flash message
      req.toastr.success("Thêm tập phim thành công");
      //redirect home
      res.redirect("/admin/Episode");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //get Data for edit
  getEditEpisode: async (req, res) => {
    const id = req.params.id;
    const categoryEpisode = await Category.find({ slug: "phim-bo" });
    const filmEpisode = await Film.find({
      category: { $in: categoryEpisode },
    })
      .populate("category")
      .sort({ createdAt: "descending" });

    try {
      const data = await Episode.findById(id);
      if (!data) {
        return res.status(404).send("Episode not found");
      }
      res.render("admin/Episode/editEpisode", {
        filmEpisode,
        data,
        layout: "adminLayout",
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  // edit Episode
  editEpisode: async (req, res) => {
    const id = req.params.id;
    const { nameEpisode, slug, film, linkPhim, episode } = req.body;
    const categoryEpisode = await Category.find({ slug: "phim-bo" });
    const filmEpisode = await Film.find({
      category: { $in: categoryEpisode },
    });

    try {
      let errors = [];

      if (!nameEpisode || !film || !linkPhim || !episode) {
        errors.push({ message: "Please fill in all fields." });
      }

      if (errors.length > 0) {
        res.render("admin/Episode/addEpisode", {
          errors,
          filmEpisode,
          layout: "adminLayout",
        });
      }

      Episode.findOne({
        nameEpisode: nameEpisode,
        slug: slug,
        film: film,
        linkPhim: linkPhim,
        episode: episode,
      }).then((episode) => {
        if (episode) {
          errors.push({ message: "Episode already exists" });
          res.render("admin/Episode/addEpisode", {
            errors,
            filmEpisode,
            layout: "adminLayout",
          });
        }
      });
      const episodeData = await Episode.findByIdAndUpdate(
        id,
        {
          nameEpisode: nameEpisode,
          slug: slug,
          film: film,
          linkPhim: linkPhim,
          episode: episode,
        },
        { new: true }
      );
      if (!episodeData) {
        return res.status(404).send("Episode not found");
      }

      //flash message
      req.toastr.success("Chỉnh sửa tập phim thành công");
      res.redirect("/admin/Episode");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //delete Episode
  deleteEpisode: async (req, res) => {
    const id = req.params.id;

    try {
      const episode = await Episode.findByIdAndDelete(id);
      if (!episode) {
        return res.redirect("/admin/Episode");
      }

      //flash message
      req.toastr.success("Xóa tập phim thành công");
      return res.redirect("/admin/Episode");
    } catch (err) {
      return res.redirect("/admin/Episode");
    }
  },
};

module.exports = episodeController;
