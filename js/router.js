/*
 * Hash-based router. Reads the current #/page-id, looks it up in the
 * flattened nav map, and renders either:
 *   - a markdown page (fetches the .md file, runs it through TinyMD)
 *   - a portfolio gallery (fetches a data/*-portfolio.json manifest and
 *     builds the dropdown/flex galleries, low-res thumbs + arrow-key
 *     navigation in the lightbox)
 * External nav entries never hit the router — they're plain <a> links.
 */
(function (global) {
  var contentEl;
  var navIndex = null;
  var mdCache = {};
  var jsonCache = {};

  // Lightbox state: the array belongs to whichever gallery is currently
  // open, so prev/next just walks it — no re-fetching, no rebuilding.
  var lightboxEl = null;
  var lightboxMediaEl = null;
  var lightboxItems = [];
  var lightboxIndex = 0;

  function currentId() {
    var hash = location.hash || "#/home";
    return hash.replace(/^#\/?/, "").split("?")[0].split("#")[0] || "home";
  }

  function ensureInstagramEmbeds(container) {
    if (!container.querySelector(".instagram-media")) return;
    if (global.instgrm && global.instgrm.Embeds) {
      global.instgrm.Embeds.process();
      return;
    }
    if (document.getElementById("instagram-embed-script")) return;
    var s = document.createElement("script");
    s.id = "instagram-embed-script";
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(s);
  }

  function prettyTag(tag) {
    var part = tag.indexOf(".") > -1 ? tag.split(".")[1] : tag;
    return part.replace(/-/g, " ").replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
  }

  function addTagBadges(article, node) {
    if (!node.tags || !node.tags.length) return;
    var h1 = article.querySelector("h1");
    if (!h1) return;
    var row = document.createElement("div");
    row.className = "tag-row";
    var uniq = {};
    node.tags.forEach(function (t) {
      var text = prettyTag(t);
      if (uniq[text]) return;
      uniq[text] = true;
      var span = document.createElement("span");
      span.className = "tag-badge";
      span.textContent = text;
      row.appendChild(span);
    });
    h1.insertAdjacentElement("afterend", row);
  }

  function renderMarkdownPage(node) {
    contentEl.innerHTML = '<div class="loading">Loading\u2026</div>';
    var fetchIt = mdCache[node.file]
      ? Promise.resolve(mdCache[node.file])
      : fetch(node.file)
          .then(function (r) {
            if (!r.ok) throw new Error("Could not load " + node.file);
            return r.text();
          })
          .then(function (text) {
            mdCache[node.file] = text;
            return text;
          });

    fetchIt
      .then(function (md) {
        var article = document.createElement("article");
        article.className = "page";
        article.innerHTML = TinyMD.render(md);
        addTagBadges(article, node);

        if (node.id === "home")
          article.appendChild(Landing.renderSections(navIndex.tree));

        contentEl.innerHTML = "";
        contentEl.appendChild(article);
        document.title =
          (node.title != "Home"
            ? node.title + " \u2014 "
            : "") + "Marco Fissore '27";

        console.log(node.title);

        ensureInstagramEmbeds(article);
        OutlineContent.render(navIndex, article, node.id);
      })
      .catch(function (err) {
        contentEl.innerHTML =
          '<article class="page"><h1>Page unavailable</h1><p>Could not load <code>' +
          node.file +
          "</code>. " +
          err.message +
          "</p></article>";
      });
  }

  function loadPortfolioJson(path) {
    if (jsonCache[path]) return Promise.resolve(jsonCache[path]);
    return fetch(path)
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        jsonCache[path] = data;
        return data;
      });
  }

  function renderPortfolioPage(node) {
    contentEl.innerHTML = '<div class="loading">Loading\u2026</div>';
    var parts = node.file.split("#");
    var basePath = parts[0];
    var onlyGroupId = parts[1] || null;

    loadPortfolioJson(basePath)
      .then(function (data) {
        document.title = node.title + " \u2014 Marco Fissore '27";

        var article = document.createElement("article");
        article.className = "page";

        var h1 = document.createElement("h1");
        h1.textContent = node.title;
        article.appendChild(h1);
        addTagBadges(article, node);

        if (!onlyGroupId && data.intro) {
          var p = document.createElement("p");
          p.className = "portfolio-intro";
          p.textContent = data.intro;
          article.appendChild(p);
        }

        var groupsWrap = document.createElement("div");
        groupsWrap.className = "portfolio-groups";
        var groups = onlyGroupId
          ? data.groups.filter(function (g) {
              return g.id === onlyGroupId;
            })
          : data.groups;
        // All groups start closed, unless we've drilled into exactly one.
        groups.forEach(function (group) {
          groupsWrap.appendChild(buildPortfolioGroup(group, !!onlyGroupId));
        });

        article.appendChild(groupsWrap);
        contentEl.innerHTML = "";
        contentEl.appendChild(article);
        OutlineContent.render(navIndex, article, node.id);
      })
      .catch(function (err) {
        contentEl.innerHTML =
          '<article class="page"><h1>' +
          node.title +
          "</h1><p>Could not load the gallery manifest. " +
          err.message +
          "</p></article>";
      });
  }

  function isFullUrl(str) {
    return /^https?:\/\//.test(str);
  }

  function resolveGroupItems(group) {
    return (group.items || []).map(function (item) {
      var rawSrc = isFullUrl(item.file)
        ? item.file
        : group.folder + "/" + item.file;
      var resolved = global.MediaResolver
        ? global.MediaResolver.resolve(rawSrc, item.type)
        : { kind: "image", src: rawSrc, thumbSrc: rawSrc };
      return {
        resolved: resolved,
        caption: item.caption,
        groupTitle: group.title,
      };
    });
  }

  function buildPortfolioGroup(group, openByDefault) {
    var el = document.createElement("div");
    el.className = "pf-group" + (openByDefault ? " open" : "");

    var header = document.createElement("button");
    header.className = "pf-group-header";
    header.type = "button";
    header.innerHTML =
      "<span>" +
      group.title +
      '<span class="pf-count">' +
      (group.items ? group.items.length : 0) +
      " item" +
      (group.items && group.items.length === 1 ? "" : "s") +
      "</span></span>" +
      (group.folder
        ? '<a class="pf-folder" aria-label="Open Photos Folder" href="' +
          group.folder +
          '"> <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" > <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path> </svg> </a>'
        : "") +
      '<span class="pf-caret">\u25B8</span>';
    header.addEventListener("click", function () {
      el.classList.toggle("open");
    });
    el.appendChild(header);

    var body = document.createElement("div");
    body.className = "pf-group-body";

    if (group.description) {
      var desc = document.createElement("p");
      desc.className = "pf-group-desc";
      desc.textContent = group.description;
      body.appendChild(desc);
    }

    if (!group.items || group.items.length === 0) {
      var empty = document.createElement("div");
      empty.className = "pf-empty";
      empty.innerHTML =
        "No photos here yet. Drop files into <code>" +
        group.folder +
        "/</code> " +
        '(or paste a Google Drive share link as <code>"file"</code>) and add them to the ' +
        "<code>items</code> array for <code>" +
        group.id +
        "</code>.";
      body.appendChild(empty);
    } else {
      var resolvedItems = resolveGroupItems(group);
      var grid = document.createElement("div");
      grid.className = "pf-grid";
      resolvedItems.forEach(function (entry, i) {
        grid.appendChild(buildPortfolioItem(entry, resolvedItems, i));
      });
      body.appendChild(grid);
    }

    el.appendChild(body);
    return el;
  }

  function buildPortfolioItem(entry, siblingItems, index) {
    var resolved = entry.resolved;
    var cell = document.createElement("div");
    cell.className = "pf-item";

    if (resolved.kind === "video-embed" || resolved.kind === "video-file") {
      // Grid shows a cheap low-res thumbnail with a play glyph, never the
      // real player/full video — that only loads once the lightbox opens.
      if (resolved.kind === "video-embed") {
        var img = document.createElement("img");
        img.src = resolved.thumbSrc;
        img.alt = entry.caption || entry.groupTitle;
        img.loading = "lazy";
        cell.appendChild(img);
      } else {
        var video = document.createElement("video");
        video.src = resolved.thumbSrc;
        video.preload = "metadata";
        video.muted = true;
        video.setAttribute("playsinline", "");
        cell.appendChild(video);
      }
      var play = document.createElement("span");
      play.className = "pf-play";
      cell.appendChild(play);
    } else {
      var thumb = document.createElement("img");
      thumb.src = resolved.thumbSrc;
      console.log(resolved);
      thumb.alt = entry.caption || entry.groupTitle;
      thumb.loading = "lazy";
      cell.appendChild(thumb);
    }

    cell.addEventListener("click", function () {
      openLightbox(siblingItems, index);
    });
    return cell;
  }

  // ---- lightbox: built once, reused for every gallery ----
  function ensureLightbox() {
    if (lightboxEl) return;
    lightboxEl = document.createElement("div");
    lightboxEl.id = "lightbox";
    lightboxEl.className = "lightbox";
    lightboxEl.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Close">\u2715</button>' +
      '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous">\u2039</button>' +
      '<div class="lightbox-media"></div>' +
      '<button class="lightbox-nav lightbox-next" type="button" aria-label="Next">\u203A</button>';
    document.body.appendChild(lightboxEl);
    lightboxMediaEl = lightboxEl.querySelector(".lightbox-media");

    lightboxEl.addEventListener("click", function (e) {
      if (
        e.target === lightboxEl ||
        e.target.classList.contains("lightbox-close")
      )
        closeLightbox();
    });
    lightboxEl
      .querySelector(".lightbox-prev")
      .addEventListener("click", function () {
        stepLightbox(-1);
      });
    lightboxEl
      .querySelector(".lightbox-next")
      .addEventListener("click", function () {
        stepLightbox(1);
      });

    document.addEventListener("keydown", function (e) {
      if (!lightboxEl.classList.contains("open")) return;
      if (e.key === "ArrowLeft") stepLightbox(-1);
      else if (e.key === "ArrowRight") stepLightbox(1);
      else if (e.key === "Escape") closeLightbox();
    });
  }

  function renderLightboxMedia() {
    var entry = lightboxItems[lightboxIndex];
    var r = entry.resolved;
    if (r.kind === "video-embed") {
      lightboxMediaEl.innerHTML =
        '<iframe src="' +
        r.src +
        '" allow="autoplay" allowfullscreen></iframe>';
    } else if (r.kind === "video-file") {
      lightboxMediaEl.innerHTML =
        '<video src="' + r.src + '" controls autoplay preload="auto"></video>';
    } else {
      lightboxMediaEl.innerHTML =
        '<img src="' + r.src + '" alt="' + (entry.caption || "") + '">';
    }
    var multi = lightboxItems.length > 1;
    lightboxEl.querySelector(".lightbox-prev").style.display = multi
      ? ""
      : "none";
    lightboxEl.querySelector(".lightbox-next").style.display = multi
      ? ""
      : "none";
  }

  function stepLightbox(dir) {
    if (lightboxItems.length < 2) return;
    lightboxIndex =
      (lightboxIndex + dir + lightboxItems.length) % lightboxItems.length;
    renderLightboxMedia();
  }

  function openLightbox(items, index) {
    ensureLightbox();
    lightboxItems = items;
    lightboxIndex = index;
    renderLightboxMedia();
    lightboxEl.classList.add("open");
  }

  // Actively stop any <video>/<iframe> inside a container before it's
  // removed, instead of just letting innerHTML replacement discard it.
  // Cross-origin embeds (YouTube/Drive/Instagram) especially don't always
  // free their memory promptly on removal alone — blanking the src first
  // forces an immediate teardown rather than waiting on GC.
  function teardownMedia(container) {
    if (!container) return;
    container.querySelectorAll("video").forEach(function (v) {
      v.pause();
      v.removeAttribute("src");
      v.load();
    });
    container.querySelectorAll("iframe").forEach(function (f) {
      f.src = "about:blank";
    });
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove("open");
    teardownMedia(lightboxMediaEl);
    lightboxMediaEl.innerHTML = "";
  }

  function render() {
    var id = currentId();
    var node = navIndex.map[id];

    if (!node || node.type === "external" || node.type === "group") {
      if (id !== "home") {
        location.hash = "#/home";
        return;
      }
      node = navIndex.map["home"];
    }

    // The lightbox lives on <body>, outside #content, so a page swap below
    // never touches it on its own — a playing video/iframe would otherwise
    // keep running in the background after you've already navigated away.
    closeLightbox();
    teardownMedia(contentEl);

    SiteNav.setActive(node.id);
    global.MegaMenu && global.MegaMenu.close();
    global.OutlinePanel && global.OutlinePanel.close();
    window.scrollTo(0, 0);

    if (node.type === "portfolio") renderPortfolioPage(node);
    else renderMarkdownPage(node);
  }

  function init(tree) {
    navIndex = SiteNav.flatten(tree);
    contentEl = document.getElementById("content");
    window.addEventListener("hashchange", render);
    render();
  }

  global.Router = { init: init, closeLightbox: closeLightbox };
})(window);
