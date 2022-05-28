// this file requires data_lists.js
const ApplicationsList = (props) => {
  const { applications_object, modal_object } = useContext(MyContext);
  const [applications, setApplications] = applications_object;
  const [show_modal, setShowModal] = modal_object;

  const [filters, setFilters] = useState([
    {
      title: "Age Group",
      name: "age_group",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: age_groups,
    },
    {
      title: "City of Residence",
      name: "city",
      filter_type: "fixed_values",
      possible_values: cities,
      discrepancy_between_value_and_text: false,
    },
    {
      title: "Province of Residence",
      name: "province",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: provinces,
    },
    {
      title: "Country of Residence",
      name: "country",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: cities,
    },
    // { title: "Home Address", name: "Student.address" },
    {
      title: "Education Completed",
      name: "education_completed",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: education_levels,
    },
    {
      title: "Ongoing Education",
      name: "education_ongoing",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: education_levels,
    },
    {
      title: "Monthly Family Income",
      name: "monthly_family_income",
      filter_type: "integer_value",
      min: 0,
      max: 4294967295,
      increment: 500,
    },
    {
      title: "Do you have computer and internet access?",
      name: "computer_and_internet_access",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [
        { text: "Yes", value: 1 },
        { text: "No", value: 0 },
      ],
    },
    {
      title: "Is there reliable internet facility in your area?",
      name: "internet_facility_in_area",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [
        { text: "Yes", value: 1 },
        { text: "No", value: 0 },
      ],
    },
    {
      title: "Can you spend 30 to 40 hours a week on the program?",
      name: "time_commitment",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [
        { text: "Yes", value: 1 },
        { text: "No", value: 0 },
      ],
    },
    {
      title: "Are you currently employed?",
      name: "is_employed",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [
        { text: "Yes", value: 1 },
        { text: "No", value: 0 },
      ],
    },
    {
      title: "Employment type",
      name: "type_of_employment",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: false,
      possible_values: [type_of_employment],
    },
    {
      title: "Current salary",
      name: "salary",
      filter_type: "integer_value",
      min: 0,
      max: 4294967295,
      increment: 500,
    },
    {
      title:
        "Will you be willing to leave the job to attend the program full time, if you are given a stipend of a percentage of the salary?",
      name: "will_leave_job",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [
        { text: "Yes", value: 1 },
        { text: "No", value: 0 },
      ],
    },
    {
      title: "Have you applied to IEC before?",
      name: "has_applied_before",
      filter_type: "fixed_values",
      discrepancy_between_value_and_text: true,
      possible_values: [
        { text: "Yes", value: 1 },
        { text: "No", value: 0 },
      ],
    },
    {
      title: "First Preference",
      name: "firstPreferenceId",
      filter_type: "fixed_values",
    },
    {
      title: "Second Preference",
      name: "secondPreferenceId",
      filter_type: "fixed_values",
    },
    {
      title: "Third Preference",
      name: "thirdPreferenceId",
      filter_type: "fixed_values",
    },
    {
      title: "Are you a graduate in computer science or any related field?",
      name: "is_comp_sci_grad",
      filter_type: "fixed_values",
    },
    {
      title: "The program is entirely online. Do you acknowledge that?",
      name: "acknowledge_online",
      filter_type: "fixed_values",
    },
    {
      title: "Applicant Emailed about Assessment",
      name: "was_emailed_about_assessment",
      filter_type: "fixed_values",
    },
  ]);

  return (
    <div>
      <h2 className="text-base text-center mb-4">
        <b>List of Applications in this Round</b>
      </h2>
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
            {applications.map((application, index) => (
              <tr key={application.id}>
                <td className="border px-4 py-2">{`${application.Student.firstName} ${application.Student.lastName}`}</td>
                <td className="border px-4 py-2">
                  {application.Student.gender}
                </td>
                <td className="border px-4 py-2">
                  {application.Student.email}
                </td>
                <td className="border px-4 py-2">{application.phone}</td>
                <td className="border px-4 py-2">{application.Student.cnic}</td>
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
