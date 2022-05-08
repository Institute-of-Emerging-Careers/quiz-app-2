const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;
const interview_round_id = document.getElementById(
  "interview-round-id-field"
).value;

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

const EmailForm = (props) => {
  const interviewers = props.interviewers;
  const [email_subject, setEmailSubject] = useState("IEC Interview Time Slots");
  const [email_heading, setEmailHeading] = useState("IEC Interview Time Slots");
  const [email_body, setEmailBody] = useState(
    "Dear Team Member<br>We hope you are well.<br>Please let us know when you are free to conduct some interviews. You can do so below.<br>"
  );
  const [email_button_pre_text, setEmailButtonPreText] = useState(
    "Click the following button to log into your Interview Portal. <br>You will use the Interview Portal to declare your interview time slots, to find your Zoom credentials, and to record the Interview Scores of the students whom you interview."
  );
  const [email_button_label, setEmailButtonLabel] = useState("Log In");
  const [email_button_url, setEmailButtonUrl] = useState(
    "Will be automatically set for each user"
  );

  const [loading, setLoading] = useState(false);

  const sendEmails = () => {
    setLoading(true);
    fetch("/admin/interview/send-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewers: interviewers,
        email_content: {
          subject: email_subject,
          heading: email_heading,
          body: email_body,
          button_pre_text: email_button_pre_text,
          button_label: email_button_label,
          button_url: email_button_url,
        },
      }),
    })
      .then((response) => {
        setLoading(false);
        if (response.ok) {
          alert("Emails sent successfully.");
        } else {
          alert("There was an error while sending emails. Error code 01.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "There was a problem while sending the request to the server. Please check your internet connection. Error code 03."
        );
      });
  };

  return (
    <div>
      <h2 className="text-lg mt-4 mb-1">
        <i className="fas fa-mail-bulk"></i> Compose Email
      </h2>
      <form
        action="/mail/preview"
        method="POST"
        target="_blank"
        className="flex flex-col gap-y-2"
      >
        <div>
          <label>Subject: </label>
          <input
            type="text"
            id="subject"
            maxLength="100"
            name="subject"
            placeholder="e.g. Invite"
            className="border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={email_subject}
            onChange={(e) => {
              setEmailSubject(e.target.value);
            }}
            required
          ></input>
        </div>
        <div>
          <label>Heading: </label>
          <input
            type="text"
            id="heading"
            maxLength="100"
            name="heading"
            placeholder="This will be the heading inside the body of the email."
            className="border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={email_heading}
            onChange={(e) => {
              setEmailHeading(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <label>Body: </label>
          <textarea
            maxLength="5000"
            id="body"
            name="body"
            placeholder="This will be the the body of the email. Limit: 5000 characters."
            className="border w-full h-48 py-3 px-4 mt-1 hover:shadow-sm"
            value={email_body}
            onChange={(e) => {
              setEmailBody(e.target.value);
            }}
            required
          ></textarea>
        </div>
        <div>
          <label>Button Pre-text: </label>
          <input
            type="text"
            maxLength="100"
            id="button_announcer"
            name="button_announcer"
            placeholder="This text comes before a button and invites the user to click the button. You can leave it empty if you want."
            className="border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={email_button_pre_text}
            onChange={(e) => {
              setEmailButtonPreText(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <label>Button Label: </label>
          <input
            type="text"
            maxLength="50"
            id="button_text"
            name="button_text"
            placeholder="What does the button say? Limit: 50 characters"
            className="border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={email_button_label}
            onChange={(e) => {
              setEmailButtonLabel(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <label>Button URL: </label>
          <input
            type="text"
            name="button_url"
            id="button_url"
            placeholder="Where does the button take the user?"
            className="border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={email_button_url}
            readOnly
          ></input>
        </div>
        <div className="flex">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-gray-700 text-white mt-4 cursor-pointer hover:bg-gray-600"
          >
            <i className="far fa-eye"></i> Preview Mail
          </button>
          <button
            type="button"
            className="w-full py-3 px-6 bg-iec-blue text-white mt-4 cursor-pointer hover:bg-iec-blue-hover"
            id="email-button"
            onClick={sendEmails}
          >
            {loading ? (
              <i className="fas fa-spinner animate-spin self-center"></i>
            ) : (
              <i className="far fa-paper-plane"></i>
            )}{" "}
            Send Email(s)
          </button>
        </div>
      </form>
    </div>
  );
};

const Step1 = () => {
  const { students_object } = useContext(MyContext);
  const [students, setStudents] = students_object;
  const [loading, setLoading] = useState(false);

  const saveData = () => {
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
              <i className="fas fa-spinner animate-spin text-lg"></i> Saving
            </span>
          ) : (
            <span>
              <i className="fas fa-save"></i> Save Interviewees
            </span>
          )}
        </button>
      </div>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <StudentsList students_object={students_object} title="Interview" />
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
  const [saving, setSaving] = useState(false);
  const name_field = useRef();

  useEffect(() => {
    fetch(`/admin/interview/interviewers/all/${interview_round_id}`).then(
      (raw_response) => {
        if (raw_response.ok) {
          raw_response.json().then((response) => {
            setInterviewers(response);
          });
        } else {
          alert("Error in URL. Wrong Interview Round. Please go to home page.");
        }
      }
    );
  }, []);

  const saveData = () => {
    setSaving(true);
    fetch(`/admin/interview/update-interviewer-list/${interview_round_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interviewers: interviewers }),
    })
      .then((response) => {
        setSaving(false);
        if (!response.ok) {
          alert("Error while saving.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong. Check your internet connection.");
      });
  };

  useEffect(saveData, [interviewers]);

  return (
    <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
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
        <EmailForm interviewers={interviewers} />
      ) : (
        <div></div>
      )}

      <div className="flex mt-4 mb-4 justify-between items-center">
        <h2 className="text-lg">Interviewers Added</h2>
        <div className="flex">
          <button
            type="button"
            className="py-3 px-6 bg-iec-blue text-white cursor-pointer hover:bg-iec-blue-hover"
            onClick={() => {
              setShowEmailComposer((cur) => !cur);
            }}
          >
            <i className="fas fa-paper-plane"></i> Send Emails asking all
            Interviewers to Declare Time Slots
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
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Time Declared</th>
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
                <a className="cursor-pointer underline text-iec-blue hover:no-underline hover:text-iec-blue-hover">
                  <i className="fas fa-trash-alt"></i> Delete
                </a>{" "}
                |{" "}
                <a className="cursor-pointer underline text-iec-blue hover:no-underline hover:text-iec-blue-hover">
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
  return <div>Step 3</div>;
};
const Step4 = () => {
  return <div>Step 4</div>;
};

const Main = () => {
  const { steps_object } = useContext(MyContext);
  const [steps, setSteps] = steps_object;
  const [editInterviewRoundTitle, setEditInterviewRoundTitle] = useState(false);
  const [interviewRoundTitle, setInterviewRoundTitle] = useState(
    document.getElementById("interview-round-name-field").value
  );

  const updateInterviewRoundTitle = (e) => {
    e.preventDefault();
    console.log(interviewRoundTitle);
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
      });
  };

  return (
    <div>
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
          <input type="submit" className="hidden"></input>
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
