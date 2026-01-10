import fs from 'fs';
import path from 'path';

const src = 'cartoon owl 3d model.glb';
const dest = 'public/owl.glb';

try {
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log('Successfully copied ' + src + ' to ' + dest);
    } else {
        console.error('Source file not found: ' + src);
    }
} catch (err) {
    console.error('Error copying file:', err);
}
