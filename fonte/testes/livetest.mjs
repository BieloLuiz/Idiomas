import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
const b=await pw.chromium.launch({args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--autoplay-policy=no-user-gesture-required']}); const errs=[]; const U='http://127.0.0.1:8766/index.html';
const c=await b.newContext({viewport:{width:390,height:844},permissions:['microphone']}); const p=await c.newPage(); p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{
  window.__ws={sent:[],url:''};
  class FakeWS { constructor(u){ window.__ws.url=u; this.readyState=0; setTimeout(()=>{this.readyState=1; this.onopen&&this.onopen();},50); }
    send(d){ const m=JSON.parse(d); window.__ws.sent.push(Object.keys(m)[0]+(m.realtimeInput?':'+Object.keys(m.realtimeInput)[0]:''));
      const em=o=>setTimeout(()=>this.onmessage&&this.onmessage({data:JSON.stringify(o)}),30);
      if(m.setup) em({setupComplete:{}});
      if(m.realtimeInput&&m.realtimeInput.text){ const pcm=btoa(String.fromCharCode(...new Uint8Array(4800))); em({serverContent:{modelTurn:{parts:[{inlineData:{mimeType:'audio/pcm;rate=24000',data:pcm}}]}}}); em({serverContent:{outputTranscription:{text:'Bonjour ! Comment ça va ?'}}}); setTimeout(()=>em({serverContent:{turnComplete:true}}),60); }
      if(m.realtimeInput&&m.realtimeInput.audio&&!window.__falou){ window.__falou=1; setTimeout(()=>{ em({serverContent:{inputTranscription:{text:'Ça va bien, merci.'}}}); em({serverContent:{interrupted:true}}); em({serverContent:{outputTranscription:{text:'Super ! Tu fais quoi ce soir ?'}}}); em({serverContent:{turnComplete:true}}); },300); } }
    close(){ this.readyState=3; } }
  window.WebSocket=FakeWS;
});
await p.goto(U); await p.waitForTimeout(1500);
await p.evaluate(()=>{ const S=JSON.parse(localStorage.getItem('idiomas-app-v2')); S.perfis=[{id:'t1',nome:'Teste',pin:'1111',idioma:'fr',idiomas:['en','fr'],desde:'out 2026',sequencia:0,melhorSequencia:0,xp:0,hojeFeito:false,ultimoDia:'',semana:[0,0,0,0,0,0,0],xpSemana:[0,0,0,0,0,0,0],minutosHoje:0,palavras:0,progresso:{fr:22,en:0},metasHoje:{licoes:0,revisadas:0},motivos:[]}]; S.ativo='t1'; S.visto=true; localStorage.setItem('idiomas-app-v2',JSON.stringify(S)); });
await p.reload(); await p.waitForTimeout(1500);
if(!(await p.getByText('Continuar lição').count()) && !(await p.getByText('Continuar aprendendo').count())){ if(await p.getByText('Já tenho perfil').count()) await p.getByText('Já tenho perfil').click(); await p.waitForTimeout(300); if(!(await p.$('.ui-keypad'))) await p.getByText('Teste').first().click(); for (const d of '1111') await p.keyboard.press(d); await p.waitForTimeout(800); }
await p.evaluate(()=>document.querySelector('.studio-nav')?.click()); await p.waitForTimeout(600);
await p.getByRole('button',{name:'Escolher conversa'}).first().click(); await p.waitForTimeout(400);
await p.getByRole('button',{name:'Escolher este cenário'}).first().click(); await p.waitForTimeout(400);
await p.getByRole('button',{name:'Permitir microfone'}).click(); await p.waitForTimeout(600);
await p.getByRole('button',{name:'Começar conversa'}).click(); await p.waitForTimeout(2500);
console.log('título:', await p.$eval('.studio-call .ui-label',e=>e.textContent), '| estado:', await p.$eval('.studio-state',e=>e.textContent));
console.log('legendas:', await p.$eval('.studio-subtitles',e=>e.textContent));
console.log('ws:', await p.evaluate(()=>[window.__ws.url.slice(0,120), [...new Set(window.__ws.sent)]]));
await p.screenshot({path:'live.png'});
await p.getByRole('button',{name:'Encerrar'}).click(); await p.waitForTimeout(1500);
console.log('resumo:', await p.$eval('.studio-heading',e=>e.textContent).catch(()=>'?'));
console.log('erros', errs); await b.close();
