const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function replaceColors(content) {
  let result = content;
  
  // Array of prefixes to target
  const prefixes = ['text', 'bg', 'border', 'from', 'via', 'to', 'shadow', 'marker', 'ring', 'fill', 'hover:text', 'hover:bg', 'hover:border', 'hover:shadow'];
  
  // Replace red with purple
  prefixes.forEach(prefix => {
    const redRegex = new RegExp(`${prefix}-red-([0-9]{2,3})`, 'g');
    result = result.replace(redRegex, `${prefix}-purple-$1`);
  });

  // Replace yellow, orange, amber with slate
  ['yellow', 'orange', 'amber'].forEach(color => {
    prefixes.forEach(prefix => {
      const colorRegex = new RegExp(`${prefix}-${color}-([0-9]{2,3})`, 'g');
      result = result.replace(colorRegex, `${prefix}-slate-$1`);
    });
  });

  return result;
}

function processDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
      // Exclude files we already handled manually specifically if needed, but doing it again is harmless for these regexes since they target red/yellow.
      // E.g. ThreeDMascot.tsx, Home.tsx already done partially, this will catch any remaining.
      const content = fs.readFileSync(fullPath, 'utf8');
      const newContent = replaceColors(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Done.');
