// This file will initialize all Models so that the models and the database are in sync
const sequelize = require("./connect");
const bcrypt = require("bcrypt");

const initializeDatabase = async () => {
  try {
    alterandforce = false;
    // Sync models with database
    await sequelize.sync({ alter: alterandforce, force: alterandforce });

    if (alterandforce) {
      // Add a single admin user
      const hashedPwd = await bcrypt.hash("examplepassword", 10);
      const adminUser = await sequelize.models.User.create({
        firstName: "Danish",
        lastName: "Khan",
        email: "admin@iec.org.pk",
        password: hashedPwd,
      });
      console.log("Admin User Danish created.");

      // Create an empty quiz to create invite so that we can create a user using that invite
      const quiz = await sequelize.models.Quiz.create({
        title: "Demo Quiz",
        modified_by: adminUser.id,
      });

      // Create two sections
      const section = await sequelize.models.Section.create({
        sectionOrder: 0,
        title: "Section 1",
        poolCount: 2,
        time: 5,
        QuizId: quiz.id,
      });
      const section2 = await sequelize.models.Section.create({
        sectionOrder: 1,
        title: "Section 2",
        poolCount: 1,
        time: 0,
        QuizId: quiz.id,
      });

      // Create two questions for Section 1
      const q1 = await sequelize.models.Question.create({
        questionOrder: 0,
        statement: "This is the first question.",
        type: "MCQ-S",
        marks: 1.0,
        SectionId: section.id,
      });
      const q2 = await sequelize.models.Question.create({
        questionOrder: 1,
        statement: "This is the second question.",
        type: "MCQ-M",
        marks: 2.5,
        SectionId: section.id,
      });

      // Create a question for Section 2
      const q3 = await sequelize.models.Question.create({
        questionOrder: 0,
        statement: "This is the first question.",
        type: "MCQ-S",
        marks: 1.25,
        SectionId: section2.id,
      });

      // Create four options (two per question of section 1)
      const opt1 = await sequelize.models.Option.create({
        optionOrder: 0,
        statement: "option 1",
        correct: true,
        QuestionId: q1.id,
      });
      const opt2 = await sequelize.models.Option.create({
        optionOrder: 1,
        statement: "option 2",
        correct: false,
        QuestionId: q1.id,
      });
      const opt3 = await sequelize.models.Option.create({
        optionOrder: 0,
        statement: "multiple select option 1",
        correct: true,
        QuestionId: q2.id,
      });
      const opt4 = await sequelize.models.Option.create({
        optionOrder: 1,
        statement: "multiple select option 2",
        correct: true,
        QuestionId: q2.id,
      });

      // Create two options for q3 of section 2
      const opt5 = await sequelize.models.Option.create({
        optionOrder: 0,
        statement: "this is an option",
        correct: true,
        QuestionId: q3.id,
      });
      const opt6 = await sequelize.models.Option.create({
        optionOrder: 1,
        statement: "this is another option",
        correct: false,
        QuestionId: q3.id,
      });

      // Create an invite for that quiz
      const invite = await sequelize.models.Invite.create({
        link: "demo",
        QuizId: quiz.id,
      });

      // Add a single student user
      const studentUser = await sequelize.models.Student.create({
        firstName: "Rohan",
        lastName: "Hussain",
        email: "rohanhussain1@yahoo.com",
        password: hashedPwd,
        phone: "03320460729",
        cnic: "35201-3520462-3",
        InviteId: invite.id,
      });
      await invite.increment("registrations");
      // Create an assignment
      const assignment = await sequelize.models.Assignment.create({
        QuizId: quiz.id,
        StudentId: studentUser.id,
      });

      console.log("Student User Rohan created.");
    }
  } catch (err) {
    console.log("Could not create user.");
    console.log(err);
  }
};

module.exports = initializeDatabase;
