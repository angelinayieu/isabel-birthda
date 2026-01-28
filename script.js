// Single-canvas scene: animated sky gradient, sun shimmer, ocean waves, sparkles, and two blocky characters.
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d", { alpha: false });

function resize() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize);
resize();

// Sparkles
const sparkles = Array.from({ length: 90 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.6 + Math.random() * 1.8,
  a: Math.random(),
  s: 0.1 + Math.random() * 0.35,
  w: 0.6 + Math.random() * 1.2
}));

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function drawRoundedRect(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  ctx.fill();
}

function drawLabel(text, x, y, scale = 1) {
  ctx.save();
  ctx.font = `${Math.floor(16 * scale)}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 6;

  const paddingX = 12 * scale;
  const paddingY = 8 * scale;
  const m = ctx.measureText(text);
  const w = m.width + paddingX * 2;
  const h = 28 * scale + paddingY;

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  drawRoundedRect(x - w / 2, y - h / 2, w, h, 12 * scale);

  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawRobloxSilhouette(cx, baseY, scale, tilt = 0) {
  // A simple "Roblox-ish" block figure sitting:
  // head, torso, upper legs (sit), lower legs.
  ctx.save();
  ctx.translate(cx, baseY);
  ctx.rotate(tilt);

  const s = scale;

  // silhouette gradient
  const grad = ctx.createLinearGradient(0, -220 * s, 0, 40 * s);
  grad.addColorStop(0, "rgba(20,12,10,0.96)");
  grad.addColorStop(1, "rgba(8,6,8,0.98)");
  ctx.fillStyle = grad;
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 18;

  // head
  ctx.fillRect(-22 * s, -180 * s, 44 * s, 44 * s);

  // torso
  ctx.fillRect(-30 * s, -136 * s, 60 * s, 70 * s);

  // arm (back)
  ctx.globalAlpha = 0.95;
  ctx.fillRect(-44 * s, -128 * s, 16 * s, 56 * s);

  // arm (front)
  ctx.fillRect(28 * s, -124 * s, 16 * s, 52 * s);

  // upper legs (sitting forward)
  ctx.globalAlpha = 1;
  ctx.fillRect(-30 * s, -66 * s, 30 * s, 30 * s); // left upper
  ctx.fillRect(0 * s, -66 * s, 30 * s, 30 * s); // right upper

  // lower legs (down)
  ctx.fillRect(-30 * s, -36 * s, 26 * s, 46 * s);
  ctx.fillRect(4 * s, -36 * s, 26 * s, 46 * s);

  // feet
  ctx.fillRect(-34 * s, 10 * s, 32 * s, 14 * s);
  ctx.fillRect(2 * s, 10 * s, 32 * s, 14 * s);

  ctx.restore();
}

function frame(tms) {
  const t = tms * 0.001;
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Horizon line and layout
  const horizonY = h * 0.56;
  const beachY = h * 0.78;

  // --- Sky gradient (animated) ---
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  // subtle time-based shifts
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.25);
  sky.addColorStop(0.0, `rgba(${Math.floor(42 + 10 * pulse)},${Math.floor(43 + 6 * pulse)},${Math.floor(111 + 10 * pulse)},1)`);
  sky.addColorStop(0.5, `rgba(255,${Math.floor(85 + 20 * pulse)},${Math.floor(120 + 10 * pulse)},1)`);
  sky.addColorStop(1.0, `rgba(255,${Math.floor(175 + 20 * pulse)},${Math.floor(90 + 10 * pulse)},1)`);

  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // --- Sun + glow ---
  const sunX = w * 0.5;
  const sunY = horizonY - h * 0.08 + Math.sin(t * 0.25) * 6;
  const sunR = Math.min(w, h) * 0.085;

  // glow
  const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.3, sunX, sunY, sunR * 3.0);
  glow.addColorStop(0, "rgba(255,255,255,0.35)");
  glow.addColorStop(0.35, "rgba(255,220,160,0.22)");
  glow.addColorStop(1, "rgba(255,170,120,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 3, 0, Math.PI * 2);
  ctx.fill();

  // sun disk
  const sunGrad = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR);
  sunGrad.addColorStop(0, "rgba(255,255,255,0.98)");
  sunGrad.addColorStop(0.55, "rgba(255,245,220,0.98)");
  sunGrad.addColorStop(1, "rgba(255,210,150,0.98)");
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();

  // --- Ocean ---
  const ocean = ctx.createLinearGradient(0, horizonY, 0, beachY);
  ocean.addColorStop(0, "rgba(9,42,68,0.92)");
  ocean.addColorStop(1, "rgba(6,24,45,0.98)");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, horizonY, w, beachY - horizonY);

  // Sun reflection on water
  const reflW = w * 0.30;
  const refl = ctx.createLinearGradient(sunX, horizonY, sunX, beachY);
  refl.addColorStop(0, "rgba(255,230,170,0.55)");
  refl.addColorStop(0.45, "rgba(255,200,150,0.18)");
  refl.addColorStop(1, "rgba(255,180,120,0)");
  ctx.globalAlpha = 0.85;
  for (let i = 0; i < 38; i++) {
    const y = lerp(horizonY + 8, beachY - 14, i / 37);
    const wave = (Math.sin(t * 1.6 + i * 0.55) + Math.sin(t * 0.9 + i * 0.9)) * 0.5;
    const ww = lerp(reflW * 0.15, reflW, 1 - (i / 37)) * (0.85 + 0.15 * wave);
    const hh = 2 + (i % 3 === 0 ? 1 : 0);
    ctx.fillStyle = refl;
    ctx.fillRect(sunX - ww / 2, y + wave * 3, ww, hh);
  }
  ctx.globalAlpha = 1;

  // Water waves
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  for (let i = 0; i < 30; i++) {
    const y = horizonY + (i / 30) * (beachY - horizonY);
    const amp = 6 + i * 0.06;
    const phase = t * 1.25 + i * 0.35;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 18) {
      const yy = y + Math.sin((x * 0.012) + phase) * amp * 0.18;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.lineTo(w, y + 6);
    ctx.lineTo(0, y + 6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // --- Beach / foreground silhouette ---
  const sand = ctx.createLinearGradient(0, beachY, 0, h);
  sand.addColorStop(0, "rgba(35,18,16,0.92)");
  sand.addColorStop(1, "rgba(10,8,12,0.98)");
  ctx.fillStyle = sand;
  ctx.fillRect(0, beachY, w, h - beachY);

  // Soft vignette
  const vig = ctx.createRadialGradient(w * 0.5, h * 0.6, Math.min(w, h) * 0.25, w * 0.5, h * 0.6, Math.min(w, h) * 0.85);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.36)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);

  // --- Sparkles in the sky ---
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (const p of sparkles) {
    // drift
    p.a += p.s * 0.003;
    const tw = 0.5 + 0.5 * Math.sin((t * 1.3 + p.a * 6.0));
    const x = (p.x * w + Math.sin(t * 0.08 + p.a * 3.2) * 18 + w) % w;
    const y = (p.y * h * 0.55 + Math.cos(t * 0.06 + p.a * 2.4) * 10);

    const alpha = 0.08 + tw * 0.22;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, p.r * (0.6 + tw * 0.8), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // --- Characters (foreground) ---
  const center = w * 0.5;
  const sitY = beachY + (h - beachY) * 0.55;

  // small ground shadow
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.ellipse(center - 90, sitY + 18, 80, 18, 0, 0, Math.PI * 2);
  ctx.ellipse(center + 90, sitY + 18, 80, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const bob = Math.sin(t * 0.9) * 0.015;

  // Left: Isabel
  drawRobloxSilhouette(center - 90, sitY, 1.0, -0.05 + bob);
  drawLabel("Isabel", center - 90, sitY - 205, 1.0);

  // Right: Angelina
  drawRobloxSilhouette(center + 90, sitY, 1.0, 0.04 - bob);
  drawLabel("Angelina", center + 90, sitY - 205, 1.0);

  // Subtle heart-ish glow between them (abstract, non-literal)
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const hx = center;
  const hy = sitY - 90;
  const hr = 120 + Math.sin(t * 1.1) * 8;
  const hgl = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
  hgl.addColorStop(0, "rgba(255,210,170,0.12)");
  hgl.addColorStop(0.55, "rgba(255,160,140,0.05)");
  hgl.addColorStop(1, "rgba(255,160,140,0)");
  ctx.fillStyle = hgl;
  ctx.beginPath();
  ctx.arc(hx, hy, hr, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);