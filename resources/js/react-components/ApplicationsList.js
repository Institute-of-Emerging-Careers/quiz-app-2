// this file requires data_lists.js
const ApplicationsList = (props) => {
  const { applications_object, modal_object } = useContext(MyContext);
  const [applications, setApplications] = applications_object;
  const [show_modal, setShowModal] = modal_object;
  const [show_filters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState([
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
      max: 1000000,
      increment: 5000,
      value: 0,
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
      title: "Minimum Current salary",
      name: "salary",
      filter_type: "integer_value",
      min: 0,
      max: 1000000,
      increment: 5000,
      value: 0,
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
      possible_values: [],
    },
    {
      title: "Second Preference",
      name: "secondPreferenceId",
      filter_type: "fixed_values",
      possible_values: [],
    },
    {
      title: "Third Preference",
      name: "thirdPreferenceId",
      filter_type: "fixed_values",
      possible_values: [],
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
      title: "Applicant Emailed about Assessment",
      name: "was_emailed_about_assessment",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [
        { text: "Yes", value: 1, checked: false },
        { text: "No", value: 0, checked: false },
      ],
    },
  ]);

  // continue here with filters

  return (
    <div>
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
              <i class="far fa-eye-slash"></i> Hide Filters
            </span>
          ) : (
            <span>
              <i class="far fa-eye"></i> Show Filters
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
                <label className="pl-2 col-span-1">{filter.value}</label>
              </div>
            ) : filter.filter_type == "fixed_values" &&
              filter.discrepancy_between_value_and_text ? (
              <div className="grid grid-cols-4">
                <label className="col-span-1">{filter.title}</label>
                <div className="col-span-3">
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
                            copy[e.target.dataset.filter_index].possible_values[
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
                    filter.possible_values.map((possible_value_obj, i2) => (
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
                    ))
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

      {applications.length > 0 ? (
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone</th>
              <th>CNIC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications
              .filter((application) => {
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
                      else if (
                        cur.checked &&
                        cur.value == application[filter.name]
                      )
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
              .map((application, index) => (
                <tr key={application.id}>
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
                  <td className="border px-4 py-2">
                    <a
                      className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"
                      data-index={index}
                      onClick={(e) => {
                        setShowModal(e.target.dataset.index);
                      }}
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>No students to show.</p>
      )}
    </div>
  );
};
