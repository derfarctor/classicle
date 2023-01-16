import json

types = {}
frequencies = {}
with open("latinwordlist.json", "r", encoding="utf-8") as infile:
    main_words = json.load(infile)
    for word in main_words:
        for entry in main_words[word]:
            if entry["type"] not in types:
                types[entry["type"]] = 1
            else:
                types[entry["type"]] += 1
            if entry["frequency"] not in frequencies:
                frequencies[entry["frequency"]] = 1
            else:
                frequencies[entry["frequency"]] += 1

print("Word types")
for type in types:
    print(f"{type}: {types[type]}")
print("\nWord frequencies")
for freq in frequencies:
    print(f"{freq}: {frequencies[freq]}")
