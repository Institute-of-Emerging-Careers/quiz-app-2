"use strict";

const ApplicantDetailsModal = props => {
  const {
    applications_object,
    modal_object
  } = useContext(MyContext);
  const [applications, setApplications] = applications_object;
  const [show_modal, setShowModal] = modal_object;
  const [questions, setQuestions] = useState([{
    title: "Age Group",
    name: ["age_group"]
  }, {
    title: "City of Residence",
    name: ["city"]
  }, {
    title: "Education Completed",
    name: ["education_completed"]
  }, {
    title: "Employment type",
    name: ["type_of_employment"]
  }, {
    title: "Course Preference",
    name: ["first preference", "title"]
  }]);

  const formatOutput = output => {
    console.log(output);
    if (output === false) return "No";else if (output === true) return "Yes";else return output;
  };

  const getValue = (obj, properties_array) => {
    // if properties_array = ["Student","address"], then this funtion returns obj.Student.address
    return properties_array.reduce((final_value, property) => final_value == null ? null : final_value[property], obj);
  };

  return /*#__PURE__*/React.createElement("div", null, show_modal > -1 ? /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: "h-screen w-full inset-0 fixed z-30 bg-black/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: " h-90vh mt-10 w-1/2 bg-white translate-x-2/4 shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, "".concat(applications[show_modal].Student.firstName, " ").concat(applications[show_modal].Student.lastName)), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: () => {
      setShowModal(-1);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8 h-80vh overflow-y-scroll"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-sm"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Question"), /*#__PURE__*/React.createElement("th", null, "Answer"))), /*#__PURE__*/React.createElement("tbody", null, questions.map((question, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", {
    className: "border px-4 py-2"
  }, question.title), /*#__PURE__*/React.createElement("td", {
    className: "border px-4 py-2"
  }, formatOutput(getValue(applications[show_modal], question.name)))))))))) : /*#__PURE__*/React.createElement("div", null));
};