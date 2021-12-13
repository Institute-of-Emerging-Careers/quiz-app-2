const { Assignment } = require("../db/models/user");

function sectionExistsInStatus(cur_status, sectionId) {
  let found = false;
  for (let i = 0; i < cur_status.length; i++) {
    if (parseInt(cur_status[i].sectionId) == sectionId) found = true;
  }
  return found;
}

async function updateStatus(assignment_id, new_status, new_section_status) {
    const assignment = await Assignment.findOne({where:{id:assignment_id}})
    return assignment.update({ status: new_status, sectionStatus: new_section_status });
}

module.exports = {updateStatus, sectionExistsInStatus};
