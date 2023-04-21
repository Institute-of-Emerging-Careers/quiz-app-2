"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var NewStudentAdder = function NewStudentAdder(props) {
  var _props$students_objec = _slicedToArray(props.students_object, 2),
      students = _props$students_objec[0],
      setStudents = _props$students_objec[1];

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      filter_min_score = _useState4[0],
      setFilterMinScore = _useState4[1];

  var _useState5 = useState(DateTime.now().minus({
    months: 1
  }).toFormat("yyyy-MM-dd")),
      _useState6 = _slicedToArray(_useState5, 2),
      filter_date = _useState6[0],
      setFilterDate = _useState6[1];

  var _useState7 = useState("all"),
      _useState8 = _slicedToArray(_useState7, 2),
      orientation_status_filter = _useState8[0],
      setOrientationStatusFilter = _useState8[1];

  var _useState9 = useState([]),
      _useState10 = _slicedToArray(_useState9, 2),
      filtered_students = _useState10[0],
      setFilteredStudents = _useState10[1];

  var student_id_to_array_index_map = useRef({});
  var section2 = useRef(null);

  var addSelectedCandidatesToOrientationList = function addSelectedCandidatesToOrientationList() {
    filtered_students.filter(function (student) {
      return student.added;
    }).forEach(function (student) {
      setStudents(function (cur_students_array) {
        var copy = cur_students_array.slice();
        copy[student_id_to_array_index_map.current[student.id]].added = true;
        return copy;
      });
    });
  };

  useEffect(function () {
    setFilteredStudents(students.filter(function (student) {
      return !student.added;
    }));
  }, [students]);
  useEffect(function () {
    setFilteredStudents(students.filter(function (student) {
      return student.percentage_score >= filter_min_score && DateTime.fromISO(student.assignment_completed_date).startOf("day").ts <= DateTime.fromFormat(filter_date, "yyyy-MM-dd").startOf("day").ts && (student.added && (orientation_status_filter == "all" || orientation_status_filter == "added") || !student.added && (orientation_status_filter == "all" || orientation_status_filter == "not-added"));
    }));
  }, [filter_min_score, filter_date, orientation_status_filter]);
  useEffect(function () {
    setLoading(true);
    fetch("".concat(props.all_students_api_endpoint_url)).then(function (raw_response) {
      raw_response.json().then(function (response) {
        if (response.success) {
          for (var i = 0; i < response.data.length; i++) {
            student_id_to_array_index_map.current[response.data[i].id] = i;
          }

          setStudents(response.data);
        } else {
          alert("Something went wrong while getting a list of candidates. Error code 01.");
        }
      }).catch(function (err) {
        alert("Something went wrong while getting a list of candidates. Error code 02.");
      }).finally(function () {
        setLoading(false);
      });
    });
  }, []);

  var setAllCheckboxes = function setAllCheckboxes(new_val) {
    setFilteredStudents(function (cur) {
      var copy = cur.slice();

      for (var i = 0; i < copy.length; i++) {
        copy[i].added = new_val;
      }

      return copy;
    });
  };

  var selectAll = function selectAll() {
    setAllCheckboxes(true);
    section2.current.scrollIntoView();
  };

  var deSelectAll = function deSelectAll() {
    setAllCheckboxes(false);
    section2.current.scrollIntoView();
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-base text-center mb-2"
  }, /*#__PURE__*/React.createElement("b", null, "List of Candidates that can be added to this ", props.title)), /*#__PURE__*/React.createElement("button", {
    onClick: addSelectedCandidatesToOrientationList,
    className: "py-2 px-4 bg-iec-blue hover:bg-iec-blue-hover text-white"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-up"
  }), " Add Selected Candidates to", " ", props.title, " List"), /*#__PURE__*/React.createElement("div", {
    ref: section2
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-6 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "filter_min_score"
  }, "Filter by Minimum Score: "), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    max: "100",
    increment: "1",
    value: filter_min_score,
    name: "filter_min_score",
    onChange: function onChange(e) {
      setFilterMinScore(e.target.value);
    },
    className: "ml-2 p-2 w-72 border"
  }), "%"), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "filter_min_score"
  }, "Filter by Latest Submission Date: "), /*#__PURE__*/React.createElement("input", {
    type: "date",
    min: "0",
    max: DateTime.now(),
    value: filter_date,
    name: "filter_date",
    onChange: function onChange(e) {
      setFilterDate(e.target.value);
    },
    className: "ml-2 p-2 w-72 border"
  }), "%"), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "filter_min_score"
  }, "Filter by ", props.title, " Status:", " "), /*#__PURE__*/React.createElement("select", {
    value: orientation_status_filter,
    onChange: function onChange(e) {
      setOrientationStatusFilter(e.target.value);
    },
    className: "px-3 py-2"
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "Show all"), /*#__PURE__*/React.createElement("option", {
    value: "added"
  }, "Already added to ", props.title.toLowerCase()), /*#__PURE__*/React.createElement("option", {
    value: "not-added"
  }, "Not added to ", props.title.toLowerCase()))), /*#__PURE__*/React.createElement("a", {
    className: "col-span-2 cursor-pointer text-iec-blue underline hover:text-iec-blue-hover hover:no-underline",
    onClick: selectAll
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-check-square"
  }), " Click here to select all below"), /*#__PURE__*/React.createElement("a", {
    className: "col-span-2 cursor-pointer text-iec-blue underline hover:text-iec-blue-hover hover:no-underline",
    onClick: deSelectAll
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-square"
  }), " Click here to deselect all below")), /*#__PURE__*/React.createElement("br", null), loading ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin text-lg"
  }) : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, filtered_students.length), " filtered students."), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left px-2"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "py-4"
  }, /*#__PURE__*/React.createElement("th", null, "Selection"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Age"), /*#__PURE__*/React.createElement("th", null, "Gender"), /*#__PURE__*/React.createElement("th", null, "Submission Date"), /*#__PURE__*/React.createElement("th", null, "Score (%)"))), /*#__PURE__*/React.createElement("tbody", null, filtered_students.map(function (student, filtered_student_index) {
    return /*#__PURE__*/React.createElement("tr", {
      className: "py-2",
      key: student.id
    }, /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      id: student.id,
      checked: student.added,
      onChange: function onChange(e) {
        setFilteredStudents(function (cur) {
          var copy = cur.slice();
          copy[filtered_student_index].added = !copy[filtered_student_index].added;
          return copy;
        });
      }
    })), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, student.name), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, student.email), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, student.age), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, student.gender), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, DateTime.fromISO(student.assignment_completed_date).toFormat("dd LLL yyyy")), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, student.percentage_score));
  })))));
};