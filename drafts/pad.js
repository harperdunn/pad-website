/* PAD drafts: shared behavior.
   1. Realistic waving flag: <canvas data-flag> becomes a WebGL cloth flag
      (lit folds, fabric weave). Add data-video="file.mp4" to the canvas's
      parent to use a real flag clip instead, once we have a licensed one.
   2. Scroll reveals: elements with class "rv" rise into place as they scroll in.
   3. Parallax: elements with data-speed="0.3" drift as the page scrolls. */
(function () {
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- flag texture: official proportions, 50 five-point stars ---------- */
  function flagTexture() {
    var H = 520, W = Math.round(H * 1.9), c = document.createElement('canvas');
    c.width = W; c.height = H;
    var g = c.getContext('2d'), sh = H / 13;
    for (var i = 0; i < 13; i++) {
      g.fillStyle = i % 2 ? '#f7f5f0' : '#b31942';
      g.fillRect(0, Math.floor(i * sh), W, Math.ceil(sh) + 1);
    }
    var cw = 0.76 * H, ch = 7 * sh;
    g.fillStyle = '#0a3161'; g.fillRect(0, 0, cw, ch);
    g.fillStyle = '#f7f5f0';
    var R = 0.0308 * H, r = R * 0.382;
    for (var row = 0; row < 9; row++) {
      var n = row % 2 ? 5 : 6;
      for (var k = 0; k < n; k++) {
        var x = (row % 2 ? 0.126 : 0.063) * H + k * 0.126 * H, y = (0.054 + row * 0.054) * H;
        g.beginPath();
        for (var p = 0; p < 10; p++) {
          var a = -Math.PI / 2 + p * Math.PI / 5, rr = p % 2 ? r : R;
          g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        }
        g.closePath(); g.fill();
      }
    }
    return c;
  }

  var VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  var FS = [
    'precision highp float;',
    'uniform sampler2D T;uniform vec2 S;uniform float t;varying vec2 v;',
    // cloth height: travelling waves, larger toward the fly end
    'float h(vec2 q){float a=.012+.05*q.x;',
    ' return a*(sin(q.x*8.3-t*2.1+q.y*1.7)+.55*sin(q.x*14.7-t*3.3-q.y*2.6)+.8*sin(q.x*3.9-t*1.25+q.y*.9));}',
    'void main(){',
    ' float fa=1.9,ca=S.x/S.y;vec2 q=v;',
    // "cover" fit, slightly oversized so no edge shows while waving
    ' if(ca>fa){q.y=(q.y-.5)*fa/ca+.5;}else{q.x=(q.x-.5)*ca/fa+.5;}',
    ' q=(q-.5)/1.12+.5;q.y=1.-q.y;',
    ' float e=.0025;float z=h(q);',
    ' float dx=(h(q+vec2(e,0.))-z)/e,dy=(h(q+vec2(0.,e))-z)/e;',
    ' vec2 u=q+vec2(dx*.012,z*.55);',
    ' vec3 col=texture2D(T,clamp(u,0.,1.)).rgb;',
    ' vec3 n=normalize(vec3(-dx,-dy,2.2));vec3 L=normalize(vec3(-.45,.55,.7));',
    ' float d=clamp(dot(n,L),0.,1.);',
    ' float sp=pow(clamp(dot(reflect(-L,n),vec3(0.,0.,1.)),0.,1.),18.)*.22;',
    ' float ao=.82+.35*clamp(z*9.+.5,0.,1.);',
    ' float w=.96+.04*sin(u.x*1400.)*sin(u.y*740.);',
    ' col=col*(.42+.72*d)*ao*w+sp;',
    ' gl_FragColor=vec4(col,1.);}'
  ].join('\n');

  function initFlag(cv) {
    var host = cv.parentElement, vid = host && host.getAttribute('data-video');
    if (vid) {
      var V = document.createElement('video');
      V.muted = true; V.loop = true; V.playsInline = true; V.autoplay = !RM; V.src = vid;
      V.className = cv.className; V.setAttribute('aria-hidden', 'true');
      V.addEventListener('canplay', function () { cv.replaceWith(V); }, { once: true });
      return;
    }
    var gl = cv.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    var tex = flagTexture();
    if (!gl) { // static fallback
      var g2 = cv.getContext('2d'); cv.width = cv.clientWidth; cv.height = cv.clientHeight;
      var s = Math.max(cv.width / tex.width, cv.height / tex.height);
      g2.drawImage(tex, (cv.width - tex.width * s) / 2, (cv.height - tex.height * s) / 2, tex.width * s, tex.height * s);
      return;
    }
    function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; }
    var pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr); gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var uS = gl.getUniformLocation(pr, 'S'), ut = gl.getUniformLocation(pr, 't');
    var speed = parseFloat(cv.getAttribute('data-flag')) || 1, t = 1.3, vis = false, run = false, last = 0;
    function draw() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
      if (!W || !H) return;
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      gl.viewport(0, 0, W, H); gl.uniform2f(uS, W, H); gl.uniform1f(ut, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function loop(now) {
      if (!vis) { run = false; return; }
      t += Math.min((now - (last || now)) / 1000, .05) * speed; last = now;
      draw(); requestAnimationFrame(loop);
    }
    new IntersectionObserver(function (es) {
      vis = es[0].isIntersecting;
      if (vis && !RM && !run) { run = true; last = 0; requestAnimationFrame(loop); } else draw();
    }).observe(cv);
    if (window.ResizeObserver) new ResizeObserver(draw).observe(cv);
    draw();
  }
  document.querySelectorAll('canvas[data-flag]').forEach(initFlag);

  /* ---------- scroll reveals ---------- */
  if (!RM && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('mo');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('shown'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('shown'); });
  }

  /* ---------- parallax + scroll progress (--sp, 0..1 across the first screen) ---------- */
  var px = [].slice.call(document.querySelectorAll('[data-speed]'));
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    document.documentElement.style.setProperty('--sp', Math.min(y / vh, 1).toFixed(3));
    if (RM) return;
    px.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      var mid = r.top + r.height / 2 - vh / 2;
      el.style.transform = 'translate3d(0,' + (mid * -parseFloat(el.getAttribute('data-speed'))).toFixed(1) + 'px,0)';
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
})();
