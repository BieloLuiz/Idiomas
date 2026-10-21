
/* Eco: os olhos seguem o dedo ou o mouse, e ele reage quando é tocado. */
(function () {
  var x = 0, y = 0, raf = 0;
  function upd() {
    raf = 0;
    document.querySelectorAll('.eco').forEach(function (el) {
      var r = el.getBoundingClientRect(); if (!r.width) return;
      el.style.setProperty('--lx', Math.max(-1, Math.min(1, (x - r.left - r.width / 2) / 220)).toFixed(2));
      el.style.setProperty('--ly', Math.max(-1, Math.min(1, (y - r.top - r.height / 2) / 220)).toFixed(2));
    });
  }
  addEventListener('pointermove', function (e) { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  addEventListener('pointerdown', function (e) { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('.eco'); if (!el) return;
    el.classList.remove('is-poke'); void el.offsetWidth; el.classList.add('is-poke');
    setTimeout(function () { el.classList.remove('is-poke'); }, 520);
  });
})();

