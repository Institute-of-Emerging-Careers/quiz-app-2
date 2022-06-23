const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const quiz_id = document.getElementById("quiz-id-field").value;

const ContextProvider = (props) => {
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [quiz_total_score, setQuizTotalScore] = useState(0);
  // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not

  return (
    <MyContext.Provider
      value={{
        students_obj: [students, setStudents],
        sections_obj: [sections, setSections],
        quiz_total_score_obj: [quiz_total_score, setQuizTotalScore],
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

const StudentsList = () => {
  const { students_obj, sections_obj, quiz_total_score_obj } =
    useContext(MyContext);
  const [students, setStudents] = students_obj;
  const [sections, setSections] = sections_obj;
  const [quiz_total_score, setQuizTotalScore] = quiz_total_score_obj;
  const [show_student_personal_details, setShowStudentPersonalDetails] =
    useState(false);
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState("all");
  const [filters, setFilters] = useState([]);
  const [min_score, setMinScore] = useState(0);
  const [filtered_students, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload_results, setReloadResults] = useState(false);
  const [num_rows_shown, setNumRowsShown] = useState(10);
  const [show_filters, setShowFilters] = useState(false);
  const [show_section_details, setShowSectionDetails] = useState(false);

  const application_fields = [
    "phone",
    "gender",
    "age",
    "city",
    "province",
    "country",
    "address",
    "father_name",
    "current_address",
    "education_completed",
    "education_completed_major",
    "education_ongoing",
    "education_ongoing_major",
    "monthly_family_income",
    "computer_and_internet_access",
    "internet_facility_in_area",
    "time_commitment",
    "is_employed",
    "type_of_employment",
    "salary",
    "will_leave_job",
    "has_applied_before",
    "preference_reason",
    "is_comp_sci_grad",
    "how_heard_about_iec",
    "will_work_full_time",
    "acknowledge_online",
    "rejection_email_sent",
    "assessment_email_sent",
  ];

  useEffect(() => {
    setFilters([
      {
        title: "Gender",
        name: "gender",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: false,
        possible_values: genders.map((val) => ({
          value: val,
          checked: false,
        })),
        expand_possible_values: false,
      },
      {
        title: "Age Group",
        name: "age_group",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: false,
        possible_values: age_groups.map((val) => ({
          value: val,
          checked: false,
        })),
        expand_possible_values: false,
      },
      {
        title: "City of Residence",
        name: "city",
        filter_type: "fixed_values",
        possible_values: cities.map((val) => ({
          value: val,
          checked: false,
        })),
        discrepancy_between_value_and_text: false,
        expand_possible_values: false,
      },
      {
        title: "Province of Residence",
        name: "province",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: false,
        possible_values: provinces.map((val) => ({
          value: val,
          checked: false,
        })),
        expand_possible_values: false,
      },
      {
        title: "Country of Residence",
        name: "country",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: false,
        possible_values: cities.map((val) => ({
          value: val,
          checked: false,
        })),
        expand_possible_values: false,
      },
      {
        title: "Education Completed",
        name: "education_completed",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: false,
        possible_values: education_levels.map((val) => ({
          value: val,
          checked: false,
        })),
        expand_possible_values: false,
      },
      {
        title: "Ongoing Education",
        name: "education_ongoing",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: false,
        possible_values: education_levels.map((val) => ({
          value: val,
          checked: false,
        })),
        expand_possible_values: false,
      },
      {
        title: "Minimum Monthly Family Income",
        name: "monthly_family_income",
        filter_type: "integer_value",
        min: 0,
        max: 200000,
        increment: 5000,
        value: 0,
        unit: "PKR",
      },
      {
        title: "Minimum Current salary",
        name: "salary",
        filter_type: "integer_value",
        min: 0,
        max: 200000,
        increment: 5000,
        value: 0,
        unit: "PKR",
      },
      {
        title: "Do you have computer and internet access?",
        name: "computer_and_internet_access",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
      },
      {
        title: "Is there reliable internet facility in your area?",
        name: "internet_facility_in_area",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
      },
      {
        title: "Can you spend 30 to 40 hours a week on the program?",
        name: "time_commitment",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
      },
      {
        title: "Are you currently employed?",
        name: "is_employed",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
      },
      {
        title: "Employment type",
        name: "type_of_employment",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: false,
        possible_values: type_of_employment.map((val) => ({
          value: val,
          checked: false,
        })),
      },
      {
        title:
          "Will you be willing to leave the job to attend the program full time, if you are given a stipend of a percentage of the salary?",
        name: "will_leave_job",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
      },
      {
        title: "Have you applied to IEC before?",
        name: "has_applied_before",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
      },
      {
        title: "Are you a graduate in computer science or any related field?",
        name: "is_comp_sci_grad",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
      },
      {
        title:
          "After graduating from IEC, if we provide you with a Full Time Job opportunity, will you be willing to accept the job?",
        name: "will_work_full_time",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
      },
      {
        title: "The program is entirely online. Do you acknowledge that?",
        name: "acknowledge_online",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
      },
      {
        title: "Applicant automatically rejected and rejection email sent",
        name: "rejection_email_sent",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
      },
    ]);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/quiz/${quiz_id}/results-data`)
      .then((raw_data) => {
        setLoading(false);
        if (raw_data.ok) {
          raw_data
            .json()
            .then((obj) => {
              setStudents(obj.data);
              setSections(obj.quiz_sections);
              setQuizTotalScore(obj.quiz_total_score);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              alert("Server returned invalid results. Contact IT Team.");
            });
        } else {
          console.log("Server returned not ok status. Contact IT Team.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong. Contact IT Team.");
      });
  }, [reload_results]);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const setAllCheckBoxes = (filter_index, checked) => {
    setFilters((cur) => {
      let copy = cur.slice();
      copy[filter_index].possible_values = copy[
        filter_index
      ].possible_values.map((possible_value_obj) => {
        possible_value_obj.checked = checked;
        return possible_value_obj;
      });
      return copy;
    });
  };

  useEffect(() => {
    setFilteredStudents(
      students.filter((student) => {
        let show_this_application =
          student.percentage_total < min_score
            ? false
            : assignmentStatusFilter == "all"
            ? true
            : assignmentStatusFilter == "completed-only" && student.completed
            ? true
            : assignmentStatusFilter == "not-completed-only" &&
              !student.completed
            ? true
            : assignmentStatusFilter == "started-only" &&
              (student.started || student.completed)
            ? true
            : assignmentStatusFilter == "started-not-completed-only" &&
              student.started &&
              !student.completed
            ? true
            : assignmentStatusFilter == "not-started-only" && !student.started
            ? true
            : false;

        if (!show_this_application) return false;
        for (let i = 0; i < filters.length; i++) {
          const filter = filters[i];
          if (
            filter.filter_type == "integer_value" &&
            student[filter.name] < filter.value
          ) {
            show_this_application = false;
            break;
          } else if (
            filter.filter_type == "fixed_values" &&
            filter.possible_values.length > 0 &&
            filter.possible_values.reduce((prev, cur) => {
              if (prev) return prev;
              if (cur.checked) return true;
              else return false;
            }, false) &&
            filter.possible_values.reduce((prev, cur) => {
              if (prev) return prev;
              else if (cur.checked && cur.value == student[filter.name])
                return true;
              else return false;
            }, false) == false
          ) {
            show_this_application = false;
            break;
          }
        }
        return show_this_application;
      })
    );
    if (
      num_rows_shown > filtered_students.length &&
      filtered_students.length > 0
    )
      setNumRowsShown(filtered_students.length);
  }, [filters, assignmentStatusFilter, min_score]);

  function download_table_as_csv(table_id, separator = ",") {
    // Select rows from table_id
    var rows = document.querySelectorAll("table#" + table_id + " tr");
    console.log(rows);
    // Construct csv
    var csv = [];

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].style.display != "none") {
        var row = [],
          cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++) {
          // Clean innertext to remove multiple spaces and jumpline (break csv)
          var data = cols[j].innerText
            .replace(/(\r\n|\n|\r)/gm, "")
            .replace(/(\s\s)/gm, " ");
          // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
          data = data.replace(/"/g, '""');
          // Push escaped string
          row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
      }
    }
    if (csv.length == 1) {
      //the 1 row is the header row
      alert("Sorry! No rows to export. Change the filters.");
    } else {
      var csv_string = csv.join("\n");
      // Download it
      var filename =
        "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
      var link = document.createElement("a");
      link.style.display = "none";
      link.setAttribute("target", "_blank");
      link.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csv_string)
      );
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  function resetStudentAssignment(e) {
    let x = prompt(`Are you sure? Enter "yes" or "no".`);
    if (x == "yes") {
      fetch(
        `/reset-assignment/student/${e.target.dataset.student_id}/quiz/${quiz_id}`
      ).then((res) => {
        if (res.ok) {
          alert("Successfully reset assignment. Reloading page now.");
          setReloadResults((cur) => !cur);
        } else {
          alert("Error. Could not reset assignment. Reloading page now.");
        }
      });
    }
  }

  function resetOneSection(student_id, quiz_id) {
    let prompt_text =
      "Which of the following sections do you want to delete?\n";
    prompt_text += sections.reduce((final, cur, index) => {
      return `${final}Press ${index} to delete "${cur.section_title}"\n`;
    }, "");
    const choice = prompt(prompt_text);
    fetch(
      `/quiz/reset-section-attempt/${student_id}/${sections[choice].section_id}`
    )
      .then((res) => {
        if (res.ok) {
          alert("Section reset");
          setReloadResults((cur) => !cur);
        } else alert("Error. Could not reset section. Reloading page now.");
      })
      .catch((err) => {
        alert("Error. Could not reset section.");
        console.log(err);
      });
  }

  return (
    <div>
      <div>
        <a
          className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"
          onClick={(e) => {
            setShowFilters((cur) => !cur);
          }}
        >
          {show_filters ? (
            <span>
              <i className="far fa-eye-slash"></i> Hide Filters
            </span>
          ) : (
            <span>
              <i className="far fa-eye"></i> Show Application Data Filters
            </span>
          )}
        </a>
        {show_filters ? (
          filters.map((filter, index) =>
            filter.filter_type == "integer_value" ? (
              <div className="w-full grid grid-cols-10 align-middle mb-2">
                <label className="col-span-2">{filter.title}:</label>
                <input
                  type="range"
                  min={filter.min}
                  max={filter.max}
                  step={filter.increment}
                  value={filter.value}
                  data-index={index}
                  className="col-span-7 align-middle"
                  onChange={(e) => {
                    setFilters((cur) => {
                      let copy = cur.slice();
                      copy[e.target.dataset.index]["value"] = e.target.value;
                      return copy;
                    });
                  }}
                ></input>
                <label className="pl-2 col-span-1">
                  {filter.value
                    .toString()
                    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}{" "}
                  {/* this replace function adds commas after every 3 digits (\d\d\d) */}
                  {filter.unit}
                </label>
              </div>
            ) : filter.filter_type == "fixed_values" &&
              filter.discrepancy_between_value_and_text ? (
              <div className="grid grid-cols-4">
                <label className="col-span-1">{filter.title}</label>
                <div className="col-span-3">
                  {filter.expand_possible_values ? (
                    <div>
                      <a
                        className="text-iec-blue hover:text-iec-blue-hover underline hover:underline cursor-pointer"
                        data-filter_index={index}
                        onClick={(e) => {
                          setAllCheckBoxes(e.target.dataset.filter_index, true);
                        }}
                      >
                        Check All
                      </a>{" "}
                      <a
                        className="text-iec-blue hover:text-iec-blue-hover underline hover:underline cursor-pointer"
                        data-filter_index={index}
                        onClick={(e) => {
                          setAllCheckBoxes(
                            e.target.dataset.filter_index,
                            false
                          );
                        }}
                      >
                        Uncheck All
                      </a>
                      {filter.possible_values.map((possible_value_obj, i2) => (
                        <div>
                          <input
                            type="checkbox"
                            name={filter.name}
                            data-filter_index={index}
                            data-possible_value_index={i2}
                            checked={possible_value_obj.checked}
                            value={possible_value_obj.value}
                            onChange={(e) => {
                              setFilters((cur) => {
                                let copy = cur.slice();
                                copy[
                                  e.target.dataset.filter_index
                                ].possible_values[
                                  e.target.dataset.possible_value_index
                                ]["checked"] =
                                  !copy[e.target.dataset.filter_index]
                                    .possible_values[
                                    e.target.dataset.possible_value_index
                                  ]["checked"];
                                return copy;
                              });
                            }}
                          ></input>
                          <label>{possible_value_obj.text}</label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <a
                      className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"
                      data-filter_index={index}
                      onClick={(e) => {
                        setFilters((cur) => {
                          let copy = [...cur];
                          copy[
                            e.target.dataset.filter_index
                          ].expand_possible_values = true;
                          return copy;
                        });
                      }}
                    >
                      Click here to show all possible value filters
                    </a>
                  )}
                </div>
              </div>
            ) : filter.filter_type == "fixed_values" &&
              !filter.discrepancy_between_value_and_text ? (
              <div className="grid grid-cols-4">
                <label className="col-span-1">{filter.title}</label>
                <div className="col-span-3">
                  {!filter.expand_possible_values ? (
                    <a
                      className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"
                      data-filter_index={index}
                      onClick={(e) => {
                        setFilters((cur) => {
                          let copy = [...cur];
                          copy[
                            e.target.dataset.filter_index
                          ].expand_possible_values = true;
                          return copy;
                        });
                      }}
                    >
                      Click here to show all possible value filters
                    </a>
                  ) : (
                    <div>
                      <div className="flex gap-x-2">
                        <a
                          className="text-iec-blue hover:text-iec-blue-hover underline hover:underline cursor-pointer"
                          data-filter_index={index}
                          onClick={(e) => {
                            setAllCheckBoxes(
                              e.target.dataset.filter_index,
                              true
                            );
                          }}
                        >
                          {"Check All"}
                        </a>
                        <a
                          className="text-iec-blue hover:text-iec-blue-hover underline hover:underline cursor-pointer"
                          data-filter_index={index}
                          onClick={(e) => {
                            setAllCheckBoxes(
                              e.target.dataset.filter_index,
                              false
                            );
                          }}
                        >
                          {"Uncheck All"}
                        </a>
                      </div>
                      {filter.possible_values.map((possible_value_obj, i2) => (
                        <div>
                          <input
                            type="checkbox"
                            name={filter.name}
                            data-filter_index={index}
                            data-possible_value_index={i2}
                            checked={possible_value_obj.checked}
                            value={possible_value_obj.value}
                            onChange={(e) => {
                              setFilters((cur) => {
                                let copy = cur.slice();
                                copy[
                                  e.target.dataset.filter_index
                                ].possible_values[
                                  e.target.dataset.possible_value_index
                                ]["checked"] =
                                  !copy[e.target.dataset.filter_index]
                                    .possible_values[
                                    e.target.dataset.possible_value_index
                                  ]["checked"];
                                return copy;
                              });
                            }}
                          ></input>
                          <label>{possible_value_obj.value}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div></div>
            )
          )
        ) : (
          <p></p>
        )}
      </div>
      <div className="mb-2 text-xs" id="filters">
        <label>Choose a filter: </label>
        <select
          value={assignmentStatusFilter}
          onChange={(e) => {
            setAssignmentStatusFilter(e.target.value);
          }}
          className="px-3 py-2"
        >
          <option value="all">Show all Students</option>
          <option value="completed-only">
            Show only those who have completed their assessment
          </option>
          <option value="not-completed-only">
            Show only those who have not completed their assessment
          </option>
          <option value="started-only">
            Show only those who have started their assessment
          </option>
          <option value="not-started-only">
            Show only those who have not started their assessment
          </option>
          <option value="started-not-completed-only">
            Show only those who have started but not completed their assessment
          </option>
        </select>

        <label className="ml-2">Minimum Percentage Score Filter: </label>
        <input
          type="number"
          value={min_score}
          min="0"
          max="100"
          step="1"
          onChange={(e) => {
            setMinScore(e.target.value);
          }}
          className="bg-gray-100 px-4 py-2"
        ></input>
      </div>
      {loading ? (
        <i className="fas fa-spinner animate-spin text-3xl"></i>
      ) : filtered_students.length == 0 ? (
        <p>No students to show.</p>
      ) : (
        <div>
          <div className="mb-2 text-md grid gap-y-2 grid-cols-2 md:grid-cols-8 w-full justify-between justify-items-center items-center text-xs">
            <div className="col-span-2 justify-self-center">
              <input
                type="checkbox"
                checked={show_student_personal_details}
                onChange={(e) => {
                  setShowStudentPersonalDetails(e.target.checked);
                }}
              ></input>{" "}
              <label>
                Show Student's Personal Details (email, cnic, gender)
              </label>
            </div>
            <div className="col-span-2 justify-self-center">
              <input
                type="checkbox"
                checked={show_section_details}
                onChange={(e) => {
                  setShowSectionDetails(e.target.checked);
                }}
              ></input>{" "}
              <label>
                Show each section's details (time of submission, exact marks,
                duration)
              </label>
            </div>
            <div className="col-span-2 justify-self-center">
              <label>How many rows to display in table below:</label>{" "}
              <input
                type="number"
                value={num_rows_shown}
                onChange={(e) => {
                  setNumRowsShown(e.target.value);
                }}
                className="py-2 px-4 border"
              ></input>
              <a
                className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer my-2 text-md ml-1"
                onClick={() => {
                  setNumRowsShown(filtered_students.length);
                }}
              >
                Show All
              </a>
            </div>
            <a
              href={`/quiz/${quiz_id}/analysis`}
              className="self-end text-blue-600 mb-2 mr-4 col-span-1"
              target="_blank"
            >
              <i className="fas fa-chart-bar"></i>{" "}
              <span className="underline hover:no-underline">
                View Analysis
              </span>
            </a>
            <a
              href="#"
              onClick={() => {
                setShowStudentPersonalDetails(true);
                setTimeout(() => {
                  download_table_as_csv("results_table");
                }, 500);
              }}
              className="self-end text-blue-600 mb-2 mr-4 col-span-1"
            >
              <i className="fas fa-download"></i>{" "}
              <span className="underline hover:no-underline">
                Download as CSV
              </span>
            </a>
          </div>
          <div className="w-full flex justify-between text-xs">
            <p>
              Number of Students in Filtered Results:{" "}
              <b>{filtered_students.length}</b>
            </p>
            <p>
              Percentage of Students in Filtered Results:{" "}
              <b>
                {roundToTwoDecimalPlaces(
                  (filtered_students.length / students.length) * 100
                )}
                %
              </b>
            </p>
            <p>
              Number of rows being displayed: <b>{num_rows_shown}</b>
            </p>
          </div>
          <table
            className="w-full text-left mx-auto mt-2 overflow-auto"
            id="results_table"
          >
            <thead className="bg-iec-blue text-white w-full">
              <tr className="w-full header_row">
                <th className="py-3 px-6">Student Name</th>
                <th className="py-3 px-6">Student Email</th>
                {show_student_personal_details
                  ? [
                      <th className="py-3 px-6">Student Gender</th>,
                      <th className="py-3 px-6">Student CNIC</th>,
                      ...application_fields.map((field) => (
                        <th className="py-3 px-6">{field}</th>
                      )),
                    ]
                  : []}
                {sections.map((section) =>
                  show_section_details
                    ? [
                        <th className="py-3 px-6">
                          Percentage Marks in {section.section_title}
                        </th>,
                        <th className="py-3 px-6" key={section.id}>
                          {section.section_title} Student Score
                          <br />
                          (out of {section.maximum_score})
                        </th>,
                        <th className="py-3 px-6">
                          {section.section_title} Time Taken
                          <br />
                          {section.maximum_time}
                        </th>,
                        <th className="py-3 px-6">
                          {section.section_title} Submission Time (KHI)
                        </th>,
                      ]
                    : [
                        <th className="py-3 px-6">
                          Percentage Marks in {section.section_title}
                        </th>,
                      ]
                )}
                {show_section_details
                  ? [
                      <th className="py-3 px-6">
                        Student Total Score (out of {quiz_total_score})
                      </th>,
                    ]
                  : []}
                <th className="py-3 px-6">Percentage Total Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {filtered_students.slice(0, num_rows_shown).map((student) => (
                <tr
                  key={student.id}
                  className={student.completed ? "bg-green-100" : ""}
                >
                  <td className="py-3 px-6">{student.student_name}</td>
                  <td className="py-3 px-6">{student.student_email}</td>
                  {show_student_personal_details
                    ? [
                        <td className="py-3 px-6">{student.student_gender}</td>,
                        <td className="py-3 px-6">{student.student_cnic}</td>,
                        ...application_fields.map((field) =>
                          student.hasOwnProperty(field) ? (
                            student[field] === true ? (
                              <td>Yes</td>
                            ) : student[field] === false ? (
                              <td>No</td>
                            ) : (
                              <td className="py-3 px-6">{student[field]}</td>
                            )
                          ) : (
                            <td>N/A</td>
                          )
                        ),
                      ]
                    : []}

                  {student.sections.map((section) =>
                    show_section_details ? (
                      section.status == "Attempted" ? (
                        [
                          <td className="py-3 px-6">
                            {section.percentage_score}
                          </td>,
                          <td className="py-3 px-6">
                            {section.section_score}
                          </td>,
                          <td className="py-3 px-6">{section.duration}</td>,
                          <td className="py-3 px-6">{section.end_time}</td>,
                        ]
                      ) : (
                        [
                          <td className="py-3 px-6">Not Attempted</td>,
                          <td className="py-3 px-6">Not Attempted</td>,
                          <td className="py-3 px-6">N/A</td>,
                          <td className="py-3 px-6 endtime">0</td>,
                        ]
                      )
                    ) : section.status != "Attempted" ? (
                      <td className="py-3 px-6">{section.percentage_score}</td>
                    ) : (
                      <td className="py-3 px-6">Not Attempted</td>
                    )
                  )}

                  {show_section_details
                    ? [<td className="py-3 px-6">{student.total_score}</td>]
                    : []}
                  <td className="py-3 px-6">{student.percentage_total}</td>
                  <td>
                    <a
                      className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"
                      data-student_id={student.student_id}
                      onClick={resetStudentAssignment}
                      target="_blank"
                    >
                      Reset Assignment
                    </a>
                    {" | "}
                    <a
                      className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"
                      data-student_id={student.student_id}
                      data-quiz_id={quiz_id}
                      onClick={(e) => {
                        resetOneSection(
                          e.target.dataset.student_id,
                          e.target.dataset.quiz_id
                        );
                      }}
                      target="_blank"
                    >
                      Reset One Section
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <a
            className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer my-2 text-md"
            onClick={() => {
              setNumRowsShown(
                num_rows_shown * 10 > filtered_students.length
                  ? filtered_students.length
                  : num_rows_shown * 10
              );
            }}
          >
            Show{" "}
            {num_rows_shown * 10 > filtered_students.length
              ? "all"
              : num_rows_shown * 10}{" "}
            rows
          </a>
        </div>
      )}
    </div>
  );
};

const Main = () => {
  return (
    <div className="overflow-auto">
      <StudentsList></StudentsList>
    </div>
  );
};

const App = () => {
  return (
    <ContextProvider>
      <Main />
    </ContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
