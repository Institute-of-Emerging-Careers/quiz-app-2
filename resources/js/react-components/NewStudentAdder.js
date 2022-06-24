const NewStudentAdder = (props) => {
  const [students, setStudents] = props.students_object;
  const [loading, setLoading] = useState(false);
  const [filter_min_score, setFilterMinScore] = useState(0);
  const [orientation_status_filter, setOrientationStatusFilter] =
    useState("all");

  const [filtered_students, setFilteredStudents] = useState([]);

  const student_id_to_array_index_map = useRef({});
  const section2 = useRef(null);

  const addSelectedCandidatesToOrientationList = () => {
    filtered_students
      .filter((student) => student.added)
      .forEach((student) => {
        setStudents((cur_students_array) => {
          let copy = cur_students_array.slice();
          copy[student_id_to_array_index_map.current[student.id]].added = true;
          return copy;
        });
      });
  };

  useEffect(() => {
    setFilteredStudents(students.filter((student) => !student.added));
  }, [students]);

  useEffect(() => {
    setFilteredStudents(
      students.filter(
        (student) =>
          student.percentage_score >= filter_min_score &&
          ((student.added &&
            (orientation_status_filter == "all" ||
              orientation_status_filter == "added")) ||
            (!student.added &&
              (orientation_status_filter == "all" ||
                orientation_status_filter == "not-added")))
      )
    );
  }, [filter_min_score, orientation_status_filter]);

  useEffect(() => {
    setLoading(true);
    fetch(`${props.all_students_api_endpoint_url}`).then((raw_response) => {
      raw_response
        .json()
        .then((response) => {
          if (response.success) {
            for (let i = 0; i < response.data.length; i++) {
              student_id_to_array_index_map.current[response.data[i].id] = i;
            }
            setStudents(response.data);
          } else {
            alert(
              "Something went wrong while getting a list of candidates. Error code 01."
            );
          }
        })
        .catch((err) => {
          alert(
            "Something went wrong while getting a list of candidates. Error code 02."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, []);

  const setAllCheckboxes = (new_val) => {
    setFilteredStudents((cur) => {
      let copy = cur.slice();
      for (let i = 0; i < copy.length; i++) {
        copy[i].added = new_val;
      }
      return copy;
    });
  };

  const selectAll = () => {
    setAllCheckboxes(true);
    section2.current.scrollIntoView();
  };

  const deSelectAll = () => {
    setAllCheckboxes(false);
    section2.current.scrollIntoView();
  };

  return (
    <div>
      <h2 className="text-base text-center mb-2">
        <b>List of Candidates that can be added to this {props.title}</b>
      </h2>

      <button
        onClick={addSelectedCandidatesToOrientationList}
        className="py-2 px-4 bg-iec-blue hover:bg-iec-blue-hover text-white"
      >
        Add Selected Candidates to Orientation List
      </button>
      <div ref={section2}>
        <div className="grid grid-cols-4 items-center">
          <div className="col-span-2">
            <label htmlFor="filter_min_score">Filter by Minimum Score: </label>
            <input
              type="number"
              min="0"
              max="100"
              increment="1"
              value={filter_min_score}
              name="filter_min_score"
              onChange={(e) => {
                setFilterMinScore(e.target.value);
              }}
              className="ml-2 p-2 w-72 border"
            ></input>
            %
          </div>
          <div className="col-span-2">
            <label htmlFor="filter_min_score">
              Filter by Orientation Status:{" "}
            </label>
            <select
              value={orientation_status_filter}
              onChange={(e) => {
                setOrientationStatusFilter(e.target.value);
              }}
              className="px-3 py-2"
            >
              <option value="all">Show all</option>
              <option value="added">Already added to orientation</option>
              <option value="not-added">Not added to orientation</option>
            </select>
          </div>
          <a
            className="col-span-2 cursor-pointer text-iec-blue underline hover:text-iec-blue-hover hover:no-underline"
            onClick={selectAll}
          >
            <i className="fas fa-check-square"></i> Click here to select all
            below
          </a>
          <a
            className="col-span-2 cursor-pointer text-iec-blue underline hover:text-iec-blue-hover hover:no-underline"
            onClick={deSelectAll}
          >
            <i className="far fa-square"></i> Click here to deselect all below
          </a>
        </div>
        <br></br>
        {loading ? (
          <i className="fas fa-spinner animate-spin text-lg"></i>
        ) : (
          <div></div>
        )}
        <table className="w-full text-left px-2">
          <thead>
            <tr className="py-4">
              <th>Selection</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Score (%)</th>
            </tr>
          </thead>
          <tbody>
            {filtered_students.map((student, filtered_student_index) => (
              <tr className="py-2" key={student.id}>
                <td className="border px-4 py-2">
                  <input
                    type="checkbox"
                    id={student.id}
                    checked={student.added}
                    onChange={(e) => {
                      setFilteredStudents((cur) => {
                        let copy = cur.slice();
                        copy[filtered_student_index].added =
                          !copy[filtered_student_index].added;
                        return copy;
                      });
                    }}
                  ></input>
                </td>
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.email}</td>
                <td className="border px-4 py-2">{student.age}</td>
                <td className="border px-4 py-2">{student.gender}</td>
                <td className="border px-4 py-2">{student.percentage_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
