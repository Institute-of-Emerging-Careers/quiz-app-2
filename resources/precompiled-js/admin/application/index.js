"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var MyContext = React.createContext();
var useEffect = React.useEffect;
var useState = React.useState;

var App = function App() {
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      application_rounds = _useState2[0],
      setApplicationRounds = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      courses = _useState4[0],
      setCourses = _useState4[1];

  var _useState5 = useState(""),
      _useState6 = _slicedToArray(_useState5, 2),
      new_round_title = _useState6[0],
      setNewRoundTitle = _useState6[1];

  var _useState7 = useState(""),
      _useState8 = _slicedToArray(_useState7, 2),
      new_course_title = _useState8[0],
      setNewCourseTitle = _useState8[1];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      show_modal = _useState10[0],
      setShowModal = _useState10[1];

  var _useState11 = useState(0),
      _useState12 = _slicedToArray(_useState11, 2),
      update_data = _useState12[0],
      setUpdateData = _useState12[1];

  var _useState13 = useState(false),
      _useState14 = _slicedToArray(_useState13, 2),
      show_copied_box = _useState14[0],
      setShowCopiedBox = _useState14[1];

  var _useState15 = useState(false),
      _useState16 = _slicedToArray(_useState15, 2),
      deleting_application_round = _useState16[0],
      setDeletingApplicationRound = _useState16[1];

  useEffect(function () {
    fetch("/admin/application/rounds/all").then(function (raw_response) {
      if (!raw_response.ok) {
        alert("Something went wrong while getting application rounds. Error code 01.");
      } else {
        raw_response.json().then(function (response) {
          setApplicationRounds(response.application_rounds);
          setCourses(response.courses.map(function (course) {
            course.checked = false;
            return course;
          }));
        }).catch(function (err) {
          console.log(err);
          alert("Error while understanding the server's response. Error code 02.");
        });
      }
    }).catch(function (err) {
      alert("Please check your internet connection and try again. Error code 03.");
    });
  }, [update_data]);

  var createApplicationRound = function createApplicationRound(e) {
    e.preventDefault();
    if (new_round_title == "") alert("Please give the Application Round a title.");else if (courses.reduce(function (num_false, cur) {
      num_false += cur.checked;
    }, 0) < 3) alert("Please select at least 3 courses.");else {
      fetch("/admin/application/rounds/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: new_round_title,
          courses: courses.filter(function (cur) {
            return cur.checked;
          })
        })
      }).then(function (response) {
        if (response.ok) {
          setShowModal(false);
          setUpdateData(function (cur) {
            return cur + 1;
          });
        } else alert("Could not create application round.");
      });
    }
  };

  var deleteApplicationRound = function deleteApplicationRound(application_round_id, application_round_index) {
    var confirmation = prompt("Are you sure you wish to delete this application round? All applications will be deleted. Type 'yes' if you do.");

    if (confirmation == "yes") {
      setDeletingApplicationRound(true);
      fetch("/admin/application/rounds/delete/".concat(application_round_id), {
        method: "DELETE"
      }).then(function (response) {
        setDeletingApplicationRound(false);

        if (response.ok) {
          setUpdateData(function (cur) {
            return cur + 1;
          });
        } else alert("Could not delete application round due to an error. Code 01.");
      }).catch(function (err) {
        console.log(err);
        alert("Could not delete application round due to an error. Code 02.");
      });
    }
  };

  var addNewCourse = function addNewCourse() {
    fetch("/admin/application/course/new", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: new_course_title
      })
    }).then(function (response) {
      if (response.ok) {
        response.json().then(function (parsed_response) {
          setCourses(function (cur) {
            return [].concat(_toConsumableArray(cur), [{
              id: parsed_response.id,
              title: parsed_response.title,
              checked: false
            }]);
          });
          setNewCourseTitle("");
        });
      }
    }).catch(function (err) {
      console.log(err);
      alert("Something went wrong while adding a new course.");
    });
  };

  var changeApplicationOpenState = function changeApplicationOpenState(application_round_id, new_val) {
    fetch("/admin/application/round/change-open-state/".concat(application_round_id, "/").concat(new_val)).then(function (res) {
      if (res.ok) {
        setUpdateData(function (cur) {
          return cur + 1;
        });
      } else {
        alert("Could not change state of application round.");
      }
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
  }), " Create New Application Round"), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: function onClick() {
      setShowModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: createApplicationRound
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "title"
  }, "Please give this Application Round a title:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    min: "2",
    name: "title",
    placeholder: "Cohort 4 Application Round 1",
    className: "border px-4 py-2 ml-2",
    value: new_round_title,
    onChange: function onChange(e) {
      setNewRoundTitle(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "courses"
  }, "Which courses can students apply for?"), courses.map(function (course, index) {
    return /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      name: "courses",
      checked: course.checked,
      "data-index": index,
      onChange: function onChange(e) {
        setCourses(function (cur) {
          var copy = cur.slice();
          copy[e.target.dataset.index].checked = !copy[e.target.dataset.index].checked;
          return copy;
        });
      }
    }), " " + course.title)));
  }), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "courses"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "newCourseTitle",
    className: "py-1 px-2 border",
    placeholder: "Course Title",
    value: new_course_title,
    onChange: function onChange(e) {
      setNewCourseTitle(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: addNewCourse,
    className: "px-2 py-1 bg-gray-400"
  }, "Add New Course")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Create Application Round",
    className: "px-4 py-2 mt-4 bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer"
  }))))), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl mt-6 mb-4 font-bold"
  }, "Applications", /*#__PURE__*/React.createElement("button", {
    className: "text-xs px-4 ml-2 py-1 cursor-pointer bg-iec-blue hover:bg-iec-blue-hover text-white rounded-full",
    onClick: function onClick() {
      setShowModal(function (cur) {
        return !cur;
      });
    }
  }, "NEW")), show_copied_box ? /*#__PURE__*/React.createElement("div", {
    className: "text-xs absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-10 w-max h-max bg-white px-4 py-2 shadow-md text-gray-800"
  }, "Linked Copied to Clipboard!") : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-start gap-y-10 gap-x-10"
  }, application_rounds.length == 0 ? /*#__PURE__*/React.createElement("p", null, "No application rounds to show.") : application_rounds.map(function (application_round, index) {
    return /*#__PURE__*/React.createElement("div", {
      className: "grid w-64 grid-cols-6 gap-4 border bg-white pb-2 quiz-card",
      key: index
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-6 col-span-6 h-16 bg-iec-blue justify-center content-center"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/admin/application/view/".concat(application_round.id),
      className: "text-white text-xl col-start-2 col-span-1 justify-self-center hover:text-gray-100 cursor-pointer",
      title: "View Applications"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-list"
    })), /*#__PURE__*/React.createElement("a", {
      "data-id": application_round.id,
      onClick: function onClick(e) {
        navigator.clipboard.writeText("".concat(site_domain_name, "/application/fill/").concat(e.target.dataset.id));
        setShowCopiedBox(true);
        window.setTimeout(function () {
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
      onClick: function onClick() {
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
      onClick: function onClick(e) {
        deleteApplicationRound(e.target.dataset.id, e.target.dataset.index);
      }
    }, deleting_application_round ? /*#__PURE__*/React.createElement("i", {
      className: "fas fa-spinner animate-spin"
    }) : /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash",
      "data-id": application_round.id,
      "data-index": index
    }))), /*#__PURE__*/React.createElement("h3", {
      className: "col-span-6 font-semibold text-lg px-4"
    }, application_round.title), /*#__PURE__*/React.createElement("div", {
      className: "col-start-1 col-span-6"
    }, /*#__PURE__*/React.createElement("p", {
      className: "pl-4 pt-0"
    }, application_round.Applications.length, " applied")));
  })));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));