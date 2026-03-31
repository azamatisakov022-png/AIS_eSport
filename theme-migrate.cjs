const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    const content1 = content.replace(/background:\s*['"]#(fff|ffffff)['"]/gi, "background: 'var(--theme-bg-card)'");
    const content2 = content1.replace(/backgroundColor:\s*['"]#(fff|ffffff)['"]/gi, "backgroundColor: 'var(--theme-bg-card)'");
    
    const content3 = content2.replace(/color:\s*['"]#1D1D1F['"]/gi, "color: 'var(--theme-text-main)'");
    const content4 = content3.replace(/color:\s*['"]#86868B['"]/gi, "color: 'var(--theme-text-secondary)'");
    
    const content5 = content4.replace(/background:\s*['"]#(F2F2F7|F0F4FA|F9FAFB)['"]/gi, "background: 'var(--theme-bg-panel)'");
    const content6 = content5.replace(/backgroundColor:\s*['"]#(F2F2F7|F0F4FA|F9FAFB)['"]/gi, "backgroundColor: 'var(--theme-bg-panel)'");
    
    const content7 = content6.replace(/borderColor:\s*['"]#(E8EBF0|E5E7EB)['"]/gi, "borderColor: 'var(--theme-border)'");
    const contentFinal = content7.replace(/border(Bottom|Top|Right|Left)?:\s*['"]1px solid #(E8EBF0|E5E7EB)['"]/gi, function(match, p1) {
        return "border" + (p1 || "") + ": '1px solid var(--theme-border)'";
    });
    
    if (content !== contentFinal) {
        fs.writeFileSync(filePath, contentFinal, 'utf8');
        console.log('Updated:', filePath);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            replaceInFile(fullPath);
        }
    }
}

processDir(path.join(__dirname, 'src', 'public'));
console.log('Migration complete.');
