const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "tradixbot",
  password: "root",
  multipleStatements: true,
  dateStrings: true,
});

connection.connect((error) => {
  if (error) {
    console.log("Error connecting to the database" + error);
  } else {
    console.log(
      "==============================================================="
    );
    console.log(">>> ⚙️ Successfully connected to the database of TRADIX_BOT.");
    console.log(
      "==============================================================="
    );
  }
  return connection;
});

module.exports = connection;
