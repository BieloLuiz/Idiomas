import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
const b=await pw.chromium.launch({args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']}); const errs=[]; const U='http://127.0.0.1:8766/index.html';
const c=await b.newContext({viewport:{width:390,height:844},permissions:['microphone']}); const p=await c.newPage(); p.on('pageerror',e=>errs.push(e.message));
await p.goto(U); await p.waitForTimeout(1500);
await p.evaluate(()=>{ const S=JSON.parse(localStorage.getItem('idiomas-app-v2')); S.perfis=[{id:'t1',nome:'Teste',pin:'1111',idioma:'fr',idiomas:['en','fr'],desde:'out 2026',sequencia:0,melhorSequencia:0,xp:0,hojeFeito:false,ultimoDia:'',semana:[0,0,0,0,0,0,0],xpSemana:[0,0,0,0,0,0,0],minutosHoje:0,palavras:0,progresso:{fr:12,en:0},metasHoje:{licoes:0,revisadas:0},motivos:[]}]; S.ativo='t1'; S.visto=true; localStorage.setItem('idiomas-app-v2',JSON.stringify(S)); });
await p.reload(); await p.waitForTimeout(1500);
if(!(await p.getByText('Continuar lição').count())){ if(await p.getByText('Já tenho perfil').count()) await p.getByText('Já tenho perfil').click(); await p.waitForTimeout(300); if(!(await p.$('.ui-keypad'))) await p.getByText('Teste').first().click(); for (const d of '1111') await p.keyboard.press(d); await p.waitForTimeout(800); }
await p.evaluate(()=>document.querySelector('.studio-nav')?.click()); await p.waitForTimeout(600);
await p.getByRole('button',{name:'Treinar',exact:true}).click(); await p.waitForTimeout(600);
console.log('frases:', await p.$$eval('.pron-frase',x=>x.map(e=>e.textContent)));
const btn=(await p.$$('.pron-card .ui-btn--primary'))[0]; await btn.click(); await p.waitForTimeout(2500);
console.log('gravando:', await btn.textContent()); await btn.click(); await p.waitForTimeout(2500);
console.log('resultado:', await p.$eval('.pron-res',e=>e.textContent)); console.log('marcas:', await p.$$eval('.pron-card:first-child .pron-frase span, .pron-frase', x=>[]).catch(()=>[]));
console.log('erradas:', await p.$$eval('.pron-erro',x=>x.map(e=>e.textContent)));
await p.screenshot({path:'pron.png'});
console.log('erros', errs); await b.close();
