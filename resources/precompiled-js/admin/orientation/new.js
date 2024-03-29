"use strict";

const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const {
  DateTime,
  Duration
} = luxon;
const useMemo = React.useMemo;
const orientation_id_value = document.getElementById("orientation-id-field").value;

const ContextProvider = props => {
  const [orientation_id, setOrientationId] = useState(-1);
  const [orientation_name, setOrientationName] = useState("");
  const [meeting_data, setMeetingData] = useState({
    date: "",
    time: "11",
    zoom_link: ""
  });
  const [students, setStudents] = useState([]); // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not

  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: {
      orientation_id_object: [orientation_id, setOrientationId],
      orientation_name_object: [orientation_name, setOrientationName],
      meeting_data_object: [meeting_data, setMeetingData],
      students_object: [students, setStudents]
    }
  }, props.children);
};

const EmailForm = () => {
  const {
    orientation_id_object,
    orientation_name_object,
    students_object
  } = useContext(MyContext);
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
    setRecipients(students.filter(student => !student.email_sent && student.added));
  }, [students]);

  const sendEmails = () => {
    fetch("/admin/orientation/send-emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        students: students.filter(student => !student.email_sent && student.added),
        orientation_id: orientation_id,
        email_content: {
          subject: email_subject,
          heading: email_heading,
          body: email_body,
          button_pre_text: email_button_pre_text,
          button_label: email_button_label,
          button_url: email_button_url
        }
      })
    }).then(raw_response => {
      raw_response.json().then(response => {
        if (response.success) {
          alert("Emails queued successfully and will be sent at the rate of 14 emails per second.");
        } else {
          alert("There was an error while sending emails. Error code 01.");
        }
      }).catch(err => {
        alert("There was an error while sending emails. Error code 02.");
      });
    }).catch(err => {
      alert("There was a problem while sending the request to the server. Please check your internet connection. Error code 03.");
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg mt-4 mb-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-mail-bulk"
  }), " Compose Email"), /*#__PURE__*/React.createElement("form", {
    action: "/mail/preview",
    method: "POST",
    target: "_blank",
    className: "flex flex-col gap-y-2",
    ref: form_ref
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Recipients: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "recipients",
    name: "recipients",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: recipients.length > 0 ? "Sending to ".concat(recipients[0].email, ", and ").concat(recipients.length - 1, " others") : "No recipients",
    onChange: e => {
      setEmailSubject(e.target.value);
    },
    disabled: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Subject: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "subject",
    maxLength: "100",
    name: "subject",
    placeholder: "e.g. Invite",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: email_subject,
    onChange: e => {
      setEmailSubject(e.target.value);
    },
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Heading: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "heading",
    maxLength: "100",
    name: "heading",
    placeholder: "This will be the heading inside the body of the email.",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: email_heading,
    onChange: e => {
      setEmailHeading(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Body: "), /*#__PURE__*/React.createElement("textarea", {
    maxLength: "5000",
    id: "body",
    name: "body",
    placeholder: "This will be the the body of the email. Limit: 5000 characters.",
    className: "border w-full h-48 py-3 px-4 mt-1 hover:shadow-sm",
    value: email_body,
    onChange: e => {
      setEmailBody(e.target.value);
    },
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Button Pre-text: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "100",
    id: "button_announcer",
    name: "button_announcer",
    placeholder: "This text comes before a button and invites the user to click the button. You can leave it empty if you want.",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: email_button_pre_text,
    onChange: e => {
      setEmailButtonPreText(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Button Label: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "50",
    id: "button_text",
    name: "button_text",
    placeholder: "What does the button say? Limit: 50 characters",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: email_button_label,
    onChange: e => {
      setEmailButtonLabel(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Button URL: "), /*#__PURE__*/React.createElement("input", {
    type: "url",
    name: "button_url",
    id: "button_url",
    placeholder: "Where does the button take the user?",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: email_button_url,
    onChange: e => {
      setEmailButtonUrl(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3 px-6 bg-gray-700 text-white mt-4 cursor-pointer hover:bg-gray-600"
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-eye"
  }), " Preview Mail"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "w-full py-3 px-6 bg-iec-blue text-white mt-4 cursor-pointer hover:bg-iec-blue-hover",
    id: "email-button",
    onClick: sendEmails
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-paper-plane"
  }), " Send Email(s)"))));
};

const NameForm = () => {
  const {
    orientation_id_object,
    orientation_name_object,
    meeting_data_object,
    students_object
  } = useContext(MyContext);
  const [meeting_data, setMeetingData] = meeting_data_object;
  const [orientation_id, setOrientationId] = orientation_id_object;
  const [orientation_name, setOrientationName] = orientation_name_object;
  const [students, setStudents] = students_object;
  const [show_email_form, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (window.location.href.split("/")[window.location.href.split("/").length - 2] == "new") {
      window.location = "/admin/orientation/edit/".concat(document.getElementById("orientation-id-field").value);
    } else {
      setOrientationId(parseInt(document.getElementById("orientation-id-field").value));
      setOrientationName(document.getElementById("orientation-name-field").value);
    }
  }, []);

  const saveData = e => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    console.log(orientation_name);
    fetch("/admin/orientation/save/".concat(document.getElementById("orientation-id-field").value), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orientation_name: orientation_name,
        meeting_data: meeting_data,
        students: students
      })
    }).then(response => {
      response.json().then(parsed_response => {
        if (parsed_response.success) {
          setLoading(false);
        }
      });
    }).catch(err => {
      setLoading(false);
      alert("Something went wrong. Error code 01. Check your internet connection.");
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: show_email_form ? "" : "flex"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: saveData,
    autoFocus: true
  }, /*#__PURE__*/React.createElement("label", null, "Orientation Name: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "orientation",
    value: orientation_name,
    onChange: e => {
      setOrientationName(e.target.value);
    },
    className: "ml-2 px-4 py-4 w-72 border"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "ml-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 active:shadow-inner cursor-pointer"
  }, loading ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin text-lg"
  }), " Saving") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), " Save All Data"))), show_email_form ? /*#__PURE__*/React.createElement(EmailForm, null) : /*#__PURE__*/React.createElement("button", {
    className: "ml-2 bg-gray-400 hover:bg-gray-500 text-white px-8 py-4 active:shadow-inner cursor-pointer",
    onClick: () => {
      setShowEmailForm(cur => !cur);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-mail-bulk"
  }), " Send Emails to Not-Emailed Students"));
};

const OrientationDetailsForm = () => {
  const {
    meeting_data_object
  } = useContext(MyContext);
  const [meeting_data, setMeetingData] = meeting_data_object;
  useEffect(() => {
    fetch("/admin/orientation/get-meeting-data/".concat(orientation_id_value)).then(resp => {
      if (resp.ok) {
        resp.json().then(response => {
          setMeetingData(response.meeting_data);
        }).catch(err => {
          console.log(err);
          alert("Error getting meeting data such as zoom link, time, and date. Server sent wrongly formatted information. Contact IT.");
        });
      } else {
        alert("Error getting meeting data such as zoom link, time, and date.");
      }
    });
  }, []);
  useEffect(() => {
    $("#date-picker").datepicker({
      showOn: "both",
      onSelect: date => {
        setMeetingData(cur => {
          return { ...cur,
            date: date
          };
        });
      }
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
      change: time => {
        setMeetingData(cur => {
          return { ...cur,
            time: $("#time-picker").timepicker().format(time)
          };
        });
      }
    });
  }, [meeting_data]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-base text-center font-bold mb-4"
  }, "Orientation Details"), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex justify-around"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Zoom Link: "), /*#__PURE__*/React.createElement("input", {
    type: "url",
    className: "px-3 py-2 border w-full",
    value: meeting_data.zoom_link,
    onChange: e => {
      setMeetingData(cur => {
        let copy = { ...cur,
          zoom_link: e.target.value
        };
        console.log(copy);
        return copy;
      });
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Meeting Date: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "date-picker",
    className: "px-3 py-2 border w-full",
    value: meeting_data.date // jQuery DatePicker does not fire the onChange event, so the change logic was handled in this component before UI rendering

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Meeting Time: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "time-picker",
    className: "px-3 py-2 border w-full",
    value: meeting_data.time
  }))));
};

const StudentsListWrapper = () => {
  const {
    students_object
  } = useContext(MyContext);
  const [students, setStudents] = students_object;
  return /*#__PURE__*/React.createElement(StudentsList, {
    students: students,
    title: "Orientation",
    field_to_show_green_if_true: {
      field: "email_sent",
      text: "orientation email was sent"
    },
    fields: [{
      title: "Name",
      name: ["name"]
    }, {
      title: "Email",
      name: ["email"]
    }, {
      title: "Percentage Score",
      name: ["percentage_score"]
    }]
  });
};

const NewStudentsAdderWrapper = () => {
  const {
    students_object
  } = useContext(MyContext);
  return /*#__PURE__*/React.createElement(NewStudentAdder, {
    all_students_api_endpoint_url: "/admin/orientation/all-students/".concat(orientation_id_value),
    students_object: students_object,
    title: "Orientation"
  });
};

const App = () => {
  return /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(NameForm, null)), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(OrientationDetailsForm, null)), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(StudentsListWrapper, null)), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 min-h-screen text-sm"
  }, /*#__PURE__*/React.createElement(NewStudentsAdderWrapper, null)));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));