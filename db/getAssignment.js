const { User, Student, Invite, Assignment, Answer } = require("./models/user");
const { Quiz, Section, Question, Option } = require("./models/quizmodel.js");


const getAssignment = (studentId, quizId, includes) => {
    return Assignment.findOne({
        where: {
        StudentId: studentId,
        QuizId: quizId,
        },
        include: includes,
    });
}

module.exports = getAssignment