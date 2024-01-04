const User = require("../models/User");

const userController = {

    // Show all User
    showUser: async (req, res) => {
        try {
            const data = await User.find({});
            res.render("admin/User/UserManager", {
                data,
                layout: "adminLayout",
            });
        } catch (err) {
            console.log(err);
        }
    },

    // update active admin
    updateAdmin: async (req, res) => {
        try {
            const id = req.body.adminId;
            const adminStatus = req.body.adminStatus;
            const updatedAdmin = await User.findByIdAndUpdate(id, { admin: adminStatus }, { new: true });
            res.send(updatedAdmin);
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    },

    //delete User
    deleteUser: async (req, res) => {
        const id = req.params.id;

        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return res.redirect("/admin/user");
            }

            //flash message
            req.toastr.success("Xóa user thành công");
            return res.redirect("/admin/user");
        } catch (err) {
            return res.redirect("/admin/user");
        }
    },
}
module.exports = userController;
