const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "tradixdev",
  database: "tradixbot",
  password: "EvjnCfdn45446aN37rHq",
  multipleStatements: true,
  dateStrings: true,
});
// PORT=9000
// TELEGRAM_BOT_TOKEN=6100756300:AAFZ5Iu-v0FUfr-hOmz2__W9NU7_vVYb3f0
// HOST=localhost
// USER1=tradixdev
// DATABASE=tradixbot
// PASSWORD=EvjnCfdn45446aN37rHq


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
