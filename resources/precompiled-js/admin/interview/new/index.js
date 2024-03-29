"use strict";

const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useCallback = React.useCallback;
const useRef = React.useRef;
const useMemo = React.useMemo;
const {
  DateTime,
  Duration
} = luxon;
const interview_round_id = document.getElementById("interview-round-id-field").value;
let url = window.location.href.split("/");

if (url[url.length - 2] == "new") {
  window.location = "/admin/interview/edit/" + interview_round_id;
}

const ContextProvider = props => {
  const [steps, setSteps] = useState([{
    title: "Step 1: Add Interviewees (Students)",
    active: true
  }, {
    title: "Step 2: Add Interviewers",
    active: false
  }, {
    title: "Step 3: Create Matching",
    active: false
  }, {
    title: "Step 4: Create Questions",
    active: false
  }, // { title: "Step 5: Send Emails", active: false  },
  {
    title: "Step 5: Finalize Students",
    active: false
  }]);
  const [students, setStudents] = useState([]);
  const [matching, setMatching] = useState([]); // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not

  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: {
      steps_object: [steps, setSteps],
      students_object: [students, setStudents],
      matching_object: [matching, setMatching]
    }
  }, props.children);
};

const StepMenu = () => {
  const {
    steps_object
  } = useContext(MyContext);
  const [steps, setSteps] = steps_object;

  const changeMenu = e => {
    setSteps(cur => {
      let copy = cur.slice();

      for (let i = 0; i < copy.length; i++) {
        if (i == e.target.id) copy[i].active = true;else copy[i].active = false;
      }

      return copy;
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-5 w-full h-full mt-4"
  }, steps.map((step, index) => /*#__PURE__*/React.createElement("div", {
    key: index
  }, step.active ? /*#__PURE__*/React.createElement("div", {
    className: "cursor-default bg-iec-blue text-white shadow-inner px-6 py-4 border-r w-full h-full",
    id: index,
    key: index,
    onClick: changeMenu
  }, step.title) : /*#__PURE__*/React.createElement("div", {
    className: "cursor-pointer px-6 py-4 bg-white border-r w-full h-full",
    id: index,
    key: index,
    onClick: changeMenu
  }, step.title))));
};

const Step1 = () => {
  const {
    students_object
  } = useContext(MyContext);
  const [students, setStudents] = students_object;
  const [loading, setLoading] = useState(false);

  const saveData = () => {
    setLoading(true);
    fetch("/admin/interview/interviewees/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        students: students,
        interview_round_id: interview_round_id
      })
    }).then(response => {
      console.log(response);

      if (response.ok) {
        response.json().then(parsed_response => {
          console.log(parsed_response);

          if (parsed_response.success) {
            alert("Saved successfully.");
          }
        }).catch(err => {
          console.log(err);
          alert("Something went wrong. Error code 02.");
        });
      } else {
        alert("Could not save interviewees.");
      }
    }).catch(err => {
      console.log(err);
      alert("Something went wrong. Error code 01. Check your internet connection.");
    }).finally(() => {
      setLoading(false);
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm text-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: saveData,
    className: "ml-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 active:shadow-inner cursor-pointer"
  }, loading ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin text-lg"
  }), " Saving...") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), " Save Interviewees"))), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(StudentsList, {
    key: "".concat(students.id, "-tr"),
    students: students,
    title: "Interview",
    fields: [, {
      title: "Name",
      name: ["name"]
    }, {
      title: "Email",
      name: ["email"]
    }, {
      title: "Percentage Score",
      name: ["percentage_score"]
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(NewStudentAdder, {
    all_students_api_endpoint_url: "/admin/interview/all-students/".concat(interview_round_id),
    students_object: students_object,
    title: "Interview"
  })));
};

const Step2 = () => {
  const [interviewers, setInterviewers] = useState([]);
  const [new_interviewer_name, setNewInterviewerName] = useState("");
  const [new_interviewer_email, setNewInterviewerEmail] = useState("");
  const [show_email_composer, setShowEmailComposer] = useState(false);
  const [num_zoom_accounts, setNumZoomAccounts] = useState(3);
  const [original_num_zoom_accounts, setOriginalNumZoomAccounts] = useState(num_zoom_accounts);
  const [show_zoom_accounts_explanation, setShowZoomAccountsExplanation] = useState(false);
  const [show_modal, setShowModal] = useState(false);
  const [selected_interviewer_index, setSelectedInterviewerIndex] = useState(-1);
  const [specific_interviewers_to_email, setSpecificInterviewersToEmail] = useState([]);
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(false);
  const name_field = useRef();
  useEffect(() => {
    fetch("/admin/interview/interviewers/all/".concat(interview_round_id)).then(raw_response => {
      if (raw_response.ok) {
        raw_response.json().then(response => {
          setInterviewers(response.interviewers);
          setNumZoomAccounts(response.num_zoom_accounts);
          setOriginalNumZoomAccounts(response.num_zoom_accounts);
        });
      } else {
        alert("Error in URL. Wrong Interview Round. Please go to home page.");
      }
    });
  }, [reload]);
  useEffect(() => {
    setSpecificInterviewersToEmail([...interviewers.filter(interviewer => !interviewer.time_declared)]);
  }, [interviewers]);
  useEffect(() => {
    if (!show_modal) setSelectedInterviewerIndex(-1);
  }, [show_modal]);
  useEffect(() => {
    if (!show_email_composer) setSpecificInterviewersToEmail(interviewers.filter(interviewer => !interviewer.time_declared));
  }, [show_email_composer]);

  const saveData = () => {
    setSaving(true);
    fetch("/admin/interview/update-interviewer-list/".concat(interview_round_id), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        interviewers: interviewers,
        num_zoom_accounts: num_zoom_accounts
      })
    }).then(response => {
      if (!response.ok) {
        alert("Error while saving.");
      }
    }).catch(err => {
      console.log(err);
      alert("Something went wrong. Check your internet connection.");
    }).finally(() => {
      setSaving(false);
    });
  };

  const deleteSlot = time_slot_id => {
    fetch("/admin/interview/interviewer/time-slot/delete/".concat(time_slot_id), {
      method: "DELETE"
    }).then(res => {
      if (res.ok) {
        setReload(cur => !cur);
      } else {
        alert("Could not delete time slot. Some error occured at the server.");
      }
    }).catch(err => {
      console.log(err);
      alert("Error while deleting time slot. Are you sure your internet connection is working fine?");
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement("label", null, "Maximum number of interviewers that can select a particular time slot (aka number of zoom accounts):", " "), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: original_num_zoom_accounts,
    max: "500",
    value: num_zoom_accounts,
    onChange: e => {
      setNumZoomAccounts(e.target.value);
    },
    className: "px-3 py-2 border mb-2"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-question-circle cursor-pointer text-iec-blue ml-1",
    onClick: () => {
      setShowZoomAccountsExplanation(cur => !cur);
    }
  }), show_zoom_accounts_explanation ? /*#__PURE__*/React.createElement("ul", {
    className: "list-disc px-8 text-justify"
  }, /*#__PURE__*/React.createElement("li", null, "This feature makes sure that not more than the specified number of interviewers try to select an overlapping time slot. For example, if number of zoom accounts is set to 3, then only 3 interviewers can select a specific time slot. If a 4th interviewer tries to select a time slot that overlaps with those 3 interviewers, then he/she will see an error."), /*#__PURE__*/React.createElement("li", null, "You cannot reduce the number of zoom accounts once it has been increased. This is because during the time when the greater number of zoom accounts was set, a greater number of team members may have selected the same time slot.")) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("form", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg"
  }, "Add New Interviewer"), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex gap-x-4 items-center"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "new-interviewer",
    className: "min-w-max"
  }, "Full Name:", " "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "150",
    name: "name",
    className: "w-full border py-3 px-4 mt-1 hover:shadow-sm",
    value: new_interviewer_name,
    onChange: e => {
      setNewInterviewerName(e.target.value);
    },
    ref: name_field,
    active: "true"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "new-interviewer",
    className: "min-w-max"
  }, "Email:", " "), /*#__PURE__*/React.createElement("input", {
    type: "email",
    maxLength: "200",
    name: "email",
    value: new_interviewer_email,
    className: "w-full border py-3 px-4 mt-1 hover:shadow-sm",
    onChange: e => {
      setNewInterviewerEmail(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3 px-6 border-2 border-gray-700 text-gray-700 cursor-pointer hover:bg-gray-700 hover:text-white",
    onClick: e => {
      e.preventDefault();
      setInterviewers(cur => {
        let copy = cur.slice();
        copy.push({
          name: new_interviewer_name,
          email: new_interviewer_email,
          time_declared: false,
          time_slots: []
        });
        return copy;
      });
      setNewInterviewerName("");
      setNewInterviewerEmail("");
      ReactDOM.findDOMNode(name_field.current).focus();
    }
  }, "Add"))), /*#__PURE__*/React.createElement("hr", {
    className: "mt-4"
  }), show_email_composer ? /*#__PURE__*/React.createElement(EmailForm, {
    users: specific_interviewers_to_email,
    onFinish: () => {
      setShowEmailComposer(false);
    },
    sending_link: "/admin/interview/send-emails",
    default_values: {
      email_subject: "IEC Interview Time Slots",
      email_heading: "IEC Interview Time Slots",
      email_body: "Dear Team Member<br>We hope you are well.<br>Please let us know when you are free to conduct some interviews. You can do so below.<br>",
      email_button_pre_text: "Click the following button to log into your Interview Portal. <br>You will use the Interview Portal to declare your interview time slots, to find your Zoom credentials, and to record the Interview Scores of the students whom you interview.",
      email_button_label: "Log In",
      email_button_url: "Will be automatically set for each user"
    }
  }) : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    className: "flex mt-4 mb-4 justify-between items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg"
  }, "Interviewers Added"), /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-3 px-6 bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700",
    onClick: () => {
      downloadAsCSV(interviewers);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-download"
  }), " Download as CSV"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-3 px-6 bg-iec-blue text-white cursor-pointer hover:bg-iec-blue-hover",
    onClick: () => {
      setShowEmailComposer(cur => !cur);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-paper-plane"
  }), " Send Emails to Interviewers who have not declared Time Slots yet"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-3 px-6 bg-green-500 text-white cursor-pointer hover:bg-green-600",
    onClick: saveData
  }, saving ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin self-center"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), " ", "Save Data"))), /*#__PURE__*/React.createElement("p", null, "Number of Zoom Accounts: ", num_zoom_accounts), selected_interviewer_index >= 0 ? /*#__PURE__*/React.createElement(Modal, {
    show_modal: show_modal,
    setShowModal: setShowModal,
    heading: "View Time Slots of ".concat(interviewers[selected_interviewer_index].name),
    content: /*#__PURE__*/React.createElement("table", {
      className: "w-full text-left"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      className: "p-2 border"
    }, "Sr. No."), /*#__PURE__*/React.createElement("th", {
      className: "p-2 border"
    }, "Start Time"), /*#__PURE__*/React.createElement("th", {
      className: "p-2 border"
    }, "End Time"), /*#__PURE__*/React.createElement("th", {
      className: "p-2 border"
    }, "Duration"), /*#__PURE__*/React.createElement("th", {
      className: "p-2 border"
    }, "Action"))), /*#__PURE__*/React.createElement("tbody", null, interviewers[selected_interviewer_index].time_slots.map((time_slot, index) => /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", {
      className: "p-2 border"
    }, index + 1), /*#__PURE__*/React.createElement("td", {
      className: "p-2 border"
    }, DateTime.fromISO(time_slot.start).toLocaleString({
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })), /*#__PURE__*/React.createElement("td", {
      className: "p-2 border"
    }, DateTime.fromISO(time_slot.end).toLocaleString({
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })), /*#__PURE__*/React.createElement("td", {
      className: "p-2 border"
    }, Duration.fromMillis(time_slot.duration).toFormat("hh 'hours' mm 'minutes'")), /*#__PURE__*/React.createElement("td", {
      className: "p-2 border "
    }, /*#__PURE__*/React.createElement("a", {
      className: "cursor-pointer text-iec-blue hover:text-iec-blue-hover underline hover:no-underline",
      "data-index": index,
      onClick: e => {
        deleteSlot(time_slot.id);
      }
    }, "Delete"))))))
  }) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-sm"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Time Declared?"), /*#__PURE__*/React.createElement("th", null, "Total Hours Dedicated"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, interviewers.map((interviewer, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", {
    className: "border px-4 py-2"
  }, interviewer.name), /*#__PURE__*/React.createElement("td", {
    className: "border px-4 py-2"
  }, interviewer.email), /*#__PURE__*/React.createElement("td", {
    className: "border px-4 py-2"
  }, interviewer.time_declared ? "Yes" : "No"), /*#__PURE__*/React.createElement("td", {
    className: "border px-4 py-2"
  }, Duration.fromMillis(interviewer.time_slots.reduce((total_time, cur_slot) => total_time += cur_slot.duration, 0)).toFormat("hh 'hours' mm 'minutes'")), /*#__PURE__*/React.createElement("td", {
    className: "border px-4 py-2"
  }, /*#__PURE__*/React.createElement("a", {
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
    onClick: () => {
      setShowModal(cur => !cur);
      setSelectedInterviewerIndex(index);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-eye"
  }), " View Time Slots"), "|", " ", /*#__PURE__*/React.createElement("a", {
    className: "cursor-pointer underline text-iec-blue hover:no-underline hover:text-iec-blue-hover",
    onClick: () => {
      setShowModal(cur => !cur);
      setSelectedInterviewerIndex(index);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash-alt"
  }), " Delete Slots"), " ", "|", " ", /*#__PURE__*/React.createElement("a", {
    className: "cursor-pointer underline text-iec-blue hover:no-underline hover:text-iec-blue-hover",
    onClick: () => {
      setSpecificInterviewersToEmail([interviewer]);
      setShowEmailComposer(true);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-paper-plane"
  }), " Send Email asking", " ", interviewer.name, " to Declare Time Slots")))))));
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

  const {
    students_object,
    steps_object
  } = useContext(MyContext); //list of students in selected for interview

  const [steps, setSteps] = steps_object;
  const [numberOfStudents, setNumberOfStudents] = useState(0);
  const [matching, setMatching] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMatchingModal, setShowMatchingModal] = useState(false);
  const [recreateMatching, setRecreateMatching] = useState(false);
  const [showEmailStudents, setShowEmailStudents] = useState(false);
  const [showEmailInterviewers, setShowEmailInterviewers] = useState(false); //only keep students with the added flag set to true
  //check if interview-duration has previously been set

  useEffect(async () => {
    const response = await (await fetch("/admin/interview/".concat(interview_round_id, "/get-interview-duration"))).json();

    if (response.interview_duration) {
      setInterviewTime(response.interview_duration);
    }
  }, []); //check if a matching already exists

  useEffect(() => {
    fetch("/admin/interview/".concat(interview_round_id, "/matchings")).then(res => res.json().then(data => {
      // console.log(data);
      if (data.interview_matchings.length > 0) {
        setMatching(data.interview_matchings);
      }
    }));
  }, []);
  useEffect(() => {
    fetch("/admin/interview/interviewers/all/".concat(interview_round_id)).then(raw_response => {
      if (raw_response.ok) {
        raw_response.json().then(response => {
          //filter interviewers to include only those who have declared time
          const interviewers_with_time = response.interviewers.filter(interviewer => interviewer.time_declared);
          setInterviewers(interviewers_with_time);
          const students = Object.values(students_object[0]).filter(student => student.added); //only students that have been selected for the interview round

          let time = 0; //compute the sum of all the time slots of all the interviewers

          interviewers.map(interviewer => {
            return interviewer.time_slots.reduce((total_time, cur_slot) => {
              time += cur_slot.duration;
              return total_time += cur_slot.duration;
            }, 0);
          }); //compute the total number of students

          const total_students = Object.keys(students).length;
          setNumberOfStudents(total_students); //compute the total time required for all the interviews

          setTotalTimeRequired(total_students * interviewTime); //time required in minutes
          //compute the total time available for all the interviews

          setTotalTimeAvailable(Duration.fromMillis(time).toFormat("m")); //compute the total number of interviews that can be conducted

          if (interviewTime > 0) setTotalInterviewsPossible(Math.floor(total_time_available / interviewTime));
        });
      } else {
        alert("Error in URL. Wrong Interview Round. Please go to home page.");
      }
    });
  }, [interviewTime]);

  const computeMatching = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      //set interviewDuration
      await fetch("/admin/interview/".concat(interview_round_id, "/set-interview-duration"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          interview_duration: interviewTime
        })
      }); //for each interviewer, assign students
      //need an object of the format {interviewer_id: [student1, student2, student3]}

      const students = Object.values(students_object[0]).filter(student => student.added); //only students that have been selected for the interview round

      for (let i = 0; i < interviewers.length; i++) {
        //calculate the number of students per interviewer (different for all)
        //for each interviewer
        const interviewer = interviewers[i]; //calculate sum of durations for this interviwer

        const total_time = interviewer.time_slots.reduce((total_time, cur_slot) => total_time += cur_slot.duration, 0);
        interviewer.num_interviews = Math.floor(Duration.fromMillis(total_time).toFormat("mm") / interviewTime);
        interviewer.students = [];
      }

      let counter = 0; //to ensure equal distribution of interviewees among interviewers, we will assign students to interviewers in a round robin fashion

      while (true) {
        if (interviewers[counter % interviewers.length].students.length < interviewers[counter % interviewers.length].num_interviews) {
          //check if the interviewer has space for another interview
          const student = students.pop(0);
          interviewers[counter % interviewers.length].students.push({
            id: student.id,
            email: student.email
          });
        }

        counter++;

        if (students.length === 0) {
          //if all students have been assigned
          break;
        }
      } //extract matching in the format {interviewer_email, student_id}


      const matching = interviewers.map(interviewer => {
        return interviewer.students.map(student => {
          return {
            interviewer_email: interviewer.email,
            student_id: student.id,
            student_email: student.email
          };
        });
      });
      const flattened_matching = matching.flat(); //now we have the matching. We need to send this to the backend to create the matching

      const res = await fetch("/admin/interview/".concat(interview_round_id, "/create-matching"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          matching: flattened_matching
        })
      });

      if (res.ok) {
        alert("Matching Created Successfully");
        setLoading(false);
        setMatching(flattened_matching);
        setSteps(cur => {
          let copy = cur.slice();

          for (let i = 0; i < copy.length; i++) {
            if (i == 3) copy[i].active = true;else copy[i].active = false;
          }

          return copy;
        }); //after creating the matching, we need to create booking slots for each interviewer
        //for each unique interviewer in the matching, create a booking slot

        const unique_interviewers = [...new Set(flattened_matching.map(item => item.interviewer_email))];
        unique_interviewers.map(async interviewer_email => {
          await fetch("/admin/interview/".concat(interview_round_id, "/create-booking-slots"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              interviewer_email: interviewer_email
            })
          });
        });
      } else {
        alert("Error in creating Time Slot Assignment, try again");
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Something went wrong, please try again");
    }
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, matching.length === 0 || recreateMatching == true ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col mt-20 p-4"
  }, /*#__PURE__*/React.createElement("div", null, showModal === true ? /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: "min-h-screen w-full inset-0 fixed z-30 bg-black/60 flex justify-center items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-min mx-auto mt-10 w-1/2 bg-white  shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, "Insufficient Time"), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: () => {
      setShowModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8 h-min overflow-y-scroll"
  }, /*#__PURE__*/React.createElement("p", null, "Insufficient time available to conduct interviews of all students. You can:"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("br", null), "1. Decrease time per interview"), /*#__PURE__*/React.createElement("p", null, "2. Ask Interviewers for more time (Go back to Step 2)")))) : null), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-row"
  }, /*#__PURE__*/React.createElement("form", {
    className: "flex flex-col w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold border-l-2 border-b-2 border-iec-blue p-2 justify-self-start w-max"
  }, /*#__PURE__*/React.createElement("h2", {
    className: ""
  }, "Set Interview Time")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-x-4 items-center self-center mt-5 p-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "interview-time",
    className: "w-full p-4 mr-5 text-xl"
  }, "Set time per interview (including any break time):"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "150",
    name: "name",
    className: "bg-gray-300 w-1/5 px-4 h-10",
    value: interviewTime,
    onChange: e => {
      e.preventDefault();
      setInterviewTime(e.target.value);
    } // ref={name_field}
    ,
    active: "true"
  }), /*#__PURE__*/React.createElement("label", null, "minutes"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col bg-gray-300 rounded-md p-5 m-5 w-full text-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 mt-5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-end items-start"
  }, "Total time required:"), /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-start items-start"
  }, " ", total_time_required > 60 ? Math.floor(total_time_required / 60) + " hours " + total_time_required % 60 + " minutes" : total_time_required + " minutes")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-end items-start"
  }, "Time available:", " "), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-start items-start"
  }, total_time_available > 60 ? Math.floor(total_time_available / 60) + " hours " + total_time_available % 60 + " minutes" : total_time_available + " minutes"), total_time_available < total_time_required ? /*#__PURE__*/React.createElement("label", {
    className: "text-red-400"
  }, "(Insufficient time)") : null)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-end items-start"
  }, "Number of Students:"), /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-start items-start"
  }, numberOfStudents)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-end items-start"
  }, "Interviews Possible:"), /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-start items-start"
  }, total_interviews_possible)), total_time_available < total_time_required ? /*#__PURE__*/React.createElement("div", {
    className: "p-4 m-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-black inline"
  }, "Note:"), /*#__PURE__*/React.createElement("p", {
    className: "text-iec-blue inline m-2"
  }, "You don\u2019t have sufficient time commitment from interviewers to conduct interviews of selected no. of students.")) : null)), /*#__PURE__*/React.createElement("button", {
    className: "m-20 w-1/10 self-center justify-self-center bg-iec-blue p-4 text-white rounded-md",
    onClick: total_time_available >= total_time_required ? computeMatching : () => {
      setShowModal(lastVal => !lastVal);
    }
  }, "Create Matching", loading ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin text-lg m-2"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save text-lg m-2"
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-y-4 mt-4 p-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold justify-self-start flex w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "border-l-2 border-b-2 border-iec-blue p-2 self-start justify-self-start w-max"
  }, "Matching Status")), /*#__PURE__*/React.createElement("button", {
    className: "self-end justify-self-end w-full p-4 ml-auto text-iec-blue underline",
    onClick: () => {
      setShowMatchingModal(true);
    }
  }, "Recreate matching"), showMatchingModal === true ? /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: "min-h-screen w-full inset-0 fixed z-30 bg-black/60 flex justify-center items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-min mx-auto mt-10 w-1/2 bg-white  shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, "WARNING"), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: () => {
      setShowMatchingModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8 h-min overflow-y-scroll flex flex-col items-center justify-center"
  }, /*#__PURE__*/React.createElement("p", null, "Creating new matching will erase the previous matching, if any. Only create matching if you are sure you want to do so. ", /*#__PURE__*/React.createElement("br", null), " Do you want to create new matching?"), /*#__PURE__*/React.createElement("div", {
    className: "mt-10 flex"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bg-gray-400 py-4 px-8 rounded-md text-white mx-10",
    onClick: () => {
      setShowMatchingModal(false);
    }
  }, "No"), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue py-4 px-8 rounded-md text-white mx-10",
    onClick: () => {
      setShowMatchingModal(false);
      setRecreateMatching(true);
    }
  }, "Yes"))))) : null), showEmailStudents && /*#__PURE__*/React.createElement(EmailForm, {
    users: matching.map(match => match.student_email),
    onFinish: () => {
      setShowEmailStudents(false);
    },
    sending_link: "/admin/interview/".concat(interview_round_id, "/send-matching-emails-student"),
    default_values: {
      email_subject: "IEC Interview Invite",
      email_heading: "IEC Interview Invite",
      email_body: "Dear Student<br>We hope you are well.<br>You have been assigned an interviewer, please log into your portal to book an appointment.<br>",
      email_button_pre_text: "Click the following button to log into your Interview Portal. <br>You will use the Interview Portal to declare your interview time slots, to find your Zoom credentials, and to record the Interview Scores of the students whom you interview.",
      email_button_label: "Log In",
      email_button_url: "https://apply.iec.org.pk/student/login"
    }
  }), showEmailInterviewers && /*#__PURE__*/React.createElement(EmailForm, {
    users: matching.map(match => match.interviewer_email),
    onFinish: () => {
      setShowEmailInterviewers(false);
    },
    sending_link: "/admin/interview/".concat(interview_round_id, "/send-matching-emails-interviewer"),
    default_values: {
      email_subject: "IEC Interview Invite",
      email_heading: "IEC Interview Invite",
      email_body: "Dear Member,<br>We hope you are well.<br>You have been assigned students to interview. Kindly login to your portal and check your assigned students<br>",
      email_button_pre_text: "Click the following button to log into your Interview Portal. <br>You will use the Interview Portal to view your assigned students and to record the Interview Scores of the students whom you interview.",
      email_button_label: "Log In",
      email_button_url: "This will be automatically set"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end justify-end mt-10"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue py-4 px-8 text-white mx-10",
    onClick: () => {
      setShowEmailInterviewers(false);
      setShowEmailStudents(true);
    }
  }, "Email Students"), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue py-4 px-8 text-white mx-10",
    onClick: () => {
      setShowEmailStudents(false);
      setShowEmailInterviewers(true);
    }
  }, "Email Interviewers")), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "bg-gray-800 text-white"
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-2 "
  }, "Index"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 "
  }, "Interviewer Email"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 "
  }, "Student Email"))), /*#__PURE__*/React.createElement("tbody", null, matching.map((match, index) => /*#__PURE__*/React.createElement("tr", {
    key: index,
    className: "bg-gray-300 p-4 mb-4"
  }, /*#__PURE__*/React.createElement("td", {
    className: "p-4 mt-4"
  }, index + 1), /*#__PURE__*/React.createElement("td", {
    className: "p-4 mt-4"
  }, match.interviewer_email), /*#__PURE__*/React.createElement("td", {
    className: "p-4 mt-4"
  }, match.student_email)))))));
}; // const Step5 = () => {
//   const [loading, setLoading] = useState(false);
//   const { matching_object } = useContext(MyContext);
//   const [matching, setMatching] = matching_object;
//   const sendEmails = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       //extract unique id of interviewers fron matching
//       const interviewer_emails = [
//         ...new Set(matching.map((match) => match.interviewer_email)),
//       ];
//       for (let i = 0; i < interviewer_emails.length; i++) {
//         const response = await fetch(
//           `/admin/interview/${interview_round_id}/send-matching-emails`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               interviewer_email: interviewer_emails[i],
//             }),
//           }
//         );
//         if (response.status == 404) {
//           window.alert("Some interviewers have not updated calendly links");
//           setLoading(false);
//           return;
//         }
//         if (response.status == 200) {
//           window.alert("Emails sent successfully");
//           setLoading(false);
//           return;
//         }
//       }
//     } catch (err) {
//       console.log(err);
//       window.alert("An error occured, please try again later");
//     }
//   };
//   return (
//     <div>
//       <div className="flex flex-row mt-4 p-4 w-full">
//         <label className="p-2 text-xl">
//           To send emails to both the interviewers and the students, click the
//           given button.
//         </label>
//         <button
//           className="ml-20 bg-green-500 p-2 text-white"
//           onClick={sendEmails}
//         >
//           Send Emails
//         </button>
//       </div>
//       <div>
//         {matching.length > 0 ? (
//           <div className="flex flex-col gap-y-4 mt-4 p-10">
//             <h2 className="text-lg font-semibold text-red-400">
//               You have created a matching. You can view it below.
//             </h2>
//             <table className="w-full text-left">
//               <thead>
//                 <tr>
//                   <th className="p-2 border border-black">Index</th>
//                   <th className="p-2 border border-black">Interviewer Email</th>
//                   <th className="p-2 border border-black">Student Email</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {matching.map((match, index) => (
//                   <tr key={index}>
//                     <td className="p-2 border border-black">{index + 1}</td>
//                     <td className="p-2 border border-black">
//                       {match.interviewer_email}
//                     </td>
//                     <td className="p-2 border border-black">
//                       {match.student_email}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-y-4 mt-20 p-10">
//             <h2 className="text-lg font-semibold text-red-400">
//               You have not created a matching yet.
//             </h2>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


const Step5 = () => {
  const [students, setStudents] = useState([]);

  function download_table_as_csv(table_id) {
    let separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ",";
    // Select rows from table_id
    var rows = document.querySelectorAll("table#" + table_id + " tr");
    console.log(rows); // Construct csv

    var csv = [];

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].style.display != "none") {
        var row = [],
            cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++) {
          // Clean innertext to remove multiple spaces and jumpline (break csv)
          var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, "").replace(/(\s\s)/gm, " "); // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)

          data = data.replace(/"/g, '""'); // Push escaped string

          row.push('"' + data + '"');
        }

        csv.push(row.join(separator));
      }
    }

    if (csv.length == 1) {
      //the 1 row is the header row
      alert("Sorry! No rows to export. Change the filters.");
    } else {
      var csv_string = csv.join("\n"); // Download it

      var filename = "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
      var link = document.createElement("a");
      link.style.display = "none";
      link.setAttribute("target", "_blank");
      link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv_string));
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } //fetch the total scores for all interviewees


  useEffect(async () => {
    try {
      let response = await fetch("/admin/interview/".concat(interview_round_id, "/get-student-scores"));

      if (response.status == 200) {
        response = await response.json();

        if (response.success == "ok") {
          setStudents(response.scores.filter(score => score));
        }
      } else {
        console.log(response);
        alert("An error occured, please refresh the page");
      }
    } catch (err) {
      console.log(err);
      alert("An error occured, please refresh the page");
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col justify-center items-center mt-10"
  }, students.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue text-white p-4 px-10 self-end justify-self-end rounded-md",
    onClick: () => {
      download_table_as_csv("interview_results");
    }
  }, "Download as csv"), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left mt-20",
    id: "interview_results"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "bg-gray-800 text-white p-4"
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Student Name"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Student Email"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Student CNIC"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Interviewer Name"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Marks Obtained"))), /*#__PURE__*/React.createElement("tbody", {
    className: "m-2 p-4"
  }, students.map(student => /*#__PURE__*/React.createElement("tr", {
    className: "bg-gray-300 p-4 m-2",
    key: student.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "m-2 p-4"
  }, student.studentFirstName + " " + student.studentLastName), /*#__PURE__*/React.createElement("td", {
    className: "m-2 p-4"
  }, student.studentEmail), /*#__PURE__*/React.createElement("td", {
    className: "m-2 p-4"
  }, student.studentCnic), /*#__PURE__*/React.createElement("td", {
    className: "m-2 p-4"
  }, student.interviewerName), /*#__PURE__*/React.createElement("td", {
    className: "m-2 p-4"
  }, student.obtainedScore + " / " + student.totalScore)))))) : /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-white flex items-center justify-center text-xl mt-20 rounded-md p-4 "
  }, "No Students have been marked yet"));
};

const Main = () => {
  const {
    steps_object
  } = useContext(MyContext);
  const [steps, setSteps] = steps_object;
  const [editInterviewRoundTitle, setEditInterviewRoundTitle] = useState(false);
  const [interviewRoundTitle, setInterviewRoundTitle] = useState(document.getElementById("interview-round-name-field").value);
  const [loading_name, setLoadingName] = useState(false);

  const updateInterviewRoundTitle = e => {
    e.preventDefault();
    setLoadingName(true);
    fetch("/admin/interview/update-round-title/".concat(document.getElementById("interview-round-id-field").value), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: interviewRoundTitle
      })
    }).then(response => {
      if (response.ok) {
        setEditInterviewRoundTitle(false);
      } else {
        alert("Error changing interview round name. Response code ".concat(response.status, "."));
      }
    }).catch(err => {
      console.log(err);
      alert("Something went worng. Make sure you have a working internet connection or contact IT. Error code 02.");
    }).finally(() => {
      setLoadingName(false);
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "/admin/interview"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-home"
  })), editInterviewRoundTitle ? /*#__PURE__*/React.createElement("form", {
    onSubmit: updateInterviewRoundTitle
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "50",
    name: "interview-round-title",
    value: interviewRoundTitle,
    onChange: e => {
      setInterviewRoundTitle(e.target.value);
    },
    className: "px-4 py-2 min-w-max"
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    className: "p-2 bg-green-400 text-white cursor-pointer",
    value: loading_name ? "Saving..." : "Save"
  })) : /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl"
  }, "".concat(interviewRoundTitle, " "), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit cursor-pointer",
    onClick: () => {
      setEditInterviewRoundTitle(cur => !cur);
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepMenu, null)), steps[0].active ? /*#__PURE__*/React.createElement(Step1, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }), steps[1].active ? /*#__PURE__*/React.createElement(Step2, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }), steps[2].active ? /*#__PURE__*/React.createElement(Step3, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }), steps[3].active ? /*#__PURE__*/React.createElement(Step4, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }), steps[4].active ? /*#__PURE__*/React.createElement(Step5, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }));
};

const App = () => {
  return /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement(Main, null));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));