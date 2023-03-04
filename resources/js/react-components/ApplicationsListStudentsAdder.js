// eslint-disable-next-line
const ApplicationsListStudentsAdder = (props) => {
	const { applications_object, modal_object } = useContext(MyContext)
	const [applications] = applications_object
	const [filtered_applications, setFilteredApplications] = useState([])
	const [, setShowModal] = modal_object
	const [filters, setFilters] = useState([
		{
			type: 'Filter by whether or not this quiz is assigned to this student',
			selected: 0,
			modes: [
				{
					text: 'No filter',
					field: ['Student', 'already_added'],
					expected_field_values: [false, true],
				},
				{
					text: 'Show only those who were assigned this quiz',
					selected: false,
					field: ['Student', 'already_added'],
					expected_field_values: [true],
				},
				{
					text: 'Show only not those who were not assigned this quiz',
					selected: false,
					field: ['Student', 'already_added'],
					expected_field_values: [false],
				},
			],
		},
		{
			type: "Filter by whether or not this student's application was auto-rejected",
			selected: 0,
			modes: [
				{
					text: 'No filter',
					selected: true,
					field: ['rejection_email_sent'],
					expected_field_values: [false, true],
				},
				{
					text: 'Show only those who were auto rejected',
					selected: false,
					field: ['rejection_email_sent'],
					expected_field_values: [true],
				},
				{
					text: 'Show only not those who were not auto rejected',
					selected: false,
					field: ['rejection_email_sent'],
					expected_field_values: [false],
				},
			],
		},
		{
			type: 'Filter by whether or not this student was emailed about the assessment',
			selected: 0,
			modes: [
				{
					text: 'No filter',
					selected: true,
					field: ['assessment_email_sent'],
					expected_field_values: [false, true],
				},
				{
					text: 'Show only those who were emailed about assessment',
					selected: false,
					field: ['assessment_email_sent'],
					expected_field_values: [true],
				},
				{
					text: 'Show only not those who were not emailed about assessment',
					selected: false,
					field: ['assessment_email_sent'],
					expected_field_values: [false],
				},
			],
		},
	])
	const student_id_to_array_index_map = useRef({})
	const [loading, setLoading] = useState(false)
	const [saved_success, setSavedSuccess] = useState(false)
	const assignmentButton = useRef(null)
	const setLoadAgain = props.setLoadAgain
	const [show_email_composer, setShowEmailComposer] = useState(false)

	const getValue = (obj, properties_array) => {
		// if properties_array = ["Student","address"], then this funtion returns obj.Student.address
		return properties_array.reduce(
			(final_value, property) =>
				final_value == null ? null : final_value[property],
			obj
		)
	}

	useEffect(() => {
		student_id_to_array_index_map.current = {}
		for (let i = 0; i < applications.length; i++) {
			student_id_to_array_index_map.current[applications[i].Student.id] = i
		}

		setFilteredApplications(applications)
	}, [applications])

	useEffect(() => {
		setFilteredApplications(
			applications.filter((application) => {
				let show = true
				for (let i = 0; i < filters.length; i++) {
					if (
						filters[i].selected !== 0 &&
						filters[i].modes[filters[i].selected].expected_field_values.indexOf(
							getValue(application, filters[i].modes[filters[i].selected].field)
						) === -1
					) {
						show = false
					}
				}
				return show
			})
		)
	}, [filters])

	const assignQuizToSelectedStudents = () => {
		setLoading(true)
		const list_of_student_ids_to_be_added = filtered_applications
			.filter(
				(application) =>
					!application.Student.already_added && application.Student.added
			)
			.map((application) => [application.Student.id, application.id])

		if (list_of_student_ids_to_be_added.length === 0) {
			setLoading(false)
			alert('You have not selected any new students.')
			return
		}

		fetch(`/quiz/assign/${props.quiz_id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				list_of_student_ids_to_be_added,
			}),
		})
			.then((response) => {
				if (response.ok) {
					setSavedSuccess(true)
					setTimeout(() => {
						setSavedSuccess(false)
					}, 3000)
					setLoadAgain((cur) => cur + 1)
				}
			})
			.catch((err) => {
				console.log(err)
				alert('Quiz could not be assigned to Students due to an unknown error.')
			})
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<div>
			<div className="grid grid-cols-2 mb-4">
				<button
					className={
						saved_success
							? 'col-span-1 p-3 float-right bg-green-500 hover:bg-green-600 text-white cursor-pointer border-r border-white'
							: applications.length > 0
							? 'col-span-1 p-3 float-right bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer border-r border-white'
							: 'col-span-1 p-3 float-right bg-gray-600 text-white cursor-not-allowed border-r border-white'
					}
					onClick={assignQuizToSelectedStudents}
					ref={assignmentButton}
					disabled={filtered_applications.length > 0}
				>
					{loading ? (
						<i className="fas fa-spinner animate-spin"></i>
					) : !saved_success ? (
						<i className="fas fa-save"></i>
					) : (
						<i className="fas fa-check"></i>
					)}{' '}
					Step 1: Assign Quiz to Selected Students
				</button>

				<button
					className={
						applications.length > 0
							? 'col-span-1 p-3 float-right bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer border-r border-white'
							: 'col-span-1 p-3 float-right bg-gray-600 text-white cursor-not-allowed border-r border-white'
					}
					onClick={() => {
						if (
							filtered_applications
								.map((application) => application.Student)
								.filter((student) => student.added).length > 0
						)
							setShowEmailComposer((cur) => !cur)
						else alert("You haven't selected any new students.")
					}}
					disabled={applications.length > 0}
				>
					{show_email_composer ? (
						<i className="far fa-paper-plane"></i>
					) : (
						<i className="fas fa-paper-plane"></i>
					)}
					{'  '}
					Step 2: Send Emails to Selected Students
				</button>
			</div>

			{show_email_composer ? (
				<div className="mb-4">
					<p>
						Please make sure you assign this quiz to selected students first, by
						clicking on the <i className="fas fa-save"></i> Step 1 button above.
					</p>
					<EmailForm
						users={applications
							.map((application) => application.Student)
							.filter((student) => student.added)}
						sending_link={`/quiz/send-emails/${props.quiz_id}`}
						applications={applications.filter(
							(application) => application.Student.added
						)}
						default_values={{
							email_subject: 'IEC Assessment',
							email_heading: 'IEC Assessment',
							email_body:
								'Dear Student<br>You are receiving this email because you applied for the next cohort of the Institute of Emerging Careers.<br>Congratulations, your application has been shortlisted.<br>The next step is for you to solve a timed assessment. You have 3 days (72 hours) to solve this assessment.',
							email_button_pre_text:
								'Click the following button to solve the assessment.',
							email_button_label: 'Solve Assessment',
							email_button_url: 'Will be automatically set for each user',
						}}
					/>
				</div>
			) : (
				<i></i>
			)}

			<h2 className="text-base text-center mb-4">
				<b>List of Applicants of this Round to whom you can assign the Quiz</b>
			</h2>
			{applications.length === 0 ? (
				<p>No applicants in this application round.</p>
			) : (
				<div>
					<p className="mb-3 p-2">
						<span className="bg-green-400">
							The green rows are students to whom you have already sent the
							assessment email.
						</span>{' '}
						<span className="bg-gray-200">
							The gray rows are students that have already been assigned to this
							quiz.
						</span>{' '}
						<span className="bg-red-300">
							The red rows are the applicants who were rejected due to the
							auto-rejection criteria such as age.
						</span>{' '}
						<span className="bg-yellow-300">
							The yellow rows are students who were rejected due to
							auto-rejection but also assigned this quiz for some reason.
						</span>
					</p>
					<label>Filters: </label>
					<div className="flex gap-x-2">
						{filters.map((filter, filter_index) => (
							<div key={filter_index}>
								<label>{filter.type}</label>
								<select
									value={filters[filter_index].selected}
									data-filter_index={filter_index}
									onChange={(e) => {
										setFilters((cur) => {
											const copy = cur.slice()
											copy[e.target.dataset.filter_index].selected = parseInt(
												e.target.value
											)
											console.log(copy)
											return copy
										})
									}}
									className="p-2"
								>
									{filter.modes.map((filter_mode, filter_mode_index) => [
										<option value={filter_mode_index} key={filter_mode_index}>
											{filter_mode.text}
										</option>,
									])}
								</select>
							</div>
						))}
					</div>
					<p>{filtered_applications.length} rows</p>
					<table className="w-full text-left text-sm">
						<thead>
							<tr>
								<th>
									<input
										type="checkbox"
										onChange={(e) => {
											setFilteredApplications((cur) =>
												cur.map((app) => {
													app.Student.added = e.target.checked
													return app
												})
											)
										}}
									></input>{' '}
									{filtered_applications.reduce((final, app) => {
										if (final === false) return final
										if (!app.Student.added) return false
									}, true) === false
										? 'Select All'
										: 'Unselect All'}
								</th>
								<th>Name</th>
								<th>Gender</th>
								<th>Email</th>
								<th>Phone</th>
								<th>CNIC</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{filtered_applications.map((application, index) => (
								<tr
									key={application.id}
									className={
										application.assessment_email_sent
											? 'bg-green-400'
											: application.Student.already_added &&
											  application.rejection_email_sent
											? 'bg-yellow-300'
											: application.Student.already_added
											? 'bg-gray-200'
											: application.rejection_email_sent
											? ' bg-red-300'
											: ''
									}
								>
									<td className={'border px-4 py-2'}>
										<input
											type="checkbox"
											data-id={application.Student.id}
											data-index={index}
											checked={application.Student.added}
											onChange={(e) => {
												setFilteredApplications((cur) => {
													const copy = cur.slice()
													copy[e.target.dataset.index].Student.added =
														!copy[e.target.dataset.index].Student.added
													return copy
												})
											}}
										></input>
									</td>
									<td className="border px-4 py-2">{`${application.Student.firstName} ${application.Student.lastName}`}</td>
									<td className="border px-4 py-2">
										{application.Student.gender}
									</td>
									<td className="border px-4 py-2">
										{application.Student.email}
									</td>
									<td className="border px-4 py-2">{application.phone}</td>
									<td className="border px-4 py-2">
										{application.Student.cnic}
									</td>
									<td className="border px-4 py-2">
										<a
											className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"
											data-id={application.Student.id}
											onClick={(e) => {
												setShowModal(
													student_id_to_array_index_map.current[
														e.target.dataset.id
													]
												)
											}}
										>
											View Details
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
