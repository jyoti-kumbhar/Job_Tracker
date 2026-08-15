import os
import math
from PIL import Image, ImageDraw, ImageFilter

OUTPUT_DIR = r"G:\jyoti\development\job tracker\assets\images"
EXPO_ICON_DIR = r"G:\jyoti\development\job tracker\assets\expo.icon\Assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(EXPO_ICON_DIR, exist_ok=True)

def create_gradient(width, height, top_color, bottom_color):
    """Creates a smooth diagonal linear gradient."""
    base = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    top_r, top_g, top_b = top_color[:3]
    bot_r, bot_g, bot_b = bottom_color[:3]
    
    pixels = []
    for y in range(height):
        for x in range(width):
            factor = (x / width * 0.35) + (y / height * 0.65)
            r = int(top_r + (bot_r - top_r) * factor)
            g = int(top_g + (bot_g - top_g) * factor)
            b = int(top_b + (bot_b - top_b) * factor)
            pixels.append((r, g, b, 255))
    
    base.putdata(pixels)
    return base

def draw_job_tracker_emblem(draw, cx, cy, size, color=(255, 255, 255), is_monochrome=False):
    """
    Draws a sleek, modern Job Tracker emblem:
    A modern rounded briefcase silhouette merged with an upward career trajectory badge and rocket/arrow icon.
    """
    scale = size / 500.0
    
    # 1. Briefcase Handle
    handle_w = 160 * scale
    handle_h = 75 * scale
    handle_top = cy - 205 * scale
    handle_thickness = 28 * scale
    handle_radius = 20 * scale
    
    handle_rect = [cx - handle_w/2, handle_top, cx + handle_w/2, handle_top + handle_h]
    draw.rounded_rectangle(handle_rect, radius=int(handle_radius), outline=color, width=int(handle_thickness))
    
    # 2. Main Briefcase Body
    body_w = 390 * scale
    body_h = 280 * scale
    body_top = cy - 140 * scale
    body_rect = [cx - body_w/2, body_top, cx + body_w/2, body_top + body_h]
    body_radius = 48 * scale
    
    draw.rounded_rectangle(body_rect, radius=int(body_radius), fill=color)
    
    # Inner Cutout / Negative Space Design (Creating an eye-catching modern geometric look)
    accent_color = (31, 70, 212, 255) if not is_monochrome else (0, 0, 0, 255)
    
    # Horizontal tech stripe / latch bar
    latch_bar_h = 22 * scale
    latch_y = body_top + 80 * scale
    draw.rectangle([cx - body_w/2, latch_y, cx + body_w/2, latch_y + latch_bar_h], fill=accent_color)
    
    # Center Circular Badge with Upward Launch Arrow / Checkmark
    badge_r = 72 * scale
    badge_cy = latch_y + latch_bar_h / 2
    draw.ellipse([cx - badge_r, badge_cy - badge_r, cx + badge_r, badge_cy + badge_r], fill=color)
    
    inner_badge_r = 54 * scale
    draw.ellipse([cx - inner_badge_r, badge_cy - inner_badge_r, cx + inner_badge_r, badge_cy + inner_badge_r], fill=accent_color)
    
    # Upward Arrow / Career Ascent Trend symbol inside badge
    arrow_color = (255, 255, 255, 255)
    arrow_scale = scale * 1.0
    
    # Rocket / Ascent Arrow polygon
    p1 = (cx, badge_cy - 28 * arrow_scale)
    p2 = (cx + 24 * arrow_scale, badge_cy + 8 * arrow_scale)
    p3 = (cx + 10 * arrow_scale, badge_cy + 8 * arrow_scale)
    p4 = (cx + 10 * arrow_scale, badge_cy + 26 * arrow_scale)
    p5 = (cx - 10 * arrow_scale, badge_cy + 26 * arrow_scale)
    p6 = (cx - 10 * arrow_scale, badge_cy + 8 * arrow_scale)
    p7 = (cx - 24 * arrow_scale, badge_cy + 8 * arrow_scale)
    draw.polygon([p1, p2, p3, p4, p5, p6, p7], fill=arrow_color)

def generate_master_icon(size=1024):
    """Generates full-bleed 1024x1024 master icon for phone home screens and app drawers."""
    S = size * 2
    
    # Full-bleed brand gradient: #2563EB -> #1D4ED8 -> #1E3A8A
    gradient = create_gradient(S, S, (37, 99, 235), (29, 78, 216))
    
    # Ambient top-left lighting glow
    glow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([int(S * 0.1), int(S * 0.05), int(S * 0.85), int(S * 0.80)], fill=(255, 255, 255, 55))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=int(100 * S / 1024)))
    icon_card = Image.alpha_composite(gradient, glow)
    
    # Subtle dark vignette at the bottom for depth
    vignette = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    v_draw.rectangle([0, int(S * 0.65), S, S], fill=(15, 23, 42, 60))
    vignette = vignette.filter(ImageFilter.GaussianBlur(radius=int(80 * S / 1024)))
    icon_card = Image.alpha_composite(icon_card, vignette)
    
    # Draw Emblem
    emblem_draw = ImageDraw.Draw(icon_card)
    cx, cy = S // 2, int(S * 0.52)
    emblem_size = int(S * 0.54)
    
    # Subtle drop shadow behind emblem
    shadow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    draw_job_tracker_emblem(s_draw, cx, cy + int(18 * S / 1024), emblem_size, color=(15, 23, 42, 70))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=int(24 * S / 1024)))
    icon_card = Image.alpha_composite(icon_card, shadow)
    
    emblem_draw = ImageDraw.Draw(icon_card)
    draw_job_tracker_emblem(emblem_draw, cx, cy, emblem_size, color=(255, 255, 255, 255))
    
    # Downscale with Lanczos for ultra-crisp antialiasing
    result = icon_card.resize((size, size), Image.Resampling.LANCZOS)
    return result

def generate_app_logo(size=512):
    """Generates a transparent/rounded logo badge for in-app UI headers and welcome screens."""
    S = size * 2
    gradient = create_gradient(S, S, (47, 95, 237), (26, 60, 180))
    mask = Image.new('L', (S, S), 0)
    mask_draw = ImageDraw.Draw(mask)
    margin = int(S * 0.05)
    corner_r = int(S * 0.24)
    mask_draw.rounded_rectangle([margin, margin, S - margin, S - margin], radius=corner_r, fill=255)
    
    card = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    card.paste(gradient, (0, 0), mask)
    
    draw = ImageDraw.Draw(card)
    draw.rounded_rectangle([margin, margin, S - margin, S - margin], radius=corner_r, outline=(255, 255, 255, 90), width=int(6 * S / 512))
    
    cx, cy = S // 2, int(S * 0.52)
    emblem_size = int(S * 0.56)
    draw_job_tracker_emblem(draw, cx, cy, emblem_size, color=(255, 255, 255, 255))
    
    return card.resize((size, size), Image.Resampling.LANCZOS)

def generate_android_foreground(size=432):
    """Android adaptive icon foreground (centered in 66% safe zone)."""
    S = size * 2
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    
    # Draw emblem sized to fit perfectly within safe zone (approx 45% of total width)
    cx, cy = S // 2, S // 2
    emblem_size = int(S * 0.44)
    
    # Draw subtle drop shadow behind emblem
    shadow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    draw_job_tracker_emblem(s_draw, cx, cy + int(12 * S / 432), emblem_size, color=(15, 23, 42, 60))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=int(16 * S / 432)))
    
    img = Image.alpha_composite(img, shadow)
    draw = ImageDraw.Draw(img)
    
    # Outer emblem fill
    draw_job_tracker_emblem(draw, cx, cy, emblem_size, color=(255, 255, 255, 255))
    
    return img.resize((size, size), Image.Resampling.LANCZOS)

def generate_android_background(size=432):
    """Android adaptive icon background."""
    S = size * 2
    gradient = create_gradient(S, S, (47, 95, 237), (26, 60, 180))
    return gradient.resize((size, size), Image.Resampling.LANCZOS)

def generate_android_monochrome(size=432):
    """Android 13+ themed icon monochrome silhouette."""
    S = size * 2
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx, cy = S // 2, S // 2
    emblem_size = int(S * 0.44)
    draw_job_tracker_emblem(draw, cx, cy, emblem_size, color=(255, 255, 255, 255), is_monochrome=True)
    
    return img.resize((size, size), Image.Resampling.LANCZOS)

def generate_splash_icon(size=512):
    """Splash screen emblem (crisp white emblem on transparent, designed for blue splash screen)."""
    S = size * 2
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    
    cx, cy = S // 2, S // 2
    emblem_size = int(S * 0.70)
    
    # Soft glow around splash emblem
    glow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    draw_job_tracker_emblem(g_draw, cx, cy, emblem_size, color=(255, 255, 255, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=int(25 * S / 512)))
    img = Image.alpha_composite(img, glow)
    
    draw = ImageDraw.Draw(img)
    draw_job_tracker_emblem(draw, cx, cy, emblem_size, color=(255, 255, 255, 255))
    
    return img.resize((size, size), Image.Resampling.LANCZOS)

def generate_favicon(size=64):
    """Web favicon 64x64."""
    master = generate_master_icon(size=256)
    return master.resize((size, size), Image.Resampling.LANCZOS)

def generate_logo_glow(size=600):
    """Ambient background glow for Starting / Welcome hero."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx, cy = size // 2, size // 2
    r = size // 2 - 20
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(47, 95, 237, 45))
    
    img = img.filter(ImageFilter.GaussianBlur(radius=50))
    return img

print("Generating high-resolution icon suite...")
generate_master_icon(1024).save(os.path.join(OUTPUT_DIR, "icon.png"), "PNG")
generate_app_logo(512).save(os.path.join(OUTPUT_DIR, "app-logo.png"), "PNG")
generate_android_foreground(432).save(os.path.join(OUTPUT_DIR, "android-icon-foreground.png"), "PNG")
generate_android_background(432).save(os.path.join(OUTPUT_DIR, "android-icon-background.png"), "PNG")
generate_android_monochrome(432).save(os.path.join(OUTPUT_DIR, "android-icon-monochrome.png"), "PNG")
generate_splash_icon(512).save(os.path.join(OUTPUT_DIR, "splash-icon.png"), "PNG")
generate_favicon(64).save(os.path.join(OUTPUT_DIR, "favicon.png"), "PNG")
generate_logo_glow(600).save(os.path.join(OUTPUT_DIR, "logo-glow.png"), "PNG")

# Also replace any default expo logo icons in assets/images and assets/expo.icon/
generate_app_logo(256).save(os.path.join(OUTPUT_DIR, "expo-logo.png"), "PNG")
generate_app_logo(256).save(os.path.join(EXPO_ICON_DIR, "grid.png"), "PNG")

print("Icon suite generated successfully!")
