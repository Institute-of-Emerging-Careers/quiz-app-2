const percentage_ranges_field_text = document.getElementById("percentage_ranges").value
const percentage_ranges = percentage_ranges_field_text.split(', ')
// result is an array [1,2,3,...] where 1 is no. of students with percentage between 0.00% and 10.00%, 2, and so on

const percentage_ranges_chart = new Chart(
    document.getElementById('percentage_ranges_chart'),
    {
        type: 'bar',
        data: {
            labels: [
                '0.00% to 10.00%',
                '10.01% to 20.00%',
                '20.01% to 30.00%',
                '30.01% to 40.00%',
                '40.01% to 50.00%',
                '50.01% to 60.00%',
                '60.01% to 70.00%',
                '70.01% to 80.00%',
                '80.01% to 90.00%',
                '90.01% to 100.00%',
            ],
            datasets: [{
                label: 'Number of Students',
                backgroundColor: '#2A6095',
                borderColor: 'rgb(255, 99, 132)',
                data: percentage_ranges,
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Percentage Scores'
                }
            }
        }
    }
);


const total_students = parseInt(document.getElementById("total_students").value)
const num_students_who_completed = parseInt(document.getElementById("num_students_who_completed").value)
const num_students_who_started_but_did_not_complete = parseInt(document.getElementById("num_students_who_started_but_did_not_complete").value)
const num_students_data = [num_students_who_completed, num_students_who_started_but_did_not_complete, total_students-num_students_who_started_but_did_not_complete-num_students_who_completed]


const solved_complete_vs_unsolved = new Chart(
    document.getElementById('num_students_chart'),
    {
        type: 'pie',
        data: {
            labels: [
                "Number of students who have completed the assessment",
                "Number of students who have started the assessment but not completed it",
                "Number of students who have not started the assessment yet"
            ],
            datasets: [{
                backgroundColor: ['#5EC4FF','#FFFB3D','#FF454B'],
                data: num_students_data,
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Number of Students'
                }
            }
        }
    }
);