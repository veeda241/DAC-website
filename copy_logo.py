
import shutil
import os

root = r"c:\hackathon\Gemini_CLI\DAC-website"
files = [
    (os.path.join(root, "1749373788465.jpeg"), os.path.join(root, "public", "department_logo.jpeg")),
    (os.path.join(root, "DATA_ANALYTICS_CLUB.pdf"), os.path.join(root, "public", "DATA_ANALYTICS_CLUB.pdf")),
    (os.path.join(root, "report event 2.pdf"), os.path.join(root, "public", "report_event_2.pdf"))
]

for src, dst in files:
    print(f"Copying {src} to {dst}")
    try:
        if os.path.exists(src):
            shutil.copy2(src, dst)
            if os.path.exists(dst):
                print(f"Successfully copied to {dst}")
            else:
                print(f"Failed to copy to {dst}")
        else:
            print(f"Source not found: {src}")
    except Exception as e:
        print(f"Error: {e}")
