import json,re,sys
CAST={'en':{'Sarah','Emma','Lucas','Daniel'},'fr':{'Claire','Lucas'}}
def units(txt):
    out=[];dec=json.JSONDecoder();i=0
    while True:
        j=txt.find('{',i)
        if j<0:break
        try: o,e=dec.raw_decode(txt,j); 
        except Exception as ex: i=j+1; continue
        if isinstance(o,dict) and 'lines' in o: out.append(o)
        i=e
    return out
def check(u,lang):
    P=[];w=P.append
    need=dict(lines=(10,14),grammar=(3,4),vocab=(2,3),pron=(2,3),mc=(4,4),gaps=(6,6),order=(3,3),dict=(5,5),shadow=(4,4),cards=(10,10))
    for k,(a,b) in need.items():
        n=len(u.get(k,[]))
        if not a<=n<=b: w(f'{k}: {n} itens (esperado {a}-{b})')
    for k in ['title','goal','setting','write','speakers']:
        if not u.get(k): w('falta '+k)
    sp=u.get('speakers',{})
    bad=set(sp)-CAST[lang]
    if bad: w('personagens fora do elenco: '+', '.join(bad))
    for l in u.get('lines',[]):
        if len(l)!=3 or l[0] not in sp or not l[2].strip(): w('fala mal formada: '+str(l)[:80])
    lt=[l[1] for l in u.get('lines',[])]
    for m in u.get('mc',[]):
        if not (len(m.get('o',[]))==3 and m.get('a') in (0,1,2)): w('mc mal formado: '+m.get('q','')[:60])
    for g in u.get('gaps',[]):
        if g.get('s','').count('___')!=1 or not g.get('a'): w('lacuna mal formada: '+g.get('s','')[:60])
    for o in u.get('order',[]):
        if not 4<=len(o.get('t',[]))<=8: w('order com %d palavras'%len(o.get('t',[])))
    for s in u.get('shadow',[]):
        if not any(s.strip() in x for x in lt): w('shadow fora do diálogo: '+s[:60])
    tgt=lt+[e[0] for g in u.get('grammar',[]) for e in g.get('ex',[])]+[d['t'] for d in u.get('dict',[])]+u.get('shadow',[])+[c[1] for c in u.get('cards',[])]
    n=sum(len(x) for x in tgt)
    if not 1500<=n<=2500: w(f'tamanho do áudio: {n} caracteres (meta 1500-2500)')
    if any("’" in x for x in tgt): w('apóstrofo curvo no idioma')
    return n,P
if __name__=='__main__':
    lang=sys.argv[1]
    for f in sys.argv[2:]:
        try: us=units(open(f,encoding='utf-8').read())
        except Exception as e: print(f,'ERRO',e); continue
        print(f'== {f}: {len(us)} unidade(s)')
        for i,u in enumerate(us):
            n,P=check(u,lang); print(f'  U{i+1} {u.get("title")!r}: {n} car.; '+('OK' if not P else '; '.join(P)))
