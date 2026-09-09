/*
 * The small vertical "outline" tab on the edge of the content opens a
 * panel with two things, styled like the old sidebar:
 *   1. A table of contents generated from the current page's own
 *      headings (h1/h2/h3 — they already have slugged ids from TinyMD).
 *   2. Below a divider, quick links to sibling pages in the same nav
 *      section, for further site navigation without closing the panel.
 */
(function (global) {
  function buildToc(pageEl) {
    var heads = pageEl.querySelectorAll('h1, h2, h3');
    var toc = document.createElement('div');
    toc.className = 'outline-toc';
    if (!heads.length) {
      toc.innerHTML = '<p class="outline-empty">No headings on this page.</p>';
      return toc;
    }
    heads.forEach(function (h) {
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.className = 'outline-toc-link outline-level-' + h.tagName.toLowerCase();
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(h.id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        global.OutlinePanel.close();
      });
      toc.appendChild(a);
    });
    return toc;
  }

  function buildSiblingNav(index, currentId) {
    var wrap = document.createElement('div');
    wrap.className = 'outline-siblings';

    var title = document.createElement('div');
    title.className = 'outline-siblings-title';
    title.textContent = 'More in this section';
    wrap.appendChild(title);

    var siblings = SiteNav.siblingsOf(index, currentId);
    if (!siblings.length) {
      wrap.appendChild(Object.assign(document.createElement('p'), { className: 'outline-empty', textContent: 'Nothing else here yet.' }));
      return wrap;
    }

    siblings.forEach(function (node) {
      var a = document.createElement('a');
      a.className = 'outline-sibling-link' + (node.id === currentId ? ' active' : '');
      a.href = SiteNav.hrefFor(node);
      a.textContent = node.title;
      if (SiteNav.isExternal(node)) { a.target = '_blank'; a.rel = 'noopener'; a.classList.add('ext'); }
      else a.addEventListener('click', function () { global.OutlinePanel.close(); });
      wrap.appendChild(a);
    });
    return wrap;
  }

  function render(index, pageEl, currentId) {
    var body = document.getElementById('outlineBody');
    if (!body) return;
    body.innerHTML = '';
    body.appendChild(buildToc(pageEl));
    var divider = document.createElement('div');
    divider.className = 'outline-divider';
    body.appendChild(divider);
    body.appendChild(buildSiblingNav(index, currentId));
  }

  global.OutlineContent = { render: render };
})(window);
