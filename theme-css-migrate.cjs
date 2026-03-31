const fs = require('fs');
const path = require('path');

function processCss(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // #fff background
    let prev = content;
    content = content.replace(/(background(?:-color)?:\s*)#(?:fff|ffffff)(?![a-f0-9])/gi, "$1var(--theme-bg-card)");
    // #1D1D1F text
    content = content.replace(/color:\s*#1D1D1F(?![a-f0-9])/gi, "color: var(--theme-text-main)");
    // #86868b text
    content = content.replace(/color:\s*#86868[bB](?![a-f0-9])/gi, "color: var(--theme-text-secondary)");
    // #e8ebf0 or #e5e7eb border/background
    content = content.replace(/(border(?:-[a-z]+)?(?:\s*:\s*.*)?\s+)#(?:e8ebf0|e5e7eb)(?![a-f0-9])/gi, "$1var(--theme-border)");
    content = content.replace(/(background(?:-color)?:\s*)#(?:f2f2f7|f0f4fa|f9fafb)(?![a-f0-9])/gi, "$1var(--theme-bg-panel)");

    if (content !== prev) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated CSS:', filePath);
    }
}

const stylesDir = path.join(__dirname, 'src', 'styles');
if (fs.existsSync(stylesDir)) {
    ['public.css', 'mockup.css'].forEach(file => {
        const fullPath = path.join(stylesDir, file);
        if (fs.existsSync(fullPath)) processCss(fullPath);
    });
}
console.log('CSS Migration complete.');
