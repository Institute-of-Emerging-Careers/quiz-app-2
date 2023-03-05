// Input data format
/*
[
  [ 'Section', 'PoolCount', 'Statement', 'Type', 'A', 'B', 'C', 'D', 'E', 'Correct', 'Image URL', 'A Image', 'B Image', 'C Image', 'D Image', 'E Image', 'Marks' ],
  [
    'My Section',
    '1',
    'This is a statement',
    'MCQ-S',
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'null',
    'A',
    'null',
    'null',
    'null',
    'null',
    'null',
    'null',
    '1.75'
  ],
  [
    'Your Section',
    '1',
    'This is another statement',
    'MCQ-M',
    'Option 5',
    'Option 6',
    'Option 7',
    'null',
    'null',
    'B',
    'https://link.com/to/image.jpg'
    'https://link.com/to/image.jpg'
    'https://link.com/to/image.jpg'
    'https://link.com/to/image.jpg'
    'https://link.com/to/image.jpg'
    'https://link.com/to/image.jpg',
    '0'
  ]
]
*/

/* Output json format
  [
    {
        sectionTitle: sectionInput,
        sectionOrder:0,
        poolCount: 0,
        questions: [
            {
                statement: null,
                questionOrder: 0,
                image: null,
                type: type,
                marks:1,
                options: [
                    { optionStatement: "option 1", image: null, optionOrder: 0, correct: true, edit:false},
                    { optionStatement: null, image: null, optionOrder: 1, correct: false, edit: false }
                ],
            }
        ],
    }
]
  */

function commasToArray(string) {
	return string.split(',')
}

const csvToState = (data) => {
	const column_index_of_section_name = 0
	const column_index_of_pool_count = 1
	const column_index_of_passage = 2
	const column_index_of_question_statement = 3
	const column_index_of_question_type = 4
	const starting_column_index_of_options = 5
	const column_index_of_correct_option = 10
	const column_index_of_link_url = 11
	const column_index_of_question_image = 13
	const starting_column_index_of_option_images = 14
	const difference_between_starting_of_options_and_starting_of_option_images =
		starting_column_index_of_option_images - starting_column_index_of_options
	const column_index_of_question_marks = 19

	if (
		data[0][column_index_of_section_name].indexOf('Section') !== -1 &&
		data[0][column_index_of_pool_count].indexOf('PoolCount') !== -1 &&
		data[0][column_index_of_passage].indexOf('Comprehension Passage') !== -1 &&
		data[0][column_index_of_question_statement].indexOf('Statement') !== -1 &&
		data[0][4].indexOf('Type') !== -1 &&
		data[0][starting_column_index_of_options + 0].indexOf('A') !== -1 &&
		data[0][starting_column_index_of_options + 1].indexOf('B') !== -1 &&
		data[0][starting_column_index_of_options + 2].indexOf('C') !== -1 &&
		data[0][starting_column_index_of_options + 3].indexOf('D') !== -1 &&
		data[0][starting_column_index_of_options + 4].indexOf('E') !== -1 &&
		data[0][column_index_of_correct_option].indexOf('Correct') !== -1 &&
		data[0][column_index_of_link_url].indexOf('Link URL') !== -1 &&
		data[0][column_index_of_link_url + 1].indexOf('Link Text') !== -1 &&
		data[0][column_index_of_question_image].indexOf('Image URL') !== -1 &&
		data[0][starting_column_index_of_option_images + 0].indexOf('A Image') !==
			-1 &&
		data[0][starting_column_index_of_option_images + 1].indexOf('B Image') !==
			-1 &&
		data[0][starting_column_index_of_option_images + 2].indexOf('C Image') !==
			-1 &&
		data[0][starting_column_index_of_option_images + 3].indexOf('D Image') !==
			-1 &&
		data[0][starting_column_index_of_option_images + 4].indexOf('E Image') !==
			-1 &&
		data[0][column_index_of_question_marks].indexOf('Marks') !== -1
	) {
		console.log(data)
		console.log('CSV Format Correct')

		let prevSection = null
		let prevSectionIndex = -1

		let prev_passage = null
		let prev_passage_index = null

		const mcqs_state = []
		const passages_state = []
		const headingRow = data[0]
		for (let row = 1; row < data.length; row++) {
			// skipping row 0 as it is heading
			const curSection = data[row][column_index_of_section_name]
			const cur_passage = data[row][column_index_of_passage]
			const poolCount = data[row][column_index_of_pool_count]

			if (prev_passage !== cur_passage && cur_passage !== 'null') {
				prev_passage = cur_passage
				prev_passage_index = passages_state.push({
					id: null,
					statement: cur_passage,
					place_after_question:
						mcqs_state.length !== 0
							? mcqs_state[prevSectionIndex].questions.length - 1
							: 0,
					// passage will be placed after the latest question that has been inserted into the array
					//  (which is not the question that belongs to this passage, wo to abhi hum ne insert krna hai agay)
				})
				prev_passage_index--
			}

			// checking if this question belongs to a new section
			if (curSection !== prevSection) {
				prevSection = curSection
				prevSectionIndex++
				mcqs_state.push({
					sectionTitle: curSection,
					sectionOrder: null,
					poolCount,
					time: 0,
					questions: [
						{
							passage: cur_passage === 'null' ? null : prev_passage_index,
							statement: data[row][column_index_of_question_statement],
							questionOrder: null,
							type: data[row][column_index_of_question_type],
							image:
								data[row][column_index_of_question_image] === 'null'
									? null
									: data[row][column_index_of_question_image],
							marks: parseFloat(data[row][column_index_of_question_marks]),
							link: {
								url:
									data[row][column_index_of_link_url] === 'null'
										? null
										: data[row][column_index_of_link_url],
								text:
									data[row][column_index_of_link_url + 1] === 'null'
										? null
										: data[row][column_index_of_link_url + 1],
							},
							options: [],
						},
					],
				})
				mcqs_state[mcqs_state.length - 1].sectionOrder = mcqs_state.length - 1
				mcqs_state[mcqs_state.length - 1].questions[
					mcqs_state[mcqs_state.length - 1].questions.length - 1
				].questionOrder = mcqs_state[mcqs_state.length - 1].questions.length - 1
			} else {
				//   If this question belongs to the same section as before
				mcqs_state[prevSectionIndex].questions.push({
					passage: cur_passage === 'null' ? null : prev_passage_index,
					statement: data[row][column_index_of_question_statement],
					questionOrder: null,
					type: data[row][column_index_of_question_type],
					image:
						data[row][column_index_of_question_image] === 'null'
							? null
							: data[row][column_index_of_question_image],
					marks: parseFloat(data[row][column_index_of_question_marks]),
					link: {
						url:
							data[row][column_index_of_link_url] === 'null'
								? null
								: data[row][column_index_of_link_url],
						text:
							data[row][column_index_of_link_url + 1] === 'null'
								? null
								: data[row][column_index_of_link_url + 1],
					},
					options: [],
				})
				mcqs_state[prevSectionIndex].questions[
					mcqs_state[prevSectionIndex].questions.length - 1
				].questionOrder = mcqs_state[prevSectionIndex].questions.length - 1
			}

			// handling question options
			for (
				let i = starting_column_index_of_options;
				i <= starting_column_index_of_options + 4;
				i++
			) {
				if (data[row][i] !== 'null')
					mcqs_state[prevSectionIndex].questions[
						mcqs_state[prevSectionIndex].questions.length - 1
					].options.push({
						optionStatement: data[row][i],
						optionOrder: null,
						image:
							data[row][
								i +
									difference_between_starting_of_options_and_starting_of_option_images
							] === 'null'
								? null
								: data[row][
										i +
											difference_between_starting_of_options_and_starting_of_option_images
								  ],
						correct:
							commasToArray(data[row][column_index_of_correct_option]).indexOf(
								headingRow[i]
							) !== -1,
						edit: false,
					})
				const curOptionIndex =
					mcqs_state[prevSectionIndex].questions[
						mcqs_state[prevSectionIndex].questions.length - 1
					].options.length - 1
				mcqs_state[prevSectionIndex].questions[
					mcqs_state[prevSectionIndex].questions.length - 1
				].options[curOptionIndex].optionOrder = curOptionIndex
			}

			// add additional null option as required by react app
			mcqs_state[prevSectionIndex].questions[
				mcqs_state[prevSectionIndex].questions.length - 1
			].options.push({
				optionStatement: null,
				optionOrder: null,
				image: null,
				correct: false,
				edit: true,
			})
			const curOptionIndex =
				mcqs_state[prevSectionIndex].questions[
					mcqs_state[prevSectionIndex].questions.length - 1
				].options.length - 1
			mcqs_state[prevSectionIndex].questions[
				mcqs_state[prevSectionIndex].questions.length - 1
			].options[curOptionIndex].optionOrder = curOptionIndex
		}

		// console.log(util.inspect(mcqs_state, false, null, true));
		// console.log(util.inspect(passages_state, false, null, true));
		return [mcqs_state, passages_state]
	} else {
		console.log('CSV Format Wrong')
		return false
	}
}

module.exports = csvToState
