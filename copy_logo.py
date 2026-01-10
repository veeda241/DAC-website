import shutil
import os

source = '1749373788465.jpeg'
dest = os.path.join('src', 'assets', 'images', 'department-logo.jpg')

try:
    shutil.copy2(source, dest)
    print(f"Successfully copied {source} to {dest}")
except Exception as e:
    print(f"Error copying file: {e}")
