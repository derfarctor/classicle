import sys
import os
import random
from datetime import datetime
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import math

resources_dir = sys.argv[1]
today_dir = sys.argv[2]
previous_dir = sys.argv[3]
words = []
long_words = []


def is_sub_word(word, long_word, min_length):
    if len(word) > len(long_word) or len(word) < min_length or word == long_word:
        return False
    for letter in word:
        if letter not in long_word:
            return False
        else:
            long_word = long_word.replace(letter, "")
    return True


def polygon(sides, radius=1, rotation=0, translation=None):
    one_segment = math.pi * 2 / sides
    points = [
        (math.sin(one_segment * i + rotation) * radius,
         math.cos(one_segment * i + rotation) * radius)
        for i in range(sides)]
    if translation:
        points = [tuple([sum(pair) for pair in zip(point, translation)])
                  for point in points]
    return points


def generate_polygon(min_length=3):
    with open(os.path.join(resources_dir, "latinwords.txt")) as file:
        for line in file:
            parts = line.split(":")
            words.append(parts[0])
            if len(parts[0]) > 6 and len(parts[0]) < 9:
                long_words.append(parts[0])
    most_frequent = [0, ""]
    while most_frequent[0] < 13:
        random_long = random.choice(long_words)
        sub_words = [word for word in words if is_sub_word(
            word, random_long, min_length)]
        for letter in random_long:
            current = [0, letter]
            for word in sub_words:
                if letter in word:
                    current[0] += 1
            if current[0] > most_frequent[0]:
                most_frequent = current
    sub_words = [word for word in sub_words if most_frequent[1] in word]
    random.shuffle(sub_words)
    sub_words.sort(key=lambda s: len(s), reverse=True)
    with open(os.path.join(today_dir, "polygon.txt"), "w", encoding="utf-8") as file:
        file.write(most_frequent[1] + "\n")
        file.write(random_long + "\n")
        for word in sub_words:
            file.write(word)
            if word != sub_words[-1]:
                file.write("\n")
    now = datetime.now()
    previous_polygon_name = f"polygon-{now.day}-{now.month}-{now.year}"
    with open(os.path.join(previous_dir, previous_polygon_name+".txt"), "w", encoding="utf-8") as file:
        file.write(most_frequent[1] + "\n")
        file.write(random_long + "\n")
        for word in sub_words:
            file.write(word)
            if word != sub_words[-1]:
                file.write("\n")
    sides = len(random_long) - 1
    size = 512
    img = Image.new("RGBA", (size, size))
    draw = ImageDraw.Draw(img)
    outer = polygon(sides, size/2 - 4*2, 0, [size/2, size/2])
    outer.append(outer[0])
    draw.line(outer, fill=None, width=4)
    inner = polygon(sides, size/4 * 3/4, 0, [size/2, size/2])
    inner.append(inner[0])
    draw.polygon(inner, fill="white")
    midpts = []
    for i in range(sides):
        points = [outer[i], inner[i]]
        draw.line(points, width=4)
        midpts.append(((outer[i][0] + inner[i][0])/2,
                       (outer[i][1] + inner[i][1])/2))
    letter_points = [((midpts[0][0] + midpts[-1][0])/2,
                      (midpts[0][1] + midpts[-1][1])/2)]
    for i in range(len(midpts) - 1):
        letter_points.append(((midpts[i][0] + midpts[i+1][0])/2,
                              (midpts[i][1] + midpts[i+1][1])/2))
    outer_letters = list(
        random_long.replace(most_frequent[1], "", 1))
    random.shuffle(outer_letters)
    font = ImageFont.truetype(os.path.join(
        resources_dir, "robotomono.ttf"), int(size/6))
    for i in range(len(outer_letters)):
        l, t, r, b = font.getbbox(outer_letters[i])
        letter_points[i] = (letter_points[i][0],
                            letter_points[i][1] + b/2)
        draw.text(letter_points[i], outer_letters[i], anchor="md", font=font)
    l, t, r, b = font.getbbox(most_frequent[1])
    draw.text((size/2, size/2+b/2),
              most_frequent[1], anchor="md", font=font, fill="#121213")
    img.save(os.path.join(today_dir, "polygon.png"))
    img.save(os.path.join(previous_dir, previous_polygon_name+".png"))
    print("Saved")


generate_polygon(3)
