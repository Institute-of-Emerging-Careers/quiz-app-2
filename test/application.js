process.env.NODE_ENV = "test";

let sequelize = require("../db/connect");
//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server_config");
const bcrypt = require("bcrypt");
const {
  ApplicationRound,
  Application,
  Course,
} = require("../db/models/application");
const { Student, Assignment } = require("../db/models/user");

let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);
const agent = chai.request.agent(server);

//Our parent block
describe("Applications", () => {
  before(() => {
    //Before each test we empty the database
    return sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await ApplicationRound.destroy({ where: {} });
    await Assignment.destroy({ where: {} });
    await Student.destroy({ where: {} });
    await Application.destroy({ where: {} });
    await Course.destroy({ where: {} });
  });
  /*
   * Test the /GET route
   */
  it("it should throw 400 error on missing application_round_id", (done) => {
    chai
      .request(server)
      .post("/application/check-if-user-exists")
      .send({
        email: "inexistent",
        cnic: "inexistent",
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("it should throw 400 error on missing email", (done) => {
    chai
      .request(server)
      .post("/application/check-if-user-exists")
      .send({
        cnic: "inexistent",
        application_round_id: 1,
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("it should throw 400 error on missing cnic", (done) => {
    chai
      .request(server)
      .post("/application/check-if-user-exists")
      .send({
        email: "inexistent",
        application_round_id: 1,
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("it should return 400 if the application round id is wrong", (done) => {
    chai
      .request(server)
      .post("/application/check-if-user-exists")
      .send({
        email: "inexistent",
        cnic: "inexistent",
        application_round_id: -1,
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("it should say exists: false for new applicant", (done) => {
    ApplicationRound.create({
      title: "Test Round",
    }).then((application_round) => {
      chai
        .request(server)
        .post("/application/check-if-user-exists")
        .send({
          email: "inexistent",
          cnic: "inexistent",
          application_round_id: application_round.id,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.eql({ exists: false });
          done();
        });
    });
  });

  it("it should return 'both_cnic_and_email' if the Student applicant exists", () => {
    return new Promise(async (resolve, reject) => {
      try {
        const student = await Student.create({
          firstName: "Test",
          lastName: "Test",
          email: "test@test.com",
          cnic: "00000-0000000-0",
          gender: "male",
          password: await bcrypt.hash("test_password", 10),
        });

        const application_round = await ApplicationRound.create({
          title: "Test Round",
        });

        chai
          .request(server)
          .post("/application/check-if-user-exists")
          .send({
            email: "test@test.com",
            cnic: "00000-0000000-0",
            application_round_id: application_round.id,
          })
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.eql({
              exists: true,
              type: "both_cnic_and_email",
            });
            resolve();
          });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  });

  it("it should return 'email_only' if the Student applicant email exists", () => {
    return new Promise(async (resolve, reject) => {
      try {
        const student = await Student.create({
          firstName: "Test",
          lastName: "Test",
          email: "test@test.com",
          cnic: "00000-0000000-0",
          gender: "male",
          password: await bcrypt.hash("test_password", 10),
        });

        const application_round = await ApplicationRound.create({
          title: "Test Round",
        });

        chai
          .request(server)
          .post("/application/check-if-user-exists")
          .send({
            email: "test@test.com",
            cnic: "wrong",
            application_round_id: application_round.id,
          })
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.eql({
              exists: true,
              type: "email_only",
            });
            resolve();
          });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  });

  it("it should return 'cnic_only' if the Student applicant email exists", () => {
    return new Promise(async (resolve, reject) => {
      try {
        const student = await Student.create({
          firstName: "Test",
          lastName: "Test",
          email: "test@test.com",
          cnic: "00000-0000000-0",
          gender: "male",
          password: await bcrypt.hash("test_password", 10),
        });

        const application_round = await ApplicationRound.create({
          title: "Test Round",
        });

        chai
          .request(server)
          .post("/application/check-if-user-exists")
          .send({
            email: "wrong",
            cnic: "00000-0000000-0",
            application_round_id: application_round.id,
          })
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.eql({
              email: "tes***@test.com",
              exists: true,
              type: "cnic_only",
            });
            resolve();
          });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  });

  it("it should return 'already_applied' if student has already applied to this round", () => {
    return new Promise(async (resolve, reject) => {
      const application_round = await ApplicationRound.create({
        title: "Test Round",
      });
      const courses = await Promise.all([
        Course.create({ title: "Test Course 1" }),
        Course.create({ title: "Test Course 2" }),
        Course.create({ title: "Test Course 3" }),
      ]);
      await agent.post(`/application/submit/${application_round.id}`).send({
        firstName: "Test",
        lastName: "User",
        password: "test",
        password2: "test",
        gender: "male",
        email: "test@test.com",
        cnic: "00000-0000000-0",
        phone: "03021234567",
        age: 23,
        city: "Lahore",
        province: "Punjab",
        country: "Pakistan",
        address: "Street X House Y City Z",
        father_name: "Test Parent",
        current_address: "Street A House B City Z",
        education_completed: "Grade 8",
        education_completed_major: "Biology",
        education_ongoing: "None",
        education_ongoing_major: "None",
        monthly_family_income: 25000,
        computer_and_internet_access: 1,
        internet_facility_in_area: 1,
        time_commitment: 1,
        is_employed: 0,
        type_of_employment: null,
        salary: null,
        will_leave_job: null,
        has_applied_before: 0,
        firstPreferenceId: courses[0].id,
        secondPreferenceId: courses[1].id,
        thirdPreferenceId: courses[2].id,
        preference_reason: "Test reason",
        is_comp_sci_grad: 0,
        how_heard_about_iec: "Social Media",
        will_work_full_time: 1,
        acknowledge_online: 1,
      });

      chai
        .request(server)
        .post(`/application/check-if-user-exists`)
        .send({
          email: "test@test.com",
          cnic: "00000-0000000-0",
          application_round_id: application_round.id,
        })
        .then((res) => {
          expect(res.body).to.eql({
            exists: true,
            type: "already_applied",
          });
          resolve();
        })
        .catch((err) => {
          reject(err);
        })
        .end();
    });
  });

  it("it should return 201 on correct application", (done) => {
    ApplicationRound.create({ title: "Test Round" }).then(
      (application_round) => {
        Promise.all([
          Course.create({ title: "Test Course 1" }),
          Course.create({ title: "Test Course 2" }),
          Course.create({ title: "Test Course 3" }),
        ]).then((courses) => {
          chai
            .request(server)
            .post(`/application/submit/${application_round.id}`)
            .send({
              firstName: "Test",
              lastName: "User",
              password: "test",
              password2: "test",
              gender: "male",
              email: "test@test.com",
              cnic: "00000-0000000-0",
              phone: "03021234567",
              age: 23,
              city: "Lahore",
              province: "Punjab",
              country: "Pakistan",
              address: "Street X House Y City Z",
              father_name: "Test Parent",
              current_address: "Street A House B City Z",
              education_completed: "Grade 8",
              education_completed_major: "Biology",
              education_ongoing: "None",
              education_ongoing_major: "None",
              monthly_family_income: 25000,
              computer_and_internet_access: 1,
              internet_facility_in_area: 1,
              time_commitment: 1,
              is_employed: 0,
              type_of_employment: null,
              salary: null,
              will_leave_job: null,
              has_applied_before: 0,
              firstPreferenceId: courses[0].id,
              secondPreferenceId: courses[1].id,
              thirdPreferenceId: courses[2].id,
              preference_reason: "Test reason",
              is_comp_sci_grad: 0,
              how_heard_about_iec: "Social Media",
              will_work_full_time: 1,
              acknowledge_online: 1,
            })
            .end((err, res) => {
              expect(res.status).to.eql(201);
              if (err) done(err);
              else done();
            });
        });
      }
    );
  });
});
