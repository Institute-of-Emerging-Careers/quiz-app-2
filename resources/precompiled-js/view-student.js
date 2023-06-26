"use strict";

const useState = React.useState;
const useEffect = React.useEffect;
const interview_round_id = document.getElementById("interview-round-id").innerHTML;
const student_id = document.getElementById("student-id").innerHTML; // need to fetch all questions for this interview round
// then take input for all those questions
// insert the answers into the Answers table

const ViewStudent = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [obtainedMarks, setObtainedMarks] = useState(0); //fetch questions for this cohort on mount

  useEffect(async () => {
    try {
      const response = await (await fetch("/admin/interview/".concat(interview_round_id, "/all-questions"))).json();

      if (response.questions.length > 0) {
        setQuestions(response.questions);
      }
    } catch (err) {
      console.log(err);
      window.alert("An error occured, please refresh the page");
    }
  }, []); //fetch answers to those questions for this student

  useEffect(async () => {
    try {
      const response = await (await fetch("/admin/interview/".concat(interview_round_id, "/student/").concat(student_id, "/view-marks"))).json();

      if (response.success == "ok") {
        console.log(response.answers);
        if (response.answers.length > 0) setAnswers(response.answers);
        if (response.totalMarks) setTotalMarks(response.totalMarks);
        if (response.obtainedMarks) setObtainedMarks(response.obtainedMarks);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const markAsAbsent = async () => {
    const response = await fetch("/admin/interview/".concat(interview_round_id, "/student/").concat(student_id, "/mark-absent"), {
      method: "POST"
    });

    if (response.status == 200) {
      window.alert("Student marked absent");
      window.location.href = "/admin/interview/".concat(interview_round_id, "/view-students");
    }
  };

  const addAnswers = async e => {
    e.preventDefault();
    let answers = [];
    questions.map(question => {
      const value = e.target.elements.namedItem(question.questionID).value;
      answers = [...answers, {
        questionID: question.questionID,
        questionAnswer: question.questionType == "descriptive" ? value : null,
        questionScale: question.questionType == "descriptive" ? null : value
      }];
    }); //compute total marks from number scale answers

    const totalMarks = questions.reduce((total, question) => {
      if (question.questionType == "number scale") {
        return total + parseInt(question.questionScale);
      }

      return total + 0;
    }, 0); //compute obtained marks from number scale answers

    const obtainedMarks = answers.reduce((total, answer) => {
      if (answer.questionScale) {
        return total + parseInt(answer.questionScale);
      }

      return total + 0;
    }, 0); //insert answers into Answers table

    answers.map(async answer => {
      try {
        await fetch("/admin/interview/".concat(interview_round_id, "/student/").concat(student_id, "/enter-marks"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(answer)
        });
      } catch (err) {
        console.log(err);
        window.alert("An error occured, please refresh the page");
      }
    });
    const response = await fetch("/admin/interview/".concat(interview_round_id, "/student/").concat(student_id, "/total-marks"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        totalMarks: totalMarks,
        obtainedMarks: obtainedMarks
      })
    });

    if (response.status == 200) {
      window.alert("Marks added successfully");
      window.location.href = "/admin/interview/".concat(interview_round_id, "/view-students");
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "mt-36 mx-10"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: addAnswers
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center "
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full flex mx-10 px-10"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-3xl font-bold w-full self-center justify-items-center"
  }, "Interview Scores"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col "
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full mt-10 rounded-md p-4 flex"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: " font-bold p-2 flex flex-row bg-iec-blue text-white m-2 items-center justify-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-save p-2"
  }), "Save"), /*#__PURE__*/React.createElement("button", {
    onClick: markAsAbsent,
    type: "button",
    className: " font-bold p-2 flex flex-row m-2 bg-iec-blue text-white  items-center justify-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-user-xmark p-2"
  }), "Student Absent")))), /*#__PURE__*/React.createElement("div", {
    className: "mt-10 mx-10 rounded-md flex flex-col p-10 w-full "
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-row items-left justify-left"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-bold border-b-2 p-2 border-iec-blue"
  }, "Numeric Questions")), questions.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, questions.map(question => question.questionType == "number scale" && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-row items-left justify-left mt-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-left justify-left w-3/4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-bold"
  }, question.question)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-left justify-left w-1/4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-row items-left justify-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-left justify-left"
  }, /*#__PURE__*/React.createElement("input", {
    className: "w-20 h-10 border-b-2 border-iec-blue bg-transparent p-2 outline-none appearance-none",
    type: "number",
    name: question.questionID,
    max: question.questionScale,
    defaultValue: answers.length > 0 ? answers.find(answer => answer.questionID == question.questionID).questionRating : null
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-left justify-left"
  }, /*#__PURE__*/React.createElement("p", {
    className: "ml-2 text-xl font-bold"
  }, "/ ", question.questionScale))))))) : null), /*#__PURE__*/React.createElement("div", {
    className: "mt-10 mx-10 rounded-md flex flex-col p-10 w-full "
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-row items-left justify-left"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-bold border-b-2 p-2 border-iec-blue"
  }, "Descriptive Questions")), questions.length > 0 ? questions.map(question => question.questionType == "descriptive" && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-left justify-left mt-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full flex items-left justify-left"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-bold"
  }, question.question)), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex items-left justify-left mt-4"
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "w-full h-40 bg-gray-300 rounded-md p-10 outline-none appearance-none",
    name: question.questionID,
    type: "text",
    placeholder: "Enter answer here",
    defaultValue: answers.length > 0 ? answers.find(answer => answer.questionID == question.questionID).questionAnswer : null
  })))) : null))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(ViewStudent, null), document.getElementById("app"));