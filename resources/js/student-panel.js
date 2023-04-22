const modal = document.getElementById("modal");
const quiz_success = document.getElementById("quiz-success");
if (quiz_success != null) {
  setTimeout(() => {
    quiz_success.classList.add("hidden");
  }, 5000);
}
// note: here modal is the black overlay in which the actual modal rests

let modal_section_table_body, modal_quiz_num_sections, modal_quiz_title;

function hideModal() {
  modal.classList.add("hidden-imp");
}

modal.onclick = function () {
  hideModal();
};

function showModal() {
  modal.classList.remove("hidden-imp");
}

function assignStatusColor(status) {
  let statusColor = ""
  if (status == "In Progress") statusColor = "text-red-700";
  else if (status == "Completed") statusColor = "text-green-700";
  else if (status == "Incomplete") statusColor = "text-yellow-700";
  else statusColor = "";

  return statusColor;
}

function retrieveStatusAndAction(status, num_sections) {
  if (status == null) return ["Not Started", "Start"];
  else {
    let any_in_progress = false;
    let all_completed = true; // if we find even one non-completed section we set this to false

    for (let i = 0; i < status.length; i++) {
      if (status[i].status == "In Progress") {
        any_in_progress = true;
        all_completed = false;
        break;
      } else if (status[i].status == "Not Started") {
        all_completed = false;
      }
    }
    if (any_in_progress) {
      return ["In Progress", "Continue"];
    } else if (status.length == num_sections && all_completed) {
      return ["Completed", ""];
    } else if (num_sections > status.length) {
      return ["Incomplete", "Continue"];
    } else {
      return ["Not Started", "Start"];
    }
  }
}

function details(elem) {
  $.get(
    "/quiz/" + elem.id + "/details",
    function (data) {
      console.log(data);
      // updating contents of the quiz details modal before showing the modal
      modal_quiz_title.text(elem.dataset.quiz_title);
      modal_quiz_num_sections.text(elem.dataset.num_sections);
      modal_section_table_body.empty();
      data.forEach((section) => {
        let action = "";
        let statusColor = assignStatusColor(section.status[0]);
        if (section.time == 0) section.time = "Unlimited";
        action =
          "<a class='text-blue-600 underline' href='/quiz/attempt/" +
          elem.id +
          "/section/" +
          section.id +
          "'>" +
          section.status[1] +
          "</a>";
        console.log(section.status);
        modal_section_table_body.append(
          "<tr><td>" +
          section.title +
          "</td><td>" +
          section.num_questions +
          "</td><td>" +
          section.time +
          " minute(s)</td><td class='" +
          statusColor +
          "'>" +
          section.status[0] +
          "</td><td>" +
          action +
          "</td></tr>"
        );
      });
      // show modal
      showModal();
    },
    "json"
  );
}

$(document).ready(function () {
  const assessments_table_body = $("#assessments-table-body");
  modal_section_table_body = $("#modal-section-table-body");
  modal_quiz_num_sections = $("#modal-quiz-num-sections");
  modal_quiz_title = $("#modal-quiz-title");

  $.get(
    "/student/assignments",
    function (data) {
      console.log("data:", data)
      data.forEach((item) => {
        let [status, action] = item.status;
        let statusColor = assignStatusColor(status);
        assessments_table_body.append(
          "<tr><td>" +
          item.quiz_title +
          "</td><td>" +
          item.num_sections +
          "</td><td class='" +
          statusColor +
          "'>" +
          status +
          "</td><td>" +
          item.createdAt +
          "</td><td><a onClick='details(this)' data-quiz_title='" +
          item.quiz_title +
          "' data-num_sections='" +
          item.num_sections +
          "' id='" +
          item.quiz_id +
          "' class='text-blue-600 cursor-pointer'>" +
          action +
          "</a></td></tr>"
        );
      });
    },
    "json"
  );
});
