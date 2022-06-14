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
const { Attempt, Assignment, Student } = require("../db/models/user");
const { Quiz, Section } = require("../db/models/quizmodel");

let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

//Our parent block
describe("Quiz Tests", () => {
  beforeEach(() => {
    return sequelize.sync({ force: true });
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
