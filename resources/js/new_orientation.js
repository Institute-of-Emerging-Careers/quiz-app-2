const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const ContextProvider = (props) => {
  const [orientation_id, setOrientationId] = useState(-1);
  const [orientation_name, setOrientationName] = useState("");
  const [current_students, setCurrentStudents] = useState([]);

  return (
    <MyContext.Provider
      value={{
        orientation_id_object: [orientation_id, setOrientationId],
        orientation_name_object: [orientation_name, setOrientationName],
        current_students_object: [current_students, setCurrentStudents],
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

const NameForm = () => {
  const {
    orientation_id_object,
    orientation_name_object,
    current_students_object,
  } = useContext(MyContext);

  const [orientation_id, setOrientationId] = orientation_id_object;
  const [orientation_name, setOrientationName] = orientation_name_object;

  useEffect(() => {
    if (document.getElementById("edit-field").value == "false") {
      fetch(
        `/admin/orientation/create-new/${
          document.getElementById("quiz-id-field").value
        }`
      ).then((response) => {
        response.json().then((parsed_response) => {
          if (parsed_response.success) {
            setOrientationId(parsed_response.orientation_id);
            setOrientationName(parsed_response.orientation_name);
          }
        });
      });
    } else {
      setOrientationId(parseInt(document.getElementById("edit-field").value));
      setOrientationName(
        document.getElementById("orientation-name-field").value
      );
    }
  }, []);

  const changeOrientationName = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fetch("/admin/orientation/change-name/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orientation_name: orientation_name,
        orientation_id: orientation_id,
      }),
    }).then((response) => {
      response.json().then((parsed_response) => {
        if (parsed_response.success) {
          alert("Orientation name changed successfully!");
        }
      });
    });
  };

  return (
    <div>
      <form onSubmit={changeOrientationName} autoFocus>
        <label>Change Orientation Name: </label>
        <input
          type="text"
          name="orientation"
          value={orientation_name}
          onChange={(e) => {
            setOrientationName(e.target.value);
          }}
          className="ml-2 px-4 py-4 w-72 border"
        ></input>
        <input
          type="submit"
          className="bg-green-400 hover:bg-green-500 text-white px-8 py-4 active:shadow-inner cursor-pointer"
        ></input>
      </form>
    </div>
  );
};

const StudentsList = () => {
  const {
    orientation_id_object,
    orientation_name_object,
    current_students_object,
  } = useContext(MyContext);

  const [current_students, setCurrentStudents] = current_students_object;

  useEffect(() => {
    if (document.getElementById("edit-field").value != "false") {
      const orientation_id_field = document.getElementById("edit-field");
      fetch(`/admin/orientation/students-list/${orientation_id_field.value}`)
        .then((response) => {
          response.json().then((parsed_response) => {
            if (parsed_response.success) {
              setCurrentStudents(parsed_response.data);
            } else
              alert(
                "Something went wrong on the server while getting list of students."
              );
          });
        })
        .catch((err) => {
          alert("Error getting list of students.");
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="mt-2">
      <h2 className="text-base text-center mb-2">
        <b>List of Students added to this Orientation</b>
      </h2>
      <table className="w-full text-left text-base">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {current_students.map((student) => (
            <tr>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const NewStudentAdder = () => {
  const {
    orientation_id_object,
    orientation_name_object,
    current_students_object,
  } = useContext(MyContext);

  const [candidates, setCandidates] = useState([]);
  const [show_candidates, setShowCandidates] = useState(false);
  // ^when this becomes true, we get a list of candidates from the server. Who are candidates? These are students who attempted the Assessment that is linked to this Orientation and hence "can" be invited to this orientation.

  const [current_students, setCurrentStudents] = current_students_object;
  const [loading, setLoading] = useState(false);
  const [filter_min_score, setFilterMinScore] = useState(0);

  useEffect(() => {
    if (show_candidates) {
      const orientation_id_field = document.getElementById("edit-field");
      setLoading(true);
      fetch(
        `/admin/orientation/all-candidates/${orientation_id_field.value}`
      ).then((raw_response) => {
        console.log(raw_response);
        raw_response
          .json()
          .then((response) => {
            if (response.success) {
              setCandidates(response.data);
            } else {
              alert("Something went wrong while getting a list of candidates.");
            }
          })
          .catch((err) => {
            alert("Something went wrong while getting a list of candidates.");
          })
          .finally(() => {
            setLoading(false);
          });
      });
    }
  }, [show_candidates]);

  const toggleShowCandidates = () => {
    setShowCandidates((cur) => !cur);
  };

  return (
    <div className="mt-16">
      {!show_candidates ? (
        <button
          onClick={toggleShowCandidates}
          className="py-3 px-6 bg-iec-blue text-white cursor-pointer hover:bg-iec-blue-hover"
        >
          <i class="fas fa-plus"></i> Add More Students to this Orientation
        </button>
      ) : (
        <div>
          <h2 className="text-base text-center mb-2">
            <b>List of Candidates that can be added to this Orientation</b>
          </h2>
          <div className="grid grid-cols-2">
            <div>
              <label for="filter_min_score">Filter by Minimum Score: </label>
              <input
                type="number"
                min="0"
                max="100"
                increment="1"
                value={filter_min_score}
                name="filter_min_score"
                onChange={(e) => {
                  setFilterMinScore(e.target.value);
                }}
                className="ml-2 p-2 w-72 border"
              ></input>
              %
            </div>
            <button className="py-3 px-6 bg-iec-blue text-white cursor-pointer hover:bg-iec-blue-hover">
              Add Selected Students to Orientation
            </button>
          </div>
          <br></br>
          {loading ? (
            <i className="fas fa-spinner animate-spin text-lg"></i>
          ) : (
            <div></div>
          )}
          <table className="w-full text-left px-2">
            <thead>
              <tr className="py-4">
                <th>Selection</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Score (%)</th>
              </tr>
            </thead>
            <tbody>
              {candidates
                .filter(
                  (candidate) => candidate.percentage_score >= filter_min_score
                )
                .map((candidate) => (
                  <tr className="py-2">
                    <td>
                      <input type="checkbox" id={candidate.id}></input>
                    </td>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.age}</td>
                    <td>{candidate.gender}</td>
                    <td>{candidate.percentage_score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <ContextProvider>
      <NameForm />
      <StudentsList />
      <hr></hr>
      <NewStudentAdder />
    </ContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
