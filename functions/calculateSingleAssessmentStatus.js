function anySectionInProgress(attempted_sections)
{
    for (let i=0;i<attempted_sections.rows.length;i++)
    {
    if (attempted_sections.rows[i].statusText == "In Progress")
    {
        return true;
    }
    }
    return false;
}

function allSectionsCompleted(attempted_sections, num_sections)
{
    let all_completed = true;
    if (attempted_sections.rows.length < num_sections) return false
    else {
    for (let i=0;i<attempted_sections.rows.length;i++)
    {
        if (attempted_sections.rows[i].statusText != "Completed")
        {
        all_completed = false;
        }
    }
    return all_completed;
    }
}

// use findAndCountAll in sequelize instead of just findAll for the attempted_sections object in this function
// num_sections is the total number of sections in that Quiz
function calculateSingleAssessmentStatus(attempted_sections, num_sections)
{
    if (attempted_sections.count==0) return ["Not Started", "Start"];
    else if (anySectionInProgress(attempted_sections)) return ["In Progress", "Continue"];
    else if (!allSectionsCompleted(attempted_sections, num_sections)) return ["Incomplete", "Continue"];
    else return ["Completed", ""];
}

module.exports = calculateSingleAssessmentStatus