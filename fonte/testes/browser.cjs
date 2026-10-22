const { chromium }=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
function profile(id,nome,lang='fr'){return{id,nome,pin:'1234',idioma:lang,idiomas:['fr','en'],desde:'out 2026',xp:0,sequencia:0,melhorSequencia:0,hojeFeito:false,ultimoDia:'',semana:[0,0,0,0,0,0,0],xpSemana:[0,0,0,0,0,0,0],minutosHoje:0,palavras:0,progresso:{fr:240,en:240},metasHoje:{licoes:0,revisadas:0},motivos:[],revisao:0};}
const initial=()=>({versao:2,ativo:'p1',ultimo:'p1',visto:true,cfg:{tema:'claro',meta:15,voz:.9,fala:true,efeitos:false,motion:true},perfis:[profile('p1','Ana'),profile('p2','Beto')]});
let db={},delayWriting=0,sessao='';
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://local');if(url.pathname==='/api'){
 res.setHeader('Content-Type','application/json');if(req.method==='GET'){res.end(JSON.stringify({googleClientId:'test-client'}));return;}
 let body='';req.on('data',b=>body+=b);req.on('end',()=>{let q=JSON.parse(body);if(q.acao==='entrarGoogle'){if(!q.token){res.end('{"erro":"auth_required"}');return;}sessao='s1.'+require('node:crypto').randomBytes(32).toString('hex');res.end(JSON.stringify({ok:true,sessao,expira:Date.now()+60*86400000}));return;}if(!sessao||q.token!==sessao){res.end('{"erro":"auth_required"}');return;}let r={ok:true};if(q.acao==='sair'){sessao='encerrada';res.end('{"ok":true}');return;}
 if(q.acao==='listar')r={perfis:Object.values(db)};
 if(q.acao==='salvar'){let perfis=[],conflitos=[];for(let p of q.perfis){if(db[p.id]&&(db[p.id].revisao||0)!==(p.revisao||0)){conflitos.push(db[p.id]);continue;}db[p.id]={...p,revisao:(p.revisao||0)+1};perfis.push(db[p.id]);}r={perfis,conflitos};}
 if(q.acao==='ia'){r=q.tipo==='liveToken'?{token:'auth_tokens/mock',modelo:'gemini-3.8-live'}:q.tipo==='redacao'?{dados:{corrigido:q.dados.texto,nota:8,resumo:'Bom texto',erros:[]}}:q.tipo==='conversa'?{fala:'Bonjour !',ouvido:q.dados.texto||'',traducao:'Olá!',sugestao:'Bonjour !'}:{resumo:'Bom trabalho',erros:[],palavras:[]};}
 setTimeout(()=>res.end(JSON.stringify(r)),q.tipo==='redacao'?delayWriting:0);});return;}
 if(url.pathname==='/config.js'){res.setHeader('Content-Type','application/javascript');res.end('window.IDIOMAS_API="";');return;}
 const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'})[path.extname(file)]||'text/plain');res.end(data);});});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});const errors=[];
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},permissions:['microphone']});
  await context.route('https://**',r=>r.abort());
  await context.route('**/config.js',r=>r.fulfill({contentType:'application/javascript',body:'window.IDIOMAS_API="";'}));
  await context.addInitScript(state=>localStorage.getItem('idiomas-app-v2')||localStorage.setItem('idiomas-app-v2',JSON.stringify(state)),initial());
  await context.addInitScript(()=>caches.open('outro-aplicativo-fixture'));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.locator('.ux-greeting').waitFor();
  for(const width of [320,390,820,1280]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Home overflow at '+width);}
  await page.setViewportSize({width:390,height:844});await page.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Perfil',exact:true}).click();
  await page.getByRole('button',{name:'Guias das unidades',exact:true}).click();await page.getByRole('button',{name:/Il fut une époque/}).click();
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  assert.ok(await page.evaluate(()=>caches.has('outro-aplicativo-fixture')));
  await page.getByRole('button',{name:'Baixar áudio desta unidade para usar sem internet',exact:true}).click();await page.getByRole('button',{name:'Áudio disponível neste aparelho',exact:true}).waitFor();
  await context.setOffline(true);assert.deepEqual(await page.evaluate(async()=>{let r=await fetch('/audio/fr-c1-u01.mp3',{headers:{Range:'bytes=0-31'}});return[r.status,(await r.arrayBuffer()).byteLength];}),[206,32]);await context.setOffline(false);
  console.log('PASS: PWA preserva cache de outro aplicativo e reproduz Range do áudio baixado sem rede');
  await page.getByRole('button',{name:'Praticar esta unidade',exact:true}).click();
  assert.ok((await page.locator('.ask-top').textContent()).includes('Il fut une époque'));
  await page.getByRole('button',{name:'Sair da lição',exact:true}).click();
  await page.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Praticar',exact:true}).click();await page.getByRole('button',{name:/Quero explorar/}).click();await page.getByRole('button',{name:'Todas as descobertas',exact:true}).click();
  await page.getByRole('button',{name:'Ler o diálogo',exact:true}).click();assert.equal(await page.locator('p[lang=fr]').count()>0,true);assert.ok(!(await page.locator('main.page').textContent()).includes('I would like a coffee'));
  await page.screenshot({path:'.build/frances-mobile.png',fullPage:true});
  await context.close();console.log('PASS: curso C1 correto, Descobrir em francês e larguras 320/390/820/1280');

  /* revisão 2: escuta, preferências, dificuldades e configurações */
  const c2=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  await c2.route('https://**',r=>r.abort());await c2.route('**/config.js',r=>r.fulfill({contentType:'application/javascript',body:'window.IDIOMAS_API="";'}));
  const st2=initial();st2.perfis[1].preferencias={silent:true,translations:false,textSize:125};
  st2.perfis[0].discovery={fr:{cards:[],completed:[],errors:[{id:'fr|0|order',said:'viens Tu',correct:"Tu viens d'où ?",activity:3,item:0,resolved:false,explanation:'U1'}]}};
  await c2.addInitScript(state=>localStorage.getItem('idiomas-app-v2')||localStorage.setItem('idiomas-app-v2',JSON.stringify(state)),st2);
  const q=await c2.newPage();q.on('pageerror',e=>errors.push(e.message));await q.goto(url);await q.locator('.ux-greeting').waitFor();
  const escuta=await q.evaluate(()=>{const out={semFrase:0,escutaPt:0,total:0};for(const key of Object.keys(LICOES)){if(!key.endsWith('|Escuta'))continue;for(const ex of LICOES[key].exercicios){out.total++;if(ex.semFrase){out.semFrase++;if(ex.audio||!ex.explicacao)out.escutaPt++;}else if(ex.escuta&&/\b(verbo|feminino|acrescente|sujeito|pergunta|plural)\b/i.test(ex.frase))out.escutaPt++;}}return out;});
  assert.equal(escuta.escutaPt,0,'nenhuma explicação vira áudio');assert.ok(escuta.semFrase>=40&&escuta.semFrase<=70,'questões de explicação identificadas: '+escuta.semFrase);
  console.log('PASS: escuta usa só falas do diálogo; explicações ficam para depois da resposta ('+escuta.semFrase+' questões)');
  await q.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Praticar',exact:true}).click();await q.getByRole('button',{name:/Quero revisar/}).click();await q.getByRole('button',{name:'Praticar dificuldades',exact:true}).click();
  await q.getByRole('button',{name:'Praticar novamente',exact:true}).click();
  assert.ok(await q.getByRole('button',{name:'viens',exact:true}).count()>0,'abre a frase da unidade 1, não da unidade atual');assert.equal(await q.getByRole('button',{name:'prit',exact:true}).count(),0);
  console.log('PASS: dificuldade antiga abre a unidade e o item de origem');
  await q.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Perfil',exact:true}).click();await q.getByRole('button',{name:/Configurações/}).first().click();
  const cfgText=await q.locator('main').textContent();assert.ok(!cfgText.includes('Ainda não há sincronização'));assert.ok(!cfgText.includes('Em breve: avaliação da pronúncia'));assert.ok(cfgText.includes('Treino de pronúncia'));
  console.log('PASS: Configurações mostram o estado real e o treino de pronúncia');
  await q.getByRole('button',{name:/Trocar de perfil/}).first().click();await q.getByRole('button',{name:/Beto/}).click();await q.keyboard.type('1234');await q.locator('.ux-greeting').waitFor();
  assert.deepEqual(await q.evaluate(()=>[document.documentElement.dataset.silent,document.documentElement.dataset.translations,getComputedStyle(document.documentElement).getPropertyValue('--ux-text-scale').trim()]),['true','hide','1.25']);
  await q.reload();await q.locator('.ux-greeting').waitFor();
  assert.deepEqual(await q.evaluate(()=>[document.documentElement.dataset.silent,document.documentElement.dataset.translations]),['true','hide']);
  assert.equal(await q.evaluate(()=>JSON.parse(localStorage.getItem('idiomas-app-v2')).perfis.find(p=>p.id==='p2').preferencias.textSize),125);
  console.log('PASS: preferências do perfil aplicadas ao trocar de pessoa e ao reabrir');
  await c2.close();

  const online=await browser.newContext({viewport:{width:390,height:844},permissions:['microphone'],serviceWorkers:'block'});
  await online.route('https://**',r=>r.abort());await online.route('**/config.js',r=>r.fulfill({contentType:'application/javascript',body:`window.IDIOMAS_API=${JSON.stringify(url+'/api')};`}));
  const token='e30.'+Buffer.from(JSON.stringify({exp:Math.floor(Date.now()/1000)+3600})).toString('base64url')+'.signature';
  await online.route('https://accounts.google.com/gsi/client',r=>r.fulfill({contentType:'application/javascript',body:`window.google={accounts:{id:{initialize(c){window.mockLogin=c.callback},renderButton(el){let b=document.createElement('button');b.textContent='Entrar no teste';b.onclick=()=>window.mockLogin({credential:${JSON.stringify(token)}});el.appendChild(b)}}}};`}));
  await online.addInitScript(state=>{
   if(!localStorage.getItem('idiomas-app-v2'))localStorage.setItem('idiomas-app-v2',JSON.stringify(state));
   window.__tracks=[];const get=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async(...args)=>{let s=await get(...args);window.__tracks.push(...s.getTracks());return s;};
   window.__sockets=[];window.WebSocket=class{constructor(){this.readyState=0;window.__sockets.push(this);setTimeout(()=>{this.readyState=1;this.onopen?.();},10);}send(s){if(JSON.parse(s).setup)setTimeout(()=>this.onmessage?.({data:JSON.stringify({setupComplete:{}})}),10);}close(){this.readyState=3;}};
  },initial());
  const p=await online.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.getByRole('button',{name:'Entrar no teste'}).click();await p.locator('.auth-gate').waitFor({state:'hidden'});
  delayWriting=3000;
  await p.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Praticar',exact:true}).click();await p.getByRole('button',{name:/Quero me expressar/}).click();await p.getByRole('button',{name:'Escrever um texto',exact:true}).click();await p.getByLabel('Seu texto',{exact:true}).fill('Je présente les deux documents et leurs différences.');await p.getByRole('button',{name:'Corrigir',exact:true}).click();
  await p.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Perfil',exact:true}).click();await p.getByRole('button',{name:/Trocar.*perfil/i}).first().click();await p.getByRole('button',{name:/Beto/}).click();await p.keyboard.type('1234');
  await p.waitForFunction(()=>JSON.parse(localStorage.getItem('idiomas-app-v2')).ativo==='p2');
  await p.waitForFunction(()=>JSON.parse(localStorage.getItem('idiomas-app-v2')).perfis.find(p=>p.id==='p1').ecoStudio.writings.length===1);
  assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('idiomas-app-v2')).perfis.find(p=>p.id==='p2').ecoStudio?.writings?.length||0),0);delayWriting=0;
  console.log('PASS: redação pendente continua no perfil que enviou depois da troca de pessoa');
  await p.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Praticar',exact:true}).click();await p.getByRole('button',{name:/Quero me expressar/}).click();await p.getByRole('button',{name:'Conversar com o Eco',exact:true}).click();await p.getByRole('button',{name:'Escolher este cenário',exact:true}).first().click();await p.getByRole('button',{name:'Permitir microfone',exact:true}).click();await p.getByRole('button',{name:'Começar conversa',exact:true}).click();
  await p.waitForFunction(()=>window.__tracks.some(t=>t.readyState==='live'));
  await p.getByRole('button',{name:'Voltar',exact:true}).first().click();assert.ok(await p.evaluate(()=>window.__tracks.every(t=>t.readyState==='ended')));assert.ok(await p.evaluate(()=>window.__sockets.every(s=>s.readyState===3)));
  console.log('PASS: sair da conversa ao vivo encerra todas as tracks e WebSockets');
  await p.close();const p2=await online.newPage();p2.on('pageerror',e=>errors.push(e.message));await p2.goto(url);await p2.locator('.ux-greeting').waitFor();
  assert.equal(await p2.locator('.auth-gate:not([hidden])').count(),0,'não pede Google de novo ao reabrir');
  assert.equal(await p2.evaluate(()=>document.documentElement.dataset.auth),'ready');
  await p2.waitForFunction(()=>window.SYNC.status==='ok');
  console.log('PASS: ao reabrir o app, a entrada continua valendo (sem pedir Google de novo)');
  sessao='revogada';await p2.evaluate(()=>window.SYNC.recarregar());
  await p2.locator('.auth-gate.auth-soft').waitFor();assert.ok(await p2.locator('.ux-greeting').isVisible(),'o app continua visível');
  assert.notEqual(await p2.evaluate(()=>document.documentElement.dataset.auth),'locked');
  await p2.getByRole('button',{name:'Agora não',exact:true}).click();await p2.locator('.auth-gate').waitFor({state:'hidden'});
  assert.equal(await p2.evaluate(()=>localStorage.getItem('idiomas-sessao')),null);
  console.log('PASS: sessão encerrada no servidor mostra aviso sem esconder o app');
  await p2.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Perfil',exact:true}).click();await p2.getByRole('button',{name:/Configurações/}).first().click();
  sessao='';await p2.getByRole('button',{name:/Entrar com Google/}).click();await p2.getByRole('button',{name:'Entrar no teste'}).click();await p2.locator('.auth-gate').waitFor({state:'hidden'});
  assert.ok(await p2.evaluate(()=>!!localStorage.getItem('idiomas-sessao')));
  await p2.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Perfil',exact:true}).click();await p2.getByRole('button',{name:/Configurações/}).first().click();
  const antes=sessao;await p2.getByRole('button',{name:/Sair da conta Google neste aparelho/}).click();
  await p2.waitForFunction(()=>!localStorage.getItem('idiomas-sessao'));await p2.waitForTimeout(300);assert.notEqual(sessao,antes,'servidor recebeu a saída');
  assert.ok(await p2.getByRole('button',{name:/Entrar com Google/}).isVisible());assert.notEqual(await p2.evaluate(()=>document.documentElement.dataset.auth),'locked');
  console.log('PASS: entrar pelas Configurações e sair da conta Google neste aparelho');
  await online.close();assert.deepEqual(errors,[]);console.log('PASS: nenhum erro JavaScript nos fluxos exercitados');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
