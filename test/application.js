process.env.NODE_ENV = "test";

let sequelize = require("../db/connect");
//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server_config");

let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

//Our parent block
describe("Application Test", () => {
  before((done) => {
    //Before each test we empty the database
    sequelize.sync({ force: true }).then(() => {
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe("Validate an Empty Application Round", () => {
    it("it should throw a validation error", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
    });
  });

  describe("/GET admin without logging in", () => {
    it("it should redirect to admin/login", (done) => {
      chai
        .request(server)
        .get("/admin")
        .end((err, res) => {
          expect(res.redirects[0]).to.include("/admin/login");
          done();
        });
    });
  });
});
