"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var MyContext = React.createContext();
var useEffect = React.useEffect;
var useState = React.useState;

var createApplicationRound = function createApplicationRound(courses, new_round_title, setUpdateData, setShowNewRoundModal) {
  if (new_round_title == "") alert("Please give the Application Round a title.");else if (courses.reduce(function (num_false, cur) {
    num_false += cur.checked;
  }, 0) < 3) alert("Please select at least 3 courses.");else {
    fetch("/admin/application/rounds/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: new_round_title,
        courses: courses.filter(function (cur) {
          return cur.checked;
        })
      })
    }).then(function (response) {
      if (response.ok) {
        setShowNewRoundModal(false);
        setUpdateData(function (cur) {
          return cur + 1;
        });
      } else alert("Could not create application round.");
    });
  }
};

var deleteApplicationRound = function deleteApplicationRound(application_round_id, setDeletingApplicationRound, setUpdateData) {
  var confirmation = prompt("Are you sure you wish to delete this application round? All applications will be deleted. Type 'yes' if you do.");

  if (confirmation == "yes") {
    setDeletingApplicationRound(true);
    fetch("/admin/application/rounds/delete/".concat(application_round_id), {
      method: "DELETE"
    }).then(function (response) {
      setDeletingApplicationRound(false);

      if (response.ok) {
        setUpdateData(function (cur) {
          return cur + 1;
        });
      } else alert("Could not delete application round due to an error. Code 01.");
    }).catch(function (err) {
      console.log(err);
      alert("Could not delete application round due to an error. Code 02.");
    });
  }
};

var addNewCourse = function addNewCourse(new_course_title, setNewCourseTitle, setCourses) {
  fetch("/admin/application/course/new", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: new_course_title
    })
  }).then(function (response) {
    if (response.ok) {
      response.json().then(function (parsed_response) {
        if (parsed_response.newlyCreated) setCourses(function (cur) {
          return [].concat(_toConsumableArray(cur), [{
            id: parsed_response.course.id,
            title: parsed_response.course.title,
            checked: false
          }]);
        });
        setNewCourseTitle("");
      });
    }
  }).catch(function (err) {
    console.log(err);
    alert("Something went wrong while adding a new course.");
  });
};

var NewApplicationModal = function NewApplicationModal(_ref) {
  var courses = _ref.courses,
      setCourses = _ref.setCourses,
      setUpdateData = _ref.setUpdateData,
      setShowNewRoundModal = _ref.setShowNewRoundModal;

  var _useState = useState(""),
      _useState2 = _slicedToArray(_useState, 2),
      new_round_title = _useState2[0],
      setNewRoundTitle = _useState2[1];

  var _useState3 = useState(""),
      _useState4 = _slicedToArray(_useState3, 2),
      new_course_title = _useState4[0],
      setNewCourseTitle = _useState4[1];

  return /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: "h-screen w-screen inset-0 absolute z-30 bg-black/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-10 w-1/2 bg-white translate-x-2/4 shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-link text-xl text-white"
  }), " Create New Application Round"), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: function onClick() {
      setShowNewRoundModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      createApplicationRound(courses, new_round_title, setUpdateData, setShowNewRoundModal);
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "title"
  }, "Please give this Application Round a title:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    min: "2",
    name: "title",
    placeholder: "Cohort 4 Application Round 1",
    className: "border px-4 py-2 ml-2",
    value: new_round_title,
    onChange: function onChange(e) {
      setNewRoundTitle(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "courses"
  }, "Which courses can students apply for?"), courses.map(function (course, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: course.id
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      name: "courses",
      checked: course.checked,
      "data-index": index,
      "data-testid": "checkbox-".concat(course.title),
      onChange: function onChange(e) {
        setCourses(function (cur) {
          var copy = cur.slice();
          copy[e.target.dataset.index].checked = !copy[e.target.dataset.index].checked;
          return copy;
        });
      }
    }), /*#__PURE__*/React.createElement("label", null, " " + course.title));
  }), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "courses"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "newCourseTitle",
    className: "py-1 px-2 border",
    placeholder: "Course Title",
    value: new_course_title,
    onChange: function onChange(e) {
      setNewCourseTitle(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return addNewCourse(new_course_title, setNewCourseTitle, setCourses);
    },
    className: "px-2 py-1 bg-gray-400"
  }, "Add New Course")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Create Application Round",
    className: "px-4 py-2 mt-4 bg-iec-blue hover:bg-iec-blue-hover text-white cursor-pointer"
  })))));
};

var openQuizSelectionModal = function openQuizSelectionModal(applicationRoundId, setShowQuizSelectionModal, setActiveApplication) {
  setActiveApplication(applicationRoundId);
  setShowQuizSelectionModal(true);
};

var saveAutoAssignQuiz = function saveAutoAssignQuiz(applicationRoundId, quizId) {
  return fetch("/admin/application/rounds/set-auto-assign-quiz/".concat(applicationRoundId, "/").concat(quizId), {
    method: "POST"
  });
};

var QuizSelectionModal = function QuizSelectionModal(_ref2) {
  var showQiuzSelectionModal = _ref2.showQiuzSelectionModal,
      setShowQuizSelectionModal = _ref2.setShowQuizSelectionModal,
      activeApplicationRound = _ref2.activeApplicationRound;

  var _useState5 = useState([]),
      _useState6 = _slicedToArray(_useState5, 2),
      quizzes = _useState6[0],
      setQuizzes = _useState6[1];

  var _useState7 = useState(null),
      _useState8 = _slicedToArray(_useState7, 2),
      selectedQuizId = _useState8[0],
      setSelectedQuizId = _useState8[1];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      loading = _useState10[0],
      setLoading = _useState10[1];

  useEffect(function () {
    fetch("/quiz/all-titles").then(function (response) {
      response.json().then(function (parsed_response) {
        setQuizzes(parsed_response);
      });
    });
  }, []);
  return /*#__PURE__*/React.createElement(Modal, {
    show_modal: showQiuzSelectionModal,
    setShowModal: setShowQuizSelectionModal,
    heading: "Pick a Quiz to Auto Assign"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mr-2"
  }, "Select a Quiz to auto-assign to Applicants:"), /*#__PURE__*/React.createElement("select", {
    className: "border p-2",
    onChange: function onChange(e) {
      console.log(e.target.value);
      setSelectedQuizId(e.target.value);
    }
  }, /*#__PURE__*/React.createElement("option", {
    disabled: true,
    selected: true
  }, "Select an option"), quizzes.map(function (quiz) {
    return /*#__PURE__*/React.createElement("option", {
      key: quiz.id,
      value: quiz.id
    }, quiz.title, " | Created ", new Date(quiz.createdAt).toDateString());
  })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue hover:bg-iec-blue-hover text-white px-3 py-2 mr-1",
    type: "button",
    onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              setLoading(true);
              _context.prev = 1;
              _context.next = 4;
              return saveAutoAssignQuiz(activeApplicationRound, selectedQuizId);

            case 4:
              _context.next = 9;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](1);
              alert("Something went wrong.");

            case 9:
              setLoading(false);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 6]]);
    }))
  }, "Auto-Assign"), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue hover:bg-iec-blue-hover text-white px-3 py-2",
    type: "button"
  }, "Disable Auto-Assignment"), loading && /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin self-center"
  }));
};

var App = function App() {
  var _useState11 = useState([]),
      _useState12 = _slicedToArray(_useState11, 2),
      application_rounds = _useState12[0],
      setApplicationRounds = _useState12[1];

  var _useState13 = useState([]),
      _useState14 = _slicedToArray(_useState13, 2),
      courses = _useState14[0],
      setCourses = _useState14[1];

  var _useState15 = useState(false),
      _useState16 = _slicedToArray(_useState15, 2),
      showNewRoundModal = _useState16[0],
      setShowNewRoundModal = _useState16[1];

  var _useState17 = useState(false),
      _useState18 = _slicedToArray(_useState17, 2),
      showQiuzSelectionModal = _useState18[0],
      setShowQuizSelectionModal = _useState18[1];

  var _useState19 = useState(null),
      _useState20 = _slicedToArray(_useState19, 2),
      activeApplication = _useState20[0],
      setActiveApplication = _useState20[1];

  var _useState21 = useState(0),
      _useState22 = _slicedToArray(_useState21, 2),
      update_data = _useState22[0],
      setUpdateData = _useState22[1];

  var _useState23 = useState(false),
      _useState24 = _slicedToArray(_useState23, 2),
      show_copied_box = _useState24[0],
      setShowCopiedBox = _useState24[1];

  var _useState25 = useState(false),
      _useState26 = _slicedToArray(_useState25, 2),
      deleting_application_round = _useState26[0],
      setDeletingApplicationRound = _useState26[1];

  useEffect( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var raw_response, response;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return fetch("/admin/application/rounds/all");

          case 3:
            raw_response = _context2.sent;
            _context2.next = 10;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](0);
            alert("Please check your internet connection and try again. Error code 03.");
            return _context2.abrupt("return");

          case 10:
            if (raw_response.ok) {
              _context2.next = 13;
              break;
            }

            alert("Something went wrong while getting application rounds. Error code 01.");
            return _context2.abrupt("return");

          case 13:
            _context2.prev = 13;
            _context2.next = 16;
            return raw_response.json();

          case 16:
            response = _context2.sent;
            setApplicationRounds(response.application_rounds);
            setCourses(response.courses.map(function (course) {
              course.checked = false;
              return course;
            }));
            _context2.next = 25;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t1 = _context2["catch"](13);
            console.log(_context2.t1);
            alert("Error while understanding the server's response. Error code 02.");

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 6], [13, 21]]);
  })), [update_data]);

  var changeApplicationOpenState = function changeApplicationOpenState(application_round_id, new_val) {
    fetch("/admin/application/round/change-open-state/".concat(application_round_id, "/").concat(new_val)).then(function (res) {
      if (res.ok) {
        setUpdateData(function (cur) {
          return cur + 1;
        });
      } else {
        alert("Could not change state of application round.");
      }
    });
  };

  return /*#__PURE__*/React.createElement("div", null, showNewRoundModal && /*#__PURE__*/React.createElement(NewApplicationModal, {
    courses: courses,
    setCourses: setCourses,
    setUpdateData: setUpdateData,
    setShowNewRoundModal: setShowNewRoundModal
  }), /*#__PURE__*/React.createElement(QuizSelectionModal, {
    showQiuzSelectionModal: showQiuzSelectionModal,
    setShowQuizSelectionModal: setShowQuizSelectionModal,
    activeApplicationRound: activeApplication
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl mt-6 mb-4 font-bold"
  }, "Applications", /*#__PURE__*/React.createElement("button", {
    className: "text-xs px-4 ml-2 py-1 cursor-pointer bg-iec-blue hover:bg-iec-blue-hover text-white rounded-full",
    onClick: function onClick() {
      setShowNewRoundModal(function (cur) {
        return !cur;
      });
    }
  }, "NEW")), show_copied_box ? /*#__PURE__*/React.createElement("div", {
    className: "text-xs absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-10 w-max h-max bg-white px-4 py-2 shadow-md text-gray-800"
  }, "Linked Copied to Clipboard!") : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-start gap-y-10 gap-x-10"
  }, application_rounds.length == 0 ? /*#__PURE__*/React.createElement("p", null, "No application rounds to show.") : application_rounds.map(function (application_round, index) {
    return /*#__PURE__*/React.createElement("div", {
      className: "w-64 border bg-white quiz-card",
      key: index
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-x-6 py-4 h-16 bg-iec-blue justify-center content-center"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/admin/application/view/".concat(application_round.id),
      className: "text-white text-xl col-start-2 col-span-1 justify-self-center hover:text-gray-100 cursor-pointer",
      title: "View Applications"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-list"
    })), /*#__PURE__*/React.createElement("a", {
      "data-id": application_round.id,
      onClick: function onClick(e) {
        navigator.clipboard.writeText("".concat(site_domain_name, "/application/fill/").concat(e.target.dataset.id));
        setShowCopiedBox(true);
        window.setTimeout(function () {
          setShowCopiedBox(false);
        }, 2000);
      },
      className: "text-white text-xl col-span-1 justify-self-center hover:text-gray-100 cursor-pointer relative",
      title: "Copy Link"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-link",
      "data-id": application_round.id
    })), /*#__PURE__*/React.createElement("a", {
      className: "text-white text-xl col-span-1 justify-self-center hover:text-gray-100 cursor-pointer",
      title: application_round.open ? "Close Applications" : "Open Applications",
      onClick: function onClick() {
        changeApplicationOpenState(application_round.id, !application_round.open);
      }
    }, application_round.open ? /*#__PURE__*/React.createElement("i", {
      className: "fas fa-door-open"
    }) : /*#__PURE__*/React.createElement("i", {
      className: "fas fa-door-closed"
    })), /*#__PURE__*/React.createElement("a", {
      className: "text-white text-xl col-span-1 justify-self-center hover:text-gray-100 cursor-pointer",
      title: "Delete Application Round",
      "data-id": application_round.id,
      "data-index": index,
      onClick: function onClick(e) {
        deleteApplicationRound(e.target.dataset.id, setDeletingApplicationRound, setUpdateData);
      }
    }, deleting_application_round ? /*#__PURE__*/React.createElement("i", {
      className: "fas fa-spinner animate-spin"
    }) : /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash",
      "data-id": application_round.id,
      "data-index": index
    })), /*#__PURE__*/React.createElement("a", {
      className: "text-white text-xl col-span-1 justify-self-center hover:text-gray-100 cursor-pointer",
      title: "Enable Auto Assignment of Quiz to Applicants",
      onClick: function onClick() {
        openQuizSelectionModal(application_round.id, setShowQuizSelectionModal, setActiveApplication);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-circle-check"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "py-3"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "col-span-6 font-semibold text-lg px-4"
    }, application_round.title), /*#__PURE__*/React.createElement("div", {
      className: "col-start-1 col-span-6"
    }, /*#__PURE__*/React.createElement("p", {
      className: "pl-4 pt-0"
    }, application_round.Applications.length, " applied"))));
  })));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));