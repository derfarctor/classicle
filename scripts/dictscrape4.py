# Select only singular form for n, adj, adv and infinitive for verbs
import json

selected_words = {}
with open("latinwordlist.json", "r", encoding="utf-8") as infile:
    main_words = json.load(infile)


def scrape(words_raw, word_type):
    words = [word.lower().split("(")[0] for word in words_raw.split(
        ", ") if word.split("(")[0].isalpha() and word != "undeclined"]
    if not words:
        return
    if word_type in ["n", "adv"]:
        if words[0] in main_words:
            selected_words[words[0]] = main_words[words[0]]
    else:
        print(word_type)
        for word in words:
            if word in main_words:
                selected_words[word] = main_words[word]


with open("dictscrape1.txt", "r", encoding="utf-8") as infile:
    count = 1
    parts = []
    while True:
        line = infile.readline()
        parts.append(line.rstrip())
        if not line:
            break
        if count % 3 == 0:
            words = parts[0]
            word_type = parts[1]
            scrape(words, word_type)
            parts = []
        count += 1

with open("latinwordlist-selected.json", "w", encoding="utf-8") as outfile:
    outfile.write(json.dumps(selected_words))
