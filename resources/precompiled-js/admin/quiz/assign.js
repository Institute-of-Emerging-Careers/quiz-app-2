"use strict";

const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;

const ContextProvider = props => {
  const [applications, setApplications] = useState([]);
  const [show_modal, setShowModal] = useState(-1); //value is set to the array index of the application whose details are to be shown by the modal

  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: {
      applications_object: [applications, setApplications],
      modal_object: [show_modal, setShowModal]
    }
  }, props.children);
};

const App = () => {
  const {
    applications_object,
    modal_object
  } = useContext(MyContext);
  const [applications, setApplications] = applications_object;
  const [application_rounds, setApplicationRounds] = useState([]);
  const [show_modal, setShowModal] = modal_object;
  const [assigned_students, setAssignedStudents] = useState([]);
  const [load_again, setLoadAgain] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch("/admin/application/rounds/all").then(raw_response => {
      if (!raw_response.ok) {
        alert("Something went wrong while getting application rounds. Error code 01.");
      } else {
        raw_response.json().then(response => {
          setApplicationRounds(response.application_rounds);
        }).catch(err => {
          console.log(err);
          alert("Error while understanding the server's response. Error code 02.");
        });
      }
    }).catch(err => {
      alert("Please check your internet connection and try again. Error code 03.");
      console.log(err);
    });
  }, []);
  useEffect(() => {
    fetch("/quiz/all-assignees/".concat(document.getElementById("quiz-id-field").value)).then(raw_response => {
      if (!raw_response.ok) {
        alert("Something went wrong while getting current list of students to whom this quiz is assigned. Error code 01.");
      } else {
        raw_response.json().then(response => {
          setAssignedStudents(response);
        }).catch(err => {
          console.log(err);
          alert("Error while understanding the server's response about current list of assignees. Error code 02.");
        });
      }
    }).catch(err => {
      alert("Please check your internet connection and try again. Error code 03.");
      console.log(err);
    });
  }, [load_again]);

  const displayApplicationRoundStudents = e => {
    setLoading(true);
    const application_round_id = e.target.value;
    console.log("hi");
    fetch("/admin/application/all-applicants-and-quiz-assignments?application_round_id=".concat(application_round_id, "&quiz_id=").concat(document.getElementById("quiz-id-field").value)).then(raw_response => {
      if (raw_response.ok) {
        raw_response.json().then(response => {
          setApplications(response.applications);
        });
      } else {
        alert("Something went wrong. Code 01.");
      }
    }).catch(err => {
      console.log(err);
      alert("Something went wrong. Code 02.");
    }).finally(() => {
      setLoading(false);
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(StudentsList, {
    students: assigned_students,
    title: "List of Students to whom this Quiz is currently Assigned",
    fields: [, {
      title: "Name",
      name: ["Student.firstName", "Student.lastName"]
    }, {
      title: "Email",
      name: ["Student.email"]
    }, {
      title: "CNIC",
      name: ["Student.cnic"]
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-bold text-xl mb-2"
  }, "Assign Quiz to more Students"), /*#__PURE__*/React.createElement("label", null, "Select an Application Round: "), /*#__PURE__*/React.createElement("select", {
    value: "",
    onChange: displayApplicationRoundStudents,
    className: "py-2 px-3"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true,
    hidden: true
  }, "Select an option"), application_rounds.map(round => /*#__PURE__*/React.createElement("option", {
    key: round.id,
    value: round.id
  }, round.title))), loading ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin"
  }) : /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("section", {
    className: "mt-6"
  }, /*#__PURE__*/React.createElement(ApplicantDetailsModal, null), /*#__PURE__*/React.createElement(ApplicationsListStudentsAdder, {
    quiz_id: document.getElementById("quiz-id-field").value,
    setLoadAgain: setLoadAgain
  }))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement(App, null)), document.getElementById("app"));