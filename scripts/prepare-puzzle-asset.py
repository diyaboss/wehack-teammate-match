#!/usr/bin/env python3

from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFont


MARKER = b"FC4_PAYLOAD::"
CIPHER_LINES = (
    "GA.__ K___.ALM .._.JC..._P_..__HZS__.GB",
    "_..._GST_.__ GA KA..__FQA__.__GC._._MF",
    "T_..G___.KE",
)
CLUE_LINES = (
    "The sea appears uniform until one ripple breaks its nature.",
    "Ignore the wave. Study its essence.",
    "Stars reveal themselves by the strength of their signal.",
    "Constellations exist only when every star claims its rightful place.",
    "The outlier unlocks the cipher above.",
    "The cipher unlocks the key beyond.",
)


def draw_colored_line(
    draw: ImageDraw.ImageDraw,
    text: str,
    center_x: float,
    y: int,
    font: ImageFont.FreeTypeFont,
) -> None:
    widths = [draw.textlength(char, font=font) for char in text]
    x = center_x - sum(widths) / 2

    for char, width in zip(text, widths):
        color = "#53c7ff" if char in "._" else "#f5f7ff"
        draw.text(
            (x, y),
            char,
            font=font,
            fill=color,
            stroke_width=1,
            stroke_fill="#111826",
        )
        x += width


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit(
            "Usage: prepare-puzzle-asset.py BASE_PNG EXTRACTED_TEXT OUTPUT_PNG"
        )

    base_path, extracted_path, output_path = map(Path, sys.argv[1:])
    image = Image.open(base_path).convert("RGB")
    draw = ImageDraw.Draw(image)

    draw.rectangle((0, 0, image.width, 105), fill="#000")
    draw.rectangle((0, image.height - 105, image.width, image.height), fill="#000")
    draw.rectangle((0, 0, 112, image.height), fill="#000")
    draw.rectangle((image.width - 112, 0, image.width, image.height), fill="#000")
    draw.rectangle((115, 130, image.width - 115, 310), fill="#000")
    font = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 29
    )

    for line, y in zip(CIPHER_LINES, (154, 206, 258)):
        draw_colored_line(draw, line, image.width / 2, y, font)

    extracted = extracted_path.read_text(encoding="utf-8")
    separator = "The cipher unlocks the key beyond."
    if separator not in extracted:
        raise SystemExit("Could not find the hidden-text separator.")

    hidden_text = "".join(
        char
        for char in extracted.split(separator, 1)[1].upper()
        if char.isalpha()
    )
    if len(hidden_text) != 6800:
        raise SystemExit(
            f"Expected 6,800 hidden letters, found {len(hidden_text):,}."
        )

    combined_payload = (
        "\n".join(CIPHER_LINES) + "\n\n" +
        "\n".join(CLUE_LINES) + "\n\n" +
        hidden_text
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path, "PNG", optimize=True)
    with output_path.open("ab") as output:
        output.write(MARKER)
        output.write(combined_payload.encode("ascii"))

    desktop_path = output_path.with_name("puzzle-bg-desktop.png")
    desktop = Image.new("RGB", (1920, 1080), "#000")
    desktop_draw = ImageDraw.Draw(desktop)
    mono_font = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 34
    )
    clue_font = ImageFont.truetype(
        "/usr/share/fonts/opentype/urw-base35/Z003-MediumItalic.otf", 38
    )

    for line, y in zip(CIPHER_LINES, (102, 158, 214)):
        draw_colored_line(desktop_draw, line, 960, y, mono_font)

    desktop_draw.ellipse((938, 300, 982, 344), fill="#ffae21")
    desktop_draw.ellipse((949, 313, 953, 317), fill="#171717")
    desktop_draw.ellipse((967, 313, 971, 317), fill="#171717")
    desktop_draw.arc((949, 313, 971, 334), 20, 160, fill="#171717", width=2)

    for line, y in zip(CLUE_LINES, (412, 474, 536, 598, 680, 742)):
        box = desktop_draw.textbbox((0, 0), line, font=clue_font)
        width = box[2] - box[0]
        desktop_draw.text(
            ((1920 - width) / 2, y),
            line,
            font=clue_font,
            fill="#f5f5f5",
        )

    desktop.save(desktop_path, "PNG", optimize=True)
    with desktop_path.open("ab") as output:
        output.write(MARKER)
        output.write(combined_payload.encode("ascii"))

    print(
        f"Wrote {output_path} and {desktop_path} "
        f"with {len(hidden_text):,} hidden letters."
    )


if __name__ == "__main__":
    main()
