const express = require("express");
const pg = require("pg");

const app = express();

const port = 8080;
const connection = new pg.Pool({
  host: "db",
  user: "docker",
  password: "docker",
  database: "docker",
});

app.get("/", async (req, res) => {
  const client = await connection.connect();
  await connection.query(
    "CREATE TABLE IF NOT EXISTS people(id SERIAL PRIMARY KEY, name VARCHAR(255));"
  );
  await connection.query("INSERT INTO people(name) values('Gabriel');");
  client.release();
  const result = await connection.query("SELECT * FROM people;");
  let returnString = `
      <h1>Full Cycle Rocks!</h1>
  `;
  result.rows.forEach((row) => {
    returnString += `\n<div><p>${row.name}</p></div>`;
  });
  returnString = `
  <div>
    ${returnString}
  </div>`;
  res.send(returnString);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
