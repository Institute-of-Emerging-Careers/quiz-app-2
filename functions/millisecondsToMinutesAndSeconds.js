function millisecondsToMinutesAndSeconds(millis) {
	const minutes = Math.floor(millis / 60000)
	const seconds = ((millis % 60000) / 1000).toFixed(0)
	return (
		minutes + ' minutes and ' + (seconds < 10 ? '0' : '') + seconds + ' seconds'
	)
}

// it returns seconds if time remaining is less than 1 minute
// it returns minutes if time remaining is less than 1 hour
// ms is milliseconds
function msToTime(ms) {
	const seconds = (ms / 1000).toFixed(1)
	const minutes = (ms / (1000 * 60)).toFixed(1)
	const hours = (ms / (1000 * 60 * 60)).toFixed(1)
	const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1)
	if (seconds < 60) return seconds + ' Sec'
	else if (minutes < 60) return minutes + ' Min'
	else if (hours < 24) return hours + ' Hrs'
	else return days + ' Days'
}

module.exports = { millisecondsToMinutesAndSeconds, msToTime }
