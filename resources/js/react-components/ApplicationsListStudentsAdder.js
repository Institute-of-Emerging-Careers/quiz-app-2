const ApplicationsListStudentsAdder = (props) => {
  const { applications_object, modal_object } = useContext(MyContext);
  const [applications, setApplications] = applications_object;
  const [show_modal, setShowModal] = modal_object;

  const student_id_to_array_index_map = useRef({});
  const [loading, setLoading] = useState(false);
  const [saved_success, setSavedSuccess] = useState(false);
  const assignmentButton = useRef(null);
  const setLoadAgain = props.setLoadAgain;

  useEffect(() => {
    student_id_to_array_index_map.current = {};
    for (let i = 0; i < applications.length; i++) {
      student_id_to_array_index_map.current[applications[i].Student.id] = i;
    }
  }, [applications]);

  const assignQuizToSelectedStudents = () => {
    setLoading(true);
    let list_of_student_ids_to_be_added = applications
      .filter((application) => application.added)
      .map((application) => application.Student.id);

    fetch(`/quiz/assign/${props.quiz_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        list_of_student_ids_to_be_added: list_of_student_ids_to_be_added,
      }),
    })
      .then((response) => {
        setLoading(false);
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
      });
  };

  return (
    <div>
      <button
        className={
          saved_success
            ? "px-3 py-2 float-right bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            : "px-3 py-2 float-right bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer"
        }
        onClick={assignQuizToSelectedStudents}
        ref={assignmentButton}
      >
        {loading ? (
          <i className="fas fa-spinner animate-spin"></i>
        ) : !saved_success ? (
          <i className="fas fa-save"></i>
        ) : (
          <i className="fas fa-check"></i>
        )}{" "}
        Assign Quiz to Selected Students
      </button>
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
                    {application.Student.already_added ? (
                      <i className="fas fa-check"></i>
                    ) : (
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
                    )}
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
