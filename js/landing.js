/*
 * Automatic navigation from tags. Every leaf page in nav.json can carry a
 * "tags" array like ["projects.electrical"] or ["rocketry"]. This turns
 * that into landing-page sections without anyone having to hand-maintain
 * a separate menu structure: add a tag to a page in nav.json and it shows
 * up here on its own. A dot in a tag ("projects.electrical") means
 * "section.subsection" — e.g. Projects gets Mechanical/Electrical/
 * Software/Misc sub-groups; a tag with no dot ("rocketry") is just its
 * own flat section.
 */
(function (global) {
  var LABELS = {
    projects: 'All My Projects',
    rocketry: 'Rocketry',
    robotics: 'Robotics',
    art: 'My Art',
    tutorials: 'Tutorials / Guides',
    outdoors: 'The Outdoors',
    mechanical: 'Mechanical',
    electrical: 'Electrical',
    software: 'Software',
    misc: 'Misc',
    mtb: 'MTB',
    'boy-scouts': 'Boy Scouts',
    'random-trips': 'Random Trips'
  };
  var SECTION_ORDER = ['projects', 'rocketry', 'robotics', 'art', 'outdoors', 'tutorials'];

  function label(key) {
    return LABELS[key] || key.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function collect(navTree) {
    var sections = {}; // major -> { key, items: [], subs: { minor -> [] } }
    var seen = {}; // avoid duplicate page listings when a node appears under multiple parents

    (function walk(nodes) {
      nodes.forEach(function (node) {
        if (node.tags && node.tags.length) {
          node.tags.forEach(function (tag) {
            var parts = tag.split('.');
            var major = parts[0];
            var minor = parts[1];
            var dedupeKey = major + '|' + (minor || '') + '|' + node.id;
            if (seen[dedupeKey]) return;
            seen[dedupeKey] = true;

            if (!sections[major]) sections[major] = { key: major, items: [], subs: {} };
            if (minor) {
              if (!sections[major].subs[minor]) sections[major].subs[minor] = [];
              sections[major].subs[minor].push(node);
            } else {
              sections[major].items.push(node);
            }
          });
        }
        if (node.children) walk(node.children);
      });
    })(navTree);

    return sections;
  }

  function linkFor(node) {
    var a = document.createElement('a');
    a.href = SiteNav.hrefFor(node);
    a.textContent = node.title;
    if (SiteNav.isExternal(node)) { a.target = '_blank'; a.rel = 'noopener'; a.classList.add('ext'); }
    return a;
  }

  function renderSections(navTree) {
    var sections = collect(navTree);
    var orderedKeys = SECTION_ORDER.filter(function (k) { return sections[k]; })
      .concat(Object.keys(sections).filter(function (k) { return SECTION_ORDER.indexOf(k) === -1; }));

    var wrap = document.createElement('div');
    wrap.className = 'landing-sections';

    orderedKeys.forEach(function (key) {
      var section = sections[key];
      var card = document.createElement('section');
      card.className = 'landing-card';

      var h2 = document.createElement('h2');
      h2.textContent = label(key);
      card.appendChild(h2);

      if (section.items.length) {
        var flat = document.createElement('div');
        flat.className = 'landing-links';
        section.items.forEach(function (node) { flat.appendChild(linkFor(node)); });
        card.appendChild(flat);
      }

      Object.keys(section.subs).forEach(function (minor) {
        var subWrap = document.createElement('div');
        subWrap.className = 'landing-subgroup';
        var subTitle = document.createElement('div');
        subTitle.className = 'landing-subgroup-title';
        subTitle.textContent = label(minor);
        subWrap.appendChild(subTitle);
        var subLinks = document.createElement('div');
        subLinks.className = 'landing-links';
        section.subs[minor].forEach(function (node) { subLinks.appendChild(linkFor(node)); });
        subWrap.appendChild(subLinks);
        card.appendChild(subWrap);
      });

      wrap.appendChild(card);
    });

    return wrap;
  }

  global.Landing = { renderSections: renderSections };
})(window);
