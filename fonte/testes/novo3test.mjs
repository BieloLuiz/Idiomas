import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
const b=await pw.chromium.launch(); const errs=[]; const U='http://127.0.0.1:8766/index.html';
const c=await b.newContext({viewport:{width:390,height:844}}); const p=await c.newPage(); p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{ HTMLMediaElement.prototype.play=function(){return Promise.resolve();}; });
await p.goto(U); await p.waitForTimeout(1500);
await p.evaluate(()=>{ const S=JSON.parse(localStorage.getItem('idiomas-app-v2')); S.perfis=[{id:'t1',nome:'Teste',pin:'1111',idioma:'en',idiomas:['en','fr'],desde:'out 2026',sequencia:0,melhorSequencia:0,xp:0,hojeFeito:false,ultimoDia:'',semana:[0,0,0,0,0,0,0],xpSemana:[0,0,0,0,0,0,0],minutosHoje:0,palavras:0,progresso:{fr:0,en:7},metasHoje:{licoes:0,revisadas:0},motivos:[]}]; S.ativo=null; S.visto=true; localStorage.setItem('idiomas-app-v2',JSON.stringify(S)); });
await p.reload(); await p.waitForTimeout(1500);
await p.screenshot({path:'n3-0.png'});
if(await p.getByText('Já tenho perfil').count()) { await p.getByText('Já tenho perfil').click(); await p.waitForTimeout(400); }
if(!(await p.$('.ui-keypad'))) await p.getByText('Teste').first().click(); await p.waitForTimeout(300);
for (const d of '1111') { await p.keyboard.press(d); await p.waitForTimeout(100);} await p.waitForTimeout(1200);
await p.screenshot({path:'n3-1.png'});
console.log('tela após PIN:', await p.evaluate(()=>document.querySelector('.tabbar')?.innerText.replace(/\n/g,' | ')), '| botões:', await p.$$eval('button',bs=>bs.map(x=>x.textContent.trim()).filter(Boolean).slice(0,25).join(' · ')));
console.log('studio-nav:', !!(await p.$('.studio-nav')));
for (const aba of ['Praticar','Descobrir']) { const t=p.getByText(aba,{exact:true}).first(); if(await t.count()){ await t.click(); await p.waitForTimeout(1200); await p.screenshot({path:'n3-'+aba+'.png'}); console.log(aba,':', (await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,400)); } else console.log('sem', aba); }
console.log('erros', errs); await b.close();
