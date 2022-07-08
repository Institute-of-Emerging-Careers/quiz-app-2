const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const App = () => {
  const [interview_rounds, setInterviewRounds] = useState([]);
  const [all_assessments, setAllAssessments] = useState([]);
  const [show_modal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    fetch("/admin/interview/all").then(raw_response => {
      raw_response.json().then(response => {
        if (response.success) setInterviewRounds(response.interview_rounds);else alert("Something went wrong while getting interview rounds. Error code 01.");
      }).catch(err => {
        alert("Error while understanding the server's response. Error code 02.");
      });
    }).catch(err => {
      alert("Please check your internet connection and try again. Error code 03.");
    });
    fetch("/quiz/all-titles-and-num-attempts").then(response => {
      response.json().then(parsed_response => {
        setAllAssessments(parsed_response);
      });
    });
  }, [reload]);

  const createNewInterview = e => {
    window.location = `/admin/interview/new/${e.target.value}`;
  };

  const deleteInterviewRound = interview_round_id => {
    fetch(`/admin/interview/round/delete/${interview_round_id}`).then(res => {
      if (res.ok) setReload(cur => !cur);else alert("Error on server while deleting interview round.");
    }).catch(err => {
      console.log(err);
      alert("Error deleting interview round. Check your internet connection.");
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: show_modal ? "h-screen w-screen inset-0 absolute z-30 bg-black bg-opacity-60" : "hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto mt-10 w-1/2 bg-white left-1/4 translate-x-2/4 shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-link text-xl text-white"
  }), " Create New Interview Round"), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: () => {
      setShowModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8"
  }, /*#__PURE__*/React.createElement("p", null, "Please choose an Assessment to link to this Interview Round. You will invite Students to this Interview Round based on their results in the chosen Assessment."), /*#__PURE__*/React.createElement("select", {
    className: "w-full p-2",
    onChange: createNewInterview
  }, /*#__PURE__*/React.createElement("option", {
    className: "p-2",
    selected: true,
    disabled: true
  }, "Choose an Assessment"), all_assessments.map(assessment => /*#__PURE__*/React.createElement("option", {
    className: "p-2",
    value: assessment.id,
    key: assessment.id
  }, assessment.title, " | ", assessment.num_assignments, " Assignments", " ")))))), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl mt-6 mb-4 font-bold"
  }, "Interview Rounds", /*#__PURE__*/React.createElement("button", {
    className: "text-xs px-4 py-1 cursor-pointer bg-iec-blue hover:bg-iec-blue-hover text-white rounded-full",
    onClick: () => {
      setShowModal(cur => !cur);
    }
  }, "NEW")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-start gap-y-10 gap-x-10"
  }, interview_rounds.map((interview_round, index) => /*#__PURE__*/React.createElement("div", {
    className: "grid w-64 grid-cols-6 gap-4 border bg-white pb-2 quiz-card",
    key: index
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 col-span-8 h-16 bg-iec-blue justify-center content-center"
  }, /*#__PURE__*/React.createElement("a", {
    href: `/admin/interview/edit/${interview_round.id}`,
    className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
    title: "Edit Interview Round"
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-edit "
  })), /*#__PURE__*/React.createElement("a", {
    className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
    title: "Delete Interview Round",
    onClick: () => {
      deleteInterviewRound(interview_round.id);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash "
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "col-span-6 font-semibold text-lg px-4"
  }, interview_round.title), /*#__PURE__*/React.createElement("div", {
    className: "col-start-1 col-span-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pl-4 pt-0"
  }, "0 invited")), /*#__PURE__*/React.createElement("div", {
    className: "col-start-4 col-span-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pr-4 pt-0"
  }, "0 attended"))))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));