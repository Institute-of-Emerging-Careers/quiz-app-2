const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const sectionId = parseInt(document.getElementById("sectionId").value);
const quizTitle = document.getElementById("quizTitle").innerText;
const sectionTitle = document.getElementById("sectionTitle").innerText;

function millisecondsToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + " minutes and " + (seconds < 10 ? "0" : "") + seconds + " seconds remaining";
}


const ContextProvider = (props) => {
  const [questions, setQuestions] = useState([]);
  const [displayQuestions, setDisplayQuestions] = useState(true);

  return <MyContext.Provider value={{ questionsObj: [questions, setQuestions], displayQuestionsObj: [displayQuestions, setDisplayQuestions] }}>{props.children}</MyContext.Provider>;
};

const MCQSOption = (props) => {
  const { questionsObj } = useContext(MyContext);
  const [questions, setQuestions] = questionsObj;

  return (
    <li>
      <input
        type="radio"
        name={props.name}
        value={props.option.id}
        className="mb-2"
        onChange={(e) => {
          setQuestions((cur) => {
            let copy = cur.slice();
            copy[props.questionIndex].answer = e.target.value;
            return copy;
          });
          console.log("MCQ-S", e.target.value);
        }}
        checked={questions[props.questionIndex].answer == props.option.id}
      />{" "}
      <label>{props.option.statement}
      {props.option.image != null ? <img src={props.option.image} className="max-h-48 max-w-full h-auto w-auto py-4"></img> : <span></span>}
      </label>
    </li>
  );
};

const MCQMOption = (props) => {
  const { questionsObj } = useContext(MyContext);
  const [questions, setQuestions] = questionsObj;

  return (
    <li>
      <input
        type="checkbox"
        name={props.name}
        value={props.option.id}
        className="mb-2"
        onChange={(e) => {
          setQuestions((cur) => {
            let copy = cur.slice();
            copy[props.questionIndex].answer[props.optionIndex] = !copy[props.questionIndex].answer[props.optionIndex];
            console.log("MCQ-M", copy);
            return copy;
          });
        }}
        checked={questions[props.questionIndex].answer[props.optionIndex]}
      />{" "}
      <label>{props.option.statement}</label>
    </li>
  );
};

const Option = (props) => {

  if (props.questionType == "MCQ-S") return <MCQSOption option={props.option} name={props.name} questionIndex={props.questionIndex}></MCQSOption>;
  else if (props.questionType == "MCQ-M") return <MCQMOption option={props.option} optionIndex={props.optionIndex} name={props.name} questionIndex={props.questionIndex}></MCQMOption>;
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

const Question = (props) => {
  const { questionsObj } = useContext(MyContext);
  const [questions, setQuestions] = questionsObj;
  const question = props.obj.question;
  const options = props.obj.options;

  useEffect(() => {
    // setQuestions((cur) => {
    //   let copy = cur.slice();
    //   let s = [];
    //   options.map((option) => {
    //     s.push(false);
    //   });
    //   if (question.type == "MCQ-S") copy[props.questionIndex].answer = -1;
    //   else if (question.type == "MCQ-M") copy[props.questionIndex].answer = s;
    //   return copy;
    // });
  }, []);

  return (
    <div className="single-question rounded-lg pb-4 text-left mx-auto mt-4">
      <div className="single-question-header rounded-t-lg px-4 py-2 text-white bg-iec-blue text-md">
        Question {question.questionOrder + 1} of {props.total_questions}
      </div>
      <div className="single-question-body bg-white text-gray-900 py-4 px-8 rounded-b-lg">
        <img src={question.image} className="max-w-xl max-h-xl w-auto h-auto"></img>
        <a href={question.link_url} class="text-blue-600 underline hover:no-underline" target="_blank">{question.link_text == null ? question.link_url : question.link_text}</a>
        <div className="single-question-statement" style={{whiteSpace: 'pre-line'}}>{question.statement.replace(/(?:\r\n|\r|\n)/g, '<br>')}</div>
        <ul className="mt-2">
          {options.map((option, index) => (
            <Option option={option} optionIndex={index} name={question.questionOrder} questionIndex={props.questionIndex} questionType={question.type} key={option.id}></Option>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Header = () => {
  const { questionsObj, displayQuestionsObj } = useContext(MyContext);
  const [questions, setQuestions] = questionsObj;
  const [displayQuestions, setDisplayQuestions] = displayQuestionsObj;

  const [endTime, setEndTime] = useState(null);
  const endTimeRef = useRef(0);
  const [remainingTime, setRemainingTime] = useState("Please wait");
  const timeRef = useRef(null); //stores the setInterval object

  endTimeRef.current = endTime;

  function myFunction() {
    console.log(endTimeRef.current);
    if (endTimeRef.current == 0) {
      setRemainingTime("No Time Limit");
      clearInterval(timeRef.current);
    } else if (endTimeRef.current != null && endTimeRef.current - Date.now() < 1000) {
      setTimeout(() => {
        setRemainingTime("Time Over");
        setDisplayQuestions(false);
      }, 1000);
      clearInterval(timeRef.current);
    } else if (endTimeRef.current != null) {
      setRemainingTime(millisecondsToMinutesAndSeconds(endTimeRef.current - Date.now()));
    }
  }

  useEffect(() => {
    $.get(
      "/section/" + sectionId + "/endTime",
      (resp) => {
        if (resp.success == true) {
          const edt = resp.endTime;
          setEndTime(edt);
        } else {
          // handle error
          console.log("Error getting endTime.");
        }
      },
      "json"
    );
    timeRef.current = setInterval(myFunction, 1000);
  }, []);

  return (
    <div>
      <div id="quiz-header" className="bg-white m-auto mb-1 gap-y-2 px-8 py-4 rounded-2xl grid grid-cols-4 justify-between text-lg">
        <p className="justify-self-center md:justify-self-start col-span-4 md:col-span-2 lg:col-span-1">{quizTitle}</p>
        <p className="justify-self-center md:justify-self-end col-span-4 md:col-span-2 lg:col-span-1">{sectionTitle}</p>
        <p className={remainingTime == "No Time Limit" ? "text-green-700 justify-self-center lg:justify-self-end col-span-4 lg:col-span-2" : "text-red-700" + "justify-self-center lg:justify-self-end col-span-4 lg:col-span-2"}>{remainingTime}</p>
      </div>
    </div>
  );
};

const Main = () => {
  const { questionsObj, displayQuestionsObj } = useContext(MyContext);
  const [questions, setQuestions] = questionsObj;
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

  useMemo(() => {
    if (displayQuestions == false) submitQuiz();
  }, [displayQuestions]);

  function saveQuizProgress() {
    // the questions array has excessive information about questions and options. I don't want that. So I'm going to create a reduced array with just the information needed by the server
    setSaveSpinner(true);
    let answers = [];
    questions.forEach((obj) => {
      if (obj.question.type == "MCQ-S") answers.push({ questionId: obj.question.id, questionType: obj.question.type, answerOptionId: obj.answer });
      else {
        // for MCQ-M, the obj.answer array contains [true, false], we need optionIds there
        let optionIds = [];
        obj.options.forEach((option, index) => {
          if (obj.answer[index]) optionIds.push(option.id);
        });
        answers.push({ questionId: obj.question.id, questionType: obj.question.type, answerOptionId: optionIds });
      }
    });

    return new Promise((resolve, reject) => {
      $.ajax({
        url: "/quiz/save-progress",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ sectionId: sectionId, answers: answers }),
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
        },
      });
    });
  }

  function sendScoringRequest(time) {
    $.get("/quiz/attempt/" + sectionId + "/score?time="+time, function (resp) {
      if (resp.success == true) {
        setSubmitSpinner(false);
        setSubmitButtonColor("bg-green-500");
        console.log("Quiz submitted successfully.");
        window.location = "/student?success=true";
      } else {
        console.log("Error submitting quiz.");
      }
    });
  }

  function submitQuiz() {
    // if saveButtonColor is green, that means student's quiz has been saved at the server and nothing has changed afterwards
    if (saveButtonColor != "bg-green-500") {
      saveQuizProgress()
        .then((time) => {
          setSubmitSpinner(true);
          sendScoringRequest(time);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      sendScoringRequest();
    }

    // saving was successful, now we send a request to the server which will ask the server to calculate the score of this student in the background and then we will redirect this student to his/her home page
  }

  useEffect(() => {
    $.get(
      "/section/" + sectionId + "/all-questions",
      (resp) => {
        if (resp.success == true) {
          const data = resp.data;
          setQuestions(data);
        } else {
          // handle error
          console.log("Error getting questions.");
        }
      },
      "json"
    );
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 justify-end mb-6">
        <div className="justify-self-center sm:justify-self-end flex flex-row gap-2">
          <button className={saveButtonColor + " hover:bg-iec-blue-hover text-white rounded-md px-4 py-2"} onClick={saveQuizProgress}>
            <i className={saveSpinner ? "fas fa-spinner animate-spin" : "far fa-save"}></i> {saveButtonText}
          </button>
          <button className={submitButtonColor + " hover:bg-iec-blue-hover text-white rounded-md px-4 py-2"} onClick={submitQuiz}>
            <i className={submitSpinner ? "fas fa-spinner animate-spin" : "far fa-paper-plane"}></i> Finish & Submit Quiz
          </button>
        </div>
      </div>
      {displayQuestions ? questions.map((obj, index) => <Question obj={obj} questionIndex={index} total_questions={questions.length} key={obj.question.id}></Question>) : <div></div>}
    </div>
  );
};

const App = () => {
  return (
    <ContextProvider>
      <Header />
      <Main />
    </ContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
