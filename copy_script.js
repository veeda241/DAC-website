const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'cartoon owl 3d model.glb');
const target = path.join(__dirname, 'public', 'owl.glb');

console.log('Source:', source);
console.log('Target:', target);

try {
    if (fs.existsSync(source)) {
        fs.copyFileSync(source, target);
        console.log('Successfully copied file.');
        const stats = fs.statSync(target);
        console.log('Target file size:', stats.size);
    } else {
        console.error('Source file does not exist.');
    }
} catch (err) {
    console.error('Error during copy:', err);
}
