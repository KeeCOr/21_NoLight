from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import math
import random


OUT = Path(__file__).resolve().parents[1] / "assets" / "generated"
INK = (5, 7, 11, 255)
INK_SOFT = (20, 19, 17, 210)
PAPER = (244, 239, 227, 245)
PAPER_SOFT = (216, 208, 191, 160)


def canvas(size):
    return Image.new("RGBA", size, (0, 0, 0, 0))


def dry_line(draw, points, fill, width):
    for jitter in range(4):
        j = []
        for x, y in points:
            j.append((x + random.randint(-2, 2), y + random.randint(-2, 2)))
        draw.line(j, fill=fill, width=max(1, width - jitter * 2), joint="curve")


def save(img, name):
    OUT.mkdir(parents=True, exist_ok=True)
    img.save(OUT / name)


def absorber_char():
    random.seed(21)
    img = canvas((128, 168))
    d = ImageDraw.Draw(img)

    for i in range(18):
        x = 64 + random.randint(-34, 34)
        y = 78 + random.randint(-48, 58)
        rx = random.randint(10, 28)
        ry = random.randint(20, 48)
        d.ellipse((x - rx, y - ry, x + rx, y + ry), fill=(5, 7, 11, random.randint(18, 44)))

    cloak = [(61, 8), (84, 28), (91, 77), (116, 138), (77, 129), (64, 164), (49, 130), (15, 143), (38, 78), (41, 28)]
    d.polygon(cloak, fill=INK)
    d.polygon([(48, 18), (77, 20), (82, 55), (72, 101), (53, 101), (43, 58)], fill=(17, 16, 14, 245))
    d.ellipse((45, 8, 80, 42), fill=INK)
    d.rectangle((50, 36, 76, 68), fill=INK)

    d.ellipse((53, 24, 59, 29), fill=PAPER)
    d.ellipse((67, 24, 73, 29), fill=PAPER)
    dry_line(d, [(64, 50), (58, 67), (65, 83), (60, 100)], PAPER, 2)
    dry_line(d, [(65, 55), (75, 73), (72, 96)], PAPER_SOFT, 2)
    dry_line(d, [(41, 54), (18, 88), (9, 121)], INK, 9)
    dry_line(d, [(84, 55), (110, 87), (123, 119)], INK, 9)
    dry_line(d, [(46, 113), (34, 160)], INK, 10)
    dry_line(d, [(76, 113), (90, 160)], INK, 10)
    dry_line(d, [(29, 141), (60, 128), (99, 143)], (244, 239, 227, 48), 3)
    return img.filter(ImageFilter.GaussianBlur(0.15))


def top_light():
    random.seed(22)
    img = canvas((192, 384))
    d = ImageDraw.Draw(img)
    for i in range(14):
        x = 96 + random.randint(-36, 36)
        width = random.randint(8, 34)
        alpha = random.randint(54, 126)
        d.polygon([(x, 0), (x + width, 0), (x + random.randint(-26, 22), 350), (x - width, 350)], fill=(244, 239, 227, alpha))
    dry_line(d, [(38, 0), (72, 86), (58, 185), (92, 362)], PAPER, 5)
    dry_line(d, [(140, 0), (113, 102), (132, 209), (101, 368)], PAPER_SOFT, 4)
    for i in range(18):
        x = random.randint(26, 166)
        y = random.randint(20, 360)
        d.ellipse((x - 2, y - 5, x + 2, y + 5), fill=(244, 239, 227, random.randint(80, 170)))
    return img.filter(ImageFilter.GaussianBlur(0.25))


def bottom_light():
    random.seed(23)
    img = canvas((192, 384))
    d = ImageDraw.Draw(img)
    for i in range(16):
        x = 96 + random.randint(-46, 46)
        width = random.randint(10, 42)
        top = random.randint(20, 70)
        d.polygon([(x - width, 384), (x + width, 384), (x + random.randint(-24, 24), top)], fill=(244, 239, 227, random.randint(42, 118)))
    dry_line(d, [(52, 382), (80, 296), (69, 180), (101, 42)], PAPER, 5)
    dry_line(d, [(135, 382), (111, 280), (126, 174), (94, 32)], PAPER_SOFT, 4)
    for i in range(22):
        x = random.randint(20, 172)
        y = random.randint(60, 376)
        d.ellipse((x - 2, y - 7, x + 2, y + 7), fill=(244, 239, 227, random.randint(70, 155)))
    return img.filter(ImageFilter.GaussianBlur(0.25))


def absorb_trail():
    random.seed(24)
    img = canvas((320, 180))
    d = ImageDraw.Draw(img)
    dry_line(d, [(17, 106), (80, 72), (149, 65), (239, 49), (303, 25)], INK, 22)
    dry_line(d, [(25, 124), (91, 104), (161, 91), (258, 80), (314, 57)], (5, 7, 11, 160), 11)
    dry_line(d, [(57, 92), (132, 73), (218, 57), (291, 30)], PAPER_SOFT, 4)
    for i in range(28):
        x = random.randint(16, 286)
        y = int(112 - x * 0.23 + random.randint(-26, 28))
        r = random.randint(2, 8)
        d.ellipse((x - r, y - r, x + r, y + r), fill=(5, 7, 11, random.randint(90, 220)))
    return img.filter(ImageFilter.GaussianBlur(0.18))


def absorb_aura():
    random.seed(25)
    img = canvas((256, 256))
    d = ImageDraw.Draw(img)
    cx, cy = 128, 128
    for i in range(4):
        box = (28 + i * 7, 28 + i * 9, 228 - i * 6, 228 - i * 8)
        d.arc(box, start=18 + i * 22, end=316 - i * 13, fill=(5, 7, 11, 190 - i * 26), width=9 - i)
        d.arc((box[0] + 8, box[1] + 8, box[2] - 8, box[3] - 8), start=208, end=520, fill=(244, 239, 227, 120 - i * 18), width=3)
    for i in range(18):
        angle = i * math.pi * 2 / 18 + random.uniform(-0.08, 0.08)
        r1 = random.randint(25, 62)
        r2 = random.randint(78, 118)
        p1 = (cx + math.cos(angle) * r1, cy + math.sin(angle) * r1)
        p2 = (cx + math.cos(angle) * r2, cy + math.sin(angle) * r2)
        d.line((p1, p2), fill=(244, 239, 227, random.randint(76, 168)), width=random.randint(1, 3))
    d.ellipse((104, 104, 152, 152), outline=(244, 239, 227, 170), width=3)
    return img.filter(ImageFilter.GaussianBlur(0.2))


def main():
    save(absorber_char().resize((58, 74), Image.Resampling.LANCZOS), "absorber-char.png")
    save(top_light(), "light-shard-top.png")
    save(bottom_light(), "light-shard-bottom.png")
    save(absorb_trail(), "absorb-trail.png")
    save(absorb_aura(), "absorb-aura.png")


if __name__ == "__main__":
    main()
