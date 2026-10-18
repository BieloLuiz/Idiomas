import sys,json,collections
src=open('src/check_a2.py').read().replace('lines=(10,14)','lines=(16,20)').replace('1500<=n<=2500','4000<=n<=5000').replace('1500-2500','4000-5000')
src=src.replace("CAST={'en':{'Sarah','Emma','Lucas','Daniel'},'fr':{'Claire','Lucas'}}","CAST={'en':{'Sarah','Emma','Lucas','Daniel'},'fr':{'Claire','Inès','Lucas','Antoine'}}")
exec(compile(src.split("if __name__")[0],'c','exec'))
for lang in ['en','fr']:
    txt=open(f'c1/raw-{lang}.json',encoding='utf-8').read()
    try: json.loads(txt); print(lang,'JSON válido')
    except Exception as e: print(lang,'JSON inválido:',e)
    us=units(txt); print(f'== {lang}: {len(us)} unidades'); s=0
    for i,u in enumerate(us):
        n,P=check(u,lang); s+=n; print(f'  U{i+1} {u.get("title")!r}: {n} car.; '+('OK' if not P else '; '.join(P)))
    print('  total',s)
    prev=set()
    for f in [f'a2/{lang}-a2.json',f'b1/{lang}-b1.json',f'b2/{lang}-b2.json']:
        for u in json.load(open(f)): prev|={c[1].strip().lower() for c in u['cards']}
    allc=[c[1].lower() for u in us for c in u['cards']]
    print('  cards repetidos de antes:',[c for c in allc if c in prev],'| dentro do C1:',[c for c,n in collections.Counter(allc).items() if n>1])
    print('  mc posições',collections.Counter(m['a'] for u in us for m in u['mc']),'| elenco',dict(collections.Counter(s for u in us for s in u['speakers'])))
    json.dump(us,open(f'c1/{lang}-c1.json','w'),ensure_ascii=False)
