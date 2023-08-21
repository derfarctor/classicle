# Replace all j with i
import json
import sys

filename = sys.argv[1]
find_proper = "dictscrape1.txt"
with open(filename, "r", encoding="utf-8") as infile:
    main_words = json.load(infile)


proper = []
with open(find_proper, "r", encoding="utf-8") as infile:
    count = 0
    for line in infile:
        count += 1
        if count%3 == 0:
            parts = line.split("/")
            words = parts[-1].split("-")
            for word in words:
                if word[0].isupper() and word[0].lower() + word[1:] in main_words:
                    removed = main_words.pop(word[0].lower() + word[1:].strip())
                    print("Removed info: " + str(removed))

filename = filename.split(".")
with open(filename[0]+"-nopn.json", "w", encoding="utf-8") as outfile:
    outfile.write(json.dumps(main_words))
