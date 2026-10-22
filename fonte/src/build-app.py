import json,sys,os,subprocess
D=os.path.dirname(os.path.abspath(__file__))
src=sys.argv[1]; out=sys.argv[2]
L=open(src,encoding='utf-8').read().split('\n')
# bloco de conteúdo de exemplo: da linha '<script>' antes de 'CONTEÚDO DO CURSO (exemplo)' até o '</script>' seguinte
i=next(n for n,l in enumerate(L) if 'CONTEÚDO DO CURSO (exemplo)' in l)-2
assert L[i]=='<script>',L[i]
j=next(n for n in range(i,len(L)) if L[n]=='</script>')
data=subprocess.check_output(['node','-e','''
const fs=require("fs"),path=require("path"),d=process.argv[1];
const base=JSON.parse(fs.readFileSync(path.join(d,"base.json"),"utf8"));const out={};
for(const k of ["en","fr"]){const B=base[k];out[k]={name:B.name,tts:B.tts,units:[B.unit,...require(path.join(d,k+".js")),...JSON.parse(fs.readFileSync(path.join(d,"..","curso","a2",k+"-a2.json"),"utf8")),...JSON.parse(fs.readFileSync(path.join(d,"..","curso","b1",k+"-b1.json"),"utf8")),...JSON.parse(fs.readFileSync(path.join(d,"..","curso","b2",k+"-b2.json"),"utf8")),...JSON.parse(fs.readFileSync(path.join(d,"..","curso","c1",k+"-c1.json"),"utf8"))]};}
const au={sprites:Object.assign(JSON.parse(fs.readFileSync(path.join(d,"sprites.json"),"utf8")),JSON.parse(fs.readFileSync(path.join(d,"sprites-a2.json"),"utf8")),JSON.parse(fs.readFileSync(path.join(d,"sprites-b1.json"),"utf8")),JSON.parse(fs.readFileSync(path.join(d,"sprites-b2.json"),"utf8")),JSON.parse(fs.readFileSync(path.join(d,"sprites-c1.json"),"utf8")))};
process.stdout.write("var COURSE="+JSON.stringify(out)+";\\nvar AUDIO="+JSON.stringify(au)+";\\n");''',D]).decode()
data=data.replace('</script','<\\/script')
L[i:j+1]=['<script>',open(os.path.join(D,'profile-core.js'),encoding='utf-8').read()+open(os.path.join(D,'discovery.js'),encoding='utf-8').read()+open(os.path.join(D,'ia.js'),encoding='utf-8').read()+data+open(os.path.join(D,'adapter.js'),encoding='utf-8').read(),'</script>']
s='\n'.join(L)
# A mesma biblioteca SVG usada no HtmlService é empacotada no PWA.
# Não alterar o código da biblioteca; apenas incorporar seu conteúdo.
eco_lib=open(os.path.join(D,'eco.js'),encoding='utf-8').read()
assert '</script' not in eco_lib.lower(), 'eco.js contém fechamento de script'
s=s.replace('</head>', '</head>\n<script id="eco-svg-lib">'+eco_lib+'</script>', 1)
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a,s.count(a)); s=s.replace(a,b)
rep("      if(source) {\n        media=media","      if(typeof source==='function') { source(function(){if(token===serial)show('idle','Áudio concluído');}, +speed.value); show('playing'); }\n      else if(source) {\n        media=media")
rep("      if(state==='playing'){if(media)media.pause();","      if(state==='playing'&&typeof source==='function'){cancel();}\n      else if(state==='playing'){if(media)media.pause();")
rep("    function cancel() { serial++;","    function cancel() { serial++; if(typeof source==='function'&&window.AUD)AUD.stop();")
rep("    frasecomDicas(p, ex, pop);\n    bub.appendChild(p); bub.appendChild(montarOuvir(ex)); bub.appendChild(pop);",
    "    if (ex.ocultar) { p.textContent = ex.ocultar; p.lang = 'pt'; } else frasecomDicas(p, ex, pop);\n    bub.appendChild(p); if (!ex.ocultar) bub.appendChild(montarOuvir(ex)); bub.appendChild(pop);")
rep("var p = eu(), base = LICOES_DEMO[p.idioma];","var p = eu(), base = (op && op.revisao ? LICOES['rev|' + p.idioma] : LICOES[u.id + '|' + ((op && op.teste) || nome === 'Prática do guia' ? 'Revisão da unidade' : nome)]);")
rep("  function falar(texto, lang) {\n","  function falar(texto, lang) {\n    if (window.AUD && AUD.say(texto, lang, null, S.cfg.voz)) return;\n")
rep("var CHAVE = 'idiomas-app-v1';","var CHAVE = 'idiomas-app-v2';")
# perfil inicial zerado e sem o perfil de exemplo
a=s.index("        sequencia: 10, melhorSequencia: 14"); b=s.index("        motivos: ['Viagem', 'Filmes e séries'],")
s=s[:a]+"        sequencia: 0, melhorSequencia: 0, xp: 0, hojeFeito: false, ultimoDia: '', semanaDe: segundaStr(),\n        semana: [0, 0, 0, 0, 0, 0, 0], xpSemana: [0, 0, 0, 0, 0, 0, 0], minutosHoje: 0, palavras: 0,\n        progresso: { fr: 0, en: 0 }, metasHoje: { licoes: 0, revisadas: 0 },\n"+s[b:]
a=s.index("      }, {\n        /* perfil de exemplo"); b=s.index("      }]\n    };\n  }",a)
s=s[:a]+s[b:]
rep("['mic', 'Fala']","['book', 'Gramática']")
a=s.index('  var SOM = (function () {'); b=s.index('  function tocar(t)',a)
s=s[:a]+open(os.path.join(D,'som.js'),encoding='utf-8').read()+s[b:]
rep("    function choose(o, focus) {\n      if (travado) return;","    function choose(o, focus) {\n      if (travado) return; if (ao && ao.som) ao.som('toque');")
rep("if (travado) return; tirar(idx); });","if (travado) return; if (ao && ao.som) ao.som('solta'); tirar(idx); });")
rep("        if (travado) return;\n        var on = c.getAttribute","        if (travado) return; if (ao && ao.som) ao.som('toque');\n        var on = c.getAttribute")
rep("ao.som(ok ? 'acerto' : 'erro');","ao.som(ok ? (seguidas >= 3 ? 'combo' : 'acerto') : 'erro');")
rep("  function tocar(t) { if (!S.cfg.silent && S.cfg.efeitos && SOM[t]) try { SOM[t](); } catch (e) {} }",
 "  function tocar(t) { if (!S.cfg.silent && S.cfg.efeitos && SOM[t]) try { SOM[t](); } catch (e) {} }\n"
 "  /* som em todo toque da interface (a lição tem os sons próprios dela) */\n"
 "  document.addEventListener('click', function (e) {\n"
 "    var b = e.target.closest && e.target.closest('button, a, [role=radio], [role=switch], summary, label, input[type=checkbox], input[type=radio]'); if (!b || b.disabled) return;\n"
 "    if (b.closest('.u015-opt, .u019-chip, #acao, .u019 button')) return;\n"
 "    var lab = (b.getAttribute('aria-label') || '') + ' ' + b.className;\n"
 "    if (b.closest('.ui-keypad')) tocar('tecla');\n"
 "    else if (b.getAttribute('role') === 'switch') tocar(b.getAttribute('aria-checked') === 'true' ? 'desliga' : 'liga');\n"
 "    else if (b.classList.contains('ui-nav__item')) tocar('aba');\n"
 "    else if (/sair|voltar|fechar|cancelar|back|close/i.test(lab + ' ' + b.textContent)) tocar('voltar');\n"
 "    else if (/primary/.test(b.className)) tocar('principal');\n"
 "    else tocar('clique');\n"
 "  }, true);")
rep("anunciar(t); setTimeout(function () { d.remove(); }, 2400);","anunciar(t); setTimeout(function () { tocar('aviso'); }, 60); setTimeout(function () { d.remove(); }, 2400);")
rep("    document.body.appendChild(scrim); document.body.appendChild(sh);\n","    document.body.appendChild(scrim); document.body.appendChild(sh); tocar('folha');\n")
rep("    var a = $('.sheet'), b = $('.scrim'); if (a) a.remove();","    var a = $('.sheet'), b = $('.scrim'); if (a) { tocar('fechar'); a.remove(); }")
rep("msg.textContent = t; msg.classList.add('err');","msg.textContent = t; msg.classList.add('err'); tocar('erro');")
rep("TELAS[tela](arg);recordRoute(tela,arg);","TELAS[tela](arg);recordRoute(tela,arg); tocar('tela');")
rep("  function tocar(t) { if (!S.cfg.silent && S.cfg.efeitos && SOM[t]) try { SOM[t](); } catch (e) {} }",
 "  function tocar(t) { if (!S.cfg.silent && S.cfg.efeitos && SOM[t]) try { SOM.vol(S.cfg.volume == null ? 1 : S.cfg.volume); SOM[t](); } catch (e) {} }\n"
 "  function botaoSom(bar) {\n"
 "    var b = document.createElement('button'); b.type = 'button'; b.className = 'icon-btn som-btn'; b.setAttribute('role', 'switch');\n"
 "    function pinta() { b.setAttribute('aria-checked', String(!!S.cfg.efeitos)); b.setAttribute('aria-label', S.cfg.efeitos ? 'Sons ligados. Toque para desligar' : 'Sons desligados. Toque para ligar');\n"
 "      b.innerHTML = '<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 9v6h4l5 4V5L8 9z\"/>' + (S.cfg.efeitos ? '<path d=\"M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12\"/>' : '<path d=\"M16 9l5 6M21 9l-5 6\"/>') + '</svg>'; }\n"
 "    b.addEventListener('click', function () { S.cfg.efeitos = !S.cfg.efeitos; salvar(); pinta(); if (S.cfg.efeitos) tocar('liga'); toast(S.cfg.efeitos ? 'Sons ligados.' : 'Sons desligados.'); });\n"
 "    pinta(); bar.appendChild(b);\n"
 "  }")
rep("    if (extrasTopo) extrasTopo(bar);\n","    if (extrasTopo) extrasTopo(bar);\n    if (aba) botaoSom(bar);\n")
rep(",\n      linha('sound', 'Sons de acerto e erro', 'Sons próprios, curtos e baixos', interruptor(S.cfg.efeitos, function (v) { set('efeitos', v); if (v) tocar('acerto'); }, 'Sons de acerto e erro'))\n    ]);","\n    ]);")
rep("    bloco('Aparência', [",
 "    bloco('Sons', [\n"
 "      linha('sound', 'Efeitos sonoros', 'Toques, acertos, erros e avisos', interruptor(S.cfg.efeitos, function (v) { set('efeitos', v); if (v) tocar('acerto'); }, 'Efeitos sonoros')),\n"
 "      linha('sound', 'Volume dos efeitos', 'Não muda o volume das frases gravadas', segmento([{ v: 0.4, t: 'Baixo' }, { v: 0.7, t: 'Médio' }, { v: 1, t: 'Alto' }, { v: 1.5, t: 'Máximo' }], S.cfg.volume == null ? 1 : S.cfg.volume, function (v) { set('volume', v); tocar('acerto'); }, 'Volume dos efeitos'), true)\n"
 "    ]);\n"
 "    bloco('Aparência', [")
s = s.replace('.icon-btn { flex: none;', '.som-btn { margin-left: auto; } .stats + .som-btn { margin-left: 0; } .icon-btn { flex: none;', 1)

# ---- app real: sem perfil de exemplo, com sincronização (src/sync.js) ----
rep("versao: 2, ativo: null, ultimo: 'gabriel', visto: false,","versao: 2, ativo: null, ultimo: null, visto: false,")
a=s.index("      perfis: [{\n        id: 'gabriel'"); b=s.index("      }]\n    };\n  }",a)+len("      }]")
s=s[:a]+"      perfis: (window.SYNC && SYNC.remotos()) || []"+s[b:]
rep(" +\n      '<p class=\"demo-note\">Demonstração: o PIN de Gabriel é 1234</p>';",";")
rep("    var sel = id || S.ultimo || S.perfis[0].id;","    if (!S.perfis.length) { toast('Ainda não há perfis. Toque em Começar para criar o seu.'); ir('boasvindas'); return; }\n    var sel = id || S.ultimo || S.perfis[0].id;")

# ---- IA: "Por que errei?", redação e dúvidas (src/ia.js e src/ia-telas.js) ----
rep("        return { ok: ok, correta: ex.opcoes[ex.correta] };","        return { ok: ok, correta: ex.opcoes[ex.correta], dada: ex.opcoes[escolhida] };")
rep("        return { ok: ok, correta: certa };","        return { ok: ok, correta: certa, dada: dada };")
rep("      banner(r.ok, r.correta);","      banner(r.ok, r.correta, r.dada);")
rep("  function banner(ok, correta) {","  function banner(ok, correta, dada) {")
rep("    if (ao && ao.som) ao.som(ok ? (seguidas >= 3 ? 'combo' : 'acerto') : 'erro');\n  }",
 "    if (ao && ao.som) ao.som(ok ? (seguidas >= 3 ? 'combo' : 'acerto') : 'erro');\n"
 "    if (!ok && window.IA && IA.ativo()) {\n"
 "      var ex0 = atual.ex, bt = document.createElement('button'); bt.type = 'button'; bt.className = 'ia-porque'; bt.textContent = 'Por que errei?';\n"
 "      bt.onclick = function () { bt.disabled = true; bt.textContent = 'O Eco está pensando…';\n"
 "        IA.pedir('explicar', { idioma: LICAO.idioma.slice(0, 2), unidade: LICAO.unidade || '', nivel: LICAO.nivel || '', enunciado: ex0.enunciado || '', frase: ex0.ocultar || ex0.frase || '', opcoes: ex0.opcoes || null, correta: correta, dada: dada || '' })\n"
 "          .then(function (r) { var p = document.createElement('p'); p.className = 'ia-explica'; p.innerHTML = IA.html(r.texto); bt.replaceWith(p); })\n"
 "          .catch(function (e) { bt.disabled = false; bt.textContent = IA.erroTexto(e) + ' Tocar para tentar de novo.'; }); };\n"
 "      $('.ui-banner__text', bannerBox).appendChild(bt);\n"
 "    }\n  }")
rep("  TELAS.descobrir=function(context){", open(os.path.join(D,'ia-telas.js'),encoding='utf-8').read()+"\n  TELAS.descobrir=function(context){")
rep("String(r.score).replace('.',',')+'/10 · exemplo'","String(r.score).replace('.',',')+'/10'+(r.demo?' · exemplo':'')")
rep("'Resultado · demonstração'","(r.demo?'Resultado · demonstração':'Resultado')")
rep("(r.score===null?'Aguardando IA':'Nota de exemplo')","(r.score===null?'Aguardando IA':(r.demo?'Nota de exemplo':'Nota do Eco'))")
rep("'Correções salvas das redações de demonstração.'","'Correções salvas das suas redações.'")
rep("Use o texto de demonstração para conhecer o resultado e salvar seus exemplos.","Corrija uma redação e salve aqui o que quer praticar.")
css=(".ia-porque{display:block;margin-top:8px;padding:6px 0;border:0;background:none;color:inherit;font:inherit;font-weight:700;text-decoration:underline;text-underline-offset:3px;cursor:pointer;text-align:left}"
 ".ia-porque:disabled{opacity:.7;cursor:default;text-decoration:none}"
 ".ia-explica{margin:8px 0 0;font-size:14px;line-height:1.55}"
 ".ia-chat{display:flex;flex-direction:column;gap:10px;margin:8px 0 16px}"
 ".ia-msg{max-width:88%;padding:12px 14px;border-radius:18px;border:1px solid var(--border);font-size:15px;line-height:1.55;overflow-wrap:anywhere}"
 ".ia-msg p{margin:0}.ia-msg p+p{margin-top:8px}"
 ".ia-msg--eu{align-self:flex-end;background:var(--primary);color:var(--on-primary);border-color:transparent;border-bottom-right-radius:6px}"
 ".ia-msg--eco{align-self:flex-start;background:var(--surface-200);color:var(--ink);border-bottom-left-radius:6px}"
 ".ia-msg--espera{opacity:.7;font-style:italic}"
 ".ia-sug{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}.ia-sug .ui-btn{justify-content:flex-start;text-align:left}"
 ".pron-card{display:flex;flex-direction:column;gap:12px;margin-bottom:12px}.pron-card.is-gravando{outline:2px solid var(--error);outline-offset:2px}"
 ".pron-frase{margin:0;font-size:19px;line-height:1.5;font-weight:600}.pron-ok{color:var(--primary)}.pron-erro{color:var(--error);text-decoration:underline wavy var(--error);text-underline-offset:5px}"
 ".pron-acoes{display:flex;gap:8px}.pron-acoes .ui-btn{flex:1}.pron-status{margin:0;font-size:14px;color:var(--ink-soft)}"
 ".dit-input{width:100%;box-sizing:border-box;font:inherit;font-size:17px;padding:12px;border-radius:14px;border:1px solid var(--border-strong);background:var(--surface-200);color:var(--ink)}"
 ".pron-res:empty{display:none}.pron-nota{display:flex;align-items:baseline;gap:8px}.pron-nota strong{font-size:28px;color:var(--primary)}.pron-res p{margin:6px 0 0;font-size:15px;line-height:1.55}")
assert s.count('</style>')>=1

# ---- revisão personalizada: lição montada pela IA e registro de erros/acertos ----
rep("    var p = eu(), base = (op && op.revisao ? LICOES['rev|' + p.idioma] : LICOES[u.id + '|' + ((op && op.teste) || nome === 'Prática do guia' ? 'Revisão da unidade' : nome)]);\n    var licao = { id: u.id + '-' + nome, idioma: base.idioma, unidade: (op && op.revisao) ? 'Revisão de palavras' : u.titulo + ' · ' + nome, exercicios: base.exercicios };",
    "    var p = eu(), base = (op && op.licao) ? op.licao : (op && op.revisao ? LICOES['rev|' + p.idioma] : LICOES[u.id + '|' + ((op && op.teste) || nome === 'Prática do guia' ? 'Revisão da unidade' : nome)]);\n    var licao = { id: (op && op.licao) ? 'erros-' + Date.now() : u.id + '-' + nome, idioma: base.idioma, unidade: (op && op.licao) ? base.titulo : (op && op.revisao) ? 'Revisão de palavras' : u.titulo + ' · ' + nome, nivel: base.nivel || '', exercicios: base.exercicios };")
rep("        else if (!(op && (op.refazer || op.revisao))) p.progresso[licao.idioma.slice(0,2)] = Math.min(300,Math.max(p.progresso[licao.idioma.slice(0,2)],todasLicoes(CURSOS[licao.idioma.slice(0,2)]).findIndex(function(x){return x.unidade.id===u.id&&x.nome===nome;})+1));","        else if (!(op && (op.refazer || op.revisao || op.licao))) p.progresso[licao.idioma.slice(0,2)] = Math.min(300,Math.max(p.progresso[licao.idioma.slice(0,2)],todasLicoes(CURSOS[licao.idioma.slice(0,2)]).findIndex(function(x){return x.unidade.id===u.id&&x.nome===nome;})+1));")
rep("    if (!ok && window.IA && IA.ativo()) {\n      var ex0 = atual.ex,",
    "    if(window.registrarRespostaCurso)registrarRespostaCurso(atual.ex,ok);\n    if (ok && window.registrarAcerto) registrarAcerto(atual.ex);\n    if (!ok && window.registrarErro && !atual.ex._ref) registrarErro({ fonte: 'licao', lang: LICAO.idioma, unidade: LICAO.unidade || '', frase: atual.ex.ocultar || atual.ex.frase || '', correta: correta, dada: dada || '', nota: atual.ex.enunciado || '' });\n    if (!ok && atual.ex._ref && window.registrarErro) { /* errou de novo na revisão: continua na lista */ }\n    if (!ok && window.IA && IA.ativo()) {\n      var ex0 = atual.ex,")
i=s.rindex('</style>', 0, s.index('</head>')); s=s[:i]+css+s[i:]
s=s.replace('Inglês · Francês · do A1 ao B2','Inglês · Francês · do A1 ao C1')


# ---- design 3: as funções do Eco entram no Praticar e no Caderno ----
rep("var options={entender:[['Ler o diálogo','descobrir',{activity:1}],['Guias da unidade','guias'],['Explorar expressões','descobrir',{activity:2}]],expressar:[['Conversar com o Eco','ecoScenarios'],['Escrever um texto','ecoWrite'],",
    "var options={entender:[['Tirar uma dúvida com o Eco','ecoDuvida'],['Fazer um ditado','ecoDitado'],['Ler o diálogo','descobrir',{activity:1}],['Guias da unidade','guias'],['Explorar expressões','descobrir',{activity:2}]],expressar:[['Conversar com o Eco','ecoScenarios'],['Escrever um texto','ecoWrite'],['Treinar pronúncia','ecoPronuncia'],")
rep("revisar:[['Revisão do curso','revisar'],","revisar:[['Revisar meus erros','ecoRevisao'],['Revisão do curso','revisar'],")
rep("    (ds.errors||[]).forEach(function(e){rows.push({id:'error-'+e.id,",
    "    (st.erros||[]).filter(function(e){return e.lang===lang;}).forEach(function(e){rows.push({id:'erro-'+e.id,kind:'Dificuldades',text:e.correta,translation:e.nota||'',topic:'Quero lembrar',source:'Minha tentativa: '+(e.dada||'—'),action:function(){ir('ecoRevisao');}});});\n    (ds.errors||[]).forEach(function(e){rows.push({id:'error-'+e.id,")
rep("source:'Conversa de demonstração'});","source:'Conversa com o Eco'});")


# ---- lição montada pela IA não tem unidade: dá uma unidade "virtual" para o fim de lição do design ----
rep("  function abrirLicaoApp(u, nome, op) {\n    uxExit='hoje';\n    fecharFolha();",
    "  function abrirLicaoApp(u, nome, op) {\n    uxExit='hoje';\n    fecharFolha();\n    if (!u) u = { id: (eu() ? eu().idioma : 'en') + '-erros', titulo: (op && op.licao && op.licao.titulo) || nome || 'Revisão', objetivo: 'Revisar o que você errou' };")

# Questões sem fala (explicação em português): sem balão nem áudio; a explicação aparece depois da resposta.
rep("    pr.appendChild(eco); pr.appendChild(bub);", "    pr.appendChild(eco); if (!ex.semFrase) pr.appendChild(bub);")
rep("    anuncio.textContent = (ok ? $('.ui-banner__title', bannerBox).textContent + '. ' : 'Quase lá. Resposta correta: ' + correta + '.');",
    "    anuncio.textContent = (ok ? $('.ui-banner__title', bannerBox).textContent + '. ' : 'Quase lá. Resposta correta: ' + correta + '.');\n    if (atual && atual.ex && atual.ex.explicacao) { var xp = document.createElement('p'); xp.className = 'ui-banner__detail ui-banner__explica'; xp.textContent = atual.ex.explicacao; $('.ui-banner__text', bannerBox).appendChild(xp); anuncio.textContent += ' ' + atual.ex.explicacao; }")

# Aplicações explícitas ao contrato de reprodução e ao apoio de escuta.
rep("    bub.appendChild(p); if (!ex.ocultar) bub.appendChild(montarOuvir(ex)); bub.appendChild(pop);", "    if(ex.escuta){var transcript=document.createElement('details'),sum=document.createElement('summary');sum.textContent='Ver transcrição';transcript.append(sum,p);bub.append(transcript,montarOuvir(ex),pop);}else{bub.appendChild(p); if (!ex.ocultar) bub.appendChild(montarOuvir(ex)); bub.appendChild(pop);}")
rep("source(function(){if(token===serial)show('idle','Áudio concluído');}, +speed.value);", "source(function(error){if(token===serial)show('idle',error?'Não foi possível ouvir. Confira a conexão ou baixe a unidade.':'Áudio concluído');}, +speed.value);")
rep("    var play=el.querySelector('.audio-play')", "    if(!source&&window.AUD)source=AUD.fn(text,lang);\n    var play=el.querySelector('.audio-play')")
open(out,'w',encoding='utf-8').write(s)
print('ok',len(s)//1024,'KB')
