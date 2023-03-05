"use strict";

// eslint-disable-next-line
var StudentsList = function StudentsList(props) {
  var students = props.students;
  var fields = props.fields;
  var field_to_show_green_if_true = Object.prototype.hasOwnProperty.call(props, 'field_to_show_green_if_true') ? props.field_to_show_green_if_true : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "overflow-auto"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base text-center mb-4"
  }, /*#__PURE__*/React.createElement("b", null, "List of Students already added to this ", props.title)), field_to_show_green_if_true == null ? /*#__PURE__*/React.createElement("p", null) : /*#__PURE__*/React.createElement("p", null, "A student row will be ", /*#__PURE__*/React.createElement("span", {
    className: "bg-green-300"
  }, "green"), " if", ' ', field_to_show_green_if_true.text, " to that student."), students.length > 0 ? /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-sm"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, fields.map(function (field, index) {
    return /*#__PURE__*/React.createElement("th", {
      key: index
    }, field.title);
  }))), /*#__PURE__*/React.createElement("tbody", null, students.filter(function (student) {
    if (Object.prototype.hasOwnProperty.call(student, 'added') && !student.added) return false;else return true;
  }).map(function (student) {
    return /*#__PURE__*/React.createElement("tr", {
      key: "".concat(student.id, "-tr"),
      className: field_to_show_green_if_true != null ? student[field_to_show_green_if_true.field] ? 'bg-green-300' : '' : ''
    }, fields.map(function (field) {
      return /*#__PURE__*/React.createElement("td", {
        className: "border px-4 py-2",
        key: "".concat(student.id, "-").concat(field.name[0])
      }, field.name.reduce(function (final, cur) {
        return "".concat(final, " ").concat(student[cur]);
      }, ''));
    }));
  }))) : /*#__PURE__*/React.createElement("p", null, "No students added yet."));
};