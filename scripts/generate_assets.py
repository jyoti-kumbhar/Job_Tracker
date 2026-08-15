import os
from PIL import Image, ImageOps, ImageDraw

def generate_assets():
    logo_src = r"C:\Users\BHARAT\.gemini\antigravity-cli\brain\7ebb48e9-57dd-4bcf-a6de-848723598d8d\job_tracker_logo_1786694225769.jpg"
    splash_src = r"C:\Users\BHARAT\.gemini\antigravity-cli\brain\7ebb48e9-57dd-4bcf-a6de-848723598d8d\splash_emblem_1786694458912.jpg"
    output_dir = r"G:\jyoti\development\job tracker\assets\images"
    
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Load source images
    img_logo = Image.open(logo_src).convert("RGBA")
    img_splash = Image.open(splash_src).convert("RGBA")
    
    # 2. Main app icon (1024x1024)
    icon_1024 = img_logo.resize((1024, 1024), Image.Resampling.LANCZOS)
    icon_1024.save(os.path.join(output_dir, "icon.png"), "PNG")
    print("Saved icon.png (1024x1024)")
    
    # 3. In-app logo (512x512)
    app_logo = img_logo.resize((512, 512), Image.Resampling.LANCZOS)
    app_logo.save(os.path.join(output_dir, "app-logo.png"), "PNG")
    print("Saved app-logo.png (512x512)")
    
    # 4. Android adaptive icon foreground (432x432 with 288x288 safe zone)
    # The adaptive icon foreground is 432x432, centered with size ~280x280 so it doesn't get clipped by circular masks
    adaptive_fg = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
    fg_logo = img_logo.resize((300, 300), Image.Resampling.LANCZOS)
    adaptive_fg.paste(fg_logo, (66, 66), fg_logo)
    adaptive_fg.save(os.path.join(output_dir, "android-icon-foreground.png"), "PNG")
    print("Saved android-icon-foreground.png (432x432)")
    
    # 5. Android adaptive icon background (432x432)
    adaptive_bg = Image.new("RGBA", (432, 432), (247, 248, 251, 255)) # #F7F8FB
    adaptive_bg.save(os.path.join(output_dir, "android-icon-background.png"), "PNG")
    print("Saved android-icon-background.png (432x432)")
    
    # 6. Splash icon (432x432)
    splash_icon = img_splash.resize((432, 432), Image.Resampling.LANCZOS)
    splash_icon.save(os.path.join(output_dir, "splash-icon.png"), "PNG")
    print("Saved splash-icon.png (432x432)")
    
    # 7. Monochrome Adaptive Icon (432x432)
    # Convert white emblem from splash to monochrome alpha mask
    mono_img = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
    emblem_resized = img_splash.resize((300, 300), Image.Resampling.LANCZOS)
    mono_img.paste(emblem_resized, (66, 66), emblem_resized)
    mono_img.save(os.path.join(output_dir, "android-icon-monochrome.png"), "PNG")
    print("Saved android-icon-monochrome.png (432x432)")
    
    # 8. Favicon (64x64)
    favicon = img_logo.resize((64, 64), Image.Resampling.LANCZOS)
    favicon.save(os.path.join(output_dir, "favicon.png"), "PNG")
    print("Saved favicon.png (64x64)")

if __name__ == "__main__":
    generate_assets()
