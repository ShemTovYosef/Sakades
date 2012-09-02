//  Declare SQL Query for SQLite

var createStatement = "CREATE TABLE IF NOT EXISTS Players (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, score INTEGER)";

var selectAllStatement = "SELECT * FROM Players";

var insertStatement = "INSERT INTO Players (name, email, score) VALUES (?, ?, ?)";

var updateStatement = "UPDATE Players SET name = ?, email = ?, score = ? WHERE id=?";

var deleteStatement = "DELETE FROM Players WHERE id=?";

var dropStatement = "DROP TABLE Players";

var db = openDatabase("Sakades", "1.0", "Sakades game statistic", 2*1024*1024);  // Open SQLite Database

var dataset;

var DataType;

function initDatabase() { // Function Call When Page is ready.
    try {
        if (!window.openDatabase) {  // Check browser is supported SQLite or not.
            alert('Databases are not supported in this browser.');
        } else {
            createTable();  // If supported then call Function for create table in SQLite
        }
    }

    catch (e) {
        if (e == 2) {
            // Version number mismatch.
            console.log("Invalid database version.");
        } else {
            console.log("Unknown error " + e + ".");
        }
        return;
    }
}

function createTable() { // Function for Create Table in SQLite.
    db.transaction(function (tx) {
        tx.executeSql(createStatement, [], showRecords, onError);
    });
}

function insertRecord() { // Get value from Input and insert record . Function Call when Save/Submit Button Click..
    var nametemp = $('input:text[id=name]').val();
    var emailtemp = $('input:text[id=email]').val();
    var defaultScore = 1000;

    db.transaction(function (tx) {
        tx.executeSql(insertStatement, [nametemp, emailtemp, defaultScore], loadAndReset, onError);
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

function updateRecord() { // Get id of record . Function Call when Delete Button Click..
    var nameupdate = $('input:text[id=name]').val().toString();
    var emailupdate = $('input:text[id=email]').val().toString();
    var score = $('input:text[id=score]').val();

    var useridupdate = $("#id").val();

    db.transaction(function (tx) {
        tx.executeSql(updateStatement, [nameupdate, emailupdate, Number(score), Number(useridupdate)], loadAndReset, onError);
    });
}

function dropTable() {// Function Call when Drop Button Click.. Talbe will be dropped from database.
    db.transaction(function (tx) {
        tx.executeSql(dropStatement, [], showRecords, onError);
    });

    resetForm();

    initDatabase();
}

function loadRecord(i) { // Function for display records which are retrived from database.
    var item = dataset.item(i);

    $("#name").val((item['name']).toString());
    $("#email").val((item['email']).toString());
    $("#score").val((item['score']).toString());
    $("#id").val((item['id']).toString());
}

function resetForm() { // Function for reset form input values.
    $("#name").val("");
    $("#email").val("");
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

            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);

                var linkeditdelete = '<li>' + item['name'] + ' : ' + item['score']
                    + '    ' + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' +
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