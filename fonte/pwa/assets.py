"""Recursos com nome por conteúdo: cache independente e mídia fora do HTML."""
import base64, hashlib, io, re
from pathlib import Path
from PIL import Image

def package(s, output):
    assets=Path(output)/'assets';assets.mkdir(exist_ok=True)
    shell=[]
    def put(data,ext,critical=True):
        if isinstance(data,str):data=data.encode('utf-8')
        path='assets/'+hashlib.sha256(data).hexdigest()[:20]+'.'+ext
        (Path(output)/path).write_bytes(data)
        if critical and path not in shell:shell.append(path)
        return path
    def image(m):
        data=base64.b64decode(m[2]);ext=m[1]
        if ext in ['png','jpeg','jpg','webp']:
            im=Image.open(io.BytesIO(data));im.thumbnail((1600,1600));out=io.BytesIO();im.save(out,'WEBP',quality=82,method=6);data=out.getvalue();ext='webp'
        return put(data,ext)
    s=re.sub(r'data:image/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)',image,s)
    def script(m):
        attr,code=m[1],m[2]
        if 'src=' in attr:return m[0]
        if 'application/octet-stream' in attr:
            return '<script'+attr+' data-src="'+put(code,'txt',False)+'"></script>'
        url=put(code,'js')
        return '<script'+attr+' src="'+url+'"></script>'
    s=re.sub(r'<script([^>]*)>(.*?)</script>',script,s,flags=re.S)
    def style(m):return '<link rel="stylesheet" href="'+put(m[1].replace('assets/',''),'css')+'">'
    s=re.sub(r'<style>(.*?)</style>',style,s,flags=re.S)
    # Remove somente arquivos gerados por este empacotador, sem exclusão recursiva.
    used={Path(x).name for x in shell}
    used.update(re.findall(r'data-src="assets/([a-f0-9]{20}\.[a-z]+)"',s))
    for child in assets.iterdir():
        if re.fullmatch(r'[a-f0-9]{20}\.(js|css|webp|png|txt)',child.name) and child.name not in used and child.resolve().parent==assets.resolve():child.unlink()
    return s,shell
