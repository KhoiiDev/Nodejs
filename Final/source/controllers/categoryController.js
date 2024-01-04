const Category = require("../models/Category");

const categoryController = {
  // Show all Category
  showCategory: async (req, res) => {
    try {
      const data = await Category.find({});
      res.render("admin/Category/CategoryManager", {
        data,
        layout: "adminLayout",
      });
    } catch (err) {
      console.log(err);
    }
  },

  // Add new Category
  newCategory: async (req, res) => {
    try {
      const { nameCategory, description, slug } = req.body;
      let errors = [];

      if (!nameCategory || !description) {
        errors.push({ message: "Please fill in all fields." });
      }

      if (errors.length > 0) {
        return res.render("admin/Category/addCategory", {
          errors,
          layout: "adminLayout",
        });
      }

      Category.findOne({ nameCategory: nameCategory }).then((category) => {
        if (category) {
          errors.push({ message: "Category already exists" });
          return res.render("admin/Category/addCategory", {
            errors,
            layout: "adminLayout",
          });
        }
      });

      // add to database
      const newCategory = new Category({
        nameCategory: nameCategory,
        description: description,
        slug: slug,
      });
      await newCategory.save();

      //flash message
      req.toastr.success("Thêm danh mục thành công");
      //redirect home
      res.redirect("/admin/category");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //get Data for edit
  getEditCategory: async (req, res) => {
    const id = req.params.id;
    try {
      const data = await Category.findById(id);
      if (!data) {
        return res.status(404).send("Category not found");
      }
      res.render("admin/Category/editCategory", {
        data,
        layout: "adminLayout",
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  // edit Category
  editCategory: async (req, res) => {
    const id = req.params.id;
    const { nameCategory, description, slug } = req.body;

    try {
      let errors = [];

      if (!nameCategory || !description) {
        errors.push({ message: "Please fill in all fields." });
      }

      if (errors.length > 0) {
        res.render("admin/Category/addCategory", {
          errors,
          layout: "adminLayout",
        });
      }

      Category.findOne({ nameCategory: nameCategory }).then((category) => {
        if (category) {
          errors.push({ message: "Category already exists" });
          res.render("admin/Category/addCategory", {
            errors,
            layout: "adminLayout",
          });
        }
      });
      const category = await Category.findByIdAndUpdate(
        id,
        { nameCategory: nameCategory, description: description, slug: slug },
        { new: true }
      );
      if (!category) {
        return res.status(404).send("Category not found");
      }

      //flash message
      req.toastr.success("Chỉnh sửa danh mục thành công");
      res.redirect("/admin/category");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //delete Category
  deleteCategory: async (req, res) => {
    const id = req.params.id;

    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.redirect("/admin/category");
      }

      //flash message
      req.toastr.success("Xóa danh mục thành công");
      return res.redirect("/admin/category");
    } catch (err) {
      return res.redirect("/admin/category");
    }
  },
};

module.exports = categoryController;
