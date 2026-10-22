const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), crypto = require('node:crypto');
const P = require('../src/profile-core.js');
test('reconciliação soma alterações independentes e preserva referências de lição', () => {
  const base={id:'p',xp:10,progresso:{en:1},design:{notes:[{id:'a',text:'old'}]}};
  const local=P.copy(base),remote=P.copy(base);local.xp+=20;remote.xp+=30;local.progresso.en=2;remote.progresso.en=3;
  local.design.notes.push({id:'b',text:'local'});remote.design.notes.push({id:'c',text:'remote'});
  const ref=local.design,old=local.design.notes[0],out=P.merge(base,local,remote);P.reconcile(local,out);
  assert.equal(local.xp,60);assert.equal(local.progresso.en,3);assert.deepEqual(local.design.notes.map(x=>x.id),['a','b','c']);assert.equal(local.design,ref);assert.equal(local.design.notes[0],old);
});
test('exclusões de notas não ressuscitam após sincronizar',()=>{const b={notes:[{id:'a'},{id:'b'}]},l={notes:[{id:'b'}]},r={notes:[{id:'a'},{id:'b'},{id:'c'}]};assert.deepEqual(P.merge(b,l,r).notes.map(x=>x.id),['b','c']);});
test('sequência respeita dias consecutivos, virada de ano e semana',()=>{let p={ultimoDia:'2026-12-31',sequencia:4,hojeFeito:true,semanaDe:'2026-12-28'};P.newDay(p,new Date(2027,0,1));assert.equal(p.sequencia,4);assert.equal(p.hojeFeito,false);P.newDay(p,new Date(2027,0,3));assert.equal(p.sequencia,0);});
test('revisão usa resultado e vencimento, sem depender do progresso',()=>{const s={};P.review(s,'w',true,1000);assert.equal(s.w.due,86401000);P.review(s,'w',true,2000);assert.equal(s.w.interval,2);P.review(s,'w',false,3000);assert.equal(s.w.due,63000);assert.equal(s.w.wrong,1);});
test('normalização remove PIN e limita progresso',()=>{let p=P.normalize({id:'p',pin:'1234',progresso:{en:900,fr:-1}});assert.equal(p.pin,undefined);assert.deepEqual(p.progresso,{en:300,fr:0});assert.equal(p.semana.length,7);});
test('importação rejeita estrutura inválida e identificadores reservados',()=>{assert.throws(()=>P.normalize({id:'__proto__'}),/perfil_invalido/);assert.throws(()=>P.normalize({id:'p',ecoStudio:{calls:'invalid'}}),/perfil_invalido/);assert.equal(P.copy(JSON.parse('{"__proto__":{"polluted":true}}')).polluted,undefined);});
test('contadores de ontem não entram na meta de hoje e o mesmo dia soma',()=>{
  const base={id:'p',ultimoDia:'2026-10-20',minutosHoje:20,metasHoje:{licoes:2,revisadas:1},hojeFeito:true,semanaDe:'2026-10-19',semana:[0,20,0,0,0,0,0],xpSemana:[0,30,0,0,0,0,0],xp:100};
  const hoje={...P.copy(base),ultimoDia:'2026-10-21',minutosHoje:5,metasHoje:{licoes:1,revisadas:0},hojeFeito:false,semana:[0,20,5,0,0,0,0],xpSemana:[0,30,10,0,0,0,0],xp:110};
  const ontemTarde={...P.copy(base),minutosHoje:30,metasHoje:{licoes:3,revisadas:1},semana:[0,30,0,0,0,0,0],xpSemana:[0,45,0,0,0,0,0],xp:115};
  let out=P.mergeProfile(base,hoje,ontemTarde);
  assert.equal(out.ultimoDia,'2026-10-21');assert.equal(out.minutosHoje,5);assert.deepEqual(out.metasHoje,{licoes:1,revisadas:0});assert.equal(out.hojeFeito,false);assert.equal(out.xp,125);
  out=P.mergeProfile(base,ontemTarde,hoje);assert.equal(out.minutosHoje,5);assert.equal(out.ultimoDia,'2026-10-21');
  const outroHoje={...P.copy(hoje),minutosHoje:8,metasHoje:{licoes:1,revisadas:2},hojeFeito:true};
  const ambos=P.mergeProfile(base,hoje,{...outroHoje,minutosHoje:8});assert.equal(ambos.minutosHoje,13);assert.equal(ambos.hojeFeito,true);
  const semanaNova={...P.copy(hoje),ultimoDia:'2026-10-26',semanaDe:'2026-10-26',semana:[4,0,0,0,0,0,0],xpSemana:[7,0,0,0,0,0,0],minutosHoje:4};
  out=P.mergeProfile(base,semanaNova,ontemTarde);assert.deepEqual(out.semana,[4,0,0,0,0,0,0]);assert.deepEqual(out.xpSemana,[7,0,0,0,0,0,0]);assert.equal(out.semanaDe,'2026-10-26');
});
test('duas abas não contam o mesmo XP duas vezes',()=>{
  const K='idiomas-app-v2',storage=new Map(),tabs=[];
  const initial={versao:2,perfis:[P.normalize({id:'p',xp:10,revisao:1})]};storage.set(K,JSON.stringify(initial));storage.set(K+':base',JSON.stringify({p:initial.perfis[0]}));
  function tab(){const listeners={};const ctx={ProfileCore:P,crypto:{randomUUID:()=>crypto.randomUUID()},JSON,Promise,Date,CustomEvent:function(t,o){this.type=t;},document:{addEventListener(){},dispatchEvent(){},visibilityState:'visible'},addEventListener(t,f){listeners[t]=f;},setTimeout:()=>1,clearTimeout(){},
    localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>{const old=storage.get(k);storage.set(k,v);tabs.filter(t=>t!==me).forEach(t=>t.listeners.storage&&t.listeners.storage({key:k,oldValue:old,newValue:v}));}},IDIOMAS_API:'',AUTH:{ready:()=>false,post:async()=>({})}};
    ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('fonte/pwa/sync.js','utf8'),ctx);const state=JSON.parse(storage.get(K));const me={ctx,listeners,state};tabs.push(me);ctx.SYNC.bind(state);return me;}
  const A=tab(),B=tab();
  A.state.perfis[0].xp=30;A.ctx.SYNC.mudou(A.state);
  assert.equal(B.state.perfis[0].xp,30);
  B.state.perfis[0].xp+=10;B.ctx.SYNC.mudou(B.state);
  assert.equal(A.state.perfis[0].xp,40);assert.equal(B.state.perfis[0].xp,40);assert.equal(JSON.parse(storage.get(K)).perfis[0].xp,40);
});
test('resposta perdida não duplica XP ao recuperar envio e editar em outro aparelho',async()=>{
 const K='idiomas-app-v2',base=P.normalize({id:'p',xp:10,revisao:1}),state={perfis:[P.copy(base)]},storage=new Map([[K+':base',JSON.stringify({p:base})]]);
 let remote=P.copy(base),lose=true,posts=0;
 const ctx={ProfileCore:P,crypto:{randomUUID:()=>crypto.randomUUID()},JSON,Promise,Date,CustomEvent:function(t,o){this.type=t;this.detail=o&&o.detail;},document:{addEventListener(){},dispatchEvent(){},visibilityState:'visible'},addEventListener(){},setTimeout:()=>1,clearTimeout(){},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},IDIOMAS_API:'mock',AUTH:{ready:()=>true,post:async q=>{
  if(q.acao==='listar')return{perfis:[P.copy(remote)]};posts++;let p=q.perfis[0];
  if((remote._receipts||[]).includes(p._operation))return{perfis:[P.copy(remote)]};
  if(p.revisao!==remote.revisao)return{conflitos:[P.copy(remote)]};
  remote={...P.copy(p),revisao:remote.revisao+1,_receipts:(remote._receipts||[]).concat(p._operation)};delete remote._operation;
  if(lose){lose=false;throw new Error('network');}return{perfis:[P.copy(remote)]};
 }}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('fonte/pwa/sync.js','utf8'),ctx);
 ctx.SYNC.bind(state);await new Promise(r=>setImmediate(r));const ref=state.perfis[0];ref.xp=20;ctx.SYNC.mudou(state);await ctx.SYNC.agora();
 assert.equal(remote.xp,20);ref.xp=25;ctx.SYNC.mudou(state);remote.xp=50;remote.revisao++;
 await ctx.SYNC.recarregar();assert.equal(ref.xp,55);await ctx.SYNC.agora();assert.equal(remote.xp,55);assert.equal(state.perfis[0],ref);assert.ok(posts>=3);
});
function backend(claims={}) {
  const props={GOOGLE_CLIENT_ID:'test-client',ALLOWED_EMAILS:'allowed@example.test',GEMINI_API_KEY:'test'};const cache=new Map(), requests=[];
  const ctx={console,Date,JSON,Math,Number,String,Array,Object,ProfileCore:P, PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k],setProperty:(k,v)=>props[k]=v,deleteProperty:k=>{delete props[k];},getKeys:()=>Object.keys(props)})},CacheService:{getScriptCache:()=>({get:k=>cache.get(k),put:(k,v)=>cache.set(k,v),remove:k=>cache.delete(k)})},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},Utilities:{DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(alg,s)=>[...crypto.createHash('sha256').update(s).digest()],base64EncodeWebSafe:b=>Buffer.from(b).toString('base64url'),getUuid:()=>crypto.randomUUID(),formatDate:()=> '2026-10-20'},UrlFetchApp:{fetch:(url,options)=>{requests.push({url,options});return{getResponseCode:()=>200,getContentText:()=>JSON.stringify(url.includes('tokeninfo')?{aud:'test-client',iss:'https://accounts.google.com',exp:Math.floor(Date.now()/1000)+3600,sub:'u1',email:'allowed@example.test',email_verified:true,...claims}:{name:'auth_tokens/test'})};}},ContentService:{MimeType:{JSON:'json'},createTextOutput:t=>({setMimeType:()=>JSON.parse(t)})}};
  vm.createContext(ctx);vm.runInContext(fs.readFileSync('apps-script/Security.gs','utf8')+'\n'+fs.readFileSync('apps-script/Code.gs','utf8')+'\n'+fs.readFileSync('apps-script/Orcamento.gs','utf8'),ctx);
  return{ctx,props,requests};
}
test('API nega acesso antes de ler a planilha ou chamar IA',()=>{const {ctx,requests}=backend();let r=ctx.doPost({postData:{contents:JSON.stringify({acao:'listar'})}});assert.equal(r.erro,'auth_required');assert.equal(requests.length,0);});
test('Google: assinatura verificada pelo serviço, audience, expiração e conta restritos',()=>{
  for(const claims of [{aud:'other'},{exp:1},{iss:'https://evil.test'},{email_verified:false},{email:'other@example.test'}]){const {ctx}=backend(claims);assert.throws(()=>ctx.autenticar_('x'.repeat(60)),/auth_required|auth_denied/);}
  const {ctx}=backend();assert.equal(ctx.autenticar_('x'.repeat(60)).sub,'u1');
});
test('servidor recusa acesso quando não está configurado',()=>{const {ctx,props}=backend();props.ALLOWED_EMAILS='';assert.throws(()=>ctx.autenticar_('x'.repeat(60)),/auth_config/);});
test('sessão do app: Google uma vez, depois código próprio de 60 dias, revogável',()=>{
  const {ctx,props,requests}=backend();const post=q=>ctx.doPost({postData:{contents:JSON.stringify(q)}});
  let r=post({acao:'entrarGoogle',token:'x'.repeat(60)});assert.match(r.sessao,/^s1\.[0-9a-f]{64}$/);assert.ok(r.expira-Date.now()>59*86400000);
  assert.ok(!Object.values(props).some(v=>String(v).includes(r.sessao)),'código não fica guardado às claras');
  const n=requests.length;const ia=t=>post({acao:'ia',tipo:'duvida',dados:{},token:t}).erro;assert.equal(ia(r.sessao),'operacao_invalida');assert.equal(requests.length,n,'sessão não consulta o Google');
  assert.equal(post({acao:'listar',token:'x'.repeat(60)}).erro,'auth_required','token do Google sozinho não lê dados');
  assert.equal(post({acao:'listar',token:'s1.'+'0'.repeat(64)}).erro,'auth_required');
  props.ALLOWED_EMAILS='outra@example.test';assert.equal(ia(r.sessao),'auth_denied');
  props.ALLOWED_EMAILS='allowed@example.test';assert.ok(post({acao:'sair',token:r.sessao}).ok);assert.equal(ia(r.sessao),'auth_required');
  const k=Object.keys(props).find(k=>k.startsWith('SESSAO_'));assert.equal(k,undefined);
  r=post({acao:'entrarGoogle',token:'x'.repeat(60)});const key=Object.keys(props).find(k=>k.startsWith('SESSAO_'));props[key]=JSON.stringify({...JSON.parse(props[key]),exp:Date.now()-1});
  assert.equal(ia(r.sessao),'auth_required');assert.equal(props[key],undefined);
  props.ALLOWED_EMAILS='';assert.equal(ia(r.sessao),'auth_config');
});
function planilha(){const abas={};return{getActive:()=>({getSheetByName:n=>abas[n]||null,insertSheet:n=>{const rows=[];const sh={rows,appendRow:r=>rows.push(r.slice()),setFrozenRows(){},getRange:(r,c,nr,nc)=>({getValues:()=>rows.slice(r-1,r-1+(nr||1)).map(x=>x.slice(c-1,c-1+(nc||1))),setValues:v=>v.forEach((row,i)=>row.forEach((val,j)=>{rows[r-1+i][c-1+j]=val;})),setValue:v=>{rows[r-1][c-1]=v;},setWrap(){return this;}}),getLastRow:()=>rows.length,deleteRow:i=>rows.splice(i-1,1),deleteRows:(i,n)=>rows.splice(i-1,n)};abas[n]=sh;return sh;}}),abas};}
function servidorLembretes(){const b=backend();const pl=planilha();b.ctx.SpreadsheetApp=pl;
  b.ctx.Utilities.formatDate=(d,tz,f)=>{const s=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(d).reduce((o,p)=>(o[p.type]=p.value,o),{});
    if(f==='HH:mm')return s.hour+':'+s.minute;if(f==='yyyy-MM-dd')return s.year+'-'+s.month+'-'+s.day;if(f==='yyyy-M-d')return (+s.year)+'-'+(+s.month)+'-'+(+s.day);throw new Error(f);};
  vm.runInContext(fs.readFileSync('apps-script/Lembretes.gs','utf8'),b.ctx);b.props.LEMBRETE_SEGREDO='s'.repeat(64);return {...b,pl};}
const ASS={endpoint:'https://push.example.test/abc',keys:{p256dh:'k',auth:'a'}};
test('lembrete: horário no fuso da pessoa, uma vez por dia e só para quem não estudou',()=>{
  const {ctx}=servidorLembretes();let perfis=[{id:'p1',nome:'Gabriel Luiz',idioma:'fr',sequencia:3,ultimoDia:'',hojeFeito:false}];ctx.listar_=()=>perfis;
  ctx.lembrete_({perfil:'p1',hora:'20:00',fuso:'America/Sao_Paulo',assinatura:ASS});
  assert.equal(ctx.lembretesPendentes_(new Date('2026-10-22T22:59:00Z')).envios.length,0,'19:59 em São Paulo: ainda não');
  let r=ctx.lembretesPendentes_(new Date('2026-10-22T23:05:00Z'));assert.equal(r.envios.length,1);assert.match(r.envios[0].corpo,/^Gabriel, /);assert.equal(r.envios[0].assinatura.endpoint,ASS.endpoint);
  assert.equal(ctx.lembretesPendentes_(new Date('2026-10-22T23:20:00Z')).envios.length,0,'não envia duas vezes no mesmo dia');
  perfis[0]={...perfis[0],ultimoDia:'2026-10-23',hojeFeito:true};
  assert.equal(ctx.lembretesPendentes_(new Date('2026-10-23T23:05:00Z')).envios.length,0,'já estudou hoje');
  perfis[0]={...perfis[0],hojeFeito:false,ultimoDia:'2026-10-23'};
  assert.equal(ctx.lembretesPendentes_(new Date('2026-10-24T02:40:00Z')).envios.length,0,'depois de 23:30 não incomoda');
  assert.equal(ctx.lembretesPendentes_(new Date('2026-10-24T23:01:00Z')).envios.length,1,'no dia seguinte volta a avisar');
  ctx.lembrete_({perfil:'p1',hora:'09:00',fuso:'Europe/Paris',assinatura:ASS});
  assert.equal(ctx.lembretesPendentes_(new Date('2026-10-25T06:30:00Z')).envios.length,0,'07:30 em Paris');
  assert.equal(ctx.lembretesPendentes_(new Date('2026-10-25T08:10:00Z')).envios.length,1,'09:10 em Paris (já no horário de inverno)');
  assert.throws(()=>ctx.lembrete_({perfil:'p1',hora:'25:00',assinatura:ASS}),/hora/);
  assert.throws(()=>ctx.lembrete_({perfil:'p1',hora:'08:00',assinatura:{endpoint:'http://inseguro.test/x',keys:{p256dh:'k',auth:'a'}}}),/assinatura/);
});
test('lembrete: segredo errado é recusado e inscrição vencida é removida',()=>{
  const {ctx,pl}=servidorLembretes();ctx.listar_=()=>[{id:'p1',nome:'A'}];
  const post=q=>ctx.doPost({postData:{contents:JSON.stringify(q)}});
  for(const segredo of [undefined,'x','s'.repeat(63)+'t']) assert.equal(post({acao:'lembretesPendentes',segredo}).erro,'auth_required');
  assert.equal(post({acao:'lembrete',perfil:'p1',hora:'08:00',assinatura:ASS}).erro,'auth_required','app precisa de sessão');
  ctx.lembrete_({perfil:'p1',hora:'08:00',assinatura:ASS});assert.equal(pl.abas.Lembretes.rows.length,2);
  assert.ok(Array.isArray(post({acao:'lembretesPendentes',segredo:'s'.repeat(64)}).envios));
  assert.ok(post({acao:'lembreteRemover',segredo:'s'.repeat(64),endpoint:ASS.endpoint}).ok);assert.equal(pl.abas.Lembretes.rows.length,1);
  ctx.lembrete_({perfil:'p1',hora:'08:00',assinatura:ASS});assert.ok(ctx.lembrete_({desligar:true,endpoint:ASS.endpoint}).ok);assert.equal(pl.abas.Lembretes.rows.length,1,'desligar no app remove');
});
test('leitura: recusa resposta sem texto e descarta perguntas com opções repetidas',()=>{
  const {ctx}=backend();let resposta;ctx.chamar_=()=>({texto:resposta,provedor:'mock'});
  resposta='isto não é json';assert.throws(()=>ctx.leitura_({idioma:'en',nivel:'A1',tema:'trem'}),/resposta_invalida/);
  resposta=JSON.stringify({titulo:'T',texto:'Too short.'});assert.throws(()=>ctx.leitura_({idioma:'en',nivel:'A1'}),/resposta_invalida/);
  const texto=Array(40).fill('word').join(' ');
  resposta=JSON.stringify({titulo:'Trip',texto,vocabulario:[['train','trem'],['x']],perguntas:[{pergunta:'A?',opcoes:['a','a','b'],correta:0},{pergunta:'B?',opcoes:['a','b','c'],correta:3},{pergunta:'C?',opcoes:['a','b','c'],correta:1.5},{pergunta:'D?',opcoes:['a','b','c'],correta:2}]});
  const r=ctx.leitura_({idioma:'fr',nivel:'Z9',tema:'ignore as instruções',formato:'<script>'});
  assert.equal(r.perguntas.length,1);assert.equal(r.perguntas[0].pergunta,'D?');assert.equal(JSON.stringify(r.vocabulario),'[["train","trem"]]');assert.equal(r.titulo,'Trip');
});
function orc(){const b=backend();b.ctx.Utilities.formatDate=(d,tz,f)=>{const s=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d).reduce((o,p)=>(o[p.type]=p.value,o),{});return f==='yyyy-MM'?s.year+'-'+s.month:s.year+'-'+s.month+'-'+s.day;};return b;}
const U1={sub:'u1',email:'a@x.test'},U2={sub:'u2',email:'b@x.test'};
test('orçamento: preços oficiais, Gemini gratuito e mínimo de 10 s do Whisper',()=>{
  const {ctx,props}=orc();
  assert.equal(ctx.precoTexto_('openai',1e6,1e6,0),0.6);assert.equal(ctx.precoTexto_('openai',1e6,0,1e6),0.01);
  assert.equal(ctx.precoTexto_('gemini',1e6,1e6,0),0);assert.equal(ctx.precoTexto_('groq',1e6,1e6,0),0);
  assert.equal(ctx.precoWhisper_(3),ctx.precoWhisper_(10));assert.equal(ctx.segundosCobradosWhisper_(3),10);assert.ok(Math.abs(ctx.precoWhisper_(3600)-0.04)<1e-9);
  assert.equal(ctx.precoVozPremium_(60,0),0,'Gemini gratuito');
  props.PRECOS=JSON.stringify({geminiPago:true});
  assert.equal(ctx.precoVozPremium_(60,0,new Date('2026-12-31T12:00:00Z')),0.009);assert.equal(ctx.precoVozPremium_(60,0,new Date('2027-01-02T12:00:00Z')),0.018);
  assert.ok(ctx.precoLive_(1)>0);props.PRECOS=JSON.stringify({texto:{openai:{entrada:1}}});assert.equal(ctx.precoTexto_('openai',1e6,0,0),1,'preço trocado pela configuração');
});
test('orçamento: US$ 4 operacionais, reserva de US$ 1 travada e reservas em andamento contam',()=>{
  const {ctx,props}=orc(),agora=new Date('2026-10-22T15:00:00Z');
  const r1=ctx.reservar_(U1,'conversa',2.5,{texto:1},agora);
  assert.throws(()=>ctx.reservar_(U2,'conversa',1.6,{texto:1},agora),/orcamento/,'2,5 reservado + 1,6 passa de 4');
  const r2=ctx.reservar_(U2,'conversa',1.5,{texto:1},agora);
  ctx.confirmar_(r1,U1,0.4,{texto:1},[{servico:'openai',custo:0.4}]);ctx.liberar_(r2);
  const e=ctx.estadoOrcamento_(agora);assert.equal(e.gasto,0.4);assert.equal(e.reservado,0);assert.equal(e.operacional,4);assert.equal(e.reserva,1);assert.equal(e.porServico.openai,0.4);
  assert.equal(e.alunos.u1.texto,1);assert.equal(e.alunos.u2.texto,0,'liberada não conta uso');
  ctx.reservar_(U1,'explicar',0,{texto:1},agora);
  props.ORC_x='';const o=JSON.parse(props['ORC_2026-10']);o.gasto=3.7;props['ORC_2026-10']=JSON.stringify(o);
  assert.throws(()=>ctx.reservar_(U1,'leitura',0.01,{texto:1},agora),/orcamento/,'em 90% as opcionais param');
  ctx.reservar_(U1,'conversa',0.01,{texto:1},agora);
  assert.ok(JSON.parse(props['ORC_2026-10']).alertas.includes(90));
  assert.doesNotThrow(()=>ctx.reservar_(U1,'conversa',0,{texto:1},agora),'operação gratuita segue');
});
test('orçamento: cotas por aluno registram ou bloqueiam conforme o modo, e o mês vira no fuso de São Paulo',()=>{
  const {ctx,props}=orc();props.COTAS=JSON.stringify({textoDia:2});const t=new Date('2026-10-22T15:00:00Z');
  for(let i=0;i<3;i++){const r=ctx.reservar_(U1,'duvida',0,{texto:1},t);ctx.confirmar_(r,U1,0,{texto:1},[]);}
  assert.equal(JSON.parse(props['ORC_2026-10']).alunos.u1.texto,3,'modo registrar não bloqueia');
  props.ORCAMENTO_MODO='bloquear';assert.throws(()=>ctx.reservar_(U1,'duvida',0,{texto:1},t),/quota/);
  assert.doesNotThrow(()=>ctx.reservar_(U2,'duvida',0,{texto:1},t),'a cota é de cada aluno');
  const antes=new Date('2026-11-01T02:50:00Z'),depois=new Date('2026-11-01T03:10:00Z');
  assert.equal(ctx.mesAtual_(antes),'2026-10');assert.equal(ctx.mesAtual_(depois),'2026-11');
  props.ORCAMENTO_MODO='registrar';const r=ctx.reservar_(U2,'conversa',0.2,{texto:1},antes);
  const nov=ctx.reservar_(U2,'conversa',0.1,{texto:1},depois);
  ctx.confirmar_(r,U2,0.2,{texto:1},[{servico:'openai',custo:0.2}]);
  assert.equal(JSON.parse(props['ORC_2026-10']).gasto,0.2,'reserva da virada fica no mês em que começou');
  assert.equal(ctx.estadoOrcamento_(depois).reservado,0.1);
});
test('orçamento: pedido de IA registra tokens e custo; falha libera a reserva',()=>{
  const {ctx,props}=orc();
  vm.runInContext("SERVICOS.openai={tipo:'openai',url:'https://api.openai.test/v1/chat/completions',chave:'OPENAI_API_KEY',prop:'OPENAI_MODELOS',modelos:['gpt-6-luna']};ROTAS.duvida=['openai'];",ctx);props.OPENAI_API_KEY='k';let falhar=false;
  ctx.UrlFetchApp.fetch=()=>({getResponseCode:()=>falhar?500:200,getContentText:()=>falhar?'erro':JSON.stringify({choices:[{message:{content:'Resposta'}}],usage:{prompt_tokens:2000,completion_tokens:500,prompt_tokens_details:{cached_tokens:1000}}})});
  const q={tipo:'duvida',requestId:crypto.randomUUID(),dados:{idioma:'en',pergunta:'?'}};
  assert.equal(ctx.pedidoIA_(U1,q).texto,'Resposta');
  let e=ctx.estadoOrcamento_();assert.equal(e.gasto,0.00036);assert.equal(e.reservado,0);assert.equal(e.alunos.u1.texto,1);
  falhar=true;assert.throws(()=>ctx.pedidoIA_(U1,{...q,requestId:crypto.randomUUID()}),/indisponivel/);
  e=ctx.estadoOrcamento_();assert.equal(e.reservado,0,'falha não deixa reserva presa');assert.equal(e.gasto,0.00036);
});
test('cota é aplicada no servidor',()=>{const{ctx}=backend();for(let i=0;i<10;i++)ctx.limitarIA_({sub:'u'},'duvida');assert.throws(()=>ctx.limitarIA_({sub:'u'},'duvida'),/quota/);});
test('token Live fixa modelo, uso único e validade curta',()=>{const {ctx,requests}=backend();ctx.liveToken_({});let body=JSON.parse(requests.at(-1).options.payload);assert.equal(body.uses,1);assert.equal(body.liveConnectConstraints.model,'models/gemini-3.8-live');assert.ok(Date.parse(body.expireTime)-Date.now()<=15*60000);});
test('revisão da IA rejeita alternativas duplicadas e índices fracionários',()=>{const{ctx}=backend();ctx.chamar_=()=>({texto:JSON.stringify({exercicios:[{opcoes:['A','A','B','C'],correta:2},{opcoes:['A','B'],correta:.5},{opcoes:['A','B'],correta:1}]}),provedor:'mock'});let r=ctx.revisao_({erros:[{correta:'B'}]});assert.equal(r.exercicios.length,1);assert.equal(r.exercicios[0].opcoes[r.exercicios[0].correta],'B');});
test('todas as unidades geram as cinco lições e o teste usa revisão da própria unidade',()=>{
 const html=fs.readFileSync('index.html','utf8'),scripts=[...html.matchAll(/<script[^>]+src="(assets\/[^"]+)"/g)].map(m=>m[1]);let file=scripts.find(f=>fs.readFileSync(f,'utf8').includes('var COURSE='));
 const ctx={document:{dispatchEvent(){}},Audio:function(){},localStorage:{getItem:()=>null},TextEncoder,CustomEvent:function(){}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
 for(const k of ['en','fr']){assert.equal(ctx.COURSE[k].units.length,60);for(let i=1;i<=60;i++)for(const name of ['Palavras novas','Escuta','Montar frases','Gramática','Revisão da unidade']){let l=ctx.LICOES[k+'-u'+i+'|'+name];assert.ok(l.exercicios.length>0,k+i+name);assert.equal(l.unidade,ctx.COURSE[k].units[i-1].title);}}
 const app=scripts.map(f=>fs.readFileSync(f,'utf8')).find(s=>s.includes('function abrirLicaoApp'));
 assert.ok(app.includes("nome === 'Prática do guia' ? 'Revisão da unidade'"));assert.ok(!app.includes('|| LICOES_DEMO[p.idioma]'));assert.ok(app.includes("return all[p.progresso[p.idioma]] || null"));
});
