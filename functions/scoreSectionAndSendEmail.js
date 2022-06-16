const { Assignment, Student, Attempt } = require("../db/models/user");
const { Section, Quiz } = require("../db/models/quizmodel");
const allSectionsSolved = require("./allSectionsSolved");
const calculateScore = require("./calculateScore");
const updateScore = require("./updateScore");
const { setSectionStatusToComplete } = require("./setSectionStatusToComplete");
const { queueMail } = require("../bull");

function scoreSection(
  section_id,
  student_id,
  assignment = null,
  send_email = false
) {
  return new Promise(async (resolve, reject) => {
    try {
      const section = await Section.findOne({
        where: { id: section_id },
        include: { model: Quiz, required: true, attributes: ["id"] },
        attributes: ["title"],
      });

      const quizId = section.Quiz.id;
      if (assignment === null) {
        assignment = await Assignment.findOne({
          where: { StudentId: student_id, QuizId: quizId },
        });
      }
      if (assignment !== null) {
        // checking if an attempt exists, because if not then this means we're scoring this assignment due to it being past deadline
        let score;
        const attempt = await Attempt.findOne({
          where: { AssignmentId: assignment.id, SectionId: section_id },
        });
        if (attempt == null) {
          score = 0;
        } else {
          score = await calculateScore(section_id, student_id);
        }
        await updateScore(section_id, assignment.id, score);
        await setSectionStatusToComplete(assignment.id, section_id);
        // sending completion email to student
        const email = (
          await Student.findOne({
            where: { id: student_id },
            attributes: ["email"],
          })
        ).email;

        const all_sections_solved = await allSectionsSolved(quizId, assignment);

        if (all_sections_solved) {
          await assignment.update({ completed: true });
        }
        // check if student has solved all sections
        if (send_email && all_sections_solved) {
          await queueMail(email, `Assessment Completed`, {
            heading: `All Sections Completed`,
            inner_text: `Dear Student
                <br><br>
                This email confirms that you have successfully solved the IEC Assessment. You'll now have to wait to hear back from us after the shortlisting process.
                <br><br>
                Thank you for showing your interest in becoming part of the program. 
                <br><br>
                Sincerely, 
                IEC Admissions Team`,
            button_announcer: "Visit out website to learn more about us",
            button_text: "Visit",
            button_link: "https://iec.org.pk",
          });
          console.log("Scoring mail sent");
        } else if (send_email) {
          await queueMail(email, `Section Solved`, {
            heading: `Section "${section.title}" Solved`,
            inner_text: `Dear Student
                <br><br>
                This email confirms that you have successfully solved Section "${section.title}" of the IEC Assessment. Please solve the remaining sections as well.
                <br><br>
                Thank you for showing your interest in becoming part of the program. 
                <br><br>
                Sincerely, 
                IEC Admissions Team`,
            button_announcer: "Solve the remaining sections on the portal:",
            button_text: "Student Portal",
            button_link: "https://apply.iec.org.pk/student/login",
          });
          console.log("Scoring mail sent");
        }
        resolve();
      } else {
        reject();
      }
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = scoreSection;
