import sys
import random
import os
from datetime import datetime

resources_dir = sys.argv[1]
today_dir = sys.argv[2]
previous_dir = sys.argv[3]

book_number = random.randint(1, 12)
paragraphs = []

number_paragraphs = 4
with open(os.path.join(resources_dir, f"aeneid/book{book_number}.txt"), "r", encoding="utf-8") as book:
    lines = []
    for line in book:
        lines.append(line)
        if line == "\n":
            paragraphs.append("".join(lines))
            lines = []
num_p = len(paragraphs)
start_p = random.randint(0, num_p-number_paragraphs)
end_p = start_p + number_paragraphs
with open(os.path.join(today_dir, "redactus.txt"), "w", encoding="utf-8") as file:
    file.write(str(book_number) + "\n")
    for p in paragraphs[start_p:end_p]:
        file.write(p)
now = datetime.now()
previous_redactus_name = f"redactus-{now.day}-{now.month}-{now.year}"
with open(os.path.join(previous_dir, previous_redactus_name+".txt"), "w", encoding="utf-8") as file:
    file.write(str(book_number) + "\n")
    for p in paragraphs[start_p:end_p]:
        file.write(p)
