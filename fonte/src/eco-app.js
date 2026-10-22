/* Liga a Eco em SVG (src/eco.js) às telas: cria, troca de estado e limpa as que saíram da tela. */
var ECOS_VIVOS = [];
var ECO_MAPA = { neutral: 'neutral', happy: 'happy', celebrate: 'celebrate', proud: 'celebrate', confused: 'confused', sad: 'confused',
  thinking: 'thinking', reading: 'reading', listening: 'listening', speaking: 'speaking', sleepy: 'sleepy', surprise: 'surprise', wave: 'wave' };
function criarEco(estado, rotulo, decorativo) {
  ECOS_VIVOS = ECOS_VIVOS.filter(function (x) { if (!x.el.isConnected && Date.now() - x.em > 2000) { try { x.api.destruir(); } catch (e) {} return false; } return true; });
  var el = document.createElement('span'); el.className = 'eco eco-v2';
  if (decorativo) el.setAttribute('aria-hidden', 'true'); else { el.setAttribute('role', 'img'); el.setAttribute('aria-label', rotulo || 'Eco'); }
  try {
    var api = Eco.criar(el, { estilo: '2.5d', justo: true, estado: ECO_MAPA[estado] || 'neutral' });
    api.elemento.removeAttribute('role'); api.elemento.setAttribute('aria-hidden', 'true');
    if (document.documentElement.dataset.motion === 'reduce') api.reduzirMovimento(true);
    el.__eco = api; ECOS_VIVOS.push({ el: el, api: api, em: Date.now() });
  } catch (e) {}
  return el;
}
function ecoEstado(el, estado) { if (el && el.__eco) el.__eco.estado(ECO_MAPA[estado] || 'neutral'); }

/* Abertura do app: a Eco chega e o nome "idiomas" aparece (fonte/marca/idiomas-abertura.svg).
   Só na primeira abertura do dia; um toque pula; com "reduzir movimento", fica parada por um instante. */
(function () {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function' || typeof matchMedia !== 'function') return;
  function hoje() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function mostrar() {
    if (typeof ABERTURA_SVG === 'undefined' || window.__semAbertura || /[?&]sem-abertura/.test(location.search)) return;
    try { if (localStorage.getItem('idiomas-abertura') === hoje()) return; localStorage.setItem('idiomas-abertura', hoje()); } catch (e) { return; }
    var nome = ''; try { var S = JSON.parse(localStorage.getItem('idiomas-app-v2')); var p = S && S.perfis && S.perfis.filter(function (x) { return x.id === (S.ativo || S.ultimo); })[0]; nome = p ? p.nome : ''; } catch (e) {}
    var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce';
    var ov = document.createElement('div'); ov.className = 'abertura'; ov.setAttribute('role', 'status');
    ov.innerHTML = '<div class="abertura-arte"><img alt="Idiomas" src="data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ABERTURA_SVG).replace(/'/g, '%27') + '"></div><p class="abertura-frase"></p>';  /* como imagem: o CSS da animação não se mistura com o do app */
    ov.querySelector('.abertura-frase').textContent = window.Eco ? Eco.abertura({ nome: nome }).frase : '';
    if (reduz) ov.classList.add('abertura-parada');
    var fechado = false;
    function fechar() { if (fechado) return; fechado = true; ov.classList.add('abertura-saindo'); setTimeout(function () { ov.remove(); }, 350); }
    ov.addEventListener('pointerdown', fechar); addEventListener('keydown', fechar, { once: true });
    document.body.appendChild(ov); setTimeout(fechar, reduz ? 1400 : 3900);
  }
  var css = '.abertura{position:fixed;inset:0;z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#F6F4EF;transition:opacity .35s ease;cursor:pointer}' +
    '.abertura-arte{width:min(78vw,340px)}.abertura-arte img{width:100%;height:auto;display:block}' +
    '.abertura-frase{margin:0 24px;max-width:340px;text-align:center;font:500 16px/1.45 "Plus Jakarta Sans",system-ui,sans-serif;color:#4e5967;opacity:0;animation:aberturaFrase .5s 2.4s forwards}' +
    '.abertura-parada .abertura-frase{animation:none;opacity:1}' +
    '.abertura-saindo{opacity:0}@keyframes aberturaFrase{to{opacity:1}}' +
    '@media (prefers-color-scheme:dark){.abertura{background:#0f1320}.abertura-frase{color:#c3cad6}}html[data-theme="dark"] .abertura{background:#0f1320}html[data-theme="dark"] .abertura-frase{color:#c3cad6}html[data-theme="light"] .abertura{background:#F6F4EF}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mostrar); else mostrar();
})();
