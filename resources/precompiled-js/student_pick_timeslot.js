"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var interview_round_id = document.getElementById("interview_round_id").innerHTML;
var interviewer_id = document.getElementById("interviewer_id").innerHTML;

var DatePill = function DatePill(_ref) {
  var date = _ref.date,
      selectedDate = _ref.selectedDate,
      onToggleDate = _ref.onToggleDate;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col border w-1/2 hover:scale-105 cursor-pointer transition-all duration-150 mb-4 rounded-md text-lg justify-center items-center p-4 ".concat(selectedDate ? "bg-iec-blue text-white border-white" : "text-iec-blue bg-white border-iec-blue"),
    onClick: function onClick() {
      onToggleDate(date);
    }
  }, date);
};

var TimeSlotPill = function TimeSlotPill(_ref2) {
  var timeSlot = _ref2.timeSlot,
      selectedTimeSlot = _ref2.selectedTimeSlot,
      onToggleTimeSlot = _ref2.onToggleTimeSlot,
      setInterviewTime = _ref2.setInterviewTime;
  //compute the interview time from start_time and end_time
  var start_time = new Date(new Number(timeSlot.start_time) + 60 * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  var end_time = new Date(new Number(timeSlot.end_time) + 60 * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col border w-1/2 hover:scale-105 cursor-pointer transition-all duration-150 mb-4 p-4 rounded-md text-lg justify-center items-center ".concat(selectedTimeSlot === timeSlot.id ? "bg-iec-blue text-white border-white" : "text-iec-blue bg-white border-iec-blue"),
    onClick: function onClick() {
      onToggleTimeSlot(timeSlot.id);
      setInterviewTime({
        start_time: start_time,
        end_time: end_time
      });
    }
  }, start_time, " - ", end_time);
};

var TimeSlotPicker = function TimeSlotPicker() {
  var _React$useState = React.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      timeSlots = _React$useState2[0],
      setTimeSlots = _React$useState2[1];

  var _React$useState3 = React.useState(null),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      selectedTimeSlot = _React$useState4[0],
      setSelectedTimeSlot = _React$useState4[1];

  var _React$useState5 = React.useState([]),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      dates = _React$useState6[0],
      setDates = _React$useState6[1];

  var _React$useState7 = React.useState(null),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      selectedDate = _React$useState8[0],
      setSelectedDate = _React$useState8[1];

  var _React$useState9 = React.useState(null),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      interviewTime = _React$useState10[0],
      setInterviewTime = _React$useState10[1]; //fetch available booking slots for interviewer


  React.useEffect( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var response, timeslots, dates, timeSlotsByDate;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch("/student/interview/".concat(interview_round_id, "/interviewer/").concat(interviewer_id, "/booking-slots"));

          case 2:
            _context.next = 4;
            return _context.sent.json();

          case 4:
            response = _context.sent;
            timeslots = response.booking_slots; //extract all unique dates from timeslots

            dates = new Set(timeslots.map(function (timeSlots) {
              return new Date(new Number(timeSlots.start_time)).toDateString().split(" ").slice(1).join(" ");
            })); //convert dates from set to array

            setDates(Array.from(dates)); //group timeslots by date

            timeSlotsByDate = {};
            timeslots.forEach(function (timeslot) {
              var date = new Date(new Number(timeslot.start_time)).toDateString().split(" ").slice(1).join(" ");

              if (timeSlotsByDate[date]) {
                timeSlotsByDate[date].push(timeslot);
              } else {
                timeSlotsByDate[date] = [timeslot];
              }
            });
            console.log(timeSlotsByDate);
            setTimeSlots(timeSlotsByDate);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), []);

  var handleToggleDate = function handleToggleDate(date) {
    if (selectedDate === date) {
      setSelectedDate(null);
    } else {
      console.log(date);
      setSelectedDate(date);
    }
  };

  var handleToggleTimeSlot = function handleToggleTimeSlot(timeSlot) {
    if (selectedTimeSlot === timeSlot) {
      setSelectedTimeSlot(null);
    } else {
      setSelectedTimeSlot(timeSlot);
    }
  };

  var bookSlot = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var _response;

      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;

              if (!selectedTimeSlot) {
                _context2.next = 8;
                break;
              }

              _context2.next = 4;
              return fetch("/student/interview/".concat(interview_round_id, "/interviewer/").concat(interviewer_id, "/book-slot"), {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  booking_slot_id: selectedTimeSlot
                })
              });

            case 4:
              _context2.next = 6;
              return _context2.sent.json();

            case 6:
              _response = _context2.sent;

              if (_response.success) {
                window.alert(_response.message);
                window.location.href = "/student/interview";
              }

            case 8:
              _context2.next = 15;
              break;

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](0);
              console.log(_context2.t0);
              window.alert(response.message);
              window.location.href = "/student/interview";

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 10]]);
    }));

    return function bookSlot() {
      return _ref4.apply(this, arguments);
    };
  }();

  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center content-center align-middle"
  }, /*#__PURE__*/React.createElement("section", {
    className: "p-2 w-full md:w-7/8 mx-auto mr-0 md:mt-16",
    id: "main-section"
  }, /*#__PURE__*/React.createElement("div", {
    id: "assessments-box",
    className: "bg-white w-7/8 rounded-lg m-auto"
  }, /*#__PURE__*/React.createElement("div", {
    id: "assessments-title-box",
    className: "bg-iec-blue text-white font-light px-4 py-3 rounded-t-lg"
  }, "My Interview Invites"), /*#__PURE__*/React.createElement("div", {
    id: "assessments-box-content",
    className: "px-4 py-8 overflow-x-auto grid md:grid-cols-3 grid-cols-1 grid-flow-col gap-2"
  }, dates.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "w-full ".concat(selectedDate ? "hidden md:flex md:flex-col" : "flex flex-col")
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-semibold flex items-center justify-center mb-4"
  }, "Pick a Date"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col h-full w-full items-center justify-center"
  }, dates.map(function (date) {
    return /*#__PURE__*/React.createElement(DatePill, {
      date: date,
      selectedDate: selectedDate,
      onToggleDate: handleToggleDate
    });
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-semibold flex items-center justify-center mb-4"
  }, "No slots available")), selectedDate && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full ".concat(selectedDate && selectedTimeSlot ? "hidden md:flex md:flex-col" : "flex flex-col")
  }, /*#__PURE__*/React.createElement("p", {
    className: "".concat(selectedDate ? "md:hidden" : "flex justify-center items-center text-lg mb-2 border-b border-iec-blue")
  }, "Interview Date: ", selectedDate), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-semibold flex items-center justify-center mb-4"
  }, "Pick a Time"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full h-full items-center justify-center"
  }, timeSlots[selectedDate].map(function (timeSlot) {
    return /*#__PURE__*/React.createElement(TimeSlotPill, {
      timeSlot: timeSlot,
      selectedTimeSlot: selectedTimeSlot,
      onToggleTimeSlot: handleToggleTimeSlot,
      setInterviewTime: setInterviewTime
    });
  }))), selectedTimeSlot && selectedDate && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-semibold flex items-center justify-center mt-4"
  }, "Your Interview Time"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col w-full h-full items-center justify-center mt-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-lg border-b border-iec-blue"
  }, " ", selectedDate, " | ", interviewTime.start_time, " - ", interviewTime.end_time), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue text-xl text-white p-4 m-2 mt-4 rounded-md",
    onClick: bookSlot
  }, "Book Interview")))))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(TimeSlotPicker, null), document.getElementById("app"));