import json, subprocess, os, re, sys
LANGS=sys.argv[1:] or ['en','fr']
SR=24000; PAD=int(0.35*SR)
M=sum([json.load(open(f'kit11/manifest-c1-{x}.json')) for x in LANGS],[])
F={(m['lang'],m['role'],m['text']):m['f'] for m in M}
ROLE={'en':{'def':'en_narradora','Sarah':'en_sarah','Lucas':'en_lucas','Emma':'en_narradora','Daniel':'en_vendedor'},
      'fr':{'def':'fr_claire','Claire':'fr_claire','Lucas':'fr_lucas','Inès':'fr_ines','Antoine':'fr_antoine'}}
def clean(t): return re.sub(r'\s*\([^)]*\)','',str(t)).strip()
def pcm(p): return subprocess.run(["ffmpeg","-v","error","-i",p,"-f","s16le","-ac","1","-ar",str(SR),"-"],capture_output=True,check=True).stdout
os.makedirs('audio-out',exist_ok=True); index={}
for k in LANGS:
    R=ROLE[k]
    for ui,u in enumerate(json.load(open(f'c1/{k}-c1.json'))):
        keys=[]
        def add(t,role=None):
            t=clean(t)
            if t and (role or R['def'],t) not in keys: keys.append((role or R['def'],t))
        lv={}
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
        buf=bytearray(b"\x00\x00"*PAD); clips={}
        for role,t in keys:
            if not os.path.exists('zipc1/'+F[(k,role,t)]): continue
            s=len(buf)//2; buf+=pcm('zipc1/'+F[(k,role,t)]); clips[role+'|'+t]=[round(s/SR,3),round(len(buf)//2/SR,3)]; buf+=b"\x00\x00"*PAD
        name=f"{k}-c1-u{ui+1:02d}.mp3"
        subprocess.run(["ffmpeg","-v","error","-y","-f","s16le","-ac","1","-ar",str(SR),"-i","-","-codec:a","libmp3lame","-b:a","48k",os.path.join('audio-out',name)],input=bytes(buf),check=True)
        index[f"{k}|{48+ui}"]={"file":"audio/"+name,"clips":clips}
old=json.load(open('src/sprites-c1.json')); old.update(index); json.dump(old,open('src/sprites-c1.json','w'),ensure_ascii=False)
print(len(index),'arquivos', round(sum(os.path.getsize('audio-out/'+f) for f in os.listdir('audio-out') if '-c1-' in f)/1048576,1),'MB')
