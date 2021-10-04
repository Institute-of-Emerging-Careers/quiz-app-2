// If the user is not authenticated, they are redirected to the login page
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.type == "student") return next();
    else res.redirect("/student/login");
  } else {
    res.redirect("/student/login");
  }
};

module.exports = checkAuthenticated;
