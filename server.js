const express = require("express");
const fs = require('fs');
var os = require('os');
const cors = require("cors");

const app = express();

function get_previous_filename(extension) {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    var filename = "/previous/polygon-" + date.getDate().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getFullYear().toString() + extension;
    return filename;
}

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get("/client.js", function (req, res) {
    res.sendFile(__dirname + "/client.js");
});

app.get('/styles.css', function (req, res) {
    res.sendFile(__dirname + "/styles.css");
});

app.get('/today/polygon.png', function (req, res) {
    res.sendFile(__dirname + "/today/polygon.png");
});

app.get('/today/polygon.txt', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var lines = fs.readFileSync("./today/polygon.txt").toString().split(os.EOL);
    var must_include = lines[0];
    lines = lines.slice(1);
    var words = [];
    var definitions = [];
    for (idx in lines) {
        var parts = lines[idx].split(": ")
        words.push(parts[0])
        definitions.push(parts[1])

    }
    res.end(JSON.stringify({ words, definitions, must_include }));
});

app.get('/previous/polygon.png', function (req, res) {
    try {
        res.sendFile(__dirname + get_previous_filename(".png"));
    } catch (error) {
        console.log(error);
    }
});

app.get('/previous/polygon.txt', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var lines = fs.readFileSync("." + get_previous_filename(".txt")).toString().split(os.EOL).slice(1);
    var words = [];
    var definitions = [];
    for (idx in lines) {
        var parts = lines[idx].split(": ")
        words.push(parts[0])
        definitions.push(parts[1])
    }
    res.end(JSON.stringify({ words, definitions }));
});


app.listen(3000, () => {
    console.log("Server listening on port 3000!");
})
