
from PIL import Image

# Load image
img = Image.open('C:/Users/Diya Gupta/.gemini/antigravity/brain/b87baaa7-37bf-4903-8aae-824e57154944/.user_uploaded/media_1787058876624.jpg').convert('RGB')
pixels = img.load()

bg_color = pixels[0, 0]
tolerance = 30

for x in range(img.width):
    for y in range(img.height):
        r, g, b = pixels[x, y]
        br, bg, bb = bg_color
        if abs(r - br) < tolerance and abs(g - bg) < tolerance and abs(b - bb) < tolerance:
            pixels[x, y] = (10, 11, 10)

img.save('public/brand/wehack-logo.webp')
print('Image processed successfully!')

