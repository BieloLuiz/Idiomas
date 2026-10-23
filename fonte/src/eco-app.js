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
   Toda vez que o app abre; um toque pula; com "reduzir movimento", fica parada por um instante. */
(function () {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function' || typeof matchMedia !== 'function') return;
  function hoje() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function mostrar() {
    if (typeof ABERTURA_SVG === 'undefined' || window.__semAbertura || /[?&]sem-abertura/.test(location.search)) return;
    /* toda vez que o app abre do zero; recarregar a página (ex.: sincronização) não repete, porque a sessão continua */
    try { if (sessionStorage.getItem('idiomas-abertura')) return; sessionStorage.setItem('idiomas-abertura', '1'); } catch (e) { return; }
    var nome = ''; try { var S = JSON.parse(localStorage.getItem('idiomas-app-v2')); var p = S && S.perfis && S.perfis.filter(function (x) { return x.id === (S.ativo || S.ultimo); })[0]; nome = p ? p.nome : ''; } catch (e) {}
    var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce';
    var cfg = {}; try { cfg = (JSON.parse(localStorage.getItem('idiomas-app-v2')) || {}).cfg || {}; } catch (e) {}
    var comMusica = cfg.musica !== false && !cfg.silent && cfg.efeitos !== false, ctx = comMusica && window.SOM ? SOM.contexto() : null;
    /* iPhone/iPad (e navegadores que bloqueiam som sem toque): a animação espera o primeiro toque, para sair junto com a música */
    var esperar = !!ctx && ctx.state !== 'running';
    var ov = document.createElement('div'); ov.className = 'abertura' + (esperar ? ' abertura-espera' : ''); ov.setAttribute('role', 'status');
    ov.innerHTML = '<div class="abertura-arte"></div><p class="abertura-frase"></p>' + (esperar ? '<p class="abertura-toque">Toque para começar</p>' : '');
    ov.querySelector('.abertura-frase').textContent = window.Eco ? Eco.abertura({ nome: nome }).frase : '';
    if (reduz) ov.classList.add('abertura-parada');
    var fechado = false, comecou = false;
    function fechar() { if (fechado) return; fechado = true; ov.classList.add('abertura-saindo'); setTimeout(function () { ov.remove(); }, 350); }
    function comecar() {
      if (comecou) return; comecou = true; if (esperar) ov.querySelector('.abertura-frase').style.animation = 'none'; ov.classList.remove('abertura-espera'); var t = ov.querySelector('.abertura-toque'); if (t) t.remove();
      /* como imagem: o CSS da animação não se mistura com o do app; inserir agora faz a animação começar agora */
      ov.querySelector('.abertura-arte').innerHTML = '<img alt="Idiomas" src="data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ABERTURA_SVG).replace(/'/g, '%27') + '">';
      /* iPhone/iPad: sem isto, o som do app obedece à chave de silencioso do aparelho e pode não sair */
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
      try { var mudo = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='); mudo.play().catch(function () {}); } catch (e) {}
      if (ctx) { var tocou = false, vai = function () { if (tocou || ctx.state !== 'running') return; tocou = true; SOM.vol(cfg.volume == null ? 1 : cfg.volume); SOM.abertura(); }; vai(); try { ctx.resume().then(vai).catch(function () {}); } catch (e) {} setTimeout(vai, 250); }
      setTimeout(fechar, reduz ? 1400 : 3900);
    }
    if (esperar) {
      var eco = window.criarEco ? criarEco('neutral', '', true) : null; if (eco) { eco.classList.add('abertura-eco'); ov.querySelector('.abertura-arte').appendChild(eco); }
      /* no iPhone/iPad o som só é liberado em "touchend"/"click" (não em "pointerdown"): por isso o toque é tratado aqui */
      var toque = function (ev) { if (ev && ev.type === 'touchend') ev.preventDefault(); if (!comecou) { if (ctx) try { ctx.resume(); } catch (e) {} comecar(); } else fechar(); };
      ov.addEventListener('touchend', toque); ov.addEventListener('click', toque);
      addEventListener('keydown', function () { if (!comecou) comecar(); else fechar(); });
      setTimeout(function () { if (!comecou) fechar(); }, 30000);    // ninguém tocou: abre o app
    } else {
      ov.addEventListener('pointerdown', fechar); addEventListener('keydown', fechar, { once: true });
    }
    document.body.appendChild(ov); if (!esperar) comecar();
  }
  var css = '.abertura{position:fixed;inset:0;z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#F6F4EF;transition:opacity .35s ease;cursor:pointer}' +
    '.abertura-arte{width:min(78vw,340px)}.abertura-arte img{width:100%;height:auto;display:block}' +
    '.abertura-frase{margin:0 24px;max-width:340px;text-align:center;font:500 16px/1.45 "Plus Jakarta Sans",system-ui,sans-serif;color:#4e5967;opacity:0;animation:aberturaFrase .5s 2.4s forwards}' +
    '.abertura-parada .abertura-frase{animation:none;opacity:1}' +
    '.abertura-saindo{opacity:0}.abertura-espera .abertura-frase{animation:none;opacity:1}.abertura-eco{width:34%;margin:0 auto}.abertura-toque{margin:18px 0 0;font:600 15px/1.4 "Plus Jakarta Sans",system-ui,sans-serif;color:#5366C7;animation:aberturaPulso 1.6s ease-in-out infinite}@keyframes aberturaPulso{50%{opacity:.45}}@keyframes aberturaFrase{to{opacity:1}}' +
    '@media (prefers-color-scheme:dark){.abertura{background:#0f1320}.abertura-frase{color:#c3cad6}}html[data-theme="dark"] .abertura{background:#0f1320}html[data-theme="dark"] .abertura-frase{color:#c3cad6}html[data-theme="light"] .abertura{background:#F6F4EF}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mostrar); else mostrar();
})();

/* boca e antena acompanham a conversa: falando, a boca mexe; ouvindo, o anel da antena segue o volume do microfone */
function ecoVoz(el, estado, microfone) {
  var api = el && el.__eco; if (!api) return;
  try {
    api.simularVoz(estado === 'speaking');
    if ((estado === 'listening' || estado === 'recording') && microfone && microfone.active) { if (el.__ecoMic !== microfone) { api.conectarAudio(microfone); el.__ecoMic = microfone; } }
    else if (el.__ecoMic) { api.desconectarAudio(); el.__ecoMic = null; }
  } catch (e) {}
}
