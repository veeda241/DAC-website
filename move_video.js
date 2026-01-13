
const fs = require('fs');
const path = require('path');

const src = 'Untitled video - Made with Clipchamp.mp4';
const dest = 'src/assets/video/loading-screen.mp4';
const log = 'move_log_js.txt';

try {
    if (fs.existsSync(src)) {
        fs.renameSync(src, dest);
        fs.writeFileSync(log, 'Success: Moved file.');
    } else {
        const files = fs.readdirSync('.');
        fs.writeFileSync(log, `Error: Source not found. Files: ${files.join(', ')}`);
    }
} catch (e) {
    fs.writeFileSync(log, `Exception: ${e.message}`);
}
