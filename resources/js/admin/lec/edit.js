const roundTitle = document.getElementById("lec-round-title-field").value
const roundId = document.getElementById("lec-round-id-field").value
const { useState, useEffect, useRef } = React
const { DateTime, Duration } = luxon;

const save = async (e, setLoading, url, students) => {
    setLoading(true)
    e.preventDefault();
    const response = await fetch(`/admin/lec/save/${roundId}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, students })
        })
    if (!response.ok) alert("Error saving data.")
    setLoading(false)
}

const loadUrl = async (setUrl) => {
    const raw_response = await fetch(`/admin/lec/data/${roundId}`)
    if (!raw_response.ok) {
        alert("Something went wrong while loading LEC agreement url.")
        return
    }
    const url = (await raw_response.json()).url
    setUrl(url)
}

const App = () => {
    const [students, setStudents] = useState([]);
    const [initialDataLoaded, setInitialDataLoaded] = useState(0)
    const [progressSaved, setProgressSaved] = useState(true)
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => loadUrl(setUrl), [])

    useEffect(() => {
        if (initialDataLoaded > 2) setProgressSaved(false)
        setInitialDataLoaded(cur => cur + 1)
    }, [students, url])

    return <div className="flex flex-col gap-y-4">
        <form className="w-full flex flex-col gap-y-4" onSubmit={async (e) => { await save(e, setLoading, url, students); setProgressSaved(true) }}>
            <div className="bg-white p-6 text-center">
                <h1 className="font-bold">{roundTitle}</h1>
                <button type="submit" className="bg-iec-blue hover:bg-iec-blue-hover text-white px-2 py-1 cursor-pointer mx-auto">{loading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fa-save fas"></i>} Save{!progressSaved && "*"}</button>
                {
                    !progressSaved ? <p className="text-orange-700 text-center"><i className='fas fa-info-circle'></i> Progress not saved to server. Click the 'Save' button above or your changes will be lost.</p> : null
                }
            </div>
            <div className="bg-white p-6 flex gap-x-2 justify-center items-center">
                <label htmlFor="agreement_template_link">LEC Agreement Template PDF URL:</label>
                <input type="url" name="agreement_template_link" placeholder="https://drive.google.com/..." className="px-2 py-1 border basis-1/2" value={url} onChange={(e) => setUrl(e.target.value)}></input>
            </div>
        </form>
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