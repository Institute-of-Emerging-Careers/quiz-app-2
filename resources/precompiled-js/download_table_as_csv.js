"use strict";

function download_table_as_csv(table_id) {
  var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ",";
  // Select rows from table_id
  var rows = document.querySelectorAll("table#" + table_id + " tr"); // Construct csv

  var csv = [];

  for (var i = 0; i < rows.length; i++) {
    if (rows[i].style.display != "none") {
      var row = [],
          cols = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length; j++) {
        // Clean innertext to remove multiple spaces and jumpline (break csv)
        var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, "").replace(/(\s\s)/gm, " "); // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)

        data = data.replace(/"/g, '""'); // Push escaped string

        row.push('"' + data + '"');
      }

      csv.push(row.join(separator));
    }
  }

  if (csv.length == 1) {
    //the 1 row is the header row
    alert("Sorry! No rows to export. Change the filters.");
  } else {
    var csv_string = csv.join("\n"); // Download it

    var filename = "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
    var link = document.createElement("a");
    link.style.display = "none";
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv_string));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}