const StudentsList = (props) => {
  let students = props.students;

  return (
    <div>
      <h2 className="text-base text-center mb-4">
        <b>{props.title}</b>
      </h2>
      {students.length > 0 ? (
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {props.fields.map((field) => (
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
                <tr key={`${student.id}-tr`}>
                  {props.fields.map((field) => (
                    <td
                      className="border px-4 py-2"
                      key={`${student.id}-${field.name}`}
                    >
                      {student[field.name]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>No students added yet.</p>
      )}
    </div>
  );
};
