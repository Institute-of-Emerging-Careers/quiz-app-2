const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const ContextProvider = (props) => {
  const [orientation_id, setOrientationId] = useState(-1);
  const [orientation_name, setOrientationName] = useState("");
  const [students, setStudents] = useState([]);
  // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not

  return (
    <MyContext.Provider
      value={{
        orientation_id_object: [orientation_id, setOrientationId],
        orientation_name_object: [orientation_name, setOrientationName],
        students_object: [students, setStudents],
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

const NameForm = () => {
  const { orientation_id_object, orientation_name_object, students_object } =
    useContext(MyContext);

  const [orientation_id, setOrientationId] = orientation_id_object;
  const [orientation_name, setOrientationName] = orientation_name_object;
  const [students, setStudents] = students_object;

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

  const saveData = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fetch(
      `/admin/orientation/save/${document.getElementById("edit-field").value}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orientation_name: orientation_name,
          students: students,
        }),
      }
    ).then((response) => {
      response.json().then((parsed_response) => {
        if (parsed_response.success) {
          alert("Orientation data saved successfully!");
        }
      });
    });
  };

  return (
    <div>
      <form onSubmit={saveData} autoFocus>
        <label>Orientation Name: </label>
        <input
          type="text"
          name="orientation"
          value={orientation_name}
          onChange={(e) => {
            setOrientationName(e.target.value);
          }}
          className="ml-2 px-4 py-4 w-72 border"
        ></input>
        <button
          type="submit"
          className="ml-2 bg-green-400 hover:bg-green-500 text-white px-8 py-4 active:shadow-inner cursor-pointer"
        >
          <i class="fas fa-save"></i> Save All Data
        </button>
      </form>
    </div>
  );
};

const StudentsList = () => {
  const { orientation_id_object, orientation_name_object, students_object } =
    useContext(MyContext);

  let [students, setStudents] = students_object;

  return (
    <div>
      <h2 className="text-base text-center mb-4">
        <b>List of Students added to this Orientation</b>
      </h2>
      {students.length > 0 ? (
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter((student) => student.added)
              .map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.percentage_score}</td>
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

const NewStudentAdder = () => {
  const { orientation_id_object, orientation_name_object, students_object } =
    useContext(MyContext);

  const [students, setStudents] = students_object;
  const [loading, setLoading] = useState(false);
  const [filter_min_score, setFilterMinScore] = useState(0);

  const student_id_to_array_index_map = useRef({});
  const section2 = useRef(null);

  useEffect(() => {
    const orientation_id_field = document.getElementById("edit-field");
    setLoading(true);
    fetch(`/admin/orientation/all-students/${orientation_id_field.value}`).then(
      (raw_response) => {
        raw_response
          .json()
          .then((response) => {
            if (response.success) {
              for (let i = 0; i < response.data.length; i++) {
                student_id_to_array_index_map.current[response.data[i].id] = i;
              }
              setStudents(response.data);
            } else {
              alert(
                "Something went wrong while getting a list of candidates. Error code 01."
              );
            }
          })
          .catch((err) => {
            alert(
              "Something went wrong while getting a list of candidates. Error code 02."
            );
          })
          .finally(() => {
            setLoading(false);
          });
      }
    );
  }, []);

  const setAllCheckboxes = (new_val) => {
    setStudents((cur) => {
      let copy = cur.slice();
      for (let i = 0; i < copy.length; i++) {
        if (copy[i].percentage_score >= filter_min_score) {
          copy[i].added = new_val;
        }
      }
      return copy;
    });
  };

  const selectAll = () => {
    setAllCheckboxes(true);
    section2.current.scrollIntoView();
  };

  const deSelectAll = () => {
    setAllCheckboxes(false);
    section2.current.scrollIntoView();
  };

  return (
    <div>
      <h2 className="text-base text-center mb-2">
        <b>List of Candidates that can be added to this Orientation</b>
      </h2>

      <div ref={section2}>
        <div className="grid grid-cols-3">
          <div className="col-span-1">
            <label htmlFor="filter_min_score">Filter by Minimum Score: </label>
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
          <a
            className="col-span-1 cursor-pointer text-iec-blue underline hover:text-iec-blue-hover hover:no-underline"
            onClick={selectAll}
          >
            Click here to select all below
          </a>
          <a
            className="col-span-1 cursor-pointer text-iec-blue underline hover:text-iec-blue-hover hover:no-underline"
            onClick={deSelectAll}
          >
            Click here to deselect all below
          </a>
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
            {students
              .filter((student) => student.percentage_score >= filter_min_score)
              .map((student) => (
                <tr className="py-2" key={student.id}>
                  <td>
                    <input
                      type="checkbox"
                      id={student.id}
                      checked={student.added}
                      onChange={() => {
                        setStudents((cur) => {
                          let copy = cur.slice();
                          copy[
                            student_id_to_array_index_map.current[student.id]
                          ].added =
                            !copy[
                              student_id_to_array_index_map.current[student.id]
                            ].added;
                          return copy;
                        });
                      }}
                    ></input>
                  </td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>{student.gender}</td>
                  <td>{student.percentage_score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ContextProvider>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <NameForm />
      </div>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <StudentsList />
      </div>
      <hr></hr>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 min-h-screen text-sm">
        <NewStudentAdder />
      </div>
    </ContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
