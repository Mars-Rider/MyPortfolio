(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  SiteTheme.init();
  BgShapes.init();

  // ---- mega menu (full-site nav) ----
  var menuToggle = document.getElementById('menuToggle');
  var megaMenu = document.getElementById('megaMenu');

  var MegaMenu = {
    open: function () {
      megaMenu.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      OutlinePanel.close();
    },
    close: function () {
      megaMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    },
    toggle: function () {
      megaMenu.classList.contains('open') ? this.close() : this.open();
    }
  };
  window.MegaMenu = MegaMenu;
  menuToggle.addEventListener('click', function () { MegaMenu.toggle(); });
  megaMenu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') MegaMenu.close();
  });

  // ---- page outline panel ----
  var outlineToggle = document.getElementById('outlineToggle');
  var outlinePanel = document.getElementById('outlinePanel');
  var outlineClose = document.getElementById('outlineClose');

  var OutlinePanel = {
    open: function () {
      outlinePanel.classList.add('open');
      outlineToggle.setAttribute('aria-expanded', 'true');
      outlineToggle.classList.add('active');
      MegaMenu.close();
    },
    close: function () {
      outlinePanel.classList.remove('open');
      outlineToggle.setAttribute('aria-expanded', 'false');
      outlineToggle.classList.remove('active');
    },
    toggle: function () {
      outlinePanel.classList.contains('open') ? this.close() : this.open();
    }
  };
  window.OutlinePanel = OutlinePanel;
  outlineToggle.addEventListener('click', function () { OutlinePanel.toggle(); });
  outlineClose.addEventListener('click', function () { OutlinePanel.close(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { MegaMenu.close(); OutlinePanel.close(); Router.closeLightbox(); }
  });
  document.addEventListener('click', function (e) {
    if (!megaMenu.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
      // clicking anywhere outside the open mega menu closes it
      if (megaMenu.classList.contains('open')) MegaMenu.close();
    }

    if (
      !outlinePanel.contains(e.target) &&
      e.target !== outlineToggle &&
      !outlineToggle.contains(e.target)
    ) {
      // clicking anywhere outside the open mega menu closes it
      if (outlinePanel.classList.contains("open")) OutlinePanel.close();
    }
  });

  // ---- boot ----
  fetch('data/nav.json')
    .then(function (r) { return r.json(); })
    .then(function (tree) {
      SiteNav.buildMegaMenu(document.getElementById('megaMenuInner'), tree);
      Router.init(tree);
    })
    .catch(function (err) {
      document.getElementById('content').innerHTML =
        '<article class="page"><h1>Something went wrong</h1><p>Could not load data/nav.json — ' + err.message + '</p></article>';
    });
})();
