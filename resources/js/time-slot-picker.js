const useState = React.useState;
const useEffect = React.useEffect;
const { DateTime, Duration } = luxon;

const App = () => {
  const [time_slots, setTimeSlots] = useState([]);
  const [show_new_time_slot_form, setShowNewTimeSlotForm] = useState(false);
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
  const [duration, setDuration] = useState("0");

  useEffect(() => {
    const start = new Date(period_start);
    const end = new Date(period_end);
    const diff = end.getTime() - start.getTime();
    setDuration(diff);
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
            start: DateTime.fromISO(period_start),
            end: DateTime.fromISO(period_end),
            duration: duration,
          },
        ];
        copy.sort((a, b) => a.start.toMillis() - b.start.toMillis());
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

  return (
    <div>
      {show_new_time_slot_form ? (
        <div>
          <form onSubmit={addNewTimeSlot} className="flex gap-x-4 items-center">
            <label>Period Start: </label>
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
            <label>Period End: </label>
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
            <input
              type="submit"
              value="Add"
              className="py-4 px-8 cursor-pointer bg-green-500 hover:bg-green-600 text-white"
            ></input>
          </form>
          <p>
            Duration:{" "}
            <span className="text-red-700">
              {Duration.fromMillis(duration).toFormat(
                "hh 'hours' mm 'minutes'"
              )}
            </span>
          </p>
        </div>
      ) : (
        <button
          onClick={() => {
            setShowNewTimeSlotForm((cur) => true);
          }}
          className="py-3 px-6 bg-iec-blue text-white mt-4 cursor-pointer hover:bg-iec-blue-hover"
        >
          Add New Time Slot
        </button>
      )}

      <h2 className="text-lg font-bold mt-4">Currently Chosen Time Slots: </h2>
      {time_slots.length < 1 ? (
        <p>No time slots selected yet.</p>
      ) : (
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
                  {time_slot.start.toLocaleString({
                    weekday: "short",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-2 border">
                  {time_slot.end.toLocaleString({
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
      )}
    </div>
  );
};

ReactDOM.render(<App></App>, document.getElementById("app"));
