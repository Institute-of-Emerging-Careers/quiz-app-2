const { Assignment } = require("../db/models/user");

function sectionExistsInStatus(cur_status, sectionId) {
  let found = false;
  for (let i = 0; i < cur_status.length; i++) {
    if (parseInt(cur_status[i].sectionId) == sectionId) found = true;
  }
  return found;
}

async function updateStatus(assignment_id, cur_status, sectionId, text, new_section_status) {
  const assignment = await Assignment.findOne({where:{id:assignment_id}})

  if (cur_status == null) {
    return assignment.update({ status: [{ sectionId: sectionId, status: text }], sectionStatus: new_section_status });
  } else if (!sectionExistsInStatus(cur_status, sectionId)) {
    const final_status = [...cur_status, { sectionId: sectionId, status: text }];
    return assignment.update({ status: final_status, sectionStatus: new_section_status });
  } else {
    for (let i = 0; i < cur_status.length; i++) {
      if (parseInt(cur_status[i].sectionId) == sectionId) {
        cur_status[i].status = text;
      }
    }
    return assignment.update({ status: [...cur_status], sectionStatus: new_section_status });
  }
}

module.exports = updateStatus;
