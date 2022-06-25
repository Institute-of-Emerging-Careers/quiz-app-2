// If the user is not authenticated, they are redirected to the login page
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.type == "admin") return next();
    else {
      req.logout();
      res.redirect("/admin/login");
    }
  } else {
    res.redirect("/admin/login");
  }
};

module.exports = checkAuthenticated;
