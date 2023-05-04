function print_plural(singular, n) {
    if (n > 1 || n == 0) { return singular + "s"; }
    else { return singular; }
}

const QuizTile = ({ quiz }) => {
    const [reminderEmailsEnabled, setReminderEmailsEnabled] = React.useState(quiz.sendReminderEmails)
    const [dropdownOpen, setDropdownOpen] = React.useState(false)

    const toggleReminderEmailSetting = React.useCallback(() => {
        const data_to_send = {
            current_reminder_setting: reminderEmailsEnabled,
            quiz_id: quiz.id,
        };

        $.post("/quiz/edit-reminder-setting", data_to_send, function (data) {
            if (data.success) {
                setReminderEmailsEnabled(data.new_reminder_setting)
            } else {
                alert("Error changing reminder setting.");
            }
        });
    }, [quiz, reminderEmailsEnabled])

    return (<div className="grid w-64 grid-cols-6 gap-4 border bg-white pb-2 quiz-card basis-full grow">
        <div className="grid grid-cols-8 col-span-8 h-16 bg-iec-blue justify-center content-center">
            <a href={`/quiz/edit/${quiz.id}`}
                className="text-white text-xl col-start-2 col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer"
                title="Edit Quiz"><i className="far fa-edit "></i></a>
            <a className="text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer"
                href={`/quiz/preview/${quiz.id}/`} title="Preview Quiz"><i className="fa fa-eye"></i></a>
            <a className="text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer"
                href={`/quiz/duplicate/${quiz.id}`} title="Duplicate Quiz"><i className="far fa-copy"></i></a>
            <a className="text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer"
                title="Assign to Applicants" href={`/quiz/assign/${quiz.id}`}><i className="fas fa-users"></i></a>
            <a className="text-white text-xl col-span-1 self-center justify-self-center hover:text-gray-100 cursor-pointer"
                href={`/quiz/${quiz.id}/results`} title="View Results"><i className="fas fa-poll-h"></i></a>
            <div className="col-span-1 self-center justify-self-center cursor-pointer relative" title="More Options">
                <i className="fas fa-ellipsis-v text-white text-xl hover:text-gray-100"
                    onClick={() => setDropdownOpen(cur => !cur)}></i>
                {dropdownOpen && (<div className="absolute z-10 w-max border shadow-lg text-sm">
                    <ul>
                        <li className="py-3 px-6 bg-white hover:bg-gray-100 grid grid-cols-6"
                            onClick={() => toggleReminderEmailSetting(quiz.id, quiz.sendReminderEmails, setReminderEmailsEnabled)}>
                            {reminderEmailsEnabled ?
                                [<i className='fas fa-envelope col-start-1 col-span-1 self-center'></i>, <span className='col-start-2 col-span-5 self-start w-max'>Disable Reminder Emails</span>] :
                                [<i className='far fa-envelope col-start-1 col-span-1 self-center'></i>, <span className='col-start-2 col-span-5 w-max'>Enable Reminder Emails</span>]}
                        </li>
                        <li className="py-3 px-6 bg-white hover:bg-gray-100"><a className="grid grid-cols-6"
                            href={`/quiz/delete/${quiz.id}`}>
                            <i
                                className="fas fa-trash col-start-1 col-span-1 self-center"></i> <span
                                    className='col-start-2 col-span-5 self-start w-max'>Delete Quiz</span></a></li>
                    </ul>
                </div>)}
            </div>
        </div>
        <h3 className="col-span-6 font-semibold text-lg px-4">{quiz.title}</h3>
        <div className="col-start-1 col-span-3">
            <p className="pl-4 pt-0">{quiz.num_sections}
                {print_plural("Section", quiz.num_sections)}</p>
        </div>
        <div className="col-start-4 col-span-3">
            <p className="pr-4 pt-0">{quiz.num_questions}
                {print_plural("Question", quiz.num_questions)}</p>
        </div>
    </div>)
}

const App = () => {
    const [assessments, setAssessments] = React.useState([])

    React.useEffect(async () => {
        const raw_response = await fetch("/admin/all-quizzes")
        if (!raw_response.ok) {
            alert("Something went wrong.")
            return;
        }
        const response = await raw_response.json()
        setAssessments(response)
    }, [])

    return assessments.length > 0 ? <div className="flex flex-wrap gap-4">
        {assessments.map(quiz => <QuizTile quiz={quiz} key={quiz.id} />)}
    </div> : <p>No quizzes to show.</p>
}

ReactDOM.render(<App />, document.getElementById("app"))