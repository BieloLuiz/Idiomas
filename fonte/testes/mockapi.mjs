import http from 'http'; const db={}; const log=[];
http.createServer((q,r)=>{ let b=''; q.on('data',d=>b+=d); q.on('end',()=>{ r.setHeader('Access-Control-Allow-Origin','*'); r.setHeader('Content-Type','application/json');
 if(q.method!=='POST'){ r.end(JSON.stringify({db,log})); return; }
 const o=JSON.parse(b||'{}'); log.push(o.acao+':'+(o.tipo||''));
 if(o.acao==='listar') r.end(JSON.stringify({perfis:Object.values(db)}));
 else if(o.acao==='salvar'){ (o.perfis||[]).forEach(p=>{ if(!db[p.id]||(db[p.id].atualizado||0)<=p.atualizado) db[p.id]=p; }); r.end('{"ok":true}'); }
 else if(o.acao==='ia'){ setTimeout(()=>{ const d=o.dados;
   if(o.tipo==='liveToken'){ r.end(JSON.stringify({token:'auth_tokens/teste',modelo:'gemini-3.8-live'})); return; }
   if(o.tipo==='traduzir'){ r.end(JSON.stringify({texto:'(tradução) '+d.texto,provedor:'mock'})); return; }
   if(o.tipo==='revisao'){ const ex=[]; for(let i=0;i<6;i++) ex.push({tipo:'escolha',ref:0,enunciado:'Complete a frase',frase:'Je ___ brésilien.',opcoes:['suis','es','est'],correta:0,pt:false}); ex.push({tipo:'montar',ref:0,frase:'Je suis brésilien.',traducao:'Eu sou brasileiro.'}); r.end(JSON.stringify({exercicios:ex,provedor:'mock',n:d.erros.length})); return; }
   if(o.tipo==='conversa'){ const ouv=d.inicio?'':(d.texto||'Je suis allé au cinéma'); r.end(JSON.stringify({ouvido:ouv,fala:d.inicio?'Bonjour ! Qu\'est-ce que tu as fait ce week-end ?':'Super ! Quel film as-tu vu ?',traducao:d.inicio?'Olá! O que você fez no fim de semana?':'Legal! Que filme você viu?',correcao:d.inicio?null:{voce:'Je suis allé',melhor:'Je suis allé(e)'},sugestao:"J'ai vu un film français.",sugestaoPt:'Eu vi um filme francês.',provedor:'mock',hist:d.historico.length,cen:d.cenario.titulo})); return; }
   if(o.tipo==='conversaResumo'){ r.end(JSON.stringify({resumo:'Você manteve a conversa. Pratique a concordância.',erros:[['Je suis allé','Je suis allée','Concordância com o sujeito feminino.']],palavras:[['un film','um filme']],provedor:'mock'})); return; }
   if(o.tipo==='pronuncia'){ const w=d.frase.split(' '); if(w.length>2) w[1]='banana'; r.end(JSON.stringify({ouvido:w.join(' '),dica:'A palavra **'+d.frase.split(' ')[1]+'** não ficou clara. audio='+(d.audio||'').length+' '+d.mime,provedor:'mock'})); return; }
   if(o.tipo==='explicar') r.end(JSON.stringify({texto:'Você marcou **'+d.dada+'**, mas o certo é **'+d.correta+'**. <script>x</script>',provedor:'mock'}));
   else if(o.tipo==='duvida') r.end(JSON.stringify({texto:'Use **make** para criar e **do** para tarefas.\nEx.: **make a cake**.',provedor:'mock'}));
   else { const t=d.texto; r.end(JSON.stringify({dados:{corrigido:t.replace('I is','I am'),nota:7.5,resumo:'Boa ideia geral; atenção ao verbo to be.',erros:t.includes('I is')?[{trecho:'I is',correcao:'I am',explicacao:'Com I, use am.'}]:[]},provedor:'mock'})); } },300); }
 else r.end('{"erro":"acao"}'); }); }).listen(8790,'127.0.0.1');
