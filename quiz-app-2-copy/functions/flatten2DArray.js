function flatten2DArray(data) {
    // it only takes the first element of each subarray
    let result = []
    for (let i=0;i<data.length;i++) {
        result.push(data[i][0])
    }
    return result
}

module.exports = flatten2DArray