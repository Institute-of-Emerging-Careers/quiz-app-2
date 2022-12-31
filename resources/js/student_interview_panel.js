const useState = React.useState;
const useEffect = React.useEffect;

const StudentInterviewPanel = (props) => {
	const [matchings, setMatchings] = useState(null);

	useEffect(() => {
		fetch("/student/matching/calendly_invite")
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
                                            <th>Student Email</th>
											<th>Invited at</th>
											<th>Interviewer Email</th>
											<th>Interviewer Calendly Link</th>
										</tr>
									</thead>
									<tbody>
                                            {matchings.map((matching) => (
                                                <tr>
                                                <td>{matching.student_email}</td>
                                                <td>{(new Date(matching.createdAt)).toLocaleDateString()}</td>
                                                <td>{matching.interviewer_email}</td>
                                                <td><a href = {matching.calendly_link} >{matching.calendly_link}</a></td>
                                                </tr>
                                            ))}

											{/* <td><%=orientations[i].title%></td>  
                        <td><%=DateTime.fromJSDate(new Date(orientations[i].date)).toFormat('cccc, dd LLLL yyyy')%></td>  
                        <td><%=orientations[i].time%></td>  
                        <td><a href="<%=orientations[i].meeting_link%>" target="_blank" className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"><%=orientations[i].meeting_link%></a></td>   */}
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
