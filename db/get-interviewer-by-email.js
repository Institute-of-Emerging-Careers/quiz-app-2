const { Interviewer } = require("./models/interview");

const getInterviewerByEmail = async (inputemail) => {
  try {
    return (
      await Interviewer.findAll({
        where: {
          email: inputemail,
        },
        limit: 1,
      })
    )[0].dataValues;
  } catch (err) {
    if (process.env.DEBUG == true) {
      console.log(err);
    }
    return null;
  }
};

module.exports = getInterviewerByEmail;
