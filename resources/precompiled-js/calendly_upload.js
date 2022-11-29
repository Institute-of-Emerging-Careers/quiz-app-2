"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useState = React.useState;

var CalendlyUpload = function CalendlyUpload() {
  var _useState = useState(""),
      _useState2 = _slicedToArray(_useState, 2),
      link = _useState2[0],
      setLink = _useState2[1];

  var uploadLink = function uploadLink(e) {
    e.preventDefault();
    console.log(link);
    fetch("/admin/interview/upload-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        calendly_link: link
      })
    }).then(function (res) {
      if (res.status === 200) {
        window.alert("Link uploaded successfully!");
      }
    });
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl"
  }, "Please enter your Calendly link"), /*#__PURE__*/React.createElement("form", {
    onSubmit: uploadLink
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "calendly_link",
    id: "calendly_link",
    value: link,
    onChange: function onChange(e) {
      return setLink(e.target.value);
    },
    required: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, "Upload")));
};

ReactDOM.render( /*#__PURE__*/React.createElement(CalendlyUpload, null), document.getElementById("app"));