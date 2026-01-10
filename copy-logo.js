const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '1749373788465.jpeg');
const dest = path.join(__dirname, 'src', 'assets', 'images', 'department-logo.jpg');

try {
    fs.copyFileSync(source, dest);
    console.log('Logo copied successfully!');
} catch (err) {
    console.error('Error copying logo:', err);
}
