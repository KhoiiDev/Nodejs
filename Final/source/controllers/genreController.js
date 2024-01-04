const Genre = require("../models/Genre");

const genreController = {
  // Show all Genre
  showGenre: async (req, res) => {
    try {
      const data = await Genre.find({});
      res.render("admin/Genre/GenreManager", {
        data,
        layout: "adminLayout",
      });
    } catch (err) {
      console.log(err);
    }
  },

  // Add new Genre
  newGenre: async (req, res) => {
    try {
      const { nameGenre, slug } = req.body;
      let errors = [];

      if (!nameGenre || !slug) {
        errors.push({ message: "Please fill in all fields." });
      }

      if (errors.length > 0) {
        return res.render("admin/Genre/addGenre", {
          errors,
          layout: "adminLayout",
        });
      }

      Genre.findOne({ nameGenre: nameGenre }).then((genre) => {
        if (genre) {
          errors.push({ message: "Genre already exists" });
          return res.render("admin/Genre/addGenre", {
            errors,
            layout: "adminLayout",
          });
        }
      });

      // add to database
      const newGenre = new Genre({ nameGenre: nameGenre, slug: slug });
      newGenre
        .save()
        .then(() => {
          //flash message
          req.toastr.success("Thêm thể loại thành công");
          //redirect home
          res.redirect("/admin/genre");
        })
        .catch((error) => {});
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //get Data for edit
  getEditGenre: async (req, res) => {
    const id = req.params.id;
    try {
      const data = await Genre.findById(id);
      if (!data) {
        return res.status(404).send("Genre not found");
      }
      res.render("admin/Genre/editGenre", { data, layout: "adminLayout" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  // edit Genre
  editGenre: async (req, res) => {
    const id = req.params.id;
    const { nameGenre, slug } = req.body;

    try {
      let errors = [];

      if (!nameGenre) {
        errors.push({ message: "Please fill in all fields." });
      }

      if (errors.length > 0) {
        return res.render("admin/Genre/addGenre", {
          errors,
          layout: "adminLayout",
        });
      }

      Genre.findOne({ nameGenre: nameGenre }).then((genre) => {
        if (genre) {
          errors.push({ message: "Genre already exists" });
          return res.render("admin/Genre/addGenre", {
            errors,
            layout: "adminLayout",
          });
        }
      });
      const genre = await Genre.findByIdAndUpdate(
        id,
        { nameGenre: nameGenre, slug: slug },
        { new: true }
      );
      if (!genre) {
        return res.status(404).send("Genre not found");
      }

      //flash message
      req.toastr.success("Chỉnh sửa thể loại thành công");
      res.redirect("/admin/genre");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //delete Genre
  deleteGenre: async (req, res) => {
    const id = req.params.id;

    try {
      const genre = await Genre.findByIdAndDelete(id);
      if (!genre) {
        return res.redirect("/admin");
      }

      //flash message
      req.toastr.success("Xóa thể loại thành công");
      return res.redirect("/admin/genre");
    } catch (err) {
      return res.redirect("/admin");
    }
  },
};

module.exports = genreController;
