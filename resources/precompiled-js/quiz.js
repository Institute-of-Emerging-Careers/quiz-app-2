"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useState = React.useState;
var useEffect = React.useEffect;
var useContext = React.useContext;
var useRef = React.useRef;
var useMemo = React.useMemo;
var demoDiv = document.getElementById("demo");
var quizIdField = document.getElementById("quizIdField");
var globalQuizId;

if (quizIdField.innerText == "") {
  globalQuizId = null;
} else {
  globalQuizId = parseInt(quizIdField.innerText);
}

var MyContext = React.createContext();

var ContextProvider = function ContextProvider(props) {
  var _useState = useState({
    mcqs: [],
    passages: []
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  return /*#__PURE__*/React.createElement(MyContext.Provider, {
    value: [state, setState]
  }, props.children);
};

var ErrorDisplay = function ErrorDisplay(props) {
  return props.error == "" ? /*#__PURE__*/React.createElement("p", null) : /*#__PURE__*/React.createElement("p", {
    className: props.errorColor + "text-sm leading-8 pb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas " + props.errorIcon + " " + props.errorColor
  }), " ", /*#__PURE__*/React.createElement("span", {
    className: props.errorColor
  }, props.error));
};

var Select = function Select(props) {
  var correct = "";
  props.options.forEach(function (option) {
    if (option.correct == true) {
      correct = option.value;
    }
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, props.label), /*#__PURE__*/React.createElement("select", {
    onChange: props.onChange,
    value: correct,
    className: "border bg-white px-3 py-2 outline-none"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select an Option"), props.options.map(function (option) {
    return /*#__PURE__*/React.createElement("option", {
      value: option.value,
      key: option.value
    }, option.label);
  })));
};

var SelectMultiple = function SelectMultiple(props) {
  var _useContext = useContext(MyContext),
      _useContext2 = _slicedToArray(_useContext, 2),
      state = _useContext2[0],
      setState = _useContext2[1];

  var _useState3 = useState(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]),
      _useState4 = _slicedToArray(_useState3, 2),
      alphabets = _useState4[0],
      setAlphabets = _useState4[1];

  return /*#__PURE__*/React.createElement("ul", {
    className: "ml-2"
  }, props.options.map(function (option, index) {
    return option.optionStatement != null ? /*#__PURE__*/React.createElement("li", {
      key: index
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      value: index,
      name: props.name,
      checked: props.options[index].correct,
      onChange: props.onCheckboxChange
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: props.name
    }, " ", alphabets[index])) : /*#__PURE__*/React.createElement("span", {
      key: index
    });
  }));
};

var Option = function Option(props) {
  var _useContext3 = useContext(MyContext),
      _useContext4 = _slicedToArray(_useContext3, 2),
      state = _useContext4[0],
      setState = _useContext4[1];

  var _useState5 = useState(""),
      _useState6 = _slicedToArray(_useState5, 2),
      optionStatement = _useState6[0],
      setOptionStatement = _useState6[1];

  var _useState7 = useState(""),
      _useState8 = _slicedToArray(_useState7, 2),
      error = _useState8[0],
      setError = _useState8[1];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      uploading = _useState10[0],
      setUploading = _useState10[1];

  var fileUploadForm = useRef();
  var alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  var setOption = function setOption(e) {
    e.preventDefault();
    e.stopPropagation();

    if (state.mcqs[props.sectionIndex].questions[props.questionIndex].options.length <= alphabets.length) {
      setState(function (cur) {
        var obj = _objectSpread({}, cur);

        var copy = obj.mcqs.slice(); // change state so that a question also stores the index of its correct option
        // if this is a new option being set, do this

        if (copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].optionStatement == null) {
          copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex] = {
            optionStatement: optionStatement,
            correct: false,
            optionOrder: props.optionIndex,
            image: null,
            edit: false
          };
          copy[props.sectionIndex].questions[props.questionIndex].options.push({
            optionStatement: null,
            correct: false,
            optionOrder: props.optionIndex + 1,
            image: null,
            edit: true
          });
        } else if (copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].edit == true) {
          // if this is an old option being edited
          copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].optionStatement = optionStatement;
          copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].edit = false;
        }

        obj.mcqs = copy;
        return obj;
      });
    } else {
      setError("Cannot add more options. Alphabets exhausted.");
    }
  };

  function toggleOptionEditStatus() {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].edit = !copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].edit;
      obj.mcqs = copy;
      return obj;
    });
  }

  function fixOptionOrdering(copy) {
    for (var i = 0; i < copy[props.sectionIndex].questions[props.questionIndex].options.length; i++) {
      copy[props.sectionIndex].questions[props.questionIndex].options[i].optionOrder = i;
    }

    return copy;
  }

  function deleteOption() {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options.splice(props.optionIndex, 1);
      copy = fixOptionOrdering(copy);
      obj.mcqs = copy;
      return obj;
    });
  }

  function uploadFile(e) {
    var data = new FormData(ReactDOM.findDOMNode(fileUploadForm.current));
    setUploading(true); // data.append("file", e.target.files[0]);

    fetch("/upload", {
      method: "POST",
      body: data
    }).then(function (response) {
      if (response.status == 200) {
        response.json().then(function (finalResponse) {
          if (finalResponse.status == true) {
            setState(function (cur) {
              var obj = _objectSpread({}, cur);

              var copy = obj.mcqs.slice(); // problem: somehow these indexes are all 0

              copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].image = finalResponse.filename;
              obj.mcqs = copy;
              return obj;
            });
            setUploading(false);
          }
        });
      }
    });
  }

  function deleteOptionImage(e) {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].image = null;
      obj.mcqs = copy;
      return obj;
    });
  }

  var option = props.opt;
  return option.edit == false ? /*#__PURE__*/React.createElement("li", {
    className: "py-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: props.type == "MCQ-S" ? "radio" : "checkbox",
    name: "option",
    value: option.optionStatement,
    className: "self-center"
  }), /*#__PURE__*/React.createElement("label", {
    className: "self-center"
  }, " ", /*#__PURE__*/React.createElement("span", {
    className: "text-gray-600 self-center"
  }, alphabets[props.optionIndex], ":"), " ", option.optionStatement), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4 ml-4 self-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-pen text-gray-300 hover:text-gray-500 cursor-pointer text-md self-center",
    onClick: toggleOptionEditStatus
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash text-gray-300 hover:text-gray-500 cursor-pointer text-md self-center",
    onClick: deleteOption
  }), /*#__PURE__*/React.createElement("form", {
    method: "POST",
    encType: "multipart/form-data",
    action: "/upload",
    ref: fileUploadForm,
    className: "self-center"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "image-upload-" + props.sectionIndex.toString() + props.optionIndex.toString() + props.questionIndex.toString(),
    className: "relative cursor-pointer text-gray-300 hover:text-gray-500 max-h-4 text-xl"
  }, uploading == false ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-image self-center"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin self-center"
  }), /*#__PURE__*/React.createElement("input", {
    id: "image-upload-" + props.sectionIndex.toString() + props.optionIndex.toString() + props.questionIndex.toString(),
    type: "file",
    accept: "image/png, image/jpeg",
    name: "file",
    onChange: uploadFile,
    className: "self-center hidden"
  }))))), state.mcqs[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].image == null ? /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "relative w-max"
  }, /*#__PURE__*/React.createElement("img", {
    src: state.mcqs[props.sectionIndex].questions[props.questionIndex].options[props.optionIndex].image,
    height: "150px",
    className: "mt-2 ml-8 max-h-64 w-auto self-center"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash p-2 absolute top-0 right-0 bg-white text-red-500 shadow-md cursor-pointer",
    onClick: deleteOptionImage
  }))) : /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ErrorDisplay, {
    error: error
  }), /*#__PURE__*/React.createElement("form", {
    onSubmit: setOption,
    className: "mt-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Enter option",
    value: optionStatement,
    onChange: function onChange(e) {
      return setOptionStatement(e.target.value);
    },
    className: "px-4 py-1 border-2 border-r-0 border-gray-100",
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    className: "px-4 py-1 bg-gray-300 border-2 border-l-0 border-gray-100"
  }, "Add New Option")));
};

var ImageOrAudio = function ImageOrAudio(props) {
  var _useContext5 = useContext(MyContext),
      _useContext6 = _slicedToArray(_useContext5, 2),
      state = _useContext6[0],
      setState = _useContext6[1];

  function deleteQuestionImage(e) {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].image = null;
      obj.mcqs = copy;
      return obj;
    });
  }

  if (state.mcqs[props.sectionIndex].questions[props.questionIndex].image.indexOf("img/") !== -1) {
    return /*#__PURE__*/React.createElement("div", {
      className: "relative w-max"
    }, /*#__PURE__*/React.createElement("img", {
      src: state.mcqs[props.sectionIndex].questions[props.questionIndex].image,
      height: "150px",
      className: "mt-6 ml-8 max-h-64 w-auto"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash p-2 absolute top-0 right-0 bg-white text-red-500 shadow-md cursor-pointer",
      onClick: deleteQuestionImage
    }));
  } else if (state.mcqs[props.sectionIndex].questions[props.questionIndex].image.indexOf("audio/") !== -1) {
    return /*#__PURE__*/React.createElement("div", {
      className: "w-max flex items-center"
    }, /*#__PURE__*/React.createElement("audio", {
      controls: true
    }, /*#__PURE__*/React.createElement("source", {
      src: state.mcqs[props.sectionIndex].questions[props.questionIndex].image,
      type: "audio/mpeg"
    }), /*#__PURE__*/React.createElement("span", null, "Your browser does not support the audio element.")), /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash p-2 bg-white text-red-500 cursor-pointer",
      onClick: deleteQuestionImage
    }));
  } else {
    return /*#__PURE__*/React.createElement("div", null);
  }
};

var MCQ = function MCQ(props) {
  var _useContext7 = useContext(MyContext),
      _useContext8 = _slicedToArray(_useContext7, 2),
      state = _useContext8[0],
      setState = _useContext8[1];

  var _useState11 = useState(""),
      _useState12 = _slicedToArray(_useState11, 2),
      correctOption = _useState12[0],
      setCorrectOption = _useState12[1];

  var _useState13 = useState(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]),
      _useState14 = _slicedToArray(_useState13, 2),
      alphabets = _useState14[0],
      setAlphabets = _useState14[1];

  var _useState15 = useState(state.mcqs[props.sectionIndex].questions[props.questionIndex].statement == null ? "" : state.mcqs[props.sectionIndex].questions[props.questionIndex].statement),
      _useState16 = _slicedToArray(_useState15, 2),
      statement = _useState16[0],
      setStatement = _useState16[1];

  var _useState17 = useState(statement == null ? true : false),
      _useState18 = _slicedToArray(_useState17, 2),
      editing_statement = _useState18[0],
      setEditingStatement = _useState18[1];

  var _useState19 = useState(""),
      _useState20 = _slicedToArray(_useState19, 2),
      error = _useState20[0],
      setError = _useState20[1];

  var _useState21 = useState(false),
      _useState22 = _slicedToArray(_useState21, 2),
      uploading = _useState22[0],
      setUploading = _useState22[1];

  var _useState23 = useState(false),
      _useState24 = _slicedToArray(_useState23, 2),
      linkModal = _useState24[0],
      setLinkModal = _useState24[1];

  var _useState25 = useState(state.mcqs[props.sectionIndex].questions[props.questionIndex].link.url == null ? "" : state.mcqs[props.sectionIndex].questions[props.questionIndex].link.url),
      _useState26 = _slicedToArray(_useState25, 2),
      linkUrl = _useState26[0],
      setLinkUrl = _useState26[1];

  var _useState27 = useState(state.mcqs[props.sectionIndex].questions[props.questionIndex].link.text == null ? "" : state.mcqs[props.sectionIndex].questions[props.questionIndex].link.text),
      _useState28 = _slicedToArray(_useState27, 2),
      linkText = _useState28[0],
      setLinkText = _useState28[1];

  var fileUploadForm = useRef();
  useEffect(function () {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].statement = statement;
      obj.mcqs = copy;
      return obj;
    });
  }, [editing_statement]);
  var optionsArray = [];
  state.mcqs[props.sectionIndex].questions[props.questionIndex].options.map(function (option, index) {
    if (option.optionStatement != null) optionsArray.push({
      value: index,
      label: alphabets[index],
      correct: option.correct
    });
  });

  function setCorrectOptionInState(e) {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[e.target.value].correct = true;

      if (copy[props.sectionIndex].questions[props.questionIndex].type == "MCQ-S") {
        // set all other previously true-set options to false
        for (var i = 0; i < copy[props.sectionIndex].questions[props.questionIndex].options.length; i++) {
          if (i != e.target.value) copy[props.sectionIndex].questions[props.questionIndex].options[i].correct = false;
        }
      }

      obj.mcqs = copy;
      return obj;
    });
  }

  function handleCheckboxChange(e) {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].options[e.target.value].correct = !copy[props.sectionIndex].questions[props.questionIndex].options[e.target.value].correct;
      obj.mcqs = copy;
      return obj;
    });
  }

  function moveQuestionDown() {
    if (props.questionIndex < state.mcqs[props.sectionIndex].questions.length - 1) {
      setState(function (cur) {
        var obj = _objectSpread({}, cur);

        var copy = obj.mcqs.slice(); // moving elements in the questions array

        var nextElement = copy[props.sectionIndex].questions[props.questionIndex + 1];
        copy[props.sectionIndex].questions[props.questionIndex + 1] = copy[props.sectionIndex].questions[props.questionIndex];
        copy[props.sectionIndex].questions[props.questionIndex] = nextElement; // fixing their questionOrder attributes

        copy[props.sectionIndex].questions[props.questionIndex].questionOrder = props.questionIndex;
        copy[props.sectionIndex].questions[props.questionIndex + 1].questionOrder = props.questionIndex + 1;
        obj.mcqs = copy;
        return obj;
      });
    }
  }

  function moveQuestionUp() {
    if (props.questionIndex > 0) {
      setState(function (cur) {
        var obj = _objectSpread({}, cur);

        var copy = obj.mcqs.slice(); // moving the question objects{} in the questions array

        var prevElement = copy[props.sectionIndex].questions[props.questionIndex - 1];
        copy[props.sectionIndex].questions[props.questionIndex - 1] = copy[props.sectionIndex].questions[props.questionIndex];
        copy[props.sectionIndex].questions[props.questionIndex] = prevElement; // fixing their questionOrder attributes

        copy[props.sectionIndex].questions[props.questionIndex].questionOrder = props.questionIndex;
        copy[props.sectionIndex].questions[props.questionIndex - 1].questionOrder = props.questionIndex - 1;
        obj.mcqs = copy;
        return obj;
      });
    }
  }

  function fixQuestionOrdering(copy) {
    for (var i = 0; i < copy[props.sectionIndex].questions.length; i++) {
      copy[props.sectionIndex].questions[i].questionOrder = i;
    }

    return copy;
  }

  function uploadFile(e) {
    var data = new FormData(ReactDOM.findDOMNode(fileUploadForm.current));
    setUploading(true);
    fetch("/upload", {
      method: "POST",
      body: data
    }).then(function (response) {
      if (response.status == 200) {
        response.json().then(function (finalResponse) {
          if (finalResponse.status == true) {
            setState(function (cur) {
              var obj = _objectSpread({}, cur);

              var copy = obj.mcqs.slice();
              copy[props.sectionIndex].questions[props.questionIndex].image = finalResponse.filename;
              obj.mcqs = copy;
              return obj;
            });
            setUploading(false);
          }
        });
      }
    });
  }

  function deleteQuestion(e) {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var mcqs_copy = obj.mcqs.slice();
      var passages_copy = obj.passages.slice(); // if this question was associated with a comprehension passage, and was the only question of the passage, then we delete the passage as well:

      var found = false;
      var passageIndex = mcqs_copy[props.sectionIndex].questions[props.questionIndex].passage;
      mcqs_copy[props.sectionIndex].questions.forEach(function (question, questionIndex) {
        // if any question (other than this one that we are about to delete) is found such that it has the same passage, we set found to true and don't delete the passage
        if (question.passage == passageIndex && questionIndex != props.questionIndex) found = true;
      });
      if (!found) passages_copy.splice(passageIndex, 1); // deleting the question and ensure continunity of questionOrder attribute

      mcqs_copy[props.sectionIndex].questions.splice(props.questionIndex, 1);
      mcqs_copy = fixQuestionOrdering(mcqs_copy);
      obj.mcqs = mcqs_copy;
      obj.passages = passages_copy;
      return obj;
    });
  }

  function copyQuestion(e) {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions.splice(props.questionIndex, 0, _objectSpread({}, cur[props.sectionIndex].questions[props.questionIndex]));
      copy = fixQuestionOrdering(copy);
      obj.mcqs = copy;
      return obj;
    });
  }

  function toggleLinkModal(e) {
    setLinkModal(function (cur) {
      return !cur;
    });
  }

  function addLink(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleLinkModal();
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions[props.questionIndex].link.url = linkUrl;
      copy[props.sectionIndex].questions[props.questionIndex].link.text = linkText;
      obj.mcqs = copy;
      return obj;
    });
  }

  return /*#__PURE__*/React.createElement("div", null, linkModal == true ? /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: "absolute z-10 w-1/2 bg-white left-1/4 translate-x-2/4 shadow-xl py-2 px-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times float-right text-gray-800 cursor-pointer",
    onClick: toggleLinkModal
  }), /*#__PURE__*/React.createElement("div", {
    className: "py-6 px-8"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl"
  }, "Add Link"), /*#__PURE__*/React.createElement("form", {
    onSubmit: addLink
  }, /*#__PURE__*/React.createElement("label", null, "URL: "), /*#__PURE__*/React.createElement("input", {
    type: "url",
    name: "url",
    plaeholder: "e.g. https://www.google.com",
    className: "mt-2 px-4 py-2 border-2 border-r-0 border-gray-100",
    value: linkUrl,
    onChange: function onChange(e) {
      setLinkUrl(e.target.value);
    },
    maxLength: "2000"
  }), /*#__PURE__*/React.createElement("label", null, "Text: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "text",
    plaeholder: "e.g. Click Here",
    className: "px-4 py-2 border-2 border-r-0 border-gray-100",
    value: linkText,
    onChange: function onChange(e) {
      setLinkText(e.target.value);
    },
    maxLength: "255"
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    className: "bg-green-500 text-white px-4 py-2",
    value: "Add Link"
  })))) : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    className: "bg-white h-auto w-4/5 mx-auto mt-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-200 w-full text-black px-4 py-0 mr-4 grid grid-cols-4 justify-between items-center"
  }, /*#__PURE__*/React.createElement("p", null, "Question ", props.questionIndex + 1), /*#__PURE__*/React.createElement("div", {
    className: "col-start-2 col-span-3 justify-self-end"
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-copy cursor-pointer text-xl p-2 text-gray-500 hover:bg-green-500 hover:text-gray-700 active:bg-opacity-0 mr-2",
    onClick: copyQuestion
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-up cursor-pointer text-xl p-2 text-gray-500 hover:bg-green-500 hover:text-gray-700 active:bg-opacity-0 mr-2",
    onClick: moveQuestionUp
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-down cursor-pointer text-xl p-2 text-gray-500 hover:bg-green-500 hover:text-gray-700 active:bg-opacity-0",
    onClick: moveQuestionDown
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash-alt cursor-pointer text-xl p-2 text-gray-500 hover:bg-green-500 hover:text-gray-700 active:bg-opacity-0",
    onClick: deleteQuestion
  }))), /*#__PURE__*/React.createElement("div", {
    className: "py-4 px-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ErrorDisplay, {
    error: error
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-10 gap-4"
  }, editing_statement ? /*#__PURE__*/React.createElement("textarea", {
    placeholder: "Enter Question Statement",
    value: statement,
    onChange: function onChange(e) {
      setStatement(e.target.value);
    },
    minLength: "1",
    maxLength: "65535",
    className: "col-span-7 px-4 py-2 border-gray-400 border-2",
    autoFocus: true
  }) : /*#__PURE__*/React.createElement("p", {
    className: "col-span-7 border py-2 px-3"
  }, statement), /*#__PURE__*/React.createElement("div", {
    className: "border-green-500 border-4 cursor-pointer text-3xl col-span-1 h-full grid grid-cols-1 py-6 px-4",
    onClick: function onClick(e) {
      setEditingStatement(function (cur) {
        return !cur;
      });
    },
    style: {
      flexBasis: "10%"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: editing_statement ? "fa-save fas text-green-500 col-span-1 justify-self-center self-center" : "fa-pen fas text-green-500 col-span-1 justify-self-center self-center"
  })), /*#__PURE__*/React.createElement("form", {
    method: "POST",
    encType: "multipart/form-data",
    action: "/upload",
    ref: fileUploadForm,
    className: "col-span-1 relative cursor-pointer",
    style: {
      flexBasis: "10%"
    },
    title: "Upload Image or Audio"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute text-3xl w-full h-full grid grid-cols-1 border-gray-300 border-4 cursor-pointer"
  }, uploading == false ? /*#__PURE__*/React.createElement("i", {
    className: "far fa-file col-span-1 justify-self-center self-center text-gray-300"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner text-gray-300 justify-self-center self-center col-span-1 animate-spin"
  })), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/png, image/jpeg, audio/mpeg",
    name: "file",
    onChange: uploadFile,
    className: "opacity-0 w-full h-full cursor-pointer"
  })), /*#__PURE__*/React.createElement("div", {
    className: "border-gray-300 border-4 cursor-pointer text-3xl col-span-1 h-full grid grid-cols-1 py-6 px-4",
    onClick: toggleLinkModal,
    style: {
      flexBasis: "10%"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-link text-gray-300 col-span-1 justify-self-center self-center"
  })))), state.mcqs[props.sectionIndex].questions[props.questionIndex].link.url == null ? /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }) : /*#__PURE__*/React.createElement("a", {
    href: state.mcqs[props.sectionIndex].questions[props.questionIndex].link.url,
    target: "_blank",
    className: "text-blue-700 underline ml-8 hover:text-blue-500"
  }, state.mcqs[props.sectionIndex].questions[props.questionIndex].link.text == "" ? state.mcqs[props.sectionIndex].questions[props.questionIndex].link.url : state.mcqs[props.sectionIndex].questions[props.questionIndex].link.text), state.mcqs[props.sectionIndex].questions[props.questionIndex].image == null ? /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }) : /*#__PURE__*/React.createElement(ImageOrAudio, {
    sectionIndex: props.sectionIndex,
    questionIndex: props.questionIndex
  }), /*#__PURE__*/React.createElement("ul", {
    className: "mt-4 ml-10"
  }, state.mcqs[props.sectionIndex].questions[props.questionIndex].options.map(function (option, index) {
    return /*#__PURE__*/React.createElement(Option, {
      opt: option,
      questionIndex: props.questionIndex,
      optionIndex: index,
      sectionIndex: props.sectionIndex,
      key: option.id,
      type: props.type
    });
  })), /*#__PURE__*/React.createElement("hr", {
    className: "border-2 mb-4 mt-10"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-5"
  }, props.type == "MCQ-S" ? /*#__PURE__*/React.createElement(Select, {
    options: optionsArray,
    value: correctOption,
    onChange: setCorrectOptionInState,
    label: "Select Correct Option:",
    className: "col-span-1"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "col-span-1"
  }, /*#__PURE__*/React.createElement("p", null, "Select correct options:"), /*#__PURE__*/React.createElement(SelectMultiple, {
    sectionIndex: props.sectionIndex,
    questionIndex: props.questionIndex,
    options: state.mcqs[props.sectionIndex].questions[props.questionIndex].options,
    value: correctOption,
    onCheckboxChange: handleCheckboxChange,
    key: props.questionIndex
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-start-2 col-span-1 justify-self-end"
  }, /*#__PURE__*/React.createElement("label", null, "Marks: "), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.25",
    min: "0",
    value: state.mcqs[props.sectionIndex].questions[props.questionIndex].marks,
    onChange: function onChange(e) {
      setState(function (cur) {
        var obj = _objectSpread({}, cur);

        var copy = obj.mcqs.slice();
        copy[props.sectionIndex].questions[props.questionIndex].marks = e.target.value;
        obj.mcqs = copy;
        return obj;
      });
    },
    className: "px-3 py-2 border-2 border-r-0 border-gray-100"
  }))))));
};

var PassageQuestionSelector = function PassageQuestionSelector(props) {
  var _useContext9 = useContext(MyContext),
      _useContext10 = _slicedToArray(_useContext9, 2),
      state = _useContext10[0],
      setState = _useContext10[1];

  return /*#__PURE__*/React.createElement("ul", {
    className: "ml-2"
  }, state.mcqs[props.sectionIndex].questions.map(function (question, questionIndex) {
    return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      value: questionIndex,
      name: "questionSelector" + props.sectionIndex,
      checked: state.mcqs[props.sectionIndex].questions[questionIndex].passage == props.passageIndex,
      onChange: props.onCheckboxChange
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "questionSelector" + props.sectionIndex
    }, " ", "Q" + (parseInt(questionIndex) + 1)));
  }));
};

var Passage = function Passage(props) {
  var _useContext11 = useContext(MyContext),
      _useContext12 = _slicedToArray(_useContext11, 2),
      state = _useContext12[0],
      setState = _useContext12[1];

  var deletePassage = function deletePassage() {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy[props.sectionIndex].questions.forEach(function (question, index) {
        if (question.passage == props.passageIndex) {
          copy[props.sectionIndex].questions[index].passage = null;
        }
      });
      obj.mcqs = copy;
      return obj;
    });
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.passages.slice();
      copy.splice(props.passageIndex, 1);
      obj.passages = copy;
      return obj;
    });
  };

  function handleCheckboxChange(e) {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var mcqs_copy = obj.mcqs.slice();
      var passages_copy = obj.passages.slice(); // if this question has no passage or has a different passage, then assign the current passage to it

      if (mcqs_copy[props.sectionIndex].questions[e.target.value].passage === null || mcqs_copy[props.sectionIndex].questions[e.target.value].passage != props.passageIndex) mcqs_copy[props.sectionIndex].questions[e.target.value].passage = props.passageIndex; // if this question already had this passage, then assign its passage to null because checkbox has been unchecked
      else mcqs_copy[props.sectionIndex].questions[e.target.value].passage = null; // checking to see if passage has no questions associated with it, in which case it will be deleted

      var found = false;
      mcqs_copy[props.sectionIndex].questions.forEach(function (question) {
        if (question.passage == props.passageIndex) found = true;
      }); // if no such question is found, delete the passage

      if (!found) {
        passages_copy.splice(props.passageIndex, 1);
      } // done


      console.log(passages_copy);
      obj.mcqs = mcqs_copy;
      obj.passages = passages_copy;
      return obj;
    });
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "bg-white h-auto w-4/5 mx-auto mt-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-500 w-full text-white px-4 py-0 mr-4 grid grid-cols-4 justify-between items-center"
  }, /*#__PURE__*/React.createElement("p", null, "Comprehension Passage ", props.passageIndex + 1), /*#__PURE__*/React.createElement("div", {
    className: "col-start-2 col-span-3 justify-self-end"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash-alt cursor-pointer text-xl p-2 text-white hover:bg-white hover:text-gray-500",
    onClick: deletePassage
  }))), /*#__PURE__*/React.createElement("div", {
    className: "py-4 px-8"
  }, /*#__PURE__*/React.createElement("textarea", {
    placeholder: "Enter Comprehension Passage Text",
    value: state.passages[props.passageIndex].statement == null ? "" : state.passages[props.passageIndex].statement,
    onChange: function onChange(e) {
      setState(function (cur) {
        var obj = _objectSpread({}, cur);

        var copy = obj.passages.slice();
        copy[props.passageIndex].statement = e.target.value;
        obj.passages = copy;
        return obj;
      });
    },
    minLength: "1",
    maxLength: "65535",
    className: "w-full px-4 py-2 border-gray-400 border-2",
    autoFocus: true
  }), /*#__PURE__*/React.createElement("hr", {
    className: "border-2 mb-4 mt-10"
  }), /*#__PURE__*/React.createElement("h3", null, "Select all the questions that are about this passage:"), /*#__PURE__*/React.createElement(PassageQuestionSelector, {
    passageIndex: props.passageIndex,
    sectionIndex: props.sectionIndex,
    onCheckboxChange: handleCheckboxChange
  }))));
};

var Section = function Section(props) {
  var _useContext13 = useContext(MyContext),
      _useContext14 = _slicedToArray(_useContext13, 2),
      state = _useContext14[0],
      setState = _useContext14[1];

  var _useState29 = useState(state.mcqs[props.sectionIndex].poolCount == state.mcqs[props.sectionIndex].questions.length ? true : false),
      _useState30 = _slicedToArray(_useState29, 2),
      autoPoolCount = _useState30[0],
      setAutoPoolCount = _useState30[1];

  useEffect(function () {
    if (autoPoolCount && state.mcqs[props.sectionIndex].poolCount != state.mcqs[props.sectionIndex].questions.length) {
      setState(function (cur) {
        var obj = _objectSpread({}, cur);

        var copy = obj.mcqs.slice();
        copy[props.sectionIndex].poolCount = state.mcqs[props.sectionIndex].questions.length;
        obj.mcqs = copy;
        return obj;
      });
    } else if (!autoPoolCount) {
      setState(function (cur) {
        var obj = _objectSpread({}, cur);

        var copy = obj.mcqs.slice();
        copy[props.sectionIndex].questions = copy[props.sectionIndex].questions.map(function (question) {
          question.marks = 1;
          return question;
        });
        obj.mcqs = copy;
        return obj;
      });
    }
  }, [autoPoolCount]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeader, {
    sectionTitle: props.sectionTitle,
    sectionNumber: props.sectionNumber,
    sectionIndex: props.sectionNumber - 1,
    totalSections: props.totalSections,
    key: state.mcqs[props.sectionNumber - 1].id + "a",
    autoPoolCount: autoPoolCount,
    setAutoPoolCount: setAutoPoolCount
  }), /*#__PURE__*/React.createElement("div", null, state.mcqs[props.sectionIndex].questions.map(function (question, index) {
    return question.passage == null ? /*#__PURE__*/React.createElement(MCQ, {
      sectionIndex: props.sectionIndex,
      questionIndex: index,
      type: question.type,
      key: question.id
    }) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Passage, {
      passageIndex: question.passage,
      sectionIndex: props.sectionIndex,
      key: index + (question.passage + 1) * 100
    }), /*#__PURE__*/React.createElement(MCQ, {
      sectionIndex: props.sectionIndex,
      questionIndex: index,
      type: question.type,
      key: question.id
    }));
  })), /*#__PURE__*/React.createElement(SectionHeader, {
    sectionTitle: props.sectionTitle,
    sectionNumber: props.sectionNumber,
    sectionIndex: props.sectionNumber - 1,
    totalSections: props.totalSections,
    key: state.mcqs[props.sectionNumber - 1].id + "b",
    autoPoolCount: autoPoolCount,
    setAutoPoolCount: setAutoPoolCount
  }));
};

var SectionHeader = function SectionHeader(props) {
  var _useContext15 = useContext(MyContext),
      _useContext16 = _slicedToArray(_useContext15, 2),
      state = _useContext16[0],
      setState = _useContext16[1];

  var _useState31 = useState(state.mcqs[props.sectionIndex].time),
      _useState32 = _slicedToArray(_useState31, 2),
      time = _useState32[0],
      setTime = _useState32[1];

  var _useState33 = useState(state.mcqs[props.sectionIndex].time == 0 ? false : true),
      _useState34 = _slicedToArray(_useState33, 2),
      timeOrNot = _useState34[0],
      setTimeOrNot = _useState34[1];

  var toggle = React.useRef();
  var autoPoolCount = props.autoPoolCount;
  var setAutoPoolCount = props.setAutoPoolCount;
  useEffect(function () {
    if (autoPoolCount) {
      if (state.mcqs[props.sectionIndex].poolCount != state.mcqs[props.sectionIndex].questions.length) {
        setState(function (cur) {
          var obj = _objectSpread({}, cur);

          var copy = obj.mcqs.slice();
          copy[props.sectionIndex].poolCount = state.mcqs[props.sectionIndex].questions.length;
          obj.mcqs = copy;
          return obj;
        });
      }
    }
  }, [state.mcqs]);

  var closeDropdown = function closeDropdown() {
    var el = ReactDOM.findDOMNode(toggle.current);
    el.classList.toggle("hidden");
  };

  var addNewMCQ = function addNewMCQ(type) {
    // NOTE: If you make any change to the MCQ State object here, remember to also make it in addNewComprehensionPassage
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      var question_order = copy[props.sectionIndex].questions.push({
        passage: null,
        statement: null,
        questionOrder: null,
        type: type,
        image: null,
        marks: 1,
        link: {
          url: null,
          text: null
        },
        options: [{
          optionStatement: null,
          correct: false
        }],
        correctOptionIndex: null
      });
      copy[props.sectionIndex].questions[copy[props.sectionIndex].questions.length - 1].questionOrder = question_order;
      obj.mcqs = copy;
      return obj;
    });
  };

  var addNewMCQSingle = function addNewMCQSingle() {
    closeDropdown();
    addNewMCQ("MCQ-S");
  };

  var addNewMCQMultiple = function addNewMCQMultiple() {
    closeDropdown();
    addNewMCQ("MCQ-M");
  };

  var addNewComprehensionPassage = function addNewComprehensionPassage() {
    var index_of_newly_created_passage;
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.passages.slice();
      index_of_newly_created_passage = copy.push({
        id: null,
        statement: null,
        place_after_question: state.mcqs[props.sectionIndex].questions.length - 1 //which question to place this passage after. This is used to inform the PassageQuestionSelector which question numbers to show. If the passage was added when the quiz already had 4 questions, then the passage can be assigned to questions 5 onwards.

      });
      index_of_newly_created_passage--;
      console.log("index_of_newly_created_passage2:", index_of_newly_created_passage);
      obj.passages = copy;
      copy = obj.mcqs.slice(); // now creating a new MCQ-S

      var question_index = copy[props.sectionIndex].questions.push({
        passage: index_of_newly_created_passage,
        statement: null,
        questionOrder: null,
        type: "MCQ-S",
        image: null,
        marks: 1,
        link: {
          url: null,
          text: null
        },
        options: [{
          optionStatement: null,
          correct: false
        }],
        correctOptionIndex: null
      });
      question_index--;
      copy[props.sectionIndex].questions[copy[props.sectionIndex].questions.length - 1].questionOrder = question_index;
      obj.mcqs = copy;
      return obj;
    });
  };

  var deleteSection = function deleteSection() {
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy.splice(props.sectionIndex, 1);
      obj.mcqs = copy;
      return obj;
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "toolbox w-4/5 text-base mt-4 mx-auto justify-start gap-x-8 shadow-xl bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-500 text-white px-4 flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-lg"
  }, "Section ", props.sectionNumber, " of ", props.totalSections, ":", " ", props.sectionTitle), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash-alt text-xl p-2 cursor-pointer hover:bg-white hover:text-green-500 hover:gray-100 active:bg-opacity-0",
    onClick: deleteSection
  })), /*#__PURE__*/React.createElement("div", {
    className: "py-4 px-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cursor-pointer relative w-max flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-500 hover:bg-green-600 text-white px-8 py-4",
    id: "add_question",
    onClick: function onClick(e) {
      var el = ReactDOM.findDOMNode(toggle.current);
      el.classList.toggle("hidden");
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Add Question"), /*#__PURE__*/React.createElement("ul", {
    id: "types_of_questions",
    ref: toggle,
    className: "hidden bg-white text-gray-800 absolute w-max top-18 left-0 border-gray-200 border-2"
  }, /*#__PURE__*/React.createElement("li", {
    onClick: addNewMCQSingle,
    className: "py-2 px-4 hover:bg-gray-200"
  }, "MCQ Single Select"), /*#__PURE__*/React.createElement("li", {
    onClick: addNewMCQMultiple,
    className: "py-2 px-4 hover:bg-gray-200"
  }, "MCQ Multiple Select")), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-400 hover:bg-gray-500 text-white px-4 py-4 text-center border-l border-white",
    id: "add_passage",
    onClick: addNewComprehensionPassage
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Add Comprehension Passage")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-x-2 w-full mt-4 mb-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "autoPoolCount",
    checked: autoPoolCount,
    onChange: function onChange(e) {
      setAutoPoolCount(e.target.checked);
    }
  }), /*#__PURE__*/React.createElement("label", {
    className: "self-center"
  }, "Show all questions to student"), !autoPoolCount ? /*#__PURE__*/React.createElement("div", {
    className: ""
  }, /*#__PURE__*/React.createElement("label", {
    className: "px-4 py-3"
  }, "No. of Questions to be Randomly Selected:", " "), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "h-12 w-16 bg-gray-100 text-center",
    min: "0",
    max: state.mcqs[props.sectionIndex].questions.length,
    name: "pool_count",
    value: state.mcqs[props.sectionIndex].poolCount,
    onChange: function onChange(e) {
      setState(function (cur) {
        var obj = _objectSpread({}, cur);

        var copy = obj.mcqs.slice();
        copy[props.sectionIndex].poolCount = e.target.value;
        obj.mcqs = copy;
        return obj;
      });
    }
  })) : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4 ml-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "self-center"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: timeOrNot,
    onChange: function onChange(e) {
      setTimeOrNot(e.target.checked);
    }
  }), /*#__PURE__*/React.createElement("label", null, " Time Limit")), timeOrNot ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "px-4 py-3"
  }, "Time Limit (minutes): "), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "h-12 w-16 bg-gray-100 text-center",
    min: "0",
    name: "time",
    value: time,
    onChange: function onChange(e) {
      setTime(e.target.value);
      setState(function (cur) {
        var obj = _objectSpread({}, cur);

        var copy = obj.mcqs.slice();
        copy[props.sectionIndex].time = e.target.value;
        obj.mcqs = copy;
        return obj;
      });
    }
  })) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  })))));
};

var Main = function Main() {
  var _useContext17 = useContext(MyContext),
      _useContext18 = _slicedToArray(_useContext17, 2),
      state = _useContext18[0],
      setState = _useContext18[1];

  var _useState35 = useState(""),
      _useState36 = _slicedToArray(_useState35, 2),
      sectionInput = _useState36[0],
      setSectionInput = _useState36[1];

  var _useState37 = useState(""),
      _useState38 = _slicedToArray(_useState37, 2),
      quizTitle = _useState38[0],
      setQuizTitle = _useState38[1];

  var _useState39 = useState(globalQuizId),
      _useState40 = _slicedToArray(_useState39, 2),
      quizId = _useState40[0],
      setQuizId = _useState40[1];

  var _useState41 = useState(""),
      _useState42 = _slicedToArray(_useState41, 2),
      error = _useState42[0],
      setError = _useState42[1];

  var _useState43 = useState("text-red-600"),
      _useState44 = _slicedToArray(_useState43, 2),
      errorColor = _useState44[0],
      setErrorColor = _useState44[1];

  var _useState45 = useState("fa-exclamation-triangle"),
      _useState46 = _slicedToArray(_useState45, 2),
      errorIcon = _useState46[0],
      setErrorIcon = _useState46[1];

  var _useState47 = useState(""),
      _useState48 = _slicedToArray(_useState47, 2),
      savedStatus = _useState48[0],
      setSavedStatus = _useState48[1];

  var _useState49 = useState(false),
      _useState50 = _slicedToArray(_useState49, 2),
      uploading = _useState50[0],
      setUploading = _useState50[1];

  var _useState51 = useState(false),
      _useState52 = _slicedToArray(_useState51, 2),
      uploading2 = _useState52[0],
      setUploading2 = _useState52[1];

  var fileUploadForm = useRef(); // If we are editing an already present quiz, get the quiz state from the server

  useEffect( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var _state, title, passages_object, response, finalResponse;

    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(globalQuizId != null)) {
              _context.next = 11;
              break;
            }

            _context.next = 3;
            return fetch("/quiz/state/" + globalQuizId.toString());

          case 3:
            response = _context.sent;
            _context.next = 6;
            return response.json();

          case 6:
            finalResponse = _context.sent;

            if (finalResponse.success == true) {
              _state = finalResponse.stateObject;
              title = finalResponse.quizTitle;
              passages_object = finalResponse.passages_object;
            } else {
              _state = [];
            }

            setState({
              mcqs: _state,
              passages: passages_object
            });
            console.log("state.mcqs: ", _state, "\npassages: ", passages_object);
            setQuizTitle(title);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), []);

  var addSection = function addSection(e) {
    e.preventDefault();
    e.stopPropagation();
    setState(function (cur) {
      var obj = _objectSpread({}, cur);

      var copy = obj.mcqs.slice();
      copy.push({
        sectionTitle: sectionInput,
        sectionOrder: null,
        poolCount: 0,
        time: 0,
        questions: []
      });
      copy[copy.length - 1].sectionOrder = copy.length - 1;
      obj.mcqs = copy;
      return obj;
    });
  };

  function saveDataInDatabase() {
    // data validation before saving
    setUploading2(true);
    setError("");
    console.log("Saving: ", state.mcqs);
    var anyErrors = false;

    if (quizTitle == "") {
      setError("Please enter a quiz title.");
      anyErrors = true;
    } else {
      if (state.mcqs.length == 0) {
        setError("Please add at least one section.");
        anyErrors = true;
      } else {
        state.mcqs.forEach(function (section) {
          if (section.questions.length == 0) {
            setError("Empty sections cannot exist. Every section must have at least one question.");
            anyErrors = true;
          } else if (section.poolCount == 0) {
            setError("You set section " + section.sectionTitle + "'s pool count to 0. Please pick a number greater than 0 otherwise this section will show up empty to the students.");
            anyErrors = true;
          } else {
            section.questions.forEach(function (question) {
              if (question.statement == null || question.statement == "") {
                setError("Please do not leave a question statement empty.");
                anyErrors = true;
              } else if (question.options.length == 1 && question.options[0].optionStatement == null || question.options.length == 2 && question.options[1] == null) {
                setError("Every question must have at least 2 options.");
                anyErrors = true;
              } // add a check for no correct option selected

            });
          }
        });
      }
    }

    if (!anyErrors) {
      fetch("/quiz/save", {
        method: "POST",
        mode: "same-origin",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quizTitle: quizTitle,
          quizId: quizId,
          mcqs: state.mcqs,
          passages: state.passages
        })
      }).then(function (response) {
        console.log(response);
        response.json().then(function (finalResponse) {
          console.log("finalResponse.status: ", finalResponse.status);

          if (finalResponse.status == true) {
            setSavedStatus( /*#__PURE__*/React.createElement("i", {
              className: "fas fa-check-circle text-green-400 text-xl"
            }));
            setErrorColor("text-green-400");
            setErrorIcon("fa-check-circle");
            setQuizId(finalResponse.quizId);
          } else {
            setSavedStatus( /*#__PURE__*/React.createElement("i", {
              className: "fas fa-exclamation-triangle text-red-600"
            }));
            setErrorColor("text-red-600");
            setErrorIcon("fa-exclamation-triangle");
          }

          setError(finalResponse.message);
          setUploading2(false);
          setTimeout(function () {
            setSavedStatus("");
          }, 6000);
        });
      }).catch(function (err) {
        console.log(err);
        setSavedStatus( /*#__PURE__*/React.createElement("i", {
          className: "fas fa-exclamation-triangle text-red-600"
        }));
        setErrorColor("text-red-600");
        setErrorIcon("fa-exclamation-triangle");
      });
    } else {
      setSavedStatus( /*#__PURE__*/React.createElement("i", {
        className: "fas fa-exclamation-triangle text-red-600"
      }));
      setErrorColor("text-red-600");
      setErrorIcon("fa-exclamation-triangle");
      setUploading2(false);
      setTimeout(function () {
        setSavedStatus("");
      }, 10000);
    }
  }

  function downloadCSV(e) {
    fetch("/state-to-csv", {
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([state.mcqs, state.passages])
    }).then(function (response) {
      response.json().then(function (finalResponse) {
        console.log(finalResponse);

        if (finalResponse.status == true) {
          window.location = finalResponse.file_link;
        } else console.log("Error");
      });
    }).catch(function (err) {
      console.log(err);
    });
  }

  function uploadCSV(e) {
    var data = new FormData(ReactDOM.findDOMNode(fileUploadForm.current));
    setUploading(true);
    fetch("/upload/quiz/csv", {
      method: "POST",
      body: data
    }).then(function (response) {
      setUploading(false);

      if (response.status == 200) {
        response.json().then(function (finalResponse) {
          if (finalResponse.status == true) {
            console.log(finalResponse);
            setState(function (cur) {
              var obj = _objectSpread({}, cur);

              obj.mcqs = finalResponse.state;
              obj.passages = finalResponse.passages;
              return obj;
            });
            console.log(finalResponse.state);
          }
        });
      } else if (response.status == 401) {
        setErrorColor("text-red-600");
        setErrorIcon("fa-exclamation-triangle");
        setError("CSV Format is wrong. Please contact IT Team.");
        setTimeout(function () {
          setError("");
        }, 10000);
      } else {
        console.log("error uploading csv file");
      }
    }).catch(function (err) {
      console.log(err);
    });
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "toolbox w-4/5 text-base mt-24 mx-auto p-8 shadow-xl"
  }, /*#__PURE__*/React.createElement(ErrorDisplay, {
    error: error,
    errorColor: errorColor,
    errorIcon: errorIcon
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: addSection,
    className: "flex justify-start"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Section Title",
    name: "sectionTitle",
    value: sectionInput,
    onChange: function onChange(e) {
      return setSectionInput(e.target.value);
    },
    className: "px-4 w-72"
  }), /*#__PURE__*/React.createElement("button", {
    className: "bg-green-400 hover:bg-green-500 text-white px-8 py-4 active:shadow-inner cursor-pointer",
    id: "add_section"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Add New Section")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Quiz Title",
    name: "quizTitle",
    value: quizTitle,
    onChange: function onChange(e) {
      return setQuizTitle(e.target.value);
    },
    className: "ml-8 px-4 py-4 w-72",
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: saveDataInDatabase,
    className: "bg-green-400 hover:bg-green-500 text-white px-8 py-4 active:shadow-inner cursor-pointer"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), " Save Quiz"), /*#__PURE__*/React.createElement("p", null, uploading2 == true ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin self-center"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "hidden"
  }), savedStatus)), /*#__PURE__*/React.createElement("div", {
    className: "flex py-2"
  }, /*#__PURE__*/React.createElement("form", {
    method: "POST",
    encType: "multipart/form-data",
    action: "/upload",
    ref: fileUploadForm
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "csv-upload",
    className: "inline-block px-4 py-4 cursor-pointer bg-gray-400 hover:bg-gray-500 text-white"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-upload"
  }), " Upload from CSV File", " ", /*#__PURE__*/React.createElement("input", {
    id: "csv-upload",
    type: "file",
    accept: ".csv",
    name: "file",
    onChange: uploadCSV,
    className: "hidden"
  }), " ", uploading == true ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner animate-spin self-center"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: downloadCSV,
    className: "inline-block px-4 py-4 cursor-pointer bg-gray-400 hover:bg-gray-500 text-white border-l-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-download"
  }), " Download as CSV File"))), state.mcqs.map(function (section, index) {
    return /*#__PURE__*/React.createElement(Section, {
      sectionTitle: section.sectionTitle,
      sectionNumber: index + 1,
      sectionIndex: index,
      totalSections: state.mcqs.length,
      key: index
    });
  }));
};

var App = function App() {
  return /*#__PURE__*/React.createElement(ContextProvider, null, /*#__PURE__*/React.createElement(Main, null));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), demoDiv);