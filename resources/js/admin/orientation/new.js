const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const { DateTime, Duration } = luxon;
const useMemo = React.useMemo;
const orientation_id_value = document.getElementById(
  "orientation-id-field"
).value;

const ContextProvider = (props) => {
  const [orientation_id, setOrientationId] = useState(-1);
  const [orientation_name, setOrientationName] = useState("");
  const [meeting_data, setMeetingData] = useState({
    date: "",
    time: "11",
    zoom_link: "",
  });
  const [students, setStudents] = useState([]);
  // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not

  return (
    <MyContext.Provider
      value={{
        orientation_id_object: [orientation_id, setOrientationId],
        orientation_name_object: [orientation_name, setOrientationName],
        meeting_data_object: [meeting_data, setMeetingData],
        students_object: [students, setStudents],
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

const EmailForm = () => {
  const { orientation_id_object, orientation_name_object, students_object } =
    useContext(MyContext);
  const [orientation_id, setOrientationId] = orientation_id_object;

  const [students, setStudents] = students_object;
  const [email_subject, setEmailSubject] = useState("");
  const [email_heading, setEmailHeading] = useState("");
  const [email_body, setEmailBody] = useState("");
  const [email_button_pre_text, setEmailButtonPreText] = useState("");
  const [email_button_label, setEmailButtonLabel] = useState("");
  const [email_button_url, setEmailButtonUrl] = useState("");
  const [recipients, setRecipients] = useState([]);

  const form_ref = useRef();

  useEffect(() => {
    setRecipients(
      students.filter((student) => !student.email_sent && student.added)
    );
  }, [students]);

  const sendEmails = () => {
    fetch("/admin/orientation/send-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        students: students.filter(
          (student) => !student.email_sent && student.added
        ),
        orientation_id: orientation_id,
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
      .then((raw_response) => {
        raw_response
          .json()
          .then((response) => {
            if (response.success) {
              alert(
                "Emails queued successfully and will be sent at the rate of 14 emails per second."
              );
            } else {
              alert("There was an error while sending emails. Error code 01.");
            }
          })
          .catch((err) => {
            alert("There was an error while sending emails. Error code 02.");
          });
      })
      .catch((err) => {
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
        ref={form_ref}
      >
        <div>
          <label>Recipients: </label>
          <input
            type="text"
            id="recipients"
            name="recipients"
            className="border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={
              recipients.length > 0
                ? `Sending to ${recipients[0].email}, and ${
                    recipients.length - 1
                  } others`
                : "No recipients"
            }
            onChange={(e) => {
              setEmailSubject(e.target.value);
            }}
            disabled={true}
          ></input>
        </div>
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
            type="url"
            name="button_url"
            id="button_url"
            placeholder="Where does the button take the user?"
            className="border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={email_button_url}
            onChange={(e) => {
              setEmailButtonUrl(e.target.value);
            }}
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
            <i className="far fa-paper-plane"></i> Send Email(s)
          </button>
        </div>
      </form>
    </div>
  );
};

const NameForm = () => {
  const {
    orientation_id_object,
    orientation_name_object,
    meeting_data_object,
    students_object,
  } = useContext(MyContext);
  const [meeting_data, setMeetingData] = meeting_data_object;

  const [orientation_id, setOrientationId] = orientation_id_object;
  const [orientation_name, setOrientationName] = orientation_name_object;
  const [students, setStudents] = students_object;
  const [show_email_form, setShowEmailForm] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      window.location.href.split("/")[
        window.location.href.split("/").length - 2
      ] == "new"
    ) {
      window.location = `/admin/orientation/edit/${
        document.getElementById("orientation-id-field").value
      }`;
    } else {
      setOrientationId(
        parseInt(document.getElementById("orientation-id-field").value)
      );
      setOrientationName(
        document.getElementById("orientation-name-field").value
      );
    }
  }, []);

  const saveData = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    console.log(orientation_name);
    fetch(
      `/admin/orientation/save/${
        document.getElementById("orientation-id-field").value
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orientation_name: orientation_name,
          meeting_data: meeting_data,
          students: students,
        }),
      }
    )
      .then((response) => {
        response.json().then((parsed_response) => {
          if (parsed_response.success) {
            setLoading(false);
          }
        });
      })
      .catch((err) => {
        setLoading(false);
        alert(
          "Something went wrong. Error code 01. Check your internet connection."
        );
      });
  };

  return (
    <div className={show_email_form ? "" : "flex"}>
      <form onSubmit={saveData} autoFocus>
        <label>Orientation Name: </label>
        <input
          type="text"
          name="orientation"
          value={orientation_name}
          onChange={(e) => {
            setOrientationName(e.target.value);
          }}
          className="ml-2 px-4 py-4 w-72 border"
        ></input>
        <button
          type="submit"
          className="ml-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 active:shadow-inner cursor-pointer"
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner animate-spin text-lg"></i> Saving
            </span>
          ) : (
            <span>
              <i className="fas fa-save"></i> Save All Data
            </span>
          )}
        </button>
      </form>
      {show_email_form ? (
        <EmailForm />
      ) : (
        <button
          className="ml-2 bg-gray-400 hover:bg-gray-500 text-white px-8 py-4 active:shadow-inner cursor-pointer"
          onClick={() => {
            setShowEmailForm((cur) => !cur);
          }}
        >
          <i className="fas fa-mail-bulk"></i> Send Emails to Not-Emailed
          Students
        </button>
      )}
    </div>
  );
};

const OrientationDetailsForm = () => {
  const { meeting_data_object } = useContext(MyContext);
  const [meeting_data, setMeetingData] = meeting_data_object;

  useEffect(() => {
    fetch(`/admin/orientation/get-meeting-data/${orientation_id_value}`).then(
      (resp) => {
        if (resp.ok) {
          resp
            .json()
            .then((response) => {
              setMeetingData(response.meeting_data);
            })
            .catch((err) => {
              console.log(err);
              alert(
                "Error getting meeting data such as zoom link, time, and date. Server sent wrongly formatted information. Contact IT."
              );
            });
        } else {
          alert(
            "Error getting meeting data such as zoom link, time, and date."
          );
        }
      }
    );
  }, []);

  useEffect(() => {
    $("#date-picker").datepicker({
      showOn: "both",
      onSelect: (date) => {
        setMeetingData((cur) => {
          return { ...cur, date: date };
        });
      },
    });

    $("#time-picker").timepicker({
      timeFormat: "h:mm p",
      interval: 15,
      minTime: "08",
      maxTime: "11:00pm",
      defaultTime: "11",
      startTime: "08:00",
      dynamic: false,
      dropdown: true,
      scrollbar: true,
      change: (time) => {
        setMeetingData((cur) => {
          return { ...cur, time: $("#time-picker").timepicker().format(time) };
        });
      },
    });
  }, [meeting_data]);

  return (
    <div>
      <h3 className="text-base text-center font-bold mb-4">
        Orientation Details
      </h3>
      <div className="w-full flex justify-around">
        <div>
          <label>Zoom Link: </label>
          <input
            type="url"
            className="px-3 py-2 border w-full"
            value={meeting_data.zoom_link}
            onChange={(e) => {
              setMeetingData((cur) => {
                let copy = { ...cur, zoom_link: e.target.value };
                console.log(copy);
                return copy;
              });
            }}
          ></input>
        </div>

        <div>
          <label>Meeting Date: </label>
          <input
            type="text"
            id="date-picker"
            className="px-3 py-2 border w-full"
            value={meeting_data.date}
            // jQuery DatePicker does not fire the onChange event, so the change logic was handled in this component before UI rendering
          ></input>
        </div>

        <div>
          <label>Meeting Time: </label>
          <input
            type="text"
            id="time-picker"
            className="px-3 py-2 border w-full"
            value={meeting_data.time}
          ></input>
        </div>
      </div>
    </div>
  );
};

const StudentsListWrapper = () => {
  const { students_object } = useContext(MyContext);
  const [students, setStudents] = students_object;

  return (
    <StudentsList
      students={students}
      title="Orientation"
      field_to_show_green_if_true={{
        field: "email_sent",
        text: "orientation email was sent",
      }}
      fields={[
        { title: "Name", name: ["name"] },
        { title: "Email", name: ["email"] },
        { title: "Percentage Score", name: ["percentage_score"] },
      ]}
    />
  );
};

const NewStudentsAdderWrapper = () => {
  const { students_object } = useContext(MyContext);
  return (
    <NewStudentAdder
      all_students_api_endpoint_url={`/admin/orientation/all-students/${orientation_id_value}`}
      students_object={students_object}
      title="Orientation"
    />
  );
};

const App = () => {
  return (
    <ContextProvider>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <NameForm />
      </div>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <OrientationDetailsForm />
      </div>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <StudentsListWrapper />
      </div>
      <hr></hr>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 min-h-screen text-sm">
        <NewStudentsAdderWrapper />
      </div>
    </ContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
