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
