import os

source = '1749373788465.jpeg'
dest_dir = os.path.join('src', 'assets', 'images')
dest = os.path.join(dest_dir, 'department-logo.jpg')

print(f"Current working directory: {os.getcwd()}")
print(f"Source exists: {os.path.exists(source)}")
print(f"Destination dir exists: {os.path.exists(dest_dir)}")

if os.path.exists(source):
    try:
        with open(source, 'rb') as f_src:
            content = f_src.read()
        with open(dest, 'wb') as f_dest:
            f_dest.write(content)
        print(f"Successfully copied {len(content)} bytes to {dest}")
    except Exception as e:
        print(f"Error during copy: {e}")
else:
    print("Source file not found")
