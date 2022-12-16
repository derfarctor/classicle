window.post = function (url, data) {
    return fetch("http://127.0.0.1:3000/" + url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

window.get = function (url) {
    return fetch("http://127.0.0.1:3000/" + url);
}

window.onload = async function () {
    var form = document.getElementById("answer");
    var question = document.getElementById("question");
    async function submitAnswer(event) {
        event.preventDefault();
        var form_data = new FormData(form);
        var response = await post("submit", { answer: form_data.get("answer") });
        var json = await response.json();
        if (json.success) {
            console.log(json);
        }
        var tries = document.getElementById("tries");
        if (json.tries > 10) {
            tries.innerText = "Tries: " + 10 + " (Maximum reached)";
        } else {
            tries.innerText = "Tries: " + json.tries;
        }
        form.reset();
    }
    form.onsubmit = submitAnswer;
    var response = await get("question");
    var json = await response.json();
    if (json.success) {
        question.innerText = json.question;
    } else {
        question.innerText = "Could not fetch the question due to error.";
    }
};




