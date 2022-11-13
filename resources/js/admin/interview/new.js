const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;
const { DateTime, Duration } = luxon;
const interview_round_id = document.getElementById(
  "interview-round-id-field"
).value;

let url = window.location.href.split("/");
if (url[url.length - 2] == "new") {
  window.location = "/admin/interview/edit/" + interview_round_id;
}

const ContextProvider = (props) => {
  const [steps, setSteps] = useState([
    { title: "Step 1: Add Interviewees (Students)", active: true },
    { title: "Step 2: Add Interviewers", active: false },
    { title: "Step 3: Send Invites", active: false },
    { title: "Step 4: Results", active: false },
  ]);
  const [students, setStudents] = useState([]);
  // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not

  return (
    <MyContext.Provider
      value={{
        steps_object: [steps, setSteps],
        students_object: [students, setStudents],
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

const StepMenu = () => {
  const { steps_object } = useContext(MyContext);
  const [steps, setSteps] = steps_object;

  const changeMenu = (e) => {
    setSteps((cur) => {
      let copy = cur.slice();
      for (let i = 0; i < copy.length; i++) {
        if (i == e.target.id) copy[i].active = true;
        else copy[i].active = false;
      }
      return copy;
    });
  };

  return (
    <div className="grid grid-cols-4 w-full h-full mt-4">
      {steps.map((step, index) => (
        <div key={index}>
          {step.active ? (
            <div
              className="cursor-default bg-iec-blue text-white shadow-inner px-6 py-4 border-r w-full h-full"
              id={index}
              key={index}
              onClick={changeMenu}
            >
              {step.title}
            </div>
          ) : (
            <div
              className="cursor-pointer px-6 py-4 bg-white border-r w-full h-full"
              id={index}
              key={index}
              onClick={changeMenu}
            >
              {step.title}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Step1 = () => {
  const { students_object } = useContext(MyContext);
  const [students, setStudents] = students_object;
  const [loading, setLoading] = useState(false);

  const saveData = () => {
    setLoading(true);
    fetch("/admin/interview/interviewees/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        students: students,
        interview_round_id: interview_round_id,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          response
            .json()
            .then((parsed_response) => {
              console.log(parsed_response);
              if (parsed_response.success) {
                alert("Saved successfully.");
              }
            })
            .catch((err) => {
              console.log(err);
              alert("Something went wrong. Error code 02.");
            });
        } else {
          alert("Could not save interviewees.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Something went wrong. Error code 01. Check your internet connection."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm text-center">
        <button
          onClick={saveData}
          className="ml-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 active:shadow-inner cursor-pointer"
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner animate-spin text-lg"></i> Saving...
            </span>
          ) : (
            <span>
              <i className="fas fa-save"></i> Save Interviewees
            </span>
          )}
        </button>
      </div>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <StudentsList
          key={`${students.id}-tr`}
          students={students}
          title="Interview"
          fields={[
            ,
            { title: "Name", name: ["name"] },
            { title: "Email", name: ["email"] },
            { title: "Percentage Score", name: ["percentage_score"] },
          ]}
        />
      </div>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <NewStudentAdder
          all_students_api_endpoint_url={`/admin/interview/all-students/${interview_round_id}`}
          students_object={students_object}
          title="Interview"
        />
      </div>
    </div>
  );
};
const Step2 = () => {
  const [interviewers, setInterviewers] = useState([]);
  const [new_interviewer_name, setNewInterviewerName] = useState("");
  const [new_interviewer_email, setNewInterviewerEmail] = useState("");
  const [show_email_composer, setShowEmailComposer] = useState(false);
  const [num_zoom_accounts, setNumZoomAccounts] = useState(3);
  const [original_num_zoom_accounts, setOriginalNumZoomAccounts] =
    useState(num_zoom_accounts);
  const [show_zoom_accounts_explanation, setShowZoomAccountsExplanation] =
    useState(false);
  const [show_modal, setShowModal] = useState(false);
  const [selected_interviewer_index, setSelectedInterviewerIndex] =
    useState(-1);
  const [specific_interviewers_to_email, setSpecificInterviewersToEmail] =
    useState([]);
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(false);
  const name_field = useRef();

  useEffect(() => {
    fetch(`/admin/interview/interviewers/all/${interview_round_id}`).then(
      (raw_response) => {
        if (raw_response.ok) {
          raw_response.json().then((response) => {
            setInterviewers(response.interviewers);
            setNumZoomAccounts(response.num_zoom_accounts);
            setOriginalNumZoomAccounts(response.num_zoom_accounts);
          });
        } else {
          alert("Error in URL. Wrong Interview Round. Please go to home page.");
        }
      }
    );
  }, [reload]);

  useEffect(() => {
    setSpecificInterviewersToEmail([
      ...interviewers.filter((interviewer) => !interviewer.time_declared),
    ]);
  }, [interviewers]);

  useEffect(() => {
    if (!show_modal) setSelectedInterviewerIndex(-1);
  }, [show_modal]);

  useEffect(() => {
    if (!show_email_composer)
      setSpecificInterviewersToEmail(
        interviewers.filter((interviewer) => !interviewer.time_declared)
      );
  }, [show_email_composer]);

  const saveData = () => {
    setSaving(true);
    fetch(`/admin/interview/update-interviewer-list/${interview_round_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewers: interviewers,
        num_zoom_accounts: num_zoom_accounts,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error while saving.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong. Check your internet connection.");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const deleteSlot = (time_slot_id) => {
    fetch(`/admin/interview/interviewer/time-slot/delete/${time_slot_id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setReload((cur) => !cur);
        } else {
          alert(
            "Could not delete time slot. Some error occured at the server."
          );
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Error while deleting time slot. Are you sure your internet connection is working fine?"
        );
      });
  };

  return (
    <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
      <label>
        Maximum number of interviewers that can select a particular time slot
        (aka number of zoom accounts):{" "}
      </label>
      <input
        type="number"
        min={original_num_zoom_accounts}
        max="500"
        value={num_zoom_accounts}
        onChange={(e) => {
          setNumZoomAccounts(e.target.value);
        }}
        className="px-3 py-2 border mb-2"
      ></input>
      <i
        className="fas fa-question-circle cursor-pointer text-iec-blue ml-1"
        onClick={() => {
          setShowZoomAccountsExplanation((cur) => !cur);
        }}
      ></i>
      {show_zoom_accounts_explanation ? (
        <ul className="list-disc px-8 text-justify">
          <li>
            This feature makes sure that not more than the specified number of
            interviewers try to select an overlapping time slot. For example, if
            number of zoom accounts is set to 3, then only 3 interviewers can
            select a specific time slot. If a 4th interviewer tries to select a
            time slot that overlaps with those 3 interviewers, then he/she will
            see an error.
          </li>
          <li>
            You cannot reduce the number of zoom accounts once it has been
            increased. This is because during the time when the greater number
            of zoom accounts was set, a greater number of team members may have
            selected the same time slot.
          </li>
        </ul>
      ) : (
        <span></span>
      )}
      <hr></hr>
      <form className="flex flex-col">
        <h2 className="text-lg">Add New Interviewer</h2>
        <div className="w-full flex gap-x-4 items-center">
          <label htmlFor="new-interviewer" className="min-w-max">
            Full Name:{" "}
          </label>
          <input
            type="text"
            maxLength="150"
            name="name"
            className="w-full border py-3 px-4 mt-1 hover:shadow-sm"
            value={new_interviewer_name}
            onChange={(e) => {
              setNewInterviewerName(e.target.value);
            }}
            ref={name_field}
            active="true"
          ></input>
          <label htmlFor="new-interviewer" className="min-w-max">
            Email:{" "}
          </label>
          <input
            type="email"
            maxLength="200"
            name="email"
            value={new_interviewer_email}
            className="w-full border py-3 px-4 mt-1 hover:shadow-sm"
            onChange={(e) => {
              setNewInterviewerEmail(e.target.value);
            }}
          ></input>

          <button
            type="submit"
            className="w-full py-3 px-6 border-2 border-gray-700 text-gray-700 cursor-pointer hover:bg-gray-700 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              setInterviewers((cur) => {
                let copy = cur.slice();
                copy.push({
                  name: new_interviewer_name,
                  email: new_interviewer_email,
                  time_declared: false,
                  time_slots: [],
                });
                return copy;
              });
              setNewInterviewerName("");
              setNewInterviewerEmail("");
              ReactDOM.findDOMNode(name_field.current).focus();
            }}
          >
            Add
          </button>
        </div>
      </form>
      <hr className="mt-4"></hr>

      {show_email_composer ? (
        <EmailForm
          users={specific_interviewers_to_email}
          onFinish={() => {
            setShowEmailComposer(false);
          }}
          sending_link="/admin/interview/send-emails"
          default_values={{
            email_subject: "IEC Interview Time Slots",
            email_heading: "IEC Interview Time Slots",
            email_body:
              "Dear Team Member<br>We hope you are well.<br>Please let us know when you are free to conduct some interviews. You can do so below.<br>",
            email_button_pre_text:
              "Click the following button to log into your Interview Portal. <br>You will use the Interview Portal to declare your interview time slots, to find your Zoom credentials, and to record the Interview Scores of the students whom you interview.",
            email_button_label: "Log In",
            email_button_url: "Will be automatically set for each user",
          }}
        />
      ) : (
        <div></div>
      )}

      <div className="flex mt-4 mb-4 justify-between items-center">
        <h2 className="text-lg">Interviewers Added</h2>
        <div className="flex">
        <button
            type="button"
            className="py-3 px-6 bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700"
            onClick={() => {
              downloadAsCSV(interviewers)
            }}
          >
            <i className="fas fa-file-download"></i> Download as CSV</button>
          <button
            type="button"
            className="py-3 px-6 bg-iec-blue text-white cursor-pointer hover:bg-iec-blue-hover"
            onClick={() => {
              setShowEmailComposer((cur) => !cur);
            }}
          >
            <i className="fas fa-paper-plane"></i> Send Emails to Interviewers
            who have not declared Time Slots yet
          </button>
          <button
            type="button"
            className="py-3 px-6 bg-green-500 text-white cursor-pointer hover:bg-green-600"
            onClick={saveData}
          >
            {saving ? (
              <i className="fas fa-spinner animate-spin self-center"></i>
            ) : (
              <i className="fas fa-save"></i>
            )}{" "}
            Save Data
          </button>
        </div>
      </div>
      <p>Number of Zoom Accounts: {num_zoom_accounts}</p>

      {selected_interviewer_index >= 0 ? (
        <Modal
          show_modal={show_modal}
          setShowModal={setShowModal}
          heading={`View Time Slots of ${interviewers[selected_interviewer_index].name}`}
          content={
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2 border">Sr. No.</th>
                  <th className="p-2 border">Start Time</th>
                  <th className="p-2 border">End Time</th>
                  <th className="p-2 border">Duration</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {interviewers[selected_interviewer_index].time_slots.map(
                  (time_slot, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">
                        {DateTime.fromISO(time_slot.start).toLocaleString({
                          weekday: "short",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-2 border">
                        {DateTime.fromISO(time_slot.end).toLocaleString({
                          weekday: "short",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-2 border">
                        {Duration.fromMillis(time_slot.duration).toFormat(
                          "hh 'hours' mm 'minutes'"
                        )}
                      </td>
                      <td className="p-2 border ">
                        <a
                          className="cursor-pointer text-iec-blue hover:text-iec-blue-hover underline hover:no-underline"
                          data-index={index}
                          onClick={(e) => {
                            deleteSlot(time_slot.id);
                          }}
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          }
        ></Modal>
      ) : (
        <span></span>
      )}

      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Time Declared?</th>
            <th>Total Hours Dedicated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interviewers.map((interviewer, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{interviewer.name}</td>
              <td className="border px-4 py-2">{interviewer.email}</td>
              <td className="border px-4 py-2">
                {interviewer.time_declared ? "Yes" : "No"}
              </td>
              <td className="border px-4 py-2">
                {Duration.fromMillis(
                  interviewer.time_slots.reduce(
                    (total_time, cur_slot) => (total_time += cur_slot.duration),
                    0
                  )
                ).toFormat("hh 'hours' mm 'minutes'")}
              </td>
              <td className="border px-4 py-2">
                <a
                  className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"
                  onClick={() => {
                    setShowModal((cur) => !cur);
                    setSelectedInterviewerIndex(index);
                  }}
                >
                  <i class="far fa-eye"></i> View Time Slots
                </a>
                |{" "}
                <a
                  className="cursor-pointer underline text-iec-blue hover:no-underline hover:text-iec-blue-hover"
                  onClick={() => {
                    setShowModal((cur) => !cur);
                    setSelectedInterviewerIndex(index);
                  }}
                >
                  <i className="fas fa-trash-alt"></i> Delete Slots
                </a>{" "}
                |{" "}
                <a
                  className="cursor-pointer underline text-iec-blue hover:no-underline hover:text-iec-blue-hover"
                  onClick={() => {
                    setSpecificInterviewersToEmail([interviewer]);
                    setShowEmailComposer(true);
                  }}
                >
                  <i className="far fa-paper-plane"></i> Send Email asking{" "}
                  {interviewer.name} to Declare Time Slots
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const Step3 = () => {
  // continue here. Show the Admin how many interviewers have declared their time slots, who dedicated how many hours of time
  // ask the Admin how many minutes should each interview last. Then calcualte reactively on the frontend, whether or not
  // we have sufficient time commitment from the interviewers to conduct the interviews of the selected number of students
  // If yes, create a time slot assignment
  // if no, ask Admin to go back to "Step 2" and either increase interviewers or resend emails asking them to increase their times.

  const [interviewTime, setInterviewTime] = useState(0); //time per interview (including buffer time)
  const [interviewers, setInterviewers] = useState([]); //list of interviewers
  const { students_object} = useContext(MyContext); //list of students


  return (      
  <form className="flex flex-col">
    <h2 className="text-lg">Add Interview Time</h2>
    <div className="w-full flex gap-x-4 items-center">
      <label htmlFor="interview-time" className="min-w-max">
        Enter the time per interview (including any break time)
      </label>
      <input
        type="text"
        maxLength="150"
        name="name"
        className="w-full border py-3 px-20 mt-1 hover:shadow-sm"
        value={interviewTime}
        onChange={(e) => {
          setInterviewTime(e.target.value);
        }}
        // ref={name_field}
        active="true"
      ></input>
      <button
        type="submit"
        className="w-full py-3 px-6 border-2 border-gray-700 text-gray-700 cursor-pointer hover:bg-gray-700 hover:text-white"
        onClick={(e) => {
          e.preventDefault();
          console.log(students_object)
        }}
      >
        Add
      </button>
    </div>
  </form>
);
};
const Step4 = () => {
  return (
    <div>
      Step 4
    </div>
  );
};

const Main = () => {
  const { steps_object } = useContext(MyContext);
  const [steps, setSteps] = steps_object;
  const [editInterviewRoundTitle, setEditInterviewRoundTitle] = useState(false);
  const [interviewRoundTitle, setInterviewRoundTitle] = useState(
    document.getElementById("interview-round-name-field").value
  );
  const [loading_name, setLoadingName] = useState(false);

  const updateInterviewRoundTitle = (e) => {
    e.preventDefault();
    setLoadingName(true);
    fetch(
      `/admin/interview/update-round-title/${
        document.getElementById("interview-round-id-field").value
      }`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: interviewRoundTitle }),
      }
    )
      .then((response) => {
        if (response.ok) {
          setEditInterviewRoundTitle(false);
        } else {
          alert(
            `Error changing interview round name. Response code ${response.status}.`
          );
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Something went worng. Make sure you have a working internet connection or contact IT. Error code 02."
        );
      })
      .finally(() => {
        setLoadingName(false);
      });
  };

  return (
    <div>
      <a href="/admin/interview">
        <i className="fas fa-home"></i>
      </a>
      {editInterviewRoundTitle ? (
        <form onSubmit={updateInterviewRoundTitle}>
          <input
            type="text"
            maxLength="50"
            name="interview-round-title"
            value={interviewRoundTitle}
            onChange={(e) => {
              setInterviewRoundTitle(e.target.value);
            }}
            className="px-4 py-2 min-w-max"
          ></input>
          <input
            type="submit"
            className="p-2 bg-green-400 text-white cursor-pointer"
            value={loading_name ? "Saving..." : "Save"}
          ></input>
        </form>
      ) : (
        <h1 className="text-2xl">
          {`${interviewRoundTitle} `}
          <i
            className="fas fa-edit cursor-pointer"
            onClick={() => {
              setEditInterviewRoundTitle((cur) => !cur);
            }}
          ></i>
        </h1>
      )}
      <div>
        <StepMenu />
      </div>
      {steps[0].active ? <Step1 /> : <div className="hidden"></div>}
      {steps[1].active ? <Step2 /> : <div className="hidden"></div>}
      {steps[2].active ? <Step3 /> : <div className="hidden"></div>}
      {steps[3].active ? <Step4 /> : <div className="hidden"></div>}
    </div>
  );
};

const App = () => {
  return (
    <ContextProvider>
      <Main />
    </ContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
