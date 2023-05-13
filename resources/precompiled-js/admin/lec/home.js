"use strict";

const createRound = (e, setRounds, setShowModal, setError) => {
  e.preventDefault();
  setError("");
  fetch("/admin/lec/create", {
    method: "POST",
    body: new URLSearchParams(new FormData(e.target))
  }).then(response => {
    if (response.ok) {
      setShowModal(false);
      response.json().then(setRounds).catch(err => {
        setError("Error parsing response.");
        console.log(err);
      });
    } else {
      setError("An error occured.");
    }
  }).catch(err => {
    setError("An error occured.");
    console.log(err);
  });
};

const getRounds = async setRounds => {
  try {
    const raw_response = await fetch("/admin/lec/all");

    if (raw_response.ok) {
      const response = await raw_response.json();
      setRounds(response);
    } else {
      alert("Error getting rounds. Code 01.");
    }
  } catch (err) {
    alert("Error getting roudns. Code 02.");
    console.log(err);
  }
};

const getAssessments = setAssessments => {
  fetch("/quiz/all-titles-and-num-attempts").then(response => {
    response.json().then(parsed_response => {
      setAssessments(parsed_response);
    });
  });
};

const App = () => {
  const [rounds, setRounds] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [assessments, setAssessments] = React.useState([]);
  const [error, setError] = React.useState("");
  React.useEffect(() => getRounds(setRounds), []);
  React.useEffect(() => getAssessments(setAssessments), []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Modal, {
    show_modal: showModal,
    setShowModal: setShowModal,
    heading: "Create New LEC Round"
  }, !!error && /*#__PURE__*/React.createElement("p", {
    className: "text-red-500"
  }, /*#__PURE__*/React.createElement("i", {
    class: "fas fa-exclamation-triangle"
  }), " ", error), /*#__PURE__*/React.createElement("form", {
    method: "POST",
    onSubmit: e => createRound(e, setRounds, setShowModal, setError),
    className: "flex flex-col gap-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "title"
  }, "Name the LEC Round:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "title",
    placeholder: "e.g. Cohort 7 LEC Round 1",
    className: "px-2 py-1 border ml-2"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "send_reminders"
  }, "Send Reminder Emails: "), /*#__PURE__*/React.createElement("select", {
    name: "send_reminders",
    className: "px-2 py-1"
  }, /*#__PURE__*/React.createElement("option", {
    value: "1",
    selected: true
  }, "Yes"), /*#__PURE__*/React.createElement("option", {
    value: "0"
  }, "No"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    for: "source_assessment_id"
  }, "Select Assessment to import Students from: "), /*#__PURE__*/React.createElement("select", {
    className: "px-2 py-1",
    name: "source_assessment_id"
  }, assessments.map(assessment => /*#__PURE__*/React.createElement("option", {
    className: "p-2",
    value: assessment.id,
    key: assessment.id
  }, assessment.title, " | ", assessment.num_assignments, " Assignments", " ")))), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Create",
    className: "px-2 py-1 cursor-pointer bg-iec-blue hover:bg-iec-blue-hover text-white"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl mt-6 mb-4 font-bold"
  }, "LEC Rounds", " ", /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowModal(cur => !cur);
    },
    className: "text-xs px-4 py-1 cursor-pointer bg-iec-blue hover:bg-iec-blue-hover text-white rounded-full"
  }, "NEW")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-start gap-y-10 gap-x-10"
  }, rounds.length > 0 ? rounds.map((round, index) => /*#__PURE__*/React.createElement("div", {
    className: "grid w-64 grid-cols-6 gap-4 border bg-white pb-2 quiz-card",
    key: index
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 col-span-8 h-16 bg-iec-blue justify-center content-center"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/admin/lec/edit/".concat(round.id),
    className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
    title: "Edit Orientation"
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-edit "
  })), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      deleteRound(round.id);
    },
    className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
    title: "Delete Orientation"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash "
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "col-span-6 font-semibold text-lg px-4"
  }, round.title), /*#__PURE__*/React.createElement("div", {
    className: "col-start-1 col-span-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pl-4 pt-0"
  }, "0 invited")), /*#__PURE__*/React.createElement("div", {
    className: "col-start-4 col-span-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pr-4 pt-0"
  }, "0 attended")))) : /*#__PURE__*/React.createElement("p", null, "No LEC Rounds found.")));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));