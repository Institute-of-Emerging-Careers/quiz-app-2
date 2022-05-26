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

const App = () => {
  const [application_rounds, setApplicationRounds] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("/admin/application/rounds/all")
      .then((raw_response) => {
        if (!raw_response.ok) {
          alert(
            "Something went wrong while getting application rounds. Error code 01."
          );
        } else {
          raw_response
            .json()
            .then((response) => {
              setApplicationRounds(response.application_rounds);
              setCourses(
                response.courses.map((course) => {
                  course.checked = false;
                  return course;
                })
              );
            })
            .catch((err) => {
              console.log(err);
              alert(
                "Error while understanding the server's response. Error code 02."
              );
            });
        }
      })
      .catch((err) => {
        alert(
          "Please check your internet connection and try again. Error code 03."
        );
        console.log(err);
      });
  }, []);

  const displayApplicationRoundStudents = (e) => {
    const application_round_id = e.target.value;

    fetch(`/admin/application/all-applicants/${application_round_id}`)
      .then((raw_response) => {
        if (raw_response.ok) {
          raw_response.json().then((response) => {
            setApplications(response.applications);
          });
        } else {
          alert("Something went wrong. Code 01.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong. Code 02.");
      });
  };

  return (
    <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
      {/* Application Round Selector for importing Students List */}
      <section>
        <h2>Import Students from Application Rounds</h2>
        <label>Select an Application Round: </label>
        <select onChange={displayApplicationRoundStudents}>
          {application_rounds.map((round) => {
            <option value={round.id}>{round.title}</option>;
          })}
          <option></option>
        </select>
      </section>

      {/* Displaying student list of selected application round */}
      <section></section>
    </div>
  );
};

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("app")
);
