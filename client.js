const site_url = "http://127.0.0.1:3000/"

window.post = function (url, data) {
    return fetch(site_url + url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

window.get = function (url) {
    return fetch(site_url + url);
}

var polygon_words = [];
window.onload = async function () {
    words_request = await get("polygon");
    words_obj = await words_request.json();
    polygon_words = words_obj.words;
    polygon_list = document.getElementById("polygonwords");
    for (idx in polygon_words) {
        var list_item = document.createElement("li");
        list_item.id = idx;
        polygon_list.appendChild(list_item);
    }
    console.log(polygon_words)
    var form = document.getElementById("polygonform");
    async function checkAnswer(event) {
        event.preventDefault();
        var form_data = new FormData(form);
        var word = form_data.get("word");
        if (polygon_words.includes(word)) {
            list_item = document.getElementById(polygon_words.indexOf(word));
            list_item.innerText = word;
        } else {
            console.log("No")
        }
        form.reset();
    }
    form.onsubmit = checkAnswer;
};

