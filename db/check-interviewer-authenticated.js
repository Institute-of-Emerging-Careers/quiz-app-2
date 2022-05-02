// If the user is not authenticated, they are redirected to the login page
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (
      req.user.type == "interviewer" &&
      req.user.hasOwnProperty("user") &&
      req.user.user != null &&
      req.user.user.hasOwnProperty("name")
    )
      return next();
    else if (req.user.hasOwnProperty("user") && req.user.user == null) {
      req.logout();
      res.redirect("/");
    } else res.redirect("/");
  } else {
    res.redirect("/");
  }
};

module.exports = checkAuthenticated;
