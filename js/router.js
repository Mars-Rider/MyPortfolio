/*
 * Hash-based router. Reads the current #/page-id, looks it up in the
 * flattened nav map, and renders either:
 *   - a markdown page (fetches the .md file, runs it through TinyMD)
 *   - a portfolio gallery (fetches a data/*-portfolio.json manifest and
 *     builds the dropdown/flex galleries). A file path can end in
 *     "#group-id" to show just that one gallery group (used by e.g. the
 *     Outdoors section to point at one group inside photography-portfolio).
 * External nav entries never hit the router — they're plain <a> links.
 */
(function (global) {
  var contentEl;
  var navIndex = null; // { map, parentOf, tree }
  var mdCache = {};
  var jsonCache = {};

  function currentId() {
    var hash = location.hash || '#/home';
    var id = hash.replace(/^#\/?/, '').split('?')[0].split('#')[0];
    return id || 'home';
  }

  function ensureInstagramEmbeds(container) {
    if (!container.querySelector('.instagram-media')) return;
    if (global.instgrm && global.instgrm.Embeds) {
      global.instgrm.Embeds.process();
      return;
    }
    if (document.getElementById('instagram-embed-script')) return; // already loading
    var s = document.createElement('script');
    s.id = 'instagram-embed-script';
    s.async = true;
    s.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(s);
  }

  function renderMarkdownPage(node) {
    contentEl.innerHTML = '<div class="loading">Loading\u2026</div>';
    var fetchIt = mdCache[node.file]
      ? Promise.resolve(mdCache[node.file])
      : fetch(node.file).then(function (r) {
          if (!r.ok) throw new Error('Could not load ' + node.file);
          return r.text();
        }).then(function (text) { mdCache[node.file] = text; return text; });

    fetchIt.then(function (md) {
      var article = document.createElement('article');
      article.className = 'page';
      article.innerHTML = TinyMD.render(md);

      if (node.id === 'home') {
        article.appendChild(Landing.renderSections(navIndex.tree));
      }

      contentEl.innerHTML = '';
      contentEl.appendChild(article);
      document.title = node.title + ' \u2014 Marco Fissore \'27';

      ensureInstagramEmbeds(article);
      OutlineContent.render(navIndex, article, node.id);
    }).catch(function (err) {
      contentEl.innerHTML = '<article class="page"><h1>Page unavailable</h1><p>' +
        'Could not load <code>' + node.file + '</code>. ' + err.message + '</p></article>';
    });
  }

  function loadPortfolioJson(path) {
    if (jsonCache[path]) return Promise.resolve(jsonCache[path]);
    return fetch(path).then(function (r) { return r.json(); }).then(function (data) {
      jsonCache[path] = data;
      return data;
    });
  }

  function renderPortfolioPage(node) {
    contentEl.innerHTML = '<div class="loading">Loading\u2026</div>';
    var parts = node.file.split('#');
    var basePath = parts[0];
    var onlyGroupId = parts[1] || null;

    loadPortfolioJson(basePath).then(function (data) {
      document.title = node.title + ' \u2014 Marco Fissore \'27';

      var article = document.createElement('article');
      article.className = 'page';

      var h1 = document.createElement('h1');
      h1.textContent = node.title;
      article.appendChild(h1);

      if (!onlyGroupId && data.intro) {
        var p = document.createElement('p');
        p.className = 'portfolio-intro';
        p.textContent = data.intro;
        article.appendChild(p);
      }

      var groupsWrap = document.createElement('div');
      groupsWrap.className = 'portfolio-groups';

      var groups = onlyGroupId ? data.groups.filter(function (g) { return g.id === onlyGroupId; }) : data.groups;
      groups.forEach(function (group, idx) {
        groupsWrap.appendChild(buildPortfolioGroup(group, onlyGroupId ? true : false));
      });

      article.appendChild(groupsWrap);
      contentEl.innerHTML = '';
      contentEl.appendChild(article);
      ensureLightbox();
      OutlineContent.render(navIndex, article, node.id);
    }).catch(function (err) {
      contentEl.innerHTML = '<article class="page"><h1>' + node.title + '</h1><p>Could not load the gallery manifest. ' + err.message + '</p></article>';
    });
  }

  function buildPortfolioGroup(group, openByDefault) {
    var el = document.createElement('div');
    el.className = 'pf-group' + (openByDefault ? ' open' : '');

    var header = document.createElement('button');
    header.className = 'pf-group-header';
    header.type = 'button';
    header.innerHTML = '<span>' + group.title +
      '<span class="pf-count">' + (group.items ? group.items.length : 0) + ' item' + ((group.items && group.items.length === 1) ? '' : 's') + '</span></span>' +
      '<span class="pf-caret">\u25B8</span>';
    header.addEventListener('click', function () { el.classList.toggle('open'); });
    el.appendChild(header);

    var body = document.createElement('div');
    body.className = 'pf-group-body';

    if (group.description) {
      var desc = document.createElement('p');
      desc.className = 'pf-group-desc';
      desc.textContent = group.description;
      body.appendChild(desc);
    }

    if (!group.items || group.items.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'pf-empty';
      empty.innerHTML = 'No photos here yet. Drop files into ' +
        '<code>' + group.folder + '/</code> (or paste a Google Drive share link as ' +
        '<code>"file"</code>) and add them to the <code>items</code> array for ' +
        '<code>' + group.id + '</code>.';
      body.appendChild(empty);
    } else {
      var grid = document.createElement('div');
      grid.className = 'pf-grid';
      group.items.forEach(function (item) {
        grid.appendChild(buildPortfolioItem(group, item));
      });
      body.appendChild(grid);
    }

    el.appendChild(body);
    return el;
  }

  function isFullUrl(str) { return /^https?:\/\//.test(str); }

  function buildPortfolioItem(group, item) {
    var rawSrc = isFullUrl(item.file) ? item.file : group.folder + '/' + item.file;
    var hint = item.type; // 'image' | 'video' | 'svg' | undefined
    var resolved = global.MediaResolver ? global.MediaResolver.resolve(rawSrc, hint) : { kind: 'image', src: rawSrc };

    var cell = document.createElement('div');
    cell.className = 'pf-item';

    if (resolved.kind === 'video-embed') {
      var iframe = document.createElement('iframe');
      iframe.src = resolved.src;
      iframe.loading = 'lazy';
      iframe.setAttribute('allow', 'autoplay');
      cell.appendChild(iframe);
      var tagE = document.createElement('span');
      tagE.className = 'pf-tag';
      tagE.textContent = 'video';
      cell.appendChild(tagE);
      cell.addEventListener('click', function () { openLightbox(resolved, item.caption); });
      return cell;
    }

    if (resolved.kind === 'video-file') {
      var video = document.createElement('video');
      video.src = resolved.src;
      video.muted = true;
      video.setAttribute('playsinline', '');
      cell.appendChild(video);
      var tag = document.createElement('span');
      tag.className = 'pf-tag';
      tag.textContent = 'video';
      cell.appendChild(tag);
    } else {
      var img = document.createElement('img');
      img.src = resolved.src;
      img.alt = item.caption || group.title;
      img.loading = 'lazy';
      cell.appendChild(img);
    }

    cell.addEventListener('click', function () { openLightbox(resolved, item.caption); });
    return cell;
  }

  function ensureLightbox() {
    if (document.getElementById('lightbox')) return;
    var lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">\u2715</button><div class="lightbox-media"></div>';
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox-close')) closeLightbox();
    });
    document.body.appendChild(lb);
  }

  function openLightbox(resolved, caption) {
    ensureLightbox();
    var lb = document.getElementById('lightbox');
    var mediaWrap = lb.querySelector('.lightbox-media');
    if (resolved.kind === 'video-embed') {
      mediaWrap.innerHTML = '<iframe src="' + resolved.src + '" allow="autoplay" allowfullscreen></iframe>';
    } else if (resolved.kind === 'video-file') {
      mediaWrap.innerHTML = '<video src="' + resolved.src + '" controls autoplay></video>';
    } else {
      mediaWrap.innerHTML = '<img src="' + resolved.src + '" alt="' + (caption || '') + '">';
    }
    lb.classList.add('open');
  }

  function closeLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('open');
    lb.querySelector('.lightbox-media').innerHTML = '';
  }

  function render() {
    var id = currentId();
    var node = navIndex.map[id];

    if (!node || node.type === 'external' || node.type === 'group') {
      if (id !== 'home') { location.hash = '#/home'; return; }
      node = navIndex.map['home'];
    }

    SiteNav.setActive(node.id);
    global.MegaMenu && global.MegaMenu.close();
    global.OutlinePanel && global.OutlinePanel.close();
    window.scrollTo(0, 0);

    if (node.type === 'portfolio') {
      renderPortfolioPage(node);
    } else {
      renderMarkdownPage(node);
    }
  }

  function init(tree) {
    navIndex = SiteNav.flatten(tree);
    contentEl = document.getElementById('content');
    window.addEventListener('hashchange', render);
    render();
  }

  global.Router = { init: init, closeLightbox: closeLightbox };
})(window);
