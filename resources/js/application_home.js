const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;

const App = () => {
  const [application_rounds, setApplicationRounds] = useState([]);

  useEffect(() => {
    fetch("/admin/application/all-rounds")
      .then((raw_response) => {
        raw_response
          .json()
          .then((response) => {
            if (response.success)
              setApplicationRounds(response.application_rounds);
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
  }, []);

  const createApplicationRound = () => {};

  return (
    <div>
      {/* Modal starts */}
      <div
        id="modal"
        className={
          show_modal
            ? "h-screen w-screen inset-0 absolute z-30 bg-black bg-opacity-60"
            : "hidden"
        }
      >
        <div className="mx-auto mt-10 w-1/2 bg-white left-1/4 translate-x-2/4 shadow-xl pb-2">
          <div className="bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center">
            <h3 className="text-xl col-auto justify-self-start self-center">
              <i className="fas fa-link text-xl text-white"></i> Create New
              Application Round
            </h3>
            <i
              className="fas fa-times text-white cursor-pointer col-auto justify-self-end self-center"
              onClick={() => {
                setShowModal(false);
              }}
            ></i>
          </div>
          <div className="p-8">
            <p>Please enter the name of this Application Round.</p>
            <form onSubmit={createApplicationRound}>
              <input
                type="text"
                min="2"
                placeholder="Cohort 4 Application Round 1"
                className="px-4 py-2"
              ></input>
              <input type="submit" value="Create Application Round"></input>
            </form>
          </div>
        </div>
      </div>
      {/* Modal ends */}
      <h2 className="text-xl mt-6 mb-4 font-bold">
        Applications
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
              >
                <i className="fas fa-trash "></i>
              </a>
            </div>
            <h3 className="col-span-6 font-semibold text-lg px-4">
              {interview_round.title}
            </h3>
            <div className="col-start-1 col-span-6">
              <p className="pl-4 pt-0">0 applied</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
