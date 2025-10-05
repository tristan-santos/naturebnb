import numpy as np
import cv2
import imageio
from PIL import Image, ImageDraw, ImageFont
import os

# --- Settings ---
DURATION = 5   # seconds
FPS = 30
WIDTH, HEIGHT = 500, 500
LOGO_PATH = "tapndine_logo.png"  # Place your logo file in same folder
SLOGAN = "Your meal, just a tap away."
FONT_PATH = None  # Set to a .ttf font file path if you want custom font

def add_logo_and_text(frame_bgr):
    # Convert to PIL for easier text and logo overlay
    frame = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGBA)
    pil_img = Image.fromarray(frame)
    draw = ImageDraw.Draw(pil_img)

    # Add logo
    if os.path.exists(LOGO_PATH):
        logo = Image.open(LOGO_PATH).convert("RGBA")
        logo.thumbnail((180, 180), Image.LANCZOS)
        lx = (WIDTH - logo.width) // 2
        ly = (HEIGHT - logo.height) // 2
        pil_img.alpha_composite(logo, (lx, ly))

    # Add slogan text
    font_size = 32
    try:
        font = ImageFont.truetype(FONT_PATH or "arial.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()
    # Use textbbox for Pillow >=8.0.0, fallback to textsize for older versions
    try:
        bbox = draw.textbbox((0, 0), SLOGAN, font=font)
        text_w, text_h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    except AttributeError:
        text_w, text_h = draw.textsize(SLOGAN, font=font)
    tx = (WIDTH - text_w) // 2
    ty = HEIGHT - 70
    draw.text((tx, ty), SLOGAN, font=font, fill=(0,0,0,255))

    return np.array(pil_img.convert("RGB"))

def make_frame(angle_offset):
    img = np.ones((HEIGHT, WIDTH, 3), dtype=np.uint8) * 255  # white bg
    center = (WIDTH//2, HEIGHT//2)
    radius = 180
    thickness = 10
    num_dashes = 40
    colors = [(246,106,71), (77,162,127)]  # #F66A47 and #4DA27F
    for i in range(num_dashes):
        start_angle = (i * (360/num_dashes) + angle_offset) % 360
        end_angle = start_angle + 6
        color = colors[i % len(colors)]  # alternate colors
        cv2.ellipse(img, center, (radius, radius), 0, start_angle, end_angle, color, thickness)
    return img

frames = []
total_frames = DURATION * FPS
for f in range(total_frames):
    t = f / FPS
    angle_offset = int((t / DURATION) * 360)
    frame = make_frame(angle_offset)
    frame = add_logo_and_text(frame)
    frames.append(frame)

# Save GIF (HQ)
print("Exporting GIF HQ...")
imageio.mimsave("TapNDine_Loading_HQ.gif", frames, fps=15)

# Save GIF (Optimized)
print("Exporting GIF Optimized...")
imageio.mimsave("TapNDine_Loading_Optimized.gif", frames[::4], fps=8)

# Save MP4
print("Exporting MP4...")
imageio.mimsave("TapNDine_Loading.mp4", frames, fps=FPS)

print("✅ All files exported successfully!")
