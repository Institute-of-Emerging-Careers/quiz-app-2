const { User, Student, Invite, Assignment, Answer } = require("./models/user");
const { Quiz, Section, Question, Option } = require("./models/quizmodel.js");


const getSection = (sectionId, includes) => {
    return Section.findOne({
        where: {
          id: sectionId,
        },
        include: includes
      });
}

module.exports = getSection