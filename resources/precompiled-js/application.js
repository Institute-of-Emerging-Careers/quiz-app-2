"use strict";

const useState = React.useState;
const useEffect = React.useEffect;

const Header = () => {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex w-full items-center justify-center p-4 bg-white mb-4"
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
    value = undefined,
    min,
    max,
    error,
    readonly = false
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, label)), !!error && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-circle text-red-500"
  }), " ", error), /*#__PURE__*/React.createElement("input", {
    type: type,
    name: name,
    placeholder: placeholder,
    onChange: onChange,
    value: value,
    required: true,
    min: min,
    max: max,
    className: "border-2 border-gray-300 rounded-lg p-2 h-12 w-full",
    readOnly: readonly
  })));
};

const ERROR_TYPE = {
  EMAIL_EXISTS: "email_exists",
  CNIC_EXISTS: "cnic_exists",
  ALREADY_APPLIED: "already_applied",
  PASSWORD_TOO_SHORT: "password_too_short",
  PASSWORD_MISMATCH: "password_mismatch"
};
const STATUS_TYPES = {
  JUST_OPENED: "just_opened",
  NEW_USER: "new_user",
  EXISTING_USER: "existing_user"
};

const ErrorDisplay = _ref2 => {
  let {
    errorType,
    email
  } = _ref2;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-x-2"
  }, !!errorType && /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-circle text-red-500"
  }), errorType === ERROR_TYPE.EMAIL_EXISTS && /*#__PURE__*/React.createElement("p", null, "The email you entered already exists in our database. It means you have already applied to a different IEC cohort before. But you entered a different CNIC number last time. Please use the same combination of email and CNIC as last time.", /*#__PURE__*/React.createElement("br", null), "Or, if you think you accidentally entered the wrong CNIC number last time, you can", " ", /*#__PURE__*/React.createElement("a", {
    href: "/application/change-cnic",
    target: "_blank",
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline"
  }, "click here to change your CNIC number"), " ", "if you remember your password from last time"), errorType === ERROR_TYPE.CNIC_EXISTS && /*#__PURE__*/React.createElement("p", null, "We already have this CNIC in our database. It means you have applied to IEC in the past, but you used a different email address the last time. The email address you used last time looked something like this:", " ", email, ".", /*#__PURE__*/React.createElement("br", null), "If that email address was correct, then please use that same email address and cnic pair.", /*#__PURE__*/React.createElement("br", null), "If you entered a wrong email address the last time, then", " ", /*#__PURE__*/React.createElement("a", {
    href: "/application/change-email",
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline"
  }, "click here to change your email address"), "."), errorType === ERROR_TYPE.ALREADY_APPLIED && /*#__PURE__*/React.createElement("p", null, "You have already applied to this Cohort of IEC. You cannot apply again. Contact IEC via email on ask@iec.org.pk if you have any concerns."), errorType === ERROR_TYPE.PASSWORD_TOO_SHORT && /*#__PURE__*/React.createElement("p", null, "Password must be at least 8 characters long."), errorType === ERROR_TYPE.PASSWORD_MISMATCH && /*#__PURE__*/React.createElement("p", null, "Please write the same password both times. The two password fields do not match."));
};
/*
<option value="Lahore">Lahore</option>
										<option value="Islamabad/Rawalpindi">
											Islamabad/Rawalpindi
										</option>
										<option value="Karachi">Karachi</option>
										<option value="Peshawar">Peshawar</option>
										<option value="Other">Other</option>
*/


const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cnic_regex = /^(\d{5})-(\d{7})-(\d{1})$/;
const validationSchema = {
  email: {
    required: true,
    regex: email_regex
  },
  cnic: {
    required: true,
    regex: cnic_regex
  },
  password: {
    required: true,
    min_length: 8
  },
  name: {
    required: true,
    min_length: 3,
    max_length: 100
  },
  age: {
    required: true,
    is_int: true,
    min: 12,
    max: 120
  },
  phone: {
    required: true,
    regex: /^\d{11}$/
  },
  city: {
    required: true,
    is_in: ["Lahore", "Islamabad/Rawalpindi", "Karachi", "Peshawar", "Quetta", "Other"]
  },
  education: {
    required: true,
    is_in: ["Only Matric", "Only Intermediate", "Bachelors (In process)", "Bachelors (Completed)", "Diploma (In process)", "Diploma (Completed)", "Postgraduate (In process)", "Postgraduate (Completed)"]
  },
  employment: {
    required: true,
    is_in: ["Employed (Full time)", "Employed (Part time)", "Jobless", "Freelancer"]
  },
  course_interest: {
    required: true
  }
};

function validate(formData) {
  console.log(validationSchema.course_interest);
  const errors = {};
  let error_exists = false;

  for (const fieldName in validationSchema) {
    const fieldValidation = validationSchema[fieldName];
    errors[fieldName] = ""; // Check if the field is required

    if (fieldValidation.required && !formData.has(fieldName)) {
      errors[fieldName] = "".concat(fieldName, " is required");
      error_exists = true;
    } // Check if the field has a regex pattern to match against


    if (fieldValidation.regex && formData.has(fieldName)) {
      const fieldValue = formData.get(fieldName);

      if (!fieldValidation.regex.test(fieldValue)) {
        errors[fieldName] = "".concat(fieldName, " is invalid.");
        error_exists = true;
      }
    } // Check if the field has a minimum length requirement


    if (fieldValidation.min_length && formData.has(fieldName)) {
      const fieldValue = formData.get(fieldName);

      if (fieldValue.length < fieldValidation.min_length) {
        errors[fieldName] = "".concat(fieldName, " should be at least ").concat(fieldValidation.min_length, " characters long");
        error_exists = true;
      }
    } // Check if the field has a maximum length requirement


    if (fieldValidation.max_length && formData.has(fieldName)) {
      const fieldValue = formData.get(fieldName);

      if (fieldValue.length > fieldValidation.max_length) {
        errors[fieldName] = "".concat(fieldName, " should be at most ").concat(fieldValidation.max_length, " characters long");
        error_exists = true;
      }
    } // Check if the field is an integer within a range


    if (fieldValidation.is_int && formData.has(fieldName)) {
      const fieldValue = parseInt(formData.get(fieldName));

      if (isNaN(fieldValue) || !Number.isInteger(fieldValue)) {
        errors[fieldName] = "".concat(fieldName, " should be an integer");
        error_exists = true;
      } else if (fieldValidation.min && fieldValue < fieldValidation.min) {
        errors[fieldName] = "".concat(fieldName, " should be at least ").concat(fieldValidation.min);
        error_exists = true;
      } else if (fieldValidation.max && fieldValue > fieldValidation.max) {
        errors[fieldName] = "".concat(fieldName, " should be at most ").concat(fieldValidation.max);
        error_exists = true;
      }
    } // Check if the field value is within a set of allowed values


    if (fieldValidation.is_in && formData.has(fieldName)) {
      const fieldValue = formData.get(fieldName);

      if (!fieldValidation.is_in.includes(fieldValue)) {
        errors[fieldName] = "".concat(fieldName, " is not an allowed value");
        error_exists = true;
      }
    }
  }

  return [error_exists, errors];
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
  course_interest: ""
};

const App = () => {
  const [CNIC, setCNIC] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [courses, setCourses] = useState([]);
  const [email, setEmail] = useState("");
  const [courseInterest, setCourseInterest] = useState("");
  const [status, setStatus] = useState(STATUS_TYPES.JUST_OPENED);
  const [errorType, setErrorType] = useState("");
  const [oldEmailAddress, setOldEmailAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState(noErrorState); //one of few discrete states, not a boolean;
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

  const checkAlreadyRegistered = async e => {
    e.preventDefault();
    e.stopPropagation();

    if (!email_regex.test(email)) {
      setErrorMessage(cur => ({ ...cur,
        email: "Please enter a valid email."
      }));
      return;
    }

    if (!cnic_regex.test(CNIC)) {
      setErrorMessage(cur => ({ ...cur,
        cnic: "Please enter a valid CNIC Number e.g. xxxxx-xxxxxxx-x."
      }));
      return;
    }

    setErrorMessage(noErrorState); //valid responses to this request are;
    // already_applied (do not allow an application)
    // both_cnic_and_email (allow but don't ask for password)
    // cnic_only (don't allow an application, display a message of email and cnic mismatch)
    // email_only (don't ask for password)

    try {
      const response = await fetch("/application/check-if-user-exists", {
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
        setStatus(STATUS_TYPES.NEW_USER);
        validationSchema["password"]["required"] = true;
        setErrorType("");
      }

      if (data.type === "both_cnic_and_email") {
        setStatus(STATUS_TYPES.EXISTING_USER);
        validationSchema["password"]["required"] = false;
        setErrorType("");
      } else if (data.type === "already_applied") {
        setErrorType(ERROR_TYPE.ALREADY_APPLIED);
      } else if (data.type === "cnic_only") {
        setOldEmailAddress(data.email);
        setErrorType(ERROR_TYPE.CNIC_EXISTS);
      } else if (data.type === "email_only") {
        setErrorType(ERROR_TYPE.EMAIL_EXISTS);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePassword = e => {
    setPassword(e.target.value);
  };

  const handleConfirmPassword = e => setConfirmPassword(e.target.value);

  useEffect(() => {
    if (password !== confirmPassword) setErrorType(ERROR_TYPE.PASSWORD_MISMATCH);else if (password.length < 8 && password.length > 0) setErrorType(ERROR_TYPE.PASSWORD_TOO_SHORT);else setErrorType("");
  }, [password, confirmPassword]);

  const handleSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();

    if (!!errorType) {
      alert("Please fix all errors before submitting the form. If there is a problem, email ask@iec.org.pk or reload the page.");
      return;
    }

    try {
      const application_round_id = window.location.pathname.split("/")[3];
      const formData = new FormData(e.target);
      const [error_exists, errors] = validate(formData);

      if (error_exists) {
        alert("Invalid input. Please enter valid information.");
        setErrorMessage(errors);
        console.log(errors);
        return;
      } // divide name into firstname and lastname by space, if there is no lastname, set it to ""


      const name = formData.get("name");
      const words = name.trim().split(" ");
      const firstName = words.shift();
      const lastName = words.join(" ");
      const age = parseInt(formData.get("age"));
      const response = await fetch("/application/submit/".concat(application_round_id, "/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.get("email"),
          cnic: formData.get("cnic"),
          password: formData.get("password"),
          firstName,
          lastName,
          age_group: age < 22 ? "Less than 22" : age >= 22 && age <= 35 ? "22 - 35" : "More than 35",
          age,
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
        alert("Something went wrong. Try again or contact ask@iec.org.pk");
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  }; //this effect gets the courses being offered in the current application round


  useEffect(async () => {
    //get application ID from URL
    const application_round_id = window.location.pathname.split("/")[3];
    const response = await fetch("/application/".concat(application_round_id, "/courses"));
    const data = await response.json();

    if (data.success) {
      setCourses(data.courses);
      validationSchema["course_interest"]["is_in"] = data.courses.map(course => course.id.toString());
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-iec-blue to-green-500 text-black w-full min-h-screen"
  }, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement("div", {
    id: "application",
    className: "flex flex-col items-center justify-center w-full"
  }, /*#__PURE__*/React.createElement("form", {
    className: "bg-white w-full md:w-1/2 shadow-lg hover:shadow-xl p-5 md:rounded-lg flex flex-col gap-y-5 md:gap-y-0 md:gap-x-10 transition-all duration-300",
    name: "application",
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement(ErrorDisplay, {
    errorType: errorType,
    email: oldEmailAddress
  }), !!errorType && /*#__PURE__*/React.createElement("hr", {
    className: "mt-2 mb-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col ".concat(status === STATUS_TYPES.JUST_OPENED ? "flex-col" : "md:flex-row", " gap-y-5 md:gap-y-0 md:gap-x-10 ")
  }, /*#__PURE__*/React.createElement("div", {
    id: "left",
    className: "flex flex-col w-full basis-full gap-y-5"
  }, /*#__PURE__*/React.createElement(Input, {
    label: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
      className: "far fa-envelope"
    }), " Email:"),
    name: "email",
    type: "email",
    value: email,
    placeholder: "info@info.com",
    onChange: e => setEmail(e.target.value),
    error: errorMessage.email,
    readonly: status !== STATUS_TYPES.JUST_OPENED
  }), /*#__PURE__*/React.createElement(Input, {
    label: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
      className: "far fa-address-card"
    }), " CNIC:"),
    placeholder: "xxxxx-xxxxxxx-x",
    name: "cnic",
    type: "text",
    value: CNIC,
    onChange: handleCNIC,
    error: errorMessage.cnic,
    readonly: status !== STATUS_TYPES.JUST_OPENED
  }), status !== STATUS_TYPES.JUST_OPENED && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Input, {
    label: "Name:",
    name: "name",
    type: "text",
    placeholder: "Enter your name",
    error: errorMessage.name
  }), status === STATUS_TYPES.NEW_USER && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Input, {
    label: "Password:",
    name: "password",
    type: "password",
    placeholder: "********",
    value: password,
    onChange: handlePassword,
    error: errorMessage.password
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Confirm Password:",
    name: "confirm_password",
    type: "password",
    placeholder: "********",
    value: confirmPassword,
    onChange: handleConfirmPassword
  })))), status !== STATUS_TYPES.JUST_OPENED && /*#__PURE__*/React.createElement("div", {
    id: "right",
    className: "flex flex-col w-full basis-full gap-y-5"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Phone Number: (11 digit number, no dashes)",
    name: "phone",
    type: "text",
    placeholder: "e.g. 03021234567",
    error: errorMessage.phone
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Age:",
    name: "age",
    type: "number",
    min: "12",
    max: "120",
    placeholder: "e.g. 25",
    error: errorMessage.age
  }))), status !== STATUS_TYPES.JUST_OPENED && /*#__PURE__*/React.createElement("div", {
    id: "right",
    className: "flex flex-col w-full basis-full gap-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, "Course Interest:")), !!errorMessage.course_interest && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-circle text-red-500"
  }), " ", errorMessage.course_interest), /*#__PURE__*/React.createElement("select", {
    name: "course_interest",
    className: "border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white",
    value: courseInterest,
    onChange: e => setCourseInterest(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    selected: true,
    disabled: true
  }, "Pick a course"), courses.length > 0 && courses.map((course, index) => /*#__PURE__*/React.createElement("option", {
    key: course.id,
    value: course.id,
    className: "bg-white"
  }, course.title)))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, "City:")), !!errorMessage.city && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-circle text-red-500"
  }), " ", errorMessage.city), /*#__PURE__*/React.createElement("select", {
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
    value: "Quetta"
  }, "Quetta"), /*#__PURE__*/React.createElement("option", {
    value: "Other"
  }, "Other"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, "Education:")), !!errorMessage.education && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-circle text-red-500"
  }), " ", errorMessage.education), /*#__PURE__*/React.createElement("select", {
    name: "education",
    className: "border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    selected: true,
    disabled: true
  }, "Select Education Status"), /*#__PURE__*/React.createElement("option", {
    value: "Only Matric"
  }, "Only Matric"), /*#__PURE__*/React.createElement("option", {
    value: "Only Intermediate"
  }, "Only Intermediate"), /*#__PURE__*/React.createElement("option", {
    value: "Bachelors (In process)"
  }, "Bachelors (In process)"), /*#__PURE__*/React.createElement("option", {
    value: "Bachelors (Completed)"
  }, "Bachelors (Completed)"), /*#__PURE__*/React.createElement("option", {
    value: "Diploma (In process)"
  }, "Diploma (In process)"), /*#__PURE__*/React.createElement("option", {
    value: "Diploma (Completed)"
  }, "Diploma (Completed)"), /*#__PURE__*/React.createElement("option", {
    value: "Postgraduate (In process)"
  }, "Postgraduate (In process)"), /*#__PURE__*/React.createElement("option", {
    value: "Postgraduate (Completed)"
  }, "Postgraduate (Completed)"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, "Employment:")), !!errorMessage.employment && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-circle text-red-500"
  }), " ", errorMessage.employment), /*#__PURE__*/React.createElement("select", {
    name: "employment",
    className: "border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white",
    placeholder: "Select employment"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    selected: true,
    disabled: true
  }, "Select Employment Status"), /*#__PURE__*/React.createElement("option", {
    value: "Employed (Full time)"
  }, "Employed (Full time)"), /*#__PURE__*/React.createElement("option", {
    value: "Employed (Part time)"
  }, "Employed (Part time)"), /*#__PURE__*/React.createElement("option", {
    value: "Jobless"
  }, "Jobless"), /*#__PURE__*/React.createElement("option", {
    value: "Freelancer"
  }, "Freelancer"))))), status === STATUS_TYPES.JUST_OPENED ? /*#__PURE__*/React.createElement("button", {
    className: "p-2 bg-gradient-to-r from-iec-blue to-green-500 text-white rounded-lg hover:scale-105 transition-all duration-300 mt-6 w-1/2 self-center items-center",
    onClick: e => checkAlreadyRegistered(e)
  }, "Next!") : /*#__PURE__*/React.createElement("button", {
    className: "p-2 bg-gradient-to-r from-iec-blue to-green-500 text-white rounded-lg hover:scale-105 transition-all duration-300 mt-6 w-1/2 self-center items-center"
  }, "Submit Application!"))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));