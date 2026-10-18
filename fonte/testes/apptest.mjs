import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
const b = await pw.chromium.launch(); const p = await b.newPage({viewport:{width:390,height:844}});
const errs=[]; p.on('pageerror', e=>errs.push(e.message));
await p.addInitScript(()=>{ window.__clips=0; const op=HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play=function(){ window.__clips++; return Promise.resolve(); }; });
await p.goto('http://127.0.0.1:8765/index.html'); await p.waitForTimeout(800);
const info = await p.evaluate(()=>{ const r={}; for(const k in LICOES){ if(k.startsWith('rev'))continue; r.n=(r.n||0)+1; r.ex=(r.ex||0)+LICOES[k].exercicios.length; LICOES[k].exercicios.forEach(e=>{ if(e.tipo==='escolha'&&(e.correta<0||e.opcoes.length<2)) (r.bad=r.bad||[]).push(k); if(e.tipo==='montar'&&e.resposta.length<1)(r.bad=r.bad||[]).push(k);}); }
  let miss=0, tot=0; for(const k in LICOES){ if(k.startsWith('rev'))continue; LICOES[k].exercicios.forEach(e=>{ if(e.ocultar||e.etiqueta==='dificil') return; tot++; if(!AUD.say(e.frase, LICOES[k].idioma)) miss++; }); }
  AUD.stop(); r.audioMiss=miss; r.audioTot=tot; return r; });
console.log(JSON.stringify(info).slice(0,500));
await p.screenshot({path:'s1.png'});
console.log('erros', errs);
await b.close();
