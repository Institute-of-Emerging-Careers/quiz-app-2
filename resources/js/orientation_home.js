const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const App = () => {
  const [orientations, setOrientations] = useState([]);

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
  }, []);

  return (
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
  );
};

ReactDOM.render(<App />, document.getElementById("all-orientations"));
