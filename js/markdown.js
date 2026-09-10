/*
 * Tiny markdown renderer.
 *
 * Supports just enough markdown to drive the whole site from .md files:
 *   # H1 .. ###### H6      (auto-slugged ids, used for the page outline)
 *   **bold**, *italic*, `code`
 *   [text](url), ![alt](url "title")   — image src runs through
 *     MediaResolver, so a Google Drive share link works as a src too
 *   - / * bullet lists, 1. numbered lists
 *   > blockquotes
 *   ```lang fenced code blocks
 *   | table | rows |
 *   --- horizontal rules
 *   [button: Label](url)          -> styled button-style link
 *   [embed](url)                  -> auto-detected embed (YouTube, Vimeo,
 *     Instagram post, Google Slides, Google Drive image/video, Onshape,
 *     or a generic iframe as a fallback)
 *   raw HTML passthrough for anything already written as HTML
 *     (e.g. <iframe>, <blockquote class="instagram-media">) so embeds can
 *     also be hand-written directly in markdown.
 *
 * No external dependencies, on purpose: the whole site works offline
 * (aside from Drive/YouTube/Instagram media itself, which needs internet
 * regardless of how it's embedded).
 */
(function (global) {
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  function resolveImageSrc(src) {
    if (global.MediaResolver) {
      var r = global.MediaResolver.resolve(src);
      return r.src;
    }
    return src;
  }

  // Inline-level formatting: code spans first (to protect their contents),
  // then images, links, bold, italic.
  function renderInline(text) {
    var codeStash = [];
    text = text.replace(/`([^`]+)`/g, function (_, code) {
      codeStash.push(escapeHtml(code));
      return "\u0000CODE" + (codeStash.length - 1) + "\u0000";
    });


    // images ![alt](src "title"){vertical height, vertical offset}<type>
    //Types: banner, big card (square), small card (square,inline on the right), 
    text = text.replace(
      /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)(?:\{([^}]+)\})?(?:\<([^>]+)\>)?/g,
      function (_, alt, src, title, size, type) {
        var t = title ? ' title="' + escapeHtml(title) + '"' : "";
        var style = "";
        if (size) {
          var sizeParts = size.split(",");
          var height = sizeParts[0].trim();
          var offset = sizeParts[1] ? sizeParts[1].trim() : "50%";
          var h = /^\d+$/.test(height) ? height + "px" : height;
          style = ' style="height:' + h + '; object-fit:cover;';
          style += ' object-position:center ' + offset + ';';
        
          switch (type) {
            case "big-card":
              style += ' aspect-ratio:1/1;';
              break;
            case "small-card":
              style += ' aspect-ratio:1/1; float:right; margin-left:10px;';
              break;
            default:
              style += ' width:100%;';
              break;
          }

          style += '"';
        }
        return (
          '<img src="' +
          resolveImageSrc(src) +
          '" alt="' +
          escapeHtml(alt) +
          '"' +
          t +
          style +
          ' loading="lazy">'
        );
      },
    );

    // button-style links [button: Label](url)
    text = text.replace(
      /\[button:\s*([^\]]+)\]\(([^)]+)\)/g,
      function (_, label, href) {
        var ext = /^https?:\/\//.test(href)
          ? ' target="_blank" rel="noopener"'
          : "";
        return (
          '<a class="button-link" href="' +
          href +
          '"' +
          ext +
          ">" +
          label +
          " \u2192</a>"
        );
      },
    );

    // normal links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
      var isHash = href.charAt(0) === "#";
      var ext =
        !isHash && /^https?:\/\//.test(href)
          ? ' target="_blank" rel="noopener"'
          : "";
      return '<a href="' + href + '"' + ext + ">" + label + "</a>";
    });

    // bold + italic
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\b__([^_]+)__\b/g, "<strong>$1</strong>");
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    text = text.replace(/\u0000CODE(\d+)\u0000/g, function (_, i) {
      return "<code>" + codeStash[i] + "</code>";
    });

    return text;
  }

  function isRawHtmlLine(line) {
    return /^\s*<(iframe|div|video|audio|table|blockquote|figure|script)\b/i.test(line);
  }

  // ---- [embed](url) auto-detection ----
  function buildEmbed(url) {
    url = url.trim();

    var yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (yt) {
      return '<div class="embed-wrap"><iframe src="https://www.youtube.com/embed/' + yt[1] + '" allowfullscreen loading="lazy"></iframe></div>';
    }

    var vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) {
      return '<div class="embed-wrap"><iframe src="https://player.vimeo.com/video/' + vimeo[1] + '" allowfullscreen loading="lazy"></iframe></div>';
    }

    var insta = url.match(/instagram\.com\/(?:p|reel)\/([\w-]+)/);
    if (insta) {
      // Requires https://www.instagram.com/embed.js to be loaded + reprocessed
      // after this HTML is inserted into the page (router.js does this).
      return '<blockquote class="instagram-media" data-instgrm-permalink="' + url + '" data-instgrm-version="14" style="margin:0 0 20px;"></blockquote>';
    }

    var slides = url.match(/docs\.google\.com\/presentation\/d\/([\w-]+)/);
    if (slides) {
      return '<div class="embed-wrap"><iframe src="https://docs.google.com/presentation/d/' + slides[1] + '/embed?start=false&loop=false&delayms=3000" allowfullscreen loading="lazy"></iframe></div>';
    }

    if (/drive\.google\.com/.test(url) && global.MediaResolver) {
      var r = global.MediaResolver.resolve(url, 'video');
      if (r.kind === 'video-embed') {
        return '<div class="embed-wrap"><iframe src="' + r.src + '" allow="autoplay" loading="lazy"></iframe></div>';
      }
      return '<img src="' + r.src + '" alt="" loading="lazy">';
    }

    if (/cad\.onshape\.com/.test(url)) {
      return '<div class="embed-wrap"><iframe src="' + url + '" loading="lazy"></iframe></div>';
    }

    // Generic fallback — just iframe whatever was given.
    return '<div class="embed-wrap"><iframe src="' + url + '" loading="lazy"></iframe></div>';
  }

  function render(md) {
    // Strip optional frontmatter (--- ... ---) at top, not used for rendering
    // here (nav.json carries titles), but harmless to allow.
    md = md.replace(/^---\n[\s\S]*?\n---\n/, '');

    var lines = md.replace(/\r\n/g, '\n').split('\n');
    var html = [];
    var i = 0;
    var n = lines.length;

    function flushParagraph(buf) {
      if (buf.length) {
        html.push('<p>' + renderInline(buf.join(' ').trim()) + '</p>');
      }
    }

    while (i < n) {
      var line = lines[i];

      // blank line
      if (/^\s*$/.test(line)) { i++; continue; }

      // [embed](url) shortcode, on its own line
      var embedMatch = line.match(/^\s*\[embed\]\(([^)]+)\)\s*$/);
      if (embedMatch) {
        html.push(buildEmbed(embedMatch[1]));
        i++; continue;
      }

      // raw HTML passthrough block (e.g. <iframe>/<blockquote> embeds)
      if (isRawHtmlLine(line)) {
        var htmlBuf = [];
        while (i < n && !/^\s*$/.test(lines[i])) { htmlBuf.push(lines[i]); i++; }
        var raw = htmlBuf.join('\n');
        if (/^\s*<iframe/i.test(raw)) {
          html.push('<div class="embed-wrap">' + raw + '</div>');
        } else {
          html.push(raw);
        }
        continue;
      }

      // fenced code block
      var fence = line.match(/^```(\w*)\s*$/);
      if (fence) {
        var codeLines = [];
        i++;
        while (i < n && !/^```\s*$/.test(lines[i])) { codeLines.push(lines[i]); i++; }
        i++; // consume closing fence
        html.push('<pre><code>' + escapeHtml(codeLines.join('\n')) + '</code></pre>');
        continue;
      }

      // horizontal rule
      if (/^\s*(-{3,}|_{3,}|\*{3,})\s*$/.test(line)) {
        html.push('<hr>');
        i++; continue;
      }

      // headers
      var h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        var level = h[1].length;
        var text = h[2].trim();
        var id = slugify(text);
        html.push('<h' + level + ' id="' + id + '">' + renderInline(text) + '</h' + level + '>');
        i++; continue;
      }

      // blockquote
      if (/^\s*>/.test(line)) {
        var qLines = [];
        while (i < n && /^\s*>/.test(lines[i])) {
          qLines.push(lines[i].replace(/^\s*>\s?/, ''));
          i++;
        }
        html.push('<blockquote><p>' + renderInline(qLines.join(' ')) + '</p></blockquote>');
        continue;
      }

      // table
      if (/^\s*\|.*\|\s*$/.test(line) && lines[i + 1] && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(lines[i + 1])) {
        var headerCells = line.trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); });
        i += 2;
        var rows = [];
        while (i < n && /^\s*\|.*\|\s*$/.test(lines[i])) {
          rows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); }));
          i++;
        }
        var t = '<table><thead><tr>' + headerCells.map(function (c) { return '<th>' + renderInline(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
        rows.forEach(function (r) {
          t += '<tr>' + r.map(function (c) { return '<td>' + renderInline(c) + '</td>'; }).join('') + '</tr>';
        });
        t += '</tbody></table>';
        html.push(t);
        continue;
      }

      // lists (unordered / ordered), single-level with simple nesting via indent
      var isUL = /^\s*[-*]\s+/.test(line);
      var isOL = /^\s*\d+\.\s+/.test(line);
      if (isUL || isOL) {
        var tag = isOL ? 'ol' : 'ul';
        var itemRe = isOL ? /^\s*\d+\.\s+(.*)$/ : /^\s*[-*]\s+(.*)$/;
        var items = [];
        while (i < n && itemRe.test(lines[i])) {
          items.push(lines[i].match(itemRe)[1]);
          i++;
        }
        html.push('<' + tag + '>' + items.map(function (it) { return '<li>' + renderInline(it) + '</li>'; }).join('') + '</' + tag + '>');
        continue;
      }

      // paragraph: gather consecutive plain lines
      var pBuf = [];
      while (i < n && !/^\s*$/.test(lines[i]) &&
             !/^(#{1,6})\s+/.test(lines[i]) &&
             !/^```/.test(lines[i]) &&
             !/^\s*>/.test(lines[i]) &&
             !/^\s*[-*]\s+/.test(lines[i]) &&
             !/^\s*\d+\.\s+/.test(lines[i]) &&
             !/^\s*(-{3,}|_{3,}|\*{3,})\s*$/.test(lines[i]) &&
             !isRawHtmlLine(lines[i]) &&
             !/^\s*\[embed\]\(([^)]+)\)\s*$/.test(lines[i]) &&
             !/^\s*\|.*\|\s*$/.test(lines[i])) {
        pBuf.push(lines[i]);
        i++;
      }
      flushParagraph(pBuf);
    }

    return html.join('\n');
  }

  global.TinyMD = { render: render, slugify: slugify };
})(window);
