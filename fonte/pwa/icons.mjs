import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
import fs from 'fs';
const svg=fs.readFileSync(process.argv[2],'utf8'); const b=await pw.chromium.launch();
for (const n of [192,512]) { const p=await b.newPage({viewport:{width:n,height:n}});
  await p.setContent(`<html><body style="margin:0">${svg.replace('<svg ',`<svg width="${n}" height="${n}" `)}</body></html>`);
  await p.screenshot({path:process.argv[3]+`/icon-${n}.png`}); }
await b.close();
