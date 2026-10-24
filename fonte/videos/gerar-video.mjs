/* Gera as videoaulas (MP4 vertical 720x1280) a partir dos roteiros em fonte/videos/roteiros/*.json.
   Uso:  node fonte/videos/gerar-video.mjs <roteiro.json> [saida] [--manifesto]
   - Vozes: procura fonte/videos/narracao/<aula>-<n>.mp3 (gerados no PC pelo ElevenLabs a partir do manifesto).
     Sem o arquivo, as falas no idioma usam o trecho já gravado do curso e a narração fica muda, com legenda (prévia).
   - --manifesto: confere se toda fala no idioma existe no áudio do curso e escreve só a narração em fonte/videos/narracao/manifest-video.json para o gerar-audio-11labs.ps1.
   Requer: build feito (assets/ com var AUDIO), ffmpeg e Playwright/Chromium (CHROMIUM_PATH opcional). */
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const AQUI = path.dirname(fileURLToPath(import.meta.url)), RAIZ = path.resolve(AQUI, '../..');
const [roteiroArq, saida = path.join(RAIZ, '.build/videos')] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const soManifesto = process.argv.includes('--manifesto');
const PAPEL = { en: { sarah: 'en_sarah', lucas: 'en_lucas', emma: 'en_narradora', daniel: 'en_vendedor' }, fr: { claire: 'fr_claire', lucas: 'fr_lucas', 'inès': 'fr_ines', ines: 'fr_ines', antoine: 'fr_antoine' } };
const roteiro = JSON.parse(fs.readFileSync(roteiroArq, 'utf8'));
const narr = path.join(AQUI, 'narracao');

function falasNumeradas(a) { let n = 0; return a.cenas.flatMap(c => c.falas.map(f => ({ ...f, n: ++n, arquivo: `${a.id}-${String(n).padStart(2, '0')}.mp3` }))); }
/* mapa de trechos gravados do curso (var AUDIO no pacote montado) */
const pacote = fs.readdirSync(path.join(RAIZ, 'assets')).map(f => path.join(RAIZ, 'assets', f)).find(f => f.endsWith('.js') && fs.readFileSync(f, 'utf8').includes('var AUDIO='));
const AUDIO = (() => { const s = fs.readFileSync(pacote, 'utf8'), m = s.slice(s.indexOf('var AUDIO=') + 10); let d = 0, j = 0;
  for (; j < m.length; j++) { const c = m[j]; if (c === '"') { j++; while (m[j] !== '"') { if (m[j] === '\\') j++; j++; } continue; } if (c === '{') d++; if (c === '}' && !--d) break; }
  return JSON.parse(m.slice(0, j + 1)).sprites; })();
/* quem fala em cada voz gravada do curso (hash ou papel → personagem) */
const VOZ_CURSO = { en: { a3702a6a: 'Sarah', '1ba07d76': 'Lucas', bdadd71e: 'Emma', en_sarah: 'Sarah', en_lucas: 'Lucas', en_narradora: 'Emma', en_vendedor: 'Daniel' },
  fr: { '49d0563e': 'Claire', '8d0efd93': 'Lucas', fr_claire: 'Claire', fr_lucas: 'Lucas', fr_ines: 'Inès', fr_antoine: 'Antoine' } };
const HOMENS = ['lucas', 'daniel', 'antoine'];
const generoDe = n => HOMENS.includes(String(n).toLowerCase()) ? 'm' : 'f';
/* trecho gravado: prefere a mesma pessoa, depois alguém do mesmo gênero; senão devolve outra voz e avisa */
function trecho(lang, texto, quem) {
  const achados = [];
  for (const k of Object.keys(AUDIO)) { if (!k.startsWith(lang + '|')) continue; const sp = AUDIO[k];
    for (const [chave, c] of Object.entries(sp.clips)) { const i = chave.indexOf('|'); if (chave.slice(i + 1) === texto) achados.push({ arq: path.join(RAIZ, sp.file), de: c[0], dur: c[1] - c[0], voz: VOZ_CURSO[lang][chave.slice(0, i)] || '?' }); } }
  if (!quem) return achados[0] || null;
  return achados.find(a => a.voz.toLowerCase() === quem.toLowerCase()) || achados.find(a => generoDe(a.voz) === generoDe(quem)) || (achados[0] && { ...achados[0], trocada: true }) || null;
}
if (soManifesto) {
  /* só a narração em português: as falas no idioma usam o áudio já gravado do curso */
  const sem = [], itens = roteiro.aulas.flatMap(a => falasNumeradas(a).filter(f => { if (f.voz === 'narrador') return true; const t = trecho(a.idioma, f.texto, f.voz); if (!t) sem.push(f.texto); else if (t.trocada) sem.push(f.texto + ' (só existe na voz de ' + t.voz + ', não de ' + f.voz + ')'); return false; })
    .map(f => ({ role: 'pt_narrador', text: f.texto, lang: 'pt', f: f.arquivo })));
  if (sem.length) throw new Error('falas no idioma sem áudio no curso (troque por frases existentes): ' + sem.join(' | '));
  fs.writeFileSync(path.join(narr, 'manifest-video.json'), JSON.stringify(itens, null, 1));
  console.log(itens.length, 'falas do narrador no manifesto;', itens.reduce((s, i) => s + i.text.length, 0), 'caracteres'); process.exit(0);
}
function duracao(arq) { return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arq]).toString().trim()); }

fs.mkdirSync(saida, { recursive: true });
const { chromium } = await import('playwright');
const eco = fs.readFileSync(path.join(RAIZ, 'fonte/src/eco.js'), 'utf8');
for (const a of roteiro.aulas) {
  const falas = falasNumeradas(a); let t = 0.9, k = 0, avisos = [];
  /* "Repita comigo": até 3 frases-chave, mais devagar, com pausa para repetir, antes do fechamento */
  /* a primeira frase de cada explicação (sem diálogo), até 3 */
  const chave = [];
  a.cenas.forEach(c => { if (c.parte !== 'explicacao' || chave.length >= 3 || c.tela.some(l => /^[A-ZÀ-Ý][\wÀ-ÿ]+:\s/.test(l) && !/^[A-Z][a-z]+:\s*$/.test(l) && /^(Sarah|Lucas|Emma|Daniel|Claire|Inès|Antoine):/.test(l))) return;
    const f = c.falas.find(x => x.voz !== 'narrador' && trecho(a.idioma, x.texto, x.voz)); if (f && !chave.some(k => k.texto === f.texto)) chave.push(f); });
  const traduzir = txt => { for (const c of a.cenas) { const i = c.tela.findIndex(l => l.replace(/^([✓]\s*|[A-ZÀ-Ý][\wÀ-ÿ]+:\s+)/, '') === txt); if (i >= 0 && c.tela[i + 1] && !c.tela[i + 1].includes(txt)) return c.tela[i + 1]; } return ''; };
  const repita = chave.map(f => ({ parte: 'repita', eco: 'speaking', tela: [f.texto, traduzir(f.texto)], falas: [{ ...f, lento: true }], pausa_segundos: 0 }));
  const fimIdx = a.cenas.findIndex(c => c.parte === 'fechamento');
  const todas = fimIdx < 0 ? [...a.cenas, ...repita] : [...a.cenas.slice(0, fimIdx), ...repita, ...a.cenas.slice(fimIdx)];
  const sons = [];
  const cenas = todas.map(c => {
    const cena = { ini: t, parte: c.parte, eco: c.eco, tela: c.tela, falas: [], alvos: c.falas.filter(f => f.voz !== 'narrador').map(f => f.texto) };
    for (const f of c.falas) {
      const g = c.parte === 'repita' ? { arquivo: '-' } : falas[k++], alvo = f.voz !== 'narrador', proprio = path.join(narr, g.arquivo);
      let som = null;
      if (fs.existsSync(proprio)) som = { arq: proprio, de: 0, dur: duracao(proprio) };
      else if (alvo) { som = trecho(a.idioma, f.texto, f.voz); if (!som) avisos.push('sem áudio: ' + f.texto); else if (som.trocada) avisos.push('voz trocada: ' + f.texto + ' → ' + som.voz); }
      else avisos.push('narração ainda não gravada: ' + g.arquivo);
      if (som && f.lento) som = { ...som, tempo: 0.8 };
      const dur = som ? som.dur / (som.tempo || 1) : Math.max(1.6, f.texto.length / 14);
      if (som) sons.push({ ...som, em: t });
      cena.falas.push({ ini: t, fim: t + dur, voz: som && som.trocada && som.voz !== '?' ? som.voz : f.voz, texto: f.texto, alvo }); t += dur + 0.35;
    }
    if (c.parte === 'repita') c.pausa_segundos = Math.round((cena.falas[0].fim - cena.falas[0].ini) * 1.3 + 1.5);
    if (c.pausa_segundos > 0) { cena.pausa = [t, t + c.pausa_segundos]; t += c.pausa_segundos; }
    t += 0.6; cena.fim = t; return cena;
  });
  const final = t + 0.4, duracaoTotal = t + 3.2;
  /* vídeo: toca a cena em tempo real e grava */
  const nav = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const ctx = await nav.newContext({ viewport: { width: 720, height: 1280 }, recordVideo: { dir: saida, size: { width: 720, height: 1280 } } });
  const inicio = Date.now(), pg = await ctx.newPage();
  await pg.goto('file://' + path.join(AQUI, 'cena.html')); await pg.addScriptTag({ content: eco }); await pg.waitForTimeout(300);
  const corte = (Date.now() - inicio) / 1000;
  await pg.evaluate(A => window.tocarAula(A), { titulo: a.titulo, idioma: a.idioma, nivel: a.nivel, cenas, duracao: duracaoTotal, final });
  await pg.waitForFunction(() => window.__fim === true, null, { timeout: (duracaoTotal + 20) * 1000 });
  const webm = await pg.video().path(); await ctx.close(); await nav.close();
  /* áudio: cada fala no seu tempo */
  const wav = path.join(saida, a.id + '.wav'), ent = [], filtros = [];
  sons.forEach((s, i) => { ent.push('-ss', String(s.de), '-t', String(s.dur), '-i', s.arq); filtros.push(`[${i}:a]aresample=48000${s.tempo ? ',atempo=' + s.tempo : ''},adelay=${Math.round(s.em * 1000)}:all=1[a${i}]`); });
  if (sons.length) execFileSync('ffmpeg', ['-y', '-v', 'error', ...ent, '-filter_complex', filtros.join(';') + ';' + sons.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${sons.length}:normalize=0,apad,atrim=0:${duracaoTotal.toFixed(2)}`, wav]);
  else execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', String(duracaoTotal), wav]);
  const mp4 = path.join(saida, a.id + '.mp4');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', corte.toFixed(2), '-i', webm, '-i', wav, '-t', duracaoTotal.toFixed(2), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-r', '30', '-c:a', 'aac', '-b:a', '160k', mp4]);
  fs.rmSync(webm); fs.rmSync(wav);
  console.log(`${mp4} · ${duracaoTotal.toFixed(1)} s` + (avisos.length ? '\n  ' + avisos.join('\n  ') : ''));
}
