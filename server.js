const express = require("express");
const path = require('path');
const fs = require('fs');
const util = require('util');
const { crypto } = require('crypto');

const PORT = process.env.PORT || 3001;
const app = express();

const dataLocation = "./db/db.json";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));

const readFromFile = util.promisify(fs.readFile);

app.get('/api/notes', (req, res) => {
  readFromFile(dataLocation).then((data) => res.json(JSON.parse(data)));
});
// POST Route for new note
app.post('/api/notes', (req, res) => {
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: crypto(),
  }
  readAndAppend(newNote, dataLocation);
    const response = {
      status: 'success',
      body: newNote,
    };
    res.json(response);
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
