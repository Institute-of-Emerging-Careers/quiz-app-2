const StudentsList = (props) => {
  let [students, setStudents] = props.students_object;

  return (
    <div>
      <h2 className="text-base text-center mb-4">
        <b>List of Students invited to this {props.title}</b>
      </h2>
      {students.length > 0 ? (
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter((student) => student.added)
              .map((student) => (
                <tr key={student.id}>
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2">
                    {student.percentage_score}
                  </td>
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
