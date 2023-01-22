# Replace all j with i
import json
import sys

filename = sys.argv[1]

with open(filename, "r", encoding="utf-8") as infile:
    main_words = json.load(infile)

filtered = {}
for word in main_words:
    if "j" in word:
        filtered[word.replace("j", "i")] = main_words[word]
    else:
        filtered[word] = main_words[word]

filename = filename.split(".")

with open(filename[0]+"-ji.json", "w", encoding="utf-8") as outfile:
    outfile.write(json.dumps(filtered))
