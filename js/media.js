/*
 * MediaResolver — lets a plain Google Drive "share" link be used anywhere
 * an image/svg/video src is needed, instead of only local files.
 *
 * Supported Drive link shapes (whatever you paste from the Share button
 * or the address bar works):
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID&export=download
 *
 * Images/SVGs resolve to a direct-viewable googleusercontent URL so they
 * drop straight into an <img> or CSS background. Videos resolve to a
 * Drive "preview" URL, which only works inside an <iframe> (Drive won't
 * stream raw video bytes to a bare <video> tag) — resolveMedia() returns
 * enough info for the caller to pick the right tag.
 */
(function (global) {
  var DRIVE_ID_PATTERNS = [
    /drive\.google\.com\/file\/d\/([^/]+)/,
    /drive\.google\.com\/open\?id=([^&]+)/,
    /drive\.google\.com\/uc\?(?:export=[^&]*&)?id=([^&]+)/,
    /drive\.google\.com\/uc\?id=([^&]+)/
  ];

  function driveFileId(url) {
    for (var i = 0; i < DRIVE_ID_PATTERNS.length; i++) {
      var m = url.match(DRIVE_ID_PATTERNS[i]);
      if (m) return m[1];
    }
    return null;
  }

  function isVideoFile(url) {
    return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
  }
  function isSvgFile(url) {
    return /\.svg(\?|$)/i.test(url);
  }

  /**
   * Resolve a raw src (local path, direct URL, or Drive share link) into
   * a renderable descriptor: { kind: 'image'|'video-file'|'video-embed'|'svg', src }
   * `hint` can be 'image' | 'video' | 'svg' to force interpretation when the
   * URL itself doesn't make it obvious (e.g. a Drive link with no extension).
   */
  function resolve(rawUrl, hint) {
    var url = (rawUrl || '').trim();
    var id = driveFileId(url);

    if (!id) {
      // Not a Drive link — use as-is.
      if (hint === 'video' || isVideoFile(url)) return { kind: 'video-file', src: url };
      if (hint === 'svg' || isSvgFile(url)) return { kind: 'svg', src: url };
      return { kind: 'image', src: url };
    }

    if (hint === 'video' || isVideoFile(url)) {
      // Drive doesn't serve raw video bytes reliably for <video src>,
      // so videos go in an iframe using Drive's own preview player.
      return { kind: 'video-embed', src: 'https://drive.google.com/file/d/' + id + '/preview' };
    }
    // Images and SVGs both work fine as direct <img>/background URLs via
    // the googleusercontent host Drive uses for thumbnails/full files.
    return { kind: hint === 'svg' || isSvgFile(url) ? 'svg' : 'image', src: 'https://lh3.googleusercontent.com/d/' + id };
  }

  // Convenience: build the right HTML for a resolved media item.
  function toHtml(rawUrl, opts) {
    opts = opts || {};
    var r = resolve(rawUrl, opts.hint);
    var alt = opts.alt ? String(opts.alt).replace(/"/g, '&quot;') : '';
    if (r.kind === 'video-embed') {
      return '<div class="embed-wrap"><iframe src="' + r.src + '" allow="autoplay" loading="lazy"></iframe></div>';
    }
    if (r.kind === 'video-file') {
      return '<video src="' + r.src + '" controls' + (opts.muted ? ' muted' : '') + (opts.playsinline ? ' playsinline' : '') + '></video>';
    }
    // image or svg
    return '<img src="' + r.src + '" alt="' + alt + '" loading="lazy">';
  }

  global.MediaResolver = { resolve: resolve, toHtml: toHtml, driveFileId: driveFileId };
})(window);
