const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;

// Read all files in the directory
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    files.forEach((file) => {
        // Check if it's an HTML file
        if (path.extname(file) === '.html') {
            const filePath = path.join(directoryPath, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // 1. Add brand-logo-img class to logo image
            content = content.replace(
                /<img src="images\/company-logo\.png" alt="Radhe Disposable Logo" style="height: 60px; width: auto;">/g,
                '<img src="images/company-logo.png" alt="Radhe Disposable Logo" style="height: 60px; width: auto;" class="brand-logo-img">'
            );

            // 2. Add brand-text-primary class to RADHE text
            content = content.replace(
                /<span\s*style="display: block; font-size: 1\.6rem; color: #333; font-weight: 800; letter-spacing: -0\.5px; text-transform: uppercase;">RADHE<\/span>/g,
                '<span class="brand-text-primary" style="display: block; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">RADHE</span>'
            );

            // 3. Add brand-text-secondary class to Disposable text
            content = content.replace(
                /<span\s*style="display: block; font-size: 0\.9rem; color: var\(--color-accent\); font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Disposable<\/span>/g,
                '<span class="brand-text-secondary" style="display: block; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Disposable</span>'
            );

            // Write the changes back to the file
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${file}`);
        }
    });
});
