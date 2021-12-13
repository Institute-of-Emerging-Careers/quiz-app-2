const {calculateNewSectionStatus, calculateNewStatus} = require("./calculateNewStatuses");
const {updateStatus} = require("./updateStatus");

function updateSectionStatuses(assignment, section, sectionId) {
    let cur_status = assignment.status;
    let cur_section_status = assignment.sectionStatus
    // if section time is equal to 0, that means that the quiz is untimed.
    if (section.time != 0) {
        // if the section is timed
        const startTime = Date.now();

        // converting section.time which is in minutes to milliseconds
        const endTime = startTime + section.time * 60 * 1000;

        // creating new sectionStatus object to insert into database
        let new_section_status = calculateNewSectionStatus(sectionId, cur_section_status, startTime, endTime)

        //   creating new status object to insert into database (read comments in server.js about assignment.sectionStatus vs assignment.status)
        let new_status = calculateNewStatus(sectionId, cur_status, "In Progress")

        // finally update these statuses in the database
        return updateStatus(assignment.id, new_status, new_section_status);
    } else {
      // if the section is untimed
      const startTime = Date.now();

      let new_section_status = []
      if (cur_section_status!=null) new_section_status = [...cur_section_status]
      new_section_status.push({ sectionId: sectionId, startTime: startTime, endTime: 0 });
      return updateStatus(assignment.id, cur_status, sectionId, "In Progress", new_section_status);
    }
  }

  module.exports = updateSectionStatuses