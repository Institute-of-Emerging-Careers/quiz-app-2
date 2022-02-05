const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const sectionId = parseInt(document.getElementById("sectionId").value);
const quizTitle = document.getElementById("quizTitle").innerText;
const sectionTitle = document.getElementById("sectionTitle").innerText;
const preview_or_not = parseInt(document.getElementById("previewOrNot").value)

function millisecondsToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (
    minutes +
    " minutes and " +
    (seconds < 10 ? "0" : "") +
    seconds +
    " seconds remaining"
  );
}

const ContextProvider = (props) => {
  const [questions, setQuestions] = useState([]);
  const [passages, setPassages] = useState([]);
  const [displayQuestions, setDisplayQuestions] = useState(true);
  // displayQuestions is true when there is still time to solve the quiz, and becomes false when time ends.

  return (
    <MyContext.Provider
      value={{
        questionsObj: [questions, setQuestions],
        passagesObj: [passages, setPassages],
        displayQuestionsObj: [displayQuestions, setDisplayQuestions],
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
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
      <label>
        {props.option.statement}
        {props.option.image != null ? (
          <img
            src={props.option.image}
            className="max-h-48 max-w-full h-auto w-auto py-4"
          ></img>
        ) : (
          <span></span>
        )}
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
            copy[props.questionIndex].answer[props.optionIndex] =
              !copy[props.questionIndex].answer[props.optionIndex];
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
  if (props.questionType == "MCQ-S")
    return (
      <MCQSOption
        option={props.option}
        name={props.name}
        questionIndex={props.questionIndex}
      ></MCQSOption>
    );
  else if (props.questionType == "MCQ-M")
    return (
      <MCQMOption
        option={props.option}
        optionIndex={props.optionIndex}
        name={props.name}
        questionIndex={props.questionIndex}
      ></MCQMOption>
    );
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

const PassageQuestionPrompt = (props) => {
  const { questionsObj } = useContext(MyContext);
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

  return (
    <span>
      Questions {props.questionIndex+1} isi about the following comprehension
      passage: <br></br>
    </span>
  );
};

const Passage = (props) => {
  const { passagesObj } = useContext(MyContext);
  const [passages, setPassages] = passagesObj;

  return (
    <div className="single-question rounded-lg pb-4 text-left mx-auto mt-4">
      <div className="single-question-header rounded-t-lg px-4 py-2 text-white bg-gray-600 text-md">
        {/* Comprehension Passage {props.passageIndex + 1} of {passages.length} */}
        <PassageQuestionPrompt
          passageIndex={props.passageIndex}
        ></PassageQuestionPrompt>
      </div>
      <div className="single-question-body bg-white text-gray-900 py-4 px-8 rounded-b-lg">
        <div
          className="single-question-statement"
          style={{ whiteSpace: "pre-line" }}
        >
          <p style={{ wordWrap: "break-word" }}>
            {passages[props.passageIndex].statement}
          </p>
        </div>
      </div>
    </div>
  );
};

const ImageOrAudio = (props) => {
  if (props.question.image!=null) {
    if (props.question.image.slice(1,4)=="img") {
      return (<img
        src={question.image}
        className="max-w-xl max-h-xl w-auto h-auto"
      ></img>)
    } else if (props.question.image.slice(1,6) == "audio") {
      return (
      <audio controls>
        <source src={props.question.image} type="audio/mpeg"></source>
        <span>Your browser does not support the audio element. Use a modern browser.</span>
      </audio>)
    }
  } else return <div></div>
}

const Question = (props) => {
  const { questionsObj } = useContext(MyContext);
  const [questions, setQuestions] = questionsObj;
  const question = props.obj.question;
  const options = props.obj.options;

  return (
    <div className="single-question rounded-lg pb-4 text-left mx-auto mt-4">
      <div className="single-question-header rounded-t-lg px-4 py-2 text-white bg-iec-blue text-md">
        Question {question.questionOrder + 1} of {props.total_questions}
      </div>
      <div className="single-question-body bg-white text-gray-900 py-4 px-8 rounded-b-lg">
        <ImageOrAudio question={question}></ImageOrAudio>
        <a
          href={question.link_url}
          className="text-blue-600 underline hover:no-underline"
          target="_blank"
        >
          {question.link_text == null ? question.link_url : question.link_text}
        </a>
        <div
          className="single-question-statement"
          style={{ whiteSpace: "pre-line" }}
        >
          {question.statement}
        </div>
        <ul className="mt-2">
          {options.map((option, index) => (
            <Option
              option={option}
              optionIndex={index}
              name={question.questionOrder}
              questionIndex={props.questionIndex}
              questionType={question.type}
              key={option.id}
            ></Option>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Main = () => {
  const { questionsObj, displayQuestionsObj, passagesObj } =
    useContext(MyContext);
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

  useMemo(() => {
    if (displayQuestions == false) submitQuiz();
  }, [displayQuestions]);

  function saveQuizProgress() {
    // the questions array has excessive information about questions and options. I don't want that. So I'm going to create a reduced array with just the information needed by the server
    setSaveSpinner(true);
    let answers = [];
    questions.forEach((obj) => {
      if (obj.question.type == "MCQ-S")
        answers.push({
          questionId: obj.question.id,
          questionType: obj.question.type,
          answerOptionId: obj.answer,
        });
      else {
        // for MCQ-M, the obj.answer array contains [true, false], we need optionIds there
        let optionIds = [];
        obj.options.forEach((option, index) => {
          if (obj.answer[index]) optionIds.push(option.id);
        });
        answers.push({
          questionId: obj.question.id,
          questionType: obj.question.type,
          answerOptionId: optionIds,
        });
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
    $.get(
      "/quiz/attempt/" + sectionId + "/score?time=" + time,
      function (resp) {
        if (resp.success == true) {
          setSubmitSpinner(false);
          setSubmitButtonColor("bg-green-500");
          console.log("Quiz submitted successfully.");
          window.location = "/student?success=true";
        } else {
          console.log("Error submitting quiz.");
        }
      }
    );
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
          const mcqs = resp.data;
          setPassages(resp.passages);
          setQuestions(mcqs);
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
          <button
            className={
              saveButtonColor +
              " hover:bg-iec-blue-hover text-white rounded-md px-4 py-2"
            }
            onClick={saveQuizProgress}
            disabled={preview_or_not}>
            <i
              className={
                saveSpinner ? "fas fa-spinner animate-spin" : "far fa-save"
              }
            ></i>{" "}
            {saveButtonText}
          </button>
          <button
            className={
              submitButtonColor +
              " hover:bg-iec-blue-hover text-white rounded-md px-4 py-2"
            }
            onClick={submitQuiz}
          disabled={preview_or_not}>
            <i
              className={
                submitSpinner
                  ? "fas fa-spinner animate-spin"
                  : "far fa-paper-plane"
              }
            ></i>{" "}
            Finish & Submit Quiz
          </button>
        </div>
      </div>
      {displayQuestions ? (
        questions.map((obj, index) =>
          obj.question.passage == null ? (
            <Question
              obj={obj}
              questionIndex={index}
              total_questions={questions.length}
              key={obj.question.id}
            ></Question>
          ) : (
            <div>
              <Passage
                passage={passages[obj.question.passage]}
                passageIndex={obj.question.passage}
              ></Passage>
              <Question
                obj={obj}
                questionIndex={index}
                total_questions={questions.length}
                key={obj.question.id}
              ></Question>
            </div>
          )
        )
      ) : (
        <div></div>
      )}
    </div>
  );
};

const Header = () => {
  const { questionsObj, displayQuestionsObj } = useContext(MyContext);
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
    } else if (
      endTimeRef.current != null &&
      endTimeRef.current - Date.now() < 1000
    ) {
      setTimeout(() => {
        setRemainingTime("Time Over");
        setDisplayQuestions(false);
      }, 1000);
      clearInterval(timeRef.current);
    } else if (endTimeRef.current != null) {
      setRemainingTime(
        millisecondsToMinutesAndSeconds(endTimeRef.current - Date.now())
      );
    }
  }

  useEffect(() => {
    let edt;
    $.get(
      "/section/" + sectionId + "/endTime",
      (resp) => {
        if (resp.success == true) {
          edt = resp.endTime;
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
      <div
        id="quiz-header"
        className="bg-white m-auto mb-1 gap-y-2 px-8 py-4 rounded-2xl grid grid-cols-4 justify-between text-lg"
      >
        <p className="justify-self-center md:justify-self-start col-span-4 md:col-span-2 lg:col-span-1">
          {quizTitle}
        </p>
        <p className="justify-self-center md:justify-self-end col-span-4 md:col-span-2 lg:col-span-1">
          {sectionTitle}
        </p>
        <p
          className={
            remainingTime == "No Time Limit"
              ? "text-green-700 justify-self-center lg:justify-self-end col-span-4 lg:col-span-2"
              : "text-red-700" +
                "justify-self-center lg:justify-self-end col-span-4 lg:col-span-2"
          }
        >
          {remainingTime}
        </p>
      </div>
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
