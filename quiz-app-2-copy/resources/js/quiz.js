const useState = React.useState;
const useEffect = React.useEffect;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const demoDiv = document.getElementById("demo");
const quizIdField = document.getElementById("quizIdField");
let globalQuizId;
if (quizIdField.innerText == "") {
  globalQuizId = null;
} else {
  globalQuizId = parseInt(quizIdField.innerText);
}

const MyContext = React.createContext();

const ContextProvider = (props) => {
  const [state, setState] = useState({ mcqs: [], passages: [] });

  return (
    <MyContext.Provider value={[state, setState]}>
      {props.children}
    </MyContext.Provider>
  );
};

const ErrorDisplay = (props) => {
  return props.error == "" ? (
    <p></p>
  ) : (
    <p className={props.errorColor + "text-sm leading-8 pb-2"}>
      <i className={"fas " + props.errorIcon + " " + props.errorColor}></i>{" "}
      <span className={props.errorColor}>{props.error}</span>
    </p>
  );
};

const Select = (props) => {
  let correct = "";
  props.options.forEach((option) => {
    if (option.correct == true) {
      correct = option.value;
    }
  });

  return (
    <div>
      <label>{props.label}</label>
      <select
        onChange={props.onChange}
        value={correct}
        className="border bg-white px-3 py-2 outline-none"
      >
        <option value="">Select an Option</option>
        {props.options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const SelectMultiple = (props) => {
  const [state, setState] = useContext(MyContext);
  const [alphabets, setAlphabets] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ]);

  return (
    <ul className="ml-2">
      {props.options.map((option, index) => {
        return option.optionStatement != null ? (
          <li key={index}>
            <input
              type="checkbox"
              value={index}
              name={props.name}
              checked={props.options[index].correct}
              onChange={props.onCheckboxChange}
            ></input>
            <label htmlFor={props.name}> {alphabets[index]}</label>
          </li>
        ) : (
          <span key={index}></span>
        );
      })}
    </ul>
  );
};

const Option = (props) => {
  const [state, setState] = useContext(MyContext);
  const [optionStatement, setOptionStatement] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  let fileUploadForm = useRef();
  const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const setOption = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      state.mcqs[props.sectionIndex].questions[props.questionIndex].options
        .length <= alphabets.length
    ) {
      setState((cur) => {
        let obj = { ...cur };
        let copy = obj.mcqs.slice();
        // change state so that a question also stores the index of its correct option

        // if this is a new option being set, do this
        if (
          copy[props.sectionIndex].questions[props.questionIndex].options[
            props.optionIndex
          ].optionStatement == null
        ) {
          copy[props.sectionIndex].questions[props.questionIndex].options[
            props.optionIndex
          ] = {
            optionStatement: optionStatement,
            correct: false,
            optionOrder: props.optionIndex,
            image: null,
            edit: false,
          };
          copy[props.sectionIndex].questions[props.questionIndex].options.push({
            optionStatement: null,
            correct: false,
            optionOrder: props.optionIndex + 1,
            image: null,
            edit: true,
          });
        } else if (
          copy[props.sectionIndex].questions[props.questionIndex].options[
            props.optionIndex
          ].edit == true
        ) {
          // if this is an old option being edited
          copy[props.sectionIndex].questions[props.questionIndex].options[
            props.optionIndex
          ].optionStatement = optionStatement;
          copy[props.sectionIndex].questions[props.questionIndex].options[
            props.optionIndex
          ].edit = false;
        }
        obj.mcqs = copy;
        return obj;
      });
    } else {
      setError("Cannot add more options. Alphabets exhausted.");
    }
  };

  function toggleOptionEditStatus() {
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[
        props.optionIndex
      ].edit =
        !copy[props.sectionIndex].questions[props.questionIndex].options[
          props.optionIndex
        ].edit;
      obj.mcqs = copy;
      return obj;
    });
  }

  function fixOptionOrdering(copy) {
    for (
      let i = 0;
      i <
      copy[props.sectionIndex].questions[props.questionIndex].options.length;
      i++
    ) {
      copy[props.sectionIndex].questions[props.questionIndex].options[
        i
      ].optionOrder = i;
    }
    return copy;
  }

  function deleteOption() {
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options.splice(
        props.optionIndex,
        1
      );
      copy = fixOptionOrdering(copy);
      obj.mcqs = copy;
      return obj;
    });
  }

  function uploadFile(e) {
    let data = new FormData(ReactDOM.findDOMNode(fileUploadForm.current));
    setUploading(true);
    // data.append("file", e.target.files[0]);
    fetch("/upload", {
      method: "POST",
      body: data,
    }).then((response) => {
      if (response.status == 200) {
        response.json().then((finalResponse) => {
          if (finalResponse.status == true) {
            setState((cur) => {
              let obj = { ...cur };
              let copy = obj.mcqs.slice();
              // problem: somehow these indexes are all 0
              copy[props.sectionIndex].questions[props.questionIndex].options[
                props.optionIndex
              ].image = finalResponse.filename;
              obj.mcqs = copy;
              return obj;
            });
            setUploading(false);
          }
        });
      }
    });
  }

  function deleteOptionImage(e) {
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[
        props.optionIndex
      ].image = null;
      obj.mcqs = copy;
      return obj;
    });
  }

  let option = props.opt;
  return option.edit == false ? (
    <li className="py-1">
      <div className="flex gap-4">
        <input
          type={props.type == "MCQ-S" ? "radio" : "checkbox"}
          name="option"
          value={option.optionStatement}
          className="self-center"
        ></input>
        <label className="self-center">
          {" "}
          <span className="text-gray-600 self-center">
            {alphabets[props.optionIndex]}:
          </span>{" "}
          {option.optionStatement}
        </label>
        <div className="flex gap-4 ml-4 self-center">
          <i
            className="fas fa-pen text-gray-300 hover:text-gray-500 cursor-pointer text-md self-center"
            onClick={toggleOptionEditStatus}
          ></i>
          <i
            className="fas fa-trash text-gray-300 hover:text-gray-500 cursor-pointer text-md self-center"
            onClick={deleteOption}
          ></i>

          <form
            method="POST"
            encType="multipart/form-data"
            action="/upload"
            ref={fileUploadForm}
            className="self-center"
          >
            <label
              htmlFor={
                "image-upload-" +
                props.sectionIndex.toString() +
                props.optionIndex.toString() +
                props.questionIndex.toString()
              }
              className="relative cursor-pointer text-gray-300 hover:text-gray-500 max-h-4 text-xl"
            >
              {uploading == false ? (
                <i className="fas fa-image self-center"></i>
              ) : (
                <i className="fas fa-spinner animate-spin self-center"></i>
              )}
              <input
                id={
                  "image-upload-" +
                  props.sectionIndex.toString() +
                  props.optionIndex.toString() +
                  props.questionIndex.toString()
                }
                type="file"
                accept="image/png, image/jpeg"
                name="file"
                onChange={uploadFile}
                className="self-center hidden"
              ></input>
            </label>
          </form>
        </div>
      </div>
      {state.mcqs[props.sectionIndex].questions[props.questionIndex].options[
        props.optionIndex
      ].image == null ? (
        <div className="hidden"></div>
      ) : (
        <div className="relative w-max">
          <img
            src={
              state.mcqs[props.sectionIndex].questions[props.questionIndex]
                .options[props.optionIndex].image
            }
            height="150px"
            className="mt-2 ml-8 max-h-64 w-auto self-center"
          ></img>
          <i
            className="fas fa-trash p-2 absolute top-0 right-0 bg-white text-red-500 shadow-md cursor-pointer"
            onClick={deleteOptionImage}
          ></i>
        </div>
      )}
    </li>
  ) : (
    <li>
      <ErrorDisplay error={error}></ErrorDisplay>
      <form onSubmit={setOption} className="mt-2">
        <input
          type="text"
          placeholder="Enter option"
          value={optionStatement}
          onChange={(e) => setOptionStatement(e.target.value)}
          className="px-4 py-1 border-2 border-r-0 border-gray-100"
          autoFocus
        ></input>
        <button className="px-4 py-1 bg-gray-300 border-2 border-l-0 border-gray-100">
          Add New Option
        </button>
      </form>
    </li>
  );
};

const ImageOrAudio = (props) => {
  const [state, setState] = useContext(MyContext);

  function deleteQuestionImage(e) {
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].image = null;
      obj.mcqs = copy;
      return obj;
    });
  }

  if (
    state.mcqs[props.sectionIndex].questions[props.questionIndex].image.indexOf(
      "img/"
    ) !== -1
  ) {
    return (
      <div className="relative w-max">
        <img
          src={
            state.mcqs[props.sectionIndex].questions[props.questionIndex].image
          }
          height="150px"
          className="mt-6 ml-8 max-h-64 w-auto"
        ></img>
        <i
          className="fas fa-trash p-2 absolute top-0 right-0 bg-white text-red-500 shadow-md cursor-pointer"
          onClick={deleteQuestionImage}
        ></i>
      </div>
    );
  } else if (
    state.mcqs[props.sectionIndex].questions[props.questionIndex].image.indexOf(
      "audio/"
    ) !== -1
  ) {
    return (
      <div className="w-max flex items-center">
        <audio controls>
          <source
            src={
              state.mcqs[props.sectionIndex].questions[props.questionIndex]
                .image
            }
            type="audio/mpeg"
          ></source>
          <span>Your browser does not support the audio element.</span>
        </audio>
        <i
          className="fas fa-trash p-2 bg-white text-red-500 cursor-pointer"
          onClick={deleteQuestionImage}
        ></i>
      </div>
    );
  } else {
    return <div></div>;
  }
};

const MCQ = (props) => {
  const [state, setState] = useContext(MyContext);
  const [correctOption, setCorrectOption] = useState("");
  const [alphabets, setAlphabets] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ]);
  const [statement, setStatement] = useState(
    state.mcqs[props.sectionIndex].questions[props.questionIndex].statement ==
      null
      ? ""
      : state.mcqs[props.sectionIndex].questions[props.questionIndex].statement
  );
  const [editing_statement, setEditingStatement] = useState(
    statement == null ? true : false
  );
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState(
    state.mcqs[props.sectionIndex].questions[props.questionIndex].link.url ==
      null
      ? ""
      : state.mcqs[props.sectionIndex].questions[props.questionIndex].link.url
  );
  const [linkText, setLinkText] = useState(
    state.mcqs[props.sectionIndex].questions[props.questionIndex].link.text ==
      null
      ? ""
      : state.mcqs[props.sectionIndex].questions[props.questionIndex].link.text
  );
  const fileUploadForm = useRef();

  useEffect(() => {
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].statement =
        statement;
      obj.mcqs = copy;
      return obj;
    });
  }, [editing_statement]);

  const optionsArray = [];
  state.mcqs[props.sectionIndex].questions[props.questionIndex].options.map(
    (option, index) => {
      if (option.optionStatement != null)
        optionsArray.push({
          value: index,
          label: alphabets[index],
          correct: option.correct,
        });
    }
  );

  function setCorrectOptionInState(e) {
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[
        e.target.value
      ].correct = true;
      if (
        copy[props.sectionIndex].questions[props.questionIndex].type == "MCQ-S"
      ) {
        // set all other previously true-set options to false
        for (
          let i = 0;
          i <
          copy[props.sectionIndex].questions[props.questionIndex].options
            .length;
          i++
        ) {
          if (i != e.target.value)
            copy[props.sectionIndex].questions[props.questionIndex].options[
              i
            ].correct = false;
        }
      }
      obj.mcqs = copy;
      return obj;
    });
  }

  function handleCheckboxChange(e) {
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[
        e.target.value
      ].correct =
        !copy[props.sectionIndex].questions[props.questionIndex].options[
          e.target.value
        ].correct;
      obj.mcqs = copy;
      return obj;
    });
  }

  function moveQuestionDown() {
    if (
      props.questionIndex <
      state.mcqs[props.sectionIndex].questions.length - 1
    ) {
      setState((cur) => {
        let obj = { ...cur };
        let copy = obj.mcqs.slice();
        // moving elements in the questions array
        const nextElement =
          copy[props.sectionIndex].questions[props.questionIndex + 1];
        copy[props.sectionIndex].questions[props.questionIndex + 1] =
          copy[props.sectionIndex].questions[props.questionIndex];
        copy[props.sectionIndex].questions[props.questionIndex] = nextElement;

        // fixing their questionOrder attributes
        copy[props.sectionIndex].questions[props.questionIndex].questionOrder =
          props.questionIndex;
        copy[props.sectionIndex].questions[
          props.questionIndex + 1
        ].questionOrder = props.questionIndex + 1;
        obj.mcqs = copy;
        return obj;
      });
    }
  }

  function moveQuestionUp() {
    if (props.questionIndex > 0) {
      setState((cur) => {
        let obj = { ...cur };
        let copy = obj.mcqs.slice();
        // moving the question objects{} in the questions array
        const prevElement =
          copy[props.sectionIndex].questions[props.questionIndex - 1];
        copy[props.sectionIndex].questions[props.questionIndex - 1] =
          copy[props.sectionIndex].questions[props.questionIndex];
        copy[props.sectionIndex].questions[props.questionIndex] = prevElement;

        // fixing their questionOrder attributes
        copy[props.sectionIndex].questions[props.questionIndex].questionOrder =
          props.questionIndex;
        copy[props.sectionIndex].questions[
          props.questionIndex - 1
        ].questionOrder = props.questionIndex - 1;
        obj.mcqs = copy;
        return obj;
      });
    }
  }

  function fixQuestionOrdering(copy) {
    for (let i = 0; i < copy[props.sectionIndex].questions.length; i++) {
      copy[props.sectionIndex].questions[i].questionOrder = i;
    }
    return copy;
  }

  function uploadFile(e) {
    let data = new FormData(ReactDOM.findDOMNode(fileUploadForm.current));
    setUploading(true);
    fetch("/upload", {
      method: "POST",
      body: data,
    }).then((response) => {
      if (response.status == 200) {
        response.json().then((finalResponse) => {
          if (finalResponse.status == true) {
            setState((cur) => {
              let obj = { ...cur };
              let copy = obj.mcqs.slice();
              copy[props.sectionIndex].questions[props.questionIndex].image =
                finalResponse.filename;
              obj.mcqs = copy;
              return obj;
            });
            setUploading(false);
          }
        });
      }
    });
  }

  function deleteQuestion(e) {
    setState((cur) => {
      let obj = { ...cur };
      let mcqs_copy = obj.mcqs.slice();
      let passages_copy = obj.passages.slice();

      // if this question was associated with a comprehension passage, and was the only question of the passage, then we delete the passage as well:
      let found = false;
      const passageIndex =
        mcqs_copy[props.sectionIndex].questions[props.questionIndex].passage;
      mcqs_copy[props.sectionIndex].questions.forEach(
        (question, questionIndex) => {
          // if any question (other than this one that we are about to delete) is found such that it has the same passage, we set found to true and don't delete the passage
          if (
            question.passage == passageIndex &&
            questionIndex != props.questionIndex
          )
            found = true;
        }
      );
      if (!found) passages_copy.splice(passageIndex, 1);

      // deleting the question and ensure continunity of questionOrder attribute
      mcqs_copy[props.sectionIndex].questions.splice(props.questionIndex, 1);
      mcqs_copy = fixQuestionOrdering(mcqs_copy);

      obj.mcqs = mcqs_copy;
      obj.passages = passages_copy;
      return obj;
    });
  }

  function copyQuestion(e) {
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions.splice(props.questionIndex, 0, {
        ...cur[props.sectionIndex].questions[props.questionIndex],
      });
      copy = fixQuestionOrdering(copy);
      obj.mcqs = copy;
      return obj;
    });
  }

  function toggleLinkModal(e) {
    setLinkModal((cur) => {
      return !cur;
    });
  }

  function addLink(e) {
    e.preventDefault();
    e.stopPropagation();

    toggleLinkModal();
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].link.url =
        linkUrl;
      copy[props.sectionIndex].questions[props.questionIndex].link.text =
        linkText;
      obj.mcqs = copy;
      return obj;
    });
  }

  return (
    <div>
      {linkModal == true ? (
        <div
          id="modal"
          className="absolute z-10 w-1/2 bg-white left-1/4 translate-x-2/4 shadow-xl py-2 px-2"
        >
          <i
            className="fas fa-times float-right text-gray-800 cursor-pointer"
            onClick={toggleLinkModal}
          ></i>
          <div className="py-6 px-8">
            <h3 className="text-xl">Add Link</h3>
            <form onSubmit={addLink}>
              <label>URL: </label>
              <input
                type="url"
                name="url"
                plaeholder="e.g. https://www.google.com"
                className="mt-2 px-4 py-2 border-2 border-r-0 border-gray-100"
                value={linkUrl}
                onChange={(e) => {
                  setLinkUrl(e.target.value);
                }}
                maxLength="2000"
              ></input>
              <label>Text: </label>
              <input
                type="text"
                name="text"
                plaeholder="e.g. Click Here"
                className="px-4 py-2 border-2 border-r-0 border-gray-100"
                value={linkText}
                onChange={(e) => {
                  setLinkText(e.target.value);
                }}
                maxLength="255"
              ></input>
              <input
                type="submit"
                className="bg-green-500 text-white px-4 py-2"
                value="Add Link"
              ></input>
            </form>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="bg-white h-auto w-4/5 mx-auto mt-4 shadow-xl">
        <div className="bg-gray-200 w-full text-black px-4 py-0 mr-4 grid grid-cols-4 justify-between items-center">
          <p>Question {props.questionIndex + 1}</p>
          <div className="col-start-2 col-span-3 justify-self-end">
            <i
              className="far fa-copy cursor-pointer text-xl p-2 text-gray-500 hover:bg-green-500 hover:text-gray-700 active:bg-opacity-0 mr-2"
              onClick={copyQuestion}
            ></i>
            <i
              className="fas fa-arrow-up cursor-pointer text-xl p-2 text-gray-500 hover:bg-green-500 hover:text-gray-700 active:bg-opacity-0 mr-2"
              onClick={moveQuestionUp}
            ></i>
            <i
              className="fas fa-arrow-down cursor-pointer text-xl p-2 text-gray-500 hover:bg-green-500 hover:text-gray-700 active:bg-opacity-0"
              onClick={moveQuestionDown}
            ></i>
            <i
              className="fas fa-trash-alt cursor-pointer text-xl p-2 text-gray-500 hover:bg-green-500 hover:text-gray-700 active:bg-opacity-0"
              onClick={deleteQuestion}
            ></i>
          </div>
        </div>
        <div className="py-4 px-8">
          <div>
            <ErrorDisplay error={error}></ErrorDisplay>
            <div className="grid grid-cols-10 gap-4">
              {editing_statement ? (
                <textarea
                  placeholder="Enter Question Statement"
                  value={statement}
                  onChange={(e) => {
                    setStatement(e.target.value);
                  }}
                  minLength="1"
                  maxLength="65535"
                  className="col-span-7 px-4 py-2 border-gray-400 border-2"
                  autoFocus
                ></textarea>
              ) : (
                <p className="col-span-7 border py-2 px-3">{statement}</p>
              )}
              <div
                className="border-green-500 border-4 cursor-pointer text-3xl col-span-1 h-full grid grid-cols-1 py-6 px-4"
                onClick={(e) => {
                  setEditingStatement((cur) => {
                    return !cur;
                  });
                }}
                style={{ flexBasis: "10%" }}
              >
                <i
                  className={
                    editing_statement
                      ? "fa-save fas text-green-500 col-span-1 justify-self-center self-center"
                      : "fa-pen fas text-green-500 col-span-1 justify-self-center self-center"
                  }
                ></i>
              </div>

              <form
                method="POST"
                encType="multipart/form-data"
                action="/upload"
                ref={fileUploadForm}
                className="col-span-1 relative cursor-pointer"
                style={{ flexBasis: "10%" }}
                title="Upload Image or Audio"
              >
                <div className="absolute text-3xl w-full h-full grid grid-cols-1 border-gray-300 border-4 cursor-pointer">
                  {uploading == false ? (
                    <i className="far fa-file col-span-1 justify-self-center self-center text-gray-300"></i>
                  ) : (
                    <i className="fas fa-spinner text-gray-300 justify-self-center self-center col-span-1 animate-spin"></i>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, audio/mpeg"
                  name="file"
                  onChange={uploadFile}
                  className="opacity-0 w-full h-full cursor-pointer"
                ></input>
              </form>
              <div
                className="border-gray-300 border-4 cursor-pointer text-3xl col-span-1 h-full grid grid-cols-1 py-6 px-4"
                onClick={toggleLinkModal}
                style={{ flexBasis: "10%" }}
              >
                <i className="fas fa-link text-gray-300 col-span-1 justify-self-center self-center"></i>
              </div>
            </div>
          </div>
          {state.mcqs[props.sectionIndex].questions[props.questionIndex].link
            .url == null ? (
            <div className="hidden"></div>
          ) : (
            <a
              href={
                state.mcqs[props.sectionIndex].questions[props.questionIndex]
                  .link.url
              }
              target="_blank"
              className="text-blue-700 underline ml-8 hover:text-blue-500"
            >
              {state.mcqs[props.sectionIndex].questions[props.questionIndex]
                .link.text == ""
                ? state.mcqs[props.sectionIndex].questions[props.questionIndex]
                    .link.url
                : state.mcqs[props.sectionIndex].questions[props.questionIndex]
                    .link.text}
            </a>
          )}
          {state.mcqs[props.sectionIndex].questions[props.questionIndex]
            .image == null ? (
            <div className="hidden"></div>
          ) : (
            <ImageOrAudio
              sectionIndex={props.sectionIndex}
              questionIndex={props.questionIndex}
            ></ImageOrAudio>
          )}
          <ul className="mt-4 ml-10">
            {state.mcqs[props.sectionIndex].questions[
              props.questionIndex
            ].options.map((option, index) => (
              <Option
                opt={option}
                questionIndex={props.questionIndex}
                optionIndex={index}
                sectionIndex={props.sectionIndex}
                key={index}
                type={props.type}
              />
            ))}
          </ul>
          <hr className="border-2 mb-4 mt-10"></hr>
          <div className="grid grid-cols-5">
            {props.type == "MCQ-S" ? (
              <Select
                options={optionsArray}
                value={correctOption}
                onChange={setCorrectOptionInState}
                label="Select Correct Option:"
                className="col-span-1"
              ></Select>
            ) : (
              <div className="col-span-1">
                <p>Select correct options:</p>
                <SelectMultiple
                  sectionIndex={props.sectionIndex}
                  questionIndex={props.questionIndex}
                  options={
                    state.mcqs[props.sectionIndex].questions[
                      props.questionIndex
                    ].options
                  }
                  value={correctOption}
                  onCheckboxChange={handleCheckboxChange}
                  key={props.questionIndex}
                ></SelectMultiple>
              </div>
            )}
            <div className="col-start-2 col-span-1 justify-self-end">
              <label>Marks: </label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={
                  state.mcqs[props.sectionIndex].questions[props.questionIndex]
                    .marks
                }
                onChange={(e) => {
                  setState((cur) => {
                    let obj = { ...cur };
                    let copy = obj.mcqs.slice();
                    copy[props.sectionIndex].questions[
                      props.questionIndex
                    ].marks = e.target.value;
                    obj.mcqs = copy;
                    return obj;
                  });
                }}
                className="px-3 py-2 border-2 border-r-0 border-gray-100"
              ></input>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PassageQuestionSelector = (props) => {
  const [state, setState] = useContext(MyContext);

  return (
    <ul className="ml-2">
      {state.mcqs[props.sectionIndex].questions.map(
        (question, questionIndex) => {
          return (
            <li>
              <input
                type="checkbox"
                value={questionIndex}
                name={"questionSelector" + props.sectionIndex}
                checked={
                  state.mcqs[props.sectionIndex].questions[questionIndex]
                    .passage == props.passageIndex
                }
                onChange={props.onCheckboxChange}
              ></input>
              <label htmlFor={"questionSelector" + props.sectionIndex}>
                {" "}
                {"Q" + (parseInt(questionIndex) + 1)}
              </label>
            </li>
          );
        }
      )}
    </ul>
  );
};

const Passage = (props) => {
  const [state, setState] = useContext(MyContext);

  const deletePassage = () => {
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions.forEach((question, index) => {
        if (question.passage == props.passageIndex) {
          copy[props.sectionIndex].questions[index].passage = null;
        }
      });
      obj.mcqs = copy;
      return obj;
    });

    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.passages.slice();
      copy.splice(props.passageIndex, 1);
      obj.passages = copy;
      return obj;
    });
  };

  function handleCheckboxChange(e) {
    setState((cur) => {
      let obj = { ...cur };
      let mcqs_copy = obj.mcqs.slice();
      let passages_copy = obj.passages.slice();
      // if this question has no passage or has a different passage, then assign the current passage to it
      if (
        mcqs_copy[props.sectionIndex].questions[e.target.value].passage ===
          null ||
        mcqs_copy[props.sectionIndex].questions[e.target.value].passage !=
          props.passageIndex
      )
        mcqs_copy[props.sectionIndex].questions[e.target.value].passage =
          props.passageIndex;
      // if this question already had this passage, then assign its passage to null because checkbox has been unchecked
      else
        mcqs_copy[props.sectionIndex].questions[e.target.value].passage = null;

      // checking to see if passage has no questions associated with it, in which case it will be deleted
      let found = false;
      mcqs_copy[props.sectionIndex].questions.forEach((question) => {
        if (question.passage == props.passageIndex) found = true;
      });

      // if no such question is found, delete the passage
      if (!found) {
        passages_copy.splice(props.passageIndex, 1);
      }
      // done
      console.log(passages_copy);
      obj.mcqs = mcqs_copy;
      obj.passages = passages_copy;
      return obj;
    });
  }

  return (
    <div>
      <div className="bg-white h-auto w-4/5 mx-auto mt-4 shadow-xl">
        <div className="bg-gray-500 w-full text-white px-4 py-0 mr-4 grid grid-cols-4 justify-between items-center">
          <p>Comprehension Passage {props.passageIndex + 1}</p>
          <div className="col-start-2 col-span-3 justify-self-end">
            <i
              className="fas fa-trash-alt cursor-pointer text-xl p-2 text-white hover:bg-white hover:text-gray-500"
              onClick={deletePassage}
            ></i>
          </div>
        </div>
        <div className="py-4 px-8">
          <textarea
            placeholder="Enter Comprehension Passage Text"
            value={
              state.passages[props.passageIndex].statement == null
                ? ""
                : state.passages[props.passageIndex].statement
            }
            onChange={(e) => {
              setState((cur) => {
                let obj = { ...cur };
                let copy = obj.passages.slice();
                copy[props.passageIndex].statement = e.target.value;
                obj.passages = copy;
                return obj;
              });
            }}
            minLength="1"
            maxLength="65535"
            className="w-full px-4 py-2 border-gray-400 border-2"
            autoFocus
          ></textarea>
          <hr className="border-2 mb-4 mt-10"></hr>
          <h3>Select all the questions that are about this passage:</h3>
          <PassageQuestionSelector
            passageIndex={props.passageIndex}
            sectionIndex={props.sectionIndex}
            onCheckboxChange={handleCheckboxChange}
          ></PassageQuestionSelector>
        </div>
      </div>
    </div>
  );
};

const Section = (props) => {
  const [state, setState] = useContext(MyContext);
  const [autoPoolCount, setAutoPoolCount] = useState(
    state.mcqs[props.sectionIndex].poolCount ==
      state.mcqs[props.sectionIndex].questions.length
      ? true
      : false
  );

  useEffect(() => {
    if (
      autoPoolCount &&
      state.mcqs[props.sectionIndex].poolCount !=
        state.mcqs[props.sectionIndex].questions.length
    ) {
      setState((cur) => {
        let obj = { ...cur };
        let copy = obj.mcqs.slice();
        copy[props.sectionIndex].poolCount =
          state.mcqs[props.sectionIndex].questions.length;
        obj.mcqs = copy;
        return obj;
      });
    }
  }, [autoPoolCount]);

  return (
    <div>
      <SectionHeader
        sectionTitle={props.sectionTitle}
        sectionNumber={props.sectionNumber}
        sectionIndex={props.sectionNumber - 1}
        totalSections={props.totalSections}
        key={props.sectionNumber + "a"}
        autoPoolCount={autoPoolCount}
        setAutoPoolCount={setAutoPoolCount}
      />
      <div>
        {state.mcqs[props.sectionIndex].questions.map((question, index) => {
          return question.passage == null ? (
            <MCQ
              sectionIndex={props.sectionIndex}
              questionIndex={index}
              type={question.type}
              key={index}
            ></MCQ>
          ) : (
            <div>
              <Passage
                passageIndex={question.passage}
                sectionIndex={props.sectionIndex}
                key={index + (question.passage + 1) * 100}
              ></Passage>
              <MCQ
                sectionIndex={props.sectionIndex}
                questionIndex={index}
                type={question.type}
                key={index}
              ></MCQ>
            </div>
          );
        })}
      </div>
      <SectionHeader
        sectionTitle={props.sectionTitle}
        sectionNumber={props.sectionNumber}
        sectionIndex={props.sectionNumber - 1}
        totalSections={props.totalSections}
        key={props.sectionNumber + "b"}
        autoPoolCount={autoPoolCount}
        setAutoPoolCount={setAutoPoolCount}
      />
    </div>
  );
};

const SectionHeader = (props) => {
  const [state, setState] = useContext(MyContext);
  const [time, setTime] = useState(state.mcqs[props.sectionIndex].time);
  const [timeOrNot, setTimeOrNot] = useState(
    state.mcqs[props.sectionIndex].time == 0 ? false : true
  );
  const toggle = React.useRef();
  const autoPoolCount = props.autoPoolCount;
  const setAutoPoolCount = props.setAutoPoolCount;

  useEffect(() => {
    if (autoPoolCount) {
      if (
        state.mcqs[props.sectionIndex].poolCount !=
        state.mcqs[props.sectionIndex].questions.length
      ) {
        setState((cur) => {
          let obj = { ...cur };
          let copy = obj.mcqs.slice();
          copy[props.sectionIndex].poolCount =
            state.mcqs[props.sectionIndex].questions.length;
          obj.mcqs = copy;
          return obj;
        });
      }
    }
  }, [state.mcqs]);

  const closeDropdown = () => {
    const el = ReactDOM.findDOMNode(toggle.current);
    el.classList.toggle("hidden");
  };

  const addNewMCQ = (type) => {
    // NOTE: If you make any change to the MCQ State object here, remember to also make it in addNewComprehensionPassage
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      let question_order = copy[props.sectionIndex].questions.push({
        passage: null,
        statement: null,
        questionOrder: null,
        type: type,
        image: null,
        marks: 1,
        link: { url: null, text: null },
        options: [{ optionStatement: null, correct: false }],
        correctOptionIndex: null,
      });
      copy[props.sectionIndex].questions[
        copy[props.sectionIndex].questions.length - 1
      ].questionOrder = question_order;
      obj.mcqs = copy;
      return obj;
    });
  };

  const addNewMCQSingle = () => {
    closeDropdown();
    addNewMCQ("MCQ-S");
  };

  const addNewMCQMultiple = () => {
    closeDropdown();
    addNewMCQ("MCQ-M");
  };

  const addNewComprehensionPassage = () => {
    let index_of_newly_created_passage;

    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.passages.slice();
      index_of_newly_created_passage = copy.push({
        id: null,
        statement: null,
        place_after_question:
          state.mcqs[props.sectionIndex].questions.length - 1,
        //which question to place this passage after. This is used to inform the PassageQuestionSelector which question numbers to show. If the passage was added when the quiz already had 4 questions, then the passage can be assigned to questions 5 onwards.
      });
      index_of_newly_created_passage--;
      console.log(
        "index_of_newly_created_passage2:",
        index_of_newly_created_passage
      );
      obj.passages = copy;

      copy = obj.mcqs.slice();

      // now creating a new MCQ-S
      let question_index = copy[props.sectionIndex].questions.push({
        passage: index_of_newly_created_passage,
        statement: null,
        questionOrder: null,
        type: "MCQ-S",
        image: null,
        marks: 1,
        link: { url: null, text: null },
        options: [{ optionStatement: null, correct: false }],
        correctOptionIndex: null,
      });
      question_index--;
      copy[props.sectionIndex].questions[
        copy[props.sectionIndex].questions.length - 1
      ].questionOrder = question_index;

      obj.mcqs = copy;
      return obj;
    });
  };

  const deleteSection = () => {
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy.splice(props.sectionIndex, 1);
      obj.mcqs = copy;
      return obj;
    });
  };

  return (
    <div className="toolbox w-4/5 text-base mt-4 mx-auto justify-start gap-x-8 shadow-xl bg-white">
      <div className="bg-green-500 text-white px-4 flex justify-between items-center">
        <h1 className="text-lg">
          Section {props.sectionNumber} of {props.totalSections}:{" "}
          {props.sectionTitle}
        </h1>
        <i
          className="fas fa-trash-alt text-xl p-2 cursor-pointer hover:bg-white hover:text-green-500 hover:gray-100 active:bg-opacity-0"
          onClick={deleteSection}
        ></i>
      </div>

      <div className="py-4 px-8">
        <div className="cursor-pointer relative w-max flex">
          <div
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4"
            id="add_question"
            onClick={(e) => {
              const el = ReactDOM.findDOMNode(toggle.current);
              el.classList.toggle("hidden");
            }}
          >
            <i className="fas fa-plus"></i> Add Question
          </div>
          <ul
            id="types_of_questions"
            ref={toggle}
            className="hidden bg-white text-gray-800 absolute w-max top-18 left-0 border-gray-200 border-2"
          >
            <li
              onClick={addNewMCQSingle}
              className="py-2 px-4 hover:bg-gray-200"
            >
              MCQ Single Select
            </li>
            <li
              onClick={addNewMCQMultiple}
              className="py-2 px-4 hover:bg-gray-200"
            >
              MCQ Multiple Select
            </li>
            {/* <li className="py-2 px-4 hover:bg-gray-200">Fill in the Blank</li> */}
          </ul>
          <div
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-4 text-center border-l border-white"
            id="add_passage"
            onClick={addNewComprehensionPassage}
          >
            <i className="fas fa-plus"></i> Add Comprehension Passage
          </div>
        </div>

        <div className="flex gap-x-2 w-full mt-4 mb-2">
          <input
            type="checkbox"
            name="autoPoolCount"
            checked={autoPoolCount}
            onChange={(e) => {
              console.log("changing autoPoolCount");
              setAutoPoolCount(e.target.checked);
            }}
          ></input>
          <label className="self-center">Show all questions to student</label>

          {!autoPoolCount ? (
            <div className="">
              <label className="px-4 py-3">
                No. of Questions to be Randomly Selected:{" "}
              </label>
              <input
                type="number"
                className="h-12 w-16 bg-gray-100 text-center"
                min="0"
                max={state.mcqs[props.sectionIndex].questions.length}
                name="pool_count"
                value={state.mcqs[props.sectionIndex].poolCount}
                onChange={(e) => {
                  setState((cur) => {
                    let obj = { ...cur };
                    let copy = obj.mcqs.slice();
                    copy[props.sectionIndex].poolCount = e.target.value;
                    obj.mcqs = copy;
                    return obj;
                  });
                }}
              ></input>
            </div>
          ) : (
            <div></div>
          )}
          <div className="flex gap-4 ml-4">
            <div className="self-center">
              <input
                type="checkbox"
                checked={timeOrNot}
                onChange={(e) => {
                  setTimeOrNot(e.target.checked);
                }}
              ></input>
              <label> Time Limit</label>
            </div>
            {timeOrNot ? (
              <div>
                <label className="px-4 py-3">Time Limit (minutes): </label>
                <input
                  type="number"
                  className="h-12 w-16 bg-gray-100 text-center"
                  min="0"
                  name="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setState((cur) => {
                      let obj = { ...cur };
                      let copy = obj.mcqs.slice();
                      copy[props.sectionIndex].time = e.target.value;
                      obj.mcqs = copy;
                      return obj;
                    });
                  }}
                ></input>
              </div>
            ) : (
              <div className="hidden"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Main = () => {
  const [state, setState] = useContext(MyContext);
  const [sectionInput, setSectionInput] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizId, setQuizId] = useState(globalQuizId);
  const [error, setError] = useState("");
  const [errorColor, setErrorColor] = useState("text-red-600");
  const [errorIcon, setErrorIcon] = useState("fa-exclamation-triangle");
  const [savedStatus, setSavedStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploading2, setUploading2] = useState(false);
  let fileUploadForm = useRef();

  // If we are editing an already present quiz, get the quiz state from the server
  useEffect(async () => {
    if (globalQuizId != null) {
      let state, title, passages_object;
      const response = await fetch("/quiz/state/" + globalQuizId.toString());
      const finalResponse = await response.json();
      if (finalResponse.success == true) {
        state = finalResponse.stateObject;
        title = finalResponse.quizTitle;
        passages_object = finalResponse.passages_object;
      } else {
        state = [];
      }
      setState({ mcqs: state, passages: passages_object });
      console.log("state.mcqs: ", state, "\npassages: ", passages_object);
      setQuizTitle(title);
    }
  }, []);

  const addSection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setState((cur) => {
      let obj = { ...cur };
      let copy = obj.mcqs.slice();
      copy.push({
        sectionTitle: sectionInput,
        sectionOrder: null,
        poolCount: 0,
        time: 0,
        questions: [],
      });
      copy[copy.length - 1].sectionOrder = copy.length - 1;
      obj.mcqs = copy;
      return obj;
    });
  };

  function saveDataInDatabase() {
    // data validation before saving
    setUploading2(true);
    setError("");
    console.log("Saving: ", state.mcqs);
    let anyErrors = false;

    if (quizTitle == "") {
      setError("Please enter a quiz title.");
      anyErrors = true;
    } else {
      if (state.mcqs.length == 0) {
        setError("Please add at least one section.");
        anyErrors = true;
      } else {
        state.mcqs.forEach((section) => {
          if (section.questions.length == 0) {
            setError(
              "Empty sections cannot exist. Every section must have at least one question."
            );
            anyErrors = true;
          } else if (section.poolCount == 0) {
            setError(
              "You set section " +
                section.sectionTitle +
                "'s pool count to 0. Please pick a number greater than 0 otherwise this section will show up empty to the students."
            );
            anyErrors = true;
          } else {
            section.questions.forEach((question) => {
              if (question.statement == null || question.statement == "") {
                setError("Please do not leave a question statement empty.");
                anyErrors = true;
              } else if (
                (question.options.length == 1 &&
                  question.options[0].optionStatement == null) ||
                (question.options.length == 2 && question.options[1] == null)
              ) {
                setError("Every question must have at least 2 options.");
                anyErrors = true;
              }
              // add a check for no correct option selected
            });
          }
        });
      }
    }

    if (!anyErrors) {
      fetch("/quiz/save", {
        method: "POST",
        mode: "same-origin",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizTitle: quizTitle,
          quizId: quizId,
          mcqs: state.mcqs,
          passages: state.passages,
        }),
      })
        .then((response) => {
          console.log(response);
          response.json().then((finalResponse) => {
            console.log("finalResponse.status: ", finalResponse.status);
            if (finalResponse.status == true) {
              setSavedStatus(
                <i className="fas fa-check-circle text-green-400 text-xl"></i>
              );
              setErrorColor("text-green-400");
              setErrorIcon("fa-check-circle");
              setQuizId(finalResponse.quizId);
            } else {
              setSavedStatus(
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              );
              setErrorColor("text-red-600");
              setErrorIcon("fa-exclamation-triangle");
            }
            setError(finalResponse.message);
            setUploading2(false);
            setTimeout(() => {
              setSavedStatus("");
            }, 6000);
          });
        })
        .catch((err) => {
          console.log(err);
          setSavedStatus(
            <i className="fas fa-exclamation-triangle text-red-600"></i>
          );
          setErrorColor("text-red-600");
          setErrorIcon("fa-exclamation-triangle");
        });
    } else {
      setSavedStatus(
        <i className="fas fa-exclamation-triangle text-red-600"></i>
      );
      setErrorColor("text-red-600");
      setErrorIcon("fa-exclamation-triangle");
      setUploading2(false);
      setTimeout(() => {
        setSavedStatus("");
      }, 10000);
    }
  }

  function downloadCSV(e) {
    fetch("/state-to-csv", {
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([state.mcqs, state.passages]),
    })
      .then((response) => {
        response.json().then((finalResponse) => {
          console.log(finalResponse);
          if (finalResponse.status == true) {
            window.location = finalResponse.file_link;
          } else console.log("Error");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function uploadCSV(e) {
    let data = new FormData(ReactDOM.findDOMNode(fileUploadForm.current));
    setUploading(true);
    fetch("/upload/quiz/csv", {
      method: "POST",
      body: data,
    })
      .then((response) => {
        setUploading(false);
        if (response.status == 200) {
          response.json().then((finalResponse) => {
            if (finalResponse.status == true) {
              console.log(finalResponse);
              setState((cur) => {
                let obj = { ...cur };
                obj.mcqs = finalResponse.state;
                obj.passages = finalResponse.passages;
                return obj;
              });
              console.log(finalResponse.state);
            }
          });
        } else if (response.status == 401) {
          setErrorColor("text-red-600");
          setErrorIcon("fa-exclamation-triangle");
          setError("CSV Format is wrong. Please contact IT Team.");
          setTimeout(() => {
            setError("");
          }, 10000);
        } else {
          console.log("error uploading csv file");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <div className="toolbox w-4/5 text-base mt-24 mx-auto p-8 shadow-xl">
        <ErrorDisplay
          error={error}
          errorColor={errorColor}
          errorIcon={errorIcon}
        ></ErrorDisplay>
        <div className="flex items-center">
          <form onSubmit={addSection} className="flex justify-start">
            <input
              type="text"
              placeholder="Section Title"
              name="sectionTitle"
              value={sectionInput}
              onChange={(e) => setSectionInput(e.target.value)}
              className="px-4 w-72"
            ></input>
            <button
              className="bg-green-400 hover:bg-green-500 text-white px-8 py-4 active:shadow-inner cursor-pointer"
              id="add_section"
            >
              <i className="fas fa-plus"></i> Add New Section
            </button>
          </form>
          <input
            type="text"
            placeholder="Quiz Title"
            name="quizTitle"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="ml-8 px-4 py-4 w-72"
            autoFocus
          ></input>
          <button
            type="button"
            onClick={saveDataInDatabase}
            className="bg-green-400 hover:bg-green-500 text-white px-8 py-4 active:shadow-inner cursor-pointer"
          >
            <i className="fas fa-save"></i> Save Quiz
          </button>
          <p>
            {uploading2 == true ? (
              <i className="fas fa-spinner animate-spin self-center"></i>
            ) : (
              <i className="hidden"></i>
            )}
            {savedStatus}
          </p>
        </div>
        <div className="flex py-2">
          <form
            method="POST"
            encType="multipart/form-data"
            action="/upload"
            ref={fileUploadForm}
          >
            <label
              htmlFor="csv-upload"
              className="inline-block px-4 py-4 cursor-pointer bg-gray-400 hover:bg-gray-500 text-white"
            >
              <i className="fas fa-file-upload"></i> Upload from CSV File{" "}
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                name="file"
                onChange={uploadCSV}
                className="hidden"
              ></input>{" "}
              {uploading == true ? (
                <i className="fas fa-spinner animate-spin self-center"></i>
              ) : (
                <div className="hidden"></div>
              )}
            </label>
          </form>
          <button
            type="button"
            onClick={downloadCSV}
            className="inline-block px-4 py-4 cursor-pointer bg-gray-400 hover:bg-gray-500 text-white border-l-2"
          >
            <i className="fas fa-file-download"></i> Download as CSV File
          </button>
        </div>
      </div>
      {state.mcqs.map((section, index) => (
        <Section
          sectionTitle={section.sectionTitle}
          sectionNumber={index + 1}
          sectionIndex={index}
          totalSections={state.mcqs.length}
          key={index}
        />
      ))}
    </div>
  );
};

const App = () => {
  return (
    <ContextProvider>
      <Main />
    </ContextProvider>
  );
};

ReactDOM.render(<App />, demoDiv);
