const {
	Quiz,
	Section,
	Question,
	Student,
	Assignment,
	Attempt,
	Score,
	Application,
	Course,
} = require("../db/models")
const getTotalMarksOfSection = require("./getTotalMarksOfSection")
const sequelize = require("../db/connect.js")
const roundToTwoDecimalPlaces = require("./roundToTwoDecimalPlaces.js")
const allSectionsSolved = require("./allSectionsSolved")
const { DateTime, Duration } = require("luxon")
const {
	millisecondsToMinutesAndSeconds,
} = require("./millisecondsToMinutesAndSeconds")
/*
  Final result format:
  [{
      student_id: 0,
      student_name: "Rohan Hussain",
      student_cnic: 35201-3520462-3,
      student_email: "rohanhussain1@yahoo.com",
      sections: [
        {
          status: "Attempted"/"Not Attempted yet",
          section_id: 1,
          section_score: 50,
          percentage_score: 91,
          start_time: ___,
          end_time: ____,
          duration: ______s,
        }
      ],
      completed: false, //this tells if the student has completed all sections of this assessment or not
      total_score: 0,
      maximum_total_score: 0,
      percentage_total: 0,
    }]
  */

const application_fields = [
	"phone",
	"age",
	"age_group",
	"city",
	"province",
	"country",
	"address",
	"father_name",
	"current_address",
	"belongs_to_flood_area",
	"is_tcf_alumni",
	"can_pay_2000",
	"how_to_enroll",
	"has_completed_ba",
	"has_completed_diploma",
	"inst_degree_dip",
	"education_completed",
	"education_completed_major",
	"degree_choice",
	"monthly_family_income",
	"computer_and_internet_access",
	"internet_facility_in_area",
	"time_commitment",
	"is_employed",
	"type_of_employment",
	"salary",
	"will_leave_job",
	"has_applied_before",
	"firstPreferenceId",
	"secondPreferenceId",
	"thirdPreferenceId",
	"preference_reason",
	"is_comp_sci_grad",
	"how_heard_about_iec",
	"will_work_full_time",
	"acknowledge_online",
	"rejection_email_sent",
	"assessment_email_sent",
]

const getQuizResults = (quiz_id) => {
	return new Promise(async (resolve, reject) => {
		try {
			let courses = {}

			const quiz = await Quiz.findOne({
				where: { id: quiz_id },
				include: [
					{
						model: Section,
						order: ["id"],
						include: [
							{
								model: Question,
								attributes: ["id"],
							},
						],
					},
				],
			})

			// column_headings will tell the result page how many sections this quiz had, so that the displayed table has the right header row
			let quiz_sections = []
			let section_id_to_array_index_mapping = {}
			let quiz_total_score = 0
			await new Promise((minor_resolve) => {
				let count = 0
				quiz.Sections.forEach(async (section, index) => {
					// get the maximum achievable (total) score of a section
					const maximum_score = await getTotalMarksOfSection(
						section.id,
						section.poolCount,
						section.Questions.length
					)
					quiz_total_score += maximum_score
					let last_section_index = quiz_sections.push({
						section_id: section.id,
						section_title: section.title,
						maximum_score: maximum_score,
						maximum_time:
							section.time == 0
								? "(Unlimited Time Allowed)"
								: "(out of " + section.time + " minutes)",
					})
					last_section_index--
					section_id_to_array_index_mapping[section.id] = last_section_index
					count++
					if (count == quiz.Sections.length) minor_resolve()
				})
			})

			let data = []
			let assignments = await Assignment.findAll({
				where: { QuizId: quiz_id },
				include: [
					Student,
					Application,
					{
						model: Attempt,
						include: [{ model: Section, order: ["id"] }, Score],
					},
				],
			})

			if (assignments.length > 0) {
				await new Promise((small_resolve) => {
					let i = 0
					const n = assignments.length
					assignments.forEach(async (assignment) => {
						// Note: we also show scores of students who have NOT YET attempted this quiz
						let data_prev_index = data.push({
							student_id: assignment.Student.id,
							student_name:
								assignment.Student.firstName +
								" " +
								assignment.Student.lastName,
							student_cnic: assignment.Student.cnic,
							student_email: assignment.Student.email,
							gender: assignment.Student.gender.toLowerCase(),
							sections: [],
							completed: false, //this tells if the student has completed all sections or not
							started: false, //this tells if the student has started a section or not
							assignedAt: assignment.createdAt,
							total_score: 0,
							maximum_total_score: 0,
							percentage_total: 0,
						})
						data_prev_index--

						if (
							assignment.hasOwnProperty("Application") &&
							assignment.Application != null
						) {
							application_fields.forEach((field) => {
								data[data_prev_index][field] = assignment.Application[field]
							})
							if (
								!courses.hasOwnProperty(
									assignment.Application["firstPreferenceId"]
								)
							)
								courses[assignment.Application["firstPreferenceId"]] = null
							if (
								!courses.hasOwnProperty(
									assignment.Application["secondPreferenceId"]
								)
							)
								courses[assignment.Application["secondPreferenceId"]] = null
							if (
								!courses.hasOwnProperty(
									assignment.Application["thirdPreferenceId"]
								)
							)
								courses[assignment.Application["thirdPreferenceId"]] = null
						}

						// insert empty placeholder section objects according to number of sections
						for (let j = 0; j < quiz_sections.length; j++) {
							data[data_prev_index].sections.push({
								status: "Not Attempted yet",
								section_score: 0,
								percentage_score: 0,
								start_time: 0,
								end_time: 0,
								duration: 0,
							})
						}
						let started = false
						if (assignment.Attempts.length > 0) {
							assignment.Attempts.forEach((attempt) => {
								if (
									quiz_sections[
										section_id_to_array_index_mapping[attempt.SectionId]
									] != undefined
								) {
									started = true
									const percentage_score = roundToTwoDecimalPlaces(
										((attempt.Score == null ? 0 : attempt.Score.score) /
											quiz_sections[
												section_id_to_array_index_mapping[attempt.SectionId]
											].maximum_score) *
											100
									)

									const section_score =
										attempt.Score == null ? 0 : attempt.Score.score

									data[data_prev_index].sections[
										section_id_to_array_index_mapping[attempt.SectionId]
									] = {
										status: "Attempted",
										section_id: attempt.SectionId,
										section_score: section_score,
										percentage_score: percentage_score,
										start_time: attempt.startTime,
										end_time: DateTime.fromMillis(attempt.endTime).toFormat(
											"hh:mm a dd LLL yyyy"
										),
										duration: Duration.fromMillis(attempt.duration).toFormat(
											"mm 'minutes' ss 'seconds'"
										),
									}
									data[data_prev_index].total_score += section_score
								}
							})
							data[data_prev_index].started = started
							data[data_prev_index].percentage_total = roundToTwoDecimalPlaces(
								(data[data_prev_index].total_score / quiz_total_score) * 100
							)

							const all_sections_solved = await allSectionsSolved(
								quiz_id,
								assignment
							)
							if (all_sections_solved) {
								data[data_prev_index].completed = true
							}
						}
						i++
						if (i == n) {
							small_resolve()
						}
					})
				})
			}

			let course_objs = await Promise.all(
				Object.keys(courses).map((course_id) =>
					Course.findOne({ where: { id: course_id } })
				)
			)
			course_objs.forEach((course_obj) => {
				courses[course_obj.id] = course_obj.title
			})

			let final_response = {
				quiz_title: quiz.title,
				quiz_id: quiz_id,
				courses: courses,
				quiz_sections: quiz_sections,
				data: data,
				quiz_total_score: quiz_total_score,
			}

			resolve(final_response)
		} catch (err) {
			reject(err)
			console.log(err)
		}
	})
}

const getQuizResultsWithAnalysis = (quiz_id) => {
	return new Promise(async (resolve) => {
		const quiz = await Quiz.findOne({
			where: { id: quiz_id },
			include: [
				{
					model: Section,
					order: ["id"],
					include: { model: Question, attributes: ["id"] },
				},
			],
		})

		// column_headings will tell the result page how many sections this quiz had, so that the displayed table has the right header row
		let quiz_sections = []
		let quiz_total_score = 0
		await new Promise((resolve) => {
			let count = 0
			quiz.Sections.forEach(async (section, index) => {
				// get the maximum achievable (total) score of a section (if poolCount<num_questions then marks=num_questions)
				const maximum_score = await getTotalMarksOfSection(
					section.id,
					section.poolCount,
					section.Questions.length
				)

				quiz_total_score += maximum_score
				quiz_sections.push({
					section_id: section.id,
					section_title: section.title,
					maximum_score: maximum_score,
					maximum_time:
						section.time == 0
							? "(Unlimited Time Allowed)"
							: "(out of " + section.time + " minutes)",
				})
				count++
				if (count == quiz.Sections.length) resolve()
			})
		})

		let assignments = await Assignment.findAll({
			where: { QuizId: quiz_id },
			include: [
				Student,
				{ model: Attempt, include: [{ model: Section, order: ["id"] }, Score] },
			],
		})

		let data = []
		let analysis = {
			// how many students fall into each range
			percentage_ranges: [
				0, //number of students with percentage between 0% to 10.00%
				0, //number of students with percentage between 10.01% to 20.00%
				0, //number of students with percentage between 20.01% to 30.00%
				0, //number of students with percentage between 30.01% to 40.00%
				0, //number of students with percentage between 40.01% to 50.00%
				0, //number of students with percentage between 50.01% to 60.00%
				0, //number of students with percentage between 60.01% to 70.00%
				0, //number of students with percentage between 70.01% to 80.00%
				0, //number of students with percentage between 80.01% to 90.00%
				0, //number of students with percentage between 90.01% to 100.00%
			],
			num_students_who_completed: 0,
			num_students_who_started_but_did_not_complete: 0,
			total_students: assignments.length,
			gender_male: 0,
			gender_female: 0,
			gender_other: 0,
		}

		await new Promise((resolve) => {
			let i = 0
			const n = assignments.length
			assignments.forEach(async (assignment) => {
				// Note: we also show scores of students who have NOT YET attempted this quiz
				let cur_index = data.push({
					student_id: assignment.Student.id,
					student_name:
						assignment.Student.firstName + " " + assignment.Student.lastName,
					student_cnic: assignment.Student.cnic,
					student_email: assignment.Student.email,
					sections: [],
					completed: assignment.completed, //this tells if the student has completed all sections or not
					started: false, //this tells if the student has started a section or not
					total_score: 0,
					maximum_total_score: 0,
					percentage_total: 0,
				})
				cur_index--

				if (assignment.Student.gender.toLowerCase() == "male")
					analysis.gender_male++
				else if (assignment.Student.gender.toLowerCase() == "female")
					analysis.gender_female++
				else if (assignment.Student.gender.toLowerCase() == "other")
					analysis.gender_other++
				let started = false
				if (assignment.Attempts.length > 0) {
					quiz_sections.forEach((section) => {
						let found = false
						assignment.Attempts.forEach((attempt) => {
							// if we simply start pushing each section attempt to the data array, and if the student has only attempted 1 of 2 sections,
							// then the results page will have to deal with the complex task of checking which section's results we have sent
							// and which we haven't for each student. So we will rather do it here. We will, for each section of the quiz that exists in the quiz,
							// check whether or not the student has attempted it. If yes, we push the scores to the data array, otherwise
							// we push "Not Attempted Yet" to the data array. The resulting array has sections in the same order as the quiz_sections
							// array
							if (section.section_id == attempt.SectionId) {
								started = true
								const section_score =
									attempt.Score == null ? 0 : attempt.Score.score
								const percentage_score = roundToTwoDecimalPlaces(
									(section_score / section.maximum_score) * 100
								)

								data[cur_index].sections.push({
									status: "Attempted",
									section_id: attempt.SectionId,
									section_score: section_score,
									percentage_score: percentage_score,
									start_time: attempt.startTime,
									end_time: attempt.endTime,
									duration: attempt.duration,
								})

								found = true
								data[cur_index].total_score += section_score
							}
						})
						if (!found)
							data[cur_index].sections.push({
								status: "Not Attempted yet",
								section_score: 0,
								percentage_score: 0,
								start_time: 0,
								end_time: 0,
								duration: 0,
							})
						else
							data[cur_index].percentage_total = roundToTwoDecimalPlaces(
								(data[cur_index].total_score / quiz_total_score) * 100
							)
					})

					const all_sections_solved = await allSectionsSolved(
						quiz_id,
						assignment
					)

					data[cur_index].started = started
					const cur_student_percentage = data[cur_index].percentage_total
					if (all_sections_solved) {
						// this student has completed the assessment
						analysis.num_students_who_completed++
						const percentage_range_index =
							(cur_student_percentage - (cur_student_percentage % 10)) / 10
						analysis.percentage_ranges[
							percentage_range_index == 0 ? 0 : percentage_range_index - 1
						]++
						data[cur_index].completed = true
					} else {
						analysis.num_students_who_started_but_did_not_complete++
					}
				}
				i++
				if (i == n) resolve()
			})
		})

		let final_response = {
			quiz_title: quiz.title,
			quiz_id: quiz_id,
			quiz_sections: quiz_sections,
			data: data,
			analysis: analysis,
			quiz_total_score: quiz_total_score,
		}

		resolve(final_response)
	})
}

module.exports = { getQuizResults, getQuizResultsWithAnalysis }
