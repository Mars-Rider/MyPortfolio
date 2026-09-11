/*
 * Builds two things from data/nav.json, both feeding the SAME #megaMenu
 * panel element — that's what makes the header itself grow/push the page
 * down (it's a sibling of the fixed-height .header-inner, inside
 * .site-header), rather than floating a box over the page.
 *
 *  - Narrow (<1100px): a flat list of every page, opened by clicking
 *    #menuToggle.
 *
 *  - Desktop (>=1100px): every top-level nav.json entry (except Home,
 *    already covered by the brand link) gets its own ".mega-link-top"
 *    link inserted directly into the header, before #menuToggle (which
 *    hides itself at this width). Hovering — or focusing, for keyboard
 *    users — any of those links opens the same #megaMenu panel, filled
 *    with one column per section (".mega-menu-list div", matching your
 *    existing CSS), all shown together.
 *
 * Both the mobile list and the desktop bar/columns are built ONCE, up
 * front, and cached — resizing across the breakpoint just swaps which
 * pre-built content is visible, no rebuilding or re-fetching, so the
 * existing .mega-menu max-height transition actually gets to run.
 *
 * Self-contained: finds the header elements it needs by the ids already
 * in index.html (#headerActions, #menuToggle, #megaMenu), so nothing
 * else needs to change.
 */
(function (global) {
  var DESKTOP_BREAKPOINT = 800;

  function hrefFor(node) {
    if (node.type === 'external') return node.url;
    return '#/' + node.id;
  }
  function isExternal(node) { return node.type === 'external'; }

  // ---------------------------------------------------------------------
  // Shared: renders one node (and its children, indented) into `container`.
  // Used both for the mobile flat list (whole tree) and for a single
  // desktop column (one top-level node's children).
  // ---------------------------------------------------------------------
  function appendMegaEntry(container, node, depth) {
    if (node.type === 'group') {
      var label = document.createElement('div');
      label.className = 'mega-group-title';
      label.style.paddingLeft = (10 + depth * 16) + 'px';
      label.textContent = node.title;
      container.appendChild(label);
      (node.children || []).forEach(function (c) { appendMegaEntry(container, c, depth + 1); });
      return;
    }

    var a = document.createElement('a');
    a.className = 'mega-link' + (depth === 0 ? ' mega-link-top' : '');
    a.style.paddingLeft = (10 + depth * 16) + 'px';
    a.dataset.id = node.id;
    a.href = hrefFor(node);
    a.textContent = node.title;
    if (isExternal(node)) { a.target = '_blank'; a.rel = 'noopener'; a.classList.add('ext'); }
    container.appendChild(a);

    (node.children || []).forEach(function (c) { appendMegaEntry(container, c, depth + 1); });
  }

  // ---------------------------------------------------------------------
  // Mobile content: the full tree, flat and indented (unchanged behavior)
  // ---------------------------------------------------------------------
  function buildFlatList(tree) {
    var list = document.createElement('div');
    list.className = 'mega-menu-list';
    tree.forEach(function (node) { appendMegaEntry(list, node, 0); });
    return list;
  }

  // ---------------------------------------------------------------------
  // Desktop content: one bar link + one column per top-level section
  // ---------------------------------------------------------------------
  function buildColumn(node) {
    var col = document.createElement('div'); // ".mega-menu-list div" already styles this
    var heading = document.createElement('div');
    heading.className = 'mega-group-title';
    heading.style.cssText = 'margin-top:0; padding-top:0; border-top:none;'; // no separator needed as the first thing in its own column
    heading.textContent = node.title;
    col.appendChild(heading);
    (node.children || []).forEach(function (child) { appendMegaEntry(col, child, 0); });
    return col;
  }

  function buildDesktopContent(tree) {
    var bar = document.createElement('nav');
    bar.id = 'desktopNavBar';
    bar.setAttribute('aria-label', 'Primary');
    bar.style.cssText = 'display:flex; align-items:center; gap:10px;';

    var list = document.createElement('div');
    list.className = 'mega-menu-list';
    list.style.cssText = 'flex-direction:row; flex-wrap:wrap; justify-content:flex-end; gap:32px;';

    tree.forEach(function (node) {
      if (node.id === 'home') return; // the brand link already covers Home

      var a = document.createElement('a');
      a.className = 'mega-link mega-link-top';
      a.dataset.id = node.id;
      a.href = hrefFor(node);
      a.textContent = node.title;
      if (isExternal(node)) { a.target = '_blank'; a.rel = 'noopener'; a.classList.add('ext'); }
      if(node.type !== 'group') bar.appendChild(a);

      if (node.children && node.children.length) {
        list.appendChild(buildColumn(node));
      }
    });

    return { bar: bar, list: list };
  }

  function setupDesktopNav(tree, megaMenuInner, flatListEl) {
    var headerActions = document.getElementById('headerActions');
    var menuToggle = document.getElementById('menuToggle');
    var megaMenu = document.getElementById('megaMenu');
    if (!headerActions || !menuToggle || !megaMenu) return; // header markup not present — skip quietly

    var old = document.getElementById('desktopNavBar');
    if (old) old.remove();

    var built = buildDesktopContent(tree);
    headerActions.insertBefore(built.bar, menuToggle);

    // Hover always forces OPEN (never toggles) — hovering a second link
    // while the panel is already open must keep it open, not close it.
    function openPanel() { megaMenu.classList.add('open'); }
    function closePanel() { megaMenu.classList.remove('open'); }

    built.bar.addEventListener('mouseenter', openPanel);
    megaMenu.addEventListener('mouseleave', function (e) {
      if (!built.bar.contains(e.relatedTarget)) closePanel();
    });
    built.bar.addEventListener('focusin', openPanel);
    built.bar.addEventListener('focusout', function (e) {
      if (!built.bar.contains(e.relatedTarget) && !megaMenu.contains(e.relatedTarget)) closePanel();
    });
    built.bar.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closePanel(); // e.g. an external link, which won't trigger a route change
    });

    function applyBreakpoint() {
      var isDesktop = global.innerWidth >= DESKTOP_BREAKPOINT;
      built.bar.style.display = isDesktop ? 'flex' : 'none';
      menuToggle.style.display = isDesktop ? 'none' : '';
      megaMenuInner.innerHTML = '';
      megaMenuInner.appendChild(isDesktop ? built.list : flatListEl);
      if (!isDesktop) closePanel(); // don't leave it hover-stuck-open when shrinking to mobile
    }
    applyBreakpoint();
    global.addEventListener('resize', applyBreakpoint);
  }

  // ---------------------------------------------------------------------
  function buildMegaMenu(container, tree) {
    // `container` is #megaMenuInner — the single panel used by both modes.
    var flatListEl = buildFlatList(tree);
    container.innerHTML = '';
    container.appendChild(flatListEl); // default content until applyBreakpoint runs

    setupDesktopNav(tree, container, flatListEl);
  }

  function setActive(id) {
    document.querySelectorAll('[data-id]').forEach(function (el) {
      el.classList.toggle('active', el.dataset.id === id);
    });
  }

  // ---- flat lookup + parent/sibling info used by the page-outline panel ----
  function flatten(tree) {
    var map = {};
    var parentOf = {};
    (function walk(nodes, parent) {
      nodes.forEach(function (node) {
        map[node.id] = node;
        parentOf[node.id] = parent;
        if (node.children) walk(node.children, node);
      });
    })(tree, null);
    return { map: map, parentOf: parentOf, tree: tree };
  }

  // Siblings = other leaf pages in the same immediate group/section as `id`.
  // Falls back to the top-level nav list if the page has no parent group.
  function siblingsOf(index, id) {
    var parent = index.parentOf[id];
    var list = parent ? (parent.children || []) : index.tree;
    return list.filter(function (n) { return n.type !== 'group'; });
  }

  global.SiteNav = {
    buildMegaMenu: buildMegaMenu,
    setActive: setActive,
    flatten: flatten,
    siblingsOf: siblingsOf,
    hrefFor: hrefFor,
    isExternal: isExternal
  };
})(window);