import sys
filename = sys.argv[1]
numbers = "0987654321"
with open(filename[3:], "w", encoding='utf-8') as outfile:
    with open(filename, 'r', encoding='utf-8') as infile:
        for line in infile:
            if line.strip():
                if line[-2].isdigit():
                    for num in numbers:
                        line = line.replace(str(num), "")
                    line = line.rstrip() + "\n"
            outfile.write(line)
