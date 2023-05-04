"use strict";

// this file requires data_lists.js
const ApplicationsList = props => {
  const {
    applications_object,
    modal_object,
    reload_object
  } = useContext(MyContext);
  const [reload_applications, setReloadApplications] = reload_object;
  const [applications, setApplications] = applications_object;
  const [show_modal, setShowModal] = modal_object;
  const [show_filters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState([]);
  const [downloading_as_excel, setDownloadingAsExcel] = useState(false);
  const [filtered_applications, setFilteredApplications] = useState([]);
  const [num_rows, setNumRows] = useState(0);
  const application_id_to_array_index_map = props.application_id_to_array_index_map;
  console.log(applications);
  const [questions, setQuestions] = useState([{
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
    name: ["first_preference", "title"]
  }]);
  useEffect(() => {
    fetch("/admin/application/courses/".concat(props.application_round_id)).then(raw_response => {
      if (raw_response.ok) {
        raw_response.json().then(response => {
          setCourses(response);
        }).catch(err => {
          alert("The server sent an invalid response. Something is wrong.");
          console.log(err);
        });
      } else {
        alert("Something went wrong while getting list of course preference filters. The rest of the page will work fine.");
      }
    }).catch(err => {
      console.log(err);
      alert("Could not load courses for filtering. Check your internet connection.");
    });
  }, []);
  useEffect(() => {
    setFilters([{
      title: "Age Group",
      name: "age_group",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: age_groups.map(val => ({
        value: val,
        checked: false
      })),
      expand_possible_values: false
    }, {
      title: "City of Residence",
      name: "city",
      filter_type: "fixed_values",
      possible_values: cities.map(val => ({
        value: val,
        checked: false
      })),
      discrepancy_between_value_and_text: false,
      expand_possible_values: false
    }, {
      title: "Education Completed",
      name: "education_completed",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: education_levels.map(val => ({
        value: val,
        checked: false
      })),
      expand_possible_values: false
    }, {
      title: "Employment type",
      name: "type_of_employment",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: type_of_employment.map(val => ({
        value: val,
        checked: false
      }))
    }, {
      title: "Course Interest",
      name: "firstPreferenceId",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: courses.map(val => ({
        value: val.id,
        text: val.title,
        checked: false
      })),
      expand_possible_values: false
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
  }, [courses]);
  useEffect(() => {
    setFilteredApplications(applications);
  }, [applications]);
  useEffect(() => {
    setFilteredApplications(applications.filter(application => {
      let show_this_application = true;

      for (let i = 0; i < filters.length; i++) {
        const filter = filters[i];

        if (filter.filter_type == "integer_value" && application[filter.name] < filter.value) {
          show_this_application = false;
          break;
        } else if (filter.filter_type == "fixed_values" && filter.possible_values.length > 0 && filter.possible_values.reduce((prev, cur) => {
          if (prev) return prev;
          if (cur.checked) return true;else return false;
        }, false) && filter.possible_values.reduce((prev, cur) => {
          if (prev) return prev;else if (cur.checked && cur.value == application[filter.name]) return true;else return false;
        }, false) == false) {
          show_this_application = false;
          break;
        }
      }

      return show_this_application;
    }));
  }, [filters]);
  useEffect(() => {
    setNumRows(filtered_applications.length);
  }, [filtered_applications]);

  const formatOutput = output => {
    if (output === false) return "No";else if (output === true) return "Yes";else return output;
  };

  const getValue = (obj, properties_array) => {
    // if properties_array = ["Student","address"], then this funtion returns obj.Student.address
    return properties_array.reduce((final_value, property) => final_value == null ? null : final_value[property], obj);
  };

  const setAllCheckBoxes = (filter_index, checked) => {
    setFilters(cur => {
      let copy = cur.slice();
      copy[filter_index].possible_values = copy[filter_index].possible_values.map(possible_value_obj => {
        possible_value_obj.checked = checked;
        return possible_value_obj;
      });
      return copy;
    });
  };

  const deleteApplication = array_index => {
    const application_id = filtered_applications[array_index].id;
    fetch("/admin/application/delete/".concat(application_id)).then(res => {
      if (res.ok) {
        setReloadApplications(cur => !cur);
      } else {
        alert("Application delete failed due to unknown reason.");
      }
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "overflow-auto"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base text-center mb-4"
  }, /*#__PURE__*/React.createElement("b", null, "List of Applications in this Round")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 gap-y-4"
  }, /*#__PURE__*/React.createElement("a", {
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
    onClick: e => {
      setShowFilters(cur => !cur);
    }
  }, show_filters ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "far fa-eye-slash"
  }), " Hide Filters") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "far fa-eye"
  }), " Show Filters")), show_filters ? filters.map((filter, index) => filter.filter_type == "integer_value" ? /*#__PURE__*/React.createElement("div", {
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
    onChange: e => {
      setFilters(cur => {
        let copy = cur.slice();
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
    onClick: e => {
      setAllCheckBoxes(e.target.dataset.filter_index, true);
    }
  }, "Check All"), " ", /*#__PURE__*/React.createElement("a", {
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:underline cursor-pointer",
    "data-filter_index": index,
    onClick: e => {
      setAllCheckBoxes(e.target.dataset.filter_index, false);
    }
  }, "Uncheck All"), filter.possible_values.map((possible_value_obj, i2) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: filter.name,
    "data-filter_index": index,
    "data-possible_value_index": i2,
    checked: possible_value_obj.checked,
    value: possible_value_obj.value,
    onChange: e => {
      setFilters(cur => {
        let copy = cur.slice();
        copy[e.target.dataset.filter_index].possible_values[e.target.dataset.possible_value_index]["checked"] = !copy[e.target.dataset.filter_index].possible_values[e.target.dataset.possible_value_index]["checked"];
        return copy;
      });
    }
  }), /*#__PURE__*/React.createElement("label", null, possible_value_obj.text)))) : /*#__PURE__*/React.createElement("a", {
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
    "data-filter_index": index,
    onClick: e => {
      setFilters(cur => {
        let copy = [...cur];
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
    onClick: e => {
      setFilters(cur => {
        let copy = [...cur];
        copy[e.target.dataset.filter_index].expand_possible_values = true;
        return copy;
      });
    }
  }, "Click here to show all possible value filters") : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-x-2"
  }, /*#__PURE__*/React.createElement("a", {
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:underline cursor-pointer",
    "data-filter_index": index,
    onClick: e => {
      setAllCheckBoxes(e.target.dataset.filter_index, true);
    }
  }, "Check All"), /*#__PURE__*/React.createElement("a", {
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:underline cursor-pointer",
    "data-filter_index": index,
    onClick: e => {
      setAllCheckBoxes(e.target.dataset.filter_index, false);
    }
  }, "Uncheck All")), filter.possible_values.map((possible_value_obj, i2) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: filter.name,
    "data-filter_index": index,
    "data-possible_value_index": i2,
    checked: possible_value_obj.checked,
    value: possible_value_obj.value,
    onChange: e => {
      setFilters(cur => {
        let copy = cur.slice();
        copy[e.target.dataset.filter_index].possible_values[e.target.dataset.possible_value_index]["checked"] = !copy[e.target.dataset.filter_index].possible_values[e.target.dataset.possible_value_index]["checked"];
        return copy;
      });
    }
  }), /*#__PURE__*/React.createElement("label", null, possible_value_obj.value)))))) : /*#__PURE__*/React.createElement("div", null)) : /*#__PURE__*/React.createElement("p", null)), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("br", null), !downloading_as_excel ? /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    className: "text-white mb-2 float-right px-3 py-2 bg-iec-blue hover:bg-iec-blue-hover cursor-pointer",
    onClick: () => {
      setDownloadingAsExcel(true);
      download_table_as_csv("main-table");
      setDownloadingAsExcel(false);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-download"
  }), " Download as Excel File") : /*#__PURE__*/React.createElement("i", null), applications.length > 0 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Total Number of Applications: ", applications.length), /*#__PURE__*/React.createElement("p", null, "Filtered Number of Applications: ", num_rows), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-sm ".concat(downloading_as_excel ? " invisible" : ""),
    id: "main-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Application ID"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Phone"), /*#__PURE__*/React.createElement("th", null, "CNIC"), questions.map(question => /*#__PURE__*/React.createElement("th", {
    className: downloading_as_excel ? "" : "hidden"
  }, question.title)), /*#__PURE__*/React.createElement("th", null, "Action"))), /*#__PURE__*/React.createElement("tbody", null, filtered_applications.map((application, index) => {
    return /*#__PURE__*/React.createElement("tr", {
      key: application.id,
      className: application.rejection_email_sent ? "bg-red-300" : ""
    }, /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, application.id), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, "".concat(application.Student.firstName, " ").concat(application.Student.lastName)), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, application.Student.email), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, application.phone), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, application.Student.cnic), questions.map(question => /*#__PURE__*/React.createElement("td", {
      className: downloading_as_excel ? "" : "hidden"
    }, formatOutput(getValue(application, question.name)))), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
      "data-index": application_id_to_array_index_map[application.id],
      onClick: e => {
        setShowModal(e.target.dataset.index);
      }
    }, "View Details"), " ", " | ", /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
      "data-index": application_id_to_array_index_map[application.id],
      onClick: e => {
        deleteApplication(e.target.dataset.index);
      }
    }, "Delete Application")));
  })))) : /*#__PURE__*/React.createElement("p", null, "No students to show."));
};