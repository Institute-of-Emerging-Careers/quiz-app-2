function millisecondsToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + " minutes and " + (seconds < 10 ? "0" : "") + seconds + " seconds";
}

module.exports = millisecondsToMinutesAndSeconds