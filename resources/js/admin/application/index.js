const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;

const App = () => {
  const [application_rounds, setApplicationRounds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [new_round_title, setNewRoundTitle] = useState("");
  const [new_course_title, setNewCourseTitle] = useState("");
  const [show_modal, setShowModal] = useState(false);
  const [update_data, setUpdateData] = useState(0);
  const [show_copied_box, setShowCopiedBox] = useState(false);
  const [deleting_application_round, setDeletingApplicationRound] =
    useState(false);

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
      });
  }, [update_data]);

  const createApplicationRound = (e) => {
    e.preventDefault();
    if (new_round_title == "")
      alert("Please give the Application Round a title.");
    else if (
      courses.reduce((all_false, cur) => {
        if (!all_false) return false;
        if (cur.checked) return false;
        else return true;
      }, true)
    )
      alert("Please select at least 1 course.");
    else {
      fetch("/admin/application/rounds/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: new_round_title,
          courses: courses,
        }),
      }).then((response) => {
        if (response.ok) {
          setShowModal(false);
          setUpdateData((cur) => cur + 1);
        } else alert("Could not create application round.");
      });
    }
  };

  const deleteApplicationRound = (
    application_round_id,
    application_round_index
  ) => {
    setDeletingApplicationRound(true);
    fetch(`/admin/application/rounds/delete/${application_round_id}`, {
      method: "DELETE",
    })
      .then((response) => {
        setDeletingApplicationRound(false);
        if (response.ok) {
          setUpdateData((cur) => cur + 1);
        } else
          alert("Could not delete application round due to an error. Code 01.");
      })
      .catch((err) => {
        console.log(err);
        alert("Could not delete application round due to an error. Code 02.");
      });
  };

  const addNewCourse = () => {
    fetch("/admin/application/course/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: new_course_title,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((parsed_response) => {
            setCourses((cur) => [
              ...cur,
              {
                id: parsed_response.id,
                title: parsed_response.title,
                checked: false,
              },
            ]);
            setNewCourseTitle("");
          });
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong while adding a new course.");
      });
  };

  return (
    <div>
      {/* Modal starts */}
      <div
        id="modal"
        className={
          show_modal
            ? "h-screen w-screen inset-0 absolute z-30 bg-black bg-opacity-60"
            : "hidden"
        }
      >
        <div className="mx-auto mt-10 w-1/2 bg-white left-1/4 translate-x-2/4 shadow-xl pb-2">
          <div className="bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center">
            <h3 className="text-xl col-auto justify-self-start self-center">
              <i className="fas fa-link text-xl text-white"></i> Create New
              Application Round
            </h3>
            <i
              className="fas fa-times text-white cursor-pointer col-auto justify-self-end self-center"
              onClick={() => {
                setShowModal(false);
              }}
            ></i>
          </div>
          <div className="p-8">
            <form onSubmit={createApplicationRound}>
              <label htmlFor="title">
                Please give this Application Round a title:
              </label>
              <input
                type="text"
                min="2"
                name="title"
                placeholder="Cohort 4 Application Round 1"
                className="border px-4 py-2 ml-2"
                value={new_round_title}
                onChange={(e) => {
                  setNewRoundTitle(e.target.value);
                }}
              ></input>
              <br></br>

              <div className="mt-4">
                <label htmlFor="courses">
                  Which courses can students apply for?
                </label>
                {courses.map((course, index) => (
                  <div>
                    <input
                      type="checkbox"
                      name="courses"
                      checked={course.checked}
                      data-index={index}
                      onChange={(e) => {
                        setCourses((cur) => {
                          let copy = cur.slice();
                          copy[e.target.dataset.index].checked =
                            !copy[e.target.dataset.index].checked;
                          return copy;
                        });
                      }}
                    ></input>
                    <label>{" " + course.title}</label>
                  </div>
                ))}
                <input type="checkbox" name="courses"></input>
                <input
                  type="text"
                  name="newCourseTitle"
                  className="py-1 px-2 border"
                  placeholder="Course Title"
                  value={new_course_title}
                  onChange={(e) => {
                    setNewCourseTitle(e.target.value);
                  }}
                ></input>
                <button
                  type="button"
                  onClick={addNewCourse}
                  className="px-2 py-1 bg-gray-400"
                >
                  Add New Course
                </button>
              </div>
              <br></br>
              <input
                type="submit"
                value="Create Application Round"
                className="px-4 py-2 mt-4 bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer"
              ></input>
            </form>
          </div>
        </div>
      </div>
      {/* Modal ends */}
      <h2 className="text-xl mt-6 mb-4 font-bold">
        Applications
        <button
          className="text-xs px-4 ml-2 py-1 cursor-pointer bg-iec-blue hover:bg-iec-blue-hover text-white rounded-full"
          onClick={() => {
            setShowModal((cur) => !cur);
          }}
        >
          NEW
        </button>
      </h2>
      {show_copied_box ? (
        <div className="text-xs absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-10 w-max h-max bg-white px-4 py-2 shadow-md text-gray-800">
          Linked Copied to Clipboard!
        </div>
      ) : (
        <span></span>
      )}
      <div className="flex flex-wrap justify-start gap-y-10 gap-x-10">
        {application_rounds.length == 0 ? (
          <p>No application rounds to show.</p>
        ) : (
          application_rounds.map((application_round, index) => (
            <div
              className="grid w-64 grid-cols-6 gap-4 border bg-white pb-2 quiz-card"
              key={index}
            >
              <div className="grid grid-cols-5 col-span-6 h-16 bg-iec-blue justify-center content-center">
                <a
                  href={`/admin/application/view/${application_round.id}`}
                  className="text-white text-xl col-start-2 justify-self-center col-span-1 hover:text-gray-100 cursor-pointer"
                  title="View Applications"
                >
                  <i className="fas fa-list"></i>
                </a>
                <a
                  data-id={application_round.id}
                  onClick={(e) => {
                    navigator.clipboard.writeText(
                      `${site_domain_name}/application/fill/${e.target.dataset.id}`
                    );
                    setShowCopiedBox(true);
                    window.setTimeout(() => {
                      setShowCopiedBox(false);
                    }, 2000);
                  }}
                  className="text-white text-xl col-span-1 justify-self-center hover:text-gray-100 cursor-pointer relative"
                  title="Copy Link"
                >
                  <i className="fas fa-link" data-id={application_round.id}></i>
                </a>
                <a
                  className="text-white text-xl col-span-1 justify-self-center hover:text-gray-100 cursor-pointer"
                  title="Delete Application Round"
                  data-id={application_round.id}
                  data-index={index}
                  onClick={(e) => {
                    deleteApplicationRound(
                      e.target.dataset.id,
                      e.target.dataset.index
                    );
                  }}
                >
                  {deleting_application_round ? (
                    <i className="fas fa-spinner animate-spin"></i>
                  ) : (
                    <i
                      className="fas fa-trash"
                      data-id={application_round.id}
                      data-index={index}
                    ></i>
                  )}
                </a>
              </div>
              <h3 className="col-span-6 font-semibold text-lg px-4">
                {application_round.title}
              </h3>
              <div className="col-start-1 col-span-6">
                <p className="pl-4 pt-0">
                  {application_round.Applications.length} applied
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));