/* Entrada com Google uma vez por aparelho.
   O Google confirma quem é a pessoa; o servidor devolve uma sessão própria (60 dias) que fica guardada neste aparelho.
   O app nunca some da tela: se a sessão acabar, só a sincronização e a IA pausam e aparece um aviso para entrar de novo. */
(function () {
  'use strict';
  var KS = 'idiomas-sessao', KL = 'idiomas-modo-local';
  var token = '', expiry = 0, boot, overlay;
  var enabled = !!window.IDIOMAS_API;
  function ler(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function gravar(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var salva = ler(KS);
  if (salva && typeof salva.token === 'string' && salva.exp > Date.now()) { token = salva.token; expiry = salva.exp; }
  else gravar(KS, null);
  var modoLocal = !!ler(KL);
  if (enabled) document.documentElement.dataset.auth = token ? 'ready' : (modoLocal ? 'offline' : 'locked');

  function ready() { return !enabled || (!!token && Date.now() < expiry); }
  function esquecer() { token = ''; expiry = 0; gravar(KS, null); }

  /* bloqueia a tela só na primeira vez neste aparelho; depois é um aviso que não atrapalha a lição */
  function painel(message, bloquear) {
    if (bloquear) { document.documentElement.dataset.auth = 'locked'; document.dispatchEvent(new CustomEvent('idiomas-auth-locked')); }
    if (!overlay) {
      overlay = document.createElement('main'); overlay.className = 'auth-gate';
      overlay.innerHTML = '<h1>Seu espaço de estudo</h1><p class="auth-texto">Entre com uma das contas Google autorizadas. Neste aparelho, você só precisa fazer isso uma vez.</p><p role="status"></p><div class="google-button"></div><button type="button" class="auth-retry">Tentar novamente</button><button type="button" class="auth-offline">Estudar neste aparelho sem sincronizar</button><button type="button" class="auth-fechar">Agora não</button>';
      overlay.querySelector('.auth-retry').onclick = function () { boot = null; montar(); };
      overlay.querySelector('.auth-offline').onclick = function () {
        modoLocal = true; gravar(KL, true); document.documentElement.dataset.auth = 'offline'; overlay.hidden = true;
        document.dispatchEvent(new CustomEvent('idiomas-offline'));
      };
      overlay.querySelector('.auth-fechar').onclick = function () { overlay.hidden = true; };
      document.body.appendChild(overlay);
    }
    var travado = document.documentElement.dataset.auth === 'locked';
    overlay.classList.toggle('auth-soft', !travado);
    overlay.querySelector('.auth-offline').hidden = !travado;
    overlay.querySelector('.auth-fechar').hidden = travado;
    overlay.hidden = false; overlay.querySelector('[role=status]').textContent = message || '';
    montar();
  }
  function fecharPainel() { if (overlay) overlay.hidden = true; }

  function post(body, options) {
    options = options || {};
    if (!ready()) { esquecer(); return Promise.reject(new Error('auth_required')); }
    return enviar(Object.assign({}, body, { token: token }), options);
  }
  function enviar(body, options) {
    var ctrl = new AbortController(), timer = setTimeout(function () { ctrl.abort(); }, options.timeout || 55000);
    return fetch(window.IDIOMAS_API, { method: 'POST', body: JSON.stringify(body), signal: ctrl.signal, keepalive: !!options.keepalive })
      .then(function (r) { if (!r.ok) throw new Error('http_' + r.status); return r.json(); })
      .then(function (r) {
        if (!r || r.erro) {
          if (r && /^auth_/.test(r.erro) && body.acao !== 'entrarGoogle') {
            esquecer(); document.documentElement.dataset.auth = 'offline';
            painel('Sua entrada neste aparelho terminou. Entre de novo para voltar a sincronizar e usar a IA. A lição continua normalmente.', false);
          }
          throw new Error(r && r.erro || 'falha');
        }
        return r;
      })
      .finally(function () { clearTimeout(timer); });
  }
  function credential(response) {
    var google = response && response.credential;
    if (!google) return;
    enviar({ acao: 'entrarGoogle', token: google }, {}).then(function (r) {
      if (!r.sessao || !r.expira) throw new Error('auth_required');
      token = r.sessao; expiry = Number(r.expira); gravar(KS, { token: token, exp: expiry });
      modoLocal = false; gravar(KL, null);
      document.documentElement.dataset.auth = 'ready'; fecharPainel();
      document.dispatchEvent(new CustomEvent('idiomas-auth-ready'));
    }).catch(function (e) {
      if (overlay) overlay.querySelector('[role=status]').textContent = e.message === 'auth_denied' ? 'Esta conta não está autorizada. Escolha a conta usada para estudar.' : 'Não consegui entrar agora. Tente novamente.';
    });
  }
  function montar() {
    if (!enabled || !overlay) return Promise.resolve();
    if (boot) return boot;
    boot = fetch(window.IDIOMAS_API).then(function (r) { return r.json(); }).then(function (cfg) {
      if (!cfg.googleClientId) throw new Error('auth_config');
      return new Promise(function (resolve, reject) {
        function mount() { try { google.accounts.id.initialize({ client_id: cfg.googleClientId, callback: credential, auto_select: false }); var alvo = overlay.querySelector('.google-button'); alvo.innerHTML = ''; google.accounts.id.renderButton(alvo, { type: 'standard', theme: 'outline', size: 'large', text: 'signin_with', width: Math.min(320, Math.max(200, innerWidth - 64)) }); resolve(); } catch (e) { reject(e); } }
        if (window.google && google.accounts) mount(); else { var script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.onload = mount; script.onerror = reject; document.head.appendChild(script); }
      });
    }).catch(function (e) {
      boot = null;
      if (overlay) overlay.querySelector('[role=status]').textContent = e.message === 'auth_config' ? 'A entrada Google precisa ser configurada pelo responsável pelo aplicativo.' : 'Sem conexão para entrar. Conecte-se à internet e tente novamente.';
    });
    return boot;
  }
  function inicio() {
    if (!enabled) return;
    if (token) { document.dispatchEvent(new CustomEvent('idiomas-auth-ready')); return; }
    if (!modoLocal) painel('', true);
  }
  window.AUTH = {
    enabled: enabled, ready: ready, post: post,
    start: function () { if (ready()) return Promise.resolve(); painel('', document.documentElement.dataset.auth === 'locked'); return montar(); },
    logout: function () {
      var t = token; esquecer();
      if (t) enviar({ acao: 'sair', token: t }, { timeout: 8000 }).catch(function () {});
      document.documentElement.dataset.auth = 'offline'; modoLocal = true; gravar(KL, true);
    }
  };
  var enc = new TextEncoder();
  function hex(b) { return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }
  window.PIN = {
    create: function (value) {
      var salt = hex(crypto.getRandomValues(new Uint8Array(16)));
      return crypto.subtle.importKey('raw', enc.encode(value), 'PBKDF2', false, ['deriveBits']).then(function (key) { return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', iterations: 100000, salt: enc.encode(salt) }, key, 256); }).then(function (hash) { return { alg: 'PBKDF2', salt: salt, iterations: 100000, hash: hex(hash) }; });
    },
    verify: function (value, p) {
      var c = p.pinCredential;
      if (!c) return Promise.resolve(String(p.pin || '') === value);
      if (c.alg === 'SHA-256-legacy') return crypto.subtle.digest('SHA-256', enc.encode(c.salt + value)).then(function (b) { return hex(b) === c.hash; });
      if (c.alg !== 'PBKDF2' || c.iterations !== 100000) return Promise.resolve(false);
      return crypto.subtle.importKey('raw', enc.encode(value), 'PBKDF2', false, ['deriveBits']).then(function (key) { return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', iterations: c.iterations, salt: enc.encode(c.salt) }, key, 256); }).then(function (b) { return hex(b) === c.hash; });
    }
  };
  if (enabled) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inicio); else inicio(); }
})();
