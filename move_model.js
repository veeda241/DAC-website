import fs from 'fs';
try {
    fs.renameSync('cartoon owl 3d model.glb', 'public/owl.glb');
    console.log('Success');
} catch (e) {
    console.error(e);
}
