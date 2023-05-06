"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useState = React.useState;
var useEffect = React.useEffect;
var _luxon = luxon,
    DateTime = _luxon.DateTime,
    Duration = _luxon.Duration,
    Interval = _luxon.Interval;

var App = function App() {
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      time_slots = _useState2[0],
      setTimeSlots = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      all_other_time_slots = _useState4[0],
      setAllOtherTimeSlots = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      saving = _useState6[0],
      setSaving = _useState6[1];

  var _useState7 = useState(3),
      _useState8 = _slicedToArray(_useState7, 2),
      num_zoom_accounts = _useState8[0],
      setNumZoomAccounts = _useState8[1]; // num_zoom_accounts refers to the maximum number of interviewers that can be conducting interviews at any given moment


  var _useState9 = useState(DateTime.local({
    zone: "Asia/Karachi"
  }).toISO({
    includeOffset: false,
    suppressMilliseconds: true,
    suppressSeconds: true
  }).substr(0, 16)),
      _useState10 = _slicedToArray(_useState9, 2),
      period_start = _useState10[0],
      setPeriodStart = _useState10[1];

  var _useState11 = useState(DateTime.local({
    zone: "Asia/Karachi"
  }).toISO({
    includeOffset: false,
    suppressMilliseconds: true,
    suppressSeconds: true
  }).substr(0, 16)),
      _useState12 = _slicedToArray(_useState11, 2),
      period_end = _useState12[0],
      setPeriodEnd = _useState12[1];

  var _useState13 = useState(period_start),
      _useState14 = _slicedToArray(_useState13, 2),
      period_start_draft = _useState14[0],
      setPeriodStartDraft = _useState14[1];

  var _useState15 = useState(period_end),
      _useState16 = _slicedToArray(_useState15, 2),
      period_end_draft = _useState16[0],
      setPeriodEndDraft = _useState16[1];

  var _useState17 = useState(false),
      _useState18 = _slicedToArray(_useState17, 2),
      editing_start = _useState18[0],
      setEditingStart = _useState18[1];

  var _useState19 = useState(false),
      _useState20 = _slicedToArray(_useState19, 2),
      editing_end = _useState20[0],
      setEditingEnd = _useState20[1];

  var _useState21 = useState(0),
      _useState22 = _slicedToArray(_useState21, 2),
      duration = _useState22[0],
      setDuration = _useState22[1]; // load any time slots the user may have set in the past


  useEffect(function () {
    fetch("/admin/interview/interviewer/time-slots/".concat(document.getElementById("interview-round-id").value)).then(function (raw_response) {
      if (raw_response.ok) {
        raw_response.json().then(function (response) {
          if (response.success) {
            setTimeSlots(response.time_slots);
            console.log(response.all_other_time_slots);
            var formatted_other_time_slots = response.all_other_time_slots.map(function (slot) {
              return {
                start: DateTime.fromISO(slot.start, {
                  zone: "Asia/Karachi"
                }),
                end: DateTime.fromISO(slot.end, {
                  zone: "Asia/Karachi"
                })
              };
            });
            setAllOtherTimeSlots(formatted_other_time_slots);
            setNumZoomAccounts(response.num_zoom_accounts);
          } else alert("Something went wrong. Error code 03.");
        }).catch(function (err) {
          alert("Something went wrong. Error code 02.");
        });
      } else alert("Something went wrong. Please check your internet connection and try again. Error Code 01.");
    });
  }, []);
  useEffect(function () {
    var start = DateTime.fromISO(period_start);
    var end = DateTime.fromISO(period_end);
    var diff = end.diff(start);
    if (diff.isValid) setDuration(diff.toMillis());else setDuration(0);
  }, [period_start, period_end]);

  var addNewTimeSlot = function addNewTimeSlot(e) {
    var start = DateTime.fromISO(period_start);
    var end = DateTime.fromISO(period_end);
    e.preventDefault();
    var diff = new Date(period_end).getTime() - new Date(period_start).getTime();
    if (diff < 0) alert("Error: The time period must start BEFORE it ends.");else if (diff < 600000) {
      alert("Each slot must be at least 10 minutes long.");
    } // checking if the selected time slot overlaps with more than {num_zoom_accounts} of the any of the other interviewers' slots
    else if (all_other_time_slots.reduce(function (num_overlaps, cur) {
      if (Interval.fromDateTimes(start, end).overlaps(Interval.fromDateTimes(cur.start, cur.end))) return num_overlaps + 1;else return num_overlaps;
    }, 0) < num_zoom_accounts) {
      setTimeSlots(function (cur) {
        var copy = [].concat(_toConsumableArray(cur), [{
          start: period_start,
          end: period_end,
          duration: duration
        }]);
        copy.sort(function (a, b) {
          return DateTime.fromISO(a.start).toMillis() - DateTime.fromISO(b.start).toMillis();
        });
        return copy;
      });
    } else {
      alert("Oh no! ".concat(num_zoom_accounts, " other interviewers have selected this same slot. We only have ").concat(num_zoom_accounts, " zoom accounts, so more than ").concat(num_zoom_accounts, " interviewers cannot conduct interviews at the same time. Please pick a different time slot."));
    }
  };

  var deleteSlot = function deleteSlot(i) {
    setTimeSlots(function (cur) {
      var copy = cur.slice();
      copy.splice(i, 1);
      return copy;
    });
  };

  var saveData = function saveData() {
    setSaving(true);
    fetch("/admin/interview/interviewer/save-time-slots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        interview_round_id: document.getElementById("interview-round-id").value,
        time_slots: time_slots
      })
    }).then(function (raw_response) {
      setSaving(false);

      if (raw_response.ok) {
        alert("Saved Successfully");
      } else {
        alert("Something went wrong on the server end.");
      }
    }).catch(function (err) {
      alert("Something went wrong. Make sure your internet is working.");
      console.log(err);
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    onSubmit: addNewTimeSlot,
    className: "flex justify-evenly items-center border"
  }, /*#__PURE__*/React.createElement("label", null, "Slot Start: "), !editing_start ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "bg-gray-200 border p-4"
  }, DateTime.fromISO(period_start).toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  })), /*#__PURE__*/React.createElement("a", {
    onClick: function onClick() {
      setEditingStart(true);
    },
    className: "text-iec-blue hover:text-iec-blue-hover cursor-pointer"
  }, /*#__PURE__*/React.createElement("i", {
    class: "far fa-edit"
  }), " Edit")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    value: period_start_draft,
    onChange: function onChange(e) {
      setPeriodStartDraft(e.target.value);
    },
    min: DateTime.local({
      zone: "Asia/Karachi"
    }).toISO({
      includeOffset: false
    }).substr(0, 16),
    className: " bg-gray-100 px-4 py-4",
    step: "60"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      setPeriodStart(period_start_draft);
      setEditingStart(false);
    },
    className: "p-4 bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer"
  }, "Set")), !editing_end ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "bg-gray-200 border p-4"
  }, DateTime.fromISO(period_end).toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  })), /*#__PURE__*/React.createElement("a", {
    onClick: function onClick() {
      setEditingEnd(true);
    },
    className: "text-iec-blue hover:text-iec-blue-hover cursor-pointer"
  }, /*#__PURE__*/React.createElement("i", {
    class: "far fa-edit"
  }), " Edit")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    value: period_end_draft,
    onChange: function onChange(e) {
      setPeriodEndDraft(e.target.value);
    },
    min: DateTime.local({
      zone: "Asia/Karachi"
    }).toISO({
      includeOffset: false
    }).substr(0, 16),
    className: " bg-gray-100 px-4 py-4",
    step: "60"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      setPeriodEnd(period_end_draft);
      setEditingEnd(false);
    },
    className: "p-4 bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer"
  }, "Set")), /*#__PURE__*/React.createElement("p", null, "Slot Duration:", " ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-700"
  }, Duration.fromMillis(duration).toFormat("hh 'hours' mm 'minutes'"))), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Add",
    className: "py-4 px-8 cursor-pointer bg-transparent border-2 border-gray-500 hover:bg-gray-600 text-gray-600 hover:text-white"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-bold mt-8"
  }, "Currently Chosen Time Slots: "), time_slots.length < 1 ? /*#__PURE__*/React.createElement("p", null, "No time slots selected yet.") : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: saveData,
    className: "float-right mb-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white"
  }, saving ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), " ", "Save Time Slots"), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Sr. No."), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Start Time"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "End Time"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Duration"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Action"))), /*#__PURE__*/React.createElement("tbody", null, time_slots.map(function (time_slot, index) {
    return DateTime.fromISO(time_slot.start).isValid && DateTime.fromISO(time_slot.end).isValid ? /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", {
      className: "p-2 border"
    }, index + 1), /*#__PURE__*/React.createElement("td", {
      className: "p-2 border"
    }, DateTime.fromISO(time_slot.start).toLocaleString({
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })), /*#__PURE__*/React.createElement("td", {
      className: "p-2 border"
    }, DateTime.fromISO(time_slot.end).toLocaleString({
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })), /*#__PURE__*/React.createElement("td", {
      className: "p-2 border"
    }, Duration.fromMillis(time_slot.duration).toFormat("hh 'hours' mm 'minutes'")), /*#__PURE__*/React.createElement("td", {
      className: "p-2 border "
    }, /*#__PURE__*/React.createElement("a", {
      className: "cursor-pointer text-iec-blue hover:text-iec-blue-hover underline hover:no-underline",
      "data-index": index,
      onClick: function onClick(e) {
        deleteSlot(e.target.dataset.index);
      }
    }, "Delete"))) : /*#__PURE__*/React.createElement("tr", null);
  })))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));