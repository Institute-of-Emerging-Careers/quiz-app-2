const useState = React.useState;
const useEffect = React.useEffect;
const interview_round_id =
	document.getElementById("interview-round-id").innerHTML;

const StudentsList = () => {
	const [matchings, setMatchings] = useState([]);

	useEffect(async () => {
		console.log(interview_round_id);
		const response = await (
			await fetch(
				`/admin/interview/${interview_round_id}/get-assigned-students`
			)
		).json();

		if (response.matchings.length > 0) {
			setMatchings(response.matchings);
            console.log(response.matchings);
		}
	}, []);

	return (
        <div className="mt-36">
            <div className="flex flex-col items-center justify-center">
                <div className="w-1/2 flex items-center justify-center bg-white rounded-md ">
                    <p className="text-3xl font-bold p-4 w-full">Assigned students</p>
                </div>
                <div className="w-full flex items-center justify-center mt-10">

                    {matchings.length > 0 ? 
                    <table className="table-auto bg-white rounded-md w-1/2">
                        <thead>
                            <tr>
                                <th className="border border-gray-200 px-4 py-2">Sr. No</th>
                                <th className="border border-gray-200 px-4 py-2">Student Email</th>
                                <th className="border border-gray-200 px-4 py-2">Student Name</th>
                                <th className="border border-gray-200 px-4 py-2">Student CNIC</th>
                                <th className="border border-gray-200 px-4 py-2">Student Gender</th>
                                <th className="border border-gray-200 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                                <tbody>
                                    {matchings.map((matching, index) => (
                                        <tr key={matching.id}>
                                            <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                                            <td className="border border-gray-200 px-4 py-2">{matching.student_email}</td>
                                            <td className="border border-gray-200 px-4 py-2">{matching.firstName + " " + matching.lastName}</td>
                                            <td className="border border-gray-200 px-4 py-2">{matching.cnic}</td>
                                            <td className="border border-gray-200 px-4 py-2">{matching.gender}</td>
                                            <td className="border border-gray-200 px-4 py-2">
                                                <button className="text-green-500">
                                                    <a href={`/admin/interview/${interview_round_id}/student/${matching.StudentId}/enter-marks`}>Enter Marks </a>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                    </table>
                    : 
                    <div>
                        No students have been assigned to you yet
                    </div>}
                </div>
            </div>
        </div>
	);
};

ReactDOM.render(<StudentsList />, document.getElementById("app"));
