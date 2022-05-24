const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;

const ContextProvider = (props) => {
  const [applications, setApplications] = useState([]);
  const [show_modal, setShowModal] = useState(-1); //value is set to the array index of the application whose details are to be shown by the modal

  return (
    <MyContext.Provider
      value={{
        applications_object: [applications, setApplications],
        modal_object: [show_modal, setShowModal],
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

const ApplicantDetailsModal = (props) => {
  const { applications_object, modal_object } = useContext(MyContext);
  const [show_modal, setShowModal] = modal_object;
  const [applications, setApplications] = applications_object;

  const [questions, setQuestions] = useState([
    { title: "Age Group", name: "age_group" },
    { title: "Father's Name", name: "father_name" },
    { title: "City of Residence", name: "city" },
    { title: "Province of Residence", name: "province" },
    { title: "Country of Residence", name: "country" },
    // { title: "Home Address", name: "Student.address" },
    { title: "Current Address", name: "current_address" },
    { title: "Education Completed", name: "education_completed" },
    {
      title: "Major of Education Completed",
      name: "education_completed_major",
    },
    { title: "Ongoing Education", name: "education_ongoing" },
    { title: "Major of Ongoing Education", name: "education_ongoing_major" },
    { title: "Monthly Family Income", name: "monthly_family_income" },
    {
      title: "Do you have computer and internet access?",
      name: "computer_and_internet_access",
    },
    {
      title: "Is there reliable internet facility in your area?",
      name: "internet_facility_in_area",
    },
    {
      title: "Can you spend 30 to 40 hours a week on the program?",
      name: "time_commitment",
    },
    { title: "Are you currently employed?", name: "is_employed" },
    { title: "Employment type", name: "type_of_employment" },
    { title: "Current salary", name: "salary" },
    {
      title:
        "Will you be willing to leave the job to attend the program full time, if you are given a stipend of a percentage of the salary?",
      name: "will_leave_job",
    },
    { title: "Have you applied to IEC before?", name: "has_applied_before" },
    { title: "First Preference", name: "firstPreferenceId" },
    { title: "Second Preference", name: "secondPreferenceId" },
    { title: "Third Preference", name: "thirdPreferenceId" },
    { title: "Reason for Preferences", name: "preference_reason" },
    {
      title: "Are you a graduate in computer science or any related field?",
      name: "is_comp_sci_grad",
    },
    {
      title:
        "Do you have any digital skills certifications? If yes, please share their names and the name of the institution.",
      name: "digi_skills_certifications",
    },
    { title: "How did you hear about IEC?", name: "how_heard_about_iec" },
    {
      title: "The program is entirely online. Do you acknowledge that?",
      name: "acknowledge_online",
    },
    {
      title: "Applicant Emailed about Assessment",
      name: "was_emailed_about_assessment",
    },
  ]);

  const formatOutput = (output) => {
    if (output === false) return "No";
    else if (output === true) return "Yes";
    else return output;
  };

  return (
    <div>
      {show_modal > -1 ? (
        <div
          id="modal"
          className="h-screen w-full inset-0 absolute z-30 bg-black bg-opacity-60"
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
                        {formatOutput(applications[show_modal][question.name])}
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

const ApplicationsList = () => {
  const { applications_object, modal_object } = useContext(MyContext);
  const [show_modal, setShowModal] = modal_object;
  const [applications, setApplications] = applications_object;

  return (
    <div>
      <ApplicantDetailsModal></ApplicantDetailsModal>
      <h2 className="text-base text-center mb-4">
        <b>List of Applications</b>
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
                    onClick={() => {
                      setShowModal(index);
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
        <p>No students added yet.</p>
      )}
    </div>
  );
};

const App = () => {
  const { applications_object } = useContext(MyContext);
  const [applications, setApplications] = applications_object;

  useEffect(() => {
    fetch(
      `/admin/application/all-applicants/${
        document.getElementById("application-round-id-field").value
      }`
    ).then((raw_response) => {
      if (raw_response.ok) {
        raw_response.json().then((response) => {
          setApplications(response.applications);
        });
      } else {
        alert("Something went wrong. Code 01.");
      }
    });
  }, []);

  return (
    <div>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <ApplicationsList></ApplicationsList>
      </div>
    </div>
  );
};

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("app")
);
