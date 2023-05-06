"use strict";

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

var ContextProvider = function ContextProvider(props) {
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      applications = _useState2[0],
      setApplications = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      reload_applications = _useState4[0],
      setReloadApplications = _useState4[1];

  var _useState5 = useState(-1),
      _useState6 = _slicedToArray(_useState5, 2),
      show_modal = _useState6[0],
      setShowModal = _useState6[1]; //value is set to the array index of the application whose details are to be shown by the modal


  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: {
      applications_object: [applications, setApplications],
      modal_object: [show_modal, setShowModal],
      reload_object: [reload_applications, setReloadApplications]
    }
  }, props.children);
};

var App = function App() {
  var _useContext = useContext(MyContext),
      applications_object = _useContext.applications_object,
      modal_object = _useContext.modal_object,
      reload_object = _useContext.reload_object;

  var _modal_object = _slicedToArray(modal_object, 2),
      show_modal = _modal_object[0],
      setShowModal = _modal_object[1];

  var _reload_object = _slicedToArray(reload_object, 2),
      reload_applications = _reload_object[0],
      setReloadApplications = _reload_object[1];

  var _applications_object = _slicedToArray(applications_object, 2),
      applications = _applications_object[0],
      setApplications = _applications_object[1];

  var _useState7 = useState({}),
      _useState8 = _slicedToArray(_useState7, 2),
      application_id_to_array_index_map = _useState8[0],
      setApplicationIdToArrayIndexMap = _useState8[1];

  useEffect(function () {
    setApplicationIdToArrayIndexMap(function (cur) {
      var obj = {};
      applications.forEach(function (application, index) {
        obj[application.id] = index;
      });
      return obj;
    });
  }, [applications]);
  useEffect(function () {
    fetch("/admin/application/all-applicants/".concat(document.getElementById("application-round-id-field").value)).then(function (raw_response) {
      if (raw_response.ok) {
        raw_response.json().then(function (response) {
          setApplications(response.applications);
        });
      } else {
        alert("Something went wrong. Code 01.");
      }
    }).catch(function (err) {
      console.log(err);
      alert("Something went wrong. Code 02.");
    });
  }, [reload_applications]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(ApplicantDetailsModal, null), /*#__PURE__*/React.createElement(ApplicationsList, {
    application_round_id: document.getElementById("application-round-id-field").value,
    application_id_to_array_index_map: application_id_to_array_index_map
  })));
};

ReactDOM.render( /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement(App, null)), document.getElementById("app"));