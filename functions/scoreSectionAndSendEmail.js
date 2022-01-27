const { Assignment, Student } = require("../db/models/user");
const { Section, Quiz } = require("../db/models/quizmodel");
const allSectionsSolved = require("./allSectionsSolved")
const calculateScore = require("./calculateScore");
const updateScore = require("./updateScore");
const {
    setSectionStatusToComplete,
  } = require("./setSectionStatusToComplete");
  const {sendHTMLMail} = require("./sendEmail")

function scoreSectionAndSendEmail(section_id, student_id) {
    return new Promise(async (resolve,reject)=>{
        try {
        const section = await Section.findOne({
            where: { id: section_id },
            include: { model: Quiz, required: true, attributes: ["id"] },
            attributes: ["title"],
          })
      
          const quizId = section.Quiz.id;
      
          const assignment = await Assignment.findOne({
            where: { StudentId: student_id, QuizId: quizId },
          });
      
          const score = await calculateScore(section_id, student_id);
      
          await updateScore(section_id, assignment, score);
      
          await setSectionStatusToComplete(assignment.id, section_id);
      
          // sending completion email to student
          const email = (await Student.findOne({where:{id: student_id}, attributes: ["email"]})).email
      
          // check if student has solved all sections
          if (await allSectionsSolved(quizId, assignment)) {
            await sendHTMLMail(email, `Assessment Completed`, 
            { 
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
              button_link: "https://iec.org.pk"
            })
            console.log("Mail sent")
          } else {
            await sendHTMLMail(email, `Section Solved`, 
            { 
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
              button_link: "https://apply.iec.org.pk/student/login"
            })
            console.log("Mail sent")
          }    
          resolve();
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = scoreSectionAndSendEmail