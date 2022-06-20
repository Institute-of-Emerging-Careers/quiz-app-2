const MyContext = React.createContext();
const useEffect = React.useEffect;
const useState = React.useState;
const useContext = React.useContext;
const quiz_id = document.getElementById("quiz-id-field").value;

const ContextProvider = (props) => {
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [quiz_total_score, setQuizTotalScore] = useState(0);
  // once we get our list of candidates (i.e. all students who complete the assessment), we create an object where keys are student.id and values are true/false depending on whether that student has been added to this orientation or not

  return (
    <MyContext.Provider
      value={{
        students_obj: [students, setStudents],
        sections_obj: [sections, setSections],
        quiz_total_score_obj: [quiz_total_score, setQuizTotalScore],
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

const StudentsList = () => {
  const { students_obj, sections_obj, quiz_total_score_obj } =
    useContext(MyContext);
  const [students, setStudents] = students_obj;
  const [sections, setSections] = sections_obj;
  const [quiz_total_score, setQuizTotalScore] = quiz_total_score_obj;
  const [show_student_personal_details, setShowStudentPersonalDetails] =
    useState(false);
  const [filter, setFilter] = useState("all");
  const [min_score, setMinScore] = useState(0);
  const [filtered_students, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/quiz/${quiz_id}/results-data`)
      .then((raw_data) => {
        if (raw_data.ok) {
          raw_data
            .json()
            .then((obj) => {
              setStudents(obj.data);
              setSections(obj.quiz_sections);
              setQuizTotalScore(obj.quiz_total_score);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              alert("Server returned invalid results. Contact IT Team.");
            });
        } else {
          console.log("Server returned not ok status. Contact IT Team.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong. Contact IT Team.");
      });
  }, []);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  useEffect(() => {
    setFilteredStudents(
      students.filter((student) =>
        student.percentage_total < min_score
          ? false
          : filter == "all"
          ? true
          : filter == "completed-only" && student.completed
          ? true
          : filter == "not-completed-only" && !student.completed
          ? true
          : filter == "started-only" && (student.started || student.completed)
          ? true
          : filter == "started-not-completed-only" &&
            student.started &&
            !student.completed
          ? true
          : filter == "not-started-only" && !student.started
          ? true
          : false
      )
    );
  }, [filter, min_score]);

  function download_table_as_csv(table_id, separator = ",") {
    // Select rows from table_id
    var rows = document.querySelectorAll("table#" + table_id + " tr");
    console.log(rows);
    // Construct csv
    var csv = [];

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].style.display != "none") {
        var row = [],
          cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++) {
          // Clean innertext to remove multiple spaces and jumpline (break csv)
          var data = cols[j].innerText
            .replace(/(\r\n|\n|\r)/gm, "")
            .replace(/(\s\s)/gm, " ");
          // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
          data = data.replace(/"/g, '""');
          // Push escaped string
          row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
      }
    }
    if (csv.length == 1) {
      //the 1 row is the header row
      alert("Sorry! No rows to export. Change the filters.");
    } else {
      var csv_string = csv.join("\n");
      // Download it
      var filename =
        "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
      var link = document.createElement("a");
      link.style.display = "none";
      link.setAttribute("target", "_blank");
      link.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csv_string)
      );
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <div>
      {loading ? (
        <i className="fas fa-spinner animate-spin text-3xl"></i>
      ) : filtered_students.length == 0 ? (
        <p>No students to show.</p>
      ) : (
        <div>
          <div className="mb-2 text-md" id="filters">
            <label>Choose a filter: </label>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
              className="px-3 py-2"
            >
              <option value="all">Show all Students</option>
              <option value="completed-only">
                Show only those who have completed their assessment
              </option>
              <option value="not-completed-only">
                Show only those who have not completed their assessment
              </option>
              <option value="started-only">
                Show only those who have started their assessment
              </option>
              <option value="not-started-only">
                Show only those who have not started their assessment
              </option>
              <option value="started-not-completed-only">
                Show only those who have started but not completed their
                assessment
              </option>
            </select>

            <label className="ml-2">Minimum Percentage Score Filter: </label>
            <input
              type="number"
              value={min_score}
              min="0"
              max="100"
              step="1"
              onChange={(e) => {
                setMinScore(e.target.value);
              }}
              className="bg-gray-100 px-4 py-2"
            ></input>
          </div>
          <div className="mb-2 text-md flex w-full justify-between">
            <div>
              <input
                type="checkbox"
                checked={show_student_personal_details}
                onChange={(e) => {
                  setShowStudentPersonalDetails(e.target.checked);
                }}
              ></input>{" "}
              <label>
                Show Student's Personal Details (gender, email, cnic)
              </label>
            </div>
            <a
              href={`/quiz/${quiz_id}/analysis`}
              className="self-end text-blue-600 mb-2 mr-4"
              target="_blank"
            >
              <i className="fas fa-chart-bar"></i>{" "}
              <span className="underline hover:no-underline">
                View Analysis
              </span>
            </a>
            <a
              href="#"
              onClick={() => {
                setShowStudentPersonalDetails(true);
                setTimeout(() => {
                  download_table_as_csv("results_table");
                }, 500);
              }}
              className="self-end text-blue-600 mb-2 mr-4"
            >
              <i className="fas fa-download"></i>{" "}
              <span className="underline hover:no-underline">
                Download as CSV
              </span>
            </a>
          </div>
          <p>Number of Students in table below: {filtered_students.length}</p>
          <table
            className="w-full text-left mx-auto overflow-auto"
            id="results_table"
          >
            <thead className="bg-iec-blue text-white w-full">
              <tr className="w-full header_row">
                <th className="py-3 px-6">Student Name</th>
                {show_student_personal_details
                  ? [
                      <th className="py-3 px-6">Student Gender</th>,
                      <th className="py-3 px-6">Student Email</th>,
                      <th className="py-3 px-6">Student CNIC</th>,
                    ]
                  : []}
                {sections.map((section) => [
                  <th className="py-3 px-6" key={section.id}>
                    {section.section_title} Student Score
                    <br />
                    (out of {section.maximum_score})
                  </th>,
                  <th className="py-3 px-6">
                    Percentage Marks in {section.section_title}
                  </th>,
                  <th className="py-3 px-6">
                    {section.section_title} Time Taken
                    <br />
                    {section.maximum_time}
                  </th>,
                  <th className="py-3 px-6">
                    {section.section_title} Submission Time (KHI)
                  </th>,
                ])}
                <th className="py-3 px-6">
                  Student Total Score (out of {quiz_total_score})
                </th>
                <th className="py-3 px-6">Percentage Total Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {filtered_students.map((student) => (
                <tr
                  key={student.id}
                  className={student.completed ? "bg-green-100" : ""}
                >
                  <td className="py-3 px-6">{student.student_name}</td>
                  {show_student_personal_details
                    ? [
                        <td className="py-3 px-6">{student.student_gender}</td>,
                        <td className="py-3 px-6">{student.student_email}</td>,
                        <td className="py-3 px-6">{student.student_cnic}</td>,
                      ]
                    : []}

                  {student.sections.map((section) =>
                    section.status == "Attempted"
                      ? [
                          <td className="py-3 px-6">
                            {section.section_score}
                          </td>,
                          <td className="py-3 px-6">
                            {section.percentage_score}
                          </td>,
                          <td className="py-3 px-6">{section.duration}</td>,
                          <td className="py-3 px-6">{section.end_time}</td>,
                        ]
                      : [
                          <td className="py-3 px-6">Not Attempted Yet</td>,
                          <td className="py-3 px-6">0</td>,
                          <td className="py-3 px-6">N/A</td>,
                          <td className="py-3 px-6 endtime">0</td>,
                        ]
                  )}
                  <td className="py-3 px-6">{student.total_score}</td>
                  <td className="py-3 px-6">{student.percentage_total}</td>
                  <td>
                    <a
                      className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline"
                      href={`/reset-assignment/student/${student.student_id}/quiz/${quiz_id}`}
                      target="_blank"
                    >
                      Reset Assignment
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Main = () => {
  return (
    <div className="overflow-auto">
      <StudentsList></StudentsList>
    </div>
  );
};

const App = () => {
  return (
    <ContextProvider>
      <Main />
    </ContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
