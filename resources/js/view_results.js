// Quick and simple export target #table_id into a csv
let minimum_percentage_mirror = $("#minimum_percentage_mirror")

function download_table_as_csv(table_id, separator = ',') {
    // Select rows from table_id
    var rows = document.querySelectorAll('table#' + table_id + ' tr');
    // Construct csv
    var csv = [];
    
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].style.display!="none")
        {
            var row = [], cols = rows[i].querySelectorAll('td, th');
            for (var j = 0; j < cols.length; j++) {
                // Clean innertext to remove multiple spaces and jumpline (break csv)
                var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
                // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
                data = data.replace(/"/g, '""');
                // Push escaped string
                row.push('"' + data + '"');
            }
            csv.push(row.join(separator));
        }
    }
    console.log(csv.length)
    if (csv.length == 1) { //the 1 row is the header row
        alert("Sorry! No rows to export. Change the filters.");
    }
    else {
    var csv_string = csv.join('\n');
    // Download it
    var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    }
}

let items = document.getElementsByClassName("endtime")

for (let i=0;i<items.length;i++) {
    items.item(i).innerText = moment(parseInt(items.item(i).innerText)+(new Date()).getTimezoneOffset()).format("h:mma | ddd D MMM Y")
}

$(document).ready(function(){
    // here I am handling the event listeners on the minimum percentage selector
    $("#minimum_percentage").val(0)
    minimum_percentage_mirror.text("0%")
    $("#minimum_percentage").on("change", function(){
        const value = $(this).val()
        minimum_percentage_mirror.text(value + "%")
        const int_value = parseInt(value)
        $("#results_table tr").filter(function(){
            return parseInt($(this).find('.total_percentage').text())<int_value
        }).fadeOut()
        $("#results_table tr").filter(function(){
            return parseInt($(this).find('.total_percentage').text())>int_value
        }).fadeIn()
    })

    $("#unsolved_students").on("change",function(){
        const value = $(this).is(':checked')
        console.log(value)
        if (value) {
            $("#results_table tr").filter(function(){
                return $(this).hasClass("unsolved")
            }).fadeIn()
        } else {
            $("#results_table tr").filter(function(){
                return $(this).hasClass("unsolved")
            }).fadeOut()
        }
    })
})