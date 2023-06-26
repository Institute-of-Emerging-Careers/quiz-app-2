"use strict";

const NewStudentAdder = props => {
  const [students, setStudents] = props.students_object;
  const [loading, setLoading] = useState(false);
  const [filter_min_score, setFilterMinScore] = useState(0);
  const [filter_date, setFilterDate] = useState(DateTime.now().endOf("day").toFormat("yyyy-MM-dd"));
  const [orientation_status_filter, setOrientationStatusFilter] = useState("all");
  const [filtered_students, setFilteredStudents] = useState([]);
  const student_id_to_array_index_map = useRef({});
  const section2 = useRef(null);

  const addSelectedCandidatesToOrientationList = () => {
    filtered_students.filter(student => student.added).forEach(student => {
      setStudents(cur_students_array => {
        let copy = cur_students_array.slice();
        copy[student_id_to_array_index_map.current[student.id]].added = true;
        return copy;
      });
    });
  };

  useEffect(() => {
    setFilteredStudents(students.filter(student => !student.added));
  }, [students]);
  useEffect(() => {
    setFilteredStudents(students.filter(student => {
      return student.percentage_score >= filter_min_score && DateTime.fromISO(student.assignment_completed_date).startOf("day").ts <= DateTime.fromFormat(filter_date, "yyyy-MM-dd").startOf("day").ts && (student.added && (orientation_status_filter == "all" || orientation_status_filter == "added") || !student.added && (orientation_status_filter == "all" || orientation_status_filter == "not-added"));
    }));
  }, [filter_min_score, filter_date, orientation_status_filter]);
  useEffect(() => {
    setLoading(true);
    fetch("".concat(props.all_students_api_endpoint_url)).then(raw_response => {
      raw_response.json().then(response => {
        if (response.success) {
          for (let i = 0; i < response.data.length; i++) {
            student_id_to_array_index_map.current[response.data[i].id] = i;
          }

          setStudents(response.data);
        } else {
          alert("Something went wrong while getting a list of candidates. Error code 01.");
        }
      }).catch(err => {
        alert("Something went wrong while getting a list of candidates. Error code 02.");
        console.log(err);
      }).finally(() => {
        setLoading(false);
      });
    });
  }, []);

  const setAllCheckboxes = new_val => {
    setFilteredStudents(cur => {
      let copy = cur.slice();

      for (let i = 0; i < copy.length; i++) {
        copy[i].added = new_val;
      }

      return copy;
    });
  };

  const selectAll = () => {
    setAllCheckboxes(true);
    section2.current.scrollIntoView();
  };

  const deSelectAll = () => {
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
    onChange: e => {
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
    onChange: e => {
      setFilterDate(e.target.value);
    },
    className: "ml-2 p-2 w-72 border"
  }), "%"), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "filter_min_score"
  }, "Filter by ", props.title, " Status:", " "), /*#__PURE__*/React.createElement("select", {
    value: orientation_status_filter,
    onChange: e => {
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
  }, /*#__PURE__*/React.createElement("th", null, "Selection"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Age"), /*#__PURE__*/React.createElement("th", null, "Gender"), /*#__PURE__*/React.createElement("th", null, "Submission Date"), /*#__PURE__*/React.createElement("th", null, "Score (%)"))), /*#__PURE__*/React.createElement("tbody", null, filtered_students.map((student, filtered_student_index) => /*#__PURE__*/React.createElement("tr", {
    className: "py-2",
    key: student.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "border px-4 py-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: student.id,
    checked: student.added,
    onChange: e => {
      setFilteredStudents(cur => {
        let copy = cur.slice();
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
  }, student.percentage_score)))))));
};