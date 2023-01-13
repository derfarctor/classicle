for i in range(12):
    filename = "book" + str(i+1) + ".txt"
    print(filename)
    with open(filename, "r", encoding="utf-8") as file:
        out = ""
        for line in file:
            for char in line:
                if char.lower() not in "abcdefghijklmnopqrstuvwxyz(),.;:''""-[]_?!\\\n ":
                    out += char + ","
        print(out)
