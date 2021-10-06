// If the user is already logged in, user cannot visit login page
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.type == "admin") return res.redirect("/admin");
    else if (req.user.type == "student") return res.redirect("/student/login");
  } else {
    next();
  }
};

module.exports = checkAuthenticated;
