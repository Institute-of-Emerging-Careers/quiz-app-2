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
  const [interviewers, setInterviewers] = useState([]);
  const [new_interviewer_name, setNewInterviewerName] = useState("");
  const [new_interviewer_email, setNewInterviewerEmail] = useState("");
  const name_field = useRef();

  const interview_round_id = document.getElementById(
    "interview-round-id-field"
  ).value;

  useEffect(() => {
    fetch(`/admin/interview/interviewers/all/${interview_round_id}`).then(
      (raw_response) => {
        if (raw_response.ok) {
          raw_response.json().then((response) => {
            setInterviewers(response);
          });
        } else {
          alert("Error in URL. Wrong Interview Round. Please go to home page.");
        }
      }
    );
  }, []);

  const saveData = () => {
    fetch(`/admin/interview/update-interviewer-list/${interview_round_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interviewers: interviewers }),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) alert("Saved");
        else {
          alert("Error");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong. Check your internet connection.");
      });
  };

  const sendEmailsToInterviewers = () => {};

  return (
    <div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
      <form className="flex flex-col">
        <h2 className="text-lg">Add New Interviewer</h2>
        <div className="w-full flex gap-x-4 items-center">
          <label htmlFor="new-interviewer" className="min-w-max">
            Full Name:{" "}
          </label>
          <input
            type="text"
            maxLength="150"
            name="name"
            className="w-full border py-3 px-4 mt-1 hover:shadow-sm"
            value={new_interviewer_name}
            onChange={(e) => {
              setNewInterviewerName(e.target.value);
            }}
            ref={name_field}
            active="true"
          ></input>
          <label htmlFor="new-interviewer" className="min-w-max">
            Email:{" "}
          </label>
          <input
            type="email"
            maxLength="200"
            name="email"
            value={new_interviewer_email}
            className="w-full border py-3 px-4 mt-1 hover:shadow-sm"
            onChange={(e) => {
              setNewInterviewerEmail(e.target.value);
            }}
          ></input>

          <button
            type="submit"
            className="w-full py-3 px-6 border-2 border-gray-700 text-gray-700 cursor-pointer hover:bg-gray-700 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              setInterviewers((cur) => {
                let copy = cur.slice();
                copy.push({
                  name: new_interviewer_name,
                  email: new_interviewer_email,
                  time_declared: false,
                });
                return copy;
              });
              setNewInterviewerName("");
              setNewInterviewerEmail("");
              ReactDOM.findDOMNode(name_field.current).focus();
            }}
          >
            Add
          </button>
        </div>
      </form>
      <hr className="mt-4"></hr>

      <div className="flex mt-4 mb-4 justify-between items-center">
        <h2 className="text-lg">Interviewers Added</h2>
        <div className="flex">
          <button
            type="button"
            className="py-3 px-6 bg-iec-blue text-white cursor-pointer hover:bg-iec-blue-hover"
            onClick={sendEmailsToInterviewers}
          >
            <i className="fas fa-paper-plane"></i> Send Emails and Ask
            Interviewers to Declare Time Slots
          </button>
          <button
            type="button"
            className="py-3 px-6 bg-green-500 text-white cursor-pointer hover:bg-green-600"
            onClick={saveData}
          >
            <i className="fas fa-save"></i> Save Data
          </button>
        </div>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Time Declared</th>
          </tr>
        </thead>
        <tbody>
          {interviewers.map((interviewer, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{interviewer.name}</td>
              <td className="border px-4 py-2">{interviewer.email}</td>
              <td className="border px-4 py-2">
                {interviewer.time_declared ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
  const [editInterviewRoundTitle, setEditInterviewRoundTitle] = useState(false);
  const [interviewRoundTitle, setInterviewRoundTitle] = useState(
    document.getElementById("interview-round-name-field").value
  );

  const updateInterviewRoundTitle = (e) => {
    e.preventDefault();
    console.log(interviewRoundTitle);
    fetch(
      `/admin/interview/update-round-title/${
        document.getElementById("interview-round-id-field").value
      }`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: interviewRoundTitle }),
      }
    )
      .then((response) => {
        if (response.ok) {
          setEditInterviewRoundTitle(false);
        } else {
          alert(
            `Error changing interview round name. Response code ${response.status}.`
          );
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Something went worng. Make sure you have a working internet connection or contact IT. Error code 02."
        );
      });
  };

  return (
    <div>
      {editInterviewRoundTitle ? (
        <form onSubmit={updateInterviewRoundTitle}>
          <input
            type="text"
            maxLength="50"
            name="interview-round-title"
            value={interviewRoundTitle}
            onChange={(e) => {
              setInterviewRoundTitle(e.target.value);
            }}
            className="px-4 py-2 min-w-max"
          ></input>
          <input type="submit" className="hidden"></input>
        </form>
      ) : (
        <h1 className="text-2xl">
          {`${interviewRoundTitle} `}
          <i
            className="fas fa-edit cursor-pointer"
            onClick={() => {
              setEditInterviewRoundTitle((cur) => !cur);
            }}
          ></i>
        </h1>
      )}
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
