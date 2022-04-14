const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const App = () => {
  const [orientations, setOrientations] = useState([]);
  const [show_modal, setShowModal] = useState(false);
  const [all_assessments, setAllAssessments] = useState([]);

  useEffect(() => {
    fetch("/admin/orientation/all").then((response) => {
      response.json().then((parsed_response) => {
        if (parsed_response.success) {
          setOrientations(parsed_response.data);
        } else
          alert(
            "There was a problem while getting the orientations. Contact IT."
          );
      });
    });

    fetch("/quiz/all-titles-and-num-attempts").then((response) => {
      response.json().then((parsed_response) => {
        setAllAssessments(parsed_response);
      });
    });
  }, []);

  const createNewOrientation = (e) => {
    window.location = `/admin/orientation/new/${e.target.value}`;
  };

  return (
    <div>
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
              Orientation
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
              Please choose an Assessment to link to this Orientation. You will
              add Students to this Orientation based on their results in this
              chosen Assessment.
            </p>
            <select className="w-full p-2" onChange={createNewOrientation}>
              <option className="p-2" selected disabled>
                Choose an Assessment
              </option>
              {all_assessments.map((assessment) => (
                <option
                  className="p-2"
                  value={assessment.id}
                  key={assessment.id}
                >
                  {assessment.title} | {assessment.num_attempts} Attempts{" "}
                </option>
              ))}
            </select>
          </div>

          {/* <div class="bg-gray-600 text-white py-2 px-3">
            <h3 class="text-lg">Previous Links</h3>
          </div> */}
        </div>
      </div>
      <h2 className="text-xl mt-6 mb-4 font-bold">
        Orientations{" "}
        <button
          onClick={() => {
            setShowModal((cur) => !cur);
          }}
          className="text-xs px-4 py-1 cursor-pointer bg-iec-blue hover:bg-iec-blue-hover text-white rounded-full"
        >
          NEW
        </button>
      </h2>
      <div className="flex flex-wrap justify-start gap-y-10 gap-x-10">
        {orientations.map((orientation, index) => {
          return (
            <div
              className="grid w-64 grid-cols-6 gap-4 border bg-white pb-2 quiz-card"
              key={index}
            >
              <div className="grid grid-cols-2 col-span-8 h-16 bg-iec-blue justify-center content-center">
                <a
                  href={`/orientation/edit/${orientation.id}`}
                  className="text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer"
                  title="Edit Quiz"
                >
                  <i className="far fa-edit "></i>
                </a>
                <a
                  className="text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer"
                  title="Delete Quiz"
                >
                  <i className="fas fa-trash "></i>
                </a>
              </div>
              <h3 className="col-span-6 font-semibold text-lg px-4">
                {orientation.title}
              </h3>
              <div className="col-start-1 col-span-3">
                <p className="pl-4 pt-0">0 invited</p>
              </div>
              <div className="col-start-4 col-span-3">
                <p className="pr-4 pt-0">0 attended</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
