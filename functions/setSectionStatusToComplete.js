const { Assignment, Attempt } = require("../db/models/user");

function sectionExistsInStatus(cur_status, sectionId) {
  let found = false;
  for (let i = 0; i < cur_status.length; i++) {
    if (parseInt(cur_status[i].sectionId) == sectionId) found = true;
  }
  return found;
}

async function setSectionStatusToComplete(assignment_id, sectionId) {
  console.log("\nassignment_id:",assignment_id, "sectionId:",sectionId, "\n")
  const attempt = await Attempt.findOne({where:{AssignmentId: assignment_id, SectionId: sectionId}})
  return attempt.update({endTime: Date.now(), duration: Date.now() - attempt.startTime, statusText: "Completed"})
}

module.exports = {setSectionStatusToComplete, sectionExistsInStatus};
