/*
 * Low-poly geometric shapes that sit behind the content, on top of the
 * dotted grid, and drift very slowly. Purely decorative — generated once
 * on load with randomized size/rotation/position so it never looks like a
 * repeating tile. Respects prefers-reduced-motion.
 */
(function (global) {
  var SHAPE_CLIPS = {
    triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    square: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    hex: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
  };
  var SHAPE_NAMES = Object.keys(SHAPE_CLIPS);

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function build(count) {
    var existing = document.getElementById('bgShapes');
    if (existing) return;

    var wrap = document.createElement('div');
    wrap.id = 'bgShapes';
    wrap.className = 'bg-shapes';
    wrap.setAttribute('aria-hidden', 'true');

    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      var size = rand(36, 190);
      el.className = 'bg-shape';
      el.style.clipPath = SHAPE_CLIPS[pick(SHAPE_NAMES)];
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = rand(-4, 96) + 'vw';
      el.style.top = rand(-4, 96) + 'vh';
      el.style.setProperty('--rot-start', rand(-30, 30) + 'deg');
      el.style.setProperty('--rot-end', rand(-30, 30) + 'deg');
      el.style.setProperty('--drift-x', rand(-40, 40) + 'px');
      el.style.setProperty('--drift-y', rand(-40, 40) + 'px');
      el.style.animationDuration = rand(50, 130) + 's';
      el.style.animationDelay = rand(-60, 0) + 's';
      el.style.opacity = rand(0.35, 1).toFixed(2);
      wrap.appendChild(el);
    }

    document.body.insertBefore(wrap, document.body.firstChild);
  }

  function init(count) {
    var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    build(count || (reduced ? 8 : 16));
  }

  global.BgShapes = { init: init };
})(window);
