// If the user is already logged in, user cannot visit login page
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.type == "student") {
      if (req.params.link!=undefined) return res.redirect("/student?link=" + encodeURIComponent(req.params.link));
      else return res.redirect("/student");
    }
    else if (req.user.type == "admin") return res.redirect("/admin/login");
  } else {
    next();
  }
};

module.exports = checkAuthenticated;
