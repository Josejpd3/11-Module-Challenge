const express = require("express");
const path = require('path');
const fs = require('fs');
const util = require('util');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 3001;
const app = express();

const dataLocation = "./db/db.json";
// Middleware parses JSON
app.use(express.json());
// Middleware parses incoming requests
app.use(express.urlencoded({ extended: true }));
// Middleware serves public static files
app.use(express.static('public'));

// Main Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));

const readFromFile = util.promisify(fs.readFile);

// Note Database Route
app.get('/api/notes', (req, res) => {
  readFromFile(dataLocation).then((data) => res.json(JSON.parse(data)));
});

// POST Route for new note
app.post('/api/notes', (req, res) => {
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: randomUUID(),
  }
  readAndAppend(newNote, dataLocation);
    const response = {
      status: 'success',
      body: newNote,
    };
    res.json(response);
});

// Write new note to database
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
);
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};
// Listens for connections on PORT
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
