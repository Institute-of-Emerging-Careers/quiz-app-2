"use strict";

const useState = React.useState;
const useEffect = React.useEffect;

const Header = () => {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex w-full items-center justify-center p-4 bg-white"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-iec-blue to-green-500 p-5"
  }, "Apply To IEC"));
};

const Input = _ref => {
  let {
    label,
    placeholder,
    form,
    name,
    type,
    onChange = undefined,
    value = undefined
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, label)), /*#__PURE__*/React.createElement("input", {
    type: type,
    name: name,
    placeholder: placeholder,
    onChange: onChange,
    value: value,
    required: true,
    className: "border-2 border-gray-300 rounded-lg p-2 h-12 w-full"
  })));
}; // const DropdownComponent = ({ label, name, placeholder, options }) => {
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
  const [CNIC, setCNIC] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");
  const [age, setAge] = useState(0);
  const [courses, setCourses] = useState([]);
  const [email, setEmail] = useState("");
  const [courseInterest, setCourseInterest] = useState("");
  const [status, setStatus] = useState("justOpened");
  const [applicationStatus, setApplicationStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [cnicError, setCNICError] = useState(""); //one of few discrete states, not a boolean;
  //status can be:
  // justOpened(hasn't entered email yet),
  // alreadyApplied
  // existingUser (dont ask for password)
  // newUser (ask for password)

  const handleCNIC = e => {
    setCNIC(formatCNIC(e.target.value));
  };

  const formatCNIC = input => {
    const cleanedInput = input.replace(/\D/g, "");
    if (input.length <= 5) return cleanedInput;
    let formattedInput = cleanedInput.slice(0, 5).concat("-", cleanedInput.slice(5, 12));
    if (input.length <= 13) return formattedInput;
    formattedInput = formattedInput.concat("-", cleanedInput.slice(12, 13));
    return formattedInput;
  };

  const handleAge = e => {
    const value = e.target.value.replace(/\D/g, "");
    setAge(value);
  };

  const checkAlreadyRegistered = async e => {
    e.preventDefault();
    e.stopPropagation(); //valid responses to this request are;
    // already_applied (do not allow an application)
    // both_cnic_and_email (allow but don't ask for password)
    // cnic_only (don't allow an application, display a message of email and cnic mismatch)
    // email_only (don't ask for password)

    try {
      const response = await fetch("https://apply.iec.org.pk/application/check-if-user-exists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          application_round_id: parseInt(window.location.pathname.split("/")[3]),
          email: email,
          cnic: CNIC
        })
      });
      const data = await response.json();

      if (!data.exists) {
        setStatus("newUser"); // setApplicationStatus("newUser")
      } else {
        setApplicationStatus(data.type);
      }

      if (data.type === "both_cnic_and_email") {
        setStatus("existingUser");
      } else if (data.type === "already_applied") {
        setErrorMsg("You have already applied to this cohort.");
      } else if (data.type === "cnic_only") {
        setCNICError(data.email);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePassword = e => {
    setPassword(e.target.value);

    if (e.target.value.length < 8) {
      setErrorMsg("Password must be at least 8 characters");
    } else {
      setErrorMsg("");
    }
  };

  const handleConfirmPassword = e => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);

    if (e.target.value === password) {
      setErrorMsg("");
    } else {
      setErrorMsg("Passwords do not match");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const application_round_id = window.location.pathname.split("/")[3];
      const formData = new FormData(e.target);
      console.log(formData); // divide name into firstname and lastname by space, if there is no lastname, set it to ""

      const name = formData.get("name").split(" ");
      const firstname = name[0];
      const lastname = name.length > 1 ? name[1] : "";
      const response = await fetch("https://apply.iec.org.pk/application/submit/".concat(application_round_id, "/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
          application_round_id: application_round_id
        })
      });

      if (response.status === 201) {
        window.location.href = "https://iec.org.pk/thankyou";
      } else {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  }; //this effect gets the courses being offered in the current application round


  useEffect(async () => {
    //get application ID from URL
    const application_round_id = window.location.pathname.split("/")[3];
    const response = await fetch("https://apply.iec.org.pk/application/".concat(application_round_id, "/courses"));
    const data = await response.json();

    if (data.success) {
      setCourses(data.courses);
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-iec-blue to-green-500 text-black w-full min-h-screen"
  }, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement("div", {
    id: "application",
    className: "flex flex-col items-center justify-center w-full"
  }, /*#__PURE__*/React.createElement("form", {
    className: "bg-white w-full md:w-1/2 shadow-lg hover:shadow-xl p-5 md:rounded-b-lg flex flex-col gap-y-5 md:gap-y-0 md:gap-x-10  transition-all duration-300",
    name: "application",
    onSubmit: handleSubmit
  }, errorMsg !== "" && /*#__PURE__*/React.createElement("div", {
    className: "bg-red-500 text-white p-2 rounded-lg my-2 w-1/2 self-center justify-self-center flex"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mx-auto"
  }, errorMsg)), /*#__PURE__*/React.createElement("div", {
    className: " flex flex-col ".concat(status === "justOpened" ? "flex-col" : "md:flex-row", " gap-y-5 md:gap-y-0 md:gap-x-10 ")
  }, /*#__PURE__*/React.createElement("div", {
    id: "left",
    className: "flex flex-col w-full basis-full gap-y-5"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email:",
    name: "email",
    type: "email",
    value: email,
    placeholder: "info@info.com",
    onChange: e => setEmail(e.target.value)
  }), cnicError !== "" && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-red-500"
  }, "We already have this CNIC in our database. It means you have applied to IEC in the past, but you used a different email address the last time.", /*#__PURE__*/React.createElement("br", null), "The email you used last time was something like ", cnicError, ".", /*#__PURE__*/React.createElement("br", null), "If that email address was correct, then please use that same email address and cnic pair. If you entered a wrong email address the last time, then", /*#__PURE__*/React.createElement("a", {
    href: "https://apply.iec.org.pk/application/change-email"
  }, " ", "click here to change your email address.")), /*#__PURE__*/React.createElement(Input, {
    label: "CNIC:",
    placeholder: "xxxxx-xxxxxxx-x",
    name: "cnic",
    type: "text",
    value: CNIC,
    onChange: handleCNIC
  }), status !== "justOpened" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Input, {
    label: "Name:",
    name: "name",
    type: "text",
    placeholder: "Enter your name"
  }), status === "newUser" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Input, {
    label: "Password:",
    name: "password",
    type: "password",
    placeholder: "********",
    value: password,
    onChange: handlePassword
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Confirm Password:",
    name: "confirm_password",
    type: "password",
    placeholder: "********",
    value: confirmPassword,
    onChange: handleConfirmPassword
  })))), status !== "justOpened" && /*#__PURE__*/React.createElement("div", {
    id: "right",
    className: "flex flex-col w-full basis-full gap-y-5"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Phone Number:",
    name: "phone",
    type: "number",
    placeholder: "Phone Number"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, "Age:")), /*#__PURE__*/React.createElement("select", {
    name: "age",
    className: "border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white",
    placeholder: "What is your age?"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    selected: true,
    disabled: true
  }, "Pick your age"), /*#__PURE__*/React.createElement("option", {
    value: "Less than 22",
    className: "bg-white"
  }, "Less than 22"), /*#__PURE__*/React.createElement("option", {
    value: "22 - 35",
    className: "bg-white"
  }, "Between 22 and 35"), /*#__PURE__*/React.createElement("option", {
    value: "More than 35",
    className: "bg-white"
  }, "More than 35"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, "Course Interest:")), /*#__PURE__*/React.createElement("select", {
    name: "course_interest",
    className: "border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white",
    value: courseInterest
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    selected: true,
    disabled: true
  }, "Pick a course"), courses.length > 0 && courses.map((course, index) => /*#__PURE__*/React.createElement("option", {
    key: course.id,
    value: course.id,
    className: "bg-white",
    onClick: () => {
      setCourseInterest(course.id);
    }
  }, course.title)))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, "City:")), /*#__PURE__*/React.createElement("select", {
    name: "city",
    className: "border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    selected: true,
    disabled: true
  }, "Pick your city"), /*#__PURE__*/React.createElement("option", {
    value: "Lahore"
  }, "Lahore"), /*#__PURE__*/React.createElement("option", {
    value: "Islamabad/Rawalpindi"
  }, "Islamabad/Rawalpindi"), /*#__PURE__*/React.createElement("option", {
    value: "Karachi"
  }, "Karachi"), /*#__PURE__*/React.createElement("option", {
    value: "Peshawar"
  }, "Peshawar"), /*#__PURE__*/React.createElement("option", {
    value: "Other"
  }, "Other"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, "Education:")), /*#__PURE__*/React.createElement("select", {
    name: "education",
    className: "border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    selected: true,
    disabled: true
  }, "Select Education Status"), /*#__PURE__*/React.createElement("option", null, "Only Matric"), /*#__PURE__*/React.createElement("option", null, "Only Intermediate"), /*#__PURE__*/React.createElement("option", null, "Bachelors (In process)"), /*#__PURE__*/React.createElement("option", null, "Bachelors (Completed)"), /*#__PURE__*/React.createElement("option", null, "Diploma (In process)"), /*#__PURE__*/React.createElement("option", null, "Diploma (Completed)"), /*#__PURE__*/React.createElement("option", null, "Postgraduate (In process)"), /*#__PURE__*/React.createElement("option", null, "Postgraduate (Completed)"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, "Employment:")), /*#__PURE__*/React.createElement("select", {
    name: "employment",
    className: "border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white",
    placeholder: "Select employment"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    selected: true,
    disabled: true
  }, "Select Employment Status"), /*#__PURE__*/React.createElement("option", null, "Employed (Full time)"), /*#__PURE__*/React.createElement("option", null, "Employed (Part time)"), /*#__PURE__*/React.createElement("option", null, "Jobless"), /*#__PURE__*/React.createElement("option", null, "Freelancer"))))), status === "justOpened" ? /*#__PURE__*/React.createElement("button", {
    className: "p-2 bg-gradient-to-r from-iec-blue to-green-500 text-white rounded-full hover:scale-105 transition-all duration-300 mt-6 w-1/2 self-center items-center",
    onClick: email => checkAlreadyRegistered(email)
  }, "Next!") : /*#__PURE__*/React.createElement("button", {
    className: "p-2 bg-gradient-to-r from-iec-blue to-green-500 text-white rounded-full hover:scale-105 transition-all duration-300 mt-6 w-1/2 self-center items-center"
  }, "Submit Application!"))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));