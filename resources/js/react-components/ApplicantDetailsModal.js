const ApplicantDetailsModal = (props) => {
  const { applications_object, modal_object } = useContext(MyContext);
  const [applications, setApplications] = applications_object;
  const [show_modal, setShowModal] = modal_object;

  const [questions, setQuestions] = useState([
    { title: "Age Group", name: ["age_group"] },
    { title: "Father's Name", name: ["father_name"] },
    { title: "City of Residence", name: ["city"] },
    { title: "Province of Residence", name: ["province"] },
    { title: "Country of Residence", name: ["country"] },
    { title: "Home Address", name: ["Student.address"] },
    { title: "Current Address", name: ["current_address"] },
    { title: "Education Completed", name: ["education_completed"] },
    {
      title: ["Major of Education Completed"],
      name: ["education_completed_major"],
    },
    { title: "Ongoing Education", name: ["education_ongoing"] },
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
    {
      title:
        "Will you be willing to leave the job to attend the program full time, if you are given a stipend of a percentage of the salary?",
      name: ["will_leave_job"],
    },
    { title: "Have you applied to IEC before?", name: ["has_applied_before"] },
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
    {
      title: "The program is entirely online. Do you acknowledge that?",
      name: ["acknowledge_online"],
    },
    {
      title: "Applicant Emailed about Assessment",
      name: ["was_emailed_about_assessment"],
    },
  ]);

  const formatOutput = (output) => {
    console.log(output);
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

  return (
    <div>
      {show_modal > -1 ? (
        <div
          id="modal"
          className="h-screen w-full inset-0 fixed z-30 bg-black bg-opacity-60"
        >
          <div className=" h-90vh mx-auto mt-10 w-1/2 bg-white left-1/4 translate-x-2/4 shadow-xl pb-2">
            <div className="bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center">
              <h3 className="text-xl col-auto justify-self-start self-center">
                {`${applications[show_modal].Student.firstName} ${applications[show_modal].Student.lastName}`}
              </h3>
              <i
                className="fas fa-times text-white cursor-pointer col-auto justify-self-end self-center"
                onClick={() => {
                  setShowModal(-1);
                }}
              ></i>
            </div>
            <div className="p-8 h-80vh overflow-y-scroll">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{question.title}</td>
                      <td className="border px-4 py-2">
                        {formatOutput(
                          getValue(applications[show_modal], question.name)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
