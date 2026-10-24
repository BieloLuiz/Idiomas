import json,re,sys
raw=open(sys.argv[1],encoding='utf-8').read()
t=raw.replace('“','"').replace('”','"').replace('\\[','[').replace('\\]',']').replace('\\_','_')
t=re.sub(r'"tela":\s*((?:"[^"]*",\s*)+)(?="falas")',lambda m:'"tela": ['+m.group(1).rstrip().rstrip(',')+'], ',t)
t=re.sub(r'"falas":\s*((?:\{[^{}]*\},?\s*)+)(?="pausa_segundos")',lambda m:'"falas": ['+m.group(1).rstrip().rstrip(',')+'], ',t)
try: d=json.loads(t)
except json.JSONDecodeError as e: print(t[e.pos-150:e.pos+80]); raise
json.dump(d,open(sys.argv[2],'w'),ensure_ascii=False,indent=1); print('ok',len(d['aulas']))
