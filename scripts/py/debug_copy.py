
import shutil
import os

src_dir = r"c:\hackathon\Gemini_CLI\DAC-website\src\assets\images"
dst_dir = r"c:\hackathon\Gemini_CLI\DAC-website\public"
file_name = "Data analytics Club.png"

src = os.path.join(src_dir, file_name)
dst = os.path.join(dst_dir, "dac-logo.png")

print(f"Checking {src}")
if os.path.exists(src):
    print("Source exists!")
    try:
        shutil.copy2(src, dst)
        print(f"Copied to {dst}")
    except Exception as e:
        print(f"Copy failed: {e}")
else:
    print("Source NOT found")
    print("Listing dir:")
    print(os.listdir(src_dir))
