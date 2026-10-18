import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
const b=await pw.chromium.launch(); const errs=[]; const U='http://127.0.0.1:8766/index.html';
const c=await b.newContext({viewport:{width:390,height:844}}); const p=await c.newPage(); p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{ HTMLMediaElement.prototype.play=function(){return Promise.resolve();}; });
await p.goto(U); await p.waitForTimeout(1500);
await p.evaluate(()=>{ const S=JSON.parse(localStorage.getItem('idiomas-app-v2')); S.perfis=[{id:'t1',nome:'Teste',pin:'1111',idioma:'fr',idiomas:['en','fr'],desde:'out 2026',sequencia:0,melhorSequencia:0,xp:0,hojeFeito:false,ultimoDia:'',semana:[0,0,0,0,0,0,0],xpSemana:[0,0,0,0,0,0,0],minutosHoje:0,palavras:0,progresso:{fr:7,en:0},metasHoje:{licoes:0,revisadas:0},motivos:[]}]; S.ativo='t1'; S.visto=true; localStorage.setItem('idiomas-app-v2',JSON.stringify(S)); });
await p.reload(); await p.waitForTimeout(1500);
async function login(){ if(await p.getByText('Continuar lição').count()) return; if(await p.getByText('Já tenho perfil').count()) await p.getByText('Já tenho perfil').click(); await p.waitForTimeout(300); if(!(await p.$('.ui-keypad'))) await p.getByText('Teste').first().click(); for (const d of '1111') await p.keyboard.press(d); await p.waitForTimeout(800); }
await login();
const erros=()=>p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('idiomas-app-v2'));const e=(S.perfis[0].ecoStudio||{}).erros||[];return e.map(x=>x.fonte+':'+x.correta.slice(0,30)+':'+x.acertos);});
// 1) erro na lição
await p.getByText('Continuar lição').click(); await p.waitForTimeout(800);
for(let k=0;k<6;k++){ const o=await p.$$('.u015-opt'); if(o.length){ await o[k%o.length].click(); await p.click('#acao'); await p.waitForTimeout(300);} else { const ch=await p.$('.u019-list .u019-chip'); if(ch){await ch.click(); await p.click('#acao'); await p.waitForTimeout(300);} } if(await p.$('.ui-banner--wrong')) break; await p.click('#acao').catch(()=>{}); await p.waitForTimeout(300); }
console.log('erros após lição:', await erros());
// 2) ditado
await p.goto(U); await p.waitForTimeout(1200); await login();
await p.evaluate(()=>document.querySelector('.studio-nav')?.click()); await p.waitForTimeout(600);
await p.getByRole('button',{name:'Fazer ditado'}).click(); await p.waitForTimeout(500);
const f=await p.evaluate(()=>{ const u=COURSE.fr.units[1]; return u.dict.map(x=>x.t); }); console.log('unidade ditado:', await p.$eval('.studio-field select',e=>e.selectedOptions[0].textContent), f[0]);
const tas=await p.$$('.dit-input'); await tas[0].fill('Bonjour tout le monde'); await p.getByRole('button',{name:'Conferir'}).first().click(); await p.waitForTimeout(300);
console.log('ditado errado:', await p.$eval('.pron-res',e=>e.textContent.slice(0,140)));
const cur=await p.evaluate(()=>{ const sel=document.querySelector('.studio-field select'); const m=/^(en|fr)-u(\d+)$/.exec(sel.value); return COURSE[m[1]].units[+m[2]-1].dict[1].t; });
await tas[1].fill(cur.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')); await p.getByRole('button',{name:'Conferir'}).nth(1).click(); await p.waitForTimeout(300);
console.log('ditado sem acento:', await p.$$eval('.pron-res',e=>e[1].textContent.slice(0,80)));
console.log('erros após ditado:', await erros());
// 3) revisão
await p.goto(U); await p.waitForTimeout(1200); await login();
await p.evaluate(()=>document.querySelector('.studio-nav')?.click()); await p.waitForTimeout(600);
console.log('card:', await p.$$eval('.studio-feature h2',x=>x.map(e=>e.textContent)));
await p.getByRole('button',{name:'Revisar agora'}).click(); await p.waitForTimeout(500);
console.log('métricas:', await p.$eval('.studio-metrics',e=>e.textContent));
await p.getByRole('button',{name:'Praticar meus erros'}).click(); await p.waitForTimeout(1500);
console.log('lição:', await p.$eval('#tela',e=>e.textContent.slice(0,120)));
for(let k=0;k<12;k++){ const o=await p.$$('.u015-opt'); if(o.length){ const i=await p.evaluate(()=>[...document.querySelectorAll('.u015-opt')].findIndex(x=>/suis/.test(x.textContent))); await o[Math.max(0,i)].click(); await p.click('#acao'); await p.waitForTimeout(250); await p.click('#acao').catch(()=>{}); await p.waitForTimeout(300); continue; }
  const chips=await p.$$('.u019-list .u019-chip'); if(chips.length){ for(const w of ['Eu','sou','brasileiro']){ const ch=await p.$(`.u019-list .u019-chip:not([aria-pressed="true"]) >> text="${w}"`); if(ch) await ch.click(); } await p.click('#acao'); await p.waitForTimeout(250); await p.click('#acao').catch(()=>{}); await p.waitForTimeout(300); continue; } break; }
await p.waitForTimeout(800);
console.log('depois da revisão:', await erros(), '| tela:', await p.evaluate(()=>document.title+' '+(document.querySelector('.ui-toast,.toast')||{}).textContent));
console.log('erros', errs); await b.close();
