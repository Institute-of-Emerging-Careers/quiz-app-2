"use strict";

const StudentsList = props => {
  let students = props.students;
  const fields = props.fields;
  const field_to_show_green_if_true = props.hasOwnProperty("field_to_show_green_if_true") ? props.field_to_show_green_if_true : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "overflow-auto"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base text-center"
  }, /*#__PURE__*/React.createElement("b", null, "List of Students already added to this ", props.title)), field_to_show_green_if_true == null ? /*#__PURE__*/React.createElement("p", null) : /*#__PURE__*/React.createElement("p", {
    className: "text-gray-700 mt-4"
  }, "A student row will be ", /*#__PURE__*/React.createElement("span", {
    className: "bg-green-300"
  }, "green"), " if", " ", field_to_show_green_if_true.text, " to that student."), students.length > 0 ? /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-sm mt-4"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, fields.map(field => /*#__PURE__*/React.createElement("th", null, field.title)))), /*#__PURE__*/React.createElement("tbody", null, students.filter(student => {
    if (student.hasOwnProperty("added") && !student.added) return false;else return true;
  }).map(student => /*#__PURE__*/React.createElement("tr", {
    key: "".concat(student.id, "-tr"),
    className: field_to_show_green_if_true != null ? student[field_to_show_green_if_true.field] ? "bg-green-300" : "" : ""
  }, fields.map(field => /*#__PURE__*/React.createElement("td", {
    className: "border px-4 py-2",
    key: "".concat(student.id, "-").concat(field.name[0])
  }, field.name.reduce((final, cur) => {
    return "".concat(final, " ").concat(student[cur]);
  }, ""))))))) : /*#__PURE__*/React.createElement("p", {
    className: "mt-4"
  }, "No students added yet."));
};