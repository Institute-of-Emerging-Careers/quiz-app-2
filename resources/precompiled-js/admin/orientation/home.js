"use strict";

const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const App = () => {
  const [orientations, setOrientations] = useState([]);
  const [show_modal, setShowModal] = useState(false);
  const [all_assessments, setAllAssessments] = useState([]);
  const [updateAllOrientations, setUpdateAllOrientations] = useState(0);
  useEffect(() => {
    fetch("/admin/orientation/all").then(response => {
      response.json().then(parsed_response => {
        if (parsed_response.success) {
          setOrientations(parsed_response.data);
        } else alert("There was a problem while getting the orientations. Contact IT.");
      });
    });
    fetch("/quiz/all-titles-and-num-attempts").then(response => {
      response.json().then(parsed_response => {
        console.log(parsed_response);
        setAllAssessments(parsed_response);
      });
    });
  }, [updateAllOrientations]);

  const createNewOrientation = e => {
    window.location = "/admin/orientation/new/".concat(e.target.value);
  };

  const deleteOrientation = orientation_id => {
    fetch("/admin/orientation/delete/".concat(orientation_id)).then(raw_response => {
      raw_response.json().then(response => {
        if (response.success) {
          alert("Orientation deleted successfully.");
          setUpdateAllOrientations(cur => cur + 1);
        } else {
          alert("Orientation could not be deleted due to an error. Code 01.");
        }
      }).catch(err => {
        alert("Orientation could not be deleted due to an error. Code 02.");
      });
    }).catch(err => {
      alert("Orientation could not be deleted due to an error. Code 03.");
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: show_modal ? "h-screen w-screen inset-0 absolute z-30 bg-black/60" : "hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-10 w-1/2 bg-white translate-x-2/4 shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-link text-xl text-white"
  }), " Create New Orientation"), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: () => {
      setShowModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8"
  }, /*#__PURE__*/React.createElement("p", null, "Please choose an Assessment to link to this Orientation. You will add Students to this Orientation based on their results in this chosen Assessment."), /*#__PURE__*/React.createElement("select", {
    className: "w-full p-2",
    onChange: createNewOrientation
  }, /*#__PURE__*/React.createElement("option", {
    className: "p-2",
    value: "-1",
    selected: true,
    disabled: true
  }, "Choose an Assessment"), all_assessments.map(assessment => /*#__PURE__*/React.createElement("option", {
    className: "p-2",
    value: assessment.id,
    key: assessment.id
  }, assessment.title, " | ", assessment.num_assignments, " Assignments", " ")))))), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl mt-6 mb-4 font-bold"
  }, "Orientations", " ", /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowModal(cur => !cur);
    },
    className: "text-xs px-4 py-1 cursor-pointer bg-iec-blue hover:bg-iec-blue-hover text-white rounded-full"
  }, "NEW")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-start gap-y-10 gap-x-10"
  }, orientations.length > 0 ? orientations.map((orientation, index) => /*#__PURE__*/React.createElement("div", {
    className: "grid w-64 grid-cols-6 gap-4 border bg-white pb-2 quiz-card",
    key: index
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 col-span-8 h-16 bg-iec-blue justify-center content-center"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/admin/orientation/edit/".concat(orientation.id),
    className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
    title: "Edit Orientation"
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-edit "
  })), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      deleteOrientation(orientation.id);
    },
    className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
    title: "Delete Orientation"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash "
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "col-span-6 font-semibold text-lg px-4"
  }, orientation.title), /*#__PURE__*/React.createElement("div", {
    className: "col-start-1 col-span-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pl-4 pt-0"
  }, "0 invited")), /*#__PURE__*/React.createElement("div", {
    className: "col-start-4 col-span-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pr-4 pt-0"
  }, "0 attended")))) : /*#__PURE__*/React.createElement("p", null, "No orientations found.")));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));