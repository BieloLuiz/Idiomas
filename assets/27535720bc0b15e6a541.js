
/* Idiomas 2.1 - identidade da navegação lateral; nenhum dado pedagógico é alterado. */
(function(){
  var root=document.getElementById('root');
  if(!root)return;
  function atualizarMarca(){
    var nav=root.querySelector('.shell > .tabbar.ui-nav');
    if(!nav || nav.querySelector('.v21-sidebar-brand'))return;
    var brand=document.createElement('div');brand.className='v21-sidebar-brand';brand.setAttribute('aria-hidden','true');
    brand.innerHTML='<span class="v21-brand-mark">✦</span><span><span class="v21-brand-name" style="display:block">Idiomas</span><span class="v21-brand-sub" style="display:block">Uma jornada por vez.</span></span>';
    nav.insertBefore(brand,nav.firstChild);
    var foot=document.createElement('div');foot.className='v21-sidebar-footer';
    foot.textContent='Aprenda no seu ritmo. Cada passo conta.';foot.setAttribute('aria-hidden','true');
    nav.appendChild(foot);
  }
  var obs=new MutationObserver(atualizarMarca);
  obs.observe(root,{childList:true});
  atualizarMarca();
})();
