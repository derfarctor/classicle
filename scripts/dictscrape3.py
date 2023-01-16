import json

classical_words = {}
with open("dictscrape2-withfreq.json", "r", encoding="utf-8") as infile:
    main_words = json.load(infile)
    for word in main_words:
        for entry in main_words[word]:
            if entry["age"] == "In use throughout the ages/unknown":
                if word in classical_words:
                    if entry["type"] in [info["type"] for info in classical_words[word]]:
                        for current_entry in classical_words[word]:
                            if current_entry["type"] == entry["type"]:
                                if entry["translations"][0] not in current_entry["translations"]:
                                    current_entry["translations"] += entry["translations"]
                    else:
                        classical_words[word].append(entry)
                else:
                    classical_words[word] = [entry]
with open("latinwordlist.json", "w", encoding="utf-8") as outfile:
    outfile.write(json.dumps(classical_words))
