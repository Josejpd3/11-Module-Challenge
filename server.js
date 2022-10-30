const express = require("express");

const data = require("./db/db.json");
const PORT = 3001;

const app = express();

app.get('/', (req, res) => res.send('Visit http://localhost:3001/api'))

app.get('/api', (req, res) => res.json(data));

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
