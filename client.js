const site_url = window.location.href;
window.post = function (url, data) {
    return fetch(site_url + url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

window.get = function (url) {
    return fetch(site_url + url);
}

var polygon_words = [];
var found_words = [];
var yesterday_found_words = [];
var must_include = "";
var message_num = 0;

async function load_yesterdays_puzzle() {
    var words_request = await get("previous/polygon.txt");
    var words_obj = await words_request.json();
    var yesterday_words = words_obj.words;
    var yesterday_list = document.getElementById("yesterdaywords");
    var yesterday_found = JSON.parse(window.localStorage.getItem("yesterdayfound"));
    for (idx in yesterday_words) {
        var list_item = document.createElement("li");
        if (yesterday_found) {
            if (yesterday_found.includes(yesterday_words[idx])) {
                list_item.innerHTML = "<span style='color:green'>" + yesterday_words[idx] + "</span>";
            }
        }
        if (!list_item.innerHTML) {
            list_item.innerText = yesterday_words[idx];
        }
        yesterday_list.appendChild(list_item);
    }
}

async function load_found_words() {
    if (window.localStorage.getItem("found")) {
        found_words = JSON.parse(localStorage.getItem("found"));
    }
    if (!polygon_words.includes(found_words[0])) {
        found_words = [];
        yesterday_found_words = JSON.parse(window.localStorage.getItem("found"));
        window.localStorage.setItem("yesterdayfound", JSON.stringify(yesterday_found_words));
        window.localStorage.removeItem("found");
    }
    var foundwords = document.getElementById("foundwords");
    for (idx in found_words) {
        if (found_words[idx] == polygon_words[0]) {
            foundwords.innerHTML += "<span style='color:gold'> " + found_words[idx] + "</span>";
        } else {
            foundwords.innerHTML += " " + found_words[idx];
        }
        if (idx != found_words.length - 1) {
            foundwords.innerHTML += ",";
        }
    }
}

async function load_score_guide() {
    var scoreguide = document.getElementById("scoreguide");
    var len = polygon_words.length;
    scoreguide.innerText = `\nOk - ${Math.floor(len / 4)} words\nGood - ${Math.floor(len / 2)} words\nExcellent - ${Math.floor(len / 1.5)} words\nAurelius tier - ${Math.floor(len / 1.2)} words`;
    scoreguide.innerHTML = "<strong>Score guide</strong>" + scoreguide.innerHTML;
}

window.onload = async function () {
    var words_request = await get("today/polygon.txt");
    var words_obj = await words_request.json();
    must_include = words_obj.must_include;
    polygon_words = words_obj.words;
    await load_found_words();
    await load_score_guide();
    var message = document.getElementById("message");
    var form = document.getElementById("polygonform");
    var foundwords = document.getElementById("foundwords");
    async function checkAnswer(event) {
        event.preventDefault();
        var form_data = new FormData(form);
        var word = form_data.get("word").toLocaleLowerCase();
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
                foundwords.innerHTML += ",";
            }
            if (word == polygon_words[0]) {
                message.style.color = "gold";
                message.innerText = "Congratulations you found the longest word!";
                foundwords.innerHTML += "<span style='color:gold'> " + word + "</span>";
            } else {
                message.style.color = "green";
                message.innerText = "Well done!";
                foundwords.innerHTML += " " + word;
            }
            window.localStorage.setItem("found", JSON.stringify(found_words));
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
    await load_yesterdays_puzzle();
};

