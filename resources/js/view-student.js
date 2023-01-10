const useState = React.useState;
const useEffect = React.useEffect;
const interview_round_id =
	document.getElementById("interview-round-id").innerHTML;
const student_id = document.getElementById("student-id").innerHTML;

// need to fetch all questions for this interview round
// then take input for all those questions
// insert the answers into the Answers table

const ViewStudent = () => {
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [totalMarks, setTotalMarks] = useState(0);
	const [obtainedMarks, setObtainedMarks] = useState(0);

	//fetch questions for this cohort on mount
	useEffect(async () => {
		try {
			const response = await (
				await fetch(`/admin/interview/${interview_round_id}/all-questions`)
			).json();

			if (response.questions.length > 0) setQuestions(response.questions);

		} catch (err) {
			console.log(err);
			window.alert("An error occured, please refresh the page");
		}
	}, []);

	//fetch answers to those questions for this student
	useEffect(async () => {
		try {
			const response = await (
				await fetch(
					`/admin/interview/${interview_round_id}/student/${student_id}/view-marks`
				)
			).json();
			
			if(response.success == "ok"){				
				if (response.answers.length > 0) setAnswers(response.answers);
				if (response.totalMarks) setTotalMarks(response.totalMarks);
				if (response.obtainedMarks) setObtainedMarks(response.obtainedMarks);
			}

		} catch (err) {
			console.log(err);

		}
	}, []);

	const addAnswers = (e) => {
		e.preventDefault();
		let answers = [];

		questions.map((question) => {
			const value = e.target.elements.namedItem(question.questionID).value;
			answers = [
				...answers,
				{
					questionID: question.questionID,
					questionAnswer: question.questionType == "descriptive" ? value : null,
					questionScale: question.questionType == "descriptive" ? null : value,
				},
			];
		});

		//compute total marks from number scale answers

		const totalMarks = questions.reduce((total, question) => {
			if (question.questionType == "number scale") {
				return total + parseInt(question.questionScale);
			}

			return total + 0;
		}, 0);

		//compute obtained marks from number scale answers

		const obtainedMarks = answers.reduce((total, answer) => {
			if (answer.questionScale) {
				return total + parseInt(answer.questionScale);
			}

			return total + 0;
		}, 0);

		//insert answers into Answers table
		answers.map(async (answer) => {
			try {
				const response = await fetch(
					`/admin/interview/${interview_round_id}/student/${student_id}/enter-marks`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(answer),
					}
				);
				if (response.status == 200) {
					//insert total marks and obtained marks into Marks table
					const response = await fetch(
						`/admin/interview/${interview_round_id}/student/${student_id}/total-marks`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								totalMarks: totalMarks,
								obtainedMarks: obtainedMarks,
							}),
						}
					);

					if (response.status == 200) {
						window.alert("Marks added successfully");
						window.location.href = `/admin/interview/${interview_round_id}/view-students`;
					}
				}
			} catch (err) {
				console.log(err);
				window.alert("An error occured, please refresh the page");
			}
		});
	};

	return (
		<div className="mt-36 mx-10">
			<div className="flex flex-col items-center justify-center ">
				<div className="w-full flex bg-white rounded-md">
					<p className="text-3xl font-bold p-4 w-full self-start justify-items-start">Marking Criteria</p>


					{totalMarks > 0 ? (
						<div className="flex flex-col items-left justify-center self-end justify-self-end p-4 m-10">
							<p className="text-2xl font-bold">Total Marks: {totalMarks}</p>
							<p className="text-2xl font-bold">Obtained Marks: {obtainedMarks}</p>

							<p className="text-2xl font-bold">
								Percentage: {((obtainedMarks / totalMarks) * 100).toFixed(2)}%
							</p>
						</div>
					) : null}
				</div>

				<div className="mt-10 mx-10 bg-white rounded-md flex flex-col p-10 w-full ">
					{questions.length > 0 ? (
						<form onSubmit={addAnswers}>
							<div className="">
								{questions.map((question, index) => {
									return question.questionType == "descriptive" ? (
										<div className="flex flex-col items-left justify-left mt-10">
											<div className="w-full flex items-left justify-left">
												<p className="text-2xl font-bold">
													{question.question}
												</p>
											</div>
											<div className="w-full flex items-left justify-left mt-4">
												<textarea
													className="w-full h-40 border border-black rounded-md p-2"
													name={question.questionID}
													type="text"
													placeholder="Enter answer here"
													defaultValue = {
														answers.length > 0 ? 
															answers.find((answer) => answer.questionID == question.questionID).questionAnswer
															: null
													}
												>

												</textarea>
											</div>
										</div>
									) : (
										<div className="flex flex-col items-left justify-left mt-10">
											<div className="w-full flex items-left justify-left">
												<p className="text-2xl font-bold">
													{question.question}
												</p>
											</div>
											<div className="w-full flex items-left justify-left mt-4">
												<div className="flex flex-row items-left justify-left">
													<div className="flex items-left justify-left">
														<input
															className="w-20 h-10 border border-black rounded-md p-2 outline-none appearance-none"
															type="number"
															name={question.questionID}
															max={question.questionScale}
															defaultValue = {
																answers.length > 0 ? 
																	answers.find((answer) => answer.questionID == question.questionID).questionRating
																	: null
																}
														></input>
													</div>
													<div className="flex items-left justify-left">
														<p className="ml-2 text-xl font-bold">
															/ {question.questionScale}
														</p>
													</div>
												</div>
											</div>
										</div>
									);
								})}

								<div className="w-full flex items-center justify-center mt-10">
									<button
										type="submit"
										className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 h-20 rounded"
									>
										Submit
									</button>
								</div>
							</div>
						</form>
					) : (
						<div>No questions have been created yet</div>
					)}
				</div>
			</div>
		</div>
	);
};

ReactDOM.render(<ViewStudent />, document.getElementById("app"));
