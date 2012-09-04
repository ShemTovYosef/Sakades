//  Declare SQL Query for SQLite

var createStatement = "CREATE TABLE IF NOT EXISTS Players (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, played INTEGER, score INTEGER);";

var selectAllStatement = "SELECT * FROM Players;";

var insertStatement = "INSERT INTO Players (name, played, score) VALUES (?, ?, ?);";

var updateStatement = "UPDATE Players SET name = ?, played = ?, score = ? WHERE id=?;";

var deleteStatement = "DELETE FROM Players WHERE id=?;";

var dropStatement = "DROP TABLE IF EXISTS ";

var selectTableDefition = "SELECT name, sql FROM sqlite_master WHERE type in ('table') AND name NOT LIKE '?_?_%' ESCAPE '?';";

var db = html5sql.openDatabase("Sakades", "Sakades game statistic", 2 * 1024 * 1024);  // Open SQLite Database

var dataset;

var exportSql = "-- " + new Date() + ";\n";

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

function dropTable(tableName) {// Function Call when Drop Button Click. Table will be dropped from database.
    db.transaction(function (tx) {
        tx.executeSql(dropStatement + tableName, [], showRecords, onError);
    });

    resetForm();
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

    db.readTransaction(function (tx) {
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
            }
        );
    });
}

function exportDatabase() { // Function for Export database data into sql file
    var tableNames = [];
    var tableDDLs = [];
    db.readTransaction(function (tx) {
        tx.executeSql(selectTableDefition, [],
            function (tx, tableNamesResults) {
                if (tableNamesResults.rows) {
                    for (var tableNum = 0; tableNum < tableNamesResults.rows.length; tableNum++) {
                        var defRow = tableNamesResults.rows.item(tableNum);
                        var tableName = defRow.name;
                        tableNames.push(tableName);
                        tableDDLs.push(defRow.sql);

                        tx.executeSql("SELECT * FROM " + tableName, [], function (tx, results) {
                            tableName = tableNames.pop();
                            exportSql += "\n-- exporting data for " + tableName.toUpperCase() + "\n";
                            exportSql += dropStatement + tableName + ";\n";
                            exportSql += tableDDLs.pop() + ";\n\n";
                            if (results.rows) {
                                for (var i = 0; i < results.rows.length; i++) {
                                    var row = results.rows.item(i);
                                    var _fields = [];
                                    var _values = [];
                                    for (var col in row) {
                                        _fields.push(col);
                                        _values.push('"' + row[col] + '"');
                                    }
                                    exportSql += "INSERT INTO " + tableName + "(" + _fields.join(",") + ") VALUES (" + _values.join(",") + ");\n";
                                }
                            }
                            if (tableNames.length == 0) {
                                console.log(exportSql);
                            }
                        });
                    }
                    tableNames.reverse();
                    tableDDLs.reverse();
                }
            }
        );
    });
}

$(document).ready(function () { // Call function when page is ready for load..
    $("body").fadeIn(2000); // Fede In Effect when Page Load..

    initDatabase();

    // Register Event Listener when button click.
    $("#submitButton").click(insertRecord);
    $("#btnUpdate").click(updateRecord);
    $("#btnReset").click(resetForm);
    $("#btnExport").click(exportDatabase);
});