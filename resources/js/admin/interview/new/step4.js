const deleteQuestion = (setQuestions, index) =>
  setQuestions((cur) => {
    let copy = [...cur];
    copy.splice(index, 1);
    return copy;
  });

const QUESTION_TYPE = { NUMERIC: "number scale", TEXTUAL: "descriptive" };
const EMPTY_NUMERIC_QUESTION = {
  question: null,
  questionType: QUESTION_TYPE.NUMERIC,
  questionScale: 0,
};
const EMPTY_TEXTUAL_QUESTION = {
  question: null,
  questionType: QUESTION_TYPE.TEXTUAL,
  questionScale: null,
};

const saveQuestions = async (
  numericQuestions,
  textualQuestions,
  setShowModal
) => {
  try {
    const response = await fetch(
      `/admin/interview/${interview_round_id}/save-questions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: [...numericQuestions, ...textualQuestions].filter(
            ({ question }) => !!question
          ),
        }),
      }
    );
    if (response.ok) setShowModal(true);
    else alert("Error occured. Contact IT.");
  } catch (err) {
    console.log(err);
    alert("Something went wrong. Contact IT.");
  }
};

const Question = ({ questions, setQuestions, question, index }) => {
  const onChange = (property) => (e) => {
    setQuestions((cur) => {
      let copy = JSON.parse(JSON.stringify(cur));
      copy[index][property] = e.target.value;
      return copy;
    });
  };

  return (
    <div className="flex gap-x-6 w-full items-center text-xl text-gray-900">
      <span className="justify-self-center">{index + 1}</span>
      <div className="relative flex-grow">
        <input
          className="w-full p-2 pr-10 bg-transparent h-min my-0 border-b-2 border-solid border-gray-400"
          rows="1"
          placeholder="Enter text here"
          value={questions[index]?.question ?? ""}
          onChange={onChange("question")}
        />
        <i
          class="fa-trash-can absolute right-4 top-3 fa-regular text-lg cursor-pointer"
          onClick={() => deleteQuestion(setQuestions, index)}
        ></i>
      </div>
      {questions[index]?.questionScale !== null && (
        <input
          type="number"
          value={questions[index]?.questionScale ?? "0"}
          onChange={onChange("questionScale")}
          className="text-center p-2 bg-transparent justify-self-center border-b-2 border-solid border-gray-700"
          style={{ width: "80px" }}
        />
      )}
    </div>
  );
};

const Step4 = () => {
  //need to take number of questions as input
  //need to take question type as input (descriptive or number scale)
  //need to take question as input

  const [show_modal, setShowModal] = useState(false);
  const [numericQuestions, setNumericQuestions] = useState([]);
  const [textualQuestions, setTextualQuestions] = useState([]);

  //first we need to check if questions have already been set for this interview round
  //if yes, then we need to display them

  useEffect(async () => {
    let response = await fetch(
      `/admin/interview/${interview_round_id}/all-questions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status == 200) {
      response = await response.json();
      const numericQuestionsInResponse = response.questions.filter(
        ({ questionType }) => questionType === QUESTION_TYPE.NUMERIC
      );
      const textualQuestionsInResponse = response.questions.filter(
        ({ questionType }) => questionType === QUESTION_TYPE.TEXTUAL
      );

      setNumericQuestions(
        numericQuestionsInResponse.length === 0
          ? [EMPTY_NUMERIC_QUESTION]
          : numericQuestionsInResponse
      );
      setTextualQuestions(
        textualQuestionsInResponse.length === 0
          ? [EMPTY_TEXTUAL_QUESTION]
          : textualQuestionsInResponse
      );
    } else alert("Could not load questions from server. Contact IT.");
  }, []);

  const addNumericQuestion = useCallback(() => {
    if (numericQuestions[numericQuestions.length - 1].question === "") return;
    setNumericQuestions((cur) => [...cur, EMPTY_NUMERIC_QUESTION]);
  }, [numericQuestions]);

  const addTextualQuestion = useCallback(() => {
    if (textualQuestions[textualQuestions.length - 1].question === "") return;
    setTextualQuestions((cur) => [...cur, EMPTY_TEXTUAL_QUESTION]);
  }, [textualQuestions]);

  return (
    <div className=" mt-20 px-8 font-normal">
      <div className="mt-8">
        <button
          className="bg-iec-blue hover:bg-iec-blue-hover text-white px-6 py-2 float-right"
          onClick={() =>
            saveQuestions(numericQuestions, textualQuestions, setShowModal)
          }
        >
          <i className="fa-regular fa-floppy-disk"></i> Save
        </button>
        <br />

        {/* Numeric Questions Section */}
        <section id="numeric">
          <div className="w-full">
            <h2 className="w-max font-semibold text-2xl border-solid border-l-2 border-b-2 border-iec-blue px-2 mb-4">
              Numeric Questions
            </h2>
          </div>
          <p className="block float-right mr-6">Marks</p>

          <div className="w-full flex flex-col gap-y-2">
            {numericQuestions.map((question, index) => (
              <Question
                questions={numericQuestions}
                setQuestions={setNumericQuestions}
                question={question}
                index={index}
                key={`numeric${index}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button
              className="bg-iec-blue hover:bg-iec-blue-hover text-white py-2 px-10"
              onClick={addNumericQuestion}
            >
              <i className="fa-solid fa-plus"></i> Add Question
            </button>
            <p>
              Total Marks:{" "}
              {numericQuestions.reduce(
                (prev, cur) => (prev += parseInt(cur.questionScale)),
                0
              )}
            </p>
          </div>
        </section>

        {/* Textual Questions Section */}
        <section id="textual" className="mt-12">
          <div className="w-full">
            <h2 className="w-max font-semibold text-2xl border-solid border-l-2 border-b-2 border-iec-blue px-2 mb-4">
              Textual Questions
            </h2>
          </div>

          <div className="w-full flex flex-col gap-y-2">
            {textualQuestions.map((question, index) => (
              <Question
                questions={textualQuestions}
                setQuestions={setTextualQuestions}
                question={question}
                index={index}
                key={`textual${index}`}
              />
            ))}
          </div>
          <button
            className="bg-iec-blue hover:bg-iec-blue-hover text-white py-2 px-10 mt-6"
            onClick={addTextualQuestion}
          >
            <i className="fa-solid fa-plus"></i> Add Question
          </button>
        </section>
      </div>
      <Modal
        show_modal={show_modal}
        setShowModal={setShowModal}
        heading="Success"
        content="Question has been saved"
      />
    </div>
  );
};
