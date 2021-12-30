const {stringify} = require("csv-stringify");
const fs = require("fs");
const path = require("path");

/*
  state:
  [
    {
        sectionTitle: sectionInput,
        poolCount: 0,
        questions: [
            {
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

function stateToArray(state) {
  let final_array = [];
  const num_columns_in_csv = 19;
  const array_index_where_options_start = 4;
  const array_index_where_option_images_start = 13;

  // Adding headers
  final_array.push([
    "Section",
    "PoolCount",
    "Statement",
    "Type",
    "A",
    "B",
    "C",
    "D",
    "E",
    "Correct",
    "Link URL",
    "Link Text",
    "Image URL",
    "A Image",
    "B Image",
    "C Image",
    "D Image",
    "E Image",
    "Marks",
  ]);

  //we will convert this 2D array into a CSV file (table). Each row in this array is a question, as in books.csv
  // [0-> Section, 1-> PoolCount, 2-> Statement,3-> Type,4-> A,5-> B,6-> C,7-> D,8-> E,9-> Correct,10-> Link URL,11-> Link Text,12-> Image URL,13-> A Image,14-> B Image,15-> C Image,16-> D Image,17-> E Image,18-> Marks]

  state.forEach((section, sectionIndex) => {
    section.questions.forEach((question, questionIndex) => {
      // populating a new row array with null
      final_array.push([]);
      for (let i = 0; i < num_columns_in_csv; i++)
        final_array[final_array.length - 1].push("null");

      final_array[final_array.length - 1][0] = section.sectionTitle;
      final_array[final_array.length - 1][1] = section.poolCount;
      final_array[final_array.length - 1][2] = question.statement;
      final_array[final_array.length - 1][3] = question.type;
      final_array[final_array.length - 1][10] = question.link.url == null ? "null" : question.link.url;
      final_array[final_array.length - 1][11] = question.link.text == null ? "null" : question.link.text;
      final_array[final_array.length - 1][12] =question.image != null
          ? process.env.SITE_DOMAIN_NAME + question.image
          : "null";
      final_array[final_array.length - 1][18] = question.marks;

      let correct_options = "";
      let num_correct = 0;
      const array_of_alphabets = ["A", "B", "C", "D", "E"];

      // now adding options
      question.options.forEach((option, optionIndex) => {
        if (option.optionStatement != null) final_array[final_array.length - 1][array_index_where_options_start + optionIndex] = option.optionStatement
        if (option.image != null)
          final_array[final_array.length - 1][array_index_where_option_images_start + optionIndex] = process.env.SITE_DOMAIN_NAME + option.image;

        if (option.correct == true) {
          if (num_correct > 0) correct_options += ",";
          correct_options += array_of_alphabets[optionIndex];
          num_correct++;
        }
        // remaining options will automatically be "null" as we populated array with "null" in the start
      });
      final_array[final_array.length - 1][9] = correct_options;
      correct_options = "";
    });
  });
  return final_array;
}

async function stateToCSV(state) {
  let file_save_location = path.join(__dirname, "/../downloads/csv");
  const file_name = Date.now().toString() + ".csv";
  file_save_location = file_save_location + "/" + file_name
  const final_array = stateToArray(state);

  return new Promise((resolve, reject) => {
    stringify(final_array, (err, csv) => {
      if (err) throw err;
      fs.writeFile(file_save_location, csv, "utf8", function (err) {
        if (err) {
          console.log(
            "Some error occured - file either not saved or corrupted file saved."
          );
          reject();
        } else {
          console.log("It's saved!");
          resolve(file_name);
        }
      });
    });
  });
}

module.exports = stateToCSV;
