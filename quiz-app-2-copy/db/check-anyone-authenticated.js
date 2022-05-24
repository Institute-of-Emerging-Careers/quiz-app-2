// If the user is not authenticated, they are redirected to the login page
const checkAnyoneAuthenticated = (req, res, next) => {
    if (req.isAuthenticated())
      return next();
    else 
      res.redirect("/student/login");
    
  };
  
  module.exports = checkAnyoneAuthenticated;
  