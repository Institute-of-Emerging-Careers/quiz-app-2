const util = require("util");
// Source data format
/* 
[
  [ '﻿Section', 'PoolCount', 'Statement', 'Type', 'A', 'B', 'C', 'D', 'E', 'Correct', 'Image URL', 'A Image', 'B Image', 'C Image', 'D Image', 'E Image', 'Marks' ],
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

/* Target json format 
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
  return string.split(",");
}

const csvToState = (data) => {
  const num_columns = 6;
  if (
    data[0][0].indexOf("Section") !== -1 &&
    data[0][1].indexOf("PoolCount") !== -1 &&
    data[0][2].indexOf("Statement") !== -1 &&
    data[0][3].indexOf("Type") !== -1 &&
    data[0][4].indexOf("A") !== -1 &&
    data[0][5].indexOf("B") !== -1 &&
    data[0][6].indexOf("C") !== -1 &&
    data[0][7].indexOf("D") !== -1 &&
    data[0][8].indexOf("E") !== -1 &&
    data[0][9].indexOf("Correct") !== -1 &&
    data[0][10].indexOf("Link URL") !== -1 &&
    data[0][11].indexOf("Link Text") !== -1 &&
    data[0][12].indexOf("Image URL") !== -1 &&
    data[0][13].indexOf("A Image") !== -1 &&
    data[0][14].indexOf("B Image") !== -1 &&
    data[0][15].indexOf("C Image") !== -1 &&
    data[0][16].indexOf("D Image") !== -1 &&
    data[0][17].indexOf("E Image") !== -1 &&
    data[0][18].indexOf("Marks") !== -1
  ) {
    console.log(data);
    console.log("CSV Format Correct");

    let prevSection = null;
    let prevSectionIndex = -1;
    let result = [];
    const headingRow = data[0];
    for (let row = 1; row < data.length; row++) {
      // skipping row 0 as it is heading
      let curSection = data[row][0];
      let poolCount = data[row][1];

      if (curSection !== prevSection) {
        prevSection = curSection;
        prevSectionIndex++;
        result.push({
          sectionTitle: curSection,
          sectionOrder: null,
          poolCount: poolCount,
          time: 0,
          questions: [
            {
              statement: data[row][2],
              questionOrder: null,
              type: data[row][3],
              image: data[row][12] == "null" ? null : data[row][12],
              marks: parseFloat(data[row][18]),
              link: { url: data[row][10] == "null" ? null : data[row][10], text: data[row][11] == "null" ? null : data[row][11] },
              options: [],
            },
          ],
        });
        result[result.length - 1].sectionOrder = result.length - 1;
        result[result.length - 1].questions[result[result.length - 1].questions.length - 1].questionOrder = result[result.length - 1].questions.length - 1;
      } else {
        //   If this question belongs to the same section as before
        result[prevSectionIndex].questions.push({
          statement: data[row][2],
          questionOrder: null,
          type: data[row][3],
          image: data[row][12] == "null" ? null : data[row][12],
          marks: parseFloat(data[row][18]),
          link: { url: data[row][10] == "null" ? null : data[row][10], text: data[row][11] == "null" ? null : data[row][11] },
          options: [],
        });
        result[prevSectionIndex].questions[result[prevSectionIndex].questions.length - 1].questionOrder = result[prevSectionIndex].questions.length - 1;
      }

      for (let i = 4; i <= 8; i++) {
        if (data[row][i] != "null")
          result[prevSectionIndex].questions[result[prevSectionIndex].questions.length - 1].options.push({
            optionStatement: data[row][i],
            optionOrder: null,
            image: data[row][i + 9] == "null" ? null : data[row][i + 9],
            correct: commasToArray(data[row][9]).indexOf(headingRow[i]) !== -1 ? true : false,
            edit: false,
          });
        const curOptionIndex = result[prevSectionIndex].questions[result[prevSectionIndex].questions.length - 1].options.length - 1;
        result[prevSectionIndex].questions[result[prevSectionIndex].questions.length - 1].options[curOptionIndex].optionOrder = curOptionIndex;
      }
      // add additional null option as required by react app
      result[prevSectionIndex].questions[result[prevSectionIndex].questions.length - 1].options.push({
        optionStatement: null,
        optionOrder: null,
        image: null,
        correct: false,
        edit: true,
      });
      const curOptionIndex = result[prevSectionIndex].questions[result[prevSectionIndex].questions.length - 1].options.length - 1;
      result[prevSectionIndex].questions[result[prevSectionIndex].questions.length - 1].options[curOptionIndex].optionOrder = curOptionIndex;
    }

    console.log(util.inspect(result, false, null, true));
    return result;
  } else {
    console.log("CSV Format Wrong");
    console.log(data[0]);
    return false;
  }
};

module.exports = csvToState;
