"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var modal = document.getElementById("modal");
var quiz_success = document.getElementById("quiz-success");

if (quiz_success != null) {
  setTimeout(function () {
    quiz_success.classList.add("hidden");
  }, 5000);
} // note: here modal is the black overlay in which the actual modal rests


var modal_section_table_body, modal_quiz_num_sections, modal_quiz_title;

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
  var statusColor = "";
  if (status == "In Progress") statusColor = "text-red-700";else if (status == "Completed") statusColor = "text-green-700";else if (status == "Incomplete") statusColor = "text-yellow-700";else statusColor = "";
  return statusColor;
}

function retrieveStatusAndAction(status, num_sections) {
  if (status == null) return ["Not Started", "Start"];else {
    var any_in_progress = false;
    var all_completed = true; // if we find even one non-completed section we set this to false

    for (var i = 0; i < status.length; i++) {
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
  $.get("/quiz/" + elem.id + "/details", function (data) {
    console.log(data); // updating contents of the quiz details modal before showing the modal

    modal_quiz_title.text(elem.dataset.quiz_title);
    modal_quiz_num_sections.text(elem.dataset.num_sections);
    modal_section_table_body.empty();
    data.forEach(function (section) {
      var action = "";
      var statusColor = assignStatusColor(section.status[0]);
      if (section.time == 0) section.time = "Unlimited";
      action = "<a class='text-blue-600 underline' href='/quiz/attempt/" + elem.id + "/section/" + section.id + "'>" + section.status[1] + "</a>";
      console.log(section.status);
      modal_section_table_body.append("<tr><td>" + section.title + "</td><td>" + section.num_questions + "</td><td>" + section.time + " minute(s)</td><td class='" + statusColor + "'>" + section.status[0] + "</td><td>" + action + "</td></tr>");
    }); // show modal

    showModal();
  }, "json");
}

$(document).ready(function () {
  var assessments_table_body = $("#assessments-table-body");
  modal_section_table_body = $("#modal-section-table-body");
  modal_quiz_num_sections = $("#modal-quiz-num-sections");
  modal_quiz_title = $("#modal-quiz-title");
  $.get("/student/assignments", function (data) {
    console.log("data:", data);
    data.forEach(function (item) {
      var _item$status = _slicedToArray(item.status, 2),
          status = _item$status[0],
          action = _item$status[1];

      var statusColor = assignStatusColor(status);
      assessments_table_body.append("<tr><td>" + item.quiz_title + "</td><td>" + item.num_sections + "</td><td class='" + statusColor + "'>" + status + "</td><td>" + item.createdAt + "</td><td><a onClick='details(this)' data-quiz_title='" + item.quiz_title + "' data-num_sections='" + item.num_sections + "' id='" + item.quiz_id + "' class='text-blue-600 cursor-pointer'>" + action + "</a></td></tr>");
    });
  }, "json");
});