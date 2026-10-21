"""Montagem reproduzível em Windows, Linux e macOS."""
import os,subprocess,sys,tempfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
env=dict(os.environ,PYTHONUTF8='1')
scratch=root/'.build'
scratch.mkdir(exist_ok=True)
with tempfile.NamedTemporaryFile(prefix='idiomas-',suffix='.html',dir=scratch,delete=False) as task_file:
    html=task_file.name
try:
    subprocess.run([sys.executable,str(root/'fonte/src/build-app.py'),str(root/'fonte/design/design.html'),html],cwd=root,env=env,check=True)
    subprocess.run([sys.executable,str(root/'fonte/pwa/build-pwa.py'),html,str(root)],cwd=root,env=env,check=True)
finally:
    Path(html).unlink(missing_ok=True)
core=(root/'fonte/src/profile-core.js').read_text(encoding='utf-8')
(root/'apps-script/ProfileCore.gs').write_text(core,encoding='utf-8',newline='\n')
