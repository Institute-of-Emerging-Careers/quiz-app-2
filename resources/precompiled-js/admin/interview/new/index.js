"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

var MyContext = React.createContext();
var useEffect = React.useEffect;
var useState = React.useState;
var useContext = React.useContext;
var useRef = React.useRef;
var _luxon = luxon,
    DateTime = _luxon.DateTime,
    Duration = _luxon.Duration;
var interview_round_id = document.getElementById('interview-round-id-field').value;
var url = window.location.href.split('/');

if (url[url.length - 2] === 'new') {
  window.location = '/admin/interview/edit/' + interview_round_id;
}

var ContextProvider = function ContextProvider(props) {
  var _useState = useState([{
    title: 'Step 1: Add Interviewees (Students)',
    active: true
  }, {
    title: 'Step 2: Add Interviewers',
    active: false
  }, {
    title: 'Step 3: Create Matching',
    active: false
  }, {
    title: 'Step 4: Create Questions',
    active: false
  }, // { title: "Step 5: Send Emails", active: false  },
  {
    title: 'Step 5: Finalize Students',
    active: false
  }]),
      _useState2 = _slicedToArray(_useState, 2),
      steps = _useState2[0],
      setSteps = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      students = _useState4[0],
      setStudents = _useState4[1];

  var _useState5 = useState([]),
      _useState6 = _slicedToArray(_useState5, 2),
      matching = _useState6[0],
      setMatching = _useState6[1]; // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not


  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: {
      steps_object: [steps, setSteps],
      students_object: [students, setStudents],
      matching_object: [matching, setMatching]
    }
  }, props.children);
};

var StepMenu = function StepMenu() {
  var _useContext = useContext(MyContext),
      steps_object = _useContext.steps_object;

  var _steps_object = _slicedToArray(steps_object, 2),
      steps = _steps_object[0],
      setSteps = _steps_object[1];

  var changeMenu = function changeMenu(e) {
    setSteps(function (cur) {
      var copy = cur.slice();

      for (var i = 0; i < copy.length; i++) {
        if (i === e.target.id) copy[i].active = true;else copy[i].active = false;
      }

      return copy;
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-5 w-full h-full mt-4"
  }, steps.map(function (step, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: index
    }, step.active ? /*#__PURE__*/React.createElement("div", {
      className: "cursor-default bg-iec-blue text-white shadow-inner px-6 py-4 border-r w-full h-full",
      id: index,
      key: index,
      onClick: changeMenu
    }, step.title) : /*#__PURE__*/React.createElement("div", {
      className: "cursor-pointer px-6 py-4 bg-white border-r w-full h-full",
      id: index,
      key: index,
      onClick: changeMenu
    }, step.title));
  }));
};

var Step1 = function Step1() {
  var _useContext2 = useContext(MyContext),
      students_object = _useContext2.students_object;

  var _students_object = _slicedToArray(students_object, 1),
      students = _students_object[0];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      loading = _useState8[0],
      setLoading = _useState8[1];

  var saveData = function saveData() {
    setLoading(true);
    fetch('/admin/interview/interviewees/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        students: students,
        interview_round_id: interview_round_id
      })
    }).then(function (response) {
      console.log(response);

      if (response.ok) {
        response.json().then(function (parsed_response) {
          console.log(parsed_response);

          if (parsed_response.success) {
            alert('Saved successfully.');
          }
        }).catch(function (err) {
          console.log(err);
          alert('Something went wrong. Error code 02.');
        });
      } else {
        alert('Could not save interviewees.');
      }
    }).catch(function (err) {
      console.log(err);
      alert('Something went wrong. Error code 01. Check your internet connection.');
    }).finally(function () {
      setLoading(false);
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm text-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: saveData,
    className: "ml-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 active:shadow-inner cursor-pointer"
  }, loading ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin text-lg"
  }), " Saving...") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), " Save Interviewees"))), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(StudentsList, {
    key: "".concat(students.id, "-tr"),
    students: students,
    title: "Interview",
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
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement(NewStudentAdder, {
    all_students_api_endpoint_url: "/admin/interview/all-students/".concat(interview_round_id),
    students_object: students_object,
    title: "Interview"
  })));
};

var Step2 = function Step2() {
  var _useState9 = useState([]),
      _useState10 = _slicedToArray(_useState9, 2),
      interviewers = _useState10[0],
      setInterviewers = _useState10[1];

  var _useState11 = useState(''),
      _useState12 = _slicedToArray(_useState11, 2),
      new_interviewer_name = _useState12[0],
      setNewInterviewerName = _useState12[1];

  var _useState13 = useState(''),
      _useState14 = _slicedToArray(_useState13, 2),
      new_interviewer_email = _useState14[0],
      setNewInterviewerEmail = _useState14[1];

  var _useState15 = useState(false),
      _useState16 = _slicedToArray(_useState15, 2),
      show_email_composer = _useState16[0],
      setShowEmailComposer = _useState16[1];

  var _useState17 = useState(3),
      _useState18 = _slicedToArray(_useState17, 2),
      num_zoom_accounts = _useState18[0],
      setNumZoomAccounts = _useState18[1];

  var _useState19 = useState(num_zoom_accounts),
      _useState20 = _slicedToArray(_useState19, 2),
      original_num_zoom_accounts = _useState20[0],
      setOriginalNumZoomAccounts = _useState20[1];

  var _useState21 = useState(false),
      _useState22 = _slicedToArray(_useState21, 2),
      show_zoom_accounts_explanation = _useState22[0],
      setShowZoomAccountsExplanation = _useState22[1];

  var _useState23 = useState(false),
      _useState24 = _slicedToArray(_useState23, 2),
      show_modal = _useState24[0],
      setShowModal = _useState24[1];

  var _useState25 = useState(-1),
      _useState26 = _slicedToArray(_useState25, 2),
      selected_interviewer_index = _useState26[0],
      setSelectedInterviewerIndex = _useState26[1];

  var _useState27 = useState([]),
      _useState28 = _slicedToArray(_useState27, 2),
      specific_interviewers_to_email = _useState28[0],
      setSpecificInterviewersToEmail = _useState28[1];

  var _useState29 = useState(false),
      _useState30 = _slicedToArray(_useState29, 2),
      saving = _useState30[0],
      setSaving = _useState30[1];

  var _useState31 = useState(false),
      _useState32 = _slicedToArray(_useState31, 2),
      reload = _useState32[0],
      setReload = _useState32[1];

  var name_field = useRef();
  useEffect(function () {
    fetch("/admin/interview/interviewers/all/".concat(interview_round_id)).then(function (raw_response) {
      if (raw_response.ok) {
        raw_response.json().then(function (response) {
          setInterviewers(response.interviewers);
          setNumZoomAccounts(response.num_zoom_accounts);
          setOriginalNumZoomAccounts(response.num_zoom_accounts);
        });
      } else {
        alert('Error in URL. Wrong Interview Round. Please go to home page.');
      }
    });
  }, [reload]);
  useEffect(function () {
    setSpecificInterviewersToEmail(_toConsumableArray(interviewers.filter(function (interviewer) {
      return !interviewer.time_declared;
    })));
  }, [interviewers]);
  useEffect(function () {
    if (!show_modal) setSelectedInterviewerIndex(-1);
  }, [show_modal]);
  useEffect(function () {
    if (!show_email_composer) setSpecificInterviewersToEmail(interviewers.filter(function (interviewer) {
      return !interviewer.time_declared;
    }));
  }, [show_email_composer]);

  var saveData = function saveData() {
    setSaving(true);
    fetch("/admin/interview/update-interviewer-list/".concat(interview_round_id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        interviewers: interviewers,
        num_zoom_accounts: num_zoom_accounts
      })
    }).then(function (response) {
      if (!response.ok) {
        alert('Error while saving.');
      }
    }).catch(function (err) {
      console.log(err);
      alert('Something went wrong. Check your internet connection.');
    }).finally(function () {
      setSaving(false);
    });
  };

  var deleteSlot = function deleteSlot(time_slot_id) {
    fetch("/admin/interview/interviewer/time-slot/delete/".concat(time_slot_id), {
      method: 'DELETE'
    }).then(function (res) {
      if (res.ok) {
        setReload(function (cur) {
          return !cur;
        });
      } else {
        alert('Could not delete time slot. Some error occured at the server.');
      }
    }).catch(function (err) {
      console.log(err);
      alert('Error while deleting time slot. Are you sure your internet connection is working fine?');
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "p-8 bg-white rounded-md w-full mx-auto mt-8 text-sm"
  }, /*#__PURE__*/React.createElement("label", null, "Maximum number of interviewers that can select a particular time slot (aka number of zoom accounts):", ' '), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: original_num_zoom_accounts,
    max: "500",
    value: num_zoom_accounts,
    onChange: function onChange(e) {
      setNumZoomAccounts(e.target.value);
    },
    className: "px-3 py-2 border mb-2"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-question-circle cursor-pointer text-iec-blue ml-1",
    onClick: function onClick() {
      setShowZoomAccountsExplanation(function (cur) {
        return !cur;
      });
    }
  }), show_zoom_accounts_explanation ? /*#__PURE__*/React.createElement("ul", {
    className: "list-disc px-8 text-justify"
  }, /*#__PURE__*/React.createElement("li", null, "This feature makes sure that not more than the specified number of interviewers try to select an overlapping time slot. For example, if number of zoom accounts is set to 3, then only 3 interviewers can select a specific time slot. If a 4th interviewer tries to select a time slot that overlaps with those 3 interviewers, then he/she will see an error."), /*#__PURE__*/React.createElement("li", null, "You cannot reduce the number of zoom accounts once it has been increased. This is because during the time when the greater number of zoom accounts was set, a greater number of team members may have selected the same time slot.")) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("form", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg"
  }, "Add New Interviewer"), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex gap-x-4 items-center"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "new-interviewer",
    className: "min-w-max"
  }, "Full Name:", ' '), /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "150",
    name: "name",
    className: "w-full border py-3 px-4 mt-1 hover:shadow-sm",
    value: new_interviewer_name,
    onChange: function onChange(e) {
      setNewInterviewerName(e.target.value);
    },
    ref: name_field
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "new-interviewer",
    className: "min-w-max"
  }, "Email:", ' '), /*#__PURE__*/React.createElement("input", {
    type: "email",
    maxLength: "200",
    name: "email",
    value: new_interviewer_email,
    className: "w-full border py-3 px-4 mt-1 hover:shadow-sm",
    onChange: function onChange(e) {
      setNewInterviewerEmail(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3 px-6 border-2 border-gray-700 text-gray-700 cursor-pointer hover:bg-gray-700 hover:text-white",
    onClick: function onClick(e) {
      e.preventDefault();
      setInterviewers(function (cur) {
        var copy = cur.slice();
        copy.push({
          name: new_interviewer_name,
          email: new_interviewer_email,
          time_declared: false,
          time_slots: []
        });
        return copy;
      });
      setNewInterviewerName('');
      setNewInterviewerEmail('');
      name_field.current.focus();
    }
  }, "Add"))), /*#__PURE__*/React.createElement("hr", {
    className: "mt-4"
  }), show_email_composer ? /*#__PURE__*/React.createElement(EmailForm, {
    users: specific_interviewers_to_email,
    onFinish: function onFinish() {
      setShowEmailComposer(false);
    },
    sending_link: "/admin/interview/send-emails",
    default_values: {
      email_subject: 'IEC Interview Time Slots',
      email_heading: 'IEC Interview Time Slots',
      email_body: 'Dear Team Member<br>We hope you are well.<br>Please let us know when you are free to conduct some interviews. You can do so below.<br>',
      email_button_pre_text: 'Click the following button to log into your Interview Portal. <br>You will use the Interview Portal to declare your interview time slots, to find your Zoom credentials, and to record the Interview Scores of the students whom you interview.',
      email_button_label: 'Log In',
      email_button_url: 'Will be automatically set for each user'
    }
  }) : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    className: "flex mt-4 mb-4 justify-between items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg"
  }, "Interviewers Added"), /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-3 px-6 bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700",
    onClick: function onClick() {
      downloadAsCSV(interviewers);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-download"
  }), " Download as CSV"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-3 px-6 bg-iec-blue text-white cursor-pointer hover:bg-iec-blue-hover",
    onClick: function onClick() {
      setShowEmailComposer(function (cur) {
        return !cur;
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-paper-plane"
  }), " Send Emails to Interviewers who have not declared Time Slots yet"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-3 px-6 bg-green-500 text-white cursor-pointer hover:bg-green-600",
    onClick: saveData
  }, saving ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin self-center"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), ' ', "Save Data"))), /*#__PURE__*/React.createElement("p", null, "Number of Zoom Accounts: ", num_zoom_accounts), selected_interviewer_index >= 0 ? /*#__PURE__*/React.createElement(Modal, {
    show_modal: show_modal,
    setShowModal: setShowModal,
    heading: "View Time Slots of ".concat(interviewers[selected_interviewer_index].name),
    content: /*#__PURE__*/React.createElement("table", {
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
    }, "Action"))), /*#__PURE__*/React.createElement("tbody", null, interviewers[selected_interviewer_index].time_slots.map(function (time_slot, index) {
      return /*#__PURE__*/React.createElement("tr", {
        key: index
      }, /*#__PURE__*/React.createElement("td", {
        className: "p-2 border"
      }, index + 1), /*#__PURE__*/React.createElement("td", {
        className: "p-2 border"
      }, DateTime.fromISO(time_slot.start).toLocaleString({
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })), /*#__PURE__*/React.createElement("td", {
        className: "p-2 border"
      }, DateTime.fromISO(time_slot.end).toLocaleString({
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })), /*#__PURE__*/React.createElement("td", {
        className: "p-2 border"
      }, Duration.fromMillis(time_slot.duration).toFormat("hh 'hours' mm 'minutes'")), /*#__PURE__*/React.createElement("td", {
        className: "p-2 border "
      }, /*#__PURE__*/React.createElement("a", {
        className: "cursor-pointer text-iec-blue hover:text-iec-blue-hover underline hover:no-underline",
        "data-index": index,
        onClick: function onClick(e) {
          deleteSlot(time_slot.id);
        }
      }, "Delete")));
    })))
  }) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-sm"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Time Declared?"), /*#__PURE__*/React.createElement("th", null, "Total Hours Dedicated"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, interviewers.map(function (interviewer, index) {
    return /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, interviewer.name), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, interviewer.email), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, interviewer.time_declared ? 'Yes' : 'No'), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, Duration.fromMillis(interviewer.time_slots.reduce(function (total_time, cur_slot) {
      return total_time += cur_slot.duration;
    }, 0)).toFormat("hh 'hours' mm 'minutes'")), /*#__PURE__*/React.createElement("td", {
      className: "border px-4 py-2"
    }, /*#__PURE__*/React.createElement("a", {
      className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer",
      onClick: function onClick() {
        setShowModal(function (cur) {
          return !cur;
        });
        setSelectedInterviewerIndex(index);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "far fa-eye"
    }), " View Time Slots"), "|", ' ', /*#__PURE__*/React.createElement("a", {
      className: "cursor-pointer underline text-iec-blue hover:no-underline hover:text-iec-blue-hover",
      onClick: function onClick() {
        setShowModal(function (cur) {
          return !cur;
        });
        setSelectedInterviewerIndex(index);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash-alt"
    }), " Delete Slots"), ' ', "|", ' ', /*#__PURE__*/React.createElement("a", {
      className: "cursor-pointer underline text-iec-blue hover:no-underline hover:text-iec-blue-hover",
      onClick: function onClick() {
        setSpecificInterviewersToEmail([interviewer]);
        setShowEmailComposer(true);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "far fa-paper-plane"
    }), " Send Email asking", ' ', interviewer.name, " to Declare Time Slots")));
  }))));
};

var Step3 = function Step3() {
  // continue here. Show the Admin how many interviewers have declared their time slots, who dedicated how many hours of time
  // ask the Admin how many minutes should each interview last. Then calcualte reactively on the frontend, whether or not
  // we have sufficient time commitment from the interviewers to conduct the interviews of the selected number of students
  // If yes, create a time slot assignment
  // if no, ask Admin to go back to "Step 2" and either increase interviewers or resend emails asking them to increase their times.
  var _useState33 = useState(0),
      _useState34 = _slicedToArray(_useState33, 2),
      interviewTime = _useState34[0],
      setInterviewTime = _useState34[1]; // time per interview (including buffer time)


  var _useState35 = useState([]),
      _useState36 = _slicedToArray(_useState35, 2),
      interviewers = _useState36[0],
      setInterviewers = _useState36[1]; // list of interviewers


  var _useState37 = useState(0),
      _useState38 = _slicedToArray(_useState37, 2),
      total_interviews_possible = _useState38[0],
      setTotalInterviewsPossible = _useState38[1]; // total number of interviews possible


  var _useState39 = useState(0),
      _useState40 = _slicedToArray(_useState39, 2),
      total_time_available = _useState40[0],
      setTotalTimeAvailable = _useState40[1]; // total time available for interviews


  var _useState41 = useState(0),
      _useState42 = _slicedToArray(_useState41, 2),
      total_time_required = _useState42[0],
      setTotalTimeRequired = _useState42[1]; // total time required for interviews


  var _useContext3 = useContext(MyContext),
      students_object = _useContext3.students_object,
      steps_object = _useContext3.steps_object; // list of students in selected for interview


  var _steps_object2 = _slicedToArray(steps_object, 2),
      setSteps = _steps_object2[1];

  var _useState43 = useState(0),
      _useState44 = _slicedToArray(_useState43, 2),
      numberOfStudents = _useState44[0],
      setNumberOfStudents = _useState44[1];

  var _useState45 = useState([]),
      _useState46 = _slicedToArray(_useState45, 2),
      matching = _useState46[0],
      setMatching = _useState46[1];

  var _useState47 = useState(false),
      _useState48 = _slicedToArray(_useState47, 2),
      loading = _useState48[0],
      setLoading = _useState48[1];

  var _useState49 = useState(false),
      _useState50 = _slicedToArray(_useState49, 2),
      showModal = _useState50[0],
      setShowModal = _useState50[1];

  var _useState51 = useState(false),
      _useState52 = _slicedToArray(_useState51, 2),
      showMatchingModal = _useState52[0],
      setShowMatchingModal = _useState52[1];

  var _useState53 = useState(false),
      _useState54 = _slicedToArray(_useState53, 2),
      recreateMatching = _useState54[0],
      setRecreateMatching = _useState54[1];

  var _useState55 = useState(false),
      _useState56 = _slicedToArray(_useState55, 2),
      showEmailStudents = _useState56[0],
      setShowEmailStudents = _useState56[1];

  var _useState57 = useState(false),
      _useState58 = _slicedToArray(_useState57, 2),
      showEmailInterviewers = _useState58[0],
      setShowEmailInterviewers = _useState58[1]; // only keep students with the added flag set to true
  // check if interview-duration has previously been set


  useEffect( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var response;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch("/admin/interview/".concat(interview_round_id, "/get-interview-duration"));

          case 2:
            _context.next = 4;
            return _context.sent.json();

          case 4:
            response = _context.sent;

            if (response.interview_duration) {
              setInterviewTime(response.interview_duration);
            }

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), []); // check if a matching already exists

  useEffect(function () {
    fetch("/admin/interview/".concat(interview_round_id, "/matchings")).then(function (res) {
      return res.json().then(function (data) {
        // console.log(data);
        if (data.interview_matchings.length > 0) {
          setMatching(data.interview_matchings);
        }
      });
    });
  }, []);
  useEffect(function () {
    fetch("/admin/interview/interviewers/all/".concat(interview_round_id)).then(function (raw_response) {
      if (raw_response.ok) {
        raw_response.json().then(function (response) {
          // filter interviewers to include only those who have declared time
          var interviewers_with_time = response.interviewers.filter(function (interviewer) {
            return interviewer.time_declared;
          });
          setInterviewers(interviewers_with_time);
          var students = Object.values(students_object[0]).filter(function (student) {
            return student.added;
          }); // only students that have been selected for the interview round

          var time = 0; // compute the sum of all the time slots of all the interviewers

          interviewers.map(function (interviewer) {
            return interviewer.time_slots.reduce(function (total_time, cur_slot) {
              time += cur_slot.duration;
              return total_time += cur_slot.duration;
            }, 0);
          }); // compute the total number of students

          var total_students = Object.keys(students).length;
          setNumberOfStudents(total_students); // compute the total time required for all the interviews

          setTotalTimeRequired(total_students * interviewTime); // time required in minutes
          // compute the total time available for all the interviews

          setTotalTimeAvailable(Duration.fromMillis(time).toFormat('m')); // compute the total number of interviews that can be conducted

          if (interviewTime > 0) setTotalInterviewsPossible(Math.floor(total_time_available / interviewTime));
        });
      } else {
        alert('Error in URL. Wrong Interview Round. Please go to home page.');
      }
    });
  }, [interviewTime]);

  var computeMatching = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(e) {
      var students, i, interviewer, total_time, counter, student, _matching, flattened_matching, res, unique_interviewers;

      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              e.preventDefault();
              setLoading(true);
              _context3.prev = 2;
              _context3.next = 5;
              return fetch("/admin/interview/".concat(interview_round_id, "/set-interview-duration"), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  interview_duration: interviewTime
                })
              });

            case 5:
              // for each interviewer, assign students
              // need an object of the format {interviewer_id: [student1, student2, student3]}
              students = Object.values(students_object[0]).filter(function (student) {
                return student.added;
              }); // only students that have been selected for the interview round

              for (i = 0; i < interviewers.length; i++) {
                // calculate the number of students per interviewer (different for all)
                // for each interviewer
                interviewer = interviewers[i]; // calculate sum of durations for this interviwer

                total_time = interviewer.time_slots.reduce(function (total_time, cur_slot) {
                  return total_time += cur_slot.duration;
                }, 0);
                interviewer.num_interviews = Math.floor(Duration.fromMillis(total_time).toFormat('mm') / interviewTime);
                interviewer.students = [];
              }

              counter = 0; // to ensure equal distribution of interviewees among interviewers, we will assign students to interviewers in a round robin fashion

            case 8:
              if (!true) {
                _context3.next = 15;
                break;
              }

              if (interviewers[counter % interviewers.length].students.length < interviewers[counter % interviewers.length].num_interviews) {
                // check if the interviewer has space for another interview
                student = students.pop(0);
                interviewers[counter % interviewers.length].students.push({
                  id: student.id,
                  email: student.email
                });
              }

              counter++;

              if (!(students.length === 0)) {
                _context3.next = 13;
                break;
              }

              return _context3.abrupt("break", 15);

            case 13:
              _context3.next = 8;
              break;

            case 15:
              // extract matching in the format {interviewer_email, student_id}
              _matching = interviewers.map(function (interviewer) {
                return interviewer.students.map(function (student) {
                  return {
                    interviewer_email: interviewer.email,
                    student_id: student.id,
                    student_email: student.email
                  };
                });
              });
              flattened_matching = _matching.flat(); // now we have the matching. We need to send this to the backend to create the matching

              _context3.next = 19;
              return fetch("/admin/interview/".concat(interview_round_id, "/create-matching"), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  matching: flattened_matching
                })
              });

            case 19:
              res = _context3.sent;

              if (res.ok) {
                alert('Matching Created Successfully');
                setLoading(false);
                setMatching(flattened_matching);
                setSteps(function (cur) {
                  var copy = cur.slice();

                  for (var _i2 = 0; _i2 < copy.length; _i2++) {
                    if (_i2 === 3) copy[_i2].active = true;else copy[_i2].active = false;
                  }

                  return copy;
                }); // after creating the matching, we need to create booking slots for each interviewer
                // for each unique interviewer in the matching, create a booking slot

                unique_interviewers = _toConsumableArray(new Set(flattened_matching.map(function (item) {
                  return item.interviewer_email;
                })));
                unique_interviewers.map( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(interviewer_email) {
                    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return fetch("/admin/interview/".concat(interview_round_id, "/create-booking-slots"), {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                interviewer_email: interviewer_email
                              })
                            });

                          case 2:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x2) {
                    return _ref3.apply(this, arguments);
                  };
                }());
              } else {
                alert('Error in creating Time Slot Assignment, try again');
              }

              _context3.next = 28;
              break;

            case 23:
              _context3.prev = 23;
              _context3.t0 = _context3["catch"](2);
              console.log(_context3.t0);
              setLoading(false);
              alert('Something went wrong, please try again');

            case 28:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[2, 23]]);
    }));

    return function computeMatching(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  return /*#__PURE__*/React.createElement(React.Fragment, null, matching.length === 0 || recreateMatching === true ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col mt-20 p-4"
  }, /*#__PURE__*/React.createElement("div", null, showModal === true ? /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: "min-h-screen w-full inset-0 fixed z-30 bg-black/60 flex justify-center items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-min mx-auto mt-10 w-1/2 bg-white  shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, "Insufficient Time"), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: function onClick() {
      setShowModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8 h-min overflow-y-scroll"
  }, /*#__PURE__*/React.createElement("p", null, "Insufficient time available to conduct interviews of all students. You can:"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("br", null), "1. Decrease time per interview"), /*#__PURE__*/React.createElement("p", null, "2. Ask Interviewers for more time (Go back to Step 2)")))) : null), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-row"
  }, /*#__PURE__*/React.createElement("form", {
    className: "flex flex-col w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold border-l-2 border-b-2 border-iec-blue p-2 justify-self-start w-max"
  }, /*#__PURE__*/React.createElement("h2", {
    className: ""
  }, "Set Interview Time")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-x-4 items-center self-center mt-5 p-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "interview-time",
    className: "w-full p-4 mr-5 text-xl"
  }, "Set time per interview (including any break time):"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "150",
    name: "name",
    className: "bg-gray-300 w-1/5 px-4 h-10",
    value: interviewTime,
    onChange: function onChange(e) {
      e.preventDefault();
      setInterviewTime(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("label", null, "minutes"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col bg-gray-300 rounded-md p-5 m-5 w-full text-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 mt-5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-end items-start"
  }, "Total time required:"), /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-start items-start"
  }, ' ', total_time_required > 60 ? Math.floor(total_time_required / 60) + ' hours ' + total_time_required % 60 + ' minutes' : total_time_required + ' minutes')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-end items-start"
  }, "Time available:", ' '), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-start items-start"
  }, total_time_available > 60 ? Math.floor(total_time_available / 60) + ' hours ' + total_time_available % 60 + ' minutes' : total_time_available + ' minutes'), total_time_available < total_time_required ? /*#__PURE__*/React.createElement("label", {
    className: "text-red-400"
  }, "(Insufficient time)") : null)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-end items-start"
  }, "Number of Students:"), /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-start items-start"
  }, numberOfStudents)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-end items-start"
  }, "Interviews Possible:"), /*#__PURE__*/React.createElement("p", {
    className: "p-2 m-2 flex justify-start items-start"
  }, total_interviews_possible)), total_time_available < total_time_required ? /*#__PURE__*/React.createElement("div", {
    className: "p-4 m-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-black inline"
  }, "Note:"), /*#__PURE__*/React.createElement("p", {
    className: "text-iec-blue inline m-2"
  }, "You don\u2019t have sufficient time commitment from interviewers to conduct interviews of selected no. of students.")) : null)), /*#__PURE__*/React.createElement("button", {
    className: "m-20 w-1/10 self-center justify-self-center bg-iec-blue p-4 text-white rounded-md",
    onClick: total_time_available >= total_time_required ? computeMatching : function () {
      setShowModal(function (lastVal) {
        return !lastVal;
      });
    }
  }, "Create Matching", loading ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin text-lg m-2"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save text-lg m-2"
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-y-4 mt-4 p-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold justify-self-start flex w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "border-l-2 border-b-2 border-iec-blue p-2 self-start justify-self-start w-max"
  }, "Matching Status")), /*#__PURE__*/React.createElement("button", {
    className: "self-end justify-self-end w-full p-4 ml-auto text-iec-blue underline",
    onClick: function onClick() {
      setShowMatchingModal(true);
    }
  }, "Recreate matching"), showMatchingModal === true ? /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: "min-h-screen w-full inset-0 fixed z-30 bg-black/60 flex justify-center items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-min mx-auto mt-10 w-1/2 bg-white  shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, "WARNING"), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: function onClick() {
      setShowMatchingModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8 h-min overflow-y-scroll flex flex-col items-center justify-center"
  }, /*#__PURE__*/React.createElement("p", null, "Creating new matching will erase the previous matching, if any. Only create matching if you are sure you want to do so. ", /*#__PURE__*/React.createElement("br", null), " Do you want to create new matching?"), /*#__PURE__*/React.createElement("div", {
    className: "mt-10 flex"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bg-gray-400 py-4 px-8 rounded-md text-white mx-10",
    onClick: function onClick() {
      setShowMatchingModal(false);
    }
  }, "No"), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue py-4 px-8 rounded-md text-white mx-10",
    onClick: function onClick() {
      setShowMatchingModal(false);
      setRecreateMatching(true);
    }
  }, "Yes"))))) : null), showEmailStudents && /*#__PURE__*/React.createElement(EmailForm, {
    users: matching.map(function (match) {
      return match.student_email;
    }),
    onFinish: function onFinish() {
      setShowEmailStudents(false);
    },
    sending_link: "/admin/interview/".concat(interview_round_id, "/send-matching-emails-student"),
    default_values: {
      email_subject: 'IEC Interview Invite',
      email_heading: 'IEC Interview Invite',
      email_body: 'Dear Student<br>We hope you are well.<br>You have been assigned an interviewer, please log into your portal to book an appointment.<br>',
      email_button_pre_text: 'Click the following button to log into your Interview Portal. <br>You will use the Interview Portal to declare your interview time slots, to find your Zoom credentials, and to record the Interview Scores of the students whom you interview.',
      email_button_label: 'Log In',
      email_button_url: 'https://apply.iec.org.pk/student/login'
    }
  }), showEmailInterviewers && /*#__PURE__*/React.createElement(EmailForm, {
    users: matching.map(function (match) {
      return match.interviewer_email;
    }),
    onFinish: function onFinish() {
      setShowEmailInterviewers(false);
    },
    sending_link: "/admin/interview/".concat(interview_round_id, "/send-matching-emails-interviewer"),
    default_values: {
      email_subject: 'IEC Interview Invite',
      email_heading: 'IEC Interview Invite',
      email_body: 'Dear Member,<br>We hope you are well.<br>You have been assigned students to interview. Kindly login to your portal and check your assigned students<br>',
      email_button_pre_text: 'Click the following button to log into your Interview Portal. <br>You will use the Interview Portal to view your assigned students and to record the Interview Scores of the students whom you interview.',
      email_button_label: 'Log In',
      email_button_url: 'This will be automatically set'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end justify-end mt-10"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue py-4 px-8 text-white mx-10",
    onClick: function onClick() {
      setShowEmailInterviewers(false);
      setShowEmailStudents(true);
    }
  }, "Email Students"), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue py-4 px-8 text-white mx-10",
    onClick: function onClick() {
      setShowEmailStudents(false);
      setShowEmailInterviewers(true);
    }
  }, "Email Interviewers")), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "bg-gray-800 text-white"
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-2 "
  }, "Index"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 "
  }, "Interviewer Email"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 "
  }, "Student Email"))), /*#__PURE__*/React.createElement("tbody", null, matching.map(function (match, index) {
    return /*#__PURE__*/React.createElement("tr", {
      key: index,
      className: "bg-gray-300 p-4 mb-4"
    }, /*#__PURE__*/React.createElement("td", {
      className: "p-4 mt-4"
    }, index + 1), /*#__PURE__*/React.createElement("td", {
      className: "p-4 mt-4"
    }, match.interviewer_email), /*#__PURE__*/React.createElement("td", {
      className: "p-4 mt-4"
    }, match.student_email));
  })))));
};

var Step5 = function Step5() {
  var _useState59 = useState([]),
      _useState60 = _slicedToArray(_useState59, 2),
      students = _useState60[0],
      setStudents = _useState60[1];

  function download_table_as_csv(table_id) {
    var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';
    // Select rows from table_id
    var rows = document.querySelectorAll('table#' + table_id + ' tr');
    console.log(rows); // Construct csv

    var csv = [];

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].style.display !== 'none') {
        var row = [];
        var cols = rows[i].querySelectorAll('td, th');

        for (var j = 0; j < cols.length; j++) {
          // Clean innertext to remove multiple spaces and jumpline (break csv)
          var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' '); // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)

          data = data.replace(/"/g, '""'); // Push escaped string

          row.push('"' + data + '"');
        }

        csv.push(row.join(separator));
      }
    }

    if (csv.length === 1) {
      // the 1 row is the header row
      alert('Sorry! No rows to export. Change the filters.');
    } else {
      var csv_string = csv.join('\n'); // Download it

      var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
      var link = document.createElement('a');
      link.style.display = 'none';
      link.setAttribute('target', '_blank');
      link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } // fetch the total scores for all interviewees


  useEffect( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    var response;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return fetch("/admin/interview/".concat(interview_round_id, "/get-student-scores"));

          case 3:
            response = _context4.sent;

            if (!(response.status === 200)) {
              _context4.next = 11;
              break;
            }

            _context4.next = 7;
            return response.json();

          case 7:
            response = _context4.sent;

            if (response.success === 'ok') {
              setStudents(response.scores.filter(function (score) {
                return score;
              }));
            }

            _context4.next = 13;
            break;

          case 11:
            console.log(response);
            alert('An error occured, please refresh the page');

          case 13:
            _context4.next = 19;
            break;

          case 15:
            _context4.prev = 15;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            alert('An error occured, please refresh the page');

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 15]]);
  })), []);
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col justify-center items-center mt-10"
  }, students.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue text-white p-4 px-10 self-end justify-self-end rounded-md",
    onClick: function onClick() {
      download_table_as_csv('interview_results');
    }
  }, "Download as csv"), /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left mt-20",
    id: "interview_results"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "bg-gray-800 text-white p-4"
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Student Name"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Student Email"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Student CNIC"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Interviewer Name"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 border"
  }, "Marks Obtained"))), /*#__PURE__*/React.createElement("tbody", {
    className: "m-2 p-4"
  }, students.map(function (student) {
    return /*#__PURE__*/React.createElement("tr", {
      className: "bg-gray-300 p-4 m-2",
      key: student.id
    }, /*#__PURE__*/React.createElement("td", {
      className: "m-2 p-4"
    }, student.studentFirstName + ' ' + student.studentLastName), /*#__PURE__*/React.createElement("td", {
      className: "m-2 p-4"
    }, student.studentEmail), /*#__PURE__*/React.createElement("td", {
      className: "m-2 p-4"
    }, student.studentCnic), /*#__PURE__*/React.createElement("td", {
      className: "m-2 p-4"
    }, student.interviewerName), /*#__PURE__*/React.createElement("td", {
      className: "m-2 p-4"
    }, student.obtainedScore + ' / ' + student.totalScore));
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-white flex items-center justify-center text-xl mt-20 rounded-md p-4 "
  }, "No Students have been marked yet"));
};

var Main = function Main() {
  var _useContext4 = useContext(MyContext),
      steps_object = _useContext4.steps_object;

  var _steps_object3 = _slicedToArray(steps_object, 1),
      steps = _steps_object3[0];

  var _useState61 = useState(false),
      _useState62 = _slicedToArray(_useState61, 2),
      editInterviewRoundTitle = _useState62[0],
      setEditInterviewRoundTitle = _useState62[1];

  var _useState63 = useState(document.getElementById('interview-round-name-field').value),
      _useState64 = _slicedToArray(_useState63, 2),
      interviewRoundTitle = _useState64[0],
      setInterviewRoundTitle = _useState64[1];

  var _useState65 = useState(false),
      _useState66 = _slicedToArray(_useState65, 2),
      loading_name = _useState66[0],
      setLoadingName = _useState66[1];

  var updateInterviewRoundTitle = function updateInterviewRoundTitle(e) {
    e.preventDefault();
    setLoadingName(true);
    fetch("/admin/interview/update-round-title/".concat(document.getElementById('interview-round-id-field').value), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: interviewRoundTitle
      })
    }).then(function (response) {
      if (response.ok) {
        setEditInterviewRoundTitle(false);
      } else {
        alert("Error changing interview round name. Response code ".concat(response.status, "."));
      }
    }).catch(function (err) {
      console.log(err);
      alert('Something went worng. Make sure you have a working internet connection or contact IT. Error code 02.');
    }).finally(function () {
      setLoadingName(false);
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "/admin/interview"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-home"
  })), editInterviewRoundTitle ? /*#__PURE__*/React.createElement("form", {
    onSubmit: updateInterviewRoundTitle
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    maxLength: "50",
    name: "interview-round-title",
    value: interviewRoundTitle,
    onChange: function onChange(e) {
      setInterviewRoundTitle(e.target.value);
    },
    className: "px-4 py-2 min-w-max"
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    className: "p-2 bg-green-400 text-white cursor-pointer",
    value: loading_name ? 'Saving...' : 'Save'
  })) : /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl"
  }, "".concat(interviewRoundTitle, " "), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit cursor-pointer",
    onClick: function onClick() {
      setEditInterviewRoundTitle(function (cur) {
        return !cur;
      });
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepMenu, null)), steps[0].active ? /*#__PURE__*/React.createElement(Step1, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }), steps[1].active ? /*#__PURE__*/React.createElement(Step2, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }), steps[2].active ? /*#__PURE__*/React.createElement(Step3, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }), steps[3].active ? /*#__PURE__*/React.createElement(Step4, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }), steps[4].active ? /*#__PURE__*/React.createElement(Step5, null) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }));
};

var App = function App() {
  return /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement(Main, null));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('app'));