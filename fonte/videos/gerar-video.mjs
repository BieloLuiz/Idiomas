/* Gera as videoaulas (MP4 vertical 720x1280) a partir dos roteiros em fonte/videos/roteiros/*.json.
   Uso:  node fonte/videos/gerar-video.mjs <roteiro.json> [saida] [--manifesto]
   - Vozes: procura fonte/videos/narracao/<aula>-<n>.mp3 (gerados no PC pelo ElevenLabs a partir do manifesto).
     Sem o arquivo, as falas no idioma usam o trecho já gravado do curso e a narração fica muda, com legenda (prévia).
   - --manifesto: só escreve fonte/videos/narracao/manifest-video.json para o gerar-audio-11labs.ps1.
   Requer: build feito (assets/ com var AUDIO), ffmpeg e Playwright/Chromium (CHROMIUM_PATH opcional). */
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const AQUI = path.dirname(fileURLToPath(import.meta.url)), RAIZ = path.resolve(AQUI, '../..');
const [roteiroArq, saida = path.join(RAIZ, '.build/videos')] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const soManifesto = process.argv.includes('--manifesto');
const PAPEL = { en: { sarah: 'en_sarah', lucas: 'en_lucas', emma: 'en_narradora', daniel: 'en_vendedor' }, fr: { claire: 'fr_claire', lucas: 'fr_lucas', 'inès': 'fr_ines', ines: 'fr_ines', antoine: 'fr_antoine' } };
const roteiro = JSON.parse(fs.readFileSync(roteiroArq, 'utf8'));
const narr = path.join(AQUI, 'narracao');

function falasNumeradas(a) { let n = 0; return a.cenas.flatMap(c => c.falas.map(f => ({ ...f, n: ++n, arquivo: `${a.id}-${String(n).padStart(2, '0')}.mp3` }))); }
if (soManifesto) {
  const itens = roteiro.aulas.flatMap(a => falasNumeradas(a).map(f => ({ role: f.voz === 'narrador' ? 'pt_narrador' : PAPEL[a.idioma][f.voz.toLowerCase()], text: f.texto, lang: f.voz === 'narrador' ? 'pt' : a.idioma, f: f.arquivo })));
  const faltam = itens.filter(i => !i.role); if (faltam.length) throw new Error('voz desconhecida: ' + faltam.map(i => i.text).join(' | '));
  fs.writeFileSync(path.join(narr, 'manifest-video.json'), JSON.stringify(itens, null, 1));
  console.log(itens.length, 'falas no manifesto;', itens.reduce((s, i) => s + i.text.length, 0), 'caracteres'); process.exit(0);
}

/* mapa de trechos gravados do curso (var AUDIO no pacote montado) */
const pacote = fs.readdirSync(path.join(RAIZ, 'assets')).map(f => path.join(RAIZ, 'assets', f)).find(f => f.endsWith('.js') && fs.readFileSync(f, 'utf8').includes('var AUDIO='));
const AUDIO = (() => { const s = fs.readFileSync(pacote, 'utf8'), m = s.slice(s.indexOf('var AUDIO=') + 10); let d = 0, j = 0;
  for (; j < m.length; j++) { const c = m[j]; if (c === '"') { j++; while (m[j] !== '"') { if (m[j] === '\\') j++; j++; } continue; } if (c === '{') d++; if (c === '}' && !--d) break; }
  return JSON.parse(m.slice(0, j + 1)).sprites; })();
function trecho(lang, texto) { for (const k of Object.keys(AUDIO)) { if (!k.startsWith(lang + '|')) continue; const sp = AUDIO[k]; for (const [chave, c] of Object.entries(sp.clips)) if (chave.slice(chave.indexOf('|') + 1) === texto) return { arq: path.join(RAIZ, sp.file), de: c[0], dur: c[1] - c[0] }; } return null; }
function duracao(arq) { return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arq]).toString().trim()); }

fs.mkdirSync(saida, { recursive: true });
const { chromium } = await import('playwright');
const eco = fs.readFileSync(path.join(RAIZ, 'fonte/src/eco.js'), 'utf8');
for (const a of roteiro.aulas) {
  const falas = falasNumeradas(a); let t = 0.9, k = 0, avisos = [];
  const sons = [];
  const cenas = a.cenas.map(c => {
    const cena = { ini: t, parte: c.parte, eco: c.eco, tela: c.tela, falas: [], alvos: c.falas.filter(f => f.voz !== 'narrador').map(f => f.texto) };
    for (const f of c.falas) {
      const g = falas[k++], alvo = f.voz !== 'narrador', proprio = path.join(narr, g.arquivo);
      let som = null;
      if (fs.existsSync(proprio)) som = { arq: proprio, de: 0, dur: duracao(proprio) };
      else if (alvo) { som = trecho(a.idioma, f.texto); if (!som) avisos.push('sem áudio: ' + f.texto); }
      else avisos.push('narração ainda não gravada: ' + g.arquivo);
      const dur = som ? som.dur : Math.max(1.6, f.texto.length / 14);
      if (som) sons.push({ ...som, em: t });
      cena.falas.push({ ini: t, fim: t + dur, voz: f.voz, texto: f.texto, alvo }); t += dur + 0.35;
    }
    if (c.pausa_segundos > 0) { cena.pausa = [t, t + c.pausa_segundos]; t += c.pausa_segundos; }
    t += 0.6; cena.fim = t; return cena;
  });
  const duracaoTotal = t + 0.8;
  /* vídeo: toca a cena em tempo real e grava */
  const nav = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const ctx = await nav.newContext({ viewport: { width: 720, height: 1280 }, recordVideo: { dir: saida, size: { width: 720, height: 1280 } } });
  const inicio = Date.now(), pg = await ctx.newPage();
  await pg.goto('file://' + path.join(AQUI, 'cena.html')); await pg.addScriptTag({ content: eco }); await pg.waitForTimeout(300);
  const corte = (Date.now() - inicio) / 1000;
  await pg.evaluate(A => window.tocarAula(A), { titulo: a.titulo, idioma: a.idioma, nivel: a.nivel, cenas, duracao: duracaoTotal });
  await pg.waitForFunction(() => window.__fim === true, null, { timeout: (duracaoTotal + 20) * 1000 });
  const webm = await pg.video().path(); await ctx.close(); await nav.close();
  /* áudio: cada fala no seu tempo */
  const wav = path.join(saida, a.id + '.wav'), ent = [], filtros = [];
  sons.forEach((s, i) => { ent.push('-ss', String(s.de), '-t', String(s.dur), '-i', s.arq); filtros.push(`[${i}:a]aresample=48000,adelay=${Math.round(s.em * 1000)}:all=1[a${i}]`); });
  if (sons.length) execFileSync('ffmpeg', ['-y', '-v', 'error', ...ent, '-filter_complex', filtros.join(';') + ';' + sons.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${sons.length}:normalize=0,apad,atrim=0:${duracaoTotal.toFixed(2)}`, wav]);
  else execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', String(duracaoTotal), wav]);
  const mp4 = path.join(saida, a.id + '.mp4');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', corte.toFixed(2), '-i', webm, '-i', wav, '-t', duracaoTotal.toFixed(2), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-r', '30', '-c:a', 'aac', '-b:a', '160k', mp4]);
  fs.rmSync(webm); fs.rmSync(wav);
  console.log(`${mp4} · ${duracaoTotal.toFixed(1)} s` + (avisos.length ? '\n  ' + avisos.join('\n  ') : ''));
}
