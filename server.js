const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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

app.get('/polygon', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var words = fs.readFileSync("./today/polygon.txt").toString().split("\r\n").slice(1);
    res.end(JSON.stringify({ words: words }));
});

app.listen(3000, () => {
    console.log("Server listening on port 3000!");
})
