const ApplicantDetailsModal = (props) => {
  const { applications_object, modal_object } = useContext(MyContext);
  const [applications, setApplications] = applications_object;
  const [show_modal, setShowModal] = modal_object;

  const [questions, setQuestions] = useState([
    { title: "Age Group", name: ["age_group"] },
    { title: "City of Residence", name: ["city"] },

    { title: "Education Completed", name: ["education_completed"] },

    { title: "Employment type", name: ["type_of_employment"] },

    { title: "Course Preference", name: ["first preference", "title"] },

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
          className="h-screen w-full inset-0 fixed z-30 bg-black/60"
        >
          <div className=" h-90vh mt-10 w-1/2 bg-white translate-x-2/4 shadow-xl pb-2">
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
