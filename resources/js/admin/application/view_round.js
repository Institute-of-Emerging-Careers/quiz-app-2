const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;

const App = () => {
  const [students, setStudents] = useState([]);

  return (
    <div>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <StudentsList
          students_object={[students, setStudents]}
          title="Interview"
        />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
