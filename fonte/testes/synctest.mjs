import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
const b=await pw.chromium.launch(); const U='http://127.0.0.1:8766/index.html'; const errs=[];
// aparelho A: perfil criado pela tela de cadastro
const A=await b.newContext({viewport:{width:390,height:844}}); const pa=await A.newPage(); pa.on('pageerror',e=>errs.push('A '+e.message));
await pa.goto(U); await pa.waitForTimeout(1500);
console.log('A tela inicial tem Começar:', await pa.getByText('Começar').count());
console.log('A perfis:', await pa.evaluate(()=>JSON.parse(localStorage.getItem('idiomas-app-v2')).perfis.length));
// cria o perfil direto no estado e salva pelo app (simula o fim do cadastro)
await pa.evaluate(()=>{ const S=JSON.parse(localStorage.getItem('idiomas-app-v2')); S.perfis.push({id:'p1',nome:'Bia',pin:'4321',idioma:'en',idiomas:['en','fr'],desde:'out 2026',sequencia:0,melhorSequencia:0,xp:0,hojeFeito:false,ultimoDia:'',semana:[0,0,0,0,0,0,0],xpSemana:[0,0,0,0,0,0,0],minutosHoje:0,palavras:0,progresso:{fr:0,en:3},metasHoje:{licoes:0,revisadas:0},motivos:[]}); localStorage.setItem('idiomas-app-v2',JSON.stringify(S)); });
await pa.reload(); await pa.waitForTimeout(2500);
console.log('servidor depois de A:', JSON.stringify(await (await fetch('http://127.0.0.1:8790/')).json()).slice(0,120));
// aparelho B: novo, sem nada salvo
const B=await b.newContext({viewport:{width:390,height:844}}); const pb=await B.newPage(); pb.on('pageerror',e=>errs.push('B '+e.message));
await pb.goto(U); await pb.waitForTimeout(3000);
console.log('B perfis:', await pb.evaluate(()=>{const S=JSON.parse(localStorage.getItem('idiomas-app-v2'));return S&&S.perfis.map(p=>p.nome+':'+p.progresso.en);}));
await pb.getByText('Já tenho perfil').click().catch(()=>{}); await pb.waitForTimeout(500);
await pb.getByText('Bia').first().click(); await pb.waitForTimeout(300);
for (const d of '4321') { await pb.keyboard.press(d); await pb.waitForTimeout(120); } await pb.waitForTimeout(1200);
await pb.screenshot({path:'pwa-B.png'});
console.log('B entrou:', await pb.evaluate(()=>JSON.parse(localStorage.getItem('idiomas-app-v2')).ativo));
console.log('SW:', await pb.evaluate(()=>navigator.serviceWorker.getRegistrations().then(r=>r.length)));
console.log('erros', errs); await b.close();
