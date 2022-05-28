const ApplicationsListStudentsAdder = (props) => {
  const { applications_object, modal_object } = useContext(MyContext);
  const [applications, setApplications] = applications_object;
  const [show_modal, setShowModal] = modal_object;

  const student_id_to_array_index_map = useRef({});
  const [loading, setLoading] = useState(false);
  const [saved_success, setSavedSuccess] = useState(false);
  const assignmentButton = useRef(null);
  const setLoadAgain = props.setLoadAgain;
  const [show_email_composer, setShowEmailComposer] = useState(false);

  useEffect(() => {
    student_id_to_array_index_map.current = {};
    for (let i = 0; i < applications.length; i++) {
      student_id_to_array_index_map.current[applications[i].Student.id] = i;
    }
  }, [applications]);

  const assignQuizToSelectedStudents = () => {
    setLoading(true);
    let list_of_student_ids_to_be_added = applications
      .filter(
        (application) =>
          !application.Student.already_added && application.Student.added
      )
      .map((application) => application.Student.id);

    if (list_of_student_ids_to_be_added.length == 0) {
      setLoading(false);
      alert("You have not selected any new students.");
      return;
    }

    fetch(`/quiz/assign/${props.quiz_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        list_of_student_ids_to_be_added: list_of_student_ids_to_be_added,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setSavedSuccess(true);
          setTimeout(() => {
            setSavedSuccess(false);
          }, 3000);
          setLoadAgain((cur) => cur + 1);
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Quiz could not be assigned to Students due to an unknown error."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="grid grid-cols-2 mb-4">
        <button
          className={
            saved_success
              ? "col-span-1 p-3 float-right bg-green-500 hover:bg-green-600 text-white cursor-pointer border-r border-white"
              : applications.length > 0
              ? "col-span-1 p-3 float-right bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer border-r border-white"
              : "col-span-1 p-3 float-right bg-gray-600 text-white cursor-not-allowed border-r border-white"
          }
          onClick={assignQuizToSelectedStudents}
          ref={assignmentButton}
          disabled={applications.length > 0 ? false : true}
        >
          {loading ? (
            <i className="fas fa-spinner animate-spin"></i>
          ) : !saved_success ? (
            <i className="fas fa-save"></i>
          ) : (
            <i className="fas fa-check"></i>
          )}{" "}
          Step 1: Assign Quiz to Selected Students
        </button>

        <button
          className={
            applications.length > 0
              ? "col-span-1 p-3 float-right bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer border-r border-white"
              : "col-span-1 p-3 float-right bg-gray-600 text-white cursor-not-allowed border-r border-white"
          }
          onClick={() => {
            if (
              applications
                .map((application) => application.Student)
                .filter((student) => student.added).length > 0
            )
              setShowEmailComposer((cur) => !cur);
            else alert("You haven't selected any new students.");
          }}
          disabled={applications.length > 0 ? false : true}
        >
          {show_email_composer ? (
            <i className="far fa-paper-plane"></i>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
          {"  "}
          Step 2: Send Emails to Selected Students
        </button>
      </div>

      {show_email_composer ? (
        <div className="mb-4">
          <p>
            Please make sure you assign this quiz to selected students first, by
            clicking on the <i className="fas fa-save"></i> Step 1 button above.
          </p>
          <EmailForm
            users={applications
              .map((application) => application.Student)
              .filter((student) => student.added)}
            sending_link={`/quiz/send-emails/${props.quiz_id}`}
            default_values={{
              email_subject: "IEC Assessment",
              email_heading: "IEC Assessment",
              email_body:
                "Dear Student<br>You are receiving this email because you applied for the next cohort of the Institute of Emerging Careers.<br>Congratulations, your application has been shortlisted.<br>The next step is for you to solve a timed assessment. You have 3 days (72 hours) to solve this assessment.",
              email_button_pre_text:
                "Click the following button to solve the assessment.",
              email_button_label: "Solve Assessment",
              email_button_url: "Will be automatically set for each user",
            }}
          />
        </div>
      ) : (
        <i></i>
      )}

      <h2 className="text-base text-center mb-4">
        <b>List of Applicants of this Round to whom you can assign the Quiz</b>
      </h2>
      {applications.length == 0 ? (
        <p>No applicants in this application round.</p>
      ) : (
        <div>
          <p className="mb-3 bg-gray-200 p-2">
            <i className="fas fa-check"></i> The gray rows are students that
            have already been assigned to this quiz. Note that you cannot
            unassign a quiz from a student once it is assigned. This is because
            it is possible that the student may have already solved the quiz or
            may be in the process of solving it.
          </p>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th>Select</th>
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
                <tr
                  key={application.id}
                  className={
                    application.Student.already_added ? "bg-gray-200" : ""
                  }
                >
                  <td className="border px-4 py-2">
                    <input
                      type="checkbox"
                      data-id={application.Student.id}
                      checked={application.Student.added}
                      onChange={(e) => {
                        setApplications((cur) => {
                          let copy = cur.slice();
                          copy[
                            student_id_to_array_index_map.current[
                              e.target.dataset.id
                            ]
                          ].Student.added =
                            !copy[
                              student_id_to_array_index_map.current[
                                e.target.dataset.id
                              ]
                            ].Student.added;
                          console.log(copy);
                          return copy;
                        });
                      }}
                    ></input>
                  </td>
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
        </div>
      )}
    </div>
  );
};
