import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
const b=await pw.chromium.launch(); const errs=[]; const U='http://127.0.0.1:8766/index.html';
const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}); const p=await c.newPage(); p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{ HTMLMediaElement.prototype.play=function(){return Promise.resolve();}; });
await p.goto(U); await p.waitForTimeout(1200);
await p.evaluate(()=>{ const S=JSON.parse(localStorage.getItem('idiomas-app-v2')); S.perfis=[{id:'t1',nome:'Teste',pin:'1111',idioma:'fr',idiomas:['en','fr'],desde:'out 2026',sequencia:0,melhorSequencia:0,xp:0,hojeFeito:false,ultimoDia:'',semana:[0,0,0,0,0,0,0],xpSemana:[0,0,0,0,0,0,0],minutosHoje:0,palavras:0,progresso:{fr:7,en:0},metasHoje:{licoes:0,revisadas:0},motivos:[],ecoStudio:{calls:[],writings:[],notebook:[],words:[],drafts:{},erros:[{id:'e1',fonte:'ditado',lang:'fr',unidade:'X',frase:'Je suis brésilien.',correta:'Je suis brésilien.',dada:'Je es',nota:'',vezes:1,acertos:0,em:1}]}}]; S.ativo='t1'; S.visto=true; localStorage.setItem('idiomas-app-v2',JSON.stringify(S)); });
await p.reload(); await p.waitForTimeout(1500);
await p.evaluate(()=>{}); await p.getByText('Praticar',{exact:true}).first().tap(); await p.waitForTimeout(400);
await p.getByText('Quero revisar').first().tap(); await p.waitForTimeout(300); await p.getByRole('button',{name:'Revisar meus erros'}).tap(); await p.waitForTimeout(400);
await p.getByRole('button',{name:'Praticar meus erros'}).tap(); await p.waitForTimeout(1500);
for(let k=0;k<20;k++){ if(await p.$('.screen.fim')) break; const o=await p.$$('.u015-opt'); if(o.length){ const i=await p.evaluate(()=>[...document.querySelectorAll('.u015-opt')].findIndex(x=>/suis/.test(x.textContent))); await o[Math.max(0,i)].tap(); }
  else { for(const w of ['Eu','sou','brasileiro']){ const ch=await p.$(`.u019-list .u019-chip[aria-pressed="false"] >> text="${w}"`); if(ch) await ch.tap(); } }
  await p.tap('#acao'); await p.waitForTimeout(250); if(!(await p.$('.screen.fim'))){ await p.tap('#acao').catch(()=>{}); await p.waitForTimeout(250);} }
console.log('fim:', !!(await p.$('.screen.fim')), await p.$eval('#acao',e=>e.textContent).catch(()=>'-'));
await p.tap('#acao'); await p.waitForTimeout(1200);
console.log('depois:', !!(await p.$('.screen.fim')), (await p.evaluate(()=>document.body.innerText)).slice(0,80).replace(/\n/g,' | '));
console.log('erros', errs); await b.close();
