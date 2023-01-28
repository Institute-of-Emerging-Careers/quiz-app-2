const useState = React.useState;
const useEffect = React.useEffect;
const interview_round_id =
	document.getElementById("interview-round-id").innerHTML;

const tConvert = (time) => {
	// Check correct time format and split into components
	time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
		time,
	];

	if (time.length > 1) {
		// If time format correct
		time = time.slice(1); // Remove full string match value
		time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
		time[0] = +time[0] % 12 || 12; // Adjust hours
	}
	return time.join(""); // return adjusted time or original string
};

const StudentsList = () => {
	const [matchings, setMatchings] = useState([]);

	useEffect(async () => {
		const response = await (
			await fetch(
				`/admin/interview/${interview_round_id}/get-assigned-students`
			)
		).json();

		if (response.matchings.length > 0) {
            console.log(response.matchings);
			setMatchings(response.matchings);
		}
	}, []);

	return (
		<div className="mt-36">
			<div className="flex flex-col items-center justify-center">
				<div className="w-1/2 flex items-center justify-center bg-white rounded-md ">
					<p className="text-3xl font-bold p-4 w-full flex justify-center items-center">Assigned students</p>
				</div>
				<div className="w-full flex items-center justify-center mt-10">
					{matchings.length > 0 ? (
						<table className="table-auto bg-white rounded-md w-3/4">
							<thead>
								<tr className = "bg-gray-700 text-white">
									<th className="border border-gray-200 px-4 py-2 m-2">Sr. No</th>
									<th className="border border-gray-200 px-4 py-2 m-2">
										Student Email
									</th>
									<th className="border border-gray-200 px-4 py-2 m-2">
										Student Name
									</th>
									<th className="border border-gray-200 px-4 py-2 m-2">
										Student CNIC
									</th>
									<th className="border border-gray-200 px-4 py-2 m-2">
										Student Gender
									</th>
									<th className="border border-gray-200 px-4 py-2 m-2">
										Booking Status
									</th>
									<th className="border border-gray-200 px-4 py-2 m-2">
										Interview Status
									</th>

									<th className="border border-gray-200 px-4 py-2 m-2">Actions</th>
								</tr>
							</thead>
							<tbody>
								{matchings.map((matching, index) => (
									<tr key={matching.id} className = "bg-gray-300">
										<td className="border border-gray-200 px-4 py-2">
											{index + 1}
										</td>
										<td className="border border-gray-200 px-4 py-2">
											{matching.student_email}
										</td>
										<td className="border border-gray-200 px-4 py-2">
											{matching.firstName + " " + matching.lastName}
										</td>
										<td className="border border-gray-200 px-4 py-2">
											{matching.cnic}
										</td>
										<td className="border border-gray-200 px-4 py-2">
											{matching.gender}
										</td>
										<td className="border border-gray-200 px-4 py-2">
											{matching.booked ?
                                                new Date(new Number(matching.startTime)).toDateString() + " , " +
												tConvert(new Date(new Number(matching.startTime)).toISOString().slice(11, 16)) +
												  " - " +
												tConvert(new Date(new Number(matching.endTime)).toISOString().slice(11, 16))
												: "No slot booked"}
										</td>
										<td className="border border-gray-200 px-4 py-2">
											{matching.studentAbsent === true
												? "Absent"
												: matching.studentAbsent == null
												? "Unmarked"
												: "Marked"}
										</td>
										<td className="border border-gray-200 px-4 py-2">
											<button className="text-green-500">
												<a
													href={`/admin/interview/${interview_round_id}/student/${matching.StudentId}/enter-marks`}
												>
													Enter Marks{" "}
												</a>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div>No students have been assigned to you yet</div>
					)}
				</div>
			</div>
		</div>
	);
};

ReactDOM.render(<StudentsList />, document.getElementById("app"));
