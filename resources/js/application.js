const useState = React.useState
const useEffect = React.useEffect

const Header = () => {
	return (
		<div className="flex w-full items-center justify-center p-4 bg-white">
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

const App = () => {
	const [CNIC, setCNIC] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [passwordMatch, setPasswordMatch] = useState("")
	const [age, setAge] = useState(0)
	const [courses, setCourses] = useState([])
	const [email, setEmail] = useState("")
	const [courseInterest, setCourseInterest] = useState("")
	const [status, setStatus] = useState("justOpened")
	const [applicationStatus, setApplicationStatus] = useState("")
	const [errorMsg, setErrorMsg] = useState("")
	const [cnicError, setCNICError] = useState("")
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

	const handleAge = (e) => {
		const value = e.target.value.replace(/\D/g, "")
		setAge(value)
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
				"https://apply.iec.org.pk/application/check-if-user-exists",
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
				setStatus("newUser")
				// setApplicationStatus("newUser")
			} else {
				setApplicationStatus(data.type)
			}

			if (data.type === "both_cnic_and_email") {
				setStatus("existingUser")
			} else if (data.type === "already_applied") {
				setErrorMsg("You have already applied to this cohort.")
			} else if (data.type === "cnic_only"){
				setCNICError(data.email)
			}
		} catch (err) {
			console.log(err)
		}
	}

	const handlePassword = (e) => {
		setPassword(e.target.value)

		if (e.target.value.length < 8) {
			setErrorMsg("Password must be at least 8 characters")
		} else {
			setErrorMsg("")
		}
	}

	const handleConfirmPassword = (e) => {
		setConfirmPassword(e.target.value)
		setPasswordMatch(e.target.value === password)

		if (e.target.value === password) {
			setErrorMsg("")
		} else {
			setErrorMsg("Passwords do not match")
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		e.stopPropagation()
		try {
			const application_round_id = window.location.pathname.split("/")[3]

			const formData = new FormData(e.target)
			console.log(formData)

			// divide name into firstname and lastname by space, if there is no lastname, set it to ""
			const name = formData.get("name").split(" ")
			const firstname = name[0]
			const lastname = name.length > 1 ? name[1] : ""

			const response = await fetch(
				`https://apply.iec.org.pk/application/submit/${application_round_id}/`,
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
						age_group: formData.get("age"),
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
			`https://apply.iec.org.pk/application/${application_round_id}/courses`
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
					{errorMsg !== "" && (
						<div
							className={`bg-red-500 text-white p-2 rounded-lg my-2 w-1/2 self-center justify-self-center flex`}
						>
							<p className="mx-auto">{errorMsg}</p>
						</div>
					)}

					<div
						className={` flex flex-col ${
							status === "justOpened" ? "flex-col" : "md:flex-row"
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
							{cnicError !== "" && (
								<p className="text-sm text-red-500">
									We already have this CNIC in our database. It means you have
									applied to IEC in the past, but you used a different email
									address the last time.
									<br />
									The email you used last time was something like {cnicError}.
									<br/>
									If that email address was correct, then please use that same
									email address and cnic pair. If you entered a wrong email
									address the last time, then
									<a href="https://apply.iec.org.pk/application/change-email">
										{" "}
										click here to change your email address.
									</a>
								</p>
							)}

							<Input
								label="CNIC:"
								placeholder="xxxxx-xxxxxxx-x"
								name="cnic"
								type="text"
								value={CNIC}
								onChange={handleCNIC}
							/>

							{status !== "justOpened" && (
								<>
									<Input
										label="Name:"
										name="name"
										type="text"
										placeholder="Enter your name"
									/>

									{status === "newUser" && (
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
						{status !== "justOpened" && (
							<div
								id="right"
								className="flex flex-col w-full basis-full gap-y-5"
							>
								<Input
									label="Phone Number:"
									name="phone"
									type="number"
									placeholder="Phone Number"
								/>
								<div className="flex flex-col gap-1 w-full">
									<label className="label">
										<span className="">Age:</span>
									</label>

									<select
										name="age"
										className="border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white"
										placeholder="What is your age?"
									>
										<option value="" selected disabled>
											Pick your age
										</option>

										<option value="Less than 22" className="bg-white">
											Less than 22
										</option>

										<option value="22 - 35" className="bg-white">
											Between 22 and 35
										</option>

										<option value="More than 35" className="bg-white">
											More than 35
										</option>
									</select>
								</div>

								<div className="flex flex-col gap-1 w-full">
									<label className="label">
										<span className="">Course Interest:</span>
									</label>

									<select
										name="course_interest"
										className="border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white"
										value={courseInterest}
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
													onClick={() => {
														setCourseInterest(course.id)
													}}
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
					{status === "justOpened" ? (
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
