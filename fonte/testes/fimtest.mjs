import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
const b=await pw.chromium.launch(); const errs=[]; const U='http://127.0.0.1:8766/index.html';
const c=await b.newContext({viewport:{width:390,height:844}}); const p=await c.newPage(); p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text().slice(0,200)); });
await p.addInitScript(()=>{ HTMLMediaElement.prototype.play=function(){return Promise.resolve();}; });
await p.goto(U); await p.waitForTimeout(1200);
await p.evaluate(()=>{ const S=JSON.parse(localStorage.getItem('idiomas-app-v2')); S.perfis=[{id:'t1',nome:'Teste',pin:'1111',idioma:'en',idiomas:['en','fr'],desde:'out 2026',sequencia:0,melhorSequencia:0,xp:0,hojeFeito:false,ultimoDia:'',semana:[0,0,0,0,0,0,0],xpSemana:[0,0,0,0,0,0,0],minutosHoje:0,palavras:0,progresso:{fr:0,en:0},metasHoje:{licoes:0,revisadas:0},motivos:[]}]; S.ativo='t1'; S.visto=true; localStorage.setItem('idiomas-app-v2',JSON.stringify(S)); });
await p.reload(); await p.waitForTimeout(1500);
await p.getByText('Continuar aprendendo').click(); await p.waitForTimeout(800);
const L=await p.evaluate(()=>LICOES['en-u1|Palavras novas'].exercicios.map(e=>({frase:e.ocultar||e.frase,tipo:e.tipo,certa:e.tipo==='escolha'?e.opcoes[e.correta]:e.resposta})));
for(let k=0;k<30;k++){
  const acao=await p.$eval('#acao',e=>e.textContent).catch(()=>null); if(!acao) break;
  if(/Encerrar|Continuar/.test(acao) && await p.$('.screen.fim')) { console.log('tela final, botão:', acao); break; }
  const txt=await p.$eval('#tela',e=>e.innerText);
  const ex=L.find(x=>txt.includes(x.frase));
  if(ex && ex.tipo==='escolha'){ const opts=await p.$$('.u015-opt'); for(const o of opts){ if((await o.innerText()).includes(ex.certa)){ await o.click(); break; } } }
  else if(ex){ for(const w of ex.certa){ const ch=await p.$(`.u019-list .u019-chip[aria-pressed="false"] >> text="${w}"`); if(ch) await ch.click(); } }
  await p.click('#acao'); await p.waitForTimeout(300); await p.click('#acao').catch(()=>{}); await p.waitForTimeout(300);
}
await p.screenshot({path:'fim1.png'});
await p.click('#acao'); await p.waitForTimeout(1500);
console.log('depois do botão:', await p.evaluate(()=>[location.hash, !!document.querySelector('.screen.fim'), document.querySelector('.tabbar')?'tabbar':'sem tabbar', document.body.innerText.slice(0,120).replace(/\n/g,' | ')]));
await p.screenshot({path:'fim2.png'});
console.log('erros', errs); await b.close();
