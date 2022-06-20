process.env.NODE_ENV = "test";

let sequelize = require("../db/connect");
//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server_config");
const {
  filterTimerEndedAttempts,
  scoreAttemptsWhoseTimerHasEnded,
} = require("../functions/scoreAttemptsWhoseTimerHasEnded");
const {
  Attempt,
  Assignment,
  Student,
  Score,
  Answer,
} = require("../db/models/user");
const { Quiz, Section, Question } = require("../db/models/quizmodel");
const scoreAssignmentsWhoseDeadlineHasPassed = require("../functions/scoreAssignmentsWhoseDeadlineHasPassed");
const { Op } = require("sequelize");
const scoreSection = require("../functions/scoreSectionAndSendEmail");
const rescoreAssignments = require("../functions/rescoreAssignments");
const resetStudentAssignment = require("../functions/resetStudentAssignment");

let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe("Cron Jobs - Score Timed Out Attempts", () => {
  before(() => {
    return sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Attempt.destroy({ where: {} });
    await Quiz.destroy({ where: {} });
    await Student.destroy({ where: {} });
    await Section.destroy({ where: {} });
  });
  /*
   * Test the /GET route
   */

  describe("get 'timed out attempts'", () => {
    it("it should return an empty array on empty database", (done) => {
      Attempt.findAll()
        .then((attempts) => {
          expect(filterTimerEndedAttempts(attempts)).to.eql([]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it("it should return one attempt if it exists", async () => {
      try {
        const quiz = await Quiz.create({ title: "test" });
        const student = await Student.create({
          firstName: "Test",
          lastName: "test",
          email: "test@test.com",
          password: "xxx",
          cnic: "35201-3520462-3",
          gender: "male",
          hasUnsubscribedFromEmails: false,
        });
        const section = await quiz.createSection({
          title: "Test Section",
          sectionOrder: 0,
          poolCount: 0,
        });
        const assignment = await Assignment.create({
          QuizId: quiz.id,
          StudentId: student.id,
        });
        const attempt = await Attempt.create({
          AssignmentId: assignment.id,
          SectionId: section.id,
          startTime: Date.now() - 2000,
          endTime: Date.now() - 200,
          duration: 0,
          statusText: "In Progress",
        });

        const attempts = await Attempt.findAll();
        expect(filterTimerEndedAttempts(attempts)).to.have.length(1);
      } catch (err) {
        console.log(err);
      }
    });

    it("should return array of length 0 when 'timed out attempt' has been scored", async () => {
      try {
        await scoreAttemptsWhoseTimerHasEnded();
        const attempts = await Attempt.findAll();
        expect(filterTimerEndedAttempts(attempts)).to.have.length(0);
      } catch (err) {
        console.log(err);
      }
    });
  });
});

describe("Cron Jobs - Score Past Deadline Assignments", () => {
  before(async () => {
    await sequelize.sync({ force: true });
    const quiz = await Quiz.create({ title: "Test Quiz" });
    const student = await Student.create({
      firstName: "Test",
      lastName: "test",
      email: "test@test.com",
      password: "xxx",
      cnic: "35201-3520462-3",
      gender: "male",
      hasUnsubscribedFromEmails: false,
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
  });

  beforeEach(async () => {
    await Assignment.destroy({ where: {} });
  });

  it("it should score an assignment that has passed deadline", async () => {
    // create an assignment with a createdAt date that is more than 30 days old (30 days being the deadline)
    let assignment;
    try {
      const quiz = await Quiz.findOne({ where: {} });
      const student = await Student.findOne({ where: {} });

      assignment = await Assignment.create({
        QuizId: quiz.id,
        StudentId: student.id,
        createdAt: "2021-06-15 18:06:06",
        completed: false,
      });

      await scoreAssignmentsWhoseDeadlineHasPassed();

      assignment = await Assignment.findOne({
        where: { id: assignment.id },
      });
    } catch (err) {
      console.log(err);
    }
    expect(assignment.completed).to.eql(true);
  });

  it("it should not score an assignment that has not passed the deadline", async () => {
    let assignment;
    try {
      const quiz = await Quiz.findOne({ where: {} });
      const student = await Student.findOne({ where: {} });

      const assignment_id = (
        await Assignment.create({
          QuizId: quiz.id,
          StudentId: student.id,
          createdAt: new Date() - 1000,
        })
      ).id;

      await scoreAssignmentsWhoseDeadlineHasPassed();

      assignment = await Assignment.findOne({
        where: { id: assignment_id },
      });
    } catch (err) {
      console.log(err);
    }
    expect(assignment.completed).to.eql(false);
  });
});

describe("testing scripts", () => {
  before(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Score.destroy({ where: {} });
    await Answer.destroy({ where: {} });
    await Question.destroy({ where: {} });
    await Attempt.destroy({ where: {} });
    await Assignment.destroy({ where: {} });
    await Quiz.destroy({ where: {} });
    await Student.destroy({ where: {} });
    await Section.destroy({ where: {} });
  });

  it("testing rescoreAssignments.js - should correct the score of a wrongly scored test", async () => {
    const quiz = await Quiz.create({ title: "Test Quiz" });
    const student = await Student.create({
      firstName: "Test",
      lastName: "test",
      email: "test@test.com",
      password: "xxx",
      cnic: "35201-3520462-3",
      gender: "male",
      hasUnsubscribedFromEmails: false,
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

    // Create four options (two per question of section 1 and section 2)
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
    const assignment = await Assignment.create({
      StudentId: student.id,
      QuizId: quiz.id,
    });

    const attempt1 = await assignment.createAttempt({
      SectionId: section.id,
      statusText: "Completed",
    });
    const attempt2 = await assignment.createAttempt({
      SectionId: section2.id,
      statusText: "Completed",
    });

    const answer1 = await q1.createAnswer({
      StudentId: student.id,
      OptionId: opt1.id,
    });
    const answer2 = await q2.createAnswer({
      StudentId: student.id,
      OptionId: opt3.id,
    });
    const answer3 = await q3.createAnswer({
      StudentId: student.id,
      OptionId: opt5.id,
    });

    await attempt1.createScore({ score: 0 });
    await assignment.update({ completed: true });

    await rescoreAssignments(quiz.id);

    const new_score = (
      await Score.findOne({ where: { AttemptId: attempt1.id } })
    ).score;

    expect(new_score).to.eql(3.5);
  });

  it("testing resetAssignment.js - it should delete all attempts, answers, and scores", async () => {
    const test_reference_obj = {
      old_assignment_completed_status: true,
      final_assignment_completed_status: false,
    };

    let test_obj = {
      old_assignment_completed_status: null,
      final_assignment_completed_status: null,
    };

    const quiz = await Quiz.create({ title: "Test Quiz" });
    const student = await Student.create({
      firstName: "Test",
      lastName: "test",
      email: "test@test.com",
      password: "xxx",
      cnic: "35201-3520462-3",
      gender: "male",
      hasUnsubscribedFromEmails: false,
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

    // Create four options (two per question of section 1 and section 2)
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
    let assignment = await Assignment.create({
      StudentId: student.id,
      QuizId: quiz.id,
    });

    const attempt1 = await assignment.createAttempt({
      SectionId: section.id,
      statusText: "Completed",
    });
    const attempt2 = await assignment.createAttempt({
      SectionId: section2.id,
      statusText: "Completed",
    });

    const answer1 = await q1.createAnswer({
      StudentId: student.id,
      OptionId: opt1.id,
    });
    const answer2 = await q2.createAnswer({
      StudentId: student.id,
      OptionId: opt3.id,
    });
    const answer3 = await q3.createAnswer({
      StudentId: student.id,
      OptionId: opt5.id,
    });

    await scoreSection(section.id, student.id, assignment, false);
    await scoreSection(section2.id, student.id, assignment, false);

    assignment = await Assignment.findOne({ where: { id: assignment.id } });
    test_obj.old_assignment_completed_status = assignment.completed;

    await resetStudentAssignment(student.id, quiz.id);

    assignment = await Assignment.findOne({ where: { id: assignment.id } });
    test_obj.final_assignment_completed_status = assignment.completed;

    expect(test_obj).to.eql(test_reference_obj);
  });
});
