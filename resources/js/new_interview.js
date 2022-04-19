const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const useRef = React.useRef;
const useMemo = React.useMemo;

const ContextProvider = (props) => {
  const [steps, setSteps] = useState([
    { title: "Step 1: Add Interviewers", active: true },
    { title: "Step 2: Add Interviewees", active: false },
    { title: "Step 3: Send Invites", active: false },
    { title: "Step 4: Results", active: false },
  ]);
  // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not

  return (
    <MyContext.Provider
      value={{
        steps_object: [steps, setSteps],
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

const StepMenu = () => {
  const { steps_object } = useContext(MyContext);
  const [steps, setSteps] = steps_object;

  const changeMenu = (e) => {
    setSteps((cur) => {
      let copy = cur.slice();
      for (let i = 0; i < copy.length; i++) {
        if (i == e.target.id) copy[i].active = true;
        else copy[i].active = false;
      }
      return copy;
    });
  };

  return (
    <div className="grid grid-cols-4 w-full h-full mt-4">
      {steps.map((step, index) => (
        <div key={index}>
          {step.active ? (
            <div
              className="cursor-default bg-iec-blue text-white shadow-inner px-8 py-4 border-r w-full h-full"
              id={index}
              key={index}
              onClick={changeMenu}
            >
              {step.title}
            </div>
          ) : (
            <div
              className="cursor-pointer px-8 py-4 bg-white border-r w-full h-full"
              id={index}
              key={index}
              onClick={changeMenu}
            >
              {step.title}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Step1 = () => {
  return <div>Step 1</div>;
};
const Step2 = () => {
  return <div>Step 2</div>;
};
const Step3 = () => {
  return <div>Step 3</div>;
};
const Step4 = () => {
  return <div>Step 4</div>;
};

const Main = () => {
  const { steps_object } = useContext(MyContext);
  const [steps, setSteps] = steps_object;
  return (
    <div>
      <div>
        <StepMenu />
      </div>
      {steps[0].active ? <Step1 /> : <div className="hidden"></div>}
      {steps[1].active ? <Step2 /> : <div className="hidden"></div>}
      {steps[2].active ? <Step3 /> : <div className="hidden"></div>}
      {steps[3].active ? <Step4 /> : <div className="hidden"></div>}
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

ReactDOM.render(<App />, document.getElementById("app"));
