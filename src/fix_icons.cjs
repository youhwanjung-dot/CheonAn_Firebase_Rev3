const fs = require('fs');
const path = require('path');

// The directory where Tauri expects the icons
const iconsDir = path.join(__dirname, '..', 'src-tauri', 'icons');
// The single source icon file Tauri will use
const iconPath = path.join(iconsDir, 'icon.png');

// Base64 representation of a valid 1x1 transparent PNG
const validPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const pngBuffer = Buffer.from(validPngBase64, 'base64');

console.log('--- Fixing App Icons (The Right Way) ---');

// 1. Ensure the 'icons' directory exists.
if (!fs.existsSync(iconsDir)) {
    console.log(`Creating directory: ${iconsDir}`);
    fs.mkdirSync(iconsDir, { recursive: true });
}

// 2. Clean up ALL old icon files in the directory to prevent conflicts.
console.log('Cleaning up old, invalid icon files...');
const files = fs.readdirSync(iconsDir);
if (files.length > 0) {
    for (const file of files) {
        fs.unlinkSync(path.join(iconsDir, file));
        console.log(` - Deleted: ${file}`);
    }
} else {
    console.log('Directory is already clean.');
}


// 3. Write the single, valid 'icon.png'. This will be the source for the build.
console.log(`Generating a valid source icon: ${iconPath}`);
fs.writeFileSync(iconPath, pngBuffer);

console.log('✨ Icon fix complete! Tauri will now generate all required formats from icon.png.');
