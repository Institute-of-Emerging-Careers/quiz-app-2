const LocalStrategy = require("passport-local").Strategy;
const getAdminByEmail = require("./db/get-admin-by-email"),
  getStudentByEmail = require("./db/get-student-by-email"),
  getAdminById = require("./db/get-admin-by-id"),
  getStudentById = require("./db/get-student-by-id"),
  getInterviewerByEmail = require("./db/get-interviewer-by-email"),
  getInterviewerById = require("./db/get-interviewer-by-id");
const bcrypt = require("bcrypt");

const initialize = (passport) => {
  const authenticateAdmin = async (email, password, done) => {
    const user = await getAdminByEmail(email);

    if (user == null) {
      return done(null, false, { message: "Email or password incorrect." });
      // Done => (error, authenticated user, message object)
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, { type: "admin", user: user });
      } else {
        return done(null, false, { message: "Email or password incorrect." });
      }
    } catch (e) {
      return done(e);
    }
  };

  const authenticateStudent = async (email, password, done) => {
    const user = await getStudentByEmail(email);

    if (user == null) {
      return done(null, false, { message: "Email or password incorrect." });
      // Done => (error, authenticated user, message object)
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, { type: "student", user: user });
      } else {
        return done(null, false, { message: "Email or password incorrect." });
      }
    } catch (e) {
      return done(e);
    }
  };

  const authenticateInterviewer = async (email, password, done) => {
    const user = await getInterviewerByEmail(email);

    if (user == null) {
      return done(null, false, { message: "Email or password incorrect." });
      // Done => (error, authenticated user, message object)
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, { type: "interviewer", user: user });
      } else {
        return done(null, false, { message: "Email or password incorrect." });
      }
    } catch (e) {
      return done(e);
    }
  };

  const registerStudent = async (email, password, done) => {
    const user = await getStudentByEmail(email);

    if (user != null) {
      // if email already exists
      return done(null, false, {
        message: "Email address already registered.",
      });
    } else {
      // if email address is new
      const firstName = req.body.firstName,
        lastName = req.body.lastName,
        phone = req.body.phone,
        cnic = req.body.cnic;

      try {
        const student = await sequelize.models.Student.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: await bcrypt.hash(password, 10),
          phone: phone,
          cnic: cnic,
        });

        return done(null, { type: "student", user: student });
      } catch (err) {
        console.log(err);
        return done(err);
      }
    }
  };

  passport.use(
    "admin-login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      authenticateAdmin
    )
  );

  passport.use(
    "student-login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      authenticateStudent
    )
  );

  passport.use(
    "interviewer-login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      authenticateInterviewer
    )
  );

  passport.use(
    "student-signup",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      registerStudent
    )
  );

  passport.serializeUser((obj, done) => {
    return done(null, { type: obj.type, id: obj.user.id });
  });

  passport.deserializeUser(async (obj, done) => {
    if (obj.type == "admin")
      return done(null, { type: "admin", user: await getAdminById(obj.id) });
    else if (obj.type == "student")
      return done(null, {
        type: "student",
        user: await getStudentById(obj.id),
      });
    else if (obj.type == "interviewer")
      return done(null, {
        type: "interviewer",
        user: await getInterviewerById(obj.id),
      });
  });
};

module.exports = initialize;
