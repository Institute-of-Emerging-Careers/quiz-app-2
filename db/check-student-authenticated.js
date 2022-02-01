// If the user is not authenticated, they are redirected to the login page
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.type == "student") return next();
    else res.redirect("/student/login");
  } else {
    if (req.url != "/student")
    res.redirect(`/student/login?url=${encodeURIComponent(req.url)}`);
    else res.redirect(`/student/login`);
  }
};

module.exports = checkAuthenticated;
