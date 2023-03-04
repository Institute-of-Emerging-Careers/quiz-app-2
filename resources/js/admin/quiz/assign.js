const MyContext = React.createContext()
const useEffect = React.useEffect
const useState = React.useState
const useContext = React.useContext

const ContextProvider = (props) => {
	const [applications, setApplications] = useState([])
	const [show_modal, setShowModal] = useState(-1) // value is set to the array index of the application whose details are to be shown by the modal

	return (
		<MyContext.Provider
			value={{
				applications_object: [applications, setApplications],
				modal_object: [show_modal, setShowModal],
			}}
		>
			{props.children}
		</MyContext.Provider>
	)
}

const App = () => {
	const { applications_object } = useContext(MyContext)
	const [, setApplications] = applications_object
	const [application_rounds, setApplicationRounds] = useState([])
	const [assigned_students, setAssignedStudents] = useState([])
	const [load_again, setLoadAgain] = useState(0)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		fetch('/admin/application/rounds/all')
			.then((raw_response) => {
				if (!raw_response.ok) {
					alert(
						'Something went wrong while getting application rounds. Error code 01.'
					)
				} else {
					raw_response
						.json()
						.then((response) => {
							setApplicationRounds(response.application_rounds)
						})
						.catch((err) => {
							console.log(err)
							alert(
								"Error while understanding the server's response. Error code 02."
							)
						})
				}
			})
			.catch((err) => {
				alert(
					'Please check your internet connection and try again. Error code 03.'
				)
				console.log(err)
			})
	}, [])

	useEffect(() => {
		fetch(
			`/quiz/all-assignees/${document.getElementById('quiz-id-field').value}`
		)
			.then((raw_response) => {
				if (!raw_response.ok) {
					alert(
						'Something went wrong while getting current list of students to whom this quiz is assigned. Error code 01.'
					)
				} else {
					raw_response
						.json()
						.then((response) => {
							setAssignedStudents(response)
						})
						.catch((err) => {
							console.log(err)
							alert(
								"Error while understanding the server's response about current list of assignees. Error code 02."
							)
						})
				}
			})
			.catch((err) => {
				alert(
					'Please check your internet connection and try again. Error code 03.'
				)
				console.log(err)
			})
	}, [load_again])

	const displayApplicationRoundStudents = (e) => {
		setLoading(true)
		const application_round_id = e.target.value
		console.log('hi')
		fetch(
			`/admin/application/all-applicants-and-quiz-assignments?application_round_id=${application_round_id}&quiz_id=${
				document.getElementById('quiz-id-field').value
			}`
		)
			.then((raw_response) => {
				if (raw_response.ok) {
					raw_response.json().then((response) => {
						setApplications(response.applications)
					})
				} else {
					alert('Something went wrong. Code 01.')
				}
			})
			.catch((err) => {
				console.log(err)
				alert('Something went wrong. Code 02.')
			})
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<div>
			<div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
				<StudentsList
					students={assigned_students}
					title="List of Students to whom this Quiz is currently Assigned"
					fields={[
						{ title: 'Name', name: ['Student.firstName', 'Student.lastName'] },
						{ title: 'Email', name: ['Student.email'] },
						{ title: 'CNIC', name: ['Student.cnic'] },
					]}
				/>
			</div>
			<div className="p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm">
				{/* Application Round Selector for importing Students List */}
				<section>
					<h2 className="text-bold text-xl mb-2">
						Assign Quiz to more Students
					</h2>
					<label>Select an Application Round: </label>
					<select
						value={''}
						onChange={displayApplicationRoundStudents}
						className="py-2 px-3"
					>
						<option value="" disabled hidden>
							Select an option
						</option>
						{application_rounds.map((round) => (
							<option key={round.id} value={round.id}>
								{round.title}
							</option>
						))}
					</select>
					{loading ? <i className="fas fa-spinner animate-spin"></i> : <i></i>}
				</section>

				{/* Displaying student list of selected application round */}
				<section className="mt-6">
					<ApplicantDetailsModal></ApplicantDetailsModal>
					<ApplicationsListStudentsAdder
						quiz_id={document.getElementById('quiz-id-field').value}
						setLoadAgain={setLoadAgain}
					></ApplicationsListStudentsAdder>
				</section>
			</div>
		</div>
	)
}

ReactDOM.render(
	<ContextProvider>
		<App />
	</ContextProvider>,
	document.getElementById('app')
)
