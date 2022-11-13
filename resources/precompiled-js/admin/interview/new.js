"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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
var _luxon = luxon,
    DateTime = _luxon.DateTime,
    Duration = _luxon.Duration;
var interview_round_id = document.getElementById("interview-round-id-field").value;
var url = window.location.href.split("/");

if (url[url.length - 2] == "new") {
  window.location = "/admin/interview/edit/" + interview_round_id;
}

var ContextProvider = function ContextProvider(props) {
  var _useState = useState([{
    title: "Step 1: Add Interviewees (Students)",
    active: true
  }, {
    title: "Step 2: Add Interviewers",
    active: false
  }, {
    title: "Step 3: Send Invites",
    active: false
  }, {
    title: "Step 4: Results",
    active: false
  }]),
      _useState2 = _slicedToArray(_useState, 2),
      steps = _useState2[0],
      setSteps = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      students = _useState4[0],
      setStudents = _useState4[1]; // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not


  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: {
      steps_object: [steps, setSteps],
      students_object: [students, setStudents]
    }
  }, props.children);
};

var StepMenu = function StepMenu() {
  var _useContext = useContext(MyContext),
      steps_object = _useContext.steps_object;

  var _steps_object = _slicedToArray(steps_object, 2),
      steps = _steps_object[0],
      setSteps = _steps_object[1];

  var changeMenu = function changeMenu(e) {
    setSteps(function (cur) {
      var copy = cur.slice();

      for (var i = 0; i < copy.length; i++) {
        if (i == e.target.id) copy[i].active = true;else copy[i].active = false;
      }

      return copy;
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 w-full h-full mt-4"
  }, steps.map(function (step, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: index
    }, step.active ? /*#__PURE__*/React.createElement("div", {
      className: "cursor-default bg-iec-blue text-white shadow-inner px-6 py-4 border-r w-full h-full",
      id: index,
      key: index,
      onClick: changeMenu
    }, step.title) : /*#__PURE__*/React.createElement("div", {
      className: "cursor-pointer px-6 py-4 bg-white border-r w-full h-full",
      id: index,
      key: index,
      onClick: changeMenu
    }, step.title));
  }));
};

var Step1 = function Step1() {
  var _useContext2 = useContext(MyContext),
      students_object = _useContext2.students_object;

  var _students_object = _slicedToArray(students_object, 2),
      students = _students_object[0],
      setStudents = _students_object[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      loading = _useState6[0],
      setLoading = _useState6[1];

  var saveData = function saveData() {
    setLoading(true);
    fetch("/admin/interview/interviewees/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        students: students,
        interview_round_id: interview_round_id
      })
    }).then(function (response) {
      console.log(response);

      if (response.ok) {
        response.json().then(function (parsed_response) {
          console.log(parsed_response);

          if (parsed_response.success) {
            alert("Saved successfully.");
          }
        }).catch(function (err) {
          console.log(err);
          alert("Something went wrong. Error code 02.");
        });
      } else {
        alert("Could not save interviewees.");
      }
    }).catch(function (err) {
      console.log(err);
      alert("Something went wrong. Error code 01. Check your internet connection.");
    }).finally(function () {
      setLoading(false);
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm text-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: saveData,
    className: "ml-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 active:shadow-inner cursor-pointer"
  }, loading ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin text-lg"
  }), " Saving...") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), " Save Interviewees"))), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(StudentsList, {
    key: "".concat(students.id, "-tr"),
    students: students,
    title: "Interview",
    fields: [, {
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
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(NewStudentAdder, {
    all_students_api_endpoint_url: "/admin/interview/all-students/".concat(interview_round_id),
    students_object: students_object,
    title: "Interview"
  })));
};

var Step2 = function Step2() {
  var _useState7 = useState([]),
      _useState8 = _slicedToArray(_useState7, 2),
      interviewers = _useState8[0],
      setInterviewers = _useState8[1];

  var _useState9 = useState(""),
      _useState10 = _slicedToArray(_useState9, 2),
      new_interviewer_name = _useState10[0],
      setNewInterviewerName = _useState10[1];

  var _useState11 = useState(""),
      _useState12 = _slicedToArray(_useState11, 2),
      new_interviewer_email = _useState12[0],
      setNewInterviewerEmail = _useState12[1];

  var _useState13 = useState(false),
      _useState14 = _slicedToArray(_useState13, 2),
      show_email_composer = _useState14[0],
      setShowEmailComposer = _useState14[1];

  var _useState15 = useState(3),
      _useState16 = _slicedToArray(_useState15, 2),
      num_zoom_accounts = _useState16[0],
      setNumZoomAccounts = _useState16[1];

  var _useState17 = useState(num_zoom_accounts),
      _useState18 = _slicedToArray(_useState17, 2),
      original_num_zoom_accounts = _useState18[0],
      setOriginalNumZoomAccounts = _useState18[1];

  var _useState19 = useState(false),
      _useState20 = _slicedToArray(_useState19, 2),
      show_zoom_accounts_explanation = _useState20[0],
      setShowZoomAccountsExplanation = _useState20[1];

  var _useState21 = useState(false),
      _useState22 = _slicedToArray(_useState21, 2),
      show_modal = _useState22[0],
      setShowModal = _useState22[1];

  var _useState23 = useState(-1),
      _useState24 = _slicedToArray(_useState23, 2),
      selected_interviewer_index = _useState24[0],
      setSelectedInterviewerIndex = _useState24[1];

  var _useState25 = useState([]),
      _useState26 = _slicedToArray(_useState25, 2),
      specific_interviewers_to_email = _useState26[0],
      setSpecificInterviewersToEmail = _useState26[1];

  var _useState27 = useState(false),
      _useState28 = _slicedToArray(_useState27, 2),
      saving = _useState28[0],
      setSaving = _useState28[1];

  var _useState29 = useState(false),
      _useState30 = _slicedToArray(_useState29, 2),
      reload = _useState30[0],
      setReload = _useState30[1];

  var name_field = useRef();
  useEffect(function () {
    fetch("/admin/interview/interviewers/all/".concat(interview_round_id)).then(function (raw_response) {
      if (raw_response.ok) {
        raw_response.json().then(function (response) {
          setInterviewers(response.interviewers);
          setNumZoomAccounts(response.num_zoom_accounts);
          setOriginalNumZoomAccounts(response.num_zoom_accounts);
        });
      } else {
        alert("Error in URL. Wrong Interview Round. Please go to home page.");
      }
    });
  }, [reload]);
  useEffect(function () {
    setSpecificInterviewersToEmail(_toConsumableArray(interviewers.filter(function (interviewer) {
      return !interviewer.time_declared;
    })));
  }, [interviewers]);
  useEffect(function () {
    if (!show_modal) setSelectedInterviewerIndex(-1);
  }, [show_modal]);
  useEffect(function () {
    if (!show_email_composer) setSpecificInterviewersToEmail(interviewers.filter(function (interviewer) {
      return !interviewer.time_declared;
    }));
  }, [show_email_composer]);

  var saveData = function saveData() {
    setSaving(true);
    fetch("/admin/interview/update-interviewer-list/".concat(interview_round_id), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        interviewers: interviewers,
        num_zoom_accounts: num_zoom_accounts
      })
    }).then(function (response) {
      if (!response.ok) {
        alert("Error while saving.");
      }
    }).catch(function (err) {
      console.log(err);
      alert("Something went wrong. Check your internet connection.");
    }).finally(function () {
      setSaving(false);
    });
  };

  var deleteSlot = function deleteSlot(time_slot_id) {
    fetch("/admin/interview/interviewer/time-slot/delete/".concat(time_slot_id), {
      method: "DELETE"
    }).then(function (res) {
      if (res.ok) {
        setReload(function (cur) {
          return !cur;
        });
      } else {
        alert("Could not delete time slot. Some error occured at the server.");
      }
    }).catch(function (err) {
      console.log(err);
      alert("Error while deleting time slot. Are you sure your internet connection is working fine?");
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement("label", null, "Maximum number of interviewers that can select a particular time slot (aka number of zoom accounts):", " "), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: original_num_zoom_accounts,
    max: "500",
    value: num_zoom_accounts,
    onChange: function onChange(e) {
      setNumZoomAccounts(e.target.value);
    },
    className: "px-3 py-2 border mb-2"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-question-circle cursor-pointer text-iec-blue ml-1",
    onClick: function onClick() {
      setShowZoomAccountsExplanation(function (cur) {
        return !cur;
      });
    }
  }), show_zoom_accounts_explanation ? /*#__PURE__*/React.createElement("ul", {
    className: "list-disc px-8 text-justify"
  }, /*#__PURE__*/React.createElement("li", null, "This feature makes sure that not more than the specified number of interviewers try to select an overlapping time slot. For example, if number of zoom accounts is set to 3, then only 3 interviewers can select a specific time slot. If a 4th interviewer tries to select a time slot that overlaps with those 3 interviewers, then he/she will see an error."), /*#__PURE__*/React.createElement("li", null, "You cannot reduce the number of zoom accounts once it has been increased. This is because during the time when the greater number of zoom accounts was set, a greater number of team members may have selected the same time slot.")) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("form", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg"
  }, "Add New Interviewer"), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex gap-x-4 items-center"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "new-interviewer",
    className: "min-w-max"
  }, "Full Name:", " "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "150",
    name: "name",
    className: "w-full border py-3 px-4 mt-1 hover:shadow-sm",
    value: new_interviewer_name,
    onChange: function onChange(e) {
      setNewInterviewerName(e.target.value);
    },
    ref: name_field,
    active: "true"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "new-interviewer",
    className: "min-w-max"
  }, "Email:", " "), /*#__PURE__*/React.createElement("input", {
    type: "email",
    maxLength: "200",
    name: "email",
    value: new_interviewer_email,
    className: "w-full border py-3 px-4 mt-1 hover:shadow-sm",
    onChange: function onChange(e) {
      setNewInterviewerEmail(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3 px-6 border-2 border-gray-700 text-gray-700 cursor-pointer hover:bg-gray-700 hover:text-white",
    onClick: function onClick(e) {
      e.preventDefault();
      setInterviewers(function (cur) {
        var copy = cur.slice();
        copy.push({
          name: new_interviewer_name,
          email: new_interviewer_email,
          time_declared: false,
          time_slots: []
        });
        return copy;
      });
      setNewInterviewerName("");
      setNewInterviewerEmail("");
      ReactDOM.findDOMNode(name_field.current).focus();
    }
  }, "Add"))), /*#__PURE__*/React.createElement("hr", {
    className: "mt-4"
  }), show_email_composer ? /*#__PURE__*/React.createElement(EmailForm, {
    users: specific_interviewers_to_email,
    onFinish: function onFinish() {
      setShowEmailComposer(false);
    },
    sending_link: "/admin/interview/send-emails",
    default_values: {
      email_subject: "IEC Interview Time Slots",
      email_heading: "IEC Interview Time Slots",
      email_body: "Dear Team Member<br>We hope you are well.<br>Please let us know when you are free to conduct some interviews. You can do so below.<br>",
      email_button_pre_text: "Click the following button to log into your Interview Portal. <br>You will use the Interview Portal to declare your interview time slots, to find your Zoom credentials, and to record the Interview Scores of the students whom you interview.",
      email_button_label: "Log In",
      email_button_url: "Will be automatically set for each user"
    }
  }) : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    className: "flex mt-4 mb-4 justify-between items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg"
  }, "Interviewers Added"), /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-3 px-6 bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700",
    onClick: function onClick() {
      downloadAsCSV(interviewers);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-download"
  }), " Download as CSV"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-3 px-6 bg-iec-blue text-white cursor-pointer hover:bg-iec-blue-hover",
    onClick: function onClick() {
      setShowEmailComposer(function (cur) {
        return !cur;
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-paper-plane"
  }), " Send Emails to Interviewers who have not declared Time Slots yet"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-3 px-6 bg-green-500 text-white cursor-pointer hover:bg-green-600",
    onClick: saveData
  }, saving ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin self-center"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), " ", "Save Data"))), /*#__PURE__*/React.createElement("p", null, "Number of Zoom Accounts: ", num_zoom_accounts), selected_interviewer_index >= 0 ? /*#__PURE__*/React.createElement(Modal, {
    show_modal: show_modal,
    setShowModal: setShowModal,
    heading: "View Time Slots of ".concat(interviewers[selected_interviewer_index].name),
    content: /*#__PURE__*/React.createElement("table", {
      className: "w-full text-left"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      className: "p-2 border"
    }, "Sr. No."), /*#__PURE__*/React.createElement("th", {
      className: "p-2 border"
    }, "Start Time"), /*#__PURE__*/React.createElement("th", {
      className: "p-2 border"
    }, "End Time"), /*#__PURE__*/React.createElement("th", {
      className: "p-2 border"
    }, "Duration"), /*#__PURE__*/React.createElement("th", {
      className: "p-2 border"
    }, "Action"))), /*#__PURE__*/React.createElement("tbody", null, interviewers[selected_interviewer_index].time_slots.map(function (time_slot, index) {
      return /*#__PURE__*/React.createElement("tr", {
        key: index
      }, /*#__PURE__*/React.createElement("td", {
        className: "p-2 border"
      }, index + 1), /*#__PURE__*/React.createElement("td", {
        className: "p-2 border"
      }, DateTime.fromISO(time_slot.start).toLocaleString({
        weekday: "short",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      })), /*#__PURE__*/React.createElement("td", {
        className: "p-2 border"
      }, DateTime.fromISO(time_slot.end).toLocaleString({
        weekday: "short",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      })), /*#__PURE__*/React.createElement("td", {
        className: "p-2 border"
      }, Duration.fromMillis(time_slot.duration).toFormat("hh 'hours' mm 'minutes'")), /*#__PURE__*/React.createElement("td", {
        className: "p-2 border "
      }, /*#__PURE__*/React.createElement("a", {
        className: "cursor-pointer text-iec-blue hover:text-iec-blue-hover underline hover:no-underline",
        "data-index": index,
        onClick: function onClick(e) {
          deleteSlot(time_slot.id);
        }
      }, "Delete")));
    })))
  }) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-sm"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Time Declared?"), /*#__PURE__*/React.createElement("th", null, "Total Hours Dedicated"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, interviewers.map(function (interviewer, index) {
    return /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, interviewer.name), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, interviewer.email), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, interviewer.time_declared ? "Yes" : "No"), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, Duration.fromMillis(interviewer.time_slots.reduce(function (total_time, cur_slot) {
      return total_time += cur_slot.duration;
    }, 0)).toFormat("hh 'hours' mm 'minutes'")), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
      onClick: function onClick() {
        setShowModal(function (cur) {
          return !cur;
        });
        setSelectedInterviewerIndex(index);
      }
    }, /*#__PURE__*/React.createElement("i", {
      class: "far fa-eye"
    }), " View Time Slots"), "|", " ", /*#__PURE__*/React.createElement("a", {
      className: "cursor-pointer underline text-iec-blue hover:no-underline hover:text-iec-blue-hover",
      onClick: function onClick() {
        setShowModal(function (cur) {
          return !cur;
        });
        setSelectedInterviewerIndex(index);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash-alt"
    }), " Delete Slots"), " ", "|", " ", /*#__PURE__*/React.createElement("a", {
      className: "cursor-pointer underline text-iec-blue hover:no-underline hover:text-iec-blue-hover",
      onClick: function onClick() {
        setSpecificInterviewersToEmail([interviewer]);
        setShowEmailComposer(true);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "far fa-paper-plane"
    }), " Send Email asking", " ", interviewer.name, " to Declare Time Slots")));
  }))));
};

var Step3 = function Step3() {
  // continue here. Show the Admin how many interviewers have declared their time slots, who dedicated how many hours of time
  // ask the Admin how many minutes should each interview last. Then calcualte reactively on the frontend, whether or not
  // we have sufficient time commitment from the interviewers to conduct the interviews of the selected number of students
  // If yes, create a time slot assignment
  // if no, ask Admin to go back to "Step 2" and either increase interviewers or resend emails asking them to increase their times.
  var _useState31 = useState(0),
      _useState32 = _slicedToArray(_useState31, 2),
      interviewTime = _useState32[0],
      setInterviewTime = _useState32[1]; //time per interview (including buffer time)


  var _useState33 = useState([]),
      _useState34 = _slicedToArray(_useState33, 2),
      interviewers = _useState34[0],
      setInterviewers = _useState34[1]; //list of interviewers


  var _useContext3 = useContext(MyContext),
      students_object = _useContext3.students_object; //list of students


  return /*#__PURE__*/React.createElement("form", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg"
  }, "Add Interview Time"), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex gap-x-4 items-center"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "interview-time",
    className: "min-w-max"
  }, "Enter the time per interview (including any break time)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "150",
    name: "name",
    className: "w-full border py-3 px-20 mt-1 hover:shadow-sm",
    value: interviewTime,
    onChange: function onChange(e) {
      setInterviewTime(e.target.value);
    } // ref={name_field}
    ,
    active: "true"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3 px-6 border-2 border-gray-700 text-gray-700 cursor-pointer hover:bg-gray-700 hover:text-white",
    onClick: function onClick(e) {
      e.preventDefault();
      console.log(students_object);
    }
  }, "Add")));
};

var Step4 = function Step4() {
  return /*#__PURE__*/React.createElement("div", null, "Step 4");
};

var Main = function Main() {
  var _useContext4 = useContext(MyContext),
      steps_object = _useContext4.steps_object;

  var _steps_object2 = _slicedToArray(steps_object, 2),
      steps = _steps_object2[0],
      setSteps = _steps_object2[1];

  var _useState35 = useState(false),
      _useState36 = _slicedToArray(_useState35, 2),
      editInterviewRoundTitle = _useState36[0],
      setEditInterviewRoundTitle = _useState36[1];

  var _useState37 = useState(document.getElementById("interview-round-name-field").value),
      _useState38 = _slicedToArray(_useState37, 2),
      interviewRoundTitle = _useState38[0],
      setInterviewRoundTitle = _useState38[1];

  var _useState39 = useState(false),
      _useState40 = _slicedToArray(_useState39, 2),
      loading_name = _useState40[0],
      setLoadingName = _useState40[1];

  var updateInterviewRoundTitle = function updateInterviewRoundTitle(e) {
    e.preventDefault();
    setLoadingName(true);
    fetch("/admin/interview/update-round-title/".concat(document.getElementById("interview-round-id-field").value), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: interviewRoundTitle
      })
    }).then(function (response) {
      if (response.ok) {
        setEditInterviewRoundTitle(false);
      } else {
        alert("Error changing interview round name. Response code ".concat(response.status, "."));
      }
    }).catch(function (err) {
      console.log(err);
      alert("Something went worng. Make sure you have a working internet connection or contact IT. Error code 02.");
    }).finally(function () {
      setLoadingName(false);
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "/admin/interview"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-home"
  })), editInterviewRoundTitle ? /*#__PURE__*/React.createElement("form", {
    onSubmit: updateInterviewRoundTitle
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "50",
    name: "interview-round-title",
    value: interviewRoundTitle,
    onChange: function onChange(e) {
      setInterviewRoundTitle(e.target.value);
    },
    className: "px-4 py-2 min-w-max"
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    className: "p-2 bg-green-400 text-white cursor-pointer",
    value: loading_name ? "Saving..." : "Save"
  })) : /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl"
  }, "".concat(interviewRoundTitle, " "), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit cursor-pointer",
    onClick: function onClick() {
      setEditInterviewRoundTitle(function (cur) {
        return !cur;
      });
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepMenu, null)), steps[0].active ? /*#__PURE__*/React.createElement(Step1, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }), steps[1].active ? /*#__PURE__*/React.createElement(Step2, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }), steps[2].active ? /*#__PURE__*/React.createElement(Step3, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }), steps[3].active ? /*#__PURE__*/React.createElement(Step4, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }));
};

var App = function App() {
  return /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement(Main, null));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));