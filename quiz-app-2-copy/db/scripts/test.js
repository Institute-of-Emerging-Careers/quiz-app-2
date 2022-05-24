  const {
    Student,
    Invite,
    Assignment,
    Answer,
    Attempt,
    PasswordResetLink,
    Score
  } = require("../models/user");

  const {Section} = require("../models/quizmodel");

  (async ()=>{
    const attempts = await Attempt.findAll({include:[{model: Assignment, attributes:["StudentId"]}, {model: Section, attributes: ["id"]}, {model: Score, attributes: ["id"]}], attributes: ["endTime", "AssignmentId"]})
    attempts.forEach(attempt=>{
        if(attempt.AssignmentId==1279) console.log(attempt)
    })
  })()