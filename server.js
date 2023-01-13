const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
    console.log("Server listening on port 3000!");
})

app.get('/styles.css', function (req, res) {
    res.sendFile(__dirname + "/styles.css");
});

app.get('/today/polygon.png', function (req, res) {
    res.sendFile(__dirname + "/today/polygon.png");
});