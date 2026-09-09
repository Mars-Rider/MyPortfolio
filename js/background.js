/*
 * Low-poly geometric shapes behind the content, on top of the dotted
 * grid, drifting very slowly. Generated exactly once per page load (the
 * existing-check below guards against being called twice) and kept
 * cheap: a handful of plain divs, transform-only CSS animation (GPU
 * compositing, no layout/paint per frame), no JS after the initial build.
 */
(function (global) {
  var SHAPE_CLIPS = [
    'polygon(50% 0%, 0% 100%, 100% 100%)',                       // triangle
    'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',                // square
    'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // hex
    'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',      // pentagon
    'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'                 // diamond
  ];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function build(count) {
    if (document.getElementById('bgShapes')) return;

    var wrap = document.createElement('div');
    wrap.id = 'bgShapes';
    wrap.className = 'bg-shapes';
    wrap.setAttribute('aria-hidden', 'true');

    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var size = rand(36, 190);
      var el = document.createElement('div');
      el.className = 'bg-shape';
      el.style.cssText =
        'clip-path:' + SHAPE_CLIPS[i % SHAPE_CLIPS.length] + ';' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'left:' + rand(-4, 96) + 'vw;top:' + rand(-4, 96) + 'vh;' +
        '--rot-start:' + rand(-30, 30) + 'deg;--rot-end:' + rand(-30, 30) + 'deg;' +
        '--drift-x:' + rand(-40, 40) + 'px;--drift-y:' + rand(-40, 40) + 'px;' +
        'animation-duration:' + rand(50, 130) + 's;animation-delay:' + rand(-60, 0) + 's;' +
        'opacity:' + rand(0.35, 1).toFixed(2);
      frag.appendChild(el);
    }
    wrap.appendChild(frag);
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  function init(count) {
    var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    build(count || (reduced ? 6 : 10));
  }

  global.BgShapes = { init: init };
})(window);
