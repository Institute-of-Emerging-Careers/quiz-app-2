const {calculateNewSectionStatus, calculateNewStatus} = require("./calculateNewStatuses");
const {updateStatus} = require("./setSectionStatusToComplete");
const { Attempt } = require("../db/models/user");

async function setSectionStatusToInProgress(assignment, section, sectionId) {
    let cur_section_status = assignment.sectionStatus
    // if section time is equal to 0, that means that the quiz is untimed.
    if (section.time != 0) {
        // if the section is timed
        const startTime = Date.now();

        // converting section.time which is in minutes to milliseconds
        const endTime = startTime + section.time * 60 * 1000;

        // creating new rows in the new Attempts table. This will replace the above logic
        return Attempt.create(
          {
            startTime: startTime, 
            endTime: endTime, 
            statusText: "In Progress", 
            AssignmentId: assignment.id, 
            SectionId: section.id
          }
        )

    } else {
      // if the section is untimed
      const startTime = Date.now();

      
      return Attempt.create(
        {
          startTime: startTime, 
          endTime: 0, 
          statusText: "In Progress", 
          AssignmentId: assignment.id, 
          SectionId: section.id
        }
      )
    }
  }

  module.exports = setSectionStatusToInProgress