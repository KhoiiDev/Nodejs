const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
};

//check user login or not and user is admin
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    return next();
  }

  res.redirect("/login");
};

module.exports = {
  isAuth,
  isAdmin,
};
