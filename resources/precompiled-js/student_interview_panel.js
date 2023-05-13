"use strict";

const useState = React.useState;
const useEffect = React.useEffect;

const StudentInterviewPanel = props => {
  const [matchings, setMatchings] = useState(null);
  useEffect(() => {
    fetch("/student/matching").then(response => response.json()).then(data => {
      console.log("data.length", data.length);

      if (data.length > 0) {
        setMatchings(data);
      }
    });
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-green-300 to-blue-300 min-h-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center content-center align-middle"
  }, /*#__PURE__*/React.createElement("section", {
    className: "p-2 w-full md:w-7/8 mx-auto mr-0 md:mt-16",
    id: "main-section"
  }, /*#__PURE__*/React.createElement("div", {
    id: "assessments-box",
    className: "bg-white w-7/8 rounded-lg m-auto"
  }, /*#__PURE__*/React.createElement("div", {
    id: "assessments-title-box",
    className: "bg-iec-blue text-white font-light px-4 py-3 rounded-t-lg"
  }, "My Interview Invites"), /*#__PURE__*/React.createElement("div", {
    id: "assessments-box-content",
    className: "px-10 py-8 overflow-x-auto"
  }, matchings == null ? /*#__PURE__*/React.createElement("p", null, "Sorry, you have not received an invitation for the interview yet.") : /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left mytable"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-gray-200"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Interviewer Name"), /*#__PURE__*/React.createElement("th", null, "Interviewer Email"), /*#__PURE__*/React.createElement("th", null, "Invitation sent to pick a time "), /*#__PURE__*/React.createElement("th", null, "Interview Time"))), /*#__PURE__*/React.createElement("tbody", null, matchings.map(matching => /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, matching.interviewer_name), /*#__PURE__*/React.createElement("td", null, matching.interviewer_email), /*#__PURE__*/React.createElement("td", null, new Date(matching.createdAt).toLocaleDateString()), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: "/student/interview/".concat(matching.interview_round_id, "/pick-timeslot/").concat(matching.interviewer_id)
  }, /*#__PURE__*/React.createElement("button", {
    className: "text-white rounded-md shadow-sm text-md hover:scale-105 p-4 ".concat(matching.booked ? "bg-gray-300" : "bg-iec-blue"),
    disabled: matching.booked ? true : false
  }, matching.booked ? "Already Booked" : "PICK A TIME SLOT"))))))))))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(StudentInterviewPanel, null), document.getElementById("app"));