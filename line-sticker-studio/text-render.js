// 貼圖文字繪製：步驟 1 的即時預覽與步驟 3 的「疊加網頁文字」共用同一套畫法，所見即所得。
const StickerText = (() => {
  // 支援繁體中文的 Google Fonts；選到哪個風格才載入哪個字型，載入失敗時使用系統字型。
  const FONTS = {
    notoSans: { family: '"Noto Sans TC"', css: 'Noto+Sans+TC:wght@500;700;900', fallback: '"PingFang TC","Microsoft JhengHei",sans-serif' },
    notoSerif: { family: '"Noto Serif TC"', css: 'Noto+Serif+TC:wght@500;700;900', fallback: '"PMingLiU","Songti TC",serif' },
    huninn: { family: '"Huninn"', css: 'Huninn', fallback: '"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif' },
    wenkai: { family: '"LXGW WenKai TC"', css: 'LXGW+WenKai+TC:wght@400;700', fallback: '"Kaiti TC","DFKai-SB",serif' },
    iansui: { family: '"Iansui"', css: 'Iansui', fallback: '"LXGW WenKai TC","Kaiti TC",cursive' },
    cactus: { family: '"Cactus Classical Serif"', css: 'Cactus+Classical+Serif', fallback: '"Noto Serif TC","PMingLiU",serif' }
  };
  // 每種字體風格：字型、粗細與特效（heavy 加粗、jitter 字字微傾、slant 斜體、texture 筆觸顆粒）
  const LOOKS = {
    bold: { font: 'notoSans', weight: 900 },
    round: { font: 'huninn', weight: 400, heavy: 1 },
    bubble: { font: 'huninn', weight: 400, effect: 'bubble', heavy: 2.4 },
    natural: { font: 'iansui', weight: 400, texture: .1 },
    marker: { font: 'wenkai', weight: 700, heavy: 1.2, texture: .12 },
    retro: { font: 'cactus', weight: 400, effect: 'shadow', heavy: .6, texture: .16 },
    pixel: { font: 'notoSans', weight: 900, effect: 'pixel' },
    upright: { font: 'notoSans', weight: 900, effect: 'extrude' },
    street: { font: 'notoSans', weight: 900, effect: 'shadow', jitter: .14, slant: -.12 },
    pop: { font: 'notoSans', weight: 900, effect: 'pop' },
    sign: { font: 'notoSerif', weight: 900, effect: 'shadow' },
    cartoon: { font: 'huninn', weight: 400, effect: 'bubble', heavy: 2, jitter: .07 },
    heavyround: { font: 'huninn', weight: 400, heavy: 3.2 },
    crayon: { font: 'iansui', weight: 400, heavy: 1.2, texture: .38 },
    felt: { font: 'wenkai', weight: 700, heavy: 1.4 },
    journal: { font: 'iansui', weight: 400, jitter: .04 },
    sketch: { font: 'iansui', weight: 400, jitter: .1, slant: -.05 },
    child: { font: 'iansui', weight: 400, jitter: .17, heavy: 1 },
    pen: { font: 'wenkai', weight: 400 },
    vintagepen: { font: 'wenkai', weight: 400, texture: .18 },
    kaishu: { font: 'wenkai', weight: 700 },
    cursive: { font: 'wenkai', weight: 400, slant: -.2, jitter: .05 },
    ming: { font: 'notoSerif', weight: 500 },
    chalk: { font: 'iansui', weight: 400, heavy: .8, texture: .34 },
    comic: { font: 'notoSans', weight: 900, effect: 'pop', slant: -.14 },
    hardpen: { font: 'notoSans', weight: 700, slant: -.1 },
    minimal: { font: 'iansui', weight: 400 },
    custom: { font: 'notoSans', weight: 700 }
  };
  const lookOf = style => LOOKS[style] || LOOKS.bold;
  const familyOf = look => { const f = FONTS[look.font]; return `${f.family},${f.fallback}` };

  // ---- 字型載入 ----
  const sheets = {};
  function sheetFor(key) {
    if (sheets[key]) return sheets[key];
    sheets[key] = new Promise(resolve => {
      if (typeof document === 'undefined') return resolve(false);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${FONTS[key].css}&display=swap`;
      link.onload = () => resolve(true);
      link.onerror = () => resolve(false);
      document.head.append(link);
      setTimeout(() => resolve(false), 8000);
    });
    return sheets[key];
  }
  // 回傳 true 代表剛載入新字形，呼叫端應重畫一次；已載入或失敗回傳 false。
  async function ensure(style, text) {
    try {
      const look = lookOf(style), spec = `${look.weight} 40px ${FONTS[look.font].family}`;
      const sample = String(text || '') + '貼圖文字';
      if (!(await sheetFor(look.font)) || !document.fonts) return false;
      if (document.fonts.check(spec, sample)) return false;
      const loaded = await Promise.race([document.fonts.load(spec, sample), new Promise(r => setTimeout(() => r([]), 8000))]);
      return loaded.length > 0;
    } catch (e) { return false }
  }

  // ---- 顏色工具 ----
  function rgb(hex) { const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim()); const n = m ? parseInt(m[1], 16) : 0xed5c57; return [n >> 16 & 255, n >> 8 & 255, n & 255] }
  function luminance(hex) { const [r, g, b] = rgb(hex).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4) }); return .2126 * r + .7152 * g + .0722 * b }
  function shade(hex, amt) { const c = rgb(hex).map(v => Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('') }
  function strokeColor(mode, fill) {
    if (mode === 'white') return '#ffffff';
    if (mode === 'black') return '#000000';
    if (mode === 'dark') return '#2b2b2b';
    // 自動：非白色高對比。淺色字配深色邊，深色字配奶油黃邊。
    return luminance(fill) > .12 ? '#2b2b2b' : '#ffe9a8';
  }

  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
  function hash(s) { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) } return h >>> 0 }
  function wrap(ctx, text, width) { const lines = []; let line = ''; for (const ch of Array.from(text)) { if (ch === '\n') { lines.push(line); line = ''; continue } if (line && ctx.measureText(line + ch).width > width) { lines.push(line); line = ch } else line += ch } if (line) lines.push(line); return lines }

  // ---- 主要繪製 ----
  // box：文字區 {x,y,w,h}；opts：{style, fill, stroke}
  function draw(ctx, value, box, opts) {
    value = String(value || '').trim();
    if (!value || !box) return;
    const look = lookOf(opts.style), fam = familyOf(look), fill = opts.fill || '#ed5c57';
    const strokeOn = opts.stroke !== 'none', sCol = strokeColor(opts.stroke, fill);
    const W = ctx.canvas.width, H = ctx.canvas.height;

    // 1. 找出放得下的最大字級
    const m = document.createElement('canvas').getContext('2d');
    let size = Math.floor(Math.min(76, box.h * .82)), lines = [], ext = 0, lh = 0;
    for (; size > 8; size--) {
      m.font = `${look.weight} ${size}px ${fam}`;
      const sw = strokeOn ? Math.max(2, size * .13) : 0;
      ext = sw + (look.heavy ? size * .035 * look.heavy : 0) + (look.effect === 'bubble' && strokeOn ? size * .24 : 0) +
        (['extrude', 'pop', 'shadow'].includes(look.effect) ? size * .11 : 0) + (look.slant ? size * Math.abs(look.slant) * .6 : 0) + (look.jitter ? size * .08 : 0);
      lh = size * 1.2;
      lines = wrap(m, value, Math.max(10, box.w - 8 - ext));
      const widest = Math.max(...lines.map(l => m.measureText(l).width));
      if (widest + ext <= box.w - 6 && lines.length * lh + ext <= box.h - 4) break;
    }

    // 2. 在獨立圖層上繪製（像素字先畫小再放大）
    const scale = look.effect === 'pixel' ? Math.max(.22, Math.min(.55, 15 / size)) : 1;
    const layer = document.createElement('canvas');
    layer.width = Math.max(1, Math.ceil(W * scale)); layer.height = Math.max(1, Math.ceil(H * scale));
    const c = layer.getContext('2d');
    c.scale(scale, scale);
    c.font = `${look.weight} ${size}px ${fam}`;
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineCap = 'round'; c.miterLimit = 2;
    const sw = strokeOn ? Math.max(2, size * .13) : 0, heavyW = look.heavy ? size * .035 * look.heavy : 0;
    const random = rng(hash(value + opts.style));
    const tilts = Array.from(value).map(() => (random() - .5) * 2 * (look.jitter || 0));
    const bounce = Array.from(value).map(() => (random() - .5) * size * (look.jitter ? .12 : 0));

    function eachLine(fn) {
      let k = 0;
      lines.forEach((line, i) => {
        const cy = box.y + box.h / 2 + (i - (lines.length - 1) / 2) * lh, cx = box.x + box.w / 2;
        c.save(); c.translate(cx, cy);
        if (look.slant) c.transform(1, 0, look.slant, 1, 0, 0);
        if (!look.jitter) { fn(line, 0, 0); k += Array.from(line).length }
        else {
          const chars = Array.from(line), total = c.measureText(line).width;
          let x = -total / 2;
          for (const ch of chars) {
            const w = c.measureText(ch).width;
            c.save(); c.translate(x + w / 2, bounce[k] || 0); c.rotate(tilts[k] || 0); fn(ch, 0, 0); c.restore();
            x += w; k++;
          }
        }
        c.restore();
      });
    }
    function pass(p) {
      eachLine((t, x, y) => {
        x += p.dx || 0; y += p.dy || 0;
        if (p.kind === 'stroke') { c.lineWidth = p.width; c.strokeStyle = p.color; c.strokeText(t, x, y) }
        else if (p.kind === 'both') {
          const w = (strokeOn ? sw : 0) + heavyW;
          if (w > 0) { c.lineWidth = w; c.strokeStyle = p.color; c.strokeText(t, x, y) }
          c.fillStyle = p.color; c.fillText(t, x, y);
        } else { c.fillStyle = p.color; c.fillText(t, x, y) }
      });
    }

    // 由下往上疊：特效陰影 → 外框 → 加粗 → 字面
    if (look.effect === 'extrude') { const d = Math.max(2, Math.round(size * .1)); const side = shade(fill, -.42); for (let k = d; k >= 1; k--) pass({ kind: 'both', dx: k, dy: k, color: k === d && strokeOn ? sCol : side }) }
    if (look.effect === 'shadow') pass({ kind: 'both', dx: size * .06, dy: size * .07, color: 'rgba(0,0,0,.28)' });
    if (look.effect === 'pop') pass({ kind: 'both', dx: size * .1, dy: size * .1, color: strokeOn ? sCol : '#222222' });
    if (look.effect === 'bubble' && strokeOn) pass({ kind: 'stroke', width: sw + heavyW + size * .24, color: sCol });
    if (strokeOn) pass({ kind: 'stroke', width: sw + heavyW + (look.effect === 'bubble' ? size * .1 : 0), color: look.effect === 'bubble' ? '#ffffff' : sCol });
    if (heavyW) pass({ kind: 'stroke', width: heavyW, color: fill });
    pass({ kind: 'fill', color: fill });
    if (look.effect === 'bubble') { c.save(); c.globalCompositeOperation = 'source-atop'; pass({ kind: 'fill', dx: -size * .03, dy: -size * .05, color: 'rgba(255,255,255,.28)' }); c.restore(); }

    // 筆觸顆粒（蠟筆、粉筆、印刷等）
    if (look.texture) {
      c.save(); c.globalCompositeOperation = 'destination-out';
      const n = Math.round(box.w * box.h / 14), grain = rng(hash(value));
      for (let i = 0; i < n; i++) { c.fillStyle = `rgba(0,0,0,${(grain() * look.texture).toFixed(3)})`; const r = .6 + grain() * 1.4; c.fillRect(box.x + grain() * box.w, box.y + grain() * box.h, r, r) }
      c.restore();
    }

    ctx.save();
    ctx.imageSmoothingEnabled = scale === 1;
    ctx.drawImage(layer, 0, 0, layer.width, layer.height, 0, 0, layer.width / scale, layer.height / scale);
    ctx.restore();
  }

  // 預覽用的角色位置示意（依主角色調上色）
  function placeholder(ctx, box, tone) {
    if (!box) return;
    const base = tone || '#d6ddd5', line = shade(base, -.45), s = Math.min(box.w, box.h) * .86;
    const cx = box.x + box.w / 2, cy = box.y + box.h / 2 + s * .05, r = s * .4;
    ctx.save(); ctx.lineWidth = Math.max(2, s * .025); ctx.strokeStyle = line; ctx.fillStyle = base;
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + sx * r * .62, cy - r * .78, r * .3, r * .34, sx * .35, 0, Math.PI * 2); ctx.fill(); ctx.stroke() }
    ctx.beginPath(); ctx.ellipse(cx, cy, r, r * .9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = shade(base, .55); ctx.beginPath(); ctx.ellipse(cx, cy + r * .28, r * .48, r * .34, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2b2b2b';
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + sx * r * .36, cy - r * .08, r * .085, 0, Math.PI * 2); ctx.fill() }
    ctx.fillStyle = 'rgba(244,128,140,.55)';
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + sx * r * .6, cy + r * .14, r * .13, r * .08, 0, 0, Math.PI * 2); ctx.fill() }
    ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = Math.max(1.5, s * .018); ctx.beginPath(); ctx.arc(cx, cy + r * .12, r * .12, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
    ctx.restore();
  }

  return { draw, ensure, placeholder, strokeColor, shade };
})();
if (typeof module !== 'undefined') module.exports = StickerText;
