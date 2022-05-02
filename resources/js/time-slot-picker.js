const useState = React.useState;
const useEffect = React.useEffect;
const { DateTime, Duration } = luxon;

const App = () => {
  const [time_slots, setTimeSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [period_start, setPeriodStart] = useState(
    DateTime.local({ zone: "Asia/Karachi" })
      .toISO({
        includeOffset: false,
        suppressMilliseconds: true,
        suppressSeconds: true,
      })
      .substr(0, 16)
  );
  const [period_end, setPeriodEnd] = useState(
    DateTime.local({ zone: "Asia/Karachi" })
      .toISO({
        includeOffset: false,
        suppressMilliseconds: true,
        suppressSeconds: true,
      })
      .substr(0, 16)
  );
  const [duration, setDuration] = useState(0);

  // load any time slots the user may have set in the past
  useEffect(() => {
    fetch(
      `/admin/interview/interviewer/time-slots/${
        document.getElementById("interview-round-id").value
      }`
    ).then((raw_response) => {
      if (raw_response.ok) {
        raw_response
          .json()
          .then((response) => {
            if (response.success) {
              setTimeSlots(response.time_slots);
            } else alert("Something went wrong. Error code 03.");
          })
          .catch((err) => {
            alert("Something went wrong. Error code 02.");
          });
      } else
        alert(
          "Something went wrong. Please check your internet connection and try again. Error Code 01."
        );
    });
  }, []);

  useEffect(() => {
    const start = DateTime.fromISO(period_start);
    const end = DateTime.fromISO(period_end);
    const diff = end.diff(start);
    setDuration(diff.toMillis());
  }, [period_start, period_end]);

  const addNewTimeSlot = (e) => {
    e.preventDefault();
    const diff =
      new Date(period_end).getTime() - new Date(period_start).getTime();
    if (diff < 0) alert("Error: The time period must start BEFORE it ends.");
    else if (diff < 600000)
      alert("Each slot must be at least 10 minutes long.");
    else {
      setTimeSlots((cur) => {
        let copy = [
          ...cur,
          {
            start: period_start,
            end: period_end,
            duration: duration,
          },
        ];
        copy.sort(
          (a, b) =>
            DateTime.fromISO(a.start).toMillis() -
            DateTime.fromISO(b.start).toMillis()
        );
        return copy;
      });
    }
  };

  const deleteSlot = (i) => {
    setTimeSlots((cur) => {
      let copy = cur.slice();
      copy.splice(i, 1);
      return copy;
    });
  };

  const saveData = () => {
    setSaving(true);
    fetch("/admin/interview/interviewer/save-time-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interview_round_id: document.getElementById("interview-round-id").value,
        time_slots: time_slots,
      }),
    })
      .then((raw_response) => {
        setSaving(false);
        if (raw_response.ok) {
          alert("Saved Successfully");
        } else {
          alert("Something went wrong on the server end.");
        }
      })
      .catch((err) => {
        alert("Something went wrong. Make sure your internet is working.");
        console.log(err);
      });
  };

  return (
    <div>
      <div>
        <form
          onSubmit={addNewTimeSlot}
          className="flex justify-evenly items-center border"
        >
          <label>Slot Start: </label>
          <input
            type="datetime-local"
            value={period_start}
            onChange={(e) => {
              setPeriodStart(e.target.value);
            }}
            min={DateTime.local({ zone: "Asia/Karachi" })
              .toISO({ includeOffset: false })
              .substr(0, 16)}
            className=" bg-gray-100 px-4 py-4"
            step="60"
          ></input>
          <label>Slot End: </label>
          <input
            type="datetime-local"
            value={period_end}
            onChange={(e) => {
              setPeriodEnd(e.target.value);
            }}
            min={DateTime.local({ zone: "Asia/Karachi" })
              .toISO({ includeOffset: false })
              .substr(0, 16)}
            className=" bg-gray-100 px-4 py-4"
            step="60"
          ></input>
          <p>
            Slot Duration:{" "}
            <span className="text-red-700">
              {Duration.fromMillis(duration).toFormat(
                "hh 'hours' mm 'minutes'"
              )}
            </span>
          </p>
          <input
            type="submit"
            value="Add"
            className="py-4 px-8 cursor-pointer bg-transparent border-2 border-gray-500 hover:bg-gray-600 text-gray-600 hover:text-white"
          ></input>
        </form>
      </div>

      <h2 className="text-lg font-bold mt-8">Currently Chosen Time Slots: </h2>
      {time_slots.length < 1 ? (
        <p>No time slots selected yet.</p>
      ) : (
        <div>
          <button
            onClick={saveData}
            className="float-right mb-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white"
          >
            {saving ? (
              <i className="fas fa-spinner animate-spin"></i>
            ) : (
              <i className="fas fa-save"></i>
            )}{" "}
            Save Time Slots
          </button>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2 border">Sr. No.</th>
                <th className="p-2 border">Start Time</th>
                <th className="p-2 border">End Time</th>
                <th className="p-2 border">Duration</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {time_slots.map((time_slot, index) => (
                <tr key={index}>
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">
                    {DateTime.fromISO(time_slot.start).toLocaleString({
                      weekday: "short",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-2 border">
                    {DateTime.fromISO(time_slot.end).toLocaleString({
                      weekday: "short",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-2 border">
                    {Duration.fromMillis(time_slot.duration).toFormat(
                      "hh 'hours' mm 'minutes'"
                    )}
                  </td>
                  <td className="p-2 border ">
                    <a
                      className="cursor-pointer text-iec-blue hover:text-iec-blue-hover underline hover:no-underline"
                      data-index={index}
                      onClick={(e) => {
                        deleteSlot(e.target.dataset.index);
                      }}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App></App>, document.getElementById("app"));
