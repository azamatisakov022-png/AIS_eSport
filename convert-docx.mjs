import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

const srcDir = 'D:/AIS_eSport/Законы и редакции законов ГАФКИС';
const outDir = 'D:/AIS_eSport/Законы и редакции законов ГАФКИС/md';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.docx'));

console.log(`Found ${files.length} .docx files\n`);

// Convert HTML to simple Markdown
function htmlToMd(html) {
    let md = html;

    // Headers
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
    md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

    // Bold & italic
    md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');
    md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');
    md = md.replace(/<u>(.*?)<\/u>/gi, '$1');

    // Lists
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    md = md.replace(/<\/?[ou]l[^>]*>/gi, '\n');

    // Table handling
    md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match, tableContent) => {
        const rows = [];
        const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let rowMatch;
        while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
            const cells = [];
            const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
            let cellMatch;
            while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
                cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim());
            }
            rows.push(cells);
        }
        if (rows.length === 0) return '';
        const maxCols = Math.max(...rows.map(r => r.length));
        const colWidths = Array(maxCols).fill(3);
        for (const row of rows) {
            for (let i = 0; i < row.length; i++) {
                colWidths[i] = Math.max(colWidths[i], row[i].length);
            }
        }
        let result = '\n';
        for (let r = 0; r < rows.length; r++) {
            const cells = rows[r];
            const line = '| ' + Array.from({ length: maxCols }, (_, i) =>
                (cells[i] || '').padEnd(colWidths[i])
            ).join(' | ') + ' |';
            result += line + '\n';
            if (r === 0) {
                result += '| ' + colWidths.map(w => '-'.repeat(w)).join(' | ') + ' |\n';
            }
        }
        return result + '\n';
    });

    // Line breaks and paragraphs
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

    // Remove remaining tags
    md = md.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    md = md.replace(/&amp;/g, '&');
    md = md.replace(/&lt;/g, '<');
    md = md.replace(/&gt;/g, '>');
    md = md.replace(/&quot;/g, '"');
    md = md.replace(/&nbsp;/g, ' ');
    md = md.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code));

    // Clean up excessive blank lines
    md = md.replace(/\n{3,}/g, '\n\n');
    md = md.trim() + '\n';

    return md;
}

for (const file of files) {
    const filePath = path.join(srcDir, file);
    const outName = file.replace(/\.docx$/i, '.md');
    const outPath = path.join(outDir, outName);

    try {
        const result = await mammoth.convertToHtml({ path: filePath });
        const md = htmlToMd(result.value);
        fs.writeFileSync(outPath, md, 'utf-8');
        console.log(`✓ ${file}`);
        if (result.messages.length > 0) {
            for (const msg of result.messages) {
                console.log(`  ⚠ ${msg.message}`);
            }
        }
    } catch (err) {
        console.error(`✗ ${file}: ${err.message}`);
    }
}

console.log('\nDone!');
