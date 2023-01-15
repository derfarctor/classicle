site_url = window.location.href;
window.post = function (url, data) {
    return fetch(site_url + url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

window.get = function (url) {
    return fetch(site_url + url);
}

var common_words = ["et", "in", "hic", "haec", "hoc", "nec", "neque", "si", "a", "ab", "abs", "aut", "non", "tum", "iam", "nunc", "um", "cum", "sic", "sub", "sed", "e", "ex", "at", "ast", "ut", "inter", "de", "o", "atque", "ac", "haud", "alius", "alii", "ud", "totus", "hinc", "quis", "qua", "quae", "quid", "quod", "dum", "is", "ea", "id", "eius", "ante", "ubi", "suus", "simul", "interea", "idem", "eadem", "idem", "contra", "huc", "pro", "longe", "tot", "cunctus", "circum", "namque", "tandem", "etiam", "nam", "quondam", "super", "enim", "ne", "ergo", "inque", ""];
var hidden_words = {};
var answer = 0;

window.onload = async function () {
    var today_req = await get("/today/redactus.txt");
    var today_obj = await today_req.json();
    answer = today_obj.answer;
    var redactus = document.getElementById("redactus");
    for (p_idx in today_obj.paragraphs) {
        var redactus_text = "";
        var words = today_obj.paragraphs[p_idx].split(" ");
        console.log("Num words: " + String(words.length));
        for (w_idx in words) {
            var word = "";
            for (l_idx in words[w_idx]) {
                var char = words[w_idx][l_idx];
                if (char.match(/[a-z]/i)) {
                    word += char;
                }
            }
            if (common_words.includes(word)) {
                redactus_text += words[w_idx] + " ";
            } else {
                if (word.slice(word.length - 3) == "que") {
                    words[w_idx] = words[w_idx].replace("que", "***");
                    console.log(words[w_idx]);
                }
                var to_add = "";
                for (l_idx in words[w_idx]) {
                    var char = words[w_idx][l_idx];
                    if (char.match(/[a-z]/i)) {
                        to_add += "█";
                    } else {
                        to_add += char;
                    }
                }
                if (to_add != to_add.replace("***", "que")) {
                    console.log(to_add);
                }
                to_add = to_add.replace("***", "que");
                redactus_text += to_add + " ";
            }
        }
        console.log(redactus_text.length);
        redactus.innerText += redactus_text + "\n";
    }
    console.log(today_obj);
}
