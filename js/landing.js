/*
 * Automatic navigation from tags — rendered as a small diagram of nodes
 * (one per top-level tag section) with lines drawn between any two
 * sections that share a page (an "intersection"). Click a node to expand
 * its page list beneath the diagram. Built once from data already in
 * nav.json — no extra markup, no per-frame work, just a static SVG.
 */
(function (global) {
  var LABELS = {
    rocketry: 'Rocketry', robotics: 'Robotics', art: 'My Art',
    tutorials: 'Tutorials / Guides', outdoors: 'The Outdoors',
    mechanical: 'Mechanical', electrical: 'Electrical', software: 'Software',
    misc: 'Misc', mtb: 'MTB', 'boy-scouts': 'Boy Scouts', 'random-trips': 'Random Trips'
  };
  function label(key) {
    return LABELS[key] || key.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  // Collapse "projects" itself out of the diagram (its subtags —
  // mechanical/electrical/software/misc — carry all the real pages; the
  // bare "projects" tag only ever points at the index page itself).
  function collect(navTree) {
    var nodes = {}; // key ("major" or "major.minor") -> { key, label, pages: Set-ish array }
    var seen = {};

    (function walk(list) {
      list.forEach(function (node) {
        (node.tags || []).forEach(function (tag) {
          var parts = tag.split('.');
          var major = parts[0];
          var minor = parts[1];
          if (major === 'projects' && !minor) return; // drop the redundant index link
          var key = minor ? major + '.' + minor : major;
          var dedupe = key + '|' + node.id;
          if (seen[dedupe]) return;
          seen[dedupe] = true;
          if (!nodes[key]) nodes[key] = { key: key, label: label(minor || major), pages: [] };
          nodes[key].pages.push(node);
        });
        if (node.children) walk(node.children);
      });
    })(navTree);

    return nodes;
  }

  // Two section-nodes "intersect" when the same page id appears in both.
  function findLinks(nodes) {
    var keys = Object.keys(nodes);
    var links = [];
    for (var i = 0; i < keys.length; i++) {
      for (var j = i + 1; j < keys.length; j++) {
        var a = nodes[keys[i]], b = nodes[keys[j]];
        var aIds = {};
        a.pages.forEach(function (p) { aIds[p.id] = true; });
        var shared = b.pages.some(function (p) { return aIds[p.id]; });
        if (shared) links.push([keys[i], keys[j]]);
      }
    }
    return links;
  }

  function circlePositions(keys, cx, cy, r) {
    var pos = {};
    keys.forEach(function (k, i) {
      var angle = (i / keys.length) * Math.PI * 2 - Math.PI / 2;
      pos[k] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
    return pos;
  }

  function linkFor(node) {
    var a = document.createElement('a');
    a.href = SiteNav.hrefFor(node);
    a.textContent = node.title;
    if (SiteNav.isExternal(node)) { a.target = '_blank'; a.rel = 'noopener'; a.classList.add('ext'); }
    return a;
  }

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function renderSections(navTree) {
    var nodes = collect(navTree);
    var keys = Object.keys(nodes);
    var links = findLinks(nodes);

    var size = 460;
    var cx = size / 2, cy = size / 2, r = size * 0.36;
    var pos = circlePositions(keys, cx, cy, r);

    var wrap = document.createElement('div');
    wrap.className = 'landing-diagram';

    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
    svg.setAttribute('class', 'diagram-svg');

    links.forEach(function (pair) {
      var p1 = pos[pair[0]], p2 = pos[pair[1]];
      var line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
      line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
      line.setAttribute('class', 'diagram-link');
      svg.appendChild(line);
    });

    var detail = document.createElement('div');
    detail.className = 'landing-diagram-detail';
    detail.innerHTML = '<p class="landing-diagram-hint">Click a node to see its pages.</p>';

    function showDetail(node) {
      detail.innerHTML = '';
      var h3 = document.createElement('h3');
      h3.textContent = node.label;
      detail.appendChild(h3);
      var links2 = document.createElement('div');
      links2.className = 'landing-links';
      node.pages.forEach(function (p) { links2.appendChild(linkFor(p)); });
      detail.appendChild(links2);
    }

    keys.forEach(function (k) {
      var node = nodes[k];
      var p = pos[k];
      var g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("class", "diagram-node");
      g.setAttribute("transform", "translate(" + p.x + "," + p.y + ")");
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");

      var radius = 22 + Math.min(node.pages.length, 6) * 2.5;
      var circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("r", radius);
      circle.setAttribute("class", "diagram-circle");
      g.appendChild(circle);

      var text = document.createElementNS(SVG_NS, "text");
      text.setAttribute("class", "diagram-label");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", "0.32em");
      text.textContent = node.label;
      g.appendChild(text);

      g.addEventListener("click", function () {
        showDetail(node);
      });
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") showDetail(node);
      });

      svg.appendChild(g);
    });

    wrap.appendChild(svg);
    wrap.appendChild(detail);
    return wrap;
  }

  global.Landing = { renderSections: renderSections };
})(window);
