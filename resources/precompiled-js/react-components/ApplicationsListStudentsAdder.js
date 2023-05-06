"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ApplicationsListStudentsAdder = function ApplicationsListStudentsAdder(props) {
  var _useContext = useContext(MyContext),
      applications_object = _useContext.applications_object,
      modal_object = _useContext.modal_object;

  var _applications_object = _slicedToArray(applications_object, 2),
      applications = _applications_object[0],
      setApplications = _applications_object[1];

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      filtered_applications = _useState2[0],
      setFilteredApplications = _useState2[1];

  var _modal_object = _slicedToArray(modal_object, 2),
      show_modal = _modal_object[0],
      setShowModal = _modal_object[1];

  var _useState3 = useState([{
    type: "Filter by whether or not this quiz is assigned to this student",
    selected: 0,
    modes: [{
      text: "No filter",
      field: ["Student", "already_added"],
      expected_field_values: [false, true]
    }, {
      text: "Show only those who were assigned this quiz",
      selected: false,
      field: ["Student", "already_added"],
      expected_field_values: [true]
    }, {
      text: "Show only not those who were not assigned this quiz",
      selected: false,
      field: ["Student", "already_added"],
      expected_field_values: [false]
    }]
  }, {
    type: "Filter by whether or not this student's application was auto-rejected",
    selected: 0,
    modes: [{
      text: "No filter",
      selected: true,
      field: ["rejection_email_sent"],
      expected_field_values: [false, true]
    }, {
      text: "Show only those who were auto rejected",
      selected: false,
      field: ["rejection_email_sent"],
      expected_field_values: [true]
    }, {
      text: "Show only not those who were not auto rejected",
      selected: false,
      field: ["rejection_email_sent"],
      expected_field_values: [false]
    }]
  }, {
    type: "Filter by whether or not this student was emailed about the assessment",
    selected: 0,
    modes: [{
      text: "No filter",
      selected: true,
      field: ["assessment_email_sent"],
      expected_field_values: [false, true]
    }, {
      text: "Show only those who were emailed about assessment",
      selected: false,
      field: ["assessment_email_sent"],
      expected_field_values: [true]
    }, {
      text: "Show only not those who were not emailed about assessment",
      selected: false,
      field: ["assessment_email_sent"],
      expected_field_values: [false]
    }]
  }]),
      _useState4 = _slicedToArray(_useState3, 2),
      filters = _useState4[0],
      setFilters = _useState4[1];

  var student_id_to_array_index_map = useRef({});

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      loading = _useState6[0],
      setLoading = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      saved_success = _useState8[0],
      setSavedSuccess = _useState8[1];

  var assignmentButton = useRef(null);
  var setLoadAgain = props.setLoadAgain;

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      show_email_composer = _useState10[0],
      setShowEmailComposer = _useState10[1];

  var getValue = function getValue(obj, properties_array) {
    // if properties_array = ["Student","address"], then this funtion returns obj.Student.address
    return properties_array.reduce(function (final_value, property) {
      return final_value == null ? null : final_value[property];
    }, obj);
  };

  useEffect(function () {
    student_id_to_array_index_map.current = {};

    for (var i = 0; i < applications.length; i++) {
      student_id_to_array_index_map.current[applications[i].Student.id] = i;
    }

    setFilteredApplications(applications);
  }, [applications]);
  useEffect(function () {
    setFilteredApplications(applications.filter(function (application) {
      var show = true;

      for (var i = 0; i < filters.length; i++) {
        if (filters[i].selected != 0 && filters[i].modes[filters[i].selected].expected_field_values.indexOf(getValue(application, filters[i].modes[filters[i].selected].field)) == -1) {
          show = false;
        }
      }

      return show;
    }));
  }, [filters]);

  var assignQuizToSelectedStudents = function assignQuizToSelectedStudents() {
    setLoading(true);
    var list_of_student_ids_to_be_added = filtered_applications.filter(function (application) {
      return !application.Student.already_added && application.Student.added;
    }).map(function (application) {
      return [application.Student.id, application.id];
    });

    if (list_of_student_ids_to_be_added.length == 0) {
      setLoading(false);
      alert("You have not selected any new students.");
      return;
    }

    fetch("/quiz/assign/".concat(props.quiz_id), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        list_of_student_ids_to_be_added: list_of_student_ids_to_be_added
      })
    }).then(function (response) {
      if (response.ok) {
        setSavedSuccess(true);
        setTimeout(function () {
          setSavedSuccess(false);
        }, 3000);
        setLoadAgain(function (cur) {
          return cur + 1;
        });
      }
    }).catch(function (err) {
      console.log(err);
      alert("Quiz could not be assigned to Students due to an unknown error.");
    }).finally(function () {
      setLoading(false);
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    className: saved_success ? "col-span-1 p-3 float-right bg-green-500 hover:bg-green-600 text-white cursor-pointer border-r border-white" : applications.length > 0 ? "col-span-1 p-3 float-right bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer border-r border-white" : "col-span-1 p-3 float-right bg-gray-600 text-white cursor-not-allowed border-r border-white",
    onClick: assignQuizToSelectedStudents,
    ref: assignmentButton,
    disabled: filtered_applications.length > 0 ? false : true
  }, loading ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin"
  }) : !saved_success ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-check"
  }), " ", "Step 1: Assign Quiz to Selected Students"), /*#__PURE__*/React.createElement("button", {
    className: applications.length > 0 ? "col-span-1 p-3 float-right bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer border-r border-white" : "col-span-1 p-3 float-right bg-gray-600 text-white cursor-not-allowed border-r border-white",
    onClick: function onClick() {
      if (filtered_applications.map(function (application) {
        return application.Student;
      }).filter(function (student) {
        return student.added;
      }).length > 0) setShowEmailComposer(function (cur) {
        return !cur;
      });else alert("You haven't selected any new students.");
    },
    disabled: applications.length > 0 ? false : true
  }, show_email_composer ? /*#__PURE__*/React.createElement("i", {
    className: "far fa-paper-plane"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-paper-plane"
  }), "  ", "Step 2: Send Emails to Selected Students")), show_email_composer ? /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("p", null, "Please make sure you assign this quiz to selected students first, by clicking on the ", /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), " Step 1 button above."), /*#__PURE__*/React.createElement(EmailForm, {
    users: applications.map(function (application) {
      return application.Student;
    }).filter(function (student) {
      return student.added;
    }),
    sending_link: "/quiz/send-emails/".concat(props.quiz_id),
    applications: applications.filter(function (application) {
      return application.Student.added;
    }),
    default_values: {
      email_subject: "IEC Assessment",
      email_heading: "IEC Assessment",
      email_body: "Dear Student<br>You are receiving this email because you applied for the next cohort of the Institute of Emerging Careers.<br>Congratulations, your application has been shortlisted.<br>The next step is for you to solve a timed assessment. You have 3 days (72 hours) to solve this assessment.",
      email_button_pre_text: "Click the following button to solve the assessment.",
      email_button_label: "Solve Assessment",
      email_button_url: "Will be automatically set for each user"
    }
  })) : /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("h2", {
    className: "text-base text-center mb-4"
  }, /*#__PURE__*/React.createElement("b", null, "List of Applicants of this Round to whom you can assign the Quiz")), applications.length == 0 ? /*#__PURE__*/React.createElement("p", null, "No applicants in this application round.") : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "mb-3 p-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-green-400"
  }, "The green rows are students to whom you have already sent the assessment email."), " ", /*#__PURE__*/React.createElement("span", {
    className: "bg-gray-200"
  }, "The gray rows are students that have already been assigned to this quiz."), " ", /*#__PURE__*/React.createElement("span", {
    className: "bg-red-300"
  }, "The red rows are the applicants who were rejected due to the auto-rejection criteria such as age."), " ", /*#__PURE__*/React.createElement("span", {
    className: "bg-yellow-300"
  }, "The yellow rows are students who were rejected due to auto-rejection but also assigned this quiz for some reason.")), /*#__PURE__*/React.createElement("label", null, "Filters: "), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-x-2"
  }, filters.map(function (filter, filter_index) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, filter.type), /*#__PURE__*/React.createElement("select", {
      value: filters[filter_index].selected,
      "data-filter_index": filter_index,
      onChange: function onChange(e) {
        setFilters(function (cur) {
          var copy = cur.slice();
          copy[e.target.dataset.filter_index].selected = parseInt(e.target.value);
          console.log(copy);
          return copy;
        });
      },
      className: "p-2"
    }, filter.modes.map(function (filter_mode, filter_mode_index) {
      return [/*#__PURE__*/React.createElement("option", {
        value: filter_mode_index
      }, filter_mode.text)];
    })));
  })), /*#__PURE__*/React.createElement("p", null, filtered_applications.length, " rows"), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-sm"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    onChange: function onChange(e) {
      setFilteredApplications(function (cur) {
        return cur.map(function (app) {
          app.Student.added = e.target.checked;
          return app;
        });
      });
    }
  }), " ", filtered_applications.reduce(function (final, app) {
    if (final == false) return final;
    if (!app.Student.added) return false;
  }, true) == false ? "Select All" : "Unselect All"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Gender"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Phone"), /*#__PURE__*/React.createElement("th", null, "CNIC"), /*#__PURE__*/React.createElement("th", null, "Action"))), /*#__PURE__*/React.createElement("tbody", null, filtered_applications.map(function (application, index) {
    return /*#__PURE__*/React.createElement("tr", {
      key: application.id,
      className: application.assessment_email_sent ? "bg-green-400" : application.Student.already_added && application.rejection_email_sent ? "bg-yellow-300" : application.Student.already_added ? "bg-gray-200" : application.rejection_email_sent ? " bg-red-300" : ""
    }, /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      "data-id": application.Student.id,
      "data-index": index,
      checked: application.Student.added,
      onChange: function onChange(e) {
        setFilteredApplications(function (cur) {
          var copy = cur.slice();
          copy[e.target.dataset.index].Student.added = !copy[e.target.dataset.index].Student.added;
          return copy;
        });
      }
    })), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, "".concat(application.Student.firstName, " ").concat(application.Student.lastName)), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, application.Student.gender), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, application.Student.email), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, application.phone), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, application.Student.cnic), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
      "data-id": application.Student.id,
      onClick: function onClick(e) {
        setShowModal(student_id_to_array_index_map.current[e.target.dataset.id]);
      }
    }, "View Details")));
  })))));
};