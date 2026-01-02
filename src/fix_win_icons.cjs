const fs = require('fs');
const path = require('path');

// This script generates dummy icon files to bypass a failing `tauri icon` command
// specifically for Windows environments where this command might be unstable.

const main = () => {
  try {
    const iconDir = path.join(__dirname, '..', 'src-tauri', 'icons');
    console.log(`Target icon directory: ${iconDir}`);

    // A comprehensive list of icons that Tauri might need for a Windows build.
    const iconFiles = [
      '32x32.png',
      '128x128.png',
      '128x128@2x.png',
      'icon.icns',
      'icon.ico',
      'Square30x30Logo.png',
      'Square44x44Logo.png',
      'Square70x70Logo.png',
      'Square71x71Logo.png',
      'Square89x89Logo.png',
      'Square107x107Logo.png',
      'Square142x142Logo.png',
      'Square150x150Logo.png',
      'Square270x270Logo.png',
      'Square284x284Logo.png',
      'Square310x310Logo.png',
      'StoreLogo.png',
      'Wide310x150Logo.png'
    ];

    if (!fs.existsSync(iconDir)) {
      fs.mkdirSync(iconDir, { recursive: true });
      console.log('Created icons directory.');
    }

    // Use a minimal, valid 1x1 pixel transparent PNG for all dummy files.
    const minimalPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

    console.log('🚀 Generating dummy icons for Windows to allow the build to proceed...');
    for (const iconFile of iconFiles) {
      const filePath = path.join(iconDir, iconFile);
      fs.writeFileSync(filePath, minimalPng);
      console.log(`- Created dummy icon: ${filePath}`);
    }

    console.log('✅ Dummy icons generated successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Failed to generate dummy icons:');
    console.error(error);
    process.exit(1);
  }
};

main();
