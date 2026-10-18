import json,re,hashlib
ROLE={'en':{'def':'en_narradora','Sarah':'en_sarah','Lucas':'en_lucas','Emma':'en_narradora','Daniel':'en_vendedor'},
      'fr':{'def':'fr_claire','Claire':'fr_claire','Lucas':'fr_lucas','Inès':'fr_ines','Antoine':'fr_antoine'}}
def clean(t): return re.sub(r'\s*\([^)]*\)','',str(t)).strip()
for k in ['en','fr']:
    R=ROLE[k]; M=[]; seen=set()
    for u in json.load(open(f'b2/{k}-b2.json')):
        lv={}
        def add(t,role=None):
            t=clean(t); role=role or R['def']
            if t and (role,t) not in seen:
                seen.add((role,t)); M.append({'f':f"{k}4_"+hashlib.sha1(f'{k}|{role}|{t}'.encode()).hexdigest()[:10]+'.mp3','text':t,'role':role,'lang':k})
        for l in u['lines']: add(l[1],R[l[0]]); lv[clean(l[1])]=R[l[0]]
        for g in u['grammar']:
            for e in g['ex']: add(e[0])
        for v in u['vocab']:
            for i in v['items']: add(i[0] if isinstance(i,list) else i)
        for p in u['pron']:
            for w in ([p['w']] if isinstance(p['w'],str) else p['w']): add(w)
        for d in u['dict']: add(d['t'])
        for x in u['shadow']: add(x,lv.get(clean(x)))
        for c in u['cards']: add(c[1])
        for g in u['gaps']: add(g['s'].replace('___',g['a'][0]))
        for o in u['order']: add(' '.join(o['t']))
    json.dump(M,open(f'kit11/manifest-b2-{k}.json','w'),ensure_ascii=False,indent=0)
    ch=sum(len(m['text']) for m in M); from collections import Counter
    print(k,len(M),'itens',ch,'caracteres', Counter(m['role'] for m in M))
