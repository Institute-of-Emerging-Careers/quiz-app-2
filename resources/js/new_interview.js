const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const StepMenu = () => {};

const App = () => {
  return (
    <div>
      <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
        <StepMenu />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
