
import os
import shutil

source = "Untitled video - Made with Clipchamp.mp4"
dest = "src/assets/video/loading-screen.mp4"
log_file = "move_log.txt"

with open(log_file, "w") as f:
    try:
        if os.path.exists(source):
            shutil.move(source, dest)
            f.write("Success: Moved file.\n")
        else:
            f.write(f"Error: Source {source} not found.\n")
            f.write("Files found here:\n")
            for x in os.listdir('.'):
                f.write(f"{x}\n")
    except Exception as e:
        f.write(f"Exception: {e}\n")
