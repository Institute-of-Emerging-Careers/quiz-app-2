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
  const [mcqs, setMCQs] = useState([]);

  return <MyContext.Provider value={[mcqs, setMCQs]}>{props.children}</MyContext.Provider>;
};

const ErrorDisplay = (props) => {
  return props.error == "" ? (
    <p></p>
  ) : (
    <p className="text-sm text-red-600 leading-8 pb-2">
      <i className="fas fa-exclamation-triangle"></i> {props.error}
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
      <select onChange={props.onChange} value={correct} className="border bg-white px-3 py-2 outline-none">
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
  const [mcqs, setMCQs] = useContext(MyContext);
  const [alphabets, setAlphabets] = useState(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]);

  return (
    <ul className="ml-2">
      {props.options.map((option, index) => {
        return option.optionStatement != null ? (
          <li>
            <input type="checkbox" value={index} name={props.name} checked={props.options[index].correct} onChange={props.onCheckboxChange}></input>
            <label htmlFor={props.name}> {alphabets[index]}</label>
          </li>
        ) : (
          <span></span>
        );
      })}
    </ul>
  );
};

const Option = (props) => {
  const [mcqs, setMCQs] = useContext(MyContext);
  const [optionStatement, setOptionStatement] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  let fileUploadForm = useRef();
  const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  const setOption = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (mcqs[props.sectionIndex].questions[props.questionIndex].options.length <= alphabets.length) {
      setMCQs((cur) => {
        let copy = cur.slice();
        // change state so that a question also stores the index of its correct option

        // if this is a new option being set, do this
        if (copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].optionStatement == null) {
          copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex] = { optionStatement: optionStatement, correct: false, optionOrder: props.optionIndex, image: null, edit: false };
          copy[props.sectionIndex].questions[props.questionIndex].options.push({ optionStatement: null, correct: false, optionOrder: props.optionIndex + 1, image: null, edit: true });
        } else if (copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].edit == true) {
          // if this is an old option being edited
          copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].optionStatement = optionStatement;
          copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].edit = false;
        }
        return copy;
      });
    } else {
      setError("Cannot add more options. Alphabets exhausted.");
    }
  };

  function toggleOptionEditStatus() {
    setMCQs((cur) => {
      let copy = cur.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].edit = !copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].edit;
      return copy;
    });
  }

  function fixOptionOrdering(copy) {
    for (let i = 0; i < copy[props.sectionIndex].questions[props.questionIndex].options.length; i++) {
      copy[props.sectionIndex].questions[props.questionIndex].options[i].optionOrder = i;
    }
    return copy;
  }

  function deleteOption() {
    setMCQs((cur) => {
      let copy = cur.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options.splice(props.optionIndex, 1);
      copy = fixOptionOrdering(copy);
      return copy;
    });
  }

  function uploadImage(e) {
    let data = new FormData(ReactDOM.findDOMNode(fileUploadForm.current));
    setUploading(true);
    // data.append("file", e.target.files[0]);
    fetch("/upload", {
      method: "POST",
      body: data,
    }).then((response) => {
      if (response.status == 200) {
        response.json().then((finalResponse) => {
          console.log(finalResponse);
          if (finalResponse.status == true) {
            setMCQs((cur) => {
              let copy = cur.slice();
              // problem: somehow these indexes are all 0
              copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].image = finalResponse.filename;
              console.log(copy);
              return copy;
            });
            setUploading(false);
          }
        });
      }
    });
  }

  function deleteOptionImage(e) {
    setMCQs((cur) => {
      let copy = cur.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].image = null;
      return copy;
    });
  }

  let option = props.opt;
  return option.edit == false ? (
    <li className="py-1">
      <div className="flex gap-4">
        <input type={props.type == "MCQ-S" ? "radio" : "checkbox"} name="option" value={option.optionStatement} className="self-center"></input>
        <label className="self-center">
          {" "}
          <span className="text-gray-600 self-center">{alphabets[props.optionIndex]}:</span> {option.optionStatement}
        </label>
        <div className="flex gap-4 ml-4 self-center">
          <i className="fas fa-pen text-gray-300 hover:text-gray-500 cursor-pointer text-md self-center" onClick={toggleOptionEditStatus}></i>
          <i className="fas fa-trash text-gray-300 hover:text-gray-500 cursor-pointer text-md self-center" onClick={deleteOption}></i>

          <form method="POST" encType="multipart/form-data" action="/upload" ref={fileUploadForm} className="self-center">
            <label htmlFor={"image-upload-" + props.sectionIndex.toString() + props.optionIndex.toString() + props.questionIndex.toString()} className="relative cursor-pointer text-gray-300 hover:text-gray-500 max-h-4 text-xl">
              {uploading == false ? <i className="fas fa-image self-center"></i> : <i className="fas fa-spinner animate-spin self-center"></i>}
              <input id={"image-upload-" + props.sectionIndex.toString() + props.optionIndex.toString() + props.questionIndex.toString()} type="file" accept="image/png, image/jpeg" name="file" onChange={uploadImage} className="self-center hidden"></input>
            </label>
          </form>
        </div>
      </div>
      {mcqs[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].image == null ? (
        <div className="hidden"></div>
      ) : (
        <div className="relative w-max">
          <img src={mcqs[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].image} height="150px" className="mt-2 ml-8 max-h-64 w-auto self-center"></img>
          <i className="fas fa-trash p-2 absolute top-0 right-0 bg-white text-red-500 shadow-md cursor-pointer" onClick={deleteOptionImage}></i>
        </div>
      )}
    </li>
  ) : (
    <li>
      <ErrorDisplay error={error}></ErrorDisplay>
      <form onSubmit={setOption} className="mt-2">
        <input type="text" placeholder="Enter option" value={optionStatement} onChange={(e) => setOptionStatement(e.target.value)} className="px-4 py-1 border-2 border-r-0 border-gray-100" autoFocus></input>
        <button className="px-4 py-1 bg-gray-300 border-2 border-l-0 border-gray-100">Add New Option</button>
      </form>
    </li>
  );
};

const MCQ = (props) => {
  const [mcqs, setMCQs] = useContext(MyContext);
  const [correctOption, setCorrectOption] = useState("");
  const [alphabets, setAlphabets] = useState(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState(mcqs[props.sectionIndex].questions[props.questionIndex].link.url == null ? "" : mcqs[props.sectionIndex].questions[props.questionIndex].link.url);
  const [linkText, setLinkText] = useState(mcqs[props.sectionIndex].questions[props.questionIndex].link.text == null ? "" : mcqs[props.sectionIndex].questions[props.questionIndex].link.text);
  const fileUploadForm = useRef();

  const optionsArray = [];
  mcqs[props.sectionIndex].questions[props.questionIndex].options.map((option, index) => {
    if (option.optionStatement != null) optionsArray.push({ value: index, label: alphabets[index], correct: option.correct });
  });

  function setCorrectOptionInState(e) {
    setMCQs((cur) => {
      let copy = cur.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[e.target.value].correct = true;
      if (copy[props.sectionIndex].questions[props.questionIndex].type == "MCQ-S") {
        // set all other previously true-set options to false
        for (let i=0; i< copy[props.sectionIndex].questions[props.questionIndex].options.length; i++) {
          if (i!=e.target.value) copy[props.sectionIndex].questions[props.questionIndex].options[i].correct = false
        }
      }
      return copy;
    });
  }

  function handleCheckboxChange(e) {
    setMCQs((cur) => {
      let copy = cur.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[e.target.value].correct = !copy[props.sectionIndex].questions[props.questionIndex].options[e.target.value].correct;
      return copy;
    });
  }

  function moveQuestionDown() {
    if (props.questionIndex < mcqs[props.sectionIndex].questions.length - 1) {
      setMCQs((cur) => {
        let copy = cur.slice();
        // moving elements in the questions array
        const nextElement = copy[props.sectionIndex].questions[props.questionIndex + 1];
        copy[props.sectionIndex].questions[props.questionIndex + 1] = copy[props.sectionIndex].questions[props.questionIndex];
        copy[props.sectionIndex].questions[props.questionIndex] = nextElement;

        // fixing their questionOrder attributes
        copy[props.sectionIndex].questions[props.questionIndex].questionOrder = props.questionIndex;
        copy[props.sectionIndex].questions[props.questionIndex + 1].questionOrder = props.questionIndex + 1;
        return copy;
      });
    }
  }

  function moveQuestionUp() {
    if (props.questionIndex > 0) {
      setMCQs((cur) => {
        let copy = cur.slice();
        // moving the question objects{} in the questions array
        const prevElement = copy[props.sectionIndex].questions[props.questionIndex - 1];
        copy[props.sectionIndex].questions[props.questionIndex - 1] = copy[props.sectionIndex].questions[props.questionIndex];
        copy[props.sectionIndex].questions[props.questionIndex] = prevElement;

        // fixing their questionOrder attributes
        copy[props.sectionIndex].questions[props.questionIndex].questionOrder = props.questionIndex;
        copy[props.sectionIndex].questions[props.questionIndex - 1].questionOrder = props.questionIndex - 1;
        return copy;
      });
    }
  }

  function fixQuestionOrdering(copy) {
    for (let i = 0; i < copy[props.sectionIndex].questions.length; i++) {
      copy[props.sectionIndex].questions[i].questionOrder = i;
    }
    return copy;
  }

  function uploadImage(e) {
    let data = new FormData(ReactDOM.findDOMNode(fileUploadForm.current));
    setUploading(true);
    fetch("/upload", {
      method: "POST",
      body: data,
    }).then((response) => {
      if (response.status == 200) {
        response.json().then((finalResponse) => {
          if (finalResponse.status == true) {
            setMCQs((cur) => {
              let copy = cur.slice();
              copy[props.sectionIndex].questions[props.questionIndex].image = finalResponse.filename;
              return copy;
            });
            setUploading(false);
          }
        });
      }
    });
  }

  function deleteQuestion(e) {
    setMCQs((cur) => {
      let copy = cur.slice();
      copy[props.sectionIndex].questions.splice(props.questionIndex, 1);
      copy = fixQuestionOrdering(copy);
      return copy;
    });
  }

  function copyQuestion(e) {
    setMCQs((cur) => {
      let copy = cur.slice();
      copy[props.sectionIndex].questions.splice(props.questionIndex, 0, { ...cur[props.sectionIndex].questions[props.questionIndex] });
      copy = fixQuestionOrdering(copy);
      return copy;
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
    setMCQs((cur) => {
      let copy = cur.slice();
      copy[props.sectionIndex].questions[props.questionIndex].link.url = linkUrl;
      copy[props.sectionIndex].questions[props.questionIndex].link.text = linkText;
      return copy;
    });
  }

  function deleteQuestionImage(e) {
    setMCQs((cur) => {
      let copy = cur.slice();
      copy[props.sectionIndex].questions[props.questionIndex].image = null;
      return copy;
    });
  }

  return (
    <div>
      {linkModal == true ? (
        <div id="modal" className="absolute z-10 w-1/2 bg-white left-1/4 translate-x-2/4 shadow-xl py-2 px-2">
          <i className="fas fa-times float-right text-gray-800 cursor-pointer" onClick={toggleLinkModal}></i>
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
              <input type="submit" className="bg-green-500 text-white px-4 py-2" value="Add Link"></input>
            </form>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="bg-white h-auto w-4/5 mx-auto mt-4 shadow-xl">
        <div className="bg-gray-200 w-full text-black px-4 py-0 mr-4 grid grid-cols-4 content-center">
          <div className="col-start-2 col-span-3 justify-self-end">
            <i className="far fa-copy text-xl p-2 text-gray-500 hover:bg-green-500 hover:text-gray-700 active:bg-opacity-0 mr-2" onClick={copyQuestion}></i>
            <i className="fas fa-arrow-up text-xl p-2 text-gray-500 hover:bg-green-500 hover:text-gray-700 active:bg-opacity-0 mr-2" onClick={moveQuestionUp}></i>
            <i className="fas fa-arrow-down text-xl p-2 text-gray-500 hover:bg-green-500 hover:gray-700 active:bg-opacity-0" onClick={moveQuestionDown}></i>
            <i className="fas fa-trash-alt text-xl p-2 text-gray-500 hover:bg-green-500 hover:gray-700 active:bg-opacity-0" onClick={deleteQuestion}></i>
          </div>
        </div>
        <div className="py-4 px-8">
          <div>
            <ErrorDisplay error={error}></ErrorDisplay>
            <div className="flex gap-4">
              <label>{props.questionIndex + 1}:</label>
              <textarea
                placeholder="Enter Question Statement"
                value={mcqs[props.sectionIndex].questions[props.questionIndex].statement == null ? "" : mcqs[props.sectionIndex].questions[props.questionIndex].statement}
                onChange={(e) => {
                  setMCQs((cur) => {
                    let copy = cur.slice();
                    copy[props.sectionIndex].questions[props.questionIndex].statement = e.target.value;
                    return copy;
                  });
                }}
                minLength="1"
                maxLength="65535"
                className="w-full px-4 py-2 border-gray-400 border-2"
                autoFocus
              ></textarea>
              <form method="POST" encType="multipart/form-data" action="/upload" ref={fileUploadForm} className="relative cursor-pointer" style={{ flexBasis: "10%" }}>
                <div className="absolute text-3xl w-full h-full grid grid-cols-1 border-gray-300 border-4 cursor-pointer">
                  {uploading == false ? <i className="far fa-image col-span-1 justify-self-center self-center text-gray-300"></i> : <i className="fas fa-spinner text-gray-300 justify-self-center self-center col-span-1 animate-spin"></i>}
                </div>
                <input type="file" accept="image/png, image/jpeg" name="file" onChange={uploadImage} className="opacity-0 w-full h-full cursor-pointer"></input>
              </form>
              <div className="border-gray-300 border-4 cursor-pointer text-3xl w-full h-full grid grid-cols-1 py-6 px-4" onClick={toggleLinkModal} style={{ flexBasis: "10%" }}>
                <i className="fas fa-link text-gray-300 col-span-1 justify-self-center self-center"></i>
              </div>
            </div>
          </div>
          {mcqs[props.sectionIndex].questions[props.questionIndex].link.url == null ? (
            <div className="hidden"></div>
          ) : (
            <a href={mcqs[props.sectionIndex].questions[props.questionIndex].link.url} target="_blank" className="text-blue-700 underline ml-8 hover:text-blue-500">
              {mcqs[props.sectionIndex].questions[props.questionIndex].link.text == "" ? mcqs[props.sectionIndex].questions[props.questionIndex].link.url : mcqs[props.sectionIndex].questions[props.questionIndex].link.text}
            </a>
          )}
          {mcqs[props.sectionIndex].questions[props.questionIndex].image == null ? (
            <div className="hidden"></div>
          ) : (
            <div className="relative w-max">
              <img src={mcqs[props.sectionIndex].questions[props.questionIndex].image} height="150px" className="mt-6 ml-8 max-h-64 w-auto"></img>
              <i className="fas fa-trash p-2 absolute top-0 right-0 bg-white text-red-500 shadow-md cursor-pointer" onClick={deleteQuestionImage}></i>
            </div>
          )}
          <ul className="mt-4 ml-10">
            {mcqs[props.sectionIndex].questions[props.questionIndex].options.map((option, index) => (
              <Option opt={option} questionIndex={props.questionIndex} optionIndex={index} sectionIndex={props.sectionIndex} key={index} type={props.type} />
            ))}
          </ul>
          <hr className="border-2 mb-4 mt-10"></hr>
          <div className="grid grid-cols-5">
            {props.type == "MCQ-S" ? (
              <Select options={optionsArray} value={correctOption} onChange={setCorrectOptionInState} label="Select Correct Option:" className="col-span-1"></Select>
            ) : (
              <div className="col-span-1">
                <p>Select correct options:</p>
                <SelectMultiple sectionIndex={props.sectionIndex} questionIndex={props.questionIndex} options={mcqs[props.sectionIndex].questions[props.questionIndex].options} value={correctOption} onCheckboxChange={handleCheckboxChange}></SelectMultiple>
              </div>
            )}
            <div className="col-start-2 col-span-1 justify-self-end">
              <label>Marks: </label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={mcqs[props.sectionIndex].questions[props.questionIndex].marks}
                onChange={(e) => {
                  setMCQs((cur) => {
                    let copy = cur.slice();
                    copy[props.sectionIndex].questions[props.questionIndex].marks = e.target.value;
                    return copy;
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

const SectionHeader = (props) => {
  const [mcqs, setMCQs] = useContext(MyContext);
  const [poolCountChanged, setPoolCountChanged] = useState(false);
  const [poolCount, setPoolCount] = useState(poolCountChanged == true ? mcqs[props.sectionIndex].poolCount : mcqs[props.sectionIndex].questions.length);
  const [time, setTime] = useState(mcqs[props.sectionIndex].time);
  const [timeOrNot, setTimeOrNot] = useState(mcqs[props.sectionIndex].time == 0 ? false : true);
  const toggle = React.useRef();

  useMemo(() => {
    setPoolCount(poolCountChanged == true ? mcqs[props.sectionIndex].poolCount : mcqs[props.sectionIndex].questions.length);
    if (!poolCountChanged) {
      if (mcqs[props.sectionIndex].poolCount != poolCount)
        setMCQs((cur) => {
          let copy = cur.slice();
          copy[props.sectionIndex].poolCount = poolCount;
          return copy;
        });
    }
  }, [mcqs, toggle]);

  const closeDropdown = () => {
    const el = ReactDOM.findDOMNode(toggle.current);
    el.classList.toggle("hidden");
  };

  const addNewMCQ = (type) => {
    setMCQs((cur) => {
      let copy = cur.slice();
      copy[props.sectionIndex].questions.push({
        statement: null,
        questionOrder: null,
        type: type,
        image: null,
        marks: 1,
        link: { url: null, text: null },
        options: [{ optionStatement: null, correct: false }],
        correctOptionIndex: null,
      });
      copy[props.sectionIndex].questions[copy[props.sectionIndex].questions.length - 1].questionOrder = copy[props.sectionIndex].questions.length - 1;
      return copy;
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

  return (
    <div className="toolbox w-4/5 text-base mt-4 mx-auto justify-start gap-x-8 shadow-xl bg-white">
      <h1 className="text-lg bg-green-500 text-white px-4 py-2">
        Section {props.sectionNumber} of {props.totalSections}: {props.sectionTitle}
      </h1>
      <div className="flex content-center items-center">
        <div className="cursor-pointer relative w-max p-8">
          <div
            className="bg-green-500 text-white px-8 py-4"
            id="add_question"
            onClick={(e) => {
              const el = ReactDOM.findDOMNode(toggle.current);
              el.classList.toggle("hidden");
            }}
          >
            <i className="fas fa-plus"></i> Add Question
          </div>
          <ul id="types_of_questions" ref={toggle} className="hidden bg-white text-gray-800 absolute w-max top-16 left-0 border-gray-200 border-2">
            <li onClick={addNewMCQSingle} className="py-2 px-4 hover:bg-gray-200">
              MCQ Single Select
            </li>
            <li onClick={addNewMCQMultiple} className="py-2 px-4 hover:bg-gray-200">
              MCQ Multiple Select
            </li>
            <li className="py-2 px-4 hover:bg-gray-200">Fill in the Blank</li>
          </ul>
        </div>
        <div className="">
          <label className="px-4 py-3">No. of Questions to be Randomly Selected: </label>
          <input
            type="number"
            className="h-12 w-16 bg-gray-100 text-center"
            min="0"
            max={mcqs[props.sectionIndex].questions.length}
            name="pool_count"
            value={poolCount}
            onChange={(e) => {
              setPoolCountChanged(true);
              setPoolCount(e.target.value);
              setMCQs((cur) => {
                let copy = cur.slice();
                copy[props.sectionIndex].poolCount = e.target.value;
                return copy;
              });
            }}
          ></input>
        </div>
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
                  setMCQs((cur) => {
                    let copy = cur.slice();
                    copy[props.sectionIndex].time = e.target.value;
                    return copy;
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
  );
};

const Section = (props) => {
  const [mcqs, setMCQs] = useContext(MyContext);

  return (
    <div>
      <SectionHeader sectionTitle={props.sectionTitle} sectionNumber={props.sectionNumber} sectionIndex={props.sectionNumber - 1} totalSections={props.totalSections} key={props.sectionNumber} />
      <div>
        {mcqs[props.sectionIndex].questions.map((question, index) => {
          return <MCQ sectionIndex={props.sectionIndex} questionIndex={index} type={question.type}></MCQ>;
        })}
      </div>
    </div>
  );
};

const Main = () => {
  const [mcqs, setMCQs] = useContext(MyContext);
  const [sectionInput, setSectionInput] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizId, setQuizId] = useState(globalQuizId);
  const [error, setError] = useState("");
  const [savedStatus, setSavedStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploading2, setUploading2] = useState(false);
  let fileUploadForm = useRef();

  // If we are editing an already present quiz, get the quiz state from the server
  useEffect(async () => {
    if (globalQuizId != null) {
      let state, title;
      const response = await fetch("/quizState/" + globalQuizId.toString());
      const finalResponse = await response.json();
      if (finalResponse.success == true) {
        state = finalResponse.stateObject;
        title = finalResponse.quizTitle;
      } else {
        state = [];
      }
      setMCQs(state);
      setQuizTitle(title);
    }
  }, []);

  const addSection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMCQs((cur) => {
      let copy = cur.slice();
      copy.push({
        sectionTitle: sectionInput,
        sectionOrder: null,
        poolCount: 0,
        time: 0,
        questions: [],
      });
      copy[copy.length - 1].sectionOrder = copy.length - 1;
      return copy;
    });
  };

  function saveDataInDatabase() {
    // data validation before saving
    setUploading2(true);
    setError("");
    console.log("Saving: ", mcqs);
    let anyErrors = false;

    if (quizTitle == "") {
      setError("Please enter a quiz title.");
      anyErrors = true;
    } else {
      if (mcqs.length == 0) {
        setError("Please add at least one section.");
        anyErrors = true;
      } else {
        mcqs.forEach((section) => {
          if (section.questions.length == 0) {
            setError("Empty sections cannot exist. Every section must have at least one question.");
            anyErrors = true;
          } else if (section.poolCount == 0) {
            setError("You set section " + section.sectionTitle + "'s pool count to 0. Please pick a number greater than 0 otherwise this section will show up empty to the students.");
            anyErrors = true;
          } else {
            section.questions.forEach((question) => {
              if (question.statement == null || question.statement == "") {
                setError("Please do not leave a question statement empty.");
                anyErrors = true;
              } else if ((question.options.length == 1 && question.options[0].optionStatement == null) || (question.options.length == 2 && question.options[1] == null)) {
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
      console.log(mcqs[0].poolCount);
      fetch("/save-quiz", {
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
          mcqs: mcqs,
        }),
      })
        .then((response) => {
          response.json().then((finalResponse) => {
            console.log("finalResponse.status: ", finalResponse.status)
            setSavedStatus(finalResponse.status == true ? <i className="fas fa-check-circle text-green-400 text-xl"></i> : <i className="fas fa-exclamation-triangle text-red-600"></i>);
            setQuizId(finalResponse.quizId);
            setError(finalResponse.message);
            setUploading2(false);
            setTimeout(() => {
              setSavedStatus("");
            }, 6000);
          });
        })
        .catch((err) => {
          console.log(err);
          setSavedStatus(<i className="fas fa-exclamation-triangle text-red-600"></i>);
        });
    } else {
      setSavedStatus(<i className="fas fa-exclamation-triangle text-red-600"></i>);
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
      body: JSON.stringify(mcqs),
    })
    .then(response=>{
        response.json().then(finalResponse=>{
          console.log(finalResponse)
          if (finalResponse.status == true) {window.location=finalResponse.file_link;console.log(finalResponse.file_link)}
          else console.log("Error")
        })
      })
      .catch(err=>{
        console.log(err)
      })
  }

  function uploadCSV(e) {
    console.log("hi");
    let data = new FormData(ReactDOM.findDOMNode(fileUploadForm.current));
    setUploading(true);
    fetch("/upload/csv", {
      method: "POST",
      body: data,
    })
      .then((response) => {
        if (response.status == 200) {
          response.json().then((finalResponse) => {
            if (finalResponse.status == true) {
              console.log(finalResponse);
              setUploading(false);
              setMCQs(finalResponse.state);
              console.log(finalResponse.state);
            }
          });
        } else {
          setUploading(false);
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
        <ErrorDisplay error={error}></ErrorDisplay>
        <div className="gap-x-8 flex items-center">
          <form onSubmit={addSection} className="flex justify-start">
            <input type="text" placeholder="Section Title" name="sectionTitle" value={sectionInput} onChange={(e) => setSectionInput(e.target.value)} className="px-4 w-72"></input>
            <button className="bg-green-400 text-white px-8 py-4 active:shadow-inner cursor-pointer" id="add_section">
              <i className="fas fa-plus"></i> Add New Section
            </button>
          </form>
          <input type="text" placeholder="Quiz Title" name="quizTitle" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} className="px-4 py-4 w-72" autoFocus></input>
          <button type="button" onClick={saveDataInDatabase} className="bg-green-400 text-white px-8 py-4 active:shadow-inner cursor-pointer">
            <i className="fas fa-save"></i> Save Quiz
          </button>
          <p>
            {uploading2 == true ? <i className="fas fa-spinner animate-spin self-center"></i> : <div className="hidden"></div>}
            {savedStatus}
          </p>
        </div>
        <div className="flex py-2">
          <form method="POST" encType="multipart/form-data" action="/upload" ref={fileUploadForm}>
            <label htmlFor="csv-upload" className="inline-block px-4 py-4 cursor-pointer bg-green-500 text-white">
              <i className="fas fa-file-upload"></i> Upload from CSV File <input id="csv-upload" type="file" accept=".csv" name="file" onChange={uploadCSV} className="hidden"></input> {uploading == true ? <i className="fas fa-spinner animate-spin self-center"></i> : <div className="hidden"></div>}
            </label>
          </form>
          <button type="button" onClick={downloadCSV} className="inline-block px-4 py-4 cursor-pointer bg-green-500 text-white border-l-2"><i className="fas fa-file-download"></i> Download as CSV File</button>
        </div>
        
      </div>
      {mcqs.map((section, index) => (
        <Section sectionTitle={section.sectionTitle} sectionNumber={index + 1} sectionIndex={index} totalSections={mcqs.length} key={index} />
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
