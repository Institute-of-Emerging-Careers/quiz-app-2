"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (obj) {
            return typeof obj;
          }
        : function (obj) {
            return obj &&
              "function" == typeof Symbol &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? "symbol"
              : typeof obj;
          }),
    _typeof(obj)
  );
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _iterableToArrayLimit(arr, i) {
  var _i =
    arr == null
      ? null
      : (typeof Symbol !== "undefined" && arr[Symbol.iterator]) ||
        arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _regeneratorRuntime() {
  "use strict";
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime =
    function _regeneratorRuntime() {
      return exports;
    };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return (
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0,
      }),
      obj[key]
    );
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return (obj[key] = value);
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator =
        outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return (
      (generator._invoke = (function (innerFn, self, context) {
        var state = "suspendedStart";
        return function (method, arg) {
          if ("executing" === state)
            throw new Error("Generator is already running");
          if ("completed" === state) {
            if ("throw" === method) throw arg;
            return doneResult();
          }
          for (context.method = method, context.arg = arg; ; ) {
            var delegate = context.delegate;
            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);
              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }
            if ("next" === context.method)
              context.sent = context._sent = context.arg;
            else if ("throw" === context.method) {
              if ("suspendedStart" === state)
                throw ((state = "completed"), context.arg);
              context.dispatchException(context.arg);
            } else
              "return" === context.method &&
                context.abrupt("return", context.arg);
            state = "executing";
            var record = tryCatch(innerFn, self, context);
            if ("normal" === record.type) {
              if (
                ((state = context.done ? "completed" : "suspendedYield"),
                record.arg === ContinueSentinel)
              )
                continue;
              return { value: record.arg, done: context.done };
            }
            "throw" === record.type &&
              ((state = "completed"),
              (context.method = "throw"),
              (context.arg = record.arg));
          }
        };
      })(innerFn, self, context)),
      generator
    );
  }
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype &&
    NativeIteratorPrototype !== Op &&
    hasOwn.call(NativeIteratorPrototype, iteratorSymbol) &&
    (IteratorPrototype = NativeIteratorPrototype);
  var Gp =
    (GeneratorFunctionPrototype.prototype =
    Generator.prototype =
      Object.create(IteratorPrototype));
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value &&
          "object" == _typeof(value) &&
          hasOwn.call(value, "__await")
          ? PromiseImpl.resolve(value.__await).then(
              function (value) {
                invoke("next", value, resolve, reject);
              },
              function (err) {
                invoke("throw", err, resolve, reject);
              }
            )
          : PromiseImpl.resolve(value).then(
              function (unwrapped) {
                (result.value = unwrapped), resolve(result);
              },
              function (error) {
                return invoke("throw", error, resolve, reject);
              }
            );
      }
      reject(record.arg);
    }
    var previousPromise;
    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }
      return (previousPromise = previousPromise
        ? previousPromise.then(
            callInvokeWithMethodAndArg,
            callInvokeWithMethodAndArg
          )
        : callInvokeWithMethodAndArg());
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (undefined === method) {
      if (((context.delegate = null), "throw" === context.method)) {
        if (
          delegate.iterator.return &&
          ((context.method = "return"),
          (context.arg = undefined),
          maybeInvokeDelegate(delegate, context),
          "throw" === context.method)
        )
          return ContinueSentinel;
        (context.method = "throw"),
          (context.arg = new TypeError(
            "The iterator does not provide a 'throw' method"
          ));
      }
      return ContinueSentinel;
    }
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type)
      return (
        (context.method = "throw"),
        (context.arg = record.arg),
        (context.delegate = null),
        ContinueSentinel
      );
    var info = record.arg;
    return info
      ? info.done
        ? ((context[delegate.resultName] = info.value),
          (context.next = delegate.nextLoc),
          "return" !== context.method &&
            ((context.method = "next"), (context.arg = undefined)),
          (context.delegate = null),
          ContinueSentinel)
        : info
      : ((context.method = "throw"),
        (context.arg = new TypeError("iterator result is not an object")),
        (context.delegate = null),
        ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };
    1 in locs && (entry.catchLoc = locs[1]),
      2 in locs && ((entry.finallyLoc = locs[2]), (entry.afterLoc = locs[3])),
      this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    (record.type = "normal"), delete record.arg, (entry.completion = record);
  }
  function Context(tryLocsList) {
    (this.tryEntries = [{ tryLoc: "root" }]),
      tryLocsList.forEach(pushTryEntry, this),
      this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length; ) {
              if (hasOwn.call(iterable, i))
                return (next.value = iterable[i]), (next.done = !1), next;
            }
            return (next.value = undefined), (next.done = !0), next;
          };
        return (next.next = next);
      }
    }
    return { next: doneResult };
  }
  function doneResult() {
    return { value: undefined, done: !0 };
  }
  return (
    (GeneratorFunction.prototype = GeneratorFunctionPrototype),
    define(Gp, "constructor", GeneratorFunctionPrototype),
    define(GeneratorFunctionPrototype, "constructor", GeneratorFunction),
    (GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    )),
    (exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return (
        !!ctor &&
        (ctor === GeneratorFunction ||
          "GeneratorFunction" === (ctor.displayName || ctor.name))
      );
    }),
    (exports.mark = function (genFun) {
      return (
        Object.setPrototypeOf
          ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype)
          : ((genFun.__proto__ = GeneratorFunctionPrototype),
            define(genFun, toStringTagSymbol, "GeneratorFunction")),
        (genFun.prototype = Object.create(Gp)),
        genFun
      );
    }),
    (exports.awrap = function (arg) {
      return { __await: arg };
    }),
    defineIteratorMethods(AsyncIterator.prototype),
    define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }),
    (exports.AsyncIterator = AsyncIterator),
    (exports.async = function (
      innerFn,
      outerFn,
      self,
      tryLocsList,
      PromiseImpl
    ) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );
      return exports.isGeneratorFunction(outerFn)
        ? iter
        : iter.next().then(function (result) {
            return result.done ? result.value : iter.next();
          });
    }),
    defineIteratorMethods(Gp),
    define(Gp, toStringTagSymbol, "Generator"),
    define(Gp, iteratorSymbol, function () {
      return this;
    }),
    define(Gp, "toString", function () {
      return "[object Generator]";
    }),
    (exports.keys = function (object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      return (
        keys.reverse(),
        function next() {
          for (; keys.length; ) {
            var key = keys.pop();
            if (key in object)
              return (next.value = key), (next.done = !1), next;
          }
          return (next.done = !0), next;
        }
      );
    }),
    (exports.values = values),
    (Context.prototype = {
      constructor: Context,
      reset: function reset(skipTempReset) {
        if (
          ((this.prev = 0),
          (this.next = 0),
          (this.sent = this._sent = undefined),
          (this.done = !1),
          (this.delegate = null),
          (this.method = "next"),
          (this.arg = undefined),
          this.tryEntries.forEach(resetTryEntry),
          !skipTempReset)
        )
          for (var name in this) {
            "t" === name.charAt(0) &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1)) &&
              (this[name] = undefined);
          }
      },
      stop: function stop() {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function dispatchException(exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          return (
            (record.type = "throw"),
            (record.arg = exception),
            (context.next = loc),
            caught && ((context.method = "next"), (context.arg = undefined)),
            !!caught
          );
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally)
                throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (
            entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc
          ) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry &&
          ("break" === type || "continue" === type) &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc &&
          (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return (
          (record.type = type),
          (record.arg = arg),
          finallyEntry
            ? ((this.method = "next"),
              (this.next = finallyEntry.finallyLoc),
              ContinueSentinel)
            : this.complete(record)
        );
      },
      complete: function complete(record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return (
          "break" === record.type || "continue" === record.type
            ? (this.next = record.arg)
            : "return" === record.type
            ? ((this.rval = this.arg = record.arg),
              (this.method = "return"),
              (this.next = "end"))
            : "normal" === record.type && afterLoc && (this.next = afterLoc),
          ContinueSentinel
        );
      },
      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc)
            return (
              this.complete(entry.completion, entry.afterLoc),
              resetTryEntry(entry),
              ContinueSentinel
            );
        }
      },
      catch: function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        return (
          (this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc,
          }),
          "next" === this.method && (this.arg = undefined),
          ContinueSentinel
        );
      },
    }),
    exports
  );
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError(
    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (
    (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null) ||
    iter["@@iterator"] != null
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

var deleteQuestion = function deleteQuestion(setQuestions, index) {
  return setQuestions(function (cur) {
    var copy = _toConsumableArray(cur);

    copy.splice(index, 1);
    return copy;
  });
};

var QUESTION_TYPE = {
  NUMERIC: "number scale",
  TEXTUAL: "descriptive",
};
var EMPTY_NUMERIC_QUESTION = {
  question: null,
  questionType: QUESTION_TYPE.NUMERIC,
  questionScale: 0,
};
var EMPTY_TEXTUAL_QUESTION = {
  question: null,
  questionType: QUESTION_TYPE.TEXTUAL,
  questionScale: null,
};

var saveQuestions = /*#__PURE__*/ (function () {
  var _ref = _asyncToGenerator(
    /*#__PURE__*/ _regeneratorRuntime().mark(function _callee(
      numericQuestions,
      textualQuestions,
      setShowModal
    ) {
      var response;
      return _regeneratorRuntime().wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return fetch(
                  "/admin/interview/".concat(
                    interview_round_id,
                    "/save-questions"
                  ),
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      questions: []
                        .concat(
                          _toConsumableArray(numericQuestions),
                          _toConsumableArray(textualQuestions)
                        )
                        .filter(function (_ref2) {
                          var question = _ref2.question;
                          return !!question;
                        }),
                    }),
                  }
                );

              case 3:
                response = _context.sent;
                if (response.ok) setShowModal(true);
                else alert("Error occured. Contact IT.");
                _context.next = 11;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                alert("Something went wrong. Contact IT.");

              case 11:
              case "end":
                return _context.stop();
            }
          }
        },
        _callee,
        null,
        [[0, 7]]
      );
    })
  );

  return function saveQuestions(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

var Question = function Question(_ref3) {
  var _questions$index$ques,
    _questions$index,
    _questions$index2,
    _questions$index$ques2,
    _questions$index3;

  var questions = _ref3.questions,
<<<<<<< HEAD
      setQuestions = _ref3.setQuestions,
      question = _ref3.question,
      index = _ref3.index;
=======
    setQuestions = _ref3.setQuestions,
    index = _ref3.index;
>>>>>>> d9a21c5 (upgraded to tailwind v3)

  var onChange = function onChange(property) {
    return function (e) {
      setQuestions(function (cur) {
        var copy = JSON.parse(JSON.stringify(cur));
        copy[index][property] = e.target.value;
        return copy;
      });
    };
  };

  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "flex gap-x-6 w-full items-center text-xl text-gray-900",
    },
    /*#__PURE__*/ React.createElement(
      "span",
      {
        className: "justify-self-center",
      },
      index + 1
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "relative grow",
      },
      /*#__PURE__*/ React.createElement("input", {
        className:
          "w-full p-2 pr-10 bg-transparent h-min my-0 border-b-2 border-solid border-gray-400",
        rows: "1",
        placeholder: "Enter text here",
        value:
          (_questions$index$ques =
            (_questions$index = questions[index]) === null ||
            _questions$index === void 0
              ? void 0
              : _questions$index.question) !== null &&
          _questions$index$ques !== void 0
            ? _questions$index$ques
            : "",
        onChange: onChange("question"),
      }),
      /*#__PURE__*/ React.createElement("i", {
        class:
          "fa-trash-can absolute right-4 top-3 fa-regular text-lg cursor-pointer",
        onClick: function onClick() {
          return deleteQuestion(setQuestions, index);
        },
      })
    ),
    ((_questions$index2 = questions[index]) === null ||
    _questions$index2 === void 0
      ? void 0
      : _questions$index2.questionScale) !== null &&
      /*#__PURE__*/ React.createElement("input", {
        type: "number",
        value:
          (_questions$index$ques2 =
            (_questions$index3 = questions[index]) === null ||
            _questions$index3 === void 0
              ? void 0
              : _questions$index3.questionScale) !== null &&
          _questions$index$ques2 !== void 0
            ? _questions$index$ques2
            : "0",
        onChange: onChange("questionScale"),
        className:
          "text-center p-2 bg-transparent justify-self-center border-b-2 border-solid border-gray-700",
        style: {
          width: "80px",
        },
      })
  );
};

var Step4 = function Step4() {
  //need to take number of questions as input
  //need to take question type as input (descriptive or number scale)
  //need to take question as input
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    show_modal = _useState2[0],
    setShowModal = _useState2[1];

  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    numericQuestions = _useState4[0],
    setNumericQuestions = _useState4[1];

  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    textualQuestions = _useState6[0],
    setTextualQuestions = _useState6[1]; //first we need to check if questions have already been set for this interview round
  //if yes, then we need to display them

  useEffect(
    /*#__PURE__*/ _asyncToGenerator(
      /*#__PURE__*/ _regeneratorRuntime().mark(function _callee2() {
        var response, numericQuestionsInResponse, textualQuestionsInResponse;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                _context2.next = 2;
                return fetch(
                  "/admin/interview/".concat(
                    interview_round_id,
                    "/all-questions"
                  ),
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

              case 2:
                response = _context2.sent;

                if (!(response.status == 200)) {
                  _context2.next = 13;
                  break;
                }

                _context2.next = 6;
                return response.json();

              case 6:
                response = _context2.sent;
                numericQuestionsInResponse = response.questions.filter(
                  function (_ref5) {
                    var questionType = _ref5.questionType;
                    return questionType === QUESTION_TYPE.NUMERIC;
                  }
                );
                textualQuestionsInResponse = response.questions.filter(
                  function (_ref6) {
                    var questionType = _ref6.questionType;
                    return questionType === QUESTION_TYPE.TEXTUAL;
                  }
                );
                setNumericQuestions(
                  numericQuestionsInResponse.length === 0
                    ? [EMPTY_NUMERIC_QUESTION]
                    : numericQuestionsInResponse
                );
                setTextualQuestions(
                  textualQuestionsInResponse.length === 0
                    ? [EMPTY_TEXTUAL_QUESTION]
                    : textualQuestionsInResponse
                );
                _context2.next = 14;
                break;

              case 13:
                alert("Could not load questions from server. Contact IT.");

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      })
    ),
    []
  );
  var addNumericQuestion = useCallback(
    function () {
      if (numericQuestions[numericQuestions.length - 1].question === "") return;
      setNumericQuestions(function (cur) {
        return [].concat(_toConsumableArray(cur), [EMPTY_NUMERIC_QUESTION]);
      });
    },
    [numericQuestions]
  );
  var addTextualQuestion = useCallback(
    function () {
      if (textualQuestions[textualQuestions.length - 1].question === "") return;
      setTextualQuestions(function (cur) {
        return [].concat(_toConsumableArray(cur), [EMPTY_TEXTUAL_QUESTION]);
      });
    },
    [textualQuestions]
  );
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: " mt-20 px-8 font-normal",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "mt-8",
      },
      /*#__PURE__*/ React.createElement(
        "button",
        {
          className:
            "bg-iec-blue hover:bg-iec-blue-hover text-white px-6 py-2 float-right",
          onClick: function onClick() {
            return saveQuestions(
              numericQuestions,
              textualQuestions,
              setShowModal
            );
          },
        },
        /*#__PURE__*/ React.createElement("i", {
          className: "fa-regular fa-floppy-disk",
        }),
        " Save"
      ),
      /*#__PURE__*/ React.createElement("br", null),
      /*#__PURE__*/ React.createElement(
        "section",
        {
          id: "numeric",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "w-full",
          },
          /*#__PURE__*/ React.createElement(
            "h2",
            {
              className:
                "w-max font-semibold text-2xl border-solid border-l-2 border-b-2 border-iec-blue px-2 mb-4",
            },
            "Numeric Questions"
          )
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className: "block float-right mr-6",
          },
          "Marks"
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "w-full flex flex-col gap-y-2",
          },
          numericQuestions.map(function (question, index) {
            return /*#__PURE__*/ React.createElement(Question, {
              questions: numericQuestions,
              setQuestions: setNumericQuestions,
              index: index,
              key: "numeric".concat(index),
            });
          })
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "flex justify-between mt-6",
          },
          /*#__PURE__*/ React.createElement(
            "button",
            {
              className:
                "bg-iec-blue hover:bg-iec-blue-hover text-white py-2 px-10",
              onClick: addNumericQuestion,
            },
            /*#__PURE__*/ React.createElement("i", {
              className: "fa-solid fa-plus",
            }),
            " Add Question"
          ),
          /*#__PURE__*/ React.createElement(
            "p",
            null,
            "Total Marks:",
            " ",
            numericQuestions.reduce(function (prev, cur) {
              return (prev += parseInt(cur.questionScale));
            }, 0)
          )
        )
      ),
      /*#__PURE__*/ React.createElement(
        "section",
        {
          id: "textual",
          className: "mt-12",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "w-full",
          },
          /*#__PURE__*/ React.createElement(
            "h2",
            {
              className:
                "w-max font-semibold text-2xl border-solid border-l-2 border-b-2 border-iec-blue px-2 mb-4",
            },
            "Textual Questions"
          )
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "w-full flex flex-col gap-y-2",
          },
          textualQuestions.map(function (question, index) {
            return /*#__PURE__*/ React.createElement(Question, {
              questions: textualQuestions,
              setQuestions: setTextualQuestions,
              index: index,
              key: "textual".concat(index),
            });
<<<<<<< HEAD
            setNumericQuestions(numericQuestionsInResponse.length === 0 ? [EMPTY_NUMERIC_QUESTION] : numericQuestionsInResponse);
            setTextualQuestions(textualQuestionsInResponse.length === 0 ? [EMPTY_TEXTUAL_QUESTION] : textualQuestionsInResponse);
            _context2.next = 14;
            break;

          case 13:
            alert("Could not load questions from server. Contact IT.");

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })), []);
  var addNumericQuestion = useCallback(function () {
    if (numericQuestions[numericQuestions.length - 1].question === "") return;
    setNumericQuestions(function (cur) {
      return [].concat(_toConsumableArray(cur), [EMPTY_NUMERIC_QUESTION]);
    });
  }, [numericQuestions]);
  var addTextualQuestion = useCallback(function () {
    if (textualQuestions[textualQuestions.length - 1].question === "") return;
    setTextualQuestions(function (cur) {
      return [].concat(_toConsumableArray(cur), [EMPTY_TEXTUAL_QUESTION]);
    });
  }, [textualQuestions]);
  return /*#__PURE__*/React.createElement("div", {
    className: " mt-20 px-8 font-normal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-8"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue hover:bg-iec-blue-hover text-white px-6 py-2 float-right",
    onClick: function onClick() {
      return saveQuestions(numericQuestions, textualQuestions, setShowModal);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-floppy-disk"
  }), " Save"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("section", {
    id: "numeric"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "w-max font-semibold text-2xl border-solid border-l-2 border-b-2 border-iec-blue px-2 mb-4"
  }, "Numeric Questions")), /*#__PURE__*/React.createElement("p", {
    className: "block float-right mr-6"
  }, "Marks"), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex flex-col gap-y-2"
  }, numericQuestions.map(function (question, index) {
    return /*#__PURE__*/React.createElement(Question, {
      questions: numericQuestions,
      setQuestions: setNumericQuestions,
      question: question,
      index: index,
      key: "numeric".concat(index)
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mt-6"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue hover:bg-iec-blue-hover text-white py-2 px-10",
    onClick: addNumericQuestion
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " Add Question"), /*#__PURE__*/React.createElement("p", null, "Total Marks:", " ", numericQuestions.reduce(function (prev, cur) {
    return prev += parseInt(cur.questionScale);
  }, 0)))), /*#__PURE__*/React.createElement("section", {
    id: "textual",
    className: "mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "w-max font-semibold text-2xl border-solid border-l-2 border-b-2 border-iec-blue px-2 mb-4"
  }, "Textual Questions")), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex flex-col gap-y-2"
  }, textualQuestions.map(function (question, index) {
    return /*#__PURE__*/React.createElement(Question, {
      questions: textualQuestions,
      setQuestions: setTextualQuestions,
      question: question,
      index: index,
      key: "textual".concat(index)
    });
  })), /*#__PURE__*/React.createElement("button", {
    className: "bg-iec-blue hover:bg-iec-blue-hover text-white py-2 px-10 mt-6",
    onClick: addTextualQuestion
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " Add Question"))), /*#__PURE__*/React.createElement(Modal, {
    show_modal: show_modal,
    setShowModal: setShowModal,
    heading: "Success",
    content: "Question has been saved"
  }));
};
=======
          })
        ),
        /*#__PURE__*/ React.createElement(
          "button",
          {
            className:
              "bg-iec-blue hover:bg-iec-blue-hover text-white py-2 px-10 mt-6",
            onClick: addTextualQuestion,
          },
          /*#__PURE__*/ React.createElement("i", {
            className: "fa-solid fa-plus",
          }),
          " Add Question"
        )
      )
    ),
    /*#__PURE__*/ React.createElement(Modal, {
      show_modal: show_modal,
      setShowModal: setShowModal,
      heading: "Success",
      content: "Question has been saved",
    })
  );
};
>>>>>>> d9a21c5 (upgraded to tailwind v3)
