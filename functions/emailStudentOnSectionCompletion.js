const { queueMail } = require('../bull')
const { Section } = require('../db/models')
const allSectionsSolved = require('./allSectionsSolved')

const emailStudentOnSectionCompletion = async (
	section_id,
	email,
	quiz_id,
	assignment
) => {
	const all_sections_solved = await allSectionsSolved(quiz_id, assignment)

	console.log('all_sections_solved', all_sections_solved)
	if (all_sections_solved) {
		await assignment.update({ completed: true })
	}

	const section_title = (await Section.findOne({ where: { id: section_id } }))
		.title
	console.log('Sending scoring mail')
	if (all_sections_solved) {
		return queueMail(email, 'Assessment Completed', {
			heading: 'All Sections Completed',
			inner_text: `Dear Student
                    <br><br>
                    This email confirms that you have successfully solved the IEC Assessment. You'll now have to wait to hear back from us after the shortlisting process.
                    <br><br>
                    Thank you for showing your interest in becoming part of the program. 
                    <br><br>
                    Sincerely, 
                    IEC Admissions Team`,
			button_announcer: 'Visit out website to learn more about us',
			button_text: 'Visit',
			button_link: 'https://iec.org.pk',
		})
	} else {
		return queueMail(email, 'Section Solved', {
			heading: `Section "${section_title}" Solved`,
			inner_text: `Dear Student
                    <br><br>
                    This email confirms that you have successfully solved Section "${section_title}" of the IEC Assessment. Please solve the remaining sections as well.
                    <br><br>
                    Thank you for showing your interest in becoming part of the program. 
                    <br><br>
                    Sincerely, 
                    IEC Admissions Team`,
			button_announcer: 'Solve the remaining sections on the portal:',
			button_text: 'Student Portal',
			button_link: 'https://apply.iec.org.pk/student/login',
		})
	}
}

module.exports = emailStudentOnSectionCompletion
