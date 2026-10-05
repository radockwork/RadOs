// Year in footer
document.getElementById('yr').textContent = new Date().getFullYear();

// Scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Red particle network background (reacts to pointer)
const c = document.getElementById('bg'), x = c.getContext('2d');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
let W, H, dpr, pts = [], m = { x: -999, y: -999 };

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  c.width = W * dpr; c.height = H * dpr;
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const n = Math.min(90, Math.floor(W * H / 16000));
  pts = Array.from({ length: n }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
  }));
}
function draw() {
  x.clearRect(0, 0, W, H);
  for (const p of pts) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy);
    if (d < 120) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
    x.fillStyle = 'rgba(255,26,26,.8)';
    x.fillRect(p.x, p.y, 2, 2);
  }
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
    if (d < 130) {
      x.strokeStyle = `rgba(255,26,26,${(1 - d / 130) * .25})`;
      x.beginPath(); x.moveTo(pts[i].x, pts[i].y); x.lineTo(pts[j].x, pts[j].y); x.stroke();
    }
  }
  if (!still) requestAnimationFrame(draw);
}
addEventListener('resize', resize);
addEventListener('pointermove', e => { m.x = e.clientX; m.y = e.clientY; });
addEventListener('pointerleave', () => { m.x = m.y = -999; });
resize(); draw();
