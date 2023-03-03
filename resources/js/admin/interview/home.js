const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const App = () => {
  const [interview_rounds, setInterviewRounds] = useState([]);
  const [all_assessments, setAllAssessments] = useState([]);
  const [show_modal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetch("/admin/interview/all")
      .then((raw_response) => {
        raw_response
          .json()
          .then((response) => {
            if (response.success) setInterviewRounds(response.interview_rounds);
            else
              alert(
                "Something went wrong while getting interview rounds. Error code 01."
              );
          })
          .catch((err) => {
            alert(
              "Error while understanding the server's response. Error code 02."
            );
          });
      })
      .catch((err) => {
        alert(
          "Please check your internet connection and try again. Error code 03."
        );
      });

    fetch("/quiz/all-titles-and-num-attempts").then((response) => {
      response.json().then((parsed_response) => {
        setAllAssessments(parsed_response);
      });
    });
  }, [reload]);

  const createNewInterview = (e) => {
    window.location = `/admin/interview/new/${e.target.value}`;
  };

  const deleteInterviewRound = (interview_round_id) => {
    fetch(`/admin/interview/round/delete/${interview_round_id}`)
      .then((res) => {
        if (res.ok) setReload((cur) => !cur);
        else alert("Error on server while deleting interview round.");
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Error deleting interview round. Check your internet connection."
        );
      });
  };

  return (
    <div>
      <div
        id="modal"
        className={
          show_modal
            ? "h-screen w-screen inset-0 absolute z-30 bg-black/60"
            : "hidden"
        }
      >
        <div className="mt-10 w-1/2 bg-white translate-x-2/4 shadow-xl pb-2">
          <div className="bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center">
            <h3 className="text-xl col-auto justify-self-start self-center">
              <i className="fas fa-link text-xl text-white"></i> Create New
              Interview Round
            </h3>
            <i
              className="fas fa-times text-white cursor-pointer col-auto justify-self-end self-center"
              onClick={() => {
                setShowModal(false);
              }}
            ></i>
          </div>
          <div className="p-8">
            <p>
              Please choose an Assessment to link to this Interview Round. You
              will invite Students to this Interview Round based on their
              results in the chosen Assessment.
            </p>
            <select className="w-full p-2" onChange={createNewInterview}>
              <option className="p-2" selected disabled>
                Choose an Assessment
              </option>
              {all_assessments.map((assessment) => (
                <option
                  className="p-2"
                  value={assessment.id}
                  key={assessment.id}
                >
                  {assessment.title} | {assessment.num_assignments} Assignments{" "}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <h2 className="text-xl mt-6 mb-4 font-bold">
        Interview Rounds
        <button
          className="text-xs px-4 py-1 cursor-pointer bg-iec-blue hover:bg-iec-blue-hover text-white rounded-full"
          onClick={() => {
            setShowModal((cur) => !cur);
          }}
        >
          NEW
        </button>
      </h2>
      <div className="flex flex-wrap justify-start gap-y-10 gap-x-10">
        {interview_rounds.map((interview_round, index) => (
          <div
            className="grid w-64 grid-cols-6 gap-4 border bg-white pb-2 quiz-card"
            key={index}
          >
            <div className="grid grid-cols-2 col-span-8 h-16 bg-iec-blue justify-center content-center">
              <a
                href={`/admin/interview/edit/${interview_round.id}`}
                className="text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer"
                title="Edit Interview Round"
              >
                <i className="far fa-edit "></i>
              </a>
              <a
                className="text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer"
                title="Delete Interview Round"
                onClick={() => {
                  deleteInterviewRound(interview_round.id);
                }}
              >
                <i className="fas fa-trash "></i>
              </a>
            </div>
            <h3 className="col-span-6 font-semibold text-lg px-4">
              {interview_round.title}
            </h3>
            <div className="col-start-1 col-span-3">
              <p className="pl-4 pt-0">0 invited</p>
            </div>
            <div className="col-start-4 col-span-3">
              <p className="pr-4 pt-0">0 attended</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
