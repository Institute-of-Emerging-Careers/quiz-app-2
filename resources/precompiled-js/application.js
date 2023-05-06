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

var useState = React.useState;
var useEffect = React.useEffect;

var Header = function Header() {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex w-full items-center justify-center p-4 bg-white mb-4"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-iec-blue to-green-500 p-5"
  }, "Apply To IEC"));
};

var Input = function Input(_ref) {
  var label = _ref.label,
      placeholder = _ref.placeholder,
      form = _ref.form,
      name = _ref.name,
      type = _ref.type,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? undefined : _ref$onChange,
      _ref$value = _ref.value,
      value = _ref$value === void 0 ? undefined : _ref$value,
      min = _ref.min,
      max = _ref.max,
      error = _ref.error;
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
    className: "border-2 border-gray-300 rounded-lg p-2 h-12 w-full"
  })));
};

var ERROR_TYPE = {
  EMAIL_EXISTS: 'email_exists',
  CNIC_EXISTS: 'cnic_exists',
  ALREADY_APPLIED: 'already_applied',
  PASSWORD_TOO_SHORT: 'password_too_short',
  PASSWORD_MISMATCH: 'password_mismatch'
};
var STATUS_TYPES = {
  JUST_OPENED: 'just_opened',
  NEW_USER: 'new_user',
  EXISTING_USER: 'existing_user'
};

var ErrorDisplay = function ErrorDisplay(_ref2) {
  var errorType = _ref2.errorType,
      email = _ref2.email;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-x-2"
  }, !!errorType && /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-circle text-red-500"
  }), errorType === ERROR_TYPE.EMAIL_EXISTS && /*#__PURE__*/React.createElement("p", null, "The email you entered already exists in our database. It means you have already applied to a different IEC cohort before. But you entered a different CNIC number last time. Please use the same combination of email and CNIC as last time.", /*#__PURE__*/React.createElement("br", null), "Or, if you think you accidentally entered the wrong CNIC number last time, you can ", /*#__PURE__*/React.createElement("a", {
    href: "/application/change-cnic",
    target: "_blank",
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline"
  }, "click here to change your CNIC number"), " if you remember your password from last time"), errorType === ERROR_TYPE.CNIC_EXISTS && /*#__PURE__*/React.createElement("p", null, "We already have this CNIC in our database. It means you have applied to IEC in the past, but you used a different email address the last time. The email address you used last time looked something like this: ", email, ".", /*#__PURE__*/React.createElement("br", null), "If that email address was correct, then please use that same email address and cnic pair.", /*#__PURE__*/React.createElement("br", null), "If you entered a wrong email address the last time, then ", /*#__PURE__*/React.createElement("a", {
    href: "/application/change-email",
    className: "text-iec-blue hover:text-iec-blue-hover underline hover:no-underline"
  }, "click here to change your email address"), "."), errorType === ERROR_TYPE.ALREADY_APPLIED && /*#__PURE__*/React.createElement("p", null, "You have already applied to this Cohort of IEC. You cannot apply again. Contact IEC via email on mail@iec.org.pk if you have any concerns."), errorType === ERROR_TYPE.PASSWORD_TOO_SHORT && /*#__PURE__*/React.createElement("p", null, "Password must be at least 8 characters long."), errorType === ERROR_TYPE.PASSWORD_MISMATCH && /*#__PURE__*/React.createElement("p", null, "Please write the same password both times. The two password fields do not match."));
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


var validationSchema = {
  email: {
    required: true,
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  cnic: {
    required: true,
    regex: /^(\d{5})-(\d{7})-(\d{1})$/
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
    regex: /^(\+?\d{1,3})?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/
  },
  city: {
    required: true,
    is_in: ["Lahore", "Islamabad/Rawalpindi", "Karachi", "Peshawar", "Other"]
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
  var errors = {};
  var error_exists = false;

  for (var fieldName in validationSchema) {
    var fieldValidation = validationSchema[fieldName];
    errors[fieldName] = ""; // Check if the field is required

    if (fieldValidation.required && !formData.has(fieldName)) {
      errors[fieldName] = "".concat(fieldName, " is required");
      error_exists = true;
    } // Check if the field has a regex pattern to match against


    if (fieldValidation.regex && formData.has(fieldName)) {
      var fieldValue = formData.get(fieldName);

      if (!fieldValidation.regex.test(fieldValue)) {
        errors[fieldName] = "".concat(fieldName, " is invalid");
        error_exists = true;
      }
    } // Check if the field has a minimum length requirement


    if (fieldValidation.min_length && formData.has(fieldName)) {
      var _fieldValue = formData.get(fieldName);

      if (_fieldValue.length < fieldValidation.min_length) {
        errors[fieldName] = "".concat(fieldName, " should be at least ").concat(fieldValidation.min_length, " characters long");
        error_exists = true;
      }
    } // Check if the field has a maximum length requirement


    if (fieldValidation.max_length && formData.has(fieldName)) {
      var _fieldValue2 = formData.get(fieldName);

      if (_fieldValue2.length > fieldValidation.max_length) {
        errors[fieldName] = "".concat(fieldName, " should be at most ").concat(fieldValidation.max_length, " characters long");
        error_exists = true;
      }
    } // Check if the field is an integer within a range


    if (fieldValidation.is_int && formData.has(fieldName)) {
      var _fieldValue3 = parseInt(formData.get(fieldName));

      if (isNaN(_fieldValue3) || !Number.isInteger(_fieldValue3)) {
        errors[fieldName] = "".concat(fieldName, " should be an integer");
        error_exists = true;
      } else if (fieldValidation.min && _fieldValue3 < fieldValidation.min) {
        errors[fieldName] = "".concat(fieldName, " should be at least ").concat(fieldValidation.min);
        error_exists = true;
      } else if (fieldValidation.max && _fieldValue3 > fieldValidation.max) {
        errors[fieldName] = "".concat(fieldName, " should be at most ").concat(fieldValidation.max);
        error_exists = true;
      }
    } // Check if the field value is within a set of allowed values


    if (fieldValidation.is_in && formData.has(fieldName)) {
      var _fieldValue4 = formData.get(fieldName);

      if (!fieldValidation.is_in.includes(_fieldValue4)) {
        errors[fieldName] = "".concat(fieldName, " is not an allowed value");
        error_exists = true;
      }
    }
  }

  return [error_exists, errors];
}

var App = function App() {
  var _useState = useState(""),
      _useState2 = _slicedToArray(_useState, 2),
      CNIC = _useState2[0],
      setCNIC = _useState2[1];

  var _useState3 = useState(""),
      _useState4 = _slicedToArray(_useState3, 2),
      password = _useState4[0],
      setPassword = _useState4[1];

  var _useState5 = useState(""),
      _useState6 = _slicedToArray(_useState5, 2),
      confirmPassword = _useState6[0],
      setConfirmPassword = _useState6[1];

  var _useState7 = useState([]),
      _useState8 = _slicedToArray(_useState7, 2),
      courses = _useState8[0],
      setCourses = _useState8[1];

  var _useState9 = useState(""),
      _useState10 = _slicedToArray(_useState9, 2),
      email = _useState10[0],
      setEmail = _useState10[1];

  var _useState11 = useState(""),
      _useState12 = _slicedToArray(_useState11, 2),
      courseInterest = _useState12[0],
      setCourseInterest = _useState12[1];

  var _useState13 = useState(STATUS_TYPES.JUST_OPENED),
      _useState14 = _slicedToArray(_useState13, 2),
      status = _useState14[0],
      setStatus = _useState14[1];

  var _useState15 = useState(""),
      _useState16 = _slicedToArray(_useState15, 2),
      errorType = _useState16[0],
      setErrorType = _useState16[1];

  var _useState17 = useState(""),
      _useState18 = _slicedToArray(_useState17, 2),
      oldEmailAddress = _useState18[0],
      setOldEmailAddress = _useState18[1];

  var _useState19 = useState({
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
  }),
      _useState20 = _slicedToArray(_useState19, 2),
      errorMessage = _useState20[0],
      setErrorMessage = _useState20[1]; //one of few discrete states, not a boolean;
  //status can be:
  // justOpened(hasn't entered email yet),
  // alreadyApplied
  // existingUser (dont ask for password)
  // newUser (ask for password)


  var handleCNIC = function handleCNIC(e) {
    setCNIC(formatCNIC(e.target.value));
  };

  var formatCNIC = function formatCNIC(input) {
    var cleanedInput = input.replace(/\D/g, "");
    if (input.length <= 5) return cleanedInput;
    var formattedInput = cleanedInput.slice(0, 5).concat("-", cleanedInput.slice(5, 12));
    if (input.length <= 13) return formattedInput;
    formattedInput = formattedInput.concat("-", cleanedInput.slice(12, 13));
    return formattedInput;
  };

  var checkAlreadyRegistered = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
      var response, data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              e.preventDefault();
              e.stopPropagation(); //valid responses to this request are;
              // already_applied (do not allow an application)
              // both_cnic_and_email (allow but don't ask for password)
              // cnic_only (don't allow an application, display a message of email and cnic mismatch)
              // email_only (don't ask for password)

              _context.prev = 2;
              _context.next = 5;
              return fetch("/application/check-if-user-exists", {
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

            case 5:
              response = _context.sent;
              _context.next = 8;
              return response.json();

            case 8:
              data = _context.sent;

              if (!data.exists) {
                setStatus(STATUS_TYPES.NEW_USER);
                setErrorType("");
              }

              if (data.type === "both_cnic_and_email") {
                setStatus("existingUser");
                setErrorType("");
              } else if (data.type === "already_applied") {
                setErrorType(ERROR_TYPE.ALREADY_APPLIED);
              } else if (data.type === "cnic_only") {
                setOldEmailAddress(data.email);
                setErrorType(ERROR_TYPE.CNIC_EXISTS);
              } else if (data.type === 'email_only') {
                setErrorType(ERROR_TYPE.EMAIL_EXISTS);
              }

              _context.next = 16;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](2);
              console.log(_context.t0);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 13]]);
    }));

    return function checkAlreadyRegistered(_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  var handlePassword = function handlePassword(e) {
    setPassword(e.target.value);
  };

  var handleConfirmPassword = function handleConfirmPassword(e) {
    return setConfirmPassword(e.target.value);
  };

  useEffect(function () {
    if (password !== confirmPassword) setErrorType(ERROR_TYPE.PASSWORD_MISMATCH);else if (password.length < 8 && password.length > 0) setErrorType(ERROR_TYPE.PASSWORD_TOO_SHORT);else setErrorType("");
  }, [password, confirmPassword]);

  var handleSubmit = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(e) {
      var application_round_id, formData, _validate, _validate2, error_exists, errors, name, words, firstName, lastName, age, response;

      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              e.preventDefault();
              e.stopPropagation();

              if (!errorType) {
                _context2.next = 5;
                break;
              }

              alert("Please fix all errors before submitting the form. If there is a problem, email mail@iec.org.pk or reload the page.");
              return _context2.abrupt("return");

            case 5:
              _context2.prev = 5;
              application_round_id = window.location.pathname.split("/")[3];
              formData = new FormData(e.target);
              _validate = validate(formData), _validate2 = _slicedToArray(_validate, 2), error_exists = _validate2[0], errors = _validate2[1];

              if (!error_exists) {
                _context2.next = 13;
                break;
              }

              alert("Invalid input. Please enter valid information.");
              setErrorMessage(errors);
              return _context2.abrupt("return");

            case 13:
              // divide name into firstname and lastname by space, if there is no lastname, set it to ""
              name = formData.get("name");
              words = name.trim().split(' ');
              firstName = words.shift();
              lastName = words.join(' ');
              console.log(firstName, lastName);
              age = parseInt(formData.get("age"));
              _context2.next = 21;
              return fetch("/application/submit/".concat(application_round_id, "/"), {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  email: formData.get("email"),
                  cnic: formData.get("cnic"),
                  password: formData.get("password"),
                  firstName: firstName,
                  lastName: lastName,
                  age_group: age < 22 ? 'Less than 22' : age >= 22 && age <= 35 ? '22 - 35' : 'More than 35',
                  age: age,
                  phone: formData.get("phone"),
                  city: formData.get("city"),
                  education_completed: formData.get("education"),
                  type_of_employment: formData.get("employment"),
                  firstPreferenceId: formData.get("course_interest"),
                  application_round_id: application_round_id
                })
              });

            case 21:
              response = _context2.sent;

              if (response.status === 201) {// window.location.href = "https://iec.org.pk/thankyou"
              } else {
                alert("Something went wrong. Try again or contact mail@iec.org.pk");
                console.log(response);
              }

              _context2.next = 28;
              break;

            case 25:
              _context2.prev = 25;
              _context2.t0 = _context2["catch"](5);
              console.log(_context2.t0);

            case 28:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[5, 25]]);
    }));

    return function handleSubmit(_x2) {
      return _ref4.apply(this, arguments);
    };
  }(); //this effect gets the courses being offered in the current application round


  useEffect( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    var application_round_id, response, data;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            //get application ID from URL
            application_round_id = window.location.pathname.split("/")[3];
            _context3.next = 3;
            return fetch("/application/".concat(application_round_id, "/courses"));

          case 3:
            response = _context3.sent;
            _context3.next = 6;
            return response.json();

          case 6:
            data = _context3.sent;

            if (data.success) {
              setCourses(data.courses);
              validationSchema["course_interest"]["is_in"] = data.courses.map(function (course) {
                return course.id;
              });
            }

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })), []);
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
    onChange: function onChange(e) {
      return setEmail(e.target.value);
    },
    error: errorMessage.email
  }), /*#__PURE__*/React.createElement(Input, {
    label: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
      className: "far fa-address-card"
    }), " CNIC:"),
    placeholder: "xxxxx-xxxxxxx-x",
    name: "cnic",
    type: "text",
    value: CNIC,
    onChange: handleCNIC,
    error: errorMessage.cnic
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
    label: "Phone Number:",
    name: "phone",
    type: "text",
    placeholder: "Phone Number",
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
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, "Course Interest:")), /*#__PURE__*/React.createElement("p", null, errorMessage.course_interest), /*#__PURE__*/React.createElement("select", {
    name: "course_interest",
    className: "border-2 border-gray-300 rounded-lg h-12 p-2 w-full bg-white",
    value: courseInterest,
    onChange: function onChange(e) {
      return setCourseInterest(e.target.value);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    selected: true,
    disabled: true
  }, "Pick a course"), courses.length > 0 && courses.map(function (course, index) {
    return /*#__PURE__*/React.createElement("option", {
      key: course.id,
      value: course.id,
      className: "bg-white"
    }, course.title);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 w-full"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: ""
  }, "City:")), /*#__PURE__*/React.createElement("p", null, errorMessage.city), /*#__PURE__*/React.createElement("select", {
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
  }, "Education:")), /*#__PURE__*/React.createElement("p", null, errorMessage.education), /*#__PURE__*/React.createElement("select", {
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
  }, "Employment:")), /*#__PURE__*/React.createElement("p", null, errorMessage.employment), /*#__PURE__*/React.createElement("select", {
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
    onClick: function onClick(email) {
      return checkAlreadyRegistered(email);
    }
  }, "Next!") : /*#__PURE__*/React.createElement("button", {
    className: "p-2 bg-gradient-to-r from-iec-blue to-green-500 text-white rounded-lg hover:scale-105 transition-all duration-300 mt-6 w-1/2 self-center items-center"
  }, "Submit Application!"))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));