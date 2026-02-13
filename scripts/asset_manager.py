import os
import shutil
import glob

# Ensure we use raw strings for Windows paths or os.path.join
ROOT_DIR = os.getcwd()
LOG_FILE = "asset_log.txt"

def copy_or_move(src_pattern, dest_path, operation="move"):
    """
    Moves or copies files matching src_pattern to dest_path.
    dest_path can be a directory or a file path.
    """
    try:
        # Use simple glob for pattern matching
        files = glob.glob(src_pattern)
        
        if not files:
            # Maybe the pattern is just a filename
            if os.path.exists(src_pattern):
                files = [src_pattern]
            else:
                msg = f"Source {src_pattern} not found/matched."
                print(msg)
                with open(LOG_FILE, "a") as f:
                    f.write(f"Error: {msg}\n")
                return False

        for src in files:
            # If dest_path looks like a directory or ends with separator
            if dest_path.endswith('/') or dest_path.endswith('\\') or os.path.isdir(dest_path):
                 if not os.path.exists(dest_path):
                     os.makedirs(dest_path)
                 final_dest = os.path.join(dest_path, os.path.basename(src))
            else:
                 # It's a file path
                 folder = os.path.dirname(dest_path)
                 if folder and not os.path.exists(folder):
                     os.makedirs(folder)
                 final_dest = dest_path

            if operation == "move":
                shutil.move(src, final_dest)
                action = "Moved"
            else:
                shutil.copy2(src, final_dest)
                action = "Copied"
            
            msg = f"Success: {action} '{src}' to '{final_dest}'."
            print(msg)
            with open(LOG_FILE, "a") as f:
                f.write(f"{msg}\n")
                
        return True
    except Exception as e:
        msg = f"Exception processing {src_pattern} -> {dest_path}: {e}"
        print(msg)
        with open(LOG_FILE, "a") as f:
            f.write(f"{msg}\n")
        return False

def run_asset_management():
    print("--- Starting Asset Management ---")
    with open(LOG_FILE, "a") as f:
        f.write("\n--- New Run ---\n")

    # 1. Move Video
    # move_and_log.py and move_video.py logic
    copy_or_move("Untitled video - Made with Clipchamp.mp4", "src/assets/video/loading-screen.mp4", "move")
    
    # 2. Move Query Quest PDF logic from move_query_pdf.py
    # Matches "Query Quest*.pdf"
    copy_or_move("Query Quest*.pdf", "public/query_quest_report.pdf", "move")
    
    # 3. Copy Logo logic from copy_logo.py
    copy_or_move("1749373788465.jpeg", "public/department_logo.jpeg", "copy")
    
    # 4. Copy PDFs logic from copy_logo.py
    copy_or_move("DATA_ANALYTICS_CLUB.pdf", "public/DATA_ANALYTICS_CLUB.pdf", "copy")
    copy_or_move("report event 2.pdf", "public/report_event_2.pdf", "copy")
    
    # 5. Debug Copy (Logo) logic from debug_copy.py
    # src/assets/images/Data analytics Club.png -> public/dac-logo.png
    src_logo = os.path.join("src", "assets", "images", "Data analytics Club.png")
    copy_or_move(src_logo, "public/dac-logo.png", "copy")
    
    # 6. Copy Debug (Logo) logic from copy_debug.py
    # 1749373788465.jpeg -> src/assets/images/department-logo.jpg
    copy_or_move("1749373788465.jpeg", "src/assets/images/department-logo.jpg", "copy")
    
    print("--- Asset Management Complete ---")

if __name__ == "__main__":
    run_asset_management()
