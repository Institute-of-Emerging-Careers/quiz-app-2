const ApplicationsList = (props) => {
  const { applications_object, modal_object } = useContext(MyContext);
  const [applications, setApplications] = applications_object;
  const [show_modal, setShowModal] = modal_object;
  return (
    <div>
      <h2 className="text-base text-center mb-4">
        <b>List of Applications in this Round</b>
      </h2>
      {applications.length > 0 ? (
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone</th>
              <th>CNIC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application, index) => (
              <tr key={application.id}>
                <td className="border px-4 py-2">{`${application.Student.firstName} ${application.Student.lastName}`}</td>
                <td className="border px-4 py-2">
                  {application.Student.gender}
                </td>
                <td className="border px-4 py-2">
                  {application.Student.email}
                </td>
                <td className="border px-4 py-2">{application.phone}</td>
                <td className="border px-4 py-2">{application.Student.cnic}</td>
                <td className="border px-4 py-2">
                  <a
                    className="text-iec-blue hover:text-iec-blue-hover underline hover:no-underline cursor-pointer"
                    data-index={index}
                    onClick={(e) => {
                      setShowModal(e.target.dataset.index);
                    }}
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students to show.</p>
      )}
    </div>
  );
};
