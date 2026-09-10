/*
 * Auto-builds the "All My Projects" page body from data/nav.json — one
 * card per page tagged "projects.*", each with a button to the page, its
 * title, the first real sentence of its markdown (the text between the
 * title and its first sub-heading), and its tags. Each card's background
 * is the page's first image (dimmed so text stays readable); pages with
 * no image just get the normal flat card color. Runs independently of
 * router.js: it does its own fetches and just watches #content for the
 * Projects page to appear, so nothing else needs to change to add it —
 * only <script src="js/projects.js"> needs to be added to index.html.
 */
(function (global) {
  var PAGE_ID = "projects";
  var navCache = null;
  var mdCache = {};

  // ---- markdown -> short plain-text summary ----
  function stripInline(text) {
    text = text.replace(/!\[[^\]]*\]\([^)]+\)(?:\{[^}]+\})?/g, "");
    text = text.replace(/\[button:\s*([^\]]+)\]\([^)]+\)/g, "$1");
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, "$1");
    text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
    text = text.replace(/\*([^*]+)\*/g, "$1");
    text = text.replace(/`([^`]+)`/g, "$1");
    text = text.replace(/<[^>]+>/g, "");
    return text;
  }

  function extractSummary(md) {
    md = md.replace(/^---[\s\S]*?---\n/, "");
    var lines = md.split(/\r?\n/);
    var i = 0;
    while (i < lines.length && !/^#{1,6}\s/.test(lines[i])) i++;
    i++; // past the title heading

    var collected = [];
    var sectionsChecked = 0;
    while (i < lines.length && sectionsChecked < 4) {
      var raw = lines[i];
      if (/^#{1,6}\s/.test(raw)) {
        if (collected.length) break; // already have real prose — stop here
        sectionsChecked++;
        i++;
        continue; // empty intro — look inside next section
      }
      var line = raw
        .replace(/^>\s?/, "")
        .replace(/^[-*]\s+/, "")
        .replace(/^\d+\.\s+/, "")
        .trim();
      var skip =
        /^\[button:.*\)$/.test(line) || // whole-line button
        /^!\[.*\)(\{[^}]+\})?$/.test(line) || // whole-line image
        /^\*\*[^*]+:\*\*/.test(line) || // bold "Label:" line (e.g. a TOC line)
        /^```/.test(line); // code fence marker
      if (line && !skip) collected.push(line);
      i++;
    }

    var text = stripInline(collected.join(" ")).replace(/\s+/g, " ").trim();
    var m = text.match(/^.*?[.!?](?=\s|$)/);
    return (m ? m[0] : text.slice(0, 160)).trim();
  }

  // ---- first image anywhere in the page, for the card background ----
  function extractFirstImageSrc(md) {
    md = md.replace(/^---[\s\S]*?---\n/, "");
    var m = md.match(/!\[[^\]]*\]\(([^)\s]+)/);
    if (!m) return null;
    var src = m[1];
    if (global.MediaResolver) {
      var r = global.MediaResolver.resolve(src);
      return r.src;
    }
    return src;
  }

  function prettyTag(tag) {
    var part = tag.indexOf(".") > -1 ? tag.split(".")[1] : tag;
    return part.replace(/-/g, " ").replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
  }

  // ---- collect every page tagged projects.* (excluding the index page itself) ----
  function collectProjectPages(navTree) {
    var pages = [];
    var seen = {};
    (function walk(list) {
      list.forEach(function (node) {
        var hasProjectTag = (node.tags || []).some(function (t) {
          return /^projects\./.test(t);
        });
        if (hasProjectTag && node.id !== PAGE_ID && !seen[node.id]) {
          seen[node.id] = true;
          pages.push(node);
        }
        if (node.children) walk(node.children);
      });
    })(navTree);
    return pages;
  }

  function hrefFor(node) {
    return node.type === "external" ? node.url : "#/" + node.id;
  }

  function fetchMd(path) {
    if (mdCache[path]) return Promise.resolve(mdCache[path]);
    return fetch(path)
      .then(function (r) {
        return r.ok ? r.text() : "";
      })
      .then(function (text) {
        mdCache[path] = text;
        return text;
      })
      .catch(function () {
        return "";
      });
  }

  function buildCard(node, summary, imageSrc) {
    var card = document.createElement("div");
    card.className = "project-card";
    card.style.cssText =
      "border:1px solid var(--line); border-radius:var(--radius); padding:16px 18px 18px; display:flex; flex-direction:column; gap:8px; background-color:var(--bg-panel);";

    // in buildCard(), replace the backgroundImage block with:
if (imageSrc) {
  card.dataset.bg = imageSrc;
}

    var h3 = document.createElement("h3");
    h3.textContent = node.title;
    h3.style.margin = "0";
    card.appendChild(h3);

    if (summary) {
      var p = document.createElement("p");
      p.textContent = summary;
      p.style.margin = "0";
      card.appendChild(p);
    }

    if (node.tags && node.tags.length) {
      var tagRow = document.createElement("div");
      tagRow.className = "tag-row";
      tagRow.style.margin = "0";
      var uniq = {};
      node.tags.forEach(function (t) {
        var text = prettyTag(t);
        if (uniq[text]) return;
        uniq[text] = true;
        var badge = document.createElement("span");
        badge.className = "tag-badge";
        badge.textContent = text;
        tagRow.appendChild(badge);
      });
      card.appendChild(tagRow);
    }

    var btn = document.createElement("a");
    btn.className = "button-link";
    btn.style.margin = "4px 0 0";
    btn.href = hrefFor(node);
    btn.textContent = "View project \u2192";
    if (node.type === "external") {
      btn.target = "_blank";
      btn.rel = "noopener";
    }
    card.appendChild(btn);

    return card;
  }

  function buildGrid(pages) {
    var grid = document.createElement("div");
    grid.className = "projects-grid";
    grid.style.cssText =
      "display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px; margin-top:28px;";

    var placeholders = {}; // node.id -> card element, filled in as content resolves
    pages.forEach(function (node) {
      var card = buildCard(node, "", null);
      placeholders[node.id] = card;
      grid.appendChild(card);
    });

    var fetches = pages
      .filter(function (n) {
        return n.type === "markdown" && n.file;
      })
      .map(function (n) {
        return fetchMd(n.file).then(function (md) {
          if (!md) return;
          var summary = extractSummary(md);
          var imageSrc = extractFirstImageSrc(md);
          if (summary || imageSrc) {
            var newCard = buildCard(n, summary, imageSrc);
            placeholders[n.id].replaceWith(newCard);
            placeholders[n.id] = newCard;
          }
        });
      });

      var cardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (!el.dataset.bg) return;
          el.style.backgroundImage =
            'linear-gradient(color-mix(in srgb, var(--bg-panel) 82%, transparent), color-mix(in srgb, var(--bg-panel) 82%, transparent)), url("' +
            el.dataset.bg +
            '")';
          el.style.backgroundSize = "cover";
          el.style.backgroundPosition = "center";
          el.style.backgroundRepeat = "no-repeat";
          cardObserver.unobserve(el);
        });
      });
      grid.querySelectorAll(".project-card").forEach(function (c) {
        cardObserver.observe(c);
      });

    return { grid: grid, ready: Promise.all(fetches) };
  }

  function loadNav() {
    if (navCache) return Promise.resolve(navCache);
    return fetch("data/nav.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (tree) {
        navCache = tree;
        return tree;
      });
  }

  function isProjectsRoute() {
    var hash = location.hash || "#/home";
    var id = hash.replace(/^#\/?/, "").split(/[?#]/)[0] || "home";
    return id === PAGE_ID;
  }

  function tryBuild() {
    if (!isProjectsRoute()) return;
    var article = document.querySelector("#content > article.page");
    if (!article || article.dataset.projectsBuilt) return;

    var h1 = article.querySelector("h1");
    if (!h1) return; // markdown page hasn't rendered yet

    article.dataset.projectsBuilt = "1";
    loadNav().then(function (tree) {
      var pages = collectProjectPages(tree);
      var built = buildGrid(pages);
      article.appendChild(built.grid);
    });
  }

  // The projects page is rendered asynchronously by router.js (fetch +
  // innerHTML), so watch for it instead of hooking into router.js itself.
  var observer = new MutationObserver(function () {
    if (isProjectsRoute()) tryBuild();
  });
  observer.observe(document.getElementById("content"), {
    childList: true,
    subtree: true,
  });

  window.addEventListener("hashchange", tryBuild);
  document.addEventListener("DOMContentLoaded", tryBuild);
  tryBuild();
})(window);
