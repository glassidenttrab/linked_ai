const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('out')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.json') || file.endsWith('.md') || file.endsWith('.html') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(__dirname);
let count = 0;
files.forEach(file => {
    // 본 스크립트 자체는 치환 대상에서 제외
    if (file.endsWith('replace_all.js')) return;

    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('Connect AI')) {
        // 전역 치환 (Connect AI -> Linked Ai)
        content = content.replace(/Connect AI/g, 'Linked Ai');
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`완벽 치환 완료: ${path.basename(file)}`);
    }
});
console.log(`\n🎉 총 ${count}개 파일의 브랜드 문구를 일괄 교체했습니다!`);
