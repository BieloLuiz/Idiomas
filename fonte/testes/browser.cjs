const { chromium }=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
function profile(id,nome,lang='fr'){return{id,nome,pin:'1234',idioma:lang,idiomas:['fr','en'],desde:'out 2026',xp:0,sequencia:0,melhorSequencia:0,hojeFeito:false,ultimoDia:'',semana:[0,0,0,0,0,0,0],xpSemana:[0,0,0,0,0,0,0],minutosHoje:0,palavras:0,progresso:{fr:240,en:240},metasHoje:{licoes:0,revisadas:0},motivos:[],revisao:0};}
const initial=()=>({versao:2,ativo:'p1',ultimo:'p1',visto:true,cfg:{tema:'claro',meta:15,voz:.9,fala:true,efeitos:false,motion:true},perfis:[profile('p1','Ana'),profile('p2','Beto')]});
let db={},delayWriting=0,sessao='',leituraPedida=null,adminSalvo=null,sessaoAberta=null;
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://local');if(url.pathname==='/api'){
 res.setHeader('Content-Type','application/json');if(req.method==='GET'){res.end(JSON.stringify({googleClientId:'test-client'}));return;}
 let body='';req.on('data',b=>body+=b);req.on('end',()=>{let q=JSON.parse(body);if(q.acao==='entrarGoogle'){if(!q.token){res.end('{"erro":"auth_required"}');return;}sessao='s1.'+require('node:crypto').randomBytes(32).toString('hex');res.end(JSON.stringify({ok:true,sessao,expira:Date.now()+60*86400000}));return;}if(!sessao||q.token!==sessao){res.end('{"erro":"auth_required"}');return;}let r={ok:true};if(q.acao==='sair'){sessao='encerrada';res.end('{"ok":true}');return;}
 if(q.acao==='listar')r={perfis:Object.values(db)};
 if(q.acao==='admin'){if(q.op==='eu')r={admin:true};else{if(q.op==='config')adminSalvo=q.config;r={orcamento:{mes:'2026-10',gasto:0.0123,reservado:0,operacional:4,reserva:1,total:5,usoPct:0.3,porServico:{openai:0.0123},alunos:{u1:{email:'ana@example.test',gasto:0.0123,texto:12,audioSeg:300,vozSeg:0,liveMin:15,dias:{'2026-10-22':{texto:12}}}},alertas:[],bloqueios:0,estimado:true},gratisHoje:{mini:{usado:20000,limite:2500000}},config:{principal:'openai',fallback:['groq','gemini'],modo:'registrar',cotas:{textoDia:60,textoMes:1200,audioMinDia:15,audioMinMes:240,vozMinDia:3,vozMinMes:45,liveMinDia:30,liveMinMes:450},usarReserva:false,whisperGratis:false,servicos:[{id:'openai',nome:'OpenAI',pago:true,ativo:true},{id:'groq',nome:'Groq',pago:false,ativo:true},{id:'gemini',nome:'Gemini',pago:false,ativo:true}]}};}}
 if(q.acao==='sessao')r=q.op==='iniciar'&&sessaoAberta&&sessaoAberta!==q.id&&!q.assumir?{ok:false,motivo:'outra_sessao'}:(q.op==='iniciar'?(sessaoAberta=q.id,{ok:true}):q.op==='fim'?(sessaoAberta=null,{ok:true}):{ok:true});
 if(q.acao==='salvar'){let perfis=[],conflitos=[];for(let p of q.perfis){if(db[p.id]&&(db[p.id].revisao||0)!==(p.revisao||0)){conflitos.push(db[p.id]);continue;}db[p.id]={...p,revisao:(p.revisao||0)+1};perfis.push(db[p.id]);}r={perfis,conflitos};}
 if(q.acao==='ia'&&q.tipo==='leitura'){leituraPedida=q.dados;r={titulo:'Le voyage',texto:'Nous prenons le train pour Lyon.\nLe voyage est long mais beau.',traducao:'Pegamos o trem para Lyon.\nA viagem é longa mas bonita.',vocabulario:[['le train','o trem']],perguntas:[{pergunta:'Para onde vão?',opcoes:['Paris','Lyon','Nice'],correta:1},{pergunta:'A viagem é curta?',opcoes:['Sim','Non'],correta:0}]};res.end(JSON.stringify(r));return;}if(q.acao==='ia'){r=q.tipo==='liveToken'?{token:'auth_tokens/mock',modelo:'gemini-3.8-live'}:q.tipo==='redacao'?{dados:{corrigido:q.dados.texto,nota:8,resumo:'Bom texto',erros:[]}}:q.tipo==='conversa'?{fala:'Bonjour !',ouvido:q.dados.texto||'',traducao:'Olá!',sugestao:'Bonjour !'}:{resumo:'Bom trabalho',erros:[],palavras:[]};}
 setTimeout(()=>res.end(JSON.stringify(r)),q.tipo==='redacao'?delayWriting:0);});return;}
 if(url.pathname==='/config.js'){res.setHeader('Content-Type','application/javascript');res.end('window.IDIOMAS_API="";');return;}
 const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'})[path.extname(file)]||'text/plain');res.end(data);});});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});const errors=[];
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},permissions:['microphone']});await context.addInitScript(()=>{window.__semAbertura=true;});
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
  const c2=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});await c2.addInitScript(()=>{window.__semAbertura=true;});
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

  /* revisão do dia, prova de nível e lembrete (sem servidor) */
  const c3=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});await c3.addInitScript(()=>{window.__semAbertura=true;});
  await c3.route('https://**',r=>r.abort());await c3.route('**/config.js',r=>r.fulfill({contentType:'application/javascript',body:'window.IDIOMAS_API="";'}));
  const st3=initial();st3.perfis[0].idioma='en';st3.perfis[0].progresso={en:60,fr:0};
  st3.perfis[0].reviewWords={'en|0|L|0':{interval:1,due:1,correct:1,wrong:0}};
  st3.perfis[0].ecoStudio={erros:[{id:'e1',fonte:'licao',lang:'en',frase:'Nice to meet you.',correta:'Nice to meet you, too.',dada:"I'm from Brazil.",nota:'O que você responde?',vezes:1,acertos:0,em:1}]};
  await c3.addInitScript(state=>{HTMLMediaElement.prototype.play=function(){return Promise.resolve();};localStorage.getItem('idiomas-app-v2')||localStorage.setItem('idiomas-app-v2',JSON.stringify(state));},st3);
  const h=await c3.newPage();h.on('pageerror',e=>errors.push(e.message));await h.goto(url);await h.locator('.ux-greeting').waitFor();
  assert.equal(await h.locator('.ux-greeting .eco-v2 svg.eco-svg').count(),1,'Eco em SVG na tela Hoje');assert.equal(await h.locator('.eco .eco-body').count(),0,'Eco antiga removida');
  const dia=h.locator('.est-dia');await dia.waitFor();assert.match(await dia.textContent(),/1 para relembrar.*1 erro para refazer.*3 frases novas/);
  assert.ok(await h.locator('.est-prova-hoje').isVisible(),'Hoje sugere a prova do A1');
  async function responderTudo(fim){for(let i=0;i<90;i++){if(await fim())return true;const op=h.locator('.u015-opt');if(await op.count()){await op.first().click();await h.click('#acao');await h.waitForTimeout(60);await h.click('#acao').catch(()=>{});await h.waitForTimeout(60);continue;}const chip=h.locator('.u019-list .u019-chip');if(await chip.count()){await chip.first().click();continue;}await h.click('#acao').catch(()=>{});await h.waitForTimeout(80);}return false;}
  await dia.getByRole('button',{name:'Revisar agora'}).click();await h.locator('#acao').waitFor();
  assert.ok(await responderTudo(async()=>await h.locator('.ux-greeting').count()>0),'revisão do dia termina');
  const rw=await h.evaluate(()=>JSON.parse(localStorage.getItem('idiomas-app-v2')).perfis[0].reviewWords);
  assert.ok(Object.keys(rw).filter(k=>k.includes('|L|')).length>=4,'frases entram na revisão espaçada');assert.ok(rw['en|0|L|0'].due>Date.now()-1000,'item revisado ganha nova data');
  console.log('PASS: revisão do dia junta frases vencidas, erros e frases novas, e reagenda cada item');
  await h.locator('.est-prova-hoje').getByRole('button',{name:'Fazer a prova'}).click();
  await h.getByRole('button',{name:'Começar a prova'}).click();await h.locator('#acao').waitFor();
  const ex=await h.evaluate(()=>montarProva('en',0).exercicios.map(e=>e._prova));
  assert.deepEqual(['escuta','leitura','gramatica','vocabulario'].map(p=>ex.filter(x=>x===p).length),[5,5,5,5]);
  assert.ok(await responderTudo(async()=>await h.locator('.est-resultado').count()>0),'prova chega ao resultado');
  const prova=await h.evaluate(()=>JSON.parse(localStorage.getItem('idiomas-app-v2')).perfis[0].provas['en|A1']);
  assert.deepEqual(Object.keys(prova.partes).sort(),['escuta','gramatica','leitura','vocabulario']);assert.equal(typeof prova.total,'number');
  await h.screenshot({path:'.build/prova-resultado.png',fullPage:true});
  console.log('PASS: prova do A1 com 20 questões em 4 partes e resultado salvo ('+prova.total+'%)');
  await h.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Perfil',exact:true}).click();await h.getByRole('button',{name:/Configurações/}).first().click();
  await h.getByRole('button',{name:/Lembrete diário/}).click();await h.getByRole('heading',{name:'Um lembrete por dia'}).waitFor();
  assert.ok(await h.getByRole('button',{name:'Ligar lembrete'}).isDisabled(),'sem entrada Google o lembrete não liga');
  console.log('PASS: tela do lembrete explica o que falta para ligar');
  await h.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Hoje',exact:true}).click();
  const dupla=h.locator('.est-dupla');await dupla.waitFor();assert.match(await dupla.textContent(),/Beto ainda não estudou hoje/);
  await dupla.getByRole('button',{name:'Diálogo em dupla'}).click();await h.getByRole('button',{name:'Trocar personagens'}).click();await h.getByRole('button',{name:'Começar',exact:true}).click();
  for(let i=0;i<30&&!(await h.getByText('Diálogo completo!').count());i++){await h.getByRole('button',{name:'Já li'}).click();}
  await h.getByText('Diálogo completo!').waitFor();
  console.log('PASS: modo a dois: desafio da semana na tela Hoje e diálogo em dupla até o fim');
  await c3.close();

  const online=await browser.newContext({viewport:{width:390,height:844},permissions:['microphone'],serviceWorkers:'block'});await online.addInitScript(()=>{window.__semAbertura=true;});
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
  await p2.getByRole('button',{name:/Entrar com Google/}).click();await p2.getByRole('button',{name:'Entrar no teste'}).click();await p2.locator('.auth-gate').waitFor({state:'hidden'});
  await p2.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Perfil',exact:true}).click();await p2.getByRole('button',{name:/Configurações/}).first().click();
  await p2.getByRole('button',{name:'Abrir painel'}).click();await p2.getByText('ana@example.test').waitFor();
  await p2.getByLabel('Interações de texto por dia').fill('40');await p2.getByText(/Bloquear quando um aluno passar da cota/).click();await p2.getByRole('button',{name:'Salvar configuração'}).click();
  await p2.waitForFunction(()=>true);await p2.waitForTimeout(300);assert.equal(adminSalvo.cotas.textoDia,40);assert.equal(adminSalvo.modo,'bloquear');assert.equal(adminSalvo.principal,'openai');
  console.log('PASS: painel do administrador mostra consumo e salva provedores e cotas');
  await p2.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Praticar',exact:true}).click();await p2.getByRole('button',{name:/Quero me expressar/}).click();await p2.getByRole('button',{name:'Treinar pronúncia',exact:true}).click();
  await p2.getByRole('button',{name:'Mais devagar'}).first().waitFor();await p2.getByRole('button',{name:'Gravar',exact:true}).first().click();
  await p2.getByRole('heading',{name:'O que acontece com a sua voz'}).waitFor();await p2.getByRole('button',{name:'Agora não'}).click();
  assert.equal(await p2.evaluate(()=>localStorage.getItem('idiomas-aviso-audio')),null);
  await p2.getByRole('button',{name:'Gravar',exact:true}).first().click();await p2.getByRole('button',{name:'Entendi, pode gravar'}).click();await p2.getByText('Gravando… diga a frase.').waitFor();
  assert.equal(await p2.evaluate(()=>localStorage.getItem('idiomas-aviso-audio')),'1');
  console.log('PASS: aviso de privacidade antes da primeira gravação e opção de ouvir mais devagar');
  await p2.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Praticar',exact:true}).click();await p2.getByRole('button',{name:/Quero me expressar/}).click();await p2.getByRole('button',{name:'Conversar com o Eco',exact:true}).click();await p2.getByRole('button',{name:'Escolher este cenário',exact:true}).first().click();
  await p2.getByRole('button',{name:'Sem botão',exact:true}).click();await p2.getByRole('button',{name:'Permitir microfone',exact:true}).click();await p2.getByRole('button',{name:'Começar conversa'}).click();
  await p2.getByText('Fale quando quiser · faça uma pausa para enviar').waitFor();await p2.waitForFunction(()=>window.__tracks.some(t=>t.readyState==='live'));
  assert.ok(sessaoAberta,'sessão única aberta no servidor');
  await p2.getByRole('button',{name:'Encerrar'}).click();await p2.waitForTimeout(400);assert.ok(await p2.evaluate(()=>window.__tracks.every(t=>t.readyState==='ended')),'microfone fechado ao encerrar');
  console.log('PASS: conversa sem botão abre o microfone, registra a sessão única e fecha tudo ao encerrar');
  await p2.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Perfil',exact:true}).click();await p2.getByRole('button',{name:/Configurações/}).first().click();

  await p2.getByRole('navigation',{name:'Principal'}).getByRole('button',{name:'Praticar',exact:true}).click();await p2.getByRole('button',{name:/Quero entender/}).click();await p2.getByRole('button',{name:'Leitura extra com o Eco',exact:true}).click();
  await p2.getByLabel('Tema').fill('uma viagem de trem');await p2.getByRole('button',{name:'Criar leitura'}).click();
  await p2.getByRole('heading',{name:'Le voyage'}).waitFor();assert.equal(await p2.locator('.est-leitura p[lang=fr]').count(),2);
  await p2.locator('fieldset').nth(0).getByLabel('Lyon').check();await p2.locator('fieldset').nth(1).getByLabel('Non').check();await p2.getByRole('button',{name:'Conferir respostas'}).click();
  await p2.getByText('1 de 2 certas.').waitFor();assert.equal(leituraPedida.tema,'uma viagem de trem');
  console.log('PASS: leitura extra criada pela IA com áudio por parágrafo, vocabulário e perguntas');
  await online.close();assert.deepEqual(errors,[]);console.log('PASS: nenhum erro JavaScript nos fluxos exercitados');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
