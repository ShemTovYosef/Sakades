//  Declare SQL Query for SQLite

var createStatement = "CREATE TABLE IF NOT EXISTS Players (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, played INTEGER, score INTEGER);";

var selectAllStatement = "SELECT * FROM ";

var insertPlayerStatement = "INSERT INTO Players (name, played, score) VALUES (?, ?, ?);";

var insertPartyStatement = "INSERT INTO Parties (player_1, player_2, player_3, player_4, score) VALUES (?, ?, ?, ?, ?);";

var updatePlayerStatement = "UPDATE Players SET name = ?, played = ?, score = ? WHERE id=?;";

var deleteStatement = "DELETE FROM Players WHERE id=?;";

var dropStatement = "DROP TABLE IF EXISTS ";

var selectTableDefition = "SELECT name, sql FROM sqlite_master WHERE type in ('table') AND name NOT LIKE '?_?_%' ESCAPE '?' AND name != 'sqlite_sequence';";

var db = html5sql.openDatabase("Sakades", "Sakades game statistic", 2 * 1024 * 1024);  // Open SQLite Database

var dataset;

var exportSql = "-- " + new Date() + ";\n";

function initDatabase() { // Function Call When Page is ready.
    try {
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
        tx.executeSql(insertPlayerStatement, [nametemp, initalPlayed, defaultScore], loadAndReset, onError);
    });

    //tx.executeSql(SQL Query Statement,[ Parameters ] , Sucess Result Handler Function, Error Result Handler Function );
}

function saveParty() { // Get value from Input and insert record . Function Call when Save/Submit Button Click..
    var firstPlayer = $('select#first').val();
    var secondPlayer = $('select#second').val();
    var thirdPlayer = $('select#third').val();
    var fourthPlayer = $('select#fourth').val();
    var result = $('select#result').val();

    db.transaction(function (tx) {
        tx.executeSql(insertPartyStatement, [firstPlayer, secondPlayer, thirdPlayer, fourthPlayer, result], loadAndReset, onError);

        // TODO: update played users with count of games and scores
    });
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
        tx.executeSql(updatePlayerStatement, [nameupdate, playedUpdate, scoreUpdate, useridupdate], loadAndReset, onError);
    });
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
    $("#stats").html('');

    db.readTransaction(function (tx) {
        tx.executeSql(selectAllStatement + "Players", [], function (tx, result) {
                var dataset = result.rows;

                if (dataset.length > 0) {
                    var tableCaption = '<ul>Name : Score [Games]</ul>';
                    $("#stats").append(tableCaption);
                }

                for (var i = 0, player = null; i < dataset.length; i++) {
                    player = dataset.item(i);

                    $(".player").append($('<option value="' + player['id'] + '">' + player['name'] + '</option>'));

                    var linkeditdelete = '<li>' + player['name'] + ' : ' + player['score'] + ' [' + player['played'] + '] '
                        + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' +
                        '<a href="#" onclick="deleteRecord(' + player['id'] + ');">delete</a></li>';

                    $("#stats").append(linkeditdelete);

                }
            }
        );

        tx.executeSql(selectAllStatement + "Ranks", [], function (tx, result) {
            var dataset = result.rows;

            for (var i = 0, rank = null; i < dataset.length; i++) {
                rank = dataset.item(i);
                var rankInfo = '<li>' + rank['title'] + ' : ' + rank['low_bound'] + ' - ' + rank['high_bound'] + '</li>';
                $("#ranks").append(rankInfo);
            }
        });
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

function postDBScript() {
    $.ajax({
        type: "POST",
        url: "src/db-statements.sql",
        enctype: 'multipart/form-data',
        data: {
            file: exportSql
        },
        success: function (data) {
            alert("Data uploaded successfuly");
        },
        error: function (error, failingQuery) { //Failure
            console.log("Error: " + error.message);
        }
    });
}

$(document).ready(function () { // Call function when page is ready for load..
    $("body").fadeIn(2000); // Fede In Effect when Page Load..

    initDatabase();

    // Register Event Listener when button click.
    $("#btnSave").click(insertRecord);
    $("#btnSaveParty").click(saveParty);
    $("#btnUpdate").click(updateRecord);
    $("#btnReset").click(resetForm);
    $("#btnExport").click(exportDatabase);
    $("#btnUpload").click(postDBScript);
});