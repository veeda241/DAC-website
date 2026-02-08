
import os
import shutil
import glob

# Source pattern to match the tricky filename
# "Query Quest – DBMS..." - the dash is likely the issue
# We'll match "Query Quest*.pdf"
source_pattern = "Query Quest*.pdf"
destination = "public/query_quest_report.pdf"

files = glob.glob(source_pattern)
if files:
    src = files[0]
    print(f"Found file: {src}")
    try:
        shutil.move(src, destination)
        print(f"Successfully moved '{src}' to '{destination}'")
    except Exception as e:
        print(f"Error moving file: {e}")
        # Try copy if move fails
        try:
            shutil.copy(src, destination)
            print(f"Successfully copied '{src}' to '{destination}'")
        except Exception as e2:
            print(f"Error copying file: {e2}")
else:
    print("No file matching 'Query Quest*.pdf' found in current directory.")
