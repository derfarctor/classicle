import sys
import os
import random
import json

resources_dir = sys.argv[1]
samples_dir = sys.argv[2]

all_words = {}
long_words = {}

# latinwordlist-singinf.json - singular nouns, infinitives only, no comparatives or superlatives
# latinwordlist-sing.json - singular nouns, no comparatives or superlatives
# latinwordlist.json - everything
WORD_LIST = "latinwordlist-sing.json"

min_sub_words = 15
max_sub_words = 40


# Directly reflected in client.js, must be kept up to date.
long_and_min_lengths = {7: 3, 8: 4, 9: 4}

sub_frequencies = ["Frequent, top 2000+ words", "Very frequent, in all Elementry Latin books, top 1000+ words",
                   "2 or 3 citations", "For Dictionary, in top 10,000 words", "For Dictionary, in top 20,000 words"]
long_frequencies = ["Frequent, top 2000+ words", "Very frequent, in all Elementry Latin books, top 1000+ words",
                    "For Dictionary, in top 10,000 words"]


def is_sub_word(word, long_word, all_words):
    if len([1 for entry in all_words[word] if entry["frequency"] in sub_frequencies]) == 0:
        return False
    if len(word) > len(long_word) or len(word) < long_and_min_lengths[len(long_word)] or word == long_word:
        return False
    for letter in word:
        if letter not in long_word:
            return False
        else:
            long_word = long_word.replace(letter, "", 1)
    return True


def generate_polygon(name):
    long_word_length = long_and_min_lengths
    with open(os.path.join(resources_dir, WORD_LIST)) as file:
        all_words = json.load(file)
        for word in all_words:
            if len(word) in long_word_length:
                long_words[word] = all_words[word]
    most_frequent = [0, ""]
    while most_frequent[0] < min_sub_words:
        random_long = random.choice(list(long_words.keys()))
        if len([1 for entry in long_words[random_long] if entry["frequency"] in long_frequencies]) == 0:
            continue
        sub_words = [word for word in all_words if is_sub_word(
            word, random_long, all_words)]
        for letter in random_long:
            current = [0, letter]
            for word in sub_words:
                if letter in word:
                    current[0] += 1
            if current[0] > most_frequent[0]:
                most_frequent = current
        if most_frequent[0] > max_sub_words:
            most_frequent[0] = 0
    sub_words = [word for word in sub_words if most_frequent[1] in word]
    random.shuffle(sub_words)
    sub_words.sort(key=lambda s: len(s), reverse=True)
    with open(os.path.join(samples_dir, name), "w", encoding="utf-8") as file:
        file.write(most_frequent[1] + "\n")
        file.write(random_long +
                   "\n")
        for word in sub_words:
            file.write(
                word)
            if word != sub_words[-1]:
                file.write("\n")


for i in range(100):
    generate_polygon(f"sample-{i}.txt")
