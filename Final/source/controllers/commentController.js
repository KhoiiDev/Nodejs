const Comment = require("../models/Comment");
const Film = require('../models/Film'); // import model Film

const commentController = {

    // Show all User
    showComment: async (req, res) => {
        try {
            const data = await Comment.find(); // Lấy dữ liệu từ cơ sở dữ liệu

            const newData = await Promise.all(data.map(async item => {
                // Truy xuất đối tượng film từ ObjectId của item.film
                const film = await Film.findById(item.film);
                // Tạo một đối tượng mới với thuộc tính film là nameFilm của đối tượng film
                return {
                  ...item.toObject(),
                  film: film ? film.nameFilm : null,
                };
              }));




            res.render("admin/Comment/CommentManager", {
                newData,
                layout: "adminLayout",
            });
        } catch (err) {
            console.log(err);
        }
    },

    //delete Comment
    deleteComment: async (req, res) => {
        const id = req.params.id;

        try {
            const comment = await Comment.findByIdAndDelete(id);
            if (!comment) {
                return res.redirect("/admin/comment");
            }

            //flash message
            req.toastr.success("Xóa comment thành công");
            return res.redirect("/admin/comment");
        } catch (err) {
            return res.redirect("/admin/comment");
        }
    },
}
module.exports = commentController;
