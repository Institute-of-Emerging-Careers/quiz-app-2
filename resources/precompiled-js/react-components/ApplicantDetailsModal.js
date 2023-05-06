"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ApplicantDetailsModal = function ApplicantDetailsModal(props) {
  var _useContext = useContext(MyContext),
      applications_object = _useContext.applications_object,
      modal_object = _useContext.modal_object;

  var _applications_object = _slicedToArray(applications_object, 2),
      applications = _applications_object[0],
      setApplications = _applications_object[1];

  var _modal_object = _slicedToArray(modal_object, 2),
      show_modal = _modal_object[0],
      setShowModal = _modal_object[1];

  var _useState = useState([{
    title: "Age Group",
    name: ["age_group"]
  }, {
    title: "City of Residence",
    name: ["city"]
  }, {
    title: "Education Completed",
    name: ["education_completed"]
  }, {
    title: "Employment type",
    name: ["type_of_employment"]
  }, {
    title: "Course Preference",
    name: ["first preference", "title"]
  }]),
      _useState2 = _slicedToArray(_useState, 2),
      questions = _useState2[0],
      setQuestions = _useState2[1];

  var formatOutput = function formatOutput(output) {
    console.log(output);
    if (output === false) return "No";else if (output === true) return "Yes";else return output;
  };

  var getValue = function getValue(obj, properties_array) {
    // if properties_array = ["Student","address"], then this funtion returns obj.Student.address
    return properties_array.reduce(function (final_value, property) {
      return final_value == null ? null : final_value[property];
    }, obj);
  };

  return /*#__PURE__*/React.createElement("div", null, show_modal > -1 ? /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: "h-screen w-full inset-0 fixed z-30 bg-black/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: " h-90vh mt-10 w-1/2 bg-white translate-x-2/4 shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, "".concat(applications[show_modal].Student.firstName, " ").concat(applications[show_modal].Student.lastName)), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: function onClick() {
      setShowModal(-1);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8 h-80vh overflow-y-scroll"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-sm"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Question"), /*#__PURE__*/React.createElement("th", null, "Answer"))), /*#__PURE__*/React.createElement("tbody", null, questions.map(function (question, index) {
    return /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, question.title), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, formatOutput(getValue(applications[show_modal], question.name))));
  })))))) : /*#__PURE__*/React.createElement("div", null));
};