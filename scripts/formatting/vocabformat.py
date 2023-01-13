import sys

filename = sys.argv[1]
with open("latinwords.txt", "w", encoding="utf-8") as outfile:
    with open(filename) as file:
        single_words = []
        joined_words = []
        for line in file:
            parts = line.split(":")
            for part in parts:
                if part == parts[-1]:
                    break
                if sum([1 for chr in part.strip() if not chr.isalpha()]) > 0:
                    joined_words.append(part.strip())
                else:
                    outfile.write(part.strip() + ":" + parts[-1])
                    single_words.append(part.strip())
