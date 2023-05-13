"use strict";

const interview_round_id = document.getElementById("interview_round_id").innerHTML;
const interviewer_id = document.getElementById("interviewer_id").innerHTML;

function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value

    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM

    time[0] = +time[0] % 12 || 12; // Adjust hours
  }

  return time.join(''); // return adjusted time or original string
}

const DatePill = _ref => {
  let {
    date,
    selectedDate,
    onToggleDate
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col border w-1/2 hover:scale-105 cursor-pointer transition-all duration-150 mb-4 rounded-md text-lg justify-center items-center p-4 ".concat(selectedDate ? "bg-iec-blue text-white border-white" : "text-iec-blue bg-white border-iec-blue"),
    onClick: () => {
      onToggleDate(date);
    }
  }, date);
};

const TimeSlotPill = _ref2 => {
  let {
    timeSlot,
    selectedTimeSlot,
    onToggleTimeSlot,
    setInterviewTime
  } = _ref2;
  //compute the interview time from start_time and end_time format as hh:mm 12 hour format
  const start_time = tConvert(new Date(new Number(timeSlot.start_time)).toISOString().slice(11, 16));
  const end_time = tConvert(new Date(new Number(timeSlot.end_time)).toISOString().slice(11, 16));
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col border w-1/2 hover:scale-105 cursor-pointer transition-all duration-150 mb-4 p-4 rounded-md text-lg justify-center items-center ".concat(selectedTimeSlot === timeSlot.id ? "bg-iec-blue text-white border-white" : "text-iec-blue bg-white border-iec-blue"),
    onClick: () => {
      onToggleTimeSlot(timeSlot.id);
      setInterviewTime({
        start_time,
        end_time
      });
    }
  }, start_time, " - ", end_time);
};

const TimeSlotPicker = () => {
  const [timeSlots, setTimeSlots] = React.useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(null);
  const [dates, setDates] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [interviewTime, setInterviewTime] = React.useState(null); //fetch available booking slots for interviewer

  React.useEffect(async () => {
    const response = await (await fetch("/student/interview/".concat(interview_round_id, "/interviewer/").concat(interviewer_id, "/booking-slots"))).json();
    const timeslots = response.booking_slots; //extract all unique dates from timeslots in the format day, moth, date

    console.log(timeslots);
    const dates = new Set(timeslots.map(timeSlots => new Date(new Number(timeSlots.start_time)).toDateString({}, {
      weekday: "long",
      month: "long",
      day: "numeric"
    }))); //convert dates from set to array

    setDates(Array.from(dates)); //group timeslots by date hh.mm format

    const timeSlotsByDate = {};
    timeslots.forEach(timeslot => {
      const date = new Date(new Number(timeslot.start_time)).toDateString({}, {
        weekday: "long",
        month: "long",
        day: "numeric"
      });

      if (timeSlotsByDate[date]) {
        timeSlotsByDate[date].push(timeslot);
      } else {
        timeSlotsByDate[date] = [timeslot];
      }
    }); //sort timeslots by start time

    for (const date in timeSlotsByDate) {
      timeSlotsByDate[date].sort((a, b) => {
        return new Number(a.start_time) - new Number(b.start_time);
      });
    }

    setTimeSlots(timeSlotsByDate);
  }, []);

  const handleToggleDate = date => {
    if (selectedDate === date) {
      setSelectedDate(null);
    } else {
      console.log(date);
      setSelectedDate(date);
    }
  };

  const handleToggleTimeSlot = timeSlot => {
    if (selectedTimeSlot === timeSlot) {
      setSelectedTimeSlot(null);
    } else {
      setSelectedTimeSlot(timeSlot);
    }
  };

  const bookSlot = async () => {
    try {
      if (selectedTimeSlot) {
        //booking a slot also sends an email
        let response = await fetch("/student/interview/".concat(interview_round_id, "/interviewer/").concat(interviewer_id, "/book-slot"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            booking_slot_id: selectedTimeSlot
          })
        });

        if (response.status == 200) {
          response = await response.json();

          if (response.success) {
            window.alert(response.message);
            window.location.href = "/student/interview";
          }
        }
      }
    } catch (err) {
      console.log(err);
      window.alert(response.message);
      window.location.href = "/student/interview";
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center content-center align-middle"
  }, /*#__PURE__*/React.createElement("section", {
    className: "p-2 w-full md:w-7/8 mx-auto mr-0 md:mt-16",
    id: "main-section"
  }, /*#__PURE__*/React.createElement("div", {
    id: "assessments-box",
    className: "bg-white w-7/8 rounded-lg m-auto"
  }, /*#__PURE__*/React.createElement("div", {
    id: "assessments-title-box",
    className: "bg-iec-blue text-white font-light px-4 py-3 rounded-t-lg"
  }, "My Interview Invites"), /*#__PURE__*/React.createElement("div", {
    id: "assessments-box-content",
    className: "px-4 py-8 overflow-x-auto grid md:grid-cols-3 grid-cols-1 grid-flow-col gap-2"
  }, dates.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "w-full ".concat(selectedDate ? "hidden md:flex md:flex-col" : "flex flex-col")
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-semibold flex items-center justify-center mb-4"
  }, "Pick a Date"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col h-full w-full items-center justify-center"
  }, dates.map(date => /*#__PURE__*/React.createElement(DatePill, {
    date: date,
    selectedDate: selectedDate,
    onToggleDate: handleToggleDate
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-semibold flex items-center justify-center mb-4"
  }, "No slots available")), selectedDate && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full ".concat(selectedDate && selectedTimeSlot ? "hidden md:flex md:flex-col" : "flex flex-col")
  }, /*#__PURE__*/React.createElement("p", {
    className: "".concat(selectedDate ? "md:hidden" : "flex justify-center items-center text-lg mb-2 border-b border-iec-blue")
  }, "Interview Date: ", selectedDate), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-semibold flex items-center justify-center mb-4"
  }, "Pick a Time"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full h-full items-center justify-center"
  }, timeSlots[selectedDate].map(timeSlot => /*#__PURE__*/React.createElement(TimeSlotPill, {
    timeSlot: timeSlot,
    selectedTimeSlot: selectedTimeSlot,
    onToggleTimeSlot: handleToggleTimeSlot,
    setInterviewTime: setInterviewTime
  })))), selectedTimeSlot && selectedDate && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-semibold flex items-center justify-center mt-4"
  }, "Your Interview Time"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full h-full items-center justify-center mt-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-lg border-b border-iec-blue"
  }, " ", selectedDate, " | ", interviewTime.start_time, " - ", interviewTime.end_time), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue text-xl text-white p-4 m-2 mt-4 rounded-md",
    onClick: bookSlot
  }, "Book Interview")))))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(TimeSlotPicker, null), document.getElementById("app"));