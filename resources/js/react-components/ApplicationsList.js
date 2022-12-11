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

  const [questions, setQuestions] = useState([
    { title: "Age Group", name: ["age_group"] },
    { title: "Father's Name", name: ["father_name"] },
    { title: "City of Residence", name: ["city"] },
    { title: "Province of Residence", name: ["province"] },
    { title: "Country of Residence", name: ["country"] },
    { title: "Home Address", name: ["address"] },
    { title: "Current Address", name: ["current_address"] },
    { title: "From flood affected area", name: ["belongs_to_flood_area"]},
    { title: "City of origin", name: ["city_of_origin"] },,
    { title: "Flood area name", name: ["flood_area_name"] },
    { title: "Has completed bachelor's degree", name: ["has_completed_ba"] },
    { title: "Has completed diploma", name: ["has_completed_diploma"] },
    { title: "Institute of degree or diploma", name: ["inst_degree_dip"] },
    { title: "Can share FinAid docs", name: ["can_share_fa_docs"] },
    { title: "Can share FinAid docs", name: ["can_share_fa_docs"] },
    { title: "Education Completed", name: ["education_completed"] },
    {
      title: ["Major of Education Completed"],
      name: ["education_completed_major"],
    },
    { title: "Ongoing Education", name: ["education_ongoing"] },
    { title: "Degree Choice", name: ["degree_choice"] },
    { title: "Major of Ongoing Education", name: ["education_ongoing_major"] },
    { title: "Monthly Family Income", name: ["monthly_family_income"] },
    {
      title: "Do you have computer and internet access?",
      name: ["computer_and_internet_access"],
    },
    {
      title: "Is there reliable internet facility in your area?",
      name: ["internet_facility_in_area"],
    },
    {
      title: "Can you spend 30 to 40 hours a week on the program?",
      name: ["time_commitment"],
    },
    { title: "Are you currently employed?", name: ["is_employed"] },
    { title: "Employment type", name: ["type_of_employment"] },
    { title: "Current salary", name: ["salary"] },
    { title: "How are you enrolling in the program", name: ["how_to_enroll"] },
    {
      title:
        "Will you be willing to leave the job to attend the program full time, if you are given a stipend of a percentage of the salary?",
      name: ["will_leave_job"],
    },
    { title: "Salary expectations after graduation", name: ["salary_expectation"] },
    { title: "Are you on financial aid in university?", name: ["on_fa_in_university"] },
    { title: "How many people are earning in your household?", name: ["people_earning_in_household"] },
    { title: "Have you applied to IEC before?", name: ["has_applied_before"] },
    { title: "How will you complete the course?", name: ["how_complete_course"] },
    { title: "Can you pay 2000 PKR per month?", name: ["can_pay_2000"] },
    { title: "Are you married?", name: ["is_married"]},
    { title: "First Preference", name: ["first preference", "title"] },
    { title: "Second Preference", name: ["second preference", "title"] },
    { title: "Third Preference", name: ["third preference", "title"] },
    { title: "Reason for Preferences", name: ["preference_reason"] },
    {
      title: "Are you a graduate in computer science or any related field?",
      name: ["is_comp_sci_grad"],
    },
    {
      title:
        "Do you have any digital skills certifications? If yes, please share their names and the name of the institution.",
      name: ["digi_skills_certifications"],
    },
    { title: "How did you hear about IEC?", name: ["how_heard_about_iec"] },
    { title: "Do you know anyone from IEC?", name: ["knows_from_IEC"] },
    { title: "Will you sign the LEC agreement?", name: ["LEC_acknowledgement"] },
    { title: "Will you be available for full time work after the program?", name: ["will_work_full_time"] },
    {
      title: "What is your first preference reason?",
      name: ["firstPreferenceReason"]
    },
    {
      title: "What is your second preference reason?",
      name: ["secondPreferenceReason"]
    },
    {
      title: "What is your first preference reason?",
      name: ["firstPreferenceReason"]
    },
    {
      title: "The program is entirely online. Do you acknowledge that?",
      name: ["acknowledge_online"],
    },
    {
      title: "Applicant Emailed about Assessment",
      name: ["was_emailed_about_assessment"],
    },
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
        title: "From flood affected areas",
        name: "belongs_to_flood_area",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
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
        title: "Can pay 2000",
        name: "can_pay_2000",
        filter_type: "fixed_values",
        discrepancy_between_value_and_text: true,
        possible_values: [
          { text: "Yes", value: 1, checked: false },
          { text: "No", value: 0, checked: false },
        ],
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
        title: "First Preference",
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
        title: "Second Preference",
        name: "secondPreferenceId",
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
        title: "Third Preference",
        name: "thirdPreferenceId",
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
                <th>Name</th>
                <th>Gender</th>
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
                    <td className="border px-4 py-2">{`${application.Student.firstName} ${application.Student.lastName}`}</td>
                    <td className="border px-4 py-2">
                      {application.Student.gender}
                    </td>
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
