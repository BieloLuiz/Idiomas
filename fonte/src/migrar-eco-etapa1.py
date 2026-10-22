"""Migração única da Eco 3D antiga para a Eco SVG, apenas na tela Hoje.
A biblioteca eco.js não é alterada por este script.
"""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
source = root / "design" / "design.html"
s = source.read_text(encoding="utf-8")
if '<style id="eco-hoje-css">' in s:
    print("Eco: fonte já migrada")
    raise SystemExit(0)

def only(old, new):
    global s
    found = s.count(old)
    assert found == 1, (old[:90], found)
    s = s.replace(old, new, 1)

def rx(pattern, replacement):
    global s
    s, n = re.subn(pattern, lambda m: replacement, s, count=1, flags=re.S)
    assert n == 1, pattern

css = """<style id="eco-hoje-css">
/* Eco SVG somente na tela Hoje: não afeta as mascotes CSS de outras telas. */
.ux-greeting>.eco-hoje-svg{flex:0 0 84px;width:84px;min-width:0;align-self:center}
.ux-greeting>.eco-hoje-svg>svg.eco{width:100%;height:auto;aspect-ratio:auto;container-type:normal;max-width:100%}
@media(max-width:420px){.ux-greeting>.eco-hoje-svg{flex-basis:72px;width:72px}}
@media(max-width:350px){.ux-greeting>.eco-hoje-svg{flex-basis:64px;width:64px}}
</style>"""
rx(r'<style id="eco-lab-css">.*?</style>', css)
rx(r'<script id="eco-3d-renderer">.*?</script>\n?', '')
rx(r'<script id="eco-glb-asset" type="application/octet-stream">.*?</script>\n?', '')
only("    bloco('Laboratório', [\n      botaoLinha('motion', 'Eco em 3D', 'Explore o mascote e suas expressões quando quiser', function () { ir('eco3D'); })\n    ]);\n", '')
rx(r'  TELAS\.eco3D=function\(\)\{.*?\n  \};\n\n(?=  TELAS\.descobrir=function\(context\)\{)', '')
only("greeting.appendChild(eco('neutral','Eco está com você'));",
     "var ecoHoje=document.createElement('div');ecoHoje.className='eco-hoje-svg';ecoHoje.setAttribute('role','img');ecoHoje.setAttribute('aria-label','Eco está com você');greeting.appendChild(ecoHoje);if(window.Eco){var mascoteHoje=Eco.criar(ecoHoje,{estilo:'2.5d'});mascoteHoje.estado('neutral');}")
assert 'EcoLabMount' not in s
assert 'eco-glb-asset' not in s
assert 'eco-3d-renderer' not in s
assert 'TELAS.eco3D' not in s
source.write_text(s, encoding="utf-8", newline="\n")
print("Eco: design migrado, total de", len(s.encode("utf-8")), "bytes")
