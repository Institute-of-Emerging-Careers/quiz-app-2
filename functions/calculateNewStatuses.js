const {sectionExistsInStatus} = require("./updateStatus");

const calculateNewSectionStatus = (sectionId, cur_section_status, startTime, endTime) => {
    let new_section_status = []
    if (cur_section_status != null) new_section_status = [...cur_section_status]
    new_section_status.push({ sectionId: sectionId, startTime: startTime, endTime: endTime });
    return new_section_status
}


const calculateNewStatus = (sectionId, cur_status, text) => {
    let new_status = []
      if (cur_status == null) {
        new_status= [{ sectionId: sectionId, status: text }];
      } else if (!sectionExistsInStatus(cur_status, sectionId)) {
        new_status = [...cur_status, { sectionId: sectionId, status: text }];
      } else {
        for (let i = 0; i < cur_status.length; i++) {
          if (parseInt(cur_status[i].sectionId) == sectionId) {
            cur_status[i].status = text;
          }
        }
        new_status = [...cur_status];
      }
      return new_status
}

module.exports = {calculateNewSectionStatus, calculateNewStatus}