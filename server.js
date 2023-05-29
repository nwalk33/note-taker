const express = require('express');
const path = require("path")
const fs = require("fs")

const uuid = require('./helpers/uuid');

const app = express()
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended:true }))
app.use(express.json())
app.use(express.static("./public"))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));

});

app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
    console.log(notes);
    res.json(notes);
    console.info(`${req.method} request received to get notes`);
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading data file');
                console.error(err);
            }
            else {
                const notes = JSON.parse(data);
                const newNote = {
                    id: uuid(),
                    title,
                    text,
                }
            
                const response = {
                    status: 'success',
                    body: newNote,
                };
            
                notes.push(newNote);
                fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        res.json(response);
                        console.info('Note added successfully.');
                    }
                });
            }
        });
    } else {
        res.status(400).send('Add title and text for the note.');
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);