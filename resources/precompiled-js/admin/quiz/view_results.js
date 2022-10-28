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
var quiz_id = document.getElementById("quiz-id-field").value;

var ContextProvider = function ContextProvider(props) {
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      students = _useState2[0],
      setStudents = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      sections = _useState4[0],
      setSections = _useState4[1];

  var _useState5 = useState(0),
      _useState6 = _slicedToArray(_useState5, 2),
      quiz_total_score = _useState6[0],
      setQuizTotalScore = _useState6[1]; // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not


  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: {
      students_obj: [students, setStudents],
      sections_obj: [sections, setSections],
      quiz_total_score_obj: [quiz_total_score, setQuizTotalScore]
    }
  }, props.children);
};

var StudentsList = function StudentsList() {
  var _useContext = useContext(MyContext),
      students_obj = _useContext.students_obj,
      sections_obj = _useContext.sections_obj,
      quiz_total_score_obj = _useContext.quiz_total_score_obj;

  var _students_obj = _slicedToArray(students_obj, 2),
      students = _students_obj[0],
      setStudents = _students_obj[1];

  var _sections_obj = _slicedToArray(sections_obj, 2),
      sections = _sections_obj[0],
      setSections = _sections_obj[1];

  var _quiz_total_score_obj = _slicedToArray(quiz_total_score_obj, 2),
      quiz_total_score = _quiz_total_score_obj[0],
      setQuizTotalScore = _quiz_total_score_obj[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      show_student_personal_details = _useState8[0],
      setShowStudentPersonalDetails = _useState8[1];

  var _useState9 = useState("all"),
      _useState10 = _slicedToArray(_useState9, 2),
      assignmentStatusFilter = _useState10[0],
      setAssignmentStatusFilter = _useState10[1];

  var _useState11 = useState([]),
      _useState12 = _slicedToArray(_useState11, 2),
      filters = _useState12[0],
      setFilters = _useState12[1];

  var _useState13 = useState(0),
      _useState14 = _slicedToArray(_useState13, 2),
      min_score = _useState14[0],
      setMinScore = _useState14[1];

  var _useState15 = useState([]),
      _useState16 = _slicedToArray(_useState15, 2),
      filtered_students = _useState16[0],
      setFilteredStudents = _useState16[1];

  var _useState17 = useState(true),
      _useState18 = _slicedToArray(_useState17, 2),
      loading = _useState18[0],
      setLoading = _useState18[1];

  var _useState19 = useState(false),
      _useState20 = _slicedToArray(_useState19, 2),
      reload_results = _useState20[0],
      setReloadResults = _useState20[1];

  var _useState21 = useState(10),
      _useState22 = _slicedToArray(_useState21, 2),
      num_rows_shown = _useState22[0],
      setNumRowsShown = _useState22[1];

  var _useState23 = useState(false),
      _useState24 = _slicedToArray(_useState23, 2),
      show_filters = _useState24[0],
      setShowFilters = _useState24[1];

  var _useState25 = useState(false),
      _useState26 = _slicedToArray(_useState25, 2),
      show_section_details = _useState26[0],
      setShowSectionDetails = _useState26[1];

  var _useState27 = useState({}),
      _useState28 = _slicedToArray(_useState27, 2),
      courses = _useState28[0],
      setCourses = _useState28[1];

  var application_fields = [{
    is_preference_field: false,
    name: "phone",
    text: "Phone Number"
  }, {
    is_preference_field: false,
    name: "gender",
    text: "Gender"
  }, {
    is_preference_field: false,
    name: "age",
    text: "Age"
  }, {
    is_preference_field: false,
    name: "city",
    text: "City"
  }, {
    is_preference_field: false,
    name: "province",
    text: "Province"
  }, {
    is_preference_field: false,
    name: "country",
    text: "Country"
  }, {
    is_preference_field: false,
    name: "address",
    text: "Home Address"
  }, {
    is_preference_field: false,
    name: "father_name",
    text: "Father Name"
  }, {
    is_preference_field: false,
    name: "current_address",
    text: "Current Address"
  }, {
    is_preference_field: false,
    name: "belongs_to_flood_area",
    text: "Belongs to flood area"
  }, {
    is_preference_field: false,
    name: "can_pay_2000",
    text: "Can pay 2000"
  }, {
    is_preference_field: false,
    name: "how_to_enroll",
    text: "How will you enroll in the course (Standard/FA)"
  }, {
    is_preference_field: false,
    name: "education_completed",
    text: "Education Completed"
  }, {
    is_preference_field: false,
    name: "education_completed_major",
    text: "Education Completed Major"
  }, {
    is_preference_field: false,
    name: "education_ongoing",
    text: "Ongoing Education"
  }, {
    is_preference_field: false,
    name: "education_ongoing_major",
    text: "Ongoing Education Major"
  }, {
    is_preference_field: false,
    name: "has_completed_ba",
    text: "Has completed Bachelor's"
  }, {
    is_preference_field: false,
    name: "has_completed_diploma",
    text: "Has completed Diploma"
  }, {
    is_preference_field: false,
    name: "inst_degree_dip",
    text: "Institute of Degree/Diploma"
  }, {
    is_preference_field: false,
    name: "monthly_family_income",
    text: "Monthly Family Income"
  }, {
    is_preference_field: false,
    name: "computer_and_internet_access",
    text: "Computer and Internet Access"
  }, {
    is_preference_field: false,
    name: "internet_facility_in_area",
    text: "Internet Facility in Area"
  }, {
    is_preference_field: false,
    name: "time_commitment",
    text: "30-40 hours commitment"
  }, {
    is_preference_field: false,
    name: "is_employed",
    text: "Is employed or not"
  }, {
    is_preference_field: false,
    name: "type_of_employment",
    text: "Type of Employment"
  }, {
    is_preference_field: false,
    name: "salary",
    text: "Salary"
  }, {
    is_preference_field: false,
    name: "will_leave_job",
    text: "Will leave job if asked to or not"
  }, {
    is_preference_field: false,
    name: "has_applied_before",
    text: "Has applied to IEC before or not"
  }, {
    name: "firstPreferenceId",
    text: "First Preference",
    is_preference_field: true
  }, {
    name: "secondPreferenceId",
    text: "Second Preference",
    is_preference_field: true
  }, {
    name: "thirdPreferenceId",
    text: "Third Preference",
    is_preference_field: true
  }, {
    is_preference_field: false,
    name: "preference_reason",
    text: "Preference Reason"
  }, {
    is_preference_field: false,
    name: "is_comp_sci_grad",
    text: "Is a Computer Science Graduate"
  }, {
    is_preference_field: false,
    name: "how_heard_about_iec",
    text: "How did the applicant hear about IEC"
  }, {
    is_preference_field: false,
    name: "will_work_full_time",
    text: "Will the applicant work full time after graduating from IEC"
  }, {
    is_preference_field: false,
    name: "acknowledge_online",
    text: "Acknowledge that Program is online"
  }, {
    name: "rejection_email_sent",
    text: "Was the Applicant auto-rejected"
  }, {
    is_preference_field: false,
    name: "assessment_email_sent",
    text: "Was the Applicant emailed the Assessment"
  }];
  useEffect(function () {
    setFilters([{
      title: "Gender",
      name: "gender",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: genders.map(function (val) {
        return {
          value: val,
          checked: false
        };
      }),
      expand_possible_values: false
    }, {
      title: "Age Group",
      name: "age_group",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: age_groups.map(function (val) {
        return {
          value: val,
          checked: false
        };
      }),
      expand_possible_values: false
    }, {
      title: "City of Residence",
      name: "city",
      filter_type: "fixed_values",
      possible_values: cities.map(function (val) {
        return {
          value: val,
          checked: false
        };
      }),
      discrepancy_between_value_and_text: false,
      expand_possible_values: false
    }, {
      title: "Province of Residence",
      name: "province",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: provinces.map(function (val) {
        return {
          value: val,
          checked: false
        };
      }),
      expand_possible_values: false
    }, {
      title: "Country of Residence",
      name: "country",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: cities.map(function (val) {
        return {
          value: val,
          checked: false
        };
      }),
      expand_possible_values: false
    }, {
      title: "From flood affected areas",
      name: "belongs_to_flood_area",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }],
      expand_possible_values: false
    }, {
      title: "Can pay 2000",
      name: "can_pay_2000",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }],
      expand_possible_values: false
    }, {
      title: "How will you enroll (Standard/FA)?",
      name: "how_to_enroll",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Standard",
        value: 1,
        checked: false
      }, {
        text: "Financial Aid",
        value: 0,
        checked: false
      }],
      expand_possible_values: false
    }, {
      title: "Have you completed a bachelor's degree?",
      name: "has_completed_ba",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }, {
      title: "Have you completed a Diploma?",
      name: "has_completed_diploma",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }, {
      title: "Education Completed",
      name: "education_completed",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: education_levels.map(function (val) {
        return {
          value: val,
          checked: false
        };
      }),
      expand_possible_values: false
    }, {
      title: "Degree choice influence",
      name: "education_completed",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: education_levels.map(function (val) {
        return {
          value: val,
          checked: false
        };
      }),
      expand_possible_values: false
    }, {
      title: "Minimum Monthly Family Income",
      name: "monthly_family_income",
      filter_type: "integer_value",
      min: 0,
      max: 200000,
      increment: 5000,
      value: 0,
      unit: "PKR"
    }, {
      title: "Minimum Current salary",
      name: "salary",
      filter_type: "integer_value",
      min: 0,
      max: 200000,
      increment: 5000,
      value: 0,
      unit: "PKR"
    }, {
      title: "Do you have computer and internet access?",
      name: "computer_and_internet_access",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }, {
      title: "Is there reliable internet facility in your area?",
      name: "internet_facility_in_area",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }, {
      title: "Can you spend 30 to 40 hours a week on the program?",
      name: "time_commitment",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }, {
      title: "Are you currently employed?",
      name: "is_employed",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }, {
      title: "Employment type",
      name: "type_of_employment",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: type_of_employment.map(function (val) {
        return {
          value: val,
          checked: false
        };
      })
    }, {
      title: "Will you be willing to leave the job to attend the program full time, if you are given a stipend of a percentage of the salary?",
      name: "will_leave_job",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }, {
      title: "Have you applied to IEC before?",
      name: "has_applied_before",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }, {
      title: "Are you a graduate in computer science or any related field?",
      name: "is_comp_sci_grad",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }, {
      title: "After graduating from IEC, if we provide you with a Full Time Job opportunity, will you be willing to accept the job?",
      name: "will_work_full_time",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }, {
      title: "The program is entirely online. Do you acknowledge that?",
      name: "acknowledge_online",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }, {
      title: "Applicant automatically rejected and rejection email sent",
      name: "rejection_email_sent",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [{
        text: "Yes",
        value: 1,
        checked: false
      }, {
        text: "No",
        value: 0,
        checked: false
      }]
    }]);
  }, []);
  useEffect(function () {
    setLoading(true);
    fetch("/quiz/".concat(quiz_id, "/results-data")).then(function (raw_data) {
      setLoading(false);

      if (raw_data.ok) {
        raw_data.json().then(function (obj) {
          setStudents(obj.data);
          setCourses(obj.courses);
          setSections(obj.quiz_sections);
          setQuizTotalScore(obj.quiz_total_score);
          setLoading(false);
        }).catch(function (err) {
          console.log(err);
          alert("Server returned invalid results. Contact IT Team.");
        });
      } else {
        console.log("Server returned not ok status. Contact IT Team.");
      }
    }).catch(function (err) {
      console.log(err);
      alert("Something went wrong. Contact IT Team.");
    });
  }, [reload_results]);
  useEffect(function () {
    setFilteredStudents(students);
  }, [students]);

  var setAllCheckBoxes = function setAllCheckBoxes(filter_index, checked) {
    setFilters(function (cur) {
      var copy = cur.slice();
      copy[filter_index].possible_values = copy[filter_index].possible_values.map(function (possible_value_obj) {
        possible_value_obj.checked = checked;
        return possible_value_obj;
      });
      return copy;
    });
  };

  useEffect(function () {
    setFilteredStudents(students.filter(function (student) {
      var show_this_application = student.percentage_total < min_score ? false : assignmentStatusFilter == "all" ? true : assignmentStatusFilter == "completed-only" && student.completed ? true : assignmentStatusFilter == "not-completed-only" && !student.completed ? true : assignmentStatusFilter == "started-only" && (student.started || student.completed) ? true : assignmentStatusFilter == "started-not-completed-only" && student.started && !student.completed ? true : assignmentStatusFilter == "not-started-only" && !student.started ? true : false;
      if (!show_this_application) return false;

      var _loop = function _loop(i) {
        var filter = filters[i];

        if (filter.filter_type == "integer_value" && student[filter.name] < filter.value) {
          show_this_application = false;
          return "break";
        } else if (filter.filter_type == "fixed_values" && filter.possible_values.length > 0 && filter.possible_values.reduce(function (prev, cur) {
          if (prev) return prev;
          if (cur.checked) return true;else return false;
        }, false) && filter.possible_values.reduce(function (prev, cur) {
          if (prev) return prev;else if (cur.checked && cur.value == student[filter.name]) return true;else return false;
        }, false) == false) {
          show_this_application = false;
          return "break";
        }
      };

      for (var i = 0; i < filters.length; i++) {
        var _ret = _loop(i);

        if (_ret === "break") break;
      }

      return show_this_application;
    }));
    if (num_rows_shown > filtered_students.length && filtered_students.length > 0) setNumRowsShown(filtered_students.length);
  }, [filters, assignmentStatusFilter, min_score]);

  function download_table_as_csv(table_id) {
    var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ",";
    // Select rows from table_id
    var rows = document.querySelectorAll("table#" + table_id + " tr");
    console.log(rows); // Construct csv

    var csv = [];

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].style.display != "none") {
        var row = [],
            cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++) {
          // Clean innertext to remove multiple spaces and jumpline (break csv)
          var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, "").replace(/(\s\s)/gm, " "); // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)

          data = data.replace(/"/g, '""'); // Push escaped string

          row.push('"' + data + '"');
        }

        csv.push(row.join(separator));
      }
    }

    if (csv.length == 1) {
      //the 1 row is the header row
      alert("Sorry! No rows to export. Change the filters.");
    } else {
      var csv_string = csv.join("\n"); // Download it

      var filename = "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
      var link = document.createElement("a");
      link.style.display = "none";
      link.setAttribute("target", "_blank");
      link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv_string));
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  function resetStudentAssignment(e) {
    var x = prompt("Are you sure? Enter \"yes\" or \"no\".");

    if (x == "yes") {
      fetch("/reset-assignment/student/".concat(e.target.dataset.student_id, "/quiz/").concat(quiz_id)).then(function (res) {
        if (res.ok) {
          alert("Successfully reset assignment. Reloading page now.");
          setReloadResults(function (cur) {
            return !cur;
          });
        } else {
          alert("Error. Could not reset assignment. Reloading page now.");
        }
      });
    }
  }

  function resetOneSection(student_id, quiz_id) {
    var prompt_text = "Which of the following sections do you want to delete?\n";
    prompt_text += sections.reduce(function (final, cur, index) {
      return "".concat(final, "Press ").concat(index, " to delete \"").concat(cur.section_title, "\"\n");
    }, "");
    var choice = prompt(prompt_text);
    fetch("/quiz/reset-section-attempt/".concat(student_id, "/").concat(sections[choice].section_id)).then(function (res) {
      if (res.ok) {
        alert("Section reset");
        setReloadResults(function (cur) {
          return !cur;
        });
      } else alert("Error. Could not reset section. Reloading page now.");
    }).catch(function (err) {
      alert("Error. Could not reset section.");
      console.log(err);
    });
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
    onClick: function onClick(e) {
      setShowFilters(function (cur) {
        return !cur;
      });
    }
  }, show_filters ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "far fa-eye-slash"
  }), " Hide Filters") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "far fa-eye"
  }), " Show Application Data Filters")), show_filters ? filters.map(function (filter, index) {
    return filter.filter_type == "integer_value" ? /*#__PURE__*/React.createElement("div", {
      className: "w-full grid grid-cols-10 align-middle mb-2"
    }, /*#__PURE__*/React.createElement("label", {
      className: "col-span-2"
    }, filter.title, ":"), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: filter.min,
      max: filter.max,
      step: filter.increment,
      value: filter.value,
      "data-index": index,
      className: "col-span-7 align-middle",
      onChange: function onChange(e) {
        setFilters(function (cur) {
          var copy = cur.slice();
          copy[e.target.dataset.index]["value"] = e.target.value;
          return copy;
        });
      }
    }), /*#__PURE__*/React.createElement("label", {
      className: "pl-2 col-span-1"
    }, filter.value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"), " ", filter.unit)) : filter.filter_type == "fixed_values" && filter.discrepancy_between_value_and_text ? /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-4"
    }, /*#__PURE__*/React.createElement("label", {
      className: "col-span-1"
    }, filter.title), /*#__PURE__*/React.createElement("div", {
      className: "col-span-3"
    }, filter.expand_possible_values ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:underline cursor-pointer",
      "data-filter_index": index,
      onClick: function onClick(e) {
        setAllCheckBoxes(e.target.dataset.filter_index, true);
      }
    }, "Check All"), " ", /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:underline cursor-pointer",
      "data-filter_index": index,
      onClick: function onClick(e) {
        setAllCheckBoxes(e.target.dataset.filter_index, false);
      }
    }, "Uncheck All"), filter.possible_values.map(function (possible_value_obj, i2) {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        name: filter.name,
        "data-filter_index": index,
        "data-possible_value_index": i2,
        checked: possible_value_obj.checked,
        value: possible_value_obj.value,
        onChange: function onChange(e) {
          setFilters(function (cur) {
            var copy = cur.slice();
            copy[e.target.dataset.filter_index].possible_values[e.target.dataset.possible_value_index]["checked"] = !copy[e.target.dataset.filter_index].possible_values[e.target.dataset.possible_value_index]["checked"];
            return copy;
          });
        }
      }), /*#__PURE__*/React.createElement("label", null, possible_value_obj.text));
    })) : /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
      "data-filter_index": index,
      onClick: function onClick(e) {
        setFilters(function (cur) {
          var copy = _toConsumableArray(cur);

          copy[e.target.dataset.filter_index].expand_possible_values = true;
          return copy;
        });
      }
    }, "Click here to show all possible value filters"))) : filter.filter_type == "fixed_values" && !filter.discrepancy_between_value_and_text ? /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-4"
    }, /*#__PURE__*/React.createElement("label", {
      className: "col-span-1"
    }, filter.title), /*#__PURE__*/React.createElement("div", {
      className: "col-span-3"
    }, !filter.expand_possible_values ? /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
      "data-filter_index": index,
      onClick: function onClick(e) {
        setFilters(function (cur) {
          var copy = _toConsumableArray(cur);

          copy[e.target.dataset.filter_index].expand_possible_values = true;
          return copy;
        });
      }
    }, "Click here to show all possible value filters") : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-x-2"
    }, /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:underline cursor-pointer",
      "data-filter_index": index,
      onClick: function onClick(e) {
        setAllCheckBoxes(e.target.dataset.filter_index, true);
      }
    }, "Check All"), /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:underline cursor-pointer",
      "data-filter_index": index,
      onClick: function onClick(e) {
        setAllCheckBoxes(e.target.dataset.filter_index, false);
      }
    }, "Uncheck All")), filter.possible_values.map(function (possible_value_obj, i2) {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        name: filter.name,
        "data-filter_index": index,
        "data-possible_value_index": i2,
        checked: possible_value_obj.checked,
        value: possible_value_obj.value,
        onChange: function onChange(e) {
          setFilters(function (cur) {
            var copy = cur.slice();
            copy[e.target.dataset.filter_index].possible_values[e.target.dataset.possible_value_index]["checked"] = !copy[e.target.dataset.filter_index].possible_values[e.target.dataset.possible_value_index]["checked"];
            return copy;
          });
        }
      }), /*#__PURE__*/React.createElement("label", null, possible_value_obj.value));
    })))) : /*#__PURE__*/React.createElement("div", null);
  }) : /*#__PURE__*/React.createElement("p", null)), /*#__PURE__*/React.createElement("div", {
    className: "mb-2 text-xs",
    id: "filters"
  }, /*#__PURE__*/React.createElement("label", null, "Choose a filter: "), /*#__PURE__*/React.createElement("select", {
    value: assignmentStatusFilter,
    onChange: function onChange(e) {
      setAssignmentStatusFilter(e.target.value);
    },
    className: "px-3 py-2"
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "Show all Students"), /*#__PURE__*/React.createElement("option", {
    value: "completed-only"
  }, "Show only those who have completed their assessment"), /*#__PURE__*/React.createElement("option", {
    value: "not-completed-only"
  }, "Show only those who have not completed their assessment"), /*#__PURE__*/React.createElement("option", {
    value: "started-only"
  }, "Show only those who have started their assessment"), /*#__PURE__*/React.createElement("option", {
    value: "not-started-only"
  }, "Show only those who have not started their assessment"), /*#__PURE__*/React.createElement("option", {
    value: "started-not-completed-only"
  }, "Show only those who have started but not completed their assessment")), /*#__PURE__*/React.createElement("label", {
    className: "ml-2"
  }, "Minimum Percentage Score Filter: "), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: min_score,
    min: "0",
    max: "100",
    step: "1",
    onChange: function onChange(e) {
      setMinScore(e.target.value);
    },
    className: "bg-gray-100 px-4 py-2"
  })), loading ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin text-3xl"
  }) : filtered_students.length == 0 ? /*#__PURE__*/React.createElement("p", null, "No students to show.") : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-2 text-md grid gap-y-2 grid-cols-2 md:grid-cols-8 w-full justify-between justify-items-center items-center text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-span-2 justify-self-center"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: show_student_personal_details,
    onChange: function onChange(e) {
      setShowStudentPersonalDetails(e.target.checked);
    }
  }), " ", /*#__PURE__*/React.createElement("label", null, "Show Student's Personal Details (email, cnic, gender)")), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2 justify-self-center"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: show_section_details,
    onChange: function onChange(e) {
      setShowSectionDetails(e.target.checked);
    }
  }), " ", /*#__PURE__*/React.createElement("label", null, "Show each section's details (time of submission, exact marks, duration)")), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2 justify-self-center"
  }, /*#__PURE__*/React.createElement("label", null, "How many rows to display in table below:"), " ", /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: num_rows_shown,
    onChange: function onChange(e) {
      setNumRowsShown(e.target.value);
    },
    className: "py-2 px-4 border"
  }), /*#__PURE__*/React.createElement("a", {
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer my-2 text-md ml-1",
    onClick: function onClick() {
      setNumRowsShown(filtered_students.length);
    }
  }, "Show All")), /*#__PURE__*/React.createElement("a", {
    href: "/quiz/".concat(quiz_id, "/analysis"),
    className: "self-end text-blue-600 mb-2 mr-4 col-span-1",
    target: "_blank"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chart-bar"
  }), " ", /*#__PURE__*/React.createElement("span", {
    className: "underline hover:no-underline"
  }, "View Analysis")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: function onClick() {
      setShowStudentPersonalDetails(true);
      setTimeout(function () {
        download_table_as_csv("results_table");
      }, 500);
    },
    className: "self-end text-blue-600 mb-2 mr-4 col-span-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-download"
  }), " ", /*#__PURE__*/React.createElement("span", {
    className: "underline hover:no-underline"
  }, "Download as CSV"))), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex justify-between text-xs"
  }, /*#__PURE__*/React.createElement("p", null, "Number of Students in Filtered Results:", " ", /*#__PURE__*/React.createElement("b", null, filtered_students.length)), /*#__PURE__*/React.createElement("p", null, "Percentage of Students in Filtered Results:", " ", /*#__PURE__*/React.createElement("b", null, roundToTwoDecimalPlaces(filtered_students.length / students.length * 100), "%")), /*#__PURE__*/React.createElement("p", null, "Number of rows being displayed: ", /*#__PURE__*/React.createElement("b", null, num_rows_shown))), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left mx-auto mt-2 overflow-auto",
    id: "results_table"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-iec-blue text-white w-full"
  }, /*#__PURE__*/React.createElement("tr", {
    className: "w-full header_row"
  }, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-6"
  }, "Student Name"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-6"
  }, "Student Email"), show_student_personal_details ? [/*#__PURE__*/React.createElement("th", {
    className: "py-3 px-6"
  }, "Student CNIC")].concat(_toConsumableArray(application_fields.map(function (field) {
    return /*#__PURE__*/React.createElement("th", {
      className: "py-3 px-6"
    }, field.text);
  }))) : [], sections.map(function (section) {
    return show_section_details ? [/*#__PURE__*/React.createElement("th", {
      className: "py-3 px-6"
    }, "Percentage Marks in ", section.section_title), /*#__PURE__*/React.createElement("th", {
      className: "py-3 px-6",
      key: section.id
    }, section.section_title, " Student Score", /*#__PURE__*/React.createElement("br", null), "(out of ", section.maximum_score, ")"), /*#__PURE__*/React.createElement("th", {
      className: "py-3 px-6"
    }, section.section_title, " Time Taken", /*#__PURE__*/React.createElement("br", null), section.maximum_time), /*#__PURE__*/React.createElement("th", {
      className: "py-3 px-6"
    }, section.section_title, " Submission Time (KHI)")] : [/*#__PURE__*/React.createElement("th", {
      className: "py-3 px-6"
    }, "Percentage Marks in ", section.section_title)];
  }), show_section_details ? [/*#__PURE__*/React.createElement("th", {
    className: "py-3 px-6"
  }, "Student Total Score (out of ", quiz_total_score, ")")] : [], /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-6"
  }, "Percentage Total Score"), /*#__PURE__*/React.createElement("th", null, "Action"))), /*#__PURE__*/React.createElement("tbody", {
    className: "w-full"
  }, filtered_students.slice(0, num_rows_shown).map(function (student) {
    return /*#__PURE__*/React.createElement("tr", {
      key: student.id,
      className: student.completed ? "bg-green-100" : ""
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-6"
    }, student.student_name), /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-6"
    }, student.student_email), show_student_personal_details ? [/*#__PURE__*/React.createElement("td", {
      className: "py-3 px-6"
    }, student.student_cnic)].concat(_toConsumableArray(application_fields.map(function (field) {
      return student.hasOwnProperty(field.name) ? student[field.name] === true ? /*#__PURE__*/React.createElement("td", null, "Yes") : student[field.name] === false ? /*#__PURE__*/React.createElement("td", null, "No") : /*#__PURE__*/React.createElement("td", {
        className: "py-3 px-6"
      }, field.is_preference_field ? courses[student[field.name]] : student[field.name]) : /*#__PURE__*/React.createElement("td", null, "N/A");
    }))) : [], student.sections.map(function (section) {
      return show_section_details ? section.status == "Attempted" ? [/*#__PURE__*/React.createElement("td", {
        className: "py-3 px-6"
      }, section.percentage_score), /*#__PURE__*/React.createElement("td", {
        className: "py-3 px-6"
      }, section.section_score), /*#__PURE__*/React.createElement("td", {
        className: "py-3 px-6"
      }, section.duration), /*#__PURE__*/React.createElement("td", {
        className: "py-3 px-6"
      }, section.end_time)] : [/*#__PURE__*/React.createElement("td", {
        className: "py-3 px-6"
      }, "Not Attempted"), /*#__PURE__*/React.createElement("td", {
        className: "py-3 px-6"
      }, "Not Attempted"), /*#__PURE__*/React.createElement("td", {
        className: "py-3 px-6"
      }, "N/A"), /*#__PURE__*/React.createElement("td", {
        className: "py-3 px-6 endtime"
      }, "0")] : section.status == "Attempted" ? /*#__PURE__*/React.createElement("td", {
        className: "py-3 px-6"
      }, section.percentage_score) : /*#__PURE__*/React.createElement("td", {
        className: "py-3 px-6"
      }, "Not Attempted");
    }), show_section_details ? [/*#__PURE__*/React.createElement("td", {
      className: "py-3 px-6"
    }, student.total_score)] : [], /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-6"
    }, student.percentage_total), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
      "data-student_id": student.student_id,
      onClick: resetStudentAssignment,
      target: "_blank"
    }, "Reset Assignment"), " | ", /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
      "data-student_id": student.student_id,
      "data-quiz_id": quiz_id,
      onClick: function onClick(e) {
        resetOneSection(e.target.dataset.student_id, e.target.dataset.quiz_id);
      },
      target: "_blank"
    }, "Reset One Section")));
  }))), /*#__PURE__*/React.createElement("a", {
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer my-2 text-md",
    onClick: function onClick() {
      setNumRowsShown(num_rows_shown * 10 > filtered_students.length ? filtered_students.length : num_rows_shown * 10);
    }
  }, "Show", " ", num_rows_shown * 10 > filtered_students.length ? "all" : num_rows_shown * 10, " ", "rows")));
};

var Main = function Main() {
  return /*#__PURE__*/React.createElement("div", {
    className: "overflow-auto"
  }, /*#__PURE__*/React.createElement(StudentsList, null));
};

var App = function App() {
  return /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement(Main, null));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));