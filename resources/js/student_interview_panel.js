const useState = React.useState;
const useEffect = React.useEffect;

const StudentInterviewPanel = (props) => {
	const [matchings, setMatchings] = useState(null);

	useEffect(() => {
		fetch("/student/matching")
			.then((response) => response.json())
			.then((data) => {
				console.log("data.length", data.length)
				if (data.length > 0) {
					setMatchings(data);
				}
			});
	}, []);

	return (
		<div className="bg-gradient-to-br from-green-300 to-blue-300 min-h-screen">
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
							className="px-10 py-8 overflow-x-auto"
						>
							{matchings == null ? (
								<p>
									Sorry, you have not received an invitation for the interview yet.
								</p>
							) : (
								<table className="w-full text-left mytable">
									<thead className="bg-gray-200">
										<tr>
											<th>Interviewer Name</th>
											<th>Interviewer Email</th>
											<th>Invitation sent to pick a time </th>
											<th>Interview Time</th>
										</tr>
									</thead>
									<tbody>
                                            {matchings.map((matching) => (
                                                <tr>
													<td>{matching.interviewer_name}</td>
													<td>{matching.interviewer_email}</td>
													<td>{(new Date(matching.createdAt)).toLocaleDateString()}</td>
													<td>
														<a href={`/student/interview/${matching.interview_round_id}/pick-timeslot/${matching.interviewer_id}`}>
															<button className= {`text-white rounded-md shadow-sm text-md hover:scale-105 p-4 ${matching.booked ? "bg-gray-300" : "bg-iec-blue"}`} disabled = {matching.booked? true : false} 
															>
																{matching.booked ? "Already Booked" : "PICK A TIME SLOT"}
															</button>
														</a>
													</td>
                                                </tr>
												
                                            ))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

ReactDOM.render(<StudentInterviewPanel />, document.getElementById("app"));
