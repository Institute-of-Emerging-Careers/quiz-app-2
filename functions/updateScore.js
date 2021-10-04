function updateScore(sectionId, assignment,score) {
    if (assignment.scores == null) {
        return assignment.update({scores: [{sectionId: sectionId, score: score}]})
    } else {
        // waise to it won't happen but just to check if this section already exists in the scores object
        let found=false
        for(let i=0;i<assignment.scores.length;i++) {
            if (assignment.scores[i].sectionId == sectionId) found=i
        }
        if (found === false) {
            return assignment.update({scores: [...assignment.scores, {sectionId: sectionId, score:score}]})
        } else {
            assignment.scores[found].score = score
            return assignment.update({scores: assignment.scores})
        }
    }
}

module.exports = updateScore