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
var dictionary = new Map();

async function load_yesterdays_puzzle() {
    var yesterday_request = await get("previous/polygon.txt");
    var yesterday_obj = await yesterday_request.json();
    var yesterday_words = yesterday_obj.words;
    for (idx in yesterday_words) {
        dictionary.set(yesterday_words[idx], yesterday_obj.definitions[idx]);
    }
    var yesterday_list = document.getElementById("yesterdaywords");
    var yesterday_found = JSON.parse(window.localStorage.getItem("yesterdayfound"));
    for (idx in yesterday_words) {
        var list_item = document.createElement("li");
        if (yesterday_found) {
            if (yesterday_found.includes(yesterday_words[idx])) {
                list_item.innerHTML = `<span title="${dictionary.get(yesterday_words[idx])}" ontouchstart="show_def(this)" style="color:green">${yesterday_words[idx]}</span>`;
            }
        }
        if (!list_item.innerHTML) {
            list_item.innerHTML = `<span title="${dictionary.get(yesterday_words[idx])}" ontouchstart="show_def(this)">${yesterday_words[idx]}</span>`;
        }
        yesterday_list.appendChild(list_item);
    }
}

async function load_found_words() {
    if (window.localStorage.getItem("found")) {
        found_words = JSON.parse(localStorage.getItem("found"));
    }
    if (!polygon_words.includes(found_words[0]) && found_words.length > 0) {
        found_words = [];
        yesterday_found_words = JSON.parse(window.localStorage.getItem("found"));
        window.localStorage.setItem("yesterdayfound", JSON.stringify(yesterday_found_words));
        window.localStorage.removeItem("found");
    }
    var foundwords = document.getElementById("foundwords");
    for (idx in found_words) {
        if (found_words[idx] == polygon_words[0]) {
            foundwords.innerHTML += `<span title="${dictionary.get(found_words[idx])}" ontouchstart="show_def(this)" style="color:gold"> ${found_words[idx]}</span>`;
        } else {
            foundwords.innerHTML += `<span title="${dictionary.get(found_words[idx])}" ontouchstart="show_def(this)"> ${found_words[idx]}</span>`;
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

async function show_def(x) {
    var definition = `${x.innerText.trim()}\n\n${dictionary.get(x.innerText.trim())}`;
    alert(definition);
}

window.onload = async function () {
    var today_request = await get("today/polygon.txt");
    var today_obj = await today_request.json();
    must_include = today_obj.must_include;
    polygon_words = today_obj.words;
    for (idx in polygon_words) {
        dictionary.set(polygon_words[idx], today_obj.definitions[idx]);
    }
    await load_found_words();
    await load_score_guide();
    var message = document.getElementById("message");
    var form = document.getElementById("polygonform");
    var foundwords = document.getElementById("foundwords");
    async function checkAnswer(event) {
        event.preventDefault();
        var form_data = new FormData(form);
        var word = form_data.get("word").toLowerCase().trim();
        if (message.classList.contains("fade-out")) {
            message.classList.remove("fade-out");
            message.classList.add("not-fade");
        }
        message_num++;
        if (!word.includes(must_include)) {
            message.innerText = `'${must_include}' must be included!`;
            message.style.color = "red";
        } else if (polygon_words.includes(word) && !found_words.includes(word)) {
            found_words.push(word);
            if (foundwords.innerText != "Found words:") {
                foundwords.innerHTML += ",";
            }
            if (word == polygon_words[0]) {
                message.style.color = "gold";
                message.innerText = "Congratulations you found the longest word!";
                foundwords.innerHTML += `<span title="${dictionary.get(word)}" ontouchstart="show_def(this)" style="color:gold"> ${word}</span>`;
            } else {
                message.style.color = "green";
                message.innerText = "Well done!";
                foundwords.innerHTML += `<span title="${dictionary.get(word)}" ontouchstart="show_def(this)"> ${word}</span>`;
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

