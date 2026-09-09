/*
 * Builds the full-site "mega menu" nav panel and the page-outline panel's
 * sibling-navigation buttons from data/nav.json. Data-driven: add a page
 * by adding one entry to nav.json and this renders it automatically, with
 * correct indentation for nested groups (e.g. Mini Projects).
 */
(function (global) {
  function hrefFor(node) {
    if (node.type === 'external') return node.url;
    return '#/' + node.id;
  }
  function isExternal(node) { return node.type === 'external'; }

  // ---- full-site mega menu (replaces the old per-item hover dropdowns) ----
  function buildMegaMenu(container, tree) {
    container.innerHTML = '';
    var list = document.createElement('div');
    list.className = 'mega-menu-list';
    tree.forEach(function (node) { appendMegaEntry(list, node, 0); });
    container.appendChild(list);
  }

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
