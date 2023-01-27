const interview_round_id =
	document.getElementById("interview_round_id").innerHTML;
const interviewer_id = document.getElementById("interviewer_id").innerHTML;

const DatePill = ({ date, selectedDate, onToggleDate }) => {
	return (
		<div
			className={`flex flex-col border w-1/2 hover:scale-105 cursor-pointer transition-all duration-150 mb-4 rounded-md text-lg justify-center items-center p-4 ${
				selectedDate
					? "bg-iec-blue text-white border-white"
					: "text-iec-blue bg-white border-iec-blue"
			}`}
			onClick={() => {
				onToggleDate(date);
			}}
		>
			{date}
		</div>
	);
};

const TimeSlotPill = ({ timeSlot, selectedTimeSlot, onToggleTimeSlot, setInterviewTime }) => {
	//compute the interview time from start_time and end_time
	const start_time = new Date(new Number(timeSlot.start_time) + 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	const end_time = new Date(new Number(timeSlot.end_time) + 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	return (
		<div
			className={`flex flex-col border w-1/2 hover:scale-105 cursor-pointer transition-all duration-150 mb-4 p-4 rounded-md text-lg justify-center items-center ${
				selectedTimeSlot === timeSlot.id
					? "bg-iec-blue text-white border-white"
					: "text-iec-blue bg-white border-iec-blue"
			}`}
			onClick={() => {
				onToggleTimeSlot(timeSlot.id);
				setInterviewTime({start_time, end_time})
			}}
		>
			{start_time} - {end_time}
		</div>
	);
};

const TimeSlotPicker = () => {
	const [timeSlots, setTimeSlots] = React.useState([]);
	const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(null);
	const [dates, setDates] = React.useState([]);
	const [selectedDate, setSelectedDate] = React.useState(null);
	const [interviewTime, setInterviewTime] = React.useState(null);


	//fetch available booking slots for interviewer
	React.useEffect(async () => {
		const response = await (
			await fetch(
				`/student/interview/${interview_round_id}/interviewer/${interviewer_id}/booking-slots`
			)
		).json();

		const timeslots = response.booking_slots;

		//extract all unique dates from timeslots
		const dates = new Set(
			timeslots.map((timeSlots) =>
				new Date(new Number(timeSlots.start_time))
					.toDateString()
					.split(" ")
					.slice(1)
					.join(" ")
			)
		);
		//convert dates from set to array
		setDates(Array.from(dates));

		//group timeslots by date
		const timeSlotsByDate = {};
		timeslots.forEach((timeslot) => {
			const date = new Date(new Number(timeslot.start_time))
				.toDateString()
				.split(" ")
				.slice(1)
				.join(" ");
			if (timeSlotsByDate[date]) {
				timeSlotsByDate[date].push(timeslot);
			} else {
				timeSlotsByDate[date] = [timeslot];
			}
		});

		//sort timeslots by start time
		for (const date in timeSlotsByDate) {
			timeSlotsByDate[date].sort((a, b) => {
				return new Number(a.start_time) - new Number(b.start_time);
			});
		}
		



		setTimeSlots(timeSlotsByDate);
	}, []);

	const handleToggleDate = (date) => {
		if (selectedDate === date) {
			setSelectedDate(null);
		} else {
			console.log(date);
			setSelectedDate(date);
		}
	};

	const handleToggleTimeSlot = (timeSlot) => {
		if (selectedTimeSlot === timeSlot) {
			setSelectedTimeSlot(null);
		} else {
			setSelectedTimeSlot(timeSlot);
		}
	};

	const bookSlot =  async () => {
		try{
			if (selectedTimeSlot) {
				//booking a slot also sends an email
				let response = await fetch(`/student/interview/${interview_round_id}/interviewer/${interviewer_id}/book-slot`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						booking_slot_id: selectedTimeSlot,
					}),
				});

				if (response.status == 200){

					response = await response.json();

					if (response.success) {
						window.alert(response.message);
						window.location.href = "/student/interview";
					}
				}
			}
		} catch (err){
			console.log(err)
			window.alert(response.message);
			window.location.href = "/student/interview";
		}
	}

	return (
		<div className="flex items-center content-center align-middle">
			<section
				className="p-2 w-full md:w-7/8 mx-auto mr-0 md:mt-16"
				id="main-section"
			>
				<div id="assessments-box" className="bg-white w-7/8 rounded-lg m-auto">
					<div
						id="assessments-title-box"
						className="bg-iec-blue text-white font-light px-4 py-3 rounded-t-lg"
					>
						My Interview Invites
					</div>
					<div
						id="assessments-box-content"
						className="px-4 py-8 overflow-x-auto grid md:grid-cols-3 grid-cols-1 grid-flow-col gap-2"
					>
						{dates.length > 0 ? (
						<div className = {`w-full ${selectedDate ? "hidden md:flex md:flex-col" : "flex flex-col"}`} >
							<p className = "text-2xl font-semibold flex items-center justify-center mb-4">Pick a Date</p>
							<div className="flex flex-col h-full w-full items-center justify-center">
								{dates.map((date) => (
									<DatePill
										date={date}
										selectedDate={selectedDate}
										onToggleDate={handleToggleDate}
									/>
								))}
							</div>
						</div>
						)
						:
						<div className = "flex flex-col w-full">
							<p className = "text-2xl font-semibold flex items-center justify-center mb-4">No slots available</p>
						</div>
						}

						{selectedDate && (
							<div className = {`flex flex-col w-full ${selectedDate && selectedTimeSlot ? "hidden md:flex md:flex-col" : "flex flex-col"}`}>
								<p className={`${selectedDate ? "md:hidden" : "flex justify-center items-center text-lg mb-2 border-b border-iec-blue"}`}>Interview Date: {selectedDate}</p>

								<p className = {`text-2xl font-semibold flex items-center justify-center mb-4`}>Pick a Time</p>

								<div className="flex flex-col w-full h-full items-center justify-center">
									{timeSlots[selectedDate].map((timeSlot) => (
										<TimeSlotPill
											timeSlot={timeSlot}
											selectedTimeSlot={selectedTimeSlot}
											onToggleTimeSlot={handleToggleTimeSlot}
											setInterviewTime={setInterviewTime}
										/>
									))}
								</div>
							</div>
						)}

						{selectedTimeSlot && selectedDate && (
							<div className = "flex flex-col w-full">
								<p className = "text-2xl font-semibold flex items-center justify-center mt-4">Your Interview Time</p>

								<div className="flex flex-col w-full h-full items-center justify-center mt-4">
									<p className = "text-lg border-b border-iec-blue"> {selectedDate} | {interviewTime.start_time} - {interviewTime.end_time}</p>

									<button className = "bg-iec-blue text-xl text-white p-4 m-2 mt-4 rounded-md" onClick = {bookSlot}>
										Book Interview
									</button>

								</div>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

ReactDOM.render(<TimeSlotPicker />, document.getElementById("app"));
