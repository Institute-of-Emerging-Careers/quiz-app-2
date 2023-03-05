"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var MyContext = React.createContext();
var useEffect = React.useEffect;
var useState = React.useState;
var useContext = React.useContext;
var useRef = React.useRef;
var orientation_id_value = document.getElementById('orientation-id-field').value;

var ContextProvider = function ContextProvider(props) {
  var _useState = useState(-1),
      _useState2 = _slicedToArray(_useState, 2),
      orientation_id = _useState2[0],
      setOrientationId = _useState2[1];

  var _useState3 = useState(''),
      _useState4 = _slicedToArray(_useState3, 2),
      orientation_name = _useState4[0],
      setOrientationName = _useState4[1];

  var _useState5 = useState({
    date: '',
    time: '11',
    zoom_link: ''
  }),
      _useState6 = _slicedToArray(_useState5, 2),
      meeting_data = _useState6[0],
      setMeetingData = _useState6[1];

  var _useState7 = useState([]),
      _useState8 = _slicedToArray(_useState7, 2),
      students = _useState8[0],
      setStudents = _useState8[1]; // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not


  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: {
      orientation_id_object: [orientation_id, setOrientationId],
      orientation_name_object: [orientation_name, setOrientationName],
      meeting_data_object: [meeting_data, setMeetingData],
      students_object: [students, setStudents]
    }
  }, props.children);
};

var EmailForm = function EmailForm() {
  var _useContext = useContext(MyContext),
      orientation_id_object = _useContext.orientation_id_object,
      students_object = _useContext.students_object;

  var _orientation_id_objec = _slicedToArray(orientation_id_object, 1),
      orientation_id = _orientation_id_objec[0];

  var _students_object = _slicedToArray(students_object, 1),
      students = _students_object[0];

  var _useState9 = useState(''),
      _useState10 = _slicedToArray(_useState9, 2),
      email_subject = _useState10[0],
      setEmailSubject = _useState10[1];

  var _useState11 = useState(''),
      _useState12 = _slicedToArray(_useState11, 2),
      email_heading = _useState12[0],
      setEmailHeading = _useState12[1];

  var _useState13 = useState(''),
      _useState14 = _slicedToArray(_useState13, 2),
      email_body = _useState14[0],
      setEmailBody = _useState14[1];

  var _useState15 = useState(''),
      _useState16 = _slicedToArray(_useState15, 2),
      email_button_pre_text = _useState16[0],
      setEmailButtonPreText = _useState16[1];

  var _useState17 = useState(''),
      _useState18 = _slicedToArray(_useState17, 2),
      email_button_label = _useState18[0],
      setEmailButtonLabel = _useState18[1];

  var _useState19 = useState(''),
      _useState20 = _slicedToArray(_useState19, 2),
      email_button_url = _useState20[0],
      setEmailButtonUrl = _useState20[1];

  var _useState21 = useState([]),
      _useState22 = _slicedToArray(_useState21, 2),
      recipients = _useState22[0],
      setRecipients = _useState22[1];

  var form_ref = useRef();
  useEffect(function () {
    setRecipients(students.filter(function (student) {
      return !student.email_sent && student.added;
    }));
  }, [students]);

  var sendEmails = function sendEmails() {
    fetch('/admin/orientation/send-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        students: students.filter(function (student) {
          return !student.email_sent && student.added;
        }),
        orientation_id: orientation_id,
        email_content: {
          subject: email_subject,
          heading: email_heading,
          body: email_body,
          button_pre_text: email_button_pre_text,
          button_label: email_button_label,
          button_url: email_button_url
        }
      })
    }).then(function (raw_response) {
      raw_response.json().then(function (response) {
        if (response.success) {
          alert('Emails queued successfully and will be sent at the rate of 14 emails per second.');
        } else {
          alert('There was an error while sending emails. Error code 01.');
        }
      }).catch(function () {
        alert('There was an error while sending emails. Error code 02.');
      });
    }).catch(function () {
      alert('There was a problem while sending the request to the server. Please check your internet connection. Error code 03.');
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg mt-4 mb-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-mail-bulk"
  }), " Compose Email"), /*#__PURE__*/React.createElement("form", {
    action: "/mail/preview",
    method: "POST",
    target: "_blank",
    className: "flex flex-col gap-y-2",
    ref: form_ref
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Recipients: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "recipients",
    name: "recipients",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: recipients.length > 0 ? "Sending to ".concat(recipients[0].email, ", and ").concat(recipients.length - 1, " others") : 'No recipients',
    onChange: function onChange(e) {
      setEmailSubject(e.target.value);
    },
    disabled: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Subject: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "subject",
    maxLength: "100",
    name: "subject",
    placeholder: "e.g. Invite",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: email_subject,
    onChange: function onChange(e) {
      setEmailSubject(e.target.value);
    },
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Heading: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "heading",
    maxLength: "100",
    name: "heading",
    placeholder: "This will be the heading inside the body of the email.",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: email_heading,
    onChange: function onChange(e) {
      setEmailHeading(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Body: "), /*#__PURE__*/React.createElement("textarea", {
    maxLength: "5000",
    id: "body",
    name: "body",
    placeholder: "This will be the the body of the email. Limit: 5000 characters.",
    className: "border w-full h-48 py-3 px-4 mt-1 hover:shadow-sm",
    value: email_body,
    onChange: function onChange(e) {
      setEmailBody(e.target.value);
    },
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Button Pre-text: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "100",
    id: "button_announcer",
    name: "button_announcer",
    placeholder: "This text comes before a button and invites the user to click the button. You can leave it empty if you want.",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: email_button_pre_text,
    onChange: function onChange(e) {
      setEmailButtonPreText(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Button Label: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "50",
    id: "button_text",
    name: "button_text",
    placeholder: "What does the button say? Limit: 50 characters",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: email_button_label,
    onChange: function onChange(e) {
      setEmailButtonLabel(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Button URL: "), /*#__PURE__*/React.createElement("input", {
    type: "url",
    name: "button_url",
    id: "button_url",
    placeholder: "Where does the button take the user?",
    className: "border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: email_button_url,
    onChange: function onChange(e) {
      setEmailButtonUrl(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3 px-6 bg-gray-700 text-white mt-4 cursor-pointer hover:bg-gray-600"
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-eye"
  }), " Preview Mail"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "w-full py-3 px-6 bg-iec-blue text-white mt-4 cursor-pointer hover:bg-iec-blue-hover",
    id: "email-button",
    onClick: sendEmails
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-paper-plane"
  }), " Send Email(s)"))));
};

var NameForm = function NameForm() {
  var _useContext2 = useContext(MyContext),
      orientation_id_object = _useContext2.orientation_id_object,
      orientation_name_object = _useContext2.orientation_name_object,
      meeting_data_object = _useContext2.meeting_data_object,
      students_object = _useContext2.students_object;

  var _meeting_data_object = _slicedToArray(meeting_data_object, 1),
      meeting_data = _meeting_data_object[0];

  var _orientation_id_objec2 = _slicedToArray(orientation_id_object, 2),
      setOrientationId = _orientation_id_objec2[1];

  var _orientation_name_obj = _slicedToArray(orientation_name_object, 2),
      orientation_name = _orientation_name_obj[0],
      setOrientationName = _orientation_name_obj[1];

  var _students_object2 = _slicedToArray(students_object, 1),
      students = _students_object2[0];

  var _useState23 = useState(false),
      _useState24 = _slicedToArray(_useState23, 2),
      show_email_form = _useState24[0],
      setShowEmailForm = _useState24[1];

  var _useState25 = useState(false),
      _useState26 = _slicedToArray(_useState25, 2),
      loading = _useState26[0],
      setLoading = _useState26[1];

  useEffect(function () {
    if (window.location.href.split('/')[window.location.href.split('/').length - 2] === 'new') {
      window.location = "/admin/orientation/edit/".concat(document.getElementById('orientation-id-field').value);
    } else {
      setOrientationId(parseInt(document.getElementById('orientation-id-field').value));
      setOrientationName(document.getElementById('orientation-name-field').value);
    }
  }, []);

  var saveData = function saveData(e) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    console.log(orientation_name);
    fetch("/admin/orientation/save/".concat(document.getElementById('orientation-id-field').value), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orientation_name: orientation_name,
        meeting_data: meeting_data,
        students: students
      })
    }).then(function (response) {
      response.json().then(function (parsed_response) {
        if (parsed_response.success) {
          setLoading(false);
        }
      });
    }).catch(function () {
      setLoading(false);
      alert('Something went wrong. Error code 01. Check your internet connection.');
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: show_email_form ? '' : 'flex'
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: saveData,
    autoFocus: true
  }, /*#__PURE__*/React.createElement("label", null, "Orientation Name: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "orientation",
    value: orientation_name,
    onChange: function onChange(e) {
      setOrientationName(e.target.value);
    },
    className: "ml-2 px-4 py-4 w-72 border"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "ml-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 active:shadow-inner cursor-pointer"
  }, loading ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin text-lg"
  }), " Saving") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), " Save All Data"))), show_email_form ? /*#__PURE__*/React.createElement(EmailForm, null) : /*#__PURE__*/React.createElement("button", {
    className: "ml-2 bg-gray-400 hover:bg-gray-500 text-white px-8 py-4 active:shadow-inner cursor-pointer",
    onClick: function onClick() {
      setShowEmailForm(function (cur) {
        return !cur;
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-mail-bulk"
  }), " Send Emails to Not-Emailed Students"));
};

var OrientationDetailsForm = function OrientationDetailsForm() {
  var _useContext3 = useContext(MyContext),
      meeting_data_object = _useContext3.meeting_data_object;

  var _meeting_data_object2 = _slicedToArray(meeting_data_object, 2),
      meeting_data = _meeting_data_object2[0],
      setMeetingData = _meeting_data_object2[1];

  useEffect(function () {
    fetch("/admin/orientation/get-meeting-data/".concat(orientation_id_value)).then(function (resp) {
      if (resp.ok) {
        resp.json().then(function (response) {
          setMeetingData(response.meeting_data);
        }).catch(function (err) {
          console.log(err);
          alert('Error getting meeting data such as zoom link, time, and date. Server sent wrongly formatted information. Contact IT.');
        });
      } else {
        alert('Error getting meeting data such as zoom link, time, and date.');
      }
    });
  }, []);
  useEffect(function () {
    $('#date-picker').datepicker({
      showOn: 'both',
      onSelect: function onSelect(date) {
        setMeetingData(function (cur) {
          return _objectSpread(_objectSpread({}, cur), {}, {
            date: date
          });
        });
      }
    });
    $('#time-picker').timepicker({
      timeFormat: 'h:mm p',
      interval: 15,
      minTime: '08',
      maxTime: '11:00pm',
      defaultTime: '11',
      startTime: '08:00',
      dynamic: false,
      dropdown: true,
      scrollbar: true,
      change: function change(time) {
        setMeetingData(function (cur) {
          return _objectSpread(_objectSpread({}, cur), {}, {
            time: $('#time-picker').timepicker().format(time)
          });
        });
      }
    });
  }, [meeting_data]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-base text-center font-bold mb-4"
  }, "Orientation Details"), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex justify-around"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Zoom Link: "), /*#__PURE__*/React.createElement("input", {
    type: "url",
    className: "px-3 py-2 border w-full",
    value: meeting_data.zoom_link,
    onChange: function onChange(e) {
      setMeetingData(function (cur) {
        var copy = _objectSpread(_objectSpread({}, cur), {}, {
          zoom_link: e.target.value
        });

        return copy;
      });
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Meeting Date: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "date-picker",
    className: "px-3 py-2 border w-full",
    value: meeting_data.date // jQuery DatePicker does not fire the onChange event, so the change logic was handled in this component before UI rendering

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Meeting Time: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "time-picker",
    className: "px-3 py-2 border w-full",
    value: meeting_data.time
  }))));
};

var StudentsListWrapper = function StudentsListWrapper() {
  var _useContext4 = useContext(MyContext),
      students_object = _useContext4.students_object;

  var _students_object3 = _slicedToArray(students_object, 1),
      students = _students_object3[0];

  return /*#__PURE__*/React.createElement(StudentsList, {
    students: students,
    title: "Orientation",
    field_to_show_green_if_true: {
      field: 'email_sent',
      text: 'orientation email was sent'
    },
    fields: [{
      title: 'Name',
      name: ['name']
    }, {
      title: 'Email',
      name: ['email']
    }, {
      title: 'Percentage Score',
      name: ['percentage_score']
    }]
  });
};

var NewStudentsAdderWrapper = function NewStudentsAdderWrapper() {
  var _useContext5 = useContext(MyContext),
      students_object = _useContext5.students_object;

  return /*#__PURE__*/React.createElement(NewStudentAdder, {
    all_students_api_endpoint_url: "/admin/orientation/all-students/".concat(orientation_id_value),
    students_object: students_object,
    title: "Orientation"
  });
};

var App = function App() {
  return /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(NameForm, null)), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(OrientationDetailsForm, null)), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(StudentsListWrapper, null)), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 min-h-screen text-sm"
  }, /*#__PURE__*/React.createElement(NewStudentsAdderWrapper, null)));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('app'));