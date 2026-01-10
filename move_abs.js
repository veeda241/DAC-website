const fs = require('fs');
try {
    fs.renameSync('C:/hackathon/Gemini_CLI/DAC-website/cartoon owl 3d model.glb', 'C:/hackathon/Gemini_CLI/DAC-website/public/owl.glb');
    console.log('Success');
} catch (e) {
    console.error(e);
}
