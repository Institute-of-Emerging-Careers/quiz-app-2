const StudentsList = (props) => {
  let students = props.students;
  const fields = props.fields;
  const field_to_show_green_if_true = props.hasOwnProperty(
    "field_to_show_green_if_true"
  )
    ? props.field_to_show_green_if_true
    : null;

  return (
    <div className="overflow-auto">
      <h2 className="text-base text-center">
        <b>List of Students already added to this {props.title}</b>
      </h2>
      {field_to_show_green_if_true == null ? (
        <p></p>
      ) : (
        <p className="text-gray-700 mt-4">
          A student row will be <span className="bg-green-300">green</span> if{" "}
          {field_to_show_green_if_true.text} to that student.
        </p>
      )}
      {students.length > 0 ? (
        <table className="w-full text-left text-sm mt-4">
          <thead>
            <tr>
              {fields.map((field) => (
                <th>{field.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students
              .filter((student) => {
                if (student.hasOwnProperty("added") && !student.added)
                  return false;
                else return true;
              })
              .map((student) => (
                <tr
                  key={`${student.id}-tr`}
                  className={
                    field_to_show_green_if_true != null
                      ? student[field_to_show_green_if_true.field]
                        ? "bg-green-300"
                        : ""
                      : ""
                  }
                >
                  {fields.map((field) => (
                    <td
                      className="border px-4 py-2"
                      key={`${student.id}-${field.name[0]}`}
                    >
                      {field.name.reduce((final, cur) => {
                        return `${final} ${student[cur]}`;
                      }, "")}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4">No students added yet.</p>
      )}
    </div>
  );
};
