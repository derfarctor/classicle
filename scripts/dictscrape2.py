import requests
import json
from bs4 import BeautifulSoup

main_words = {}

save_every = 1000


def scrape(words, word_type, url):
    words = [word.lower().split("(")[0] for word in words.split(
        ", ") if word.split("(")[0].isalpha() and word != "undeclined"]
    if not words:
        return
    word_info = {}
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    word_info["type"] = word_type
    definitions = soup.find(class_="definitions")
    if not definitions.ol:
        return
    word_info["translations"] = []
    for definition in definitions.ol.find_all("li"):
        word_info["translations"].append(definition.text)
    age_info = definitions.find(class_="age-info")
    word_info["age"] = age_info.find(class_="value").text
    frequency_info = definitions.find(class_="frequency-info")
    word_info["frequency"] = frequency_info.find(class_="value").text
    for word in words:
        if word in main_words:
            if word_info["type"] not in [info["type"] for info in main_words[word]]:
                main_words[word].append(word_info)
            else:
                if word_info["translations"] != next(info["translations"] for info in main_words[word] if info["type"] == word_type):
                    main_words[word].append(word_info)
        else:
            main_words[word] = [word_info]


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
            definition_url = parts[2]
            scrape(words, word_type, definition_url)
            parts = []
        count += 1
        if count % (save_every * 3) == 0:
            print(f"Entries: {count//3}. Saving...")
            with open("dictscrape2-withfreq.json", "w") as outfile:
                outfile.write(json.dumps(main_words))
with open("dictscrape2-withfreq.json", "w") as outfile:
    outfile.write(json.dumps(main_words))
