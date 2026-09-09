/*
 * MediaResolver — lets a plain Google Drive "share" link be used anywhere
 * an image/svg/video src is needed, instead of only local files. Also
 * hands back a cheap low-res "thumbSrc" for grid use, saving a full-res
 * load until something is actually opened in the lightbox.
 *
 * Supported Drive link shapes (whatever you paste from the Share button
 * or the address bar works):
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID&export=download
 */
(function (global) {
  var ID_PATTERNS = [
    /drive\.google\.com\/file\/d\/([^/]+)/,
    /drive\.google\.com\/open\?id=([^&]+)/,
    /drive\.google\.com\/uc\?(?:export=[^&]*&)?id=([^&]+)/,
    /drive\.google\.com\/uc\?id=([^&]+)/
  ];

  function driveFileId(url) {
    for (var i = 0; i < ID_PATTERNS.length; i++) {
      var m = url.match(ID_PATTERNS[i]);
      if (m) return m[1];
    }
    return null;
  }

  function isVideoFile(url) { return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url); }
  function isSvgFile(url) { return /\.svg(\?|$)/i.test(url); }

  /**
   * { kind: 'image'|'svg'|'video-file'|'video-embed', src, thumbSrc }
   * `src` is full quality (used by the lightbox); `thumbSrc` is a cheap
   * low-res version (used by the grid) where one is available.
   */
  function resolve(rawUrl, hint) {
    var url = (rawUrl || '').trim();
    var id = driveFileId(url);

    if (!id) {
      if (hint === 'video' || isVideoFile(url)) return { kind: 'video-file', src: url, thumbSrc: url };
      if (hint === 'svg' || isSvgFile(url)) return { kind: 'svg', src: url, thumbSrc: url };
      if (hint === "file") return { kind: "file", src: url, thumbSrc: url };
      return { kind: 'image', src: url, thumbSrc: url };
    }

    if (hint === 'video' || isVideoFile(url)) {
      return {
        kind: 'video-embed',
        src: 'https://drive.google.com/file/d/' + id + '/preview',
        // Drive's own low-res thumbnail JPEG — cheap to load in a grid.
        thumbSrc: 'https://drive.google.com/thumbnail?id=' + id + '&sz=w400'
      };
    }

    var base = 'https://lh3.googleusercontent.com/d/' + id;
    return {
      kind: hint === 'svg' || isSvgFile(url) ? 'svg' : 'image',
      src: base, // full-res, only fetched when opened in the lightbox
      thumbSrc: base + '=s200' // small, fast grid thumbnail
    };
  }

  global.MediaResolver = { resolve: resolve, driveFileId: driveFileId };
})(window);
