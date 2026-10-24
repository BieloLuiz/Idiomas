/* Lista, por unidade, as frases no idioma que já têm áudio gravado no curso (e quem fala cada uma).
   Uso: node fonte/videos/frases-por-unidade.mjs [en|fr] [nivel] > lista.md      (ex.: en A1)
   Serve para mandar ao ChatGPT junto com o pedido de roteiro: o vídeo só pode usar estas frases. */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [soLang, soNivel] = process.argv.slice(2);
const NIVEIS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const VOZ = { en: { a3702a6a: 'Sarah', '1ba07d76': 'Lucas', bdadd71e: 'Emma', en_sarah: 'Sarah', en_lucas: 'Lucas', en_narradora: 'Emma', en_vendedor: 'Daniel' },
  fr: { '49d0563e': 'Claire', '8d0efd93': 'Lucas', fr_claire: 'Claire', fr_lucas: 'Lucas', fr_ines: 'Inès', fr_antoine: 'Antoine' } };
const pacote = fs.readdirSync(path.join(RAIZ, 'assets')).map(f => path.join(RAIZ, 'assets', f)).find(f => f.endsWith('.js') && fs.readFileSync(f, 'utf8').includes('var AUDIO='));
const AUDIO = (() => { const s = fs.readFileSync(pacote, 'utf8'), m = s.slice(s.indexOf('var AUDIO=') + 10); let d = 0, j = 0;
  for (; j < m.length; j++) { const c = m[j]; if (c === '"') { j++; while (m[j] !== '"') { if (m[j] === '\\') j++; j++; } continue; } if (c === '{') d++; if (c === '}' && !--d) break; }
  return JSON.parse(m.slice(0, j + 1)).sprites; })();
function titulos(lang) {
  const base = JSON.parse(fs.readFileSync(path.join(RAIZ, 'fonte/src/base.json'), 'utf8'))[lang].unit.title;
  const a1 = [base, ...[...fs.readFileSync(path.join(RAIZ, `fonte/src/${lang}.js`), 'utf8').matchAll(/title:"([^"]*)"/g)].map(m => m[1])].slice(0, 12);
  return [...a1, ...['a2', 'b1', 'b2', 'c1'].flatMap(n => JSON.parse(fs.readFileSync(path.join(RAIZ, `fonte/curso/${n}/${lang}-${n}.json`), 'utf8')).map(u => u.title))];
}
let out = '';
for (const lang of ['en', 'fr']) {
  if (soLang && soLang !== lang) continue;
  const tit = titulos(lang);
  for (let u = 0; u < 60; u++) {
    const nivel = NIVEIS[Math.floor(u / 12)]; if (soNivel && soNivel.toUpperCase() !== nivel) continue;
    const sp = AUDIO[`${lang}|${u}`]; if (!sp) continue;
    const por = {};
    for (const chave of Object.keys(sp.clips)) { const i = chave.indexOf('|'), texto = chave.slice(i + 1), quem = VOZ[lang][chave.slice(0, i)] || '?';
      if (texto.split(/\s+/).length < 2 || texto.includes(' / ')) continue; (por[texto] = por[texto] || new Set()).add(quem); }
    out += `\n## ${lang === 'en' ? 'Inglês' : 'Francês'} ${nivel} · unidade ${u % 12 + 1} (id ${lang}-${nivel.toLowerCase()}-u${String(u % 12 + 1).padStart(2, '0')}) — ${tit[u] || ''}\n`;
    for (const [texto, q] of Object.entries(por)) out += `- ${texto}  — ${[...q].join(', ')}\n`;
  }
}
process.stdout.write(`# Frases com áudio gravado, por unidade\nUse SOMENTE estas frases nas falas dos personagens, e com um dos personagens indicados (é a voz gravada).\n` + out);
