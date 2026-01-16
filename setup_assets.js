const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'setup_log.txt');
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

const files = [
    { src: '1749373788465.jpeg', dest: 'public/department_logo.jpeg' },
    { src: 'DATA_ANALYTICS_CLUB.pdf', dest: 'public/DATA_ANALYTICS_CLUB.pdf' },
    { src: 'report event 2.pdf', dest: 'public/report_event_2.pdf' },
    { src: 'DAC_Report.pdf', dest: 'public/DAC_Report.pdf' }
];

log('Starting asset setup...');

files.forEach(file => {
    const sourcePath = path.join(__dirname, file.src);
    const destPath = path.join(__dirname, file.dest);

    log(`Checking source: ${sourcePath}`);
    try {
        if (fs.existsSync(sourcePath)) {
            log(`Source exists. Copying to ${destPath}`);
            fs.copyFileSync(sourcePath, destPath);
            if (fs.existsSync(destPath)) {
                log(`Successfully copied to ${destPath}`);
            } else {
                log(`Failed to find destination after copy: ${destPath}`);
            }
        } else {
            log(`Source file not found: ${sourcePath}`);
        }
    } catch (err) {
        log(`Error copying ${file.src}: ${err.message}`);
    }
});

log('Asset setup finished.');
