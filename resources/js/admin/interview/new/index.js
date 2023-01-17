const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useCallback = React.useCallback;
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
    { title: "Step 3: Create Matching", active: false },
    { title: "Step 4: Create Questions", active: false },
    { title: "Step 5: Send Emails", active: false  },
    { title: "Step 6: Finalize Students", active: false  },
  ]);
  const [students, setStudents] = useState([]);

  const [matching, setMatching] = useState([]);

  // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not

  return (
    <MyContext.Provider
      value={{
        steps_object: [steps, setSteps],
        students_object: [students, setStudents],
        matching_object: [matching, setMatching],
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
    <div className="grid grid-cols-6 w-full h-full mt-4">
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
              downloadAsCSV(interviewers);
            }}
          >
            <i className="fas fa-file-download"></i> Download as CSV
          </button>
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
                  <i className="far fa-eye"></i> View Time Slots
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
  const [total_interviews_possible, setTotalInterviewsPossible] = useState(0); //total number of interviews possible
  const [total_time_available, setTotalTimeAvailable] = useState(0); //total time available for interviews
  const [total_time_required, setTotalTimeRequired] = useState(0); //total time required for interviews
  const { students_object, steps_object, matching_object } =
    useContext(MyContext); //list of students in selected for interview
  const [loading, setLoading] = useState(false); //loading state
  const [steps, setSteps] = steps_object; //steps object;
  const [matching, setMatching] = matching_object; //matching object

  //only keep students with the added flag set to true

  //check if interview-duration has previously been set
  useEffect(async () => {
		const response = await (await fetch(
			`/admin/interview/${interview_round_id}/get-interview-duration`
		)).json();

    if (response.interview_duration) {
      setInterviewTime(response.interview_duration);
    }
	}, []);

  useEffect(() => {
    //check if a matching already exists
    fetch(`/admin/interview/${interview_round_id}/matchings`).then((res) =>
      res.json().then((data) => {
        // console.log(data);
        if (data.interview_matchings.length > 0) {
          setMatching(data.interview_matchings);
        }
      })
    );
  }, []);

  useEffect(() => {
    fetch(`/admin/interview/interviewers/all/${interview_round_id}`).then(
      (raw_response) => {
        if (raw_response.ok) {
          raw_response.json().then((response) => {
            //filter interviewers to include only those who have declared time
            const interviewers_with_time = response.interviewers.filter(
              (interviewer) => interviewer.time_declared
            );
            setInterviewers(interviewers_with_time);

            const students = Object.values(students_object[0]).filter(
              (student) => student.added
            ); //only students that have been selected for the interview round

            let time = 0;
            //compute the sum of all the time slots of all the interviewers
            interviewers.map((interviewer) => {
              return interviewer.time_slots.reduce((total_time, cur_slot) => {
                time += cur_slot.duration;
                return (total_time += cur_slot.duration);
              }, 0);
            });

            //compute the total number of students
            const total_students = Object.keys(students).length;

            //compute the total time required for all the interviews
            setTotalTimeRequired(total_students * interviewTime); //time required in minutes
            //compute the total time available for all the interviews
            setTotalTimeAvailable(Duration.fromMillis(time).toFormat("mm"));

            //compute the total number of interviews that can be conducted
            setTotalInterviewsPossible(
              Math.floor(total_time_available / interviewTime)
            );
          });
        } else {
          alert("Error in URL. Wrong Interview Round. Please go to home page.");
        }
      }
    );
  }, [interviewTime]);

  const computeMatching = async (e) => {
    e.preventDefault();
    setLoading(true);

    try{
    //set interviewDuration
    const response = await fetch(`/admin/interview/${interview_round_id}/set-interview-duration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interview_duration : interviewTime
      }),
      }
    );



    //for each interviewer, assign students
    //need an object of the format {interviewer_id: [student1, student2, student3]}

    const students = Object.values(students_object[0]).filter(
      (student) => student.added
    ); //only students that have been selected for the interview round

    for (let i = 0; i < interviewers.length; i++) {
      //calculate the number of students per interviewer (different for all)
      //for each interviewer
      const interviewer = interviewers[i];
      //calculate sum of durations for this interviwer
      const total_time = interviewer.time_slots.reduce(
        (total_time, cur_slot) => (total_time += cur_slot.duration),
        0
      );

      interviewer.num_interviews = Math.floor(
        Duration.fromMillis(total_time).toFormat("mm") / interviewTime
      );
      interviewer.students = [];
    }

    let counter = 0;
    //to ensure equal distribution of interviewees among interviewers, we will assign students to interviewers in a round robin fashion
    while (true) {
      if (
        interviewers[counter % interviewers.length].students.length <
        interviewers[counter % interviewers.length].num_interviews
      ) {
        //check if the interviewer has space for another interview
        const student = students.pop(0);
        interviewers[counter % interviewers.length].students.push({
          id: student.id,
          email: student.email,
        });
      }
      counter++;
      if (students.length === 0) {
        //if all students have been assigned
        break;
      }
    }
    //extract matching in the format {interviewer_email, student_id}
    const matching = interviewers.map((interviewer) => {
      return interviewer.students.map((student) => {
        return {
          interviewer_email: interviewer.email,
          student_id: student.id,
          student_email: student.email,
        };
      });
    });

    const flattened_matching = matching.flat();

    //now we have the matching. We need to send this to the backend to create the matching
    const res = await fetch(
      `/admin/interview/${interview_round_id}/create-matching`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matching: flattened_matching,
        }),
      }
    );

    if (res.ok) {
      alert("Matching Created Successfully");
      setLoading(false);
      setMatching(flattened_matching);
      setSteps((cur) => {
        let copy = cur.slice();
        for (let i = 0; i < copy.length; i++) {
          if (i == 3) copy[i].active = true;
          else copy[i].active = false;
        }
        return copy;
      });


      //after creating the matching, we need to create booking slots for each interviewer
      //for each unique interviewer in the matching, create a booking slot

      const unique_interviewers = [...new Set(flattened_matching.map(item => item.interviewer_email))];
      console.log(unique_interviewers);

      unique_interviewers.map(async (interviewer_email) => {
        await fetch(`/admin/interview/${interview_round_id}/create-booking-slots`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interviewer_email: interviewer_email,
          }),
        });

      });




    } else {
      alert("Error in creating Time Slot Assignment, try again");
    }
  } catch(err) {
    console.log(err);
    setLoading(false);
    alert("Something went wrong, please try again");
  }
  };

  return (
    <div>
      <form className="flex flex-col">
        <h2 className="text-xl font-bold">Add Interview Time</h2>
        <div className="w-full flex gap-x-4 items-center">
          <label htmlFor="interview-time" className="min-w-max">
            Enter the time per interview (including any break time)
          </label>
          <input
            type="text"
            maxLength="150"
            name="name"
            className="w-30 border py-3 px-2 mt-1 hover:shadow-sm"
            value={interviewTime}
            autoComplete="off"
            onChange={(e) => {
              e.preventDefault();
              setInterviewTime(e.target.value);
            }}
            // ref={name_field}
            active="true"
          ></input>

          {total_time_required < total_time_available ? (
            <button
              className="ml-20 bg-iec-blue p-2 text-white rounded-md"
              onClick={computeMatching}
            >
              Create Matching
              {loading ? (
                <i className="fas fa-spinner animate-spin text-lg"></i>
              ) : (
                <i className="fas fa-save text-lg"></i>
              )}
            </button>
          ) : (
            <button className="ml-20 bg-red-500 p-2 text-white" disabled>
              Create Matching
            </button>
          )}

          <label className="text-red-500 text-xl">
            Creating a new matching destroys the previous one, if any. ONLY
            create a matching if you are sure that you want to do so.
          </label>
        </div>
      </form>

      {total_time_required > total_time_available ? (
        <div className="flex flex-col gap-y-4 mt-4 p-10">
          <h2 className="text-lg font-semibold text-red-400">
            You do not have sufficient time commitment from the interviewers to
            conduct the interviews of the selected number of students. Please go
            back to "Step 2" and either increase interviewers or resend emails
            asking them to increase their times.
          </h2>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 text-green-400 mt-4 p-10">
          <h2 className="text-lg font-semibold">
            You have sufficient time commitment from the interviewers to conduct
            the interviews of the selected number of students.
          </h2>
          <h2 className="text-lg">
            You can conduct {total_interviews_possible} interviews.
          </h2>
        </div>
      )}

      <div className="flex flex-col">
        <h2 className="text-lg">Interview Time Summary</h2>
        <div className="w-full flex flex-col gap-y-4 items-center">
          <label
            htmlFor="interview-time"
            className="min-w-max font-bold text-2xl"
          >
            Total Time Available
          </label>
          <p>{total_time_available} Minutes</p>
          <label
            htmlFor="interview-time"
            className="min-w-max font-bold text-2xl"
          >
            Total Time Required
          </label>
          <p>{total_time_required} Minutes</p>
          <label
            htmlFor="interview-time"
            className="min-w-max font-bold text-2xl"
          >
            Total Interviews Possible
          </label>
          <p>{total_interviews_possible}</p>
        </div>
      </div>

      {matching.length > 0 ? (
        <div className="flex flex-col gap-y-4 mt-4 p-10">
          <h2 className="text-lg font-semibold text-red-400">
            You have created a matching. You can view it below.
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2 border border-black">Index</th>
                <th className="p-2 border border-black">Interviewer Email</th>
                <th className="p-2 border border-black">Student Email</th>
              </tr>
            </thead>
            <tbody>
              {matching.map((match, index) => (
                <tr key={index}>
                  <td className="p-2 border border-black">{index + 1}</td>
                  <td className="p-2 border border-black">
                    {match.interviewer_email}
                  </td>
                  <td className="p-2 border border-black">
                    {match.student_email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 mt-20 p-10">
          <h2 className="text-lg font-semibold text-red-400">
            You have not created a matching yet.
          </h2>
        </div>
      )}
    </div>
  );
};

const Step5 = () => {
  const [loading, setLoading] = useState(false);
  const { matching_object } = useContext(MyContext);
  const [matching, setMatching] = matching_object;

  const sendEmails = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      //extract unique id of interviewers fron matching
      const interviewer_emails = [
        ...new Set(matching.map((match) => match.interviewer_email)),
      ];

      for (let i = 0; i < interviewer_emails.length; i++) {
        const response = await fetch(
          `/admin/interview/${interview_round_id}/send-matching-emails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              interviewer_email: interviewer_emails[i],
            }),
          }
        );
        if (response.status == 404) {
          window.alert("Some interviewers have not updated calendly links");
          setLoading(false);
          return;
        }
        if (response.status == 200) {
          window.alert("Emails sent successfully");
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.log(err);
      window.alert("An error occured, please try again later");
    }
  };

  return (
    <div>
      <div className="flex flex-row mt-4 p-4 w-full">
        <label className="p-2 text-xl">
          To send emails to both the interviewers and the students, click the
          given button.
        </label>

        <button
          className="ml-20 bg-green-500 p-2 text-white"
          onClick={sendEmails}
        >
          Send Emails
        </button>
      </div>

      <div>
        {matching.length > 0 ? (
          <div className="flex flex-col gap-y-4 mt-4 p-10">
            <h2 className="text-lg font-semibold text-red-400">
              You have created a matching. You can view it below.
            </h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2 border border-black">Index</th>
                  <th className="p-2 border border-black">Interviewer Email</th>
                  <th className="p-2 border border-black">Student Email</th>
                </tr>
              </thead>
              <tbody>
                {matching.map((match, index) => (
                  <tr key={index}>
                    <td className="p-2 border border-black">{index + 1}</td>
                    <td className="p-2 border border-black">
                      {match.interviewer_email}
                    </td>
                    <td className="p-2 border border-black">
                      {match.student_email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col gap-y-4 mt-20 p-10">
            <h2 className="text-lg font-semibold text-red-400">
              You have not created a matching yet.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

const Step6 = () => {
    const [students, setStudents] = useState([]);


    useEffect(async () => {
      try{
        const response = await (await fetch(`/admin/interview/${interview_round_id}/get-student-scores`)).json();

        if(response.success == "ok"){
          console.log(response.scores.filter(score => score));
          setStudents(response.scores.filter(score => score))
        }
      

      } catch (err){
        console.log(err);
        alert("An error occured, please refresh the page");
      }
    },[]);
  
    

    return (
			<div>
				{students.length > 0 ? (
					<table className="w-full text-left mt-20">
						<thead>
							<tr className="bg-gray-800 text-white p-4">
								<th className="p-2 border">Student Name</th>
								<th className="p-2 border">Student Email</th>
								<th className="p-2 border">Student CNIC</th>
								<th className="p-2 border">Interviewer Name</th>
								<th className="p-2 border">Marks Obtained</th>
							</tr>
						</thead>
						<tbody className = "m-2 p-4">
              {students.map((student) => (
                  <tr className="bg-gray-300 p-4 m-2" key = {student.id} >
                    <td className = "m-2 p-4">{student.studentFirstName + " " + student.studentLastName}</td>
                    <td className = "m-2 p-4">{student.studentEmail}</td>
                    <td className = "m-2 p-4">{student.studentCnic}</td>
                    <td className = "m-2 p-4">{student.interviewerName}</td>
                    <td className = "m-2 p-4">{student.obtainedScore + " / " + student.totalScore}</td>
                  </tr>)
              )}
            </tbody>
					</table>
				) : (
					<div>No Students have been marked yet</div>
				)}
			</div>
		);
}

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
      {steps[4].active ? <Step5 /> : <div className="hidden"></div>}
      {steps[5].active ? <Step6 /> : <div className="hidden"></div>}
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
