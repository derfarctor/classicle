const fs = require('fs');
const express = require("express");
const app = express();
var bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");
const { openai_secret } = require("./apikeys.json");
const configuration = new Configuration({
    apiKey: openai_secret,
});
const openai = new OpenAIApi(configuration);

var users = new Map();
var today = new Date().toLocaleDateString();
var daily_question = "What was the name of the Roman civil war that preceded the end of the Republic?";
const MAX_SCORE = 10;
const port = 3000;

// Create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('index.html').pipe(res);
});

app.get("/client.js", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    fs.createReadStream('client.js').pipe(res);
});

app.post("/submit", async function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    console.log(req.body);
    console.log(req.ip);
    var user = users.get(req.ip);
    if (!user) {
        user = { best_score: 0, answered: 0 };
        users.set(req.ip, user);
    } else {
        if (user.best_score != MAX_SCORE) {
            user.answered += 1;
            users.set(req.ip, user);
        }
    }
    if (user.answered < 10 && req.body.answer) {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `To identify if the answer to a question is correct.\n\nQ: When did Julius Caesar become dictator of Rome?\nA: 44 AD\nCorrect: no\n\nQ: When did Julius Caesar become dictator of Rome?\nA: 44 B.C.E\nCorrect: yes\n\nQ: Who was the Roman general who defeated Hannibal in the Second Punic War?\nA: Publius Cornelius Scipio\nCorrect: yes\n\nQ: Who was the first Roman emperor?\nA: Octavian\nCorrect: yes\n\nQ: Who was the first emperor of Rome?\nA: Augustus\nCorrect: yes\n\nQ: ${daily_question}\nA: ${req.body.answer}\nCorrect:`,
            temperature: 0,
            max_tokens: 1,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        console.log(`Question: ${daily_question}\nAnswer: ${req.body.answer}\nCorrect:${response.data.choices[0].text}/${MAX_SCORE}`);
        res.end(JSON.stringify(
            { success: true, tries: user.answered, response: response.data.choices[0].text }
        ));
        return;
    } else {
        res.end(JSON.stringify({ success: false, tries: user.answered }));
    }
});

app.get("/question", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(
        { success: true, question: daily_question }
    ));
});

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

function updateDay() {
    var current = new Date().toLocaleDateString();
    if (today == current) return;
    today = current;
    users = new Map();
}
setInterval(updateDay, 1000 * 60);