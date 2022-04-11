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

  const orientation_name_form_ref = useRef("");

  useEffect(() => {
    if (document.getElementById("edit-field").value == "false") {
      fetch("/orientation/create-new").then((response) => {
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
    fetch("/orientation/change-name/", {
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
    <form
      onSubmit={changeOrientationName}
      ref={orientation_name_form_ref}
      autoFocus
    >
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
  );
};

const App = () => {
  return (
    <ContextProvider>
      <NameForm />
    </ContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
