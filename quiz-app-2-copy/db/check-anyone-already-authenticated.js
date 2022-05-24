// If the user is not authenticated, they are redirected to the login page
const checkAnyoneAlreadyAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.type == "admin") res.redirect("/admin");
    else if (req.user.type == "student") res.redirect("/student");
    else if (req.user.type == "interviewer") res.redirect("/admin/interviewer");
  } else return next();
};

module.exports = checkAnyoneAlreadyAuthenticated;
