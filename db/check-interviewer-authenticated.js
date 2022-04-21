// If the user is not authenticated, they are redirected to the login page
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.type == "interviewer") return next();
    else res.redirect("/");
  } else {
    res.redirect("/");
  }
};

module.exports = checkAuthenticated;
