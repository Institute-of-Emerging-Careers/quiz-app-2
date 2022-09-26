"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var MyContext = React.createContext();
var useEffect = React.useEffect;
var useState = React.useState;
var useContext = React.useContext;
var useRef = React.useRef;

var ContextProvider = function ContextProvider(props) {
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      applications = _useState2[0],
      setApplications = _useState2[1];

  var _useState3 = useState(-1),
      _useState4 = _slicedToArray(_useState3, 2),
      show_modal = _useState4[0],
      setShowModal = _useState4[1]; //value is set to the array index of the application whose details are to be shown by the modal


  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: {
      applications_object: [applications, setApplications],
      modal_object: [show_modal, setShowModal]
    }
  }, props.children);
};

var App = function App() {
  var _useContext = useContext(MyContext),
      applications_object = _useContext.applications_object,
      modal_object = _useContext.modal_object;

  var _applications_object = _slicedToArray(applications_object, 2),
      applications = _applications_object[0],
      setApplications = _applications_object[1];

  var _useState5 = useState([]),
      _useState6 = _slicedToArray(_useState5, 2),
      application_rounds = _useState6[0],
      setApplicationRounds = _useState6[1];

  var _modal_object = _slicedToArray(modal_object, 2),
      show_modal = _modal_object[0],
      setShowModal = _modal_object[1];

  var _useState7 = useState([]),
      _useState8 = _slicedToArray(_useState7, 2),
      assigned_students = _useState8[0],
      setAssignedStudents = _useState8[1];

  var _useState9 = useState(0),
      _useState10 = _slicedToArray(_useState9, 2),
      load_again = _useState10[0],
      setLoadAgain = _useState10[1];

  var _useState11 = useState(false),
      _useState12 = _slicedToArray(_useState11, 2),
      loading = _useState12[0],
      setLoading = _useState12[1];

  useEffect(function () {
    fetch("/admin/application/rounds/all").then(function (raw_response) {
      if (!raw_response.ok) {
        alert("Something went wrong while getting application rounds. Error code 01.");
      } else {
        raw_response.json().then(function (response) {
          setApplicationRounds(response.application_rounds);
        }).catch(function (err) {
          console.log(err);
          alert("Error while understanding the server's response. Error code 02.");
        });
      }
    }).catch(function (err) {
      alert("Please check your internet connection and try again. Error code 03.");
      console.log(err);
    });
  }, []);
  useEffect(function () {
    fetch("/quiz/all-assignees/".concat(document.getElementById("quiz-id-field").value)).then(function (raw_response) {
      if (!raw_response.ok) {
        alert("Something went wrong while getting current list of students to whom this quiz is assigned. Error code 01.");
      } else {
        raw_response.json().then(function (response) {
          setAssignedStudents(response);
        }).catch(function (err) {
          console.log(err);
          alert("Error while understanding the server's response about current list of assignees. Error code 02.");
        });
      }
    }).catch(function (err) {
      alert("Please check your internet connection and try again. Error code 03.");
      console.log(err);
    });
  }, [load_again]);

  var displayApplicationRoundStudents = function displayApplicationRoundStudents(e) {
    setLoading(true);
    var application_round_id = e.target.value;
    console.log("hi");
    fetch("/admin/application/all-applicants-and-quiz-assignments?application_round_id=".concat(application_round_id, "&quiz_id=").concat(document.getElementById("quiz-id-field").value)).then(function (raw_response) {
      if (raw_response.ok) {
        raw_response.json().then(function (response) {
          setApplications(response.applications);
        });
      } else {
        alert("Something went wrong. Code 01.");
      }
    }).catch(function (err) {
      console.log(err);
      alert("Something went wrong. Code 02.");
    }).finally(function () {
      setLoading(false);
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(StudentsList, {
    students: assigned_students,
    title: "List of Students to whom this Quiz is currently Assigned",
    fields: [, {
      title: "Name",
      name: ["Student.firstName", "Student.lastName"]
    }, {
      title: "Email",
      name: ["Student.email"]
    }, {
      title: "CNIC",
      name: ["Student.cnic"]
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-bold text-xl mb-2"
  }, "Assign Quiz to more Students"), /*#__PURE__*/React.createElement("label", null, "Select an Application Round: "), /*#__PURE__*/React.createElement("select", {
    value: "",
    onChange: displayApplicationRoundStudents,
    className: "py-2 px-3"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true,
    hidden: true
  }, "Select an option"), application_rounds.map(function (round) {
    return /*#__PURE__*/React.createElement("option", {
      key: round.id,
      value: round.id
    }, round.title);
  })), loading ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin"
  }) : /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("section", {
    className: "mt-6"
  }, /*#__PURE__*/React.createElement(ApplicantDetailsModal, null), /*#__PURE__*/React.createElement(ApplicationsListStudentsAdder, {
    quiz_id: document.getElementById("quiz-id-field").value,
    setLoadAgain: setLoadAgain
  }))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement(App, null)), document.getElementById("app"));