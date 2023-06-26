"use strict";

const useState = React.useState;
const useEffect = React.useEffect;
const interview_round_id = document.getElementById("interview-round-id").innerHTML;

const tConvert = time => {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value

    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM

    time[0] = +time[0] % 12 || 12; // Adjust hours
  }

  return time.join(""); // return adjusted time or original string
};

const StudentsList = () => {
  const [matchings, setMatchings] = useState([]);
  const [bookedStudents, setBookedStudents] = useState([]);
  const [unBookedStudents, setUnBookedStudents] = useState([]);
  const [sendBookedStudentsEmail, setSendBookedStudentsEmail] = useState(false);
  const [sendUnbookedStudentsEmail, setSendUnbookedStudentsEmail] = useState(false);
  useEffect(async () => {
    const response = await (await fetch("/admin/interview/".concat(interview_round_id, "/get-assigned-students"))).json();

    if (response.matchings.length > 0) {
      setMatchings(response.matchings);
      setBookedStudents(response.matchings.filter(matching => matching.booked).map(matching => matching.student_email));
      setUnBookedStudents(response.matchings.filter(matching => matching.booked == false).map(matching => matching.student_email));
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-36"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-1/2 flex flex-col items-center justify-center bg-white rounded-md "
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-3xl font-bold p-4 w-full flex justify-center items-center"
  }, "Assigned students")), sendBookedStudentsEmail && (bookedStudents.length > 0 ? /*#__PURE__*/React.createElement(EmailForm, {
    users: bookedStudents,
    onFinish: () => {
      setSendBookedStudentsEmail(false);
    },
    sending_link: "/admin/interview/".concat(interview_round_id, "/interviewer-send-email"),
    default_values: {
      email_subject: "IEC Interview Link",
      email_heading: "IEC Interview Link",
      email_body: "Dear Student,<br>We hope you are well.<br>Please join the given link for your interview.<br> Regards,<br>IEC Team",
      email_button_pre_text: null,
      email_button_label: null,
      email_button_url: null
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-bold p-4 w-full flex justify-center items-center"
  }, "No assigned students have booked slots"))), sendUnbookedStudentsEmail && (unBookedStudents.length > 0 ? /*#__PURE__*/React.createElement(EmailForm, {
    users: unBookedStudents,
    onFinish: () => {
      setSendUnbookedStudentsEmail(false);
    },
    sending_link: "/admin/interview/".concat(interview_round_id, "/interviewer-send-email"),
    default_values: {
      email_subject: "IEC Interview Reminder",
      email_heading: "IEC Interview Reminder",
      email_body: "Dear Student,<br>We hope you are well.<br>Please book a time slot from your portal so that your interview may be conducted.<br> Regards,<br>IEC Team",
      email_button_pre_text: "Portal Link",
      email_button_label: "Book a slot",
      email_button_url: "https://apply.iec.org.pk/student/interview"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-bold p-4 w-full flex justify-center items-center"
  }, "All assigned students have booked slots")))), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 p-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue text-white p-2 rounded-md",
    onClick: () => {
      setSendBookedStudentsEmail(true);
      setSendUnbookedStudentsEmail(false);
    }
  }, "Send Email to Booked Students"), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue text-white p-2 rounded-md m-2",
    onClick: () => {
      setSendUnbookedStudentsEmail(true);
      setSendBookedStudentsEmail(false);
    }
  }, "Send Email to Unbooked Students")), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex items-center justify-center mt-10"
  }, matchings.length > 0 ? /*#__PURE__*/React.createElement("table", {
    className: "table-auto bg-white rounded-md w-3/4"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "bg-gray-700 text-white"
  }, /*#__PURE__*/React.createElement("th", {
    className: "border border-gray-200 px-4 py-2 m-2"
  }, "Sr. No"), /*#__PURE__*/React.createElement("th", {
    className: "border border-gray-200 px-4 py-2 m-2"
  }, "Student Email"), /*#__PURE__*/React.createElement("th", {
    className: "border border-gray-200 px-4 py-2 m-2"
  }, "Student Name"), /*#__PURE__*/React.createElement("th", {
    className: "border border-gray-200 px-4 py-2 m-2"
  }, "Student CNIC"), /*#__PURE__*/React.createElement("th", {
    className: "border border-gray-200 px-4 py-2 m-2"
  }, "Student Gender"), /*#__PURE__*/React.createElement("th", {
    className: "border border-gray-200 px-4 py-2 m-2"
  }, "Booking Status"), /*#__PURE__*/React.createElement("th", {
    className: "border border-gray-200 px-4 py-2 m-2"
  }, "Interview Status"), /*#__PURE__*/React.createElement("th", {
    className: "border border-gray-200 px-4 py-2 m-2"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, matchings.map((matching, index) => /*#__PURE__*/React.createElement("tr", {
    key: matching.id,
    className: "bg-gray-300"
  }, /*#__PURE__*/React.createElement("td", {
    className: "border border-gray-200 px-4 py-2"
  }, index + 1), /*#__PURE__*/React.createElement("td", {
    className: "border border-gray-200 px-4 py-2"
  }, matching.student_email), /*#__PURE__*/React.createElement("td", {
    className: "border border-gray-200 px-4 py-2"
  }, matching.firstName + " " + matching.lastName), /*#__PURE__*/React.createElement("td", {
    className: "border border-gray-200 px-4 py-2"
  }, matching.cnic), /*#__PURE__*/React.createElement("td", {
    className: "border border-gray-200 px-4 py-2"
  }, matching.gender), /*#__PURE__*/React.createElement("td", {
    className: "border border-gray-200 px-4 py-2"
  }, matching.booked ? new Date(new Number(matching.startTime)).toDateString() + " , " + tConvert(new Date(new Number(matching.startTime)).toISOString().slice(11, 16)) + " - " + tConvert(new Date(new Number(matching.endTime)).toISOString().slice(11, 16)) : "No slot booked"), /*#__PURE__*/React.createElement("td", {
    className: "border border-gray-200 px-4 py-2"
  }, matching.studentAbsent === true ? "Absent" : matching.studentAbsent == null ? "Unmarked" : "Marked"), /*#__PURE__*/React.createElement("td", {
    className: "border border-gray-200 px-4 py-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "text-green-500"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/admin/interview/".concat(interview_round_id, "/student/").concat(matching.StudentId, "/enter-marks")
  }, "Enter Marks", " "))))))) : /*#__PURE__*/React.createElement("div", null, "No students have been assigned to you yet"))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(StudentsList, null), document.getElementById("app"));