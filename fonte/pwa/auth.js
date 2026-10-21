/* Credencial Google apenas na memória desta aba. A lista de contas fica no servidor. */
(function () {
  'use strict';
  var token = '', expiry = 0, boot, expiryTimer, overlay;
  var enabled = !!window.IDIOMAS_API;
  if (enabled) document.documentElement.dataset.auth = 'locked';
  function gate(message) {
    document.documentElement.dataset.auth = 'locked';
    document.dispatchEvent(new CustomEvent('idiomas-auth-locked'));
    if (!overlay) {
      overlay = document.createElement('main'); overlay.className = 'auth-gate';
      overlay.innerHTML = '<h1>Seu espaço de estudo</h1><p>Entre com uma das contas Google autorizadas para acessar os perfis de vocês.</p><p role="status"></p><div class="google-button"></div><button type="button" class="auth-retry">Tentar novamente</button><button type="button" class="auth-offline">Estudar neste aparelho sem sincronizar</button><p>No modo local, use o PIN do perfil. IA e sincronização precisam de entrada Google.</p>';
      overlay.querySelector('.auth-retry').onclick = function () { boot = null; start(); };
      overlay.querySelector('.auth-offline').onclick = function () { token='';document.documentElement.dataset.auth='offline';overlay.hidden=true;document.dispatchEvent(new CustomEvent('idiomas-offline')); }; document.body.appendChild(overlay);
    }
    overlay.hidden = false; overlay.querySelector('[role=status]').textContent = message || '';
  }
  function post(body, options) {
    options = options || {}; var ctrl = new AbortController(), timer = setTimeout(function () { ctrl.abort(); }, options.timeout || 55000);
    if (!token || Date.now() >= expiry) { gate('Entre novamente para continuar.'); return Promise.reject(new Error('auth_required')); }
    return fetch(window.IDIOMAS_API, { method: 'POST', body: JSON.stringify(Object.assign({}, body, { token: token })), signal: ctrl.signal, keepalive: !!options.keepalive })
      .then(function (r) { if (!r.ok) throw new Error('http_' + r.status); return r.json(); })
      .then(function (r) { if (!r || r.erro) { if (r && /^auth_/.test(r.erro)) { token = ''; gate('Sua sessão terminou. Entre novamente.'); } throw new Error(r && r.erro || 'falha'); } return r; })
      .finally(function () { clearTimeout(timer); });
  }
  function credential(response) {
    token = response.credential;
    try { expiry = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000; } catch (e) { token = ''; gate('Não foi possível validar sua entrada.'); return; }
    post({ acao: 'entrarGoogle' }).then(function () {
      document.documentElement.dataset.auth = 'ready'; if (overlay) overlay.hidden = true;
      clearTimeout(expiryTimer); expiryTimer = setTimeout(function () { token = ''; gate('Sua sessão terminou. Entre novamente.'); }, Math.max(1, expiry - Date.now()));
      document.dispatchEvent(new CustomEvent('idiomas-auth-ready'));
    }).catch(function (e) { token = ''; gate(e.message === 'auth_denied' ? 'Esta conta não está autorizada. Escolha a conta usada para estudar.' : 'Não consegui entrar agora. Tente novamente.'); });
  }
  function start() {
    if (!enabled) return Promise.resolve();
    if (boot) return boot;
    gate('Preparando a entrada segura…');
    boot = fetch(window.IDIOMAS_API).then(function (r) { return r.json(); }).then(function (cfg) {
      if (!cfg.googleClientId) throw new Error('auth_config');
      return new Promise(function (resolve, reject) {
        function mount() { try { google.accounts.id.initialize({ client_id: cfg.googleClientId, callback: credential, auto_select: false }); google.accounts.id.renderButton(overlay.querySelector('.google-button'), { type: 'standard', theme: 'outline', size: 'large', text: 'signin_with', width:Math.min(320,Math.max(200,innerWidth-64)) }); overlay.querySelector('[role=status]').textContent = ''; resolve(); } catch (e) { reject(e); } }
        if (window.google && google.accounts) mount(); else { var script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.onload = mount; script.onerror = reject; document.head.appendChild(script); }
      });
    }).catch(function (e) { gate(e.message === 'auth_config' ? 'A entrada Google precisa ser configurada pelo responsável pelo aplicativo.' : 'Sem conexão para entrar. Conecte-se à internet e tente novamente.'); });
    return boot;
  }
  window.AUTH = { enabled: enabled, ready: function () { return !enabled || !!token && Date.now() < expiry; }, post: post, start: function(){boot=null;return start();}, logout: function () { token = ''; gate('Entre para continuar.'); } };
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
  if (enabled) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start(); }
})();
