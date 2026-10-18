import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
const b=await pw.chromium.launch(); const errs=[]; const U='http://127.0.0.1:8766/index.html';
const c=await b.newContext({viewport:{width:390,height:844}}); const p=await c.newPage(); p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{ HTMLMediaElement.prototype.play=function(){return Promise.resolve();}; });
await p.goto(U); await p.waitForTimeout(1500);
await p.evaluate(()=>{ const S=JSON.parse(localStorage.getItem('idiomas-app-v2')); S.perfis=[{id:'t1',nome:'Teste',pin:'1111',idioma:'en',idiomas:['en','fr'],desde:'out 2026',sequencia:0,melhorSequencia:0,xp:0,hojeFeito:false,ultimoDia:'',semana:[0,0,0,0,0,0,0],xpSemana:[0,0,0,0,0,0,0],minutosHoje:0,palavras:0,progresso:{fr:0,en:7},metasHoje:{licoes:0,revisadas:0},motivos:[]}]; S.ativo='t1'; S.visto=true; localStorage.setItem('idiomas-app-v2',JSON.stringify(S)); });
await p.reload(); await p.waitForTimeout(1500);
async function login(){
  if(await p.getByText('Continuar lição').count()) return;
  if(await p.getByText('Já tenho perfil').count()){ await p.getByText('Já tenho perfil').click(); await p.waitForTimeout(300);}
  if(!(await p.$('.ui-keypad'))){ await p.getByText('Teste').first().click(); await p.waitForTimeout(300);}
  for (const d of '1111') { await p.keyboard.press(d); await p.waitForTimeout(100);} await p.waitForTimeout(800);
}
await login();
// 1) lição: errar de propósito
await p.getByText('Continuar lição').click(); await p.waitForTimeout(800);
for(let k=0;k<8;k++){
  const opts=await p.$$('.u015-opt');
  if(opts.length){
    const certa=await p.evaluate(()=>[...document.querySelectorAll('.u015-opt')].length);
    await opts[k%opts.length].click(); await p.click('#acao'); await p.waitForTimeout(300);
  } else { const chip=await p.$('.u019-list .u019-chip'); if(chip){ await chip.click(); await p.click('#acao'); await p.waitForTimeout(300);} }
  if(await p.$('.ia-porque')) break;
  await p.click('#acao').catch(()=>{}); await p.waitForTimeout(400);
}
const bt=await p.$('.ia-porque'); console.log('botão Por que errei:', !!bt);
if(bt){ await bt.click(); await p.waitForTimeout(900); console.log('explicação:', await p.$eval('.ia-explica',e=>e.innerHTML).catch(()=>'nenhuma')); await p.screenshot({path:'ia-1.png'}); }
// 2) dúvidas
await p.goto(U); await p.waitForTimeout(1200); await login();
await p.evaluate(()=>{ document.querySelector('.studio-nav')?.click(); }); await p.waitForTimeout(600);
await p.getByRole('button',{name:'Perguntar'}).click(); await p.waitForTimeout(500);
await p.getByRole('button',{name:/make e do/}).click(); await p.waitForTimeout(900);
console.log('chat:', await p.$$eval('.ia-msg',ms=>ms.map(m=>m.className.split('--')[1]+': '+m.textContent)));
await p.screenshot({path:'ia-2.png'});
// 3) redação
await p.goto(U); await p.waitForTimeout(1200); await login();
await p.evaluate(()=>{ document.querySelector('.studio-nav')?.click(); }); await p.waitForTimeout(600);
await p.getByRole('button',{name:'Escrever uma redação'}).click(); await p.waitForTimeout(600);
console.log('tarefa:', await p.$eval('.card.studio-stack h2',e=>e.textContent), '| avisos de prévia:', (await p.$$('.studio-demo')).length, '| botão demo:', await p.getByText('Usar texto de demonstração').count());
await p.fill('textarea','Hello! I is Gabriel and I live in Brazil.'); await p.getByRole('button',{name:'Corrigir'}).click(); await p.waitForTimeout(2000);
console.log('resultado:', await p.$eval('.studio-score',e=>e.textContent).catch(()=>'?'), '|', await p.$$eval('.studio-mark',m=>m.map(x=>x.textContent)), '|', await p.$eval('.studio-heading',e=>e.textContent).catch(()=>'?'));
await p.screenshot({path:'ia-3.png',fullPage:true});
await p.waitForTimeout(2500);
console.log('servidor:', JSON.stringify((await (await fetch('http://127.0.0.1:8790/')).json()).log));
console.log('erros', errs); await b.close();
