// eslint-disable-next-line
const StudentsList = (props) => {
	const students = props.students
	const fields = props.fields
	const field_to_show_green_if_true = Object.prototype.hasOwnProperty.call(
		props,
		'field_to_show_green_if_true'
	)
		? props.field_to_show_green_if_true
		: null

	return (
		<div className="overflow-auto">
			<h2 className="text-base text-center mb-4">
				<b>List of Students already added to this {props.title}</b>
			</h2>
			{field_to_show_green_if_true == null ? (
				<p></p>
			) : (
				<p>
					A student row will be <span className="bg-green-300">green</span> if{' '}
					{field_to_show_green_if_true.text} to that student.
				</p>
			)}
			{students.length > 0 ? (
				<table className="w-full text-left text-sm">
					<thead>
						<tr>
							{fields.map((field, index) => (
								<th key={index}>{field.title}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{students
							.filter((student) => {
								if (
									Object.prototype.hasOwnProperty.call(student, 'added') &&
									!student.added
								)
									return false
								else return true
							})
							.map((student) => (
								<tr
									key={`${student.id}-tr`}
									className={
										field_to_show_green_if_true != null
											? student[field_to_show_green_if_true.field]
												? 'bg-green-300'
												: ''
											: ''
									}
								>
									{fields.map((field) => (
										<td
											className="border px-4 py-2"
											key={`${student.id}-${field.name[0]}`}
										>
											{field.name.reduce((final, cur) => {
												return `${final} ${student[cur]}`
											}, '')}
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
	)
}
