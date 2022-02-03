const path = require("path")

function sendFileInResponse(req, res, folder) {
    var options = {
      root: path.join(__dirname, "../", folder),
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };
    res.sendFile(req.params.filename, options, function (err) {
      if (err) {
        console.log(err);
      }
    });
}

module.exports = sendFileInResponse
