const site_url = "https://classicle.games/"

window.post = function (url, data) {
    return fetch(site_url + url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

window.get = function (url) {
    return fetch(site_url + url);
}

var polygon_words = [];
var found_words = [];
var must_include = "";
var message_num = 0;
window.onload = async function () {
    var words_request = await get("polygon");
    var words_obj = await words_request.json();
    must_include = words_obj.must_include;
    polygon_words = words_obj.words;
    var message = document.getElementById("message");
    var foundwords = document.getElementById("foundwords");
    var scoreguide = document.getElementById("scoreguide");
    var len = polygon_words.length;
    scoreguide.innerText = `\nOk - ${Math.floor(len / 4)} words\nGood - ${Math.floor(len / 2.2)} words\nExcellent - ${Math.floor(len / 1.5)}\nPossible - ${len}`;
    scoreguide.innerHTML = "<strong>Score guide</strong>" + scoreguide.innerHTML;
    var form = document.getElementById("polygonform");
    async function checkAnswer(event) {
        event.preventDefault();
        var form_data = new FormData(form);
        var word = form_data.get("word");
        if (message.classList.contains("fade-out")) {
            message.classList.remove("fade-out");
            message.classList.add("not-fade");
        }
        message_num++;
        if (!word.includes(must_include)) {
            message.innerText = `The word must include the center letter '${must_include}'!`;
            message.style.color = "red";
        } else if (polygon_words.includes(word) && !found_words.includes(word)) {
            found_words.push(word);
            if (foundwords.innerText != "Found words:") {
                console.log(foundwords.innerText);
                foundwords.innerText += ",";
            }
            foundwords.innerText += " " + word;
            if (word == polygon_words[0]) {
                message.style.color = "gold";
                message.innerText = "Congratulations you found the longest word!";
            } else {
                message.style.color = "green";
                message.innerText = "Well done!";
            }

        } else {
            if (found_words.includes(word)) {
                message.style.color = "orange";
                message.innerText = "That word was already found!";
            } else {
                message.style.color = "red";
                message.innerText = "Nope!";
            }
        }
        message.offsetHeight;
        message.classList.remove("not-fade");
        message.classList.add("fade-out");
        var current_num = message_num;
        setTimeout(() => { if (current_num == message_num) { message.innerText = ""; } }, 5000, current_num);
        form.reset();
    }
    form.onsubmit = checkAnswer;
};

