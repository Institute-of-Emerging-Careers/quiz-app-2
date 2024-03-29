"use strict";

function print_plural(singular, n) {
  if (n > 1 || n == 0) {
    return singular + "s";
  } else {
    return singular;
  }
}

const QuizTile = _ref => {
  let {
    quiz
  } = _ref;
  const [reminderEmailsEnabled, setReminderEmailsEnabled] = React.useState(quiz.sendReminderEmails);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const toggleReminderEmailSetting = React.useCallback(() => {
    const data_to_send = {
      current_reminder_setting: reminderEmailsEnabled,
      quiz_id: quiz.id
    };
    $.post("/quiz/edit-reminder-setting", data_to_send, function (data) {
      if (data.success) {
        setReminderEmailsEnabled(data.new_reminder_setting);
      } else {
        alert("Error changing reminder setting.");
      }
    });
  }, [quiz, reminderEmailsEnabled]);
  return /*#__PURE__*/React.createElement("div", {
    className: "grid w-64 grid-cols-6 gap-4 border bg-white pb-2 quiz-card basis-full grow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-8 col-span-8 h-16 bg-iec-blue justify-center content-center"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/quiz/edit/".concat(quiz.id),
    className: "text-white text-xl col-start-2 col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
    title: "Edit Quiz"
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-edit "
  })), /*#__PURE__*/React.createElement("a", {
    className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
    href: "/quiz/preview/".concat(quiz.id, "/"),
    title: "Preview Quiz"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-eye"
  })), /*#__PURE__*/React.createElement("a", {
    className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
    href: "/quiz/duplicate/".concat(quiz.id),
    title: "Duplicate Quiz"
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-copy"
  })), /*#__PURE__*/React.createElement("a", {
    className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
    title: "Assign to Applicants",
    href: "/quiz/assign/".concat(quiz.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-users"
  })), /*#__PURE__*/React.createElement("a", {
    className: "text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer",
    href: "/quiz/".concat(quiz.id, "/results"),
    title: "View Results"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-poll-h"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-span-1 self-center justify-self-center cursor-pointer relative",
    title: "More Options"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-ellipsis-v text-white text-xl hover:text-gray-100",
    onClick: () => setDropdownOpen(cur => !cur)
  }), dropdownOpen && /*#__PURE__*/React.createElement("div", {
    className: "absolute z-10 w-max border shadow-lg text-sm"
  }, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", {
    className: "py-3 px-6 bg-white hover:bg-gray-100 grid grid-cols-6",
    onClick: () => toggleReminderEmailSetting(quiz.id, quiz.sendReminderEmails, setReminderEmailsEnabled)
  }, reminderEmailsEnabled ? [/*#__PURE__*/React.createElement("i", {
    className: "fas fa-envelope col-start-1 col-span-1 self-center"
  }), /*#__PURE__*/React.createElement("span", {
    className: "col-start-2 col-span-5 self-start w-max"
  }, "Disable Reminder Emails")] : [/*#__PURE__*/React.createElement("i", {
    className: "far fa-envelope col-start-1 col-span-1 self-center"
  }), /*#__PURE__*/React.createElement("span", {
    className: "col-start-2 col-span-5 w-max"
  }, "Enable Reminder Emails")]), /*#__PURE__*/React.createElement("li", {
    className: "py-3 px-6 bg-white hover:bg-gray-100"
  }, /*#__PURE__*/React.createElement("a", {
    className: "grid grid-cols-6",
    href: "/quiz/delete/".concat(quiz.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash col-start-1 col-span-1 self-center"
  }), " ", /*#__PURE__*/React.createElement("span", {
    className: "col-start-2 col-span-5 self-start w-max"
  }, "Delete Quiz"))))))), /*#__PURE__*/React.createElement("h3", {
    className: "col-span-6 font-semibold text-lg px-4"
  }, quiz.title), /*#__PURE__*/React.createElement("div", {
    className: "col-start-1 col-span-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pl-4 pt-0"
  }, quiz.num_sections, print_plural("Section", quiz.num_sections))), /*#__PURE__*/React.createElement("div", {
    className: "col-start-4 col-span-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pr-4 pt-0"
  }, quiz.num_questions, print_plural("Question", quiz.num_questions))));
};

const App = () => {
  const [assessments, setAssessments] = React.useState([]);
  React.useEffect(async () => {
    const raw_response = await fetch("/admin/all-quizzes");

    if (!raw_response.ok) {
      alert("Something went wrong.");
      return;
    }

    const response = await raw_response.json();
    setAssessments(response);
  }, []);
  return assessments.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-4"
  }, assessments.map(quiz => /*#__PURE__*/React.createElement(QuizTile, {
    quiz: quiz,
    key: quiz.id
  }))) : /*#__PURE__*/React.createElement("p", null, "No quizzes to show.");
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));