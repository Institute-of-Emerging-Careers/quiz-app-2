const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;

const ContextProvider = (props) => {
  const [applications, setApplications] = useState([]);
  const [reload_applications, setReloadApplications] = useState(false);
  const [show_modal, setShowModal] = useState(-1); //value is set to the array index of the application whose details are to be shown by the modal

  return (
    <MyContext.Provider
      value={{
        applications_object: [applications, setApplications],
        modal_object: [show_modal, setShowModal],
        reload_object: [reload_applications, setReloadApplications],
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

const App = () => {
  const { applications_object, modal_object, reload_object } =
    useContext(MyContext);
  const [show_modal, setShowModal] = modal_object;
  const [reload_applications, setReloadApplications] = reload_object;
  const [applications, setApplications] = applications_object;
  const [application_id_to_array_index_map, setApplicationIdToArrayIndexMap] =
    useState({});

  useEffect(() => {
    setApplicationIdToArrayIndexMap((cur) => {
      let obj = {};
      applications.forEach((application, index) => {
        obj[application.id] = index;
      });
      return obj;
    });
  }, [applications]);

  useEffect(() => {
    fetch(
      `/admin/application/all-applicants/${
        document.getElementById("application-round-id-field").value
      }`
    )
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
  }, [reload_applications]);

  return (
    <div>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <ApplicantDetailsModal></ApplicantDetailsModal>
        <ApplicationsList
          application_round_id={
            document.getElementById("application-round-id-field").value
          }
          application_id_to_array_index_map={application_id_to_array_index_map}
        ></ApplicationsList>
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
