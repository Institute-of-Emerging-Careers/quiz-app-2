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

  const [orientation_id, setOrientationId] = orientation_id_object;
  const [orientation_name, setOrientationName] = orientation_name_object;
  const [current_students, setCurrentStudents] = current_students_object;

  useEffect(() => {
    if (document.getElementById("edit-field").value != "false") {
      fetch(
        `/admin/orientation/students-list/${
          document.getElementById("edit-field").value
        }`
      )
        .then((response) => {
          response.json().then((parsed_response) => {
            console.log(parsed_response);
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
      <h2 className="text-base">
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

const App = () => {
  return (
    <ContextProvider>
      <NameForm />
      <StudentsList />
    </ContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
