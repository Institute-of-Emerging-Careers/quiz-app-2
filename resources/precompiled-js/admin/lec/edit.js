"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var roundTitle = document.getElementById("lec-round-title-field").value;
var roundId = document.getElementById("lec-round-id-field").value;
var _React = React,
    useState = _React.useState,
    useEffect = _React.useEffect,
    useRef = _React.useRef;
var _luxon = luxon,
    DateTime = _luxon.DateTime,
    Duration = _luxon.Duration;

var save = function save(e) {
  e.preventDefault();
};

var App = function App() {
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      students = _useState2[0],
      setStudents = _useState2[1];

  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "font-bold"
  }, roundTitle), /*#__PURE__*/React.createElement("form", {
    className: "flex gap-x-2 justify-center items-center",
    onSubmit: save
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "agreement-template-link"
  }, "LEC Agreement Template PDF URL:"), /*#__PURE__*/React.createElement("input", {
    type: "url",
    name: "agreement-template-link",
    placeholder: "https://drive.google.com/...",
    className: "px-2 py-1 border basis-1/2"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "bg-iec-blue hover:bg-iec-blue-hover text-white px-2 py-1 cursor-pointer"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-save fas"
  }), " Save"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6"
  }, /*#__PURE__*/React.createElement(StudentsList, {
    students: students,
    title: "LEC Round",
    field_to_show_green_if_true: {
      field: "email_sent",
      text: "LEC Agreement email was sent"
    },
    fields: [{
      title: "Name",
      name: ["name"]
    }, {
      title: "Email",
      name: ["email"]
    }, {
      title: "Percentage Score",
      name: ["percentage_score"]
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6"
  }, /*#__PURE__*/React.createElement(NewStudentAdder, {
    all_students_api_endpoint_url: "/admin/lec/all-students/".concat(roundId),
    students_object: [students, setStudents],
    title: "LEC Round"
  })));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));