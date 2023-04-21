const roundTitle = document.getElementById("lec-round-title-field").value

const save = (e) => {
    e.preventDefault();
}

const App = () => {
    const [students, setStudents] = React.useState([]);

    return <div className="flex flex-col gap-y-4">
        <div className="bg-white p-6">
            <h1 className="font-bold">{roundTitle}</h1>
            <form className="flex gap-x-2 justify-center items-center" onSubmit={save}>
                <label for="agreement-template-link">LEC Agreement Template PDF URL:</label>
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
                    text: "orientation email was sent",
                }}
                fields={[
                    { title: "Name", name: ["name"] },
                    { title: "Email", name: ["email"] },
                    { title: "Percentage Score", name: ["percentage_score"] },
                ]}
            />
        </div>

    </div>
}
ReactDOM.render(<App />, document.getElementById("app"));