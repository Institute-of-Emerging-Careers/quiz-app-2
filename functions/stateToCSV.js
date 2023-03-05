const { stringify } = require('csv-stringify')
const fs = require('fs')
const path = require('path')

/*
  state:
  [
    {
        sectionTitle: sectionInput,
        poolCount: 0,
        questions: [
            {
                passage: null,
                statement: null,
                type: type,
                image:null,
                link:{url:null, text:null},
                marks = 0,
                options: [
                    { optionStatement: "option 1", correct: true, image: null,},
                    { optionStatement: null, correct: false, image: null }
                ],
            }
        ],
    }
  ]
*/

function generateImageLink(link) {
	// this function adds an "https" to the start of a link if the link does not have it.
	if (link.slice(0, 4) === 'http') return link
	else return link
}

function stateToArray(mcqs, passages) {
	const final_array = []
	const num_columns_in_csv = 20
	const [
		section_title_index,
		pool_count_index,
		comprehension_passage_index,
		question_statement_index,
		question_type_index,
		array_index_where_options_start,
		correct_option_index,
		link_url_index,
		image_index,
		array_index_where_option_images_start,
		marks_index,
	] = [0, 1, 2, 3, 4, 5, 10, 11, 13, 14, 19]

	// Adding headers
	final_array.push([
		'Section',
		'PoolCount',
		'Comprehension Passage',
		'Statement',
		'Type',
		'A',
		'B',
		'C',
		'D',
		'E',
		'Correct',
		'Link URL',
		'Link Text',
		'Image URL',
		'A Image',
		'B Image',
		'C Image',
		'D Image',
		'E Image',
		'Marks',
	])

	// we will convert this 2D array into a CSV file (table). Each row in this array is a question, as in books.csv
	// [0-> Section, 1-> PoolCount, 2-> Statement,3-> Type,4-> A,5-> B,6-> C,7-> D,8-> E,9-> Correct,10-> Link URL,11-> Link Text,12-> Image URL,13-> A Image,14-> B Image,15-> C Image,16-> D Image,17-> E Image,18-> Marks]

	mcqs.forEach((section, sectionIndex) => {
		section.questions.forEach((question, questionIndex) => {
			// populating a new row array with null

			let new_section_index = final_array.push([])
			new_section_index--

			for (let i = 0; i < num_columns_in_csv; i++)
				final_array[new_section_index].push('null')

			final_array[new_section_index][section_title_index] = section.sectionTitle
			final_array[new_section_index][pool_count_index] = section.poolCount
			final_array[new_section_index][question_statement_index] =
				question.statement
			final_array[new_section_index][comprehension_passage_index] =
				question.passage == null ? 'null' : passages[question.passage].statement
			final_array[new_section_index][question_type_index] = question.type
			final_array[new_section_index][link_url_index] =
				question.link.url == null ? 'null' : question.link.url
			final_array[new_section_index][link_url_index + 1] =
				question.link.text == null ? 'null' : question.link.text
			final_array[new_section_index][image_index] =
				question.image != null ? generateImageLink(question.image) : 'null'
			final_array[new_section_index][marks_index] = question.marks

			let correct_options = ''
			let num_correct = 0
			const array_of_alphabets = ['A', 'B', 'C', 'D', 'E']

			// now creating a correct_options string
			question.options.forEach((option, optionIndex) => {
				if (option.optionStatement != null)
					final_array[new_section_index][
						array_index_where_options_start + optionIndex
					] = option.optionStatement
				if (option.image != null)
					final_array[new_section_index][
						array_index_where_option_images_start + optionIndex
					] = generateImageLink(option.image)

				if (option.correct === true) {
					if (num_correct > 0) correct_options += ','
					correct_options += array_of_alphabets[optionIndex]
					num_correct++
				}
				// remaining options will automatically be "null" as we populated array with "null" in the start
			})
			final_array[new_section_index][correct_option_index] = correct_options
			correct_options = ''
		})
	})
	return final_array
}

async function stateToCSV(mcqs, passages) {
	let file_save_location = path.join(__dirname, '/../downloads/csv')
	const file_name = Date.now().toString() + '.csv'
	file_save_location = file_save_location + '/' + file_name
	const final_array = stateToArray(mcqs, passages)

	return new Promise((resolve, reject) => {
		stringify(final_array, (err, csv) => {
			if (err) throw err
			fs.writeFile(file_save_location, csv, 'utf8', function (err) {
				if (err) {
					console.log(
						'Some error occured - file either not saved or corrupted file saved.'
					)
					reject(err)
				} else {
					resolve(file_name)
				}
			})
		})
	})
}

module.exports = stateToCSV
