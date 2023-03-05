"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// eslint-disable-next-line
var EmailForm = function EmailForm(props) {
  var users = props.users;
  var default_values = props.default_values;
  var sending_link = props.sending_link;

  var _useState = useState(default_values.email_subject),
      _useState2 = _slicedToArray(_useState, 2),
      email_subject = _useState2[0],
      setEmailSubject = _useState2[1];

  var onFinish = Object.prototype.hasOwnProperty.call(props, 'onFinish') ? props.onFinish : function () {};
  var applications = null;
  if (Object.prototype.hasOwnProperty.call(props, 'applications')) applications = props.applications;

  var _useState3 = useState(default_values.email_heading),
      _useState4 = _slicedToArray(_useState3, 2),
      email_heading = _useState4[0],
      setEmailHeading = _useState4[1];

  var _useState5 = useState(default_values.email_body),
      _useState6 = _slicedToArray(_useState5, 2),
      email_body = _useState6[0],
      setEmailBody = _useState6[1];

  var _useState7 = useState(default_values.email_button_pre_text),
      _useState8 = _slicedToArray(_useState7, 2),
      email_button_pre_text = _useState8[0],
      setEmailButtonPreText = _useState8[1];

  var _useState9 = useState(default_values.email_button_label),
      _useState10 = _slicedToArray(_useState9, 2),
      email_button_label = _useState10[0],
      setEmailButtonLabel = _useState10[1];

  var _useState11 = useState(default_values.email_button_url),
      _useState12 = _slicedToArray(_useState11, 1),
      email_button_url = _useState12[0];

  var _useState13 = useState(false),
      _useState14 = _slicedToArray(_useState13, 2),
      loading = _useState14[0],
      setLoading = _useState14[1];

  var sendEmails = function sendEmails() {
    setLoading(true);
    fetch(sending_link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        users: applications == null ? users : applications,
        applications: applications != null,
        email_content: {
          subject: email_subject,
          heading: email_heading,
          body: email_body,
          button_pre_text: email_button_pre_text,
          button_label: email_button_label,
          button_url: email_button_url
        }
      })
    }).then(function (response) {
      if (response.ok) {
        alert('Emails sent successfully.');
      } else {
        alert('There was an error while sending emails. Error code 01.');
      }
    }).catch(function (err) {
      console.log(err);
      alert('There was a problem while sending the request to the server. Please check your internet connection. Error code 02.');
    }).finally(function () {
      setLoading(false);
      onFinish();
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
    className: "flex flex-col gap-y-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Recipients: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "recepients",
    maxLength: "100",
    name: "recepients",
    className: "border bg-gray-200 w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: applications == null ? users.length > 0 ? "".concat(users[0].email, ", and ").concat(users.length - 1, " others") : 'No recipients' : applications.length > 0 ? "".concat(applications[0].Student.email, ", and ").concat(applications.length - 1, " others") : 'No recipients'
  }), /*#__PURE__*/React.createElement("label", null, "Subject: "), /*#__PURE__*/React.createElement("input", {
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
    type: "text",
    name: "button_url",
    id: "button_url",
    placeholder: "Where does the button take the user?",
    className: "bg-gray-100 border w-full py-3 px-4 mt-1 hover:shadow-sm",
    value: email_button_url,
    readOnly: true
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
  }, loading ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin self-center"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "far fa-paper-plane"
  }), ' ', "Send Email(s)"))));
};