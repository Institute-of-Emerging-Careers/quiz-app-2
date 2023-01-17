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
var useMemo = React.useMemo;

var App = function App() {
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      interview_rounds = _useState2[0],
      setInterviewRounds = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      all_assessments = _useState4[0],
      setAllAssessments = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      show_modal = _useState6[0],
      setShowModal = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      reload = _useState8[0],
      setReload = _useState8[1];

  useEffect(function () {
    fetch("/admin/interview/all").then(function (raw_response) {
      raw_response.json().then(function (response) {
        if (response.success) setInterviewRounds(response.interview_rounds);else alert("Something went wrong while getting interview rounds. Error code 01.");
      }).catch(function (err) {
        alert("Error while understanding the server's response. Error code 02.");
      });
    }).catch(function (err) {
      alert("Please check your internet connection and try again. Error code 03.");
    });
    fetch("/quiz/all-titles-and-num-attempts").then(function (response) {
      response.json().then(function (parsed_response) {
        setAllAssessments(parsed_response);
      });
    });
  }, [reload]);

  var createNewInterview = function createNewInterview(e) {
    window.location = "/admin/interview/new/".concat(e.target.value);
  };

  var deleteInterviewRound = function deleteInterviewRound(interview_round_id) {
    fetch("/admin/interview/round/delete/".concat(interview_round_id)).then(function (res) {
      if (res.ok) setReload(function (cur) {
        return !cur;
      });else alert("Error on server while deleting interview round.");
    }).catch(function (err) {
      console.log(err);
      alert("Error deleting interview round. Check your internet connection.");
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: show_modal ? "h-screen w-screen inset-0 absolute z-30 bg-black/60" : "hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto mt-10 w-1/2 bg-white left-1/4 translate-x-2/4 shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-link text-xl text-white"
  }), " Create New Interview Round"), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: function onClick() {
      setShowModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8"
  }, /*#__PURE__*/React.createElement("p", null, "Please choose an Assessment to link to this Interview Round. You will invite Students to this Interview Round based on their results in the chosen Assessment."), /*#__PURE__*/React.createElement("select", {
    className: "w-full p-2",
    onChange: createNewInterview
  }, /*#__PURE__*/React.createElement("option", {
    className: "p-2",
    selected: true,
    disabled: true
  }, "Choose an Assessment"), all_assessments.map(function (assessment) {
    return /*#__PURE__*/React.createElement("option", {
      className: "p-2",
      value: assessment.id,
      key: assessment.id
    }, assessment.title, " | ", assessment.num_assignments, " Assignments", " ");
  }))))), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl mt-6 mb-4 font-bold"
  }, "Interview Rounds", /*#__PURE__*/React.createElement("button", {
    className: "text-xs px-4 py-1 cursor-pointer bg-iec-blue hover:bg-iec-blue-hover text-white rounded-full",
    onClick: function onClick() {
      setShowModal(function (cur) {
        return !cur;
      });
    }
  }, "NEW")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-start gap-y-10 gap-x-10"
  }, interview_rounds.map(function (interview_round, index) {
    return /*#__PURE__*/React.createElement("div", {
      className: "grid w-64 grid-cols-6 gap-4 border bg-white pb-2 quiz-card",
      key: index
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 col-span-8 h-16 bg-iec-blue justify-center content-center"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/admin/interview/edit/".concat(interview_round.id),
      className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
      title: "Edit Interview Round"
    }, /*#__PURE__*/React.createElement("i", {
      className: "far fa-edit "
    })), /*#__PURE__*/React.createElement("a", {
      className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
      title: "Delete Interview Round",
      onClick: function onClick() {
        deleteInterviewRound(interview_round.id);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash "
    }))), /*#__PURE__*/React.createElement("h3", {
      className: "col-span-6 font-semibold text-lg px-4"
    }, interview_round.title), /*#__PURE__*/React.createElement("div", {
      className: "col-start-1 col-span-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "pl-4 pt-0"
    }, "0 invited")), /*#__PURE__*/React.createElement("div", {
      className: "col-start-4 col-span-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "pr-4 pt-0"
    }, "0 attended")));
  })));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));