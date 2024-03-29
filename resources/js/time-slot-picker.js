const useState = React.useState;
const useEffect = React.useEffect;
const { DateTime, Duration, Interval } = luxon;

const App = () => {
  const [time_slots, setTimeSlots] = useState([]);
  const [all_other_time_slots, setAllOtherTimeSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [num_zoom_accounts, setNumZoomAccounts] = useState(3);
  // num_zoom_accounts refers to the maximum number of interviewers that can be conducting interviews at any given moment
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
  const [period_start_draft, setPeriodStartDraft] = useState(period_start);
  const [period_end_draft, setPeriodEndDraft] = useState(period_end);
  const [editing_start, setEditingStart] = useState(false);
  const [editing_end, setEditingEnd] = useState(false);

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
              console.log(response.all_other_time_slots);
              const formatted_other_time_slots =
                response.all_other_time_slots.map((slot) => {
                  return {
                    start: DateTime.fromISO(slot.start, {
                      zone: "Asia/Karachi",
                    }),
                    end: DateTime.fromISO(slot.end, { zone: "Asia/Karachi" }),
                  };
                });
              setAllOtherTimeSlots(formatted_other_time_slots);
              setNumZoomAccounts(response.num_zoom_accounts);
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
    if (diff.isValid) setDuration(diff.toMillis());
    else setDuration(0);
  }, [period_start, period_end]);

  const addNewTimeSlot = (e) => {
    const start = DateTime.fromISO(period_start);
    const end = DateTime.fromISO(period_end);
    e.preventDefault();

    const diff =
      new Date(period_end).getTime() - new Date(period_start).getTime();
    if (diff < 0) alert("Error: The time period must start BEFORE it ends.");
    else if (diff < 600000) {
      alert("Each slot must be at least 10 minutes long.");
    }
    // checking if the selected time slot overlaps with more than {num_zoom_accounts} of the any of the other interviewers' slots
    else if (
      all_other_time_slots.reduce((num_overlaps, cur) => {
        if (
          Interval.fromDateTimes(start, end).overlaps(
            Interval.fromDateTimes(cur.start, cur.end)
          )
        )
          return num_overlaps + 1;
        else return num_overlaps;
      }, 0) < num_zoom_accounts
    ) {
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
    } else {
      alert(
        `Oh no! ${num_zoom_accounts} other interviewers have selected this same slot. We only have ${num_zoom_accounts} zoom accounts, so more than ${num_zoom_accounts} interviewers cannot conduct interviews at the same time. Please pick a different time slot.`
      );
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
          {!editing_start ? (
            <div>
              <span className="bg-gray-200 border p-4">
                {DateTime.fromISO(period_start).toLocaleString({
                  weekday: "short",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <a
                onClick={() => {
                  setEditingStart(true);
                }}
                className="text-iec-blue hover:text-iec-blue-hover cursor-pointer"
              >
                <i class="far fa-edit"></i> Edit
              </a>
            </div>
          ) : (
            <div>
              <input
                type="datetime-local"
                value={period_start_draft}
                onChange={(e) => {
                  setPeriodStartDraft(e.target.value);
                }}
                min={DateTime.local({ zone: "Asia/Karachi" })
                  .toISO({ includeOffset: false })
                  .substr(0, 16)}
                className=" bg-gray-100 px-4 py-4"
                step="60"
              ></input>
              <button
                type="button"
                onClick={() => {
                  setPeriodStart(period_start_draft);
                  setEditingStart(false);
                }}
                className="p-4 bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer"
              >
                Set
              </button>
            </div>
          )}
          {!editing_end ? (
            <div>
              <span className="bg-gray-200 border p-4">
                {DateTime.fromISO(period_end).toLocaleString({
                  weekday: "short",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <a
                onClick={() => {
                  setEditingEnd(true);
                }}
                className="text-iec-blue hover:text-iec-blue-hover cursor-pointer"
              >
                <i class="far fa-edit"></i> Edit
              </a>
            </div>
          ) : (
            <div>
              <input
                type="datetime-local"
                value={period_end_draft}
                onChange={(e) => {
                  setPeriodEndDraft(e.target.value);
                }}
                min={DateTime.local({ zone: "Asia/Karachi" })
                  .toISO({ includeOffset: false })
                  .substr(0, 16)}
                className=" bg-gray-100 px-4 py-4"
                step="60"
              ></input>
              <button
                type="button"
                onClick={() => {
                  setPeriodEnd(period_end_draft);
                  setEditingEnd(false);
                }}
                className="p-4 bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer"
              >
                Set
              </button>
            </div>
          )}

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
              {time_slots.map((time_slot, index) =>
                DateTime.fromISO(time_slot.start).isValid &&
                DateTime.fromISO(time_slot.end).isValid ? (
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
                ) : (
                  <tr></tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App></App>, document.getElementById("app"));
