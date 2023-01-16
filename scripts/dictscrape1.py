import requests
from bs4 import BeautifulSoup

letters = "abcdefghijklmnopqrstuvwxyz"
base_url = "http://www.latin-dictionary.net/list/letter/"
print()


# NOTE: Certain definitions include ", undeclined" which must be handled separately and not treated as a word.
with open("dictscrape1.txt", "w", encoding="utf-8") as outfile:
    for letter in letters:
        print(f"Starting scrape of letter {letter}")
        page = requests.get(base_url + letter)
        soup = BeautifulSoup(page.content, "html.parser")
        word_num = 0
        result = soup.find(id="word-0")
        while result:
            definition_url = result.a["href"]
            word_type = result.contents[1].strip()
            words = result.a.text.strip()
            outfile.write(words + "\n" + word_type +
                          "\n" + definition_url + "\n")
            word_num += 1
            result = soup.find(id=f"word-{word_num}")
