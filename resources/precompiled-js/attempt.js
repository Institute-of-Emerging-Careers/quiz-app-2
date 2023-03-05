"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var MyContext = React.createContext();
var useEffect = React.useEffect;
var useState = React.useState;
var useContext = React.useContext;
var useRef = React.useRef;
var useMemo = React.useMemo;
var sectionId = parseInt(document.getElementById('sectionId').value);
var quizTitle = document.getElementById('quizTitle').innerText;
var sectionTitle = document.getElementById('sectionTitle').innerText;
var preview_or_not = parseInt(document.getElementById('previewOrNot').value);

function millisecondsToMinutesAndSeconds(millis) {
  if (millis === 0) return 'No Time Limit';else {
    var minutes = Math.floor(millis / 60000);
    var seconds = (millis % 60000 / 1000).toFixed(0);
    return minutes + ' minutes and ' + (seconds < 10 ? '0' : '') + seconds + ' seconds remaining';
  }
}

var ContextProvider = function ContextProvider(props) {
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      questions = _useState2[0],
      setQuestions = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      passages = _useState4[0],
      setPassages = _useState4[1];

  var _useState5 = useState(true),
      _useState6 = _slicedToArray(_useState5, 2),
      displayQuestions = _useState6[0],
      setDisplayQuestions = _useState6[1]; // displayQuestions is true when there is still time to solve the quiz, and becomes false when time ends.


  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: {
      questionsObj: [questions, setQuestions],
      passagesObj: [passages, setPassages],
      displayQuestionsObj: [displayQuestions, setDisplayQuestions]
    }
  }, props.children);
};

var MCQSOption = function MCQSOption(props) {
  var _useContext = useContext(MyContext),
      questionsObj = _useContext.questionsObj;

  var _questionsObj = _slicedToArray(questionsObj, 2),
      questions = _questionsObj[0],
      setQuestions = _questionsObj[1];

  return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: props.name,
    value: props.option.id,
    className: "mb-2 align-baseline",
    style: {
      height: '17px',
      width: '17px'
    },
    onChange: function onChange(e) {
      setQuestions(function (cur) {
        var copy = cur.slice();
        copy[props.questionIndex].answer = e.target.value;
        return copy;
      });
      console.log('MCQ-S', e.target.value);
    },
    checked: questions[props.questionIndex].answer === props.option.id
  }), ' ', /*#__PURE__*/React.createElement("label", null, props.option.statement, props.option.image != null ? /*#__PURE__*/React.createElement("img", {
    src: props.option.image,
    className: "max-h-48 max-w-full h-auto w-auto py-4"
  }) : /*#__PURE__*/React.createElement("span", null)));
};

var MCQMOption = function MCQMOption(props) {
  var _useContext2 = useContext(MyContext),
      questionsObj = _useContext2.questionsObj;

  var _questionsObj2 = _slicedToArray(questionsObj, 2),
      questions = _questionsObj2[0],
      setQuestions = _questionsObj2[1];

  return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: props.name,
    value: props.option.id,
    className: "mb-2",
    onChange: function onChange(e) {
      setQuestions(function (cur) {
        var copy = cur.slice();
        copy[props.questionIndex].answer[props.optionIndex] = !copy[props.questionIndex].answer[props.optionIndex];
        console.log('MCQ-M', copy);
        return copy;
      });
    },
    checked: questions[props.questionIndex].answer[props.optionIndex]
  }), ' ', /*#__PURE__*/React.createElement("label", null, props.option.statement));
};

var Option = function Option(props) {
  if (props.questionType === 'MCQ-S') return /*#__PURE__*/React.createElement(MCQSOption, {
    option: props.option,
    name: props.name,
    questionIndex: props.questionIndex
  });else if (props.questionType === 'MCQ-M') return /*#__PURE__*/React.createElement(MCQMOption, {
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


var PassageQuestionPrompt = function PassageQuestionPrompt(props) {
  var _useContext3 = useContext(MyContext),
      questionsObj = _useContext3.questionsObj;

  var _questionsObj3 = _slicedToArray(questionsObj, 1),
      questions = _questionsObj3[0];

  var _useState7 = useState(''),
      _useState8 = _slicedToArray(_useState7, 2),
      setListOfQuestions = _useState8[1];

  useEffect(function () {
    var list = '';
    questions.forEach(function (question_obj, question_index) {
      if (question_obj.question.passage === props.passageIndex) {
        if (list !== '') list += ', ';
        list += question_index + 1;
      }
    });
    setListOfQuestions(list);
  }, []);
  return /*#__PURE__*/React.createElement("span", null, "Questions ", props.questionIndex + 1, " is about the following comprehension passage: ", /*#__PURE__*/React.createElement("br", null));
};

var Passage = function Passage(props) {
  var _useContext4 = useContext(MyContext),
      passagesObj = _useContext4.passagesObj;

  var _passagesObj = _slicedToArray(passagesObj, 1),
      passages = _passagesObj[0];

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
      whiteSpace: 'pre-line'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      wordWrap: 'break-word'
    }
  }, passages[props.passageIndex].statement))));
};

var ImageOrAudio = function ImageOrAudio(props) {
  if (props.question.image != null && props.question.image !== 'null') {
    if (props.question.image.indexOf('img/') !== -1) {
      return /*#__PURE__*/React.createElement("img", {
        src: props.question.image,
        className: "max-w-xl max-h-xl w-auto h-auto"
      });
    } else if (props.question.image.indexOf('audio/') !== -1) {
      return /*#__PURE__*/React.createElement("audio", {
        controls: true
      }, /*#__PURE__*/React.createElement("source", {
        src: props.question.image,
        type: "audio/mpeg"
      }), /*#__PURE__*/React.createElement("span", null, "Your browser does not support the audio element. Use a modern browser."));
    } else return /*#__PURE__*/React.createElement("div", null);
  } else return /*#__PURE__*/React.createElement("div", null);
};

var Question = function Question(props) {
  var question = props.obj.question;
  var options = props.obj.options;
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
    target: "_blank",
    rel: "noreferrer"
  }, question.link_text == null ? question.link_url : question.link_text), /*#__PURE__*/React.createElement("div", {
    className: "single-question-statement",
    style: {
      whiteSpace: 'pre-line'
    }
  }, question.statement), /*#__PURE__*/React.createElement("ul", {
    className: "mt-2"
  }, options.map(function (option, index) {
    return /*#__PURE__*/React.createElement(Option, {
      option: option,
      optionIndex: index,
      name: props.questionIndex,
      questionIndex: props.questionIndex,
      questionType: question.type,
      key: option.id
    });
  }))));
};

var Main = function Main() {
  var _useContext5 = useContext(MyContext),
      questionsObj = _useContext5.questionsObj,
      displayQuestionsObj = _useContext5.displayQuestionsObj,
      passagesObj = _useContext5.passagesObj;

  var _questionsObj4 = _slicedToArray(questionsObj, 2),
      questions = _questionsObj4[0],
      setQuestions = _questionsObj4[1];

  var _passagesObj2 = _slicedToArray(passagesObj, 2),
      passages = _passagesObj2[0],
      setPassages = _passagesObj2[1];

  var _displayQuestionsObj = _slicedToArray(displayQuestionsObj, 1),
      displayQuestions = _displayQuestionsObj[0];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      saveSpinner = _useState10[0],
      setSaveSpinner = _useState10[1];

  var _useState11 = useState('bg-iec-blue'),
      _useState12 = _slicedToArray(_useState11, 2),
      saveButtonColor = _useState12[0],
      setSaveButtonColor = _useState12[1];

  var _useState13 = useState('Save Current Progress'),
      _useState14 = _slicedToArray(_useState13, 2),
      saveButtonText = _useState14[0],
      setSaveButtonText = _useState14[1];

  var _useState15 = useState(false),
      _useState16 = _slicedToArray(_useState15, 2),
      submitSpinner = _useState16[0],
      setSubmitSpinner = _useState16[1];

  var _useState17 = useState('bg-iec-blue'),
      _useState18 = _slicedToArray(_useState17, 2),
      submitButtonColor = _useState18[0],
      setSubmitButtonColor = _useState18[1];

  useMemo(function () {
    setSaveButtonColor('bg-iec-blue');
    setSaveButtonText('Save Current Progress');
  }, [questions]);
  useEffect(function () {
    if (displayQuestions === false) submitQuiz();
  }, [displayQuestions]);

  function saveQuizProgress() {
    // the questions array has excessive information about questions and options. I don't want that. So I'm going to create a reduced array with just the information needed by the server
    setSaveSpinner(true);
    var answers = [];
    questions.forEach(function (obj) {
      if (obj.question.type === 'MCQ-S') answers.push({
        questionId: obj.question.id,
        questionType: obj.question.type,
        answerOptionId: obj.answer
      });else {
        // for MCQ-M, the obj.answer array contains [true, false], we need optionIds there
        var optionIds = [];
        obj.options.forEach(function (option, index) {
          if (obj.answer[index]) optionIds.push(option.id);
        });
        answers.push({
          questionId: obj.question.id,
          questionType: obj.question.type,
          answerOptionId: optionIds
        });
      }
    });
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: '/quiz/save-progress',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          sectionId: sectionId,
          answers: answers
        }),
        dataType: 'json',
        success: function success(response) {
          setSaveSpinner(false);

          if (response.success === true) {
            setSaveButtonColor('bg-green-500');
            setSaveButtonText('Saved Successfully');
            resolve(response.time);
          } else {
            setSaveButtonColor('bg-red-500');
            setSaveButtonText('Saving Failed!');
            setTimeout(function () {
              setSaveButtonColor('bg-iec-blue');
              setSaveButtonText('Save Current Progress');
            }, 3000);
            reject(new Error('Failed to save progress'));
          }
        }
      });
    });
  }

  function sendScoringRequest() {
    $.get('/quiz/attempt/' + sectionId + '/score', function (resp) {
      if (resp.success === true) {
        setSubmitSpinner(false);
        setSubmitButtonColor('bg-green-500');
        console.log('Quiz submitted successfully.');
        if (resp.all_sections_solved) window.location = '/student/feedback';else window.location = '/student?success=true';
      } else {
        console.log('Error submitting quiz.');
      }
    });
  }

  function submitQuiz() {
    // if saveButtonColor is green, that means student's quiz has been saved at the server and nothing has changed afterwards
    if (saveButtonColor !== 'bg-green-500') {
      saveQuizProgress().then(function (time) {
        setSubmitSpinner(true);
        sendScoringRequest(time);
      }).catch(function (err) {
        console.log(err);
      });
    } else {
      sendScoringRequest();
    } // saving was successful, now we send a request to the server which will ask the server to calculate the score of this student in the background and then we will redirect this student to his/her home page

  }

  useEffect(function () {
    $.get('/quiz/section/' + sectionId + '/all-questions', function (resp) {
      if (resp.success === true) {
        var mcqs = resp.data;
        setPassages(resp.passages);
        setQuestions(mcqs);
      } else {
        // handle error
        console.log('Error getting questions.');
      }
    }, 'json');
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 justify-end mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "justify-self-center sm:justify-self-end flex flex-row gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: saveButtonColor + ' hover:bg-iec-blue-hover text-white rounded-md px-4 py-2',
    onClick: saveQuizProgress,
    disabled: preview_or_not
  }, /*#__PURE__*/React.createElement("i", {
    className: saveSpinner ? 'fas fa-spinner animate-spin' : 'far fa-save'
  }), ' ', saveButtonText), /*#__PURE__*/React.createElement("button", {
    className: submitButtonColor + ' hover:bg-iec-blue-hover text-white rounded-md px-4 py-2',
    onClick: submitQuiz,
    disabled: preview_or_not
  }, /*#__PURE__*/React.createElement("i", {
    className: submitSpinner ? 'fas fa-spinner animate-spin' : 'far fa-paper-plane'
  }), ' ', "Finish & Submit Quiz"))), displayQuestions ? questions.map(function (obj, index) {
    return obj.question.passage == null ? /*#__PURE__*/React.createElement(Question, {
      obj: obj,
      questionIndex: index,
      total_questions: questions.length,
      key: obj.question.id
    }) : /*#__PURE__*/React.createElement("div", {
      key: index
    }, /*#__PURE__*/React.createElement(Passage, {
      passage: passages[obj.question.passage],
      questionIndex: index,
      passageIndex: obj.question.passage
    }), /*#__PURE__*/React.createElement(Question, {
      obj: obj,
      questionIndex: index,
      total_questions: questions.length,
      key: obj.question.id
    }));
  }) : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 justify-end mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "justify-self-center sm:justify-self-end flex flex-row gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: saveButtonColor + ' hover:bg-iec-blue-hover text-white rounded-md px-4 py-2',
    onClick: saveQuizProgress,
    disabled: preview_or_not
  }, /*#__PURE__*/React.createElement("i", {
    className: saveSpinner ? 'fas fa-spinner animate-spin' : 'far fa-save'
  }), ' ', saveButtonText), /*#__PURE__*/React.createElement("button", {
    className: submitButtonColor + ' hover:bg-iec-blue-hover text-white rounded-md px-4 py-2',
    onClick: submitQuiz,
    disabled: preview_or_not
  }, /*#__PURE__*/React.createElement("i", {
    className: submitSpinner ? 'fas fa-spinner animate-spin' : 'far fa-paper-plane'
  }), ' ', "Finish & Submit Quiz"))));
};

var Header = function Header() {
  var _useContext6 = useContext(MyContext),
      displayQuestionsObj = _useContext6.displayQuestionsObj;

  var _displayQuestionsObj2 = _slicedToArray(displayQuestionsObj, 2),
      setDisplayQuestions = _displayQuestionsObj2[1];

  var _useState19 = useState('Please wait'),
      _useState20 = _slicedToArray(_useState19, 2),
      remainingTime = _useState20[0],
      setRemainingTime = _useState20[1];

  var remainingTimeRef = useRef('Please wait');
  var timeRef = useRef(null); // stores the setInterval object

  remainingTimeRef.current = remainingTime;

  function myFunction() {
    if (remainingTimeRef.current === 0) {
      setRemainingTime('No Time Limit');
      clearInterval(timeRef.current);
    } else if (remainingTimeRef.current != null && remainingTimeRef.current < 2000) {
      setTimeout(function () {
        setDisplayQuestions(false);
        setRemainingTime('Time Over');
      }, 1000);
      clearInterval(timeRef.current);
    } else if (remainingTimeRef.current != null) {
      setRemainingTime(function (cur) {
        return cur - 1000;
      });
    }
  }

  useEffect(function () {
    var edt;
    $.get('/quiz/section/' + sectionId + '/endTime', function (resp) {
      if (resp.success === true) {
        edt = resp.duration_left;
        setRemainingTime(edt);

        if (edt !== 0) {
          console.log('interval set');
          timeRef.current = setInterval(myFunction, 1000);
        }
      } else {
        // handle error
        console.log('Error getting endTime.');
        alert('Please contact IT team at rohan.hussain@iec.org.pk');
      }
    }, 'json');
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "sticky top-0 shadow-lg"
  }, /*#__PURE__*/React.createElement("div", {
    id: "quiz-header",
    className: "bg-white m-auto mb-1 gap-y-2 px-8 py-4 rounded-2xl grid grid-cols-4 justify-between text-lg"
  }, /*#__PURE__*/React.createElement("p", {
    className: "justify-self-center md:justify-self-start col-span-4 md:col-span-2 lg:col-span-1"
  }, quizTitle), /*#__PURE__*/React.createElement("p", {
    className: "justify-self-center md:justify-self-end col-span-4 md:col-span-2 lg:col-span-1"
  }, sectionTitle), /*#__PURE__*/React.createElement("p", {
    className: remainingTime === 'No Time Limit' ? 'text-green-700 justify-self-center lg:justify-self-end col-span-4 lg:col-span-2' : 'text-red-700' + 'justify-self-center lg:justify-self-end col-span-4 lg:col-span-2'
  }, millisecondsToMinutesAndSeconds(remainingTime))));
};

var App = function App() {
  return /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement(Main, null));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('app'));