// this file requires data_lists.js
const ApplicationsList = (props) => {
  const { applications_object, modal_object, reload_object } =
    useContext(MyContext);
  const [reload_applications, setReloadApplications] = reload_object;
  const [applications, setApplications] = applications_object;
  const [show_modal, setShowModal] = modal_object;
  const [show_filters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState([]);
  const [downloading_as_excel, setDownloadingAsExcel] = useState(false);
  const [filtered_applications, setFilteredApplications] = useState([]);
  const [num_rows, setNumRows] = useState(0);
  const application_id_to_array_index_map =
    props.application_id_to_array_index_map;

    console.log(applications);
  const [questions, setQuestions] = useState([
    { title: "Age Group", name: ["age_group"] },
    { title: "City of Residence", name: ["city"] },

    { title: "Education Completed", name: ["education_completed"] },

    { title: "Employment type", name: ["type_of_employment"] },

    { title: "Course Preference", name: ["first_preference", "title"] },

  ]);

  useEffect(() => {
    fetch(`/admin/application/courses/${props.application_round_id}`)
      .then((raw_response) => {
        if (raw_response.ok) {
          raw_response
            .json()
            .then((response) => {
              setCourses(response);
            })
            .catch((err) => {
              alert("The server sent an invalid response. Something is wrong.");
              console.log(err);
            });
        } else {
          alert(
            "Something went wrong while getting list of course preference filters. The rest of the page will work fine."
          );
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Could not load courses for filtering. Check your internet connection."
        );
      });
  }, []);

  useEffect(() => {
    setFilters([
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
        title: "Course Interest",
        name: "firstPreferenceId",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: courses.map((val) => ({
          value: val.id,
          text: val.title,
          checked: false,
        })),
        expand_possible_values: false,
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
  }, [courses]);

  useEffect(() => {
    setFilteredApplications(applications);
  }, [applications]);

  useEffect(() => {
    setFilteredApplications(
      applications.filter((application) => {
        let show_this_application = true;
        for (let i = 0; i < filters.length; i++) {
          const filter = filters[i];
          if (
            filter.filter_type == "integer_value" &&
            application[filter.name] < filter.value
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
              else if (cur.checked && cur.value == application[filter.name])
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
  }, [filters]);

  useEffect(() => {
    setNumRows(filtered_applications.length);
  }, [filtered_applications]);

  const formatOutput = (output) => {
    if (output === false) return "No";
    else if (output === true) return "Yes";
    else return output;
  };

  const getValue = (obj, properties_array) => {
    // if properties_array = ["Student","address"], then this funtion returns obj.Student.address
    return properties_array.reduce(
      (final_value, property) =>
        final_value == null ? null : final_value[property],
      obj
    );
  };

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

  const deleteApplication = (array_index) => {
    const application_id = filtered_applications[array_index].id;
    fetch(`/admin/application/delete/${application_id}`).then((res) => {
      if (res.ok) {
        setReloadApplications((cur) => !cur);
      } else {
        alert("Application delete failed due to unknown reason.");
      }
    });
  };

  return (
    <div className="overflow-auto">
      <h2 className="text-base text-center mb-4">
        <b>List of Applications in this Round</b>
      </h2>
      <div className="grid grid-cols-1 gap-y-4">
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
              <i className="far fa-eye"></i> Show Filters
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
      <hr></hr>
      <br></br>
      {!downloading_as_excel ? (
        <a
          target="_blank"
          className="text-white mb-2 float-right px-3 py-2 bg-iec-blue hover:bg-iec-blue-hover cursor-pointer"
          onClick={() => {
            setDownloadingAsExcel(true);
            download_table_as_csv("main-table");
            setDownloadingAsExcel(false);
          }}
        >
          <i className="fas fa-download"></i> Download as Excel File
        </a>
      ) : (
        <i></i>
      )}
      {applications.length > 0 ? (
        <div>
          <p>Total Number of Applications: {applications.length}</p>
          <p>Filtered Number of Applications: {num_rows}</p>
          <table
            className={`w-full text-left text-sm ${
              downloading_as_excel ? " invisible" : ""
            }`}
            id="main-table"
          >
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>CNIC</th>
                {questions.map((question) => (
                  <th className={downloading_as_excel ? "" : "hidden"}>
                    {question.title}
                  </th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered_applications.map((application, index) => {
                return (
                  <tr
                    key={application.id}
                    className={
                      application.rejection_email_sent ? "bg-red-300" : ""
                    }
                  >
                    
                    <td className="border px-4 py-2">{application.id}</td>
                    <td className="border px-4 py-2">{`${application.Student.firstName} ${application.Student.lastName}`}</td>

                    <td className="border px-4 py-2">
                      {application.Student.email}
                    </td>
                    <td className="border px-4 py-2">{application.phone}</td>
                    <td className="border px-4 py-2">
                      {application.Student.cnic}
                    </td>
                    {questions.map((question) => (
                      <td className={downloading_as_excel ? "" : "hidden"}>
                        {formatOutput(getValue(application, question.name))}
                      </td>
                    ))}
                    <td className="border px-4 py-2">
                      <a
                        className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"
                        data-index={
                          application_id_to_array_index_map[application.id]
                        }
                        onClick={(e) => {
                          setShowModal(e.target.dataset.index);
                        }}
                      >
                        View Details
                      </a>{" "}
                      {" | "}
                      <a
                        className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"
                        data-index={
                          application_id_to_array_index_map[application.id]
                        }
                        onClick={(e) => {
                          deleteApplication(e.target.dataset.index);
                        }}
                      >
                        Delete Application
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No students to show.</p>
      )}
    </div>
  );
};
