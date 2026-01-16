const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'DAC_Report.pdf');
const dest = path.join(__dirname, 'public', 'DAC_Report.pdf');

try {
    fs.copyFileSync(src, dest);
    console.log(`Successfully copied ${src} to ${dest}`);
} catch (err) {
    console.error(`Error copying file: ${err}`);
}
