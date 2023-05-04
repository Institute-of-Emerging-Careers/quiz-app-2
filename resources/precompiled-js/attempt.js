"use strict";

const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;
const sectionId = parseInt(document.getElementById("sectionId").value);
const quizTitle = document.getElementById("quizTitle").innerText;
const sectionTitle = document.getElementById("sectionTitle").innerText;
const preview_or_not = parseInt(document.getElementById("previewOrNot").value);

function millisecondsToMinutesAndSeconds(millis) {
  if (millis == 0) return "No Time Limit";else {
    var minutes = Math.floor(millis / 60000);
    var seconds = (millis % 60000 / 1000).toFixed(0);
    return minutes + " minutes and " + (seconds < 10 ? "0" : "") + seconds + " seconds remaining";
  }
}

const ContextProvider = props => {
  const [questions, setQuestions] = useState([]);
  const [passages, setPassages] = useState([]);
  const [displayQuestions, setDisplayQuestions] = useState(true); // displayQuestions is true when there is still time to solve the quiz, and becomes false when time ends.

  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: {
      questionsObj: [questions, setQuestions],
      passagesObj: [passages, setPassages],
      displayQuestionsObj: [displayQuestions, setDisplayQuestions]
    }
  }, props.children);
};

const MCQSOption = props => {
  const {
    questionsObj
  } = useContext(MyContext);
  const [questions, setQuestions] = questionsObj;
  return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: props.name,
    value: props.option.id,
    className: "mb-2 align-baseline",
    style: {
      height: "17px",
      width: "17px"
    },
    onChange: e => {
      setQuestions(cur => {
        let copy = cur.slice();
        copy[props.questionIndex].answer = e.target.value;
        return copy;
      });
      console.log("MCQ-S", e.target.value);
    },
    checked: questions[props.questionIndex].answer == props.option.id
  }), " ", /*#__PURE__*/React.createElement("label", null, props.option.statement, props.option.image != null ? /*#__PURE__*/React.createElement("img", {
    src: props.option.image,
    className: "max-h-48 max-w-full h-auto w-auto py-4"
  }) : /*#__PURE__*/React.createElement("span", null)));
};

const MCQMOption = props => {
  const {
    questionsObj
  } = useContext(MyContext);
  const [questions, setQuestions] = questionsObj;
  return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: props.name,
    value: props.option.id,
    className: "mb-2",
    onChange: e => {
      setQuestions(cur => {
        let copy = cur.slice();
        copy[props.questionIndex].answer[props.optionIndex] = !copy[props.questionIndex].answer[props.optionIndex];
        console.log("MCQ-M", copy);
        return copy;
      });
    },
    checked: questions[props.questionIndex].answer[props.optionIndex]
  }), " ", /*#__PURE__*/React.createElement("label", null, props.option.statement));
};

const Option = props => {
  if (props.questionType == "MCQ-S") return /*#__PURE__*/React.createElement(MCQSOption, {
    option: props.option,
    name: props.name,
    questionIndex: props.questionIndex
  });else if (props.questionType == "MCQ-M") return /*#__PURE__*/React.createElement(MCQMOption, {
    option: props.option,
    optionIndex: props.optionIndex,
    name: props.name,
    questionIndex: props.questionIndex
  });
};
/*
State questions array looks like this:

[
  {
    id:0,
    statement:"This is a question",
    marks:1.25,
    answer: false, //this will later be set to default value of -1 for MCQ-S and [false,false,...n-options] for MCQ-M
    options: [
      {
        statement:"option 1",
        correct: true,
      }
    ]
  }
]

*/


const PassageQuestionPrompt = props => {
  const {
    questionsObj
  } = useContext(MyContext);
  const [questions, setQuestions] = questionsObj;
  const [list_of_questions, setListOfQuestions] = useState("");
  useEffect(() => {
    let list = "";
    questions.forEach((question_obj, question_index) => {
      if (question_obj.question.passage == props.passageIndex) {
        if (list != "") list += ", ";
        list += question_index + 1;
      }
    });
    setListOfQuestions(list);
  }, []);
  return /*#__PURE__*/React.createElement("span", null, "Questions ", props.questionIndex + 1, " is about the following comprehension passage: ", /*#__PURE__*/React.createElement("br", null));
};

const Passage = props => {
  const {
    passagesObj
  } = useContext(MyContext);
  const [passages, setPassages] = passagesObj;
  return /*#__PURE__*/React.createElement("div", {
    className: "single-question rounded-lg pb-4 text-left mx-auto mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "single-question-header rounded-t-lg px-4 py-2 text-white bg-gray-600 text-md"
  }, /*#__PURE__*/React.createElement(PassageQuestionPrompt, {
    passageIndex: props.passageIndex,
    questionIndex: props.questionIndex
  })), /*#__PURE__*/React.createElement("div", {
    className: "single-question-body bg-white text-gray-900 py-4 px-8 rounded-b-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "single-question-statement",
    style: {
      whiteSpace: "pre-line"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      wordWrap: "break-word"
    }
  }, passages[props.passageIndex].statement))));
};

const ImageOrAudio = props => {
  if (props.question.image != null && props.question.image != "null") {
    if (props.question.image.indexOf("img/") !== -1) {
      return /*#__PURE__*/React.createElement("img", {
        src: props.question.image,
        className: "max-w-xl max-h-xl w-auto h-auto"
      });
    } else if (props.question.image.indexOf("audio/") !== -1) {
      return /*#__PURE__*/React.createElement("audio", {
        controls: true
      }, /*#__PURE__*/React.createElement("source", {
        src: props.question.image,
        type: "audio/mpeg"
      }), /*#__PURE__*/React.createElement("span", null, "Your browser does not support the audio element. Use a modern browser."));
    } else return /*#__PURE__*/React.createElement("div", null);
  } else return /*#__PURE__*/React.createElement("div", null);
};

const Question = props => {
  const {
    questionsObj
  } = useContext(MyContext);
  const [questions, setQuestions] = questionsObj;
  const question = props.obj.question;
  const options = props.obj.options;
  return /*#__PURE__*/React.createElement("div", {
    className: "single-question rounded-lg pb-4 text-left mx-auto mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "single-question-header rounded-t-lg px-4 py-2 text-white bg-iec-blue text-md"
  }, "Question ", props.questionIndex + 1, " of ", props.total_questions), /*#__PURE__*/React.createElement("div", {
    className: "single-question-body bg-white text-gray-900 py-4 px-8 rounded-b-lg"
  }, /*#__PURE__*/React.createElement(ImageOrAudio, {
    question: question
  }), /*#__PURE__*/React.createElement("a", {
    href: question.link_url,
    className: "text-blue-600 underline hover:no-underline",
    target: "_blank"
  }, question.link_text == null ? question.link_url : question.link_text), /*#__PURE__*/React.createElement("div", {
    className: "single-question-statement",
    style: {
      whiteSpace: "pre-line"
    }
  }, question.statement), /*#__PURE__*/React.createElement("ul", {
    className: "mt-2"
  }, options.map((option, index) => /*#__PURE__*/React.createElement(Option, {
    option: option,
    optionIndex: index,
    name: props.questionIndex,
    questionIndex: props.questionIndex,
    questionType: question.type,
    key: option.id
  })))));
};

const Main = () => {
  const {
    questionsObj,
    displayQuestionsObj,
    passagesObj
  } = useContext(MyContext);
  const [questions, setQuestions] = questionsObj;
  const [passages, setPassages] = passagesObj;
  const [displayQuestions, setDisplayQuestions] = displayQuestionsObj;
  const [saveSpinner, setSaveSpinner] = useState(false);
  const [saveButtonColor, setSaveButtonColor] = useState("bg-iec-blue");
  const [saveButtonText, setSaveButtonText] = useState("Save Current Progress");
  const [submitSpinner, setSubmitSpinner] = useState(false);
  const [submitButtonColor, setSubmitButtonColor] = useState("bg-iec-blue");
  useMemo(() => {
    setSaveButtonColor("bg-iec-blue");
    setSaveButtonText("Save Current Progress");
  }, [questions]);
  useEffect(() => {
    if (displayQuestions == false) submitQuiz();
  }, [displayQuestions]);

  function saveQuizProgress() {
    // the questions array has excessive information about questions and options. I don't want that. So I'm going to create a reduced array with just the information needed by the server
    setSaveSpinner(true);
    let answers = [];
    questions.forEach(obj => {
      if (obj.question.type == "MCQ-S") answers.push({
        questionId: obj.question.id,
        questionType: obj.question.type,
        answerOptionId: obj.answer
      });else {
        // for MCQ-M, the obj.answer array contains [true, false], we need optionIds there
        let optionIds = [];
        obj.options.forEach((option, index) => {
          if (obj.answer[index]) optionIds.push(option.id);
        });
        answers.push({
          questionId: obj.question.id,
          questionType: obj.question.type,
          answerOptionId: optionIds
        });
      }
    });
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "/quiz/save-progress",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          sectionId: sectionId,
          answers: answers
        }),
        dataType: "json",
        success: function (response) {
          setSaveSpinner(false);

          if (response.success == true) {
            setSaveButtonColor("bg-green-500");
            setSaveButtonText("Saved Successfully");
            resolve(response.time);
          } else {
            setSaveButtonColor("bg-red-500");
            setSaveButtonText("Saving Failed!");
            setTimeout(() => {
              setSaveButtonColor("bg-iec-blue");
              setSaveButtonText("Save Current Progress");
            }, 3000);
            reject();
          }
        }
      });
    });
  }

  function sendScoringRequest(time) {
    $.get("/quiz/attempt/" + sectionId + "/score", function (resp) {
      if (resp.success == true) {
        setSubmitSpinner(false);
        setSubmitButtonColor("bg-green-500");
        console.log("Quiz submitted successfully.");
        if (resp.all_sections_solved) window.location = "/student/feedback";else window.location = "/student?success=true";
      } else {
        console.log("Error submitting quiz.");
      }
    });
  }

  function submitQuiz() {
    // if saveButtonColor is green, that means student's quiz has been saved at the server and nothing has changed afterwards
    if (saveButtonColor != "bg-green-500") {
      saveQuizProgress().then(time => {
        setSubmitSpinner(true);
        sendScoringRequest(time);
      }).catch(err => {
        console.log(err);
      });
    } else {
      sendScoringRequest();
    } // saving was successful, now we send a request to the server which will ask the server to calculate the score of this student in the background and then we will redirect this student to his/her home page

  }

  useEffect(() => {
    $.get("/quiz/section/" + sectionId + "/all-questions", resp => {
      if (resp.success == true) {
        const mcqs = resp.data;
        setPassages(resp.passages);
        setQuestions(mcqs);
      } else {
        // handle error
        console.log("Error getting questions.");
      }
    }, "json");
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 justify-end mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "justify-self-center sm:justify-self-end flex flex-row gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: saveButtonColor + " hover:bg-iec-blue-hover text-white rounded-md px-4 py-2",
    onClick: saveQuizProgress,
    disabled: preview_or_not
  }, /*#__PURE__*/React.createElement("i", {
    className: saveSpinner ? "fas fa-spinner animate-spin" : "far fa-save"
  }), " ", saveButtonText), /*#__PURE__*/React.createElement("button", {
    className: submitButtonColor + " hover:bg-iec-blue-hover text-white rounded-md px-4 py-2",
    onClick: submitQuiz,
    disabled: preview_or_not
  }, /*#__PURE__*/React.createElement("i", {
    className: submitSpinner ? "fas fa-spinner animate-spin" : "far fa-paper-plane"
  }), " ", "Finish & Submit Quiz"))), displayQuestions ? questions.map((obj, index) => obj.question.passage == null ? /*#__PURE__*/React.createElement(Question, {
    obj: obj,
    questionIndex: index,
    total_questions: questions.length,
    key: obj.question.id
  }) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Passage, {
    passage: passages[obj.question.passage],
    questionIndex: index,
    passageIndex: obj.question.passage
  }), /*#__PURE__*/React.createElement(Question, {
    obj: obj,
    questionIndex: index,
    total_questions: questions.length,
    key: obj.question.id
  }))) : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 justify-end mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "justify-self-center sm:justify-self-end flex flex-row gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: saveButtonColor + " hover:bg-iec-blue-hover text-white rounded-md px-4 py-2",
    onClick: saveQuizProgress,
    disabled: preview_or_not
  }, /*#__PURE__*/React.createElement("i", {
    className: saveSpinner ? "fas fa-spinner animate-spin" : "far fa-save"
  }), " ", saveButtonText), /*#__PURE__*/React.createElement("button", {
    className: submitButtonColor + " hover:bg-iec-blue-hover text-white rounded-md px-4 py-2",
    onClick: submitQuiz,
    disabled: preview_or_not
  }, /*#__PURE__*/React.createElement("i", {
    className: submitSpinner ? "fas fa-spinner animate-spin" : "far fa-paper-plane"
  }), " ", "Finish & Submit Quiz"))));
};

const Header = () => {
  const {
    questionsObj,
    displayQuestionsObj
  } = useContext(MyContext);
  const [displayQuestions, setDisplayQuestions] = displayQuestionsObj;
  const [remainingTime, setRemainingTime] = useState("Please wait");
  const remainingTimeRef = useRef("Please wait");
  const timeRef = useRef(null); //stores the setInterval object

  remainingTimeRef.current = remainingTime;

  function myFunction() {
    if (remainingTimeRef.current == 0) {
      setRemainingTime("No Time Limit");
      clearInterval(timeRef.current);
    } else if (remainingTimeRef.current != null && remainingTimeRef.current < 2000) {
      setTimeout(() => {
        setDisplayQuestions(false);
        setRemainingTime("Time Over");
      }, 1000);
      clearInterval(timeRef.current);
    } else if (remainingTimeRef.current != null) {
      setRemainingTime(cur => {
        return cur - 1000;
      });
    }
  }

  useEffect(() => {
    let edt;
    $.get("/quiz/section/" + sectionId + "/endTime", resp => {
      if (resp.success == true) {
        edt = resp.duration_left;
        setRemainingTime(edt);

        if (edt != 0) {
          console.log("interval set");
          timeRef.current = setInterval(myFunction, 1000);
        }
      } else {
        // handle error
        console.log("Error getting endTime.");
        alert("Please contact IT team at rohan.hussain@iec.org.pk");
      }
    }, "json");
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    class: "sticky top-0 shadow-lg"
  }, /*#__PURE__*/React.createElement("div", {
    id: "quiz-header",
    className: "bg-white m-auto mb-1 gap-y-2 px-8 py-4 rounded-2xl grid grid-cols-4 justify-between text-lg"
  }, /*#__PURE__*/React.createElement("p", {
    className: "justify-self-center md:justify-self-start col-span-4 md:col-span-2 lg:col-span-1"
  }, quizTitle), /*#__PURE__*/React.createElement("p", {
    className: "justify-self-center md:justify-self-end col-span-4 md:col-span-2 lg:col-span-1"
  }, sectionTitle), /*#__PURE__*/React.createElement("p", {
    className: remainingTime == "No Time Limit" ? "text-green-700 justify-self-center lg:justify-self-end col-span-4 lg:col-span-2" : "text-red-700" + "justify-self-center lg:justify-self-end col-span-4 lg:col-span-2"
  }, millisecondsToMinutesAndSeconds(remainingTime))));
};

const App = () => {
  return /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement(Main, null));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));