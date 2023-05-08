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
	error,
	readonly = false,
}) => {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col gap-1 w-full">
				<label className="label">
					<span className="">{label}</span>
				</label>
				{!!error && <p><i className="fas fa-exclamation-circle text-red-500"></i> {error}</p>}
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
					readOnly={readonly}
				/>
			</div>
		</div>
	)
}

const ERROR_TYPE = { EMAIL_EXISTS: 'email_exists', CNIC_EXISTS: 'cnic_exists', ALREADY_APPLIED: 'already_applied', PASSWORD_TOO_SHORT: 'password_too_short', PASSWORD_MISMATCH: 'password_mismatch' }
const STATUS_TYPES = { JUST_OPENED: 'just_opened', NEW_USER: 'new_user', EXISTING_USER: 'existing_user' }

const ErrorDisplay = ({ errorType, email }) => {
	return <div className="flex items-center gap-x-2">
		{!!errorType && <i className="fas fa-exclamation-circle text-red-500"></i>}
		{errorType === ERROR_TYPE.EMAIL_EXISTS && <p>The email you entered already exists in our database. It means you have already applied to a different IEC cohort before. But you entered a different CNIC number last time. Please use the same combination of email and CNIC as last time.<br />Or, if you think you accidentally entered the wrong CNIC number last time, you can <a href="/application/change-cnic" target="_blank" className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline">click here to change your CNIC number</a> if you remember your password from last time</p>}
		{errorType === ERROR_TYPE.CNIC_EXISTS && <p>We already have this CNIC in our database. It means you have applied to IEC in the past, but you used a different email address the last time. The email address you used last time looked something like this: {email}.<br />If that email address was correct, then please use that same email address and cnic pair.<br />If you entered a wrong email address the last time, then <a href="/application/change-email" className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline">click here to change your email address</a>.</p>}
		{errorType === ERROR_TYPE.ALREADY_APPLIED && <p>You have already applied to this Cohort of IEC. You cannot apply again. Contact IEC via email on mail@iec.org.pk if you have any concerns.</p>}
		{errorType === ERROR_TYPE.PASSWORD_TOO_SHORT && <p>Password must be at least 8 characters long.</p>}
		{errorType === ERROR_TYPE.PASSWORD_MISMATCH && <p>Please write the same password both times. The two password fields do not match.</p>}
	</div>
}

/*
<option value="Lahore">Lahore</option>
										<option value="Islamabad/Rawalpindi">
											Islamabad/Rawalpindi
										</option>
										<option value="Karachi">Karachi</option>
										<option value="Peshawar">Peshawar</option>
										<option value="Other">Other</option>
*/

const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const cnic_regex = /^(\d{5})-(\d{7})-(\d{1})$/

const validationSchema = {
	email: {
		required: true,
		regex: email_regex,
	},
	cnic: {
		required: true,
		regex: cnic_regex,
	},
	password: {
		required: true,
		min_length: 8,
	},
	name: {
		required: true,
		min_length: 3,
		max_length: 100,
	},
	age: {
		required: true,
		is_int: true,
		min: 12,
		max: 120,
	},
	phone: {
		required: true,
		regex: /^(\+?\d{1,3})?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/,
	},
	city: {
		required: true,
		is_in: ["Lahore", "Islamabad/Rawalpindi", "Karachi", "Peshawar", "Other"]
	},
	education: {
		required: true,
		is_in: ["Only Matric", "Only Intermediate", "Bachelors (In process)", "Bachelors (Completed)", "Diploma (In process)", "Diploma (Completed)", "Postgraduate (In process)", "Postgraduate (Completed)"],
	},
	employment: {
		required: true,
		is_in: ["Employed (Full time)", "Employed (Part time)", "Jobless", "Freelancer"],
	},
	course_interest: {
		required: true,
	},
}

function validate(formData) {
	console.log(validationSchema.course_interest)
	const errors = {};
	let error_exists = false

	for (const fieldName in validationSchema) {
		const fieldValidation = validationSchema[fieldName];
		errors[fieldName] = ""

		// Check if the field is required
		if (fieldValidation.required && !formData.has(fieldName)) {
			errors[fieldName] = `${fieldName} is required`;
			error_exists = true
		}

		// Check if the field has a regex pattern to match against
		if (fieldValidation.regex && formData.has(fieldName)) {
			const fieldValue = formData.get(fieldName);
			if (!fieldValidation.regex.test(fieldValue)) {
				errors[fieldName] = `${fieldName} is invalid`;
				error_exists = true
			}

		}

		// Check if the field has a minimum length requirement
		if (fieldValidation.min_length && formData.has(fieldName)) {
			const fieldValue = formData.get(fieldName);
			if (fieldValue.length < fieldValidation.min_length) {
				errors[fieldName] = `${fieldName} should be at least ${fieldValidation.min_length} characters long`;
				error_exists = true
			}

		}

		// Check if the field has a maximum length requirement
		if (fieldValidation.max_length && formData.has(fieldName)) {
			const fieldValue = formData.get(fieldName);
			if (fieldValue.length > fieldValidation.max_length) {
				errors[fieldName] = `${fieldName} should be at most ${fieldValidation.max_length} characters long`;
				error_exists = true
			}
		}

		// Check if the field is an integer within a range
		if (fieldValidation.is_int && formData.has(fieldName)) {
			const fieldValue = parseInt(formData.get(fieldName));
			if (isNaN(fieldValue) || !Number.isInteger(fieldValue)) {
				errors[fieldName] = `${fieldName} should be an integer`;
				error_exists = true
			} else if (fieldValidation.min && fieldValue < fieldValidation.min) {
				errors[fieldName] = `${fieldName} should be at least ${fieldValidation.min}`;
				error_exists = true
			} else if (fieldValidation.max && fieldValue > fieldValidation.max) {
				errors[fieldName] = `${fieldName} should be at most ${fieldValidation.max}`;
				error_exists = true
			}
		}

		// Check if the field value is within a set of allowed values
		if (fieldValidation.is_in && formData.has(fieldName)) {
			const fieldValue = formData.get(fieldName);
			if (!fieldValidation.is_in.includes(fieldValue)) {
				errors[fieldName] = `${fieldName} is not an allowed value`;
				error_exists = true
			}
		}
	}

	return [error_exists, errors]
}

const noErrorState = {
	email: "",
	cnic: "",
	password: "",
	name: "",
	age: "",
	phone: "",
	city: "",
	education: "",
	employment: "",
	course_interest: "",
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
	const [errorMessage, setErrorMessage] = useState(noErrorState)
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

		if (!email_regex.test(email)) {
			setErrorMessage(cur => ({ ...cur, email: "Please enter a valid email." }))
			return
		}
		if (!cnic_regex.test(CNIC)) {
			setErrorMessage(cur => ({ ...cur, cnic: "Please enter a valid CNIC Number e.g. xxxxx-xxxxxxx-x." }))
			return
		}

		setErrorMessage(noErrorState)

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
				validationSchema["password"]["required"] = true
				setErrorType("")
			}

			if (data.type === "both_cnic_and_email") {
				setStatus(STATUS_TYPES.EXISTING_USER)
				validationSchema["password"]["required"] = false
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
	}

	const handleConfirmPassword = (e) => setConfirmPassword(e.target.value)

	useEffect(() => {
		if (password !== confirmPassword)
			setErrorType(ERROR_TYPE.PASSWORD_MISMATCH)
		else if (password.length < 8 && password.length > 0)
			setErrorType(ERROR_TYPE.PASSWORD_TOO_SHORT)
		else setErrorType("")
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

			const [error_exists, errors] = validate(formData)
			if (error_exists) {
				alert("Invalid input. Please enter valid information.")
				setErrorMessage(errors)
				console.log(errors)
				return
			}

			// divide name into firstname and lastname by space, if there is no lastname, set it to ""
			const name = formData.get("name")
			const words = name.trim().split(' ');
			const firstName = words.shift();
			const lastName = words.join(' ');
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
						firstName,
						lastName,
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
			validationSchema["course_interest"]["is_in"] = data.courses.map(course => course.id.toString())
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
					className='bg-white w-full md:w-1/2 shadow-lg hover:shadow-xl p-5 md:rounded-lg flex flex-col gap-y-5 md:gap-y-0 md:gap-x-10 transition-all duration-300'
					name="application"
					onSubmit={handleSubmit}
				>
					<ErrorDisplay errorType={errorType} email={oldEmailAddress} />
					{!!errorType && <hr className="mt-2 mb-2" />}

					<div
						className={`flex flex-col ${status === STATUS_TYPES.JUST_OPENED ? "flex-col" : "md:flex-row"
							} gap-y-5 md:gap-y-0 md:gap-x-10 `}
					>
						<div id="left" className="flex flex-col w-full basis-full gap-y-5">
							<Input
								label={<span><i className="far fa-envelope"></i> Email:</span>}
								name="email"
								type="email"
								value={email}
								placeholder="info@info.com"
								onChange={(e) => setEmail(e.target.value)}
								error={errorMessage.email}
								readonly={status !== STATUS_TYPES.JUST_OPENED}
							/>
							<Input
								label={<span><i className="far fa-address-card"></i> CNIC:</span>}
								placeholder="xxxxx-xxxxxxx-x"
								name="cnic"
								type="text"
								value={CNIC}
								onChange={handleCNIC}
								error={errorMessage.cnic}
								readonly={status !== STATUS_TYPES.JUST_OPENED}
							/>

							{status !== STATUS_TYPES.JUST_OPENED && (
								<>
									<Input
										label="Name:"
										name="name"
										type="text"
										placeholder="Enter your name"
										error={errorMessage.name}
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
												error={errorMessage.password}
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
									error={errorMessage.phone}
								/>
								<div className="flex flex-col gap-1 w-full">
									<Input label="Age:" name="age" type="number" min="12" max="120" placeholder="e.g. 25" error={errorMessage.age} />
								</div>

								<div className="flex flex-col gap-1 w-full">
									<label className="label">
										<span className="">Course Interest:</span>
									</label>
									{!!errorMessage.course_interest && <p><i className="fas fa-exclamation-circle text-red-500"></i> {errorMessage.course_interest}</p>}
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
									{!!errorMessage.city && <p><i className="fas fa-exclamation-circle text-red-500"></i> {errorMessage.city}</p>}
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
									{!!errorMessage.education && <p><i className="fas fa-exclamation-circle text-red-500"></i> {errorMessage.education}</p>}
									<select
										name="education"
										className="border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white"
									>
										<option value="" selected disabled>
											Select Education Status
										</option>

										<option value="Only Matric">Only Matric</option>

										<option value="Only Intermediate">Only Intermediate</option>

										<option value="Bachelors (In process)">Bachelors (In process)</option>

										<option value="Bachelors (Completed)">Bachelors (Completed)</option>

										<option value="Diploma (In process)">Diploma (In process)</option>

										<option value="Diploma (Completed)">Diploma (Completed)</option>

										<option value="Postgraduate (In process)">Postgraduate (In process)</option>

										<option value="Postgraduate (Completed)">Postgraduate (Completed)</option>
									</select>
								</div>

								<div className="flex flex-col gap-1 w-full">
									<label className="label">
										<span className="">Employment:</span>
									</label>
									{!!errorMessage.employment && <p><i className="fas fa-exclamation-circle text-red-500"></i> {errorMessage.employment}</p>}
									<select
										name="employment"
										className="border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white"
										placeholder="Select employment"
									>
										<option value="" selected disabled>
											Select Employment Status
										</option>
										<option value="Employed (Full time)">Employed (Full time)</option>
										<option value="Employed (Part time)">Employed (Part time)</option>
										<option value="Jobless">Jobless</option>
										<option value="Freelancer">Freelancer</option>
									</select>
								</div>
							</div>
						)}
					</div>
					{status === STATUS_TYPES.JUST_OPENED ? (
						<button
							className="p-2 bg-gradient-to-r from-iec-blue to-green-500 text-white rounded-lg hover:scale-105 transition-all duration-300 mt-6 w-1/2 self-center items-center"
							onClick={(e) => checkAlreadyRegistered(e)}
						>
							Next!
						</button>
					) : (
						<button className="p-2 bg-gradient-to-r from-iec-blue to-green-500 text-white rounded-lg hover:scale-105 transition-all duration-300 mt-6 w-1/2 self-center items-center">
							Submit Application!
						</button>
					)}
				</form>
			</div>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById("app"))
