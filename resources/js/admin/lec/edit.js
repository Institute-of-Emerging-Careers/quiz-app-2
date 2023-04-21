const roundTitle = document.getElementById("lec-round-title-field").value
const roundId = document.getElementById("lec-round-id-field").value
const { useState, useEffect, useRef } = React
const { DateTime, Duration } = luxon;

const save = (e) => {
    e.preventDefault();
}

const App = () => {
    const [students, setStudents] = useState([]);
    const [initialDataLoaded, setInitialDataLoaded] = useState(0)
    const [progressSaved, setProgressSaved] = useState(true)

    useEffect(() => {
        if (initialDataLoaded > 1) setProgressSaved(false)
        setInitialDataLoaded(cur => cur + 1)
    }, [students])

    return <div className="flex flex-col gap-y-4">
        <div className="bg-white p-6">
            <h1 className="font-bold">{roundTitle}</h1>
            <form className="flex gap-x-2 justify-center items-center" onSubmit={e => { save(e); setProgressSaved(true) }}>
                <label htmlFor="agreement-template-link">LEC Agreement Template PDF URL:</label>
                <input type="url" name="agreement-template-link" placeholder="https://drive.google.com/..." className="px-2 py-1 border basis-1/2"></input>
                <button type="submit" className="bg-iec-blue hover:bg-iec-blue-hover text-white px-2 py-1 cursor-pointer"><i className="fa-save fas"></i> Save</button>
            </form>
        </div>
        <div className="bg-white p-6">
            <StudentsList
                students={students}
                title="LEC Round"
                field_to_show_green_if_true={{
                    field: "email_sent",
                    text: "LEC Agreement email was sent",
                }}
                fields={[
                    { title: "Name", name: ["name"] },
                    { title: "Email", name: ["email"] },
                    { title: "Percentage Score", name: ["percentage_score"] },
                ]}
                progressSaved={progressSaved}
            />
        </div>
        <div className="bg-white p-6">
            <NewStudentAdder
                all_students_api_endpoint_url={`/admin/lec/all-students/${roundId}`}
                students_object={[students, setStudents]}
                title="LEC Round"
            />
        </div>


    </div>
}
ReactDOM.render(<App />, document.getElementById("app"));