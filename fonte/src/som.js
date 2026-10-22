  var SOM = (function () {
    /* Efeitos originais, sintetizados na hora (sem arquivos): sino de acerto, "bonk" de erro, toque, combo e fanfarra. */
    var ctx = null, out = null, VOL = 1;
    function ac() {
      if (!ctx) {
        var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
        try { ctx = new C(); } catch (e) { return null; }
        var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4; comp.connect(ctx.destination);
        out = ctx.createGain(); out.gain.value = 0.9 * VOL; out.connect(comp);
        var d = ctx.createDelay(); d.delayTime.value = 0.11; var fb = ctx.createGain(); fb.gain.value = 0.22; var wet = ctx.createGain(); wet.gain.value = 0.18;
        out.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(comp);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    /* nota com harmônicos, para soar como sino/marimba e não como apito */
    function nota(f, t0, dur, vol, tipo, f2, harm) {
      var c = ac(); if (!c) return;
      var t = c.currentTime + t0;
      (harm || [[1, 1]]).forEach(function (h) {
        var o = c.createOscillator(), g = c.createGain();
        o.type = tipo || 'sine'; o.frequency.setValueAtTime(f * h[0], t);
        if (f2) o.frequency.exponentialRampToValueAtTime(f2 * h[0], t + dur * 0.8);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * h[1], t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur / h[0] * (h[0] > 1 ? 1.4 : 1));
        o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.05);
      });
    }
    function sopro(t0, dur, f1, f2, vol) {
      var c = ac(); if (!c) return;
      var t = c.currentTime + t0, n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      var src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
      src.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 1.2; bp.frequency.setValueAtTime(f1, t); bp.frequency.exponentialRampToValueAtTime(f2, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(bp); bp.connect(g); g.connect(out); src.start(t); src.stop(t + dur + 0.02);
    }
    function pop(f, t0, vol) { nota(f, t0 || 0, 0.07, vol || 0.09, 'sine', f * 1.6, [[1, 1], [2, 0.15]]); }
    var SINO = [[1, 1], [2, 0.35], [3, 0.12], [4.2, 0.05]], MAD = [[1, 1], [4, 0.18], [9.8, 0.04]];
    var PENTA = [523.3, 587.3, 659.3, 784, 880, 1046.5], passo = 0, ultimo = 0;
    function madeira(vol, oit) {
      var agora = Date.now(); if (agora - ultimo < 70) return; ultimo = agora;     // toques seguidos não viram metralhadora
      passo = (passo + 1 + Math.floor(Math.random() * 2)) % PENTA.length;
      nota(PENTA[passo] * (oit || 1), 0, 0.12, vol, 'sine', 0, [[1, 1], [3.9, 0.08]]);
    }
    /* música de abertura (autoral, sintetizada aqui): ~3,6 s acompanhando a animação da Eco */
    function abertura() {
      var c = ac(); if (!c) return;
      /* a música soava baixa demais: sobe o volume geral só durante ela (o compressor segura os picos) */
      var t = c.currentTime, g = out.gain, base = 0.9 * VOL; g.cancelScheduledValues(t); g.setValueAtTime(base * 3.6, t); g.setValueAtTime(base * 3.6, t + 4.2); g.linearRampToValueAtTime(base, t + 4.6);
      [130.8, 196, 246.9, 293.7, 329.6].forEach(function (f) { nota(f, 0, 3.4, 0.022, 'triangle'); });           // base: Dó com 7ª e 9ª, suave
      [392, 523.3, 659.3, 784].forEach(function (f, i) { nota(f, 0.25 + i * 0.14, 0.45, 0.07, 'sine', 0, MAD); });  // chegada da Eco
      nota(261.6, 1.45, 0.18, 0.08, 'triangle', 0, MAD); nota(196, 1.62, 0.22, 0.07, 'triangle', 0, MAD);       // quica ao frear
      [659.3, 587.3, 784, 1046.5].forEach(function (f, i) { nota(f, 1.95 + i * 0.17, 0.5, 0.075, 'sine', 0, SINO); }); // aceno
      nota(2093, 2.75, 0.5, 0.05, 'sine', 0, SINO); sopro(2.72, 0.35, 3000, 9000, 0.012);                          // pingo dourado
      [523.3, 659.3, 784].forEach(function (f) { nota(f, 3.0, 1.2, 0.05, 'sine', 0, SINO); });                       // acorde final
    }
    return {
      vol: function (v) { VOL = v; if (out) out.gain.value = 0.9 * v; },
      /* toques: marimba bem baixinha, uma nota da escala pentatônica por toque (não repete o mesmo som) */
      clique: function () { madeira(0.022); },
      principal: function () { madeira(0.03); },
      aba: function () { madeira(0.026, 0.5); },
      voltar: function () { nota(700, 0, 0.09, 0.07, 'sine', 420); },
      liga: function () { nota(660, 0, 0.06, 0.08, 'sine'); nota(990, 0.06, 0.1, 0.08, 'sine', 0, [[1, 1], [2, 0.2]]); },
      desliga: function () { nota(880, 0, 0.06, 0.07, 'sine'); nota(587, 0.06, 0.1, 0.07, 'sine'); },
      tecla: function () { nota(1500 + Math.random() * 300, 0, 0.04, 0.07, 'triangle', 0, [[1, 1], [3.1, 0.1]]); },
      entrou: function () { [659.3, 987.8, 1318.5].forEach(function (f, i) { nota(f, i * 0.07, 0.35, 0.12, 'sine', 0, SINO); }); },
      folha: function () { sopro(0, 0.22, 500, 2200, 0.05); },
      fechar: function () { sopro(0, 0.18, 2000, 450, 0.04); },
      tela: function () { sopro(0, 0.16, 900, 2600, 0.025); },
      aviso: function () { nota(1174.7, 0, 0.35, 0.08, 'sine', 0, SINO); },
      toque: function () { nota(1320, 0, 0.06, 0.06, 'sine', 0, [[1, 1], [2, 0.2]]); },
      solta: function () { nota(880, 0, 0.06, 0.05, 'sine', 660); },
      acerto: function () { nota(880, 0, 0.18, 0.2, 'sine', 0, SINO); nota(1318.5, 0.085, 0.5, 0.2, 'sine', 0, SINO); },
      combo: function () { [880, 1108.7, 1318.5, 1760].forEach(function (f, i) { nota(f, i * 0.055, i === 3 ? 0.55 : 0.2, 0.15, 'sine', 0, SINO); }); },
      erro: function () { nota(220, 0, 0.16, 0.22, 'triangle', 196, MAD); nota(164.8, 0.12, 0.32, 0.2, 'triangle', 146.8, MAD); },
      fim: function () {
        [523.3, 659.3, 784, 1046.5].forEach(function (f, i) { nota(f, i * 0.1, 0.3, 0.14, 'triangle'); });
        [1046.5, 1318.5, 1568].forEach(function (f) { nota(f, 0.42, 0.9, 0.09, 'sine', 0, SINO); });
        for (var i = 0; i < 6; i++) nota(2093 + i * 260, 0.5 + i * 0.05, 0.12, 0.03, 'sine');
      },
      abertura: abertura,
      contexto: function () { return ac(); },
      chama: function () { nota(330, 0, 0.45, 0.03, 'sawtooth', 990); nota(988, 0.2, 0.5, 0.12, 'sine', 0, SINO); nota(1480, 0.3, 0.6, 0.08, 'sine', 0, SINO); }
    };
  })();
  window.SOM = SOM;
