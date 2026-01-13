
import os
import shutil

source = "Untitled video - Made with Clipchamp.mp4"
destination = "src/assets/video/loading-screen.mp4"

if os.path.exists(source):
    print(f"File {source} found. Moving to {destination}")
    try:
        shutil.move(source, destination)
        print("Move successful")
    except Exception as e:
        print(f"Error moving file: {e}")
else:
    print(f"File {source} NOT found in {os.getcwd()}")
    # List files to check what python sees
    print("Files in current dir:")
    for f in os.listdir('.'):
        print(f)
