const useState = React.useState
const useEffect = React.useEffect

const Header = () => {
	return (
		<div className="flex w-full items-center justify-center p-4 bg-white mb-4">
			<h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-iec-blue to-green-500 p-5">
				Apply To IEC
			</h1>
		</div>
	)
}

const Input = ({
	label,
	placeholder,
	form,
	name,
	type,
	onChange = undefined,
	value = undefined,
	min,
	max,
}) => {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col gap-1 w-full">
				<label className="label">
					<span className="">{label}</span>
				</label>

				<input
					type={type}
					name={name}
					placeholder={placeholder}
					onChange={onChange}
					value={value}
					required={true}
					min={min}
					max={max}
					className="border-2 border-gray-300 rounded-lg p-2 h-12 w-full"
				/>
			</div>
		</div>
	)
}

// const DropdownComponent = ({ label, name, placeholder, options }) => {
// 	return (
// 		<div className="flex flex-col w-full">
// 			<div className="flex flex-col gap-1 w-full">
// 				<label className="label">
// 					<span className="">{label}</span>
// 				</label>

// 				<select
// 					name={name}
// 					className="border-2 border-gray-300 rounded-lg p-2 w-full"
// 					placeholder="Select employment"
// 				>
// 					<option value="" selected disabled>
// 						{placeholder}
// 					</option>
// 					{options.map((option, index) => (
// 						<option key={index} value={option}>
// 							{option}
// 						</option>
// 					))}
// 				</select>
// 			</div>
// 		</div>
// 	)
// }

const ERROR_TYPE = { EMAIL_EXISTS: 'email_exists', CNIC_EXISTS: 'cnic_exists', ALREADY_APPLIED: 'already_applied', PASSWORD_TOO_SHORT: 'password_too_short', PASSWORD_MISMATCH: 'password_mismatch' }
const STATUS_TYPES = { JUST_OPENED: 'just_opened', NEW_USER: 'new_user', EXISTING_USER: 'existing_user' }

const Error = ({ errorType, email }) => {
	return <div>
		{!!errorType && <i className="fas fa-exclamation-circle"></i>}
		{errorType === ERROR_TYPE.EMAIL_EXISTS && <p>The email you entered already exists in our database. It means you have already applied to a different IEC cohort before. But you entered a different CNIC number last time. Please use the same combination of email and CNIC as last time.<br />Or, if you think you accidentally entered the wrong CNIC number last time, you can <a href="/application/change-cnic" target="_blank" className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline">click here to change your CNIC number</a> if you remember your password from last time</p>}
		{errorType === ERROR_TYPE.CNIC_EXISTS && <p>We already have this CNIC in our database. It means you have applied to IEC in the past, but you used a different email address the last time. The email address you used last time looked something like this: {email}.<br />If that email address was correct, then please use that same email address and cnic pair.<br />If you entered a wrong email address the last time, then <a href="/application/change-email" className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline">click here to change your email address</a>.</p>}
		{errorType === ERROR_TYPE.ALREADY_APPLIED && <p>You have already applied to this Cohort of IEC. You cannot apply again. Contact IEC via email if you have any concerns.</p>}
		{errorType === ERROR_TYPE.PASSWORD_TOO_SHORT && <p>Password must be at least 8 characters long.</p>}
		{errorType === ERROR_TYPE.PASSWORD_MISMATCH && <p>Please write the same password both times. The two password fields do not match.</p>}
	</div>
}

const App = () => {
	const [CNIC, setCNIC] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [courses, setCourses] = useState([])
	const [email, setEmail] = useState("")
	const [courseInterest, setCourseInterest] = useState("")
	const [status, setStatus] = useState(STATUS_TYPES.JUST_OPENED)
	const [errorType, setErrorType] = useState("")
	const [oldEmailAddress, setOldEmailAddress] = useState("")
	//one of few discrete states, not a boolean;
	//status can be:
	// justOpened(hasn't entered email yet),
	// alreadyApplied
	// existingUser (dont ask for password)
	// newUser (ask for password)

	const handleCNIC = (e) => {
		setCNIC(formatCNIC(e.target.value))
	}

	const formatCNIC = (input) => {
		const cleanedInput = input.replace(/\D/g, "")

		if (input.length <= 5) return cleanedInput

		let formattedInput = cleanedInput
			.slice(0, 5)
			.concat("-", cleanedInput.slice(5, 12))

		if (input.length <= 13) return formattedInput

		formattedInput = formattedInput.concat("-", cleanedInput.slice(12, 13))

		return formattedInput
	}

	const checkAlreadyRegistered = async (e) => {
		e.preventDefault()
		e.stopPropagation()

		//valid responses to this request are;
		// already_applied (do not allow an application)
		// both_cnic_and_email (allow but don't ask for password)
		// cnic_only (don't allow an application, display a message of email and cnic mismatch)
		// email_only (don't ask for password)

		try {
			const response = await fetch(
				"/application/check-if-user-exists",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						application_round_id: parseInt(
							window.location.pathname.split("/")[3]
						),
						email: email,
						cnic: CNIC,
					}),
				}
			)

			const data = await response.json()

			if (!data.exists) {
				setStatus(STATUS_TYPES.NEW_USER)
				setErrorType("")
			}

			if (data.type === "both_cnic_and_email") {
				setStatus("existingUser")
				setErrorType("")
			} else if (data.type === "already_applied") {
				setErrorType(ERROR_TYPE.ALREADY_APPLIED)
			} else if (data.type === "cnic_only") {
				setOldEmailAddress(data.email)
				setErrorType(ERROR_TYPE.CNIC_EXISTS)
			} else if (data.type === 'email_only') {
				setErrorType(ERROR_TYPE.EMAIL_EXISTS)
			}
		} catch (err) {
			console.log(err)
		}
	}

	const handlePassword = (e) => {
		setPassword(e.target.value)

		if (e.target.value.length < 8) {
			setErrorType(ERROR_TYPE.PASSWORD_TOO_SHORT)
		} else {
			setErrorType("")
		}
	}

	const handleConfirmPassword = (e) => setConfirmPassword(e.target.value)

	useEffect(() => {
		if (password === confirmPassword && errorType !== ERROR_TYPE.PASSWORD_TOO_SHORT) {
			setErrorType("")
		} else {
			setErrorType(ERROR_TYPE.PASSWORD_MISMATCH)
		}
	}, [password, confirmPassword])

	const handleSubmit = async (e) => {
		e.preventDefault()
		e.stopPropagation()

		if (!!errorType) {
			alert("Please fix all errors before submitting the form. If there is a problem, email mail@iec.org.pk or reload the page.")
			return
		}
		try {
			const application_round_id = window.location.pathname.split("/")[3]

			const formData = new FormData(e.target)

			// divide name into firstname and lastname by space, if there is no lastname, set it to ""
			const name = formData.get("name").split(" ")
			const firstname = name[0]
			const lastname = name.length > 1 ? name[1] : ""
			const age = parseInt(formData.get("age"))

			const response = await fetch(
				`/application/submit/${application_round_id}/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: formData.get("email"),
						cnic: formData.get("cnic"),
						password: formData.get("password"),
						firstname: firstname,
						lastname: lastname,
						age_group: age < 22 ? 'Less than 22' : age >= 22 && age <= 35 ? '22 - 35' : 'More than 35',
						age,
						phone: formData.get("phone"),
						city: formData.get("city"),
						education_completed: formData.get("education"),
						type_of_employment: formData.get("employment"),
						firstPreferenceId: formData.get("course_interest"),

						application_round_id: application_round_id,
					}),
				}
			)

			if (response.status === 201) {
				window.location.href = "https://iec.org.pk/thankyou"
			} else {
				alert("Something went wrong. Try again or contact mail@iec.org.pk")
				console.log(response)
			}
		} catch (err) {
			console.log(err)
		}
	}

	//this effect gets the courses being offered in the current application round
	useEffect(async () => {
		//get application ID from URL
		const application_round_id = window.location.pathname.split("/")[3]

		const response = await fetch(
			`/application/${application_round_id}/courses`
		)
		const data = await response.json()
		if (data.success) {
			setCourses(data.courses)
		}
	}, [])

	return (
		<div className="bg-gradient-to-r from-iec-blue to-green-500 text-black w-full min-h-screen">
			<Header />

			<div
				id="application"
				className="flex flex-col items-center justify-center w-full"
			>
				<form
					className={`bg-white w-full md:w-1/2 shadow-lg hover:shadow-xl p-5 md:rounded-b-lg flex flex-col gap-y-5 md:gap-y-0 md:gap-x-10  transition-all duration-300`}
					name="application"
					onSubmit={handleSubmit}
				>
					<Error errorType={errorType} email={oldEmailAddress} />

					<div
						className={`flex flex-col ${status === STATUS_TYPES.JUST_OPENED ? "flex-col" : "md:flex-row"
							} gap-y-5 md:gap-y-0 md:gap-x-10 `}
					>
						<div id="left" className="flex flex-col w-full basis-full gap-y-5">
							<Input
								label="Email:"
								name="email"
								type="email"
								value={email}
								placeholder="info@info.com"
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								label="CNIC:"
								placeholder="xxxxx-xxxxxxx-x"
								name="cnic"
								type="text"
								value={CNIC}
								onChange={handleCNIC}
							/>

							{status !== STATUS_TYPES.JUST_OPENED && (
								<>
									<Input
										label="Name:"
										name="name"
										type="text"
										placeholder="Enter your name"
									/>

									{status === STATUS_TYPES.NEW_USER && (
										<>
											<Input
												label="Password:"
												name="password"
												type="password"
												placeholder="********"
												value={password}
												onChange={handlePassword}
											/>

											<Input
												label="Confirm Password:"
												name="confirm_password"
												type="password"
												placeholder="********"
												value={confirmPassword}
												onChange={handleConfirmPassword}
											/>
										</>
									)}
								</>
							)}
						</div>
						{status !== STATUS_TYPES.JUST_OPENED && (
							<div
								id="right"
								className="flex flex-col w-full basis-full gap-y-5"
							>
								<Input
									label="Phone Number:"
									name="phone"
									type="text"
									placeholder="Phone Number"
								/>
								<div className="flex flex-col gap-1 w-full">
									<Input label="Age:" name="age" type="number" min="12" max="120" placeholder="e.g. 25" />
								</div>

								<div className="flex flex-col gap-1 w-full">
									<label className="label">
										<span className="">Course Interest:</span>
									</label>

									<select
										name="course_interest"
										className="border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white"
										value={courseInterest}
										onChange={(e) => setCourseInterest(e.target.value)}
									>
										<option value="" selected disabled>
											Pick a course
										</option>
										{courses.length > 0 &&
											courses.map((course, index) => (
												<option
													key={course.id}
													value={course.id}
													className="bg-white"
												>
													{course.title}
												</option>
											))}
									</select>
								</div>

								<div className="flex flex-col gap-1 w-full">
									<label className="label">
										<span className="">City:</span>
									</label>

									<select
										name="city"
										className="border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white"
									>
										<option value="" selected disabled>
											Pick your city
										</option>
										<option value="Lahore">Lahore</option>
										<option value="Islamabad/Rawalpindi">
											Islamabad/Rawalpindi
										</option>
										<option value="Karachi">Karachi</option>
										<option value="Peshawar">Peshawar</option>
										<option value="Other">Other</option>
									</select>
								</div>

								<div className="flex flex-col gap-1 w-full">
									<label className="label">
										<span className="">Education:</span>
									</label>

									<select
										name="education"
										className="border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white"
									>
										<option value="" selected disabled>
											Select Education Status
										</option>

										<option>Only Matric</option>

										<option>Only Intermediate</option>

										<option>Bachelors (In process)</option>

										<option>Bachelors (Completed)</option>

										<option>Diploma (In process)</option>

										<option>Diploma (Completed)</option>

										<option>Postgraduate (In process)</option>

										<option>Postgraduate (Completed)</option>
									</select>
								</div>

								<div className="flex flex-col gap-1 w-full">
									<label className="label">
										<span className="">Employment:</span>
									</label>

									<select
										name="employment"
										className="border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white"
										placeholder="Select employment"
									>
										<option value="" selected disabled>
											Select Employment Status
										</option>
										<option>Employed (Full time)</option>
										<option>Employed (Part time)</option>
										<option>Jobless</option>
										<option>Freelancer</option>
									</select>
								</div>
							</div>
						)}
					</div>
					{status === STATUS_TYPES.JUST_OPENED ? (
						<button
							className="p-2 bg-gradient-to-r from-iec-blue to-green-500 text-white rounded-full hover:scale-105 transition-all duration-300 mt-6 w-1/2 self-center items-center"
							onClick={(email) => checkAlreadyRegistered(email)}
						>
							Next!
						</button>
					) : (
						<button className="p-2 bg-gradient-to-r from-iec-blue to-green-500 text-white rounded-full hover:scale-105 transition-all duration-300 mt-6 w-1/2 self-center items-center">
							Submit Application!
						</button>
					)}
				</form>
			</div>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById("app"))
