"use strict";

const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;

const createApplicationRound = (courses, new_round_title, setUpdateData, setShowNewRoundModal) => {
  if (new_round_title == "") alert("Please give the Application Round a title.");else if (courses.reduce((num_false, cur) => {
    num_false += cur.checked;
  }, 0) < 3) alert("Please select at least 3 courses.");else {
    fetch("/admin/application/rounds/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: new_round_title,
        courses: courses.filter(cur => cur.checked)
      })
    }).then(response => {
      if (response.ok) {
        setShowNewRoundModal(false);
        setUpdateData(cur => cur + 1);
      } else alert("Could not create application round.");
    });
  }
};

const deleteApplicationRound = (application_round_id, setDeletingApplicationRound, setUpdateData) => {
  const confirmation = prompt("Are you sure you wish to delete this application round? All applications will be deleted. Type 'yes' if you do.");

  if (confirmation == "yes") {
    setDeletingApplicationRound(true);
    fetch("/admin/application/rounds/delete/".concat(application_round_id), {
      method: "DELETE"
    }).then(response => {
      setDeletingApplicationRound(false);

      if (response.ok) {
        setUpdateData(cur => cur + 1);
      } else alert("Could not delete application round due to an error. Code 01.");
    }).catch(err => {
      console.log(err);
      alert("Could not delete application round due to an error. Code 02.");
    });
  }
};

const addNewCourse = (new_course_title, setNewCourseTitle, setCourses) => {
  fetch("/admin/application/course/new", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: new_course_title
    })
  }).then(response => {
    if (response.ok) {
      response.json().then(parsed_response => {
        if (parsed_response.newlyCreated) setCourses(cur => [...cur, {
          id: parsed_response.course.id,
          title: parsed_response.course.title,
          checked: false
        }]);
        setNewCourseTitle("");
      });
    }
  }).catch(err => {
    console.log(err);
    alert("Something went wrong while adding a new course.");
  });
};

const NewApplicationModal = _ref => {
  let {
    courses,
    setCourses,
    setUpdateData,
    setShowNewRoundModal
  } = _ref;
  const [new_round_title, setNewRoundTitle] = useState("");
  const [new_course_title, setNewCourseTitle] = useState("");
  return /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: "h-screen w-screen inset-0 absolute z-30 bg-black/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-10 w-1/2 bg-white translate-x-2/4 shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-link text-xl text-white"
  }), " Create New Application Round"), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: () => {
      setShowNewRoundModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      createApplicationRound(courses, new_round_title, setUpdateData, setShowNewRoundModal);
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "title"
  }, "Please give this Application Round a title:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    min: "2",
    name: "title",
    placeholder: "Cohort 4 Application Round 1",
    className: "border px-4 py-2 ml-2",
    value: new_round_title,
    onChange: e => {
      setNewRoundTitle(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "courses"
  }, "Which courses can students apply for?"), courses.map((course, index) => /*#__PURE__*/React.createElement("div", {
    key: course.id
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "courses",
    checked: course.checked,
    "data-index": index,
    "data-testid": "checkbox-".concat(course.title),
    onChange: e => {
      setCourses(cur => {
        let copy = cur.slice();
        copy[e.target.dataset.index].checked = !copy[e.target.dataset.index].checked;
        return copy;
      });
    }
  }), /*#__PURE__*/React.createElement("label", null, " " + course.title))), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "courses"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "newCourseTitle",
    className: "py-1 px-2 border",
    placeholder: "Course Title",
    value: new_course_title,
    onChange: e => {
      setNewCourseTitle(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => addNewCourse(new_course_title, setNewCourseTitle, setCourses),
    className: "px-2 py-1 bg-gray-400"
  }, "Add New Course")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Create Application Round",
    className: "px-4 py-2 mt-4 bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer"
  })))));
};

const openQuizSelectionModal = (applicationRoundId, setShowQuizSelectionModal, setActiveApplication) => {
  setActiveApplication(applicationRoundId);
  setShowQuizSelectionModal(true);
};

const saveAutoAssignQuiz = (applicationRoundId, quizId) => fetch("/admin/application/rounds/set-auto-assign-quiz/".concat(applicationRoundId, "/").concat(quizId), {
  method: "POST"
});

const QuizSelectionModal = _ref2 => {
  let {
    showQiuzSelectionModal,
    setShowQuizSelectionModal,
    activeApplicationRound
  } = _ref2;
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch("/quiz/all-titles").then(response => {
      response.json().then(parsed_response => {
        setQuizzes(parsed_response);
      });
    });
  }, []);
  return /*#__PURE__*/React.createElement(Modal, {
    show_modal: showQiuzSelectionModal,
    setShowModal: setShowQuizSelectionModal,
    heading: "Pick a Quiz to Auto Assign"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mr-2"
  }, "Select a Quiz to auto-assign to Applicants:"), /*#__PURE__*/React.createElement("select", {
    className: "border p-2",
    onChange: e => {
      console.log(e.target.value);
      setSelectedQuizId(e.target.value);
    }
  }, /*#__PURE__*/React.createElement("option", {
    disabled: true,
    selected: true
  }, "Select an option"), quizzes.map(quiz => /*#__PURE__*/React.createElement("option", {
    key: quiz.id,
    value: quiz.id
  }, quiz.title, " | Created ", new Date(quiz.createdAt).toDateString()))), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue hover:bg-iec-blue-hover text-white px-3 py-2 mr-1",
    type: "button",
    onClick: async () => {
      setLoading(true);

      try {
        await saveAutoAssignQuiz(activeApplicationRound, selectedQuizId);
      } catch (err) {
        alert("Something went wrong.");
      }

      setLoading(false);
    }
  }, "Auto-Assign"), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue hover:bg-iec-blue-hover text-white px-3 py-2",
    type: "button"
  }, "Disable Auto-Assignment"), loading && /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin self-center"
  }));
};

const App = () => {
  const [application_rounds, setApplicationRounds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showNewRoundModal, setShowNewRoundModal] = useState(false);
  const [showQiuzSelectionModal, setShowQuizSelectionModal] = useState(false);
  const [activeApplication, setActiveApplication] = useState(null);
  const [update_data, setUpdateData] = useState(0);
  const [show_copied_box, setShowCopiedBox] = useState(false);
  const [deleting_application_round, setDeletingApplicationRound] = useState(false);
  useEffect(async () => {
    let raw_response;

    try {
      raw_response = await fetch("/admin/application/rounds/all");
    } catch (err) {
      alert("Please check your internet connection and try again. Error code 03.");
      return;
    }

    if (!raw_response.ok) {
      alert("Something went wrong while getting application rounds. Error code 01.");
      return;
    }

    try {
      const response = await raw_response.json();
      setApplicationRounds(response.application_rounds);
      setCourses(response.courses.map(course => {
        course.checked = false;
        return course;
      }));
    } catch (err) {
      console.log(err);
      alert("Error while understanding the server's response. Error code 02.");
    }
  }, [update_data]);

  const changeApplicationOpenState = (application_round_id, new_val) => {
    fetch("/admin/application/round/change-open-state/".concat(application_round_id, "/").concat(new_val)).then(res => {
      if (res.ok) {
        setUpdateData(cur => cur + 1);
      } else {
        alert("Could not change state of application round.");
      }
    });
  };

  return /*#__PURE__*/React.createElement("div", null, showNewRoundModal && /*#__PURE__*/React.createElement(NewApplicationModal, {
    courses: courses,
    setCourses: setCourses,
    setUpdateData: setUpdateData,
    setShowNewRoundModal: setShowNewRoundModal
  }), /*#__PURE__*/React.createElement(QuizSelectionModal, {
    showQiuzSelectionModal: showQiuzSelectionModal,
    setShowQuizSelectionModal: setShowQuizSelectionModal,
    activeApplicationRound: activeApplication
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl mt-6 mb-4 font-bold"
  }, "Applications", /*#__PURE__*/React.createElement("button", {
    className: "text-xs px-4 ml-2 py-1 cursor-pointer bg-iec-blue hover:bg-iec-blue-hover text-white rounded-full",
    onClick: () => {
      setShowNewRoundModal(cur => !cur);
    },
    "data-testid": "new-application-round-button"
  }, "NEW")), show_copied_box ? /*#__PURE__*/React.createElement("div", {
    className: "text-xs absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-10 w-max h-max bg-white px-4 py-2 shadow-md text-gray-800"
  }, "Linked Copied to Clipboard!") : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-start gap-y-10 gap-x-10"
  }, application_rounds.length == 0 ? /*#__PURE__*/React.createElement("p", null, "No application rounds to show.") : application_rounds.map((application_round, index) => /*#__PURE__*/React.createElement("div", {
    className: "w-64 border bg-white quiz-card",
    key: index
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-x-6 py-4 h-16 bg-iec-blue justify-center content-center"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/admin/application/view/".concat(application_round.id),
    className: "text-white text-xl col-start-2 col-span-1 justify-self-center hover:text-gray-100 cursor-pointer",
    title: "View Applications"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-list"
  })), /*#__PURE__*/React.createElement("a", {
    "data-id": application_round.id,
    "data-testid": "copy-".concat(application_round.title, "-link"),
    onClick: e => {
      navigator.clipboard.writeText("".concat(site_domain_name, "/application/fill/").concat(e.target.dataset.id));
      setShowCopiedBox(true);
      window.setTimeout(() => {
        setShowCopiedBox(false);
      }, 2000);
    },
    className: "text-white text-xl col-span-1 justify-self-center hover:text-gray-100 cursor-pointer relative",
    title: "Copy Link"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-link",
    "data-id": application_round.id
  })), /*#__PURE__*/React.createElement("a", {
    className: "text-white text-xl col-span-1 justify-self-center hover:text-gray-100 cursor-pointer",
    title: application_round.open ? "Close Applications" : "Open Applications",
    onClick: () => {
      changeApplicationOpenState(application_round.id, !application_round.open);
    }
  }, application_round.open ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-door-open"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-door-closed"
  })), /*#__PURE__*/React.createElement("a", {
    className: "text-white text-xl col-span-1 justify-self-center hover:text-gray-100 cursor-pointer",
    title: "Delete Application Round",
    "data-id": application_round.id,
    "data-index": index,
    onClick: e => {
      deleteApplicationRound(e.target.dataset.id, setDeletingApplicationRound, setUpdateData);
    }
  }, deleting_application_round ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash",
    "data-id": application_round.id,
    "data-index": index
  })), /*#__PURE__*/React.createElement("a", {
    className: "text-white text-xl col-span-1 justify-self-center hover:text-gray-100 cursor-pointer",
    title: "Enable Auto Assignment of Quiz to Applicants",
    onClick: () => {
      openQuizSelectionModal(application_round.id, setShowQuizSelectionModal, setActiveApplication);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-circle-check"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "py-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "col-span-6 font-semibold text-lg px-4"
  }, application_round.title), /*#__PURE__*/React.createElement("div", {
    className: "col-start-1 col-span-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pl-4 pt-0"
  }, application_round.Applications.length, " applied")))))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));