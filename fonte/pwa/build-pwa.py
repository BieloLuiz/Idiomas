import os,re,json,shutil,hashlib,subprocess,sys
from assets import package
# Uso: python3 fonte/pwa/build-pwa.py <app montado.html> <pasta do site (raiz do repositório)> [pasta com os mp3]
D=os.path.dirname(os.path.abspath(__file__))
APP=sys.argv[1]; O=sys.argv[2]; AUD=sys.argv[3] if len(sys.argv)>3 else None
os.makedirs(os.path.join(O,'audio'),exist_ok=True)
s=open(APP,encoding='utf-8').read()
head=('<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<link rel="icon" href="favicon.svg" type="image/svg+xml">\n<link rel="icon" href="favicon.ico" sizes="48x48">\n'
 '<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n'
 '<meta name="apple-mobile-web-app-title" content="Idiomas">\n<script src="config.js"></script>\n<script src="auth.js"></script>\n<script src="sync.js"></script>\n')
assert s.count('</head>')==1; s=s.replace('</head>',head+'</head>')
tail="<script>if('serviceWorker' in navigator) addEventListener('load',function(){navigator.serviceWorker.register('sw.js');});</script>\n"
i=s.rindex('</body>'); s=s[:i]+tail+s[i:]
s,shell=package(s,O)
open(os.path.join(O,'index.html'),'w',encoding='utf-8',newline='\n').write(s)
ver=hashlib.sha1(s.encode()).hexdigest()[:10]
sw=open(os.path.join(D,'sw.js'),encoding='utf-8').read().replace('__VERSAO__',ver).replace('__ASSETS__',json.dumps(shell))
open(os.path.join(O,'sw.js'),'w',encoding='utf-8',newline='\n').write(sw)
shutil.copy(os.path.join(D,'sync.js'),O)
for f in os.listdir(os.path.join(D,'icones')): shutil.copy(os.path.join(D,'icones',f),O)   # ícones da marca (Eco)
shutil.copy(os.path.join(D,'auth.js'),O)
if not os.path.exists(os.path.join(O,'config.js')):
    open(os.path.join(O,'config.js'),'w').write("/* Endereço do Apps Script (termina em /exec). Vazio = só neste aparelho. */\nwindow.IDIOMAS_API = '';\n")
json.dump({"name":"Idiomas","short_name":"Idiomas","description":"Inglês e francês do A1 ao C1, para estudar a dois.","lang":"pt-BR",
 "start_url":"./","scope":"./","display":"standalone","orientation":"any","background_color":"#F6F4EF","theme_color":"#5366C7",
 "icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png","purpose":"any"},{"src":"icon-512.png","sizes":"512x512","type":"image/png","purpose":"any"},{"src":"icon-maskable-192.png","sizes":"192x192","type":"image/png","purpose":"maskable"},{"src":"icon-maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},
 open(os.path.join(O,'manifest.webmanifest'),'w'),ensure_ascii=False,indent=1)
if AUD:
    for f in os.listdir(AUD):
        if f.endswith('.mp3'):
            d=os.path.join(O,'audio',f)
            if not os.path.exists(d) or os.path.getsize(d)!=os.path.getsize(os.path.join(AUD,f)): shutil.copy(os.path.join(AUD,f),d)
open(os.path.join(O,'.nojekyll'),'w').write('')
print('pwa ok', ver, len(os.listdir(os.path.join(O,'audio'))),'audios')
