import sys

filename = sys.argv[1]

words = {}
with open(filename) as file:
    for line in file:
        parts = line.split(":")
        word = parts[0]
        if words.get(word):
            words[word].append(parts[1].strip())
        else:
            words[word] = [parts[1].strip()]

with open("latinwords.txt", "w", encoding="utf-8") as file:
    for word in words:
        total_def = " / ".join(words[word])
        out = word + ": " + total_def + "\n"
        file.write(out)
