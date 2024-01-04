const Country = require("../models/Country");

const countryController = {
  // Show all Country
  showCountry: async (req, res) => {
    try {
      const data = await Country.find({});
      res.render("admin/Country/CountryManager", {
        data,
        layout: "adminLayout",
      });
    } catch (err) {
      console.log(err);
    }
  },

  // Add new Country
  newCountry: async (req, res) => {
    try {
      const { nameCountry, slug } = req.body;
      let errors = [];

      if (!nameCountry) {
        errors.push({ message: "Please fill in all fields." });
      }

      if (errors.length > 0) {
        return res.render("admin/Country/addCountry", {
          errors,
          layout: "adminLayout",
        });
      }

      Country.findOne({ nameCountry: nameCountry }).then((country) => {
        if (country) {
          errors.push({ message: "Country already exists" });
          return res.render("admin/Country/addCountry", {
            errors,
            layout: "adminLayout",
          });
        }
      });

      // add to database
      const newCountry = new Country({ nameCountry: nameCountry, slug: slug });
      newCountry.save();

      //flash message
      req.toastr.success("Thêm quốc gia thành công");
      //redirect home
      res.redirect("/admin/country");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //get Data for edit
  getEditCountry: async (req, res) => {
    const id = req.params.id;
    try {
      const data = await Country.findById(id);
      if (!data) {
        return res.status(404).send("Country not found");
      }
      res.render("admin/Country/editCountry", { data, layout: "adminLayout" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  // edit Country
  editCountry: async (req, res) => {
    const id = req.params.id;
    const { nameCountry, slug } = req.body;

    try {
      let errors = [];

      if (!nameCountry) {
        errors.push({ message: "Please fill in all fields." });
      }

      if (errors.length > 0) {
        return res.render("admin/Country/addCountry", {
          errors,
          layout: "adminLayout",
        });
      }

      Country.findOne({ nameCountry: nameCountry }).then((country) => {
        if (country) {
          errors.push({ message: "Country already exists" });
          return res.render("admin/Country/addCountry", {
            errors,
            layout: "adminLayout",
          });
        }
      });
      const country = await Country.findByIdAndUpdate(
        id,
        { nameCountry: nameCountry, slug: slug },
        { new: true }
      );
      if (!country) {
        return res.status(404).send("Country not found");
      }

      //flash message
      req.toastr.success("Chỉnh sửa quốc gia thành công");
      res.redirect("/admin/country");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //delete Country
  deleteCountry: async (req, res) => {
    const id = req.params.id;

    try {
      const country = await Country.findByIdAndDelete(id);
      if (!country) {
        return res.redirect("/admin");
      }

      //flash message
      req.toastr.success("Xóa quốc gia thành công");
      return res.redirect("/admin/country");
    } catch (err) {
      return res.redirect("/admin");
    }
  },
};

module.exports = countryController;
