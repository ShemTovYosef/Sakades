//  Declare SQL Query for SQLite

var createStatement = "CREATE TABLE IF NOT EXISTS Players (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, played INTEGER, score INTEGER)";

var selectAllStatement = "SELECT * FROM Players";

var insertStatement = "INSERT INTO Players (name, played, score) VALUES (?, ?, ?)";

var updateStatement = "UPDATE Players SET name = ?, played = ?, score = ? WHERE id=?";

var deleteStatement = "DELETE FROM Players WHERE id=?";

var dropStatement = "DROP TABLE Players";

var db = html5sql.openDatabase("Sakades", "Sakades game statistic", 2 * 1024 * 1024);  // Open SQLite Database

var dataset;

function initDatabase() { // Function Call When Page is ready.
    try {
//        $.get('http://cs1368.userapi.com/u99693/docs/3dfea6ea70d4/db-statements.sql', function (sql) {
        $.get('src/db-statements.sql', function (sql) {
            var startTime = new Date();
            html5sql.process(
                sql,
                function () { //Success
                    var endTime = new Date();
                    console.log("DB initialized in: " + ((endTime - startTime) / 1000) + "s");
                    showRecords();
                },
                function (error, failingQuery) { //Failure
                    console.log("Error: " + error.message);
                }
            );
        });
    } catch (error) {
        console.log("Error: " + error.message);
    }
}

function createTable() { // Function for Create Table in SQLite.
    db.transaction(function (tx) {
        tx.executeSql(createStatement, [], showRecords, onError);
    });
}

function insertRecord() { // Get value from Input and insert record . Function Call when Save/Submit Button Click..
    var nametemp = $('input:text[id=name]').val();
    var initalPlayed = 0;
    var defaultScore = 1600;

    db.transaction(function (tx) {
        tx.executeSql(insertStatement, [nametemp, initalPlayed, defaultScore], loadAndReset, onError);
    });

    //tx.executeSql(SQL Query Statement,[ Parameters ] , Sucess Result Handler Function, Error Result Handler Function );
}

function deleteRecord(id) { // Get id of record . Function Call when Delete Button Click..
    var iddelete = id.toString();

    db.transaction(function (tx) {
        tx.executeSql(deleteStatement, [id], showRecords, onError);
        alert("Delete Sucessfully");
    });

    resetForm();
}

function updateRecord() { // Get id of record. Function Call when Update Button Click..
    var nameupdate = $('input:text[id=name]').val().toString();
    var scoreUpdate = $('input:text[id=score]').val();

    var useridupdate = $("#id").val();
    var playedUpdate = $('#played').val();

    db.transaction(function (tx) {
        tx.executeSql(updateStatement, [nameupdate, playedUpdate, scoreUpdate, useridupdate], loadAndReset, onError);
    });
}

function dropTable() {// Function Call when Drop Button Click. Table will be dropped from database.
    db.transaction(function (tx) {
        tx.executeSql(dropStatement, [], showRecords, onError);
    });

    resetForm();

    initDatabase();
}

function loadRecord(i) { // Function for display records which are retrived from database.
    var item = dataset.item(i);

    $("#name").val((item['name']).toString());
    $("#played").val(item['played']);
    $("#score").val(item['score']);
    $("#id").val(item['id']);
}

function resetForm() { // Function for reset form input values.
    $("#name").val("");
    $("#played").val("");
    $("#score").val("");
    $("#id").val("");
}

function loadAndReset() {//Function for Load and Reset...
    resetForm();

    showRecords();
}

function onError(tx, error) { // Function for Hendeling Error...
    alert(error.message);
}

function showRecords() { // Function For Retrive data from Database Display records as list
    $("#results").html('')

    db.transaction(function (tx) {
        tx.executeSql(selectAllStatement, [], function (tx, result) {
            dataset = result.rows;

            if (dataset.length > 0) {
                var tableCaption = '<ul>Name : Score [Games]</ul>';
                $("#results").append(tableCaption);
            }

            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);

                var linkeditdelete = '<li>' + item['name'] + ' : ' + item['score'] + ' [' + item['played'] + '] '
                    + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' +
                    '<a href="#" onclick="deleteRecord(' + item['id'] + ');">delete</a></li>';

                $("#results").append(linkeditdelete);
            }
        });
    });
}

$(document).ready(function () { // Call function when page is ready for load..
    $("body").fadeIn(2000); // Fede In Effect when Page Load..

    initDatabase();

    // Register Event Listener when button click.
    $("#submitButton").click(insertRecord);
    $("#btnUpdate").click(updateRecord);
    $("#btnReset").click(resetForm);
    $("#btnDrop").click(dropTable);
});