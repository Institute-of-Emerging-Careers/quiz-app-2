const axios = require('axios')
const path = require('path')
const { writeFileSync } = require('fs')

function youtubePlaylistToCSV(access_token, playlist_id) {
	return new Promise((majorResolve, majorReject) => {
		axios
			.get(
				`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2C%20contentDetails&playlistId=${playlist_id}&maxResults=500&key=${access_token}`
			)
			.then((response) => {
				const playlist_data = response.data

				const results = []
				new Promise((resolve) => {
					let i = 0
					const n = playlist_data.items.length

					playlist_data.items.forEach((video) => {
						const cur_index =
							results.push([
								video.snippet.title,
								`https://www.youtube.com/watch?v=${video.contentDetails.videoId}`,
							]) - 1

						// get this video's duration

						axios
							.get(
								`https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${
									video.contentDetails.videoId
								}&key=${encodeURIComponent(access_token)}`
							)
							.then((response) => {
								if (response.data.pageInfo.totalResults > 0)
									results[cur_index].push(
										response.data.items[0].contentDetails.duration
									)
							})
							.catch((err) => {
								console.log(err)
							})
							.finally(() => {
								i++
								if (i === n) resolve()
							})
					})
				}).then(() => {
					console.log('Data completely received from YouTube API.')

					const csvContent = results
						.map((item) => {
							// Here item refers to a row in that 2D array
							const row = item

							// Now join the elements of row with "," using join function
							return '"' + row.join('","') + '"'
						}) // At this point we have an array of strings
						.join('\n')

					let file_save_location = path.join(__dirname, '/../downloads/csv')
					const file_name = `result-${playlist_id}.csv`
					file_save_location = file_save_location + '/' + file_name
					writeFileSync(file_save_location, csvContent)
					console.log('YouTube Playlist to CSV file created')
					majorResolve(file_name)
				})
			})
			.catch((err) => {
				console.log(err)
			})
	})
}

module.exports = youtubePlaylistToCSV
