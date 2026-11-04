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
    if (mode === 'double') return '#2b2b2b';
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
    function fit(b) {
      let size = Math.floor(Math.min(76, b.h * .82)), lines = [], ext = 0, lh = 0, widest = 0;
      for (; size > 8; size--) {
        m.font = `${look.weight} ${size}px ${fam}`;
        const sw = strokeOn ? Math.max(2, size * .13) * (opts.stroke === 'double' ? 1.9 : 1) : 0;
        ext = sw + (look.heavy ? size * .035 * look.heavy : 0) + (look.effect === 'bubble' && strokeOn ? size * .24 : 0) +
          (['extrude', 'pop', 'shadow'].includes(look.effect) ? size * .11 : 0) + (look.slant ? size * Math.abs(look.slant) * .6 : 0) + (look.jitter ? size * .08 : 0);
        lh = size * 1.2;
        lines = wrap(m, value, Math.max(10, b.w - 8 - ext));
        widest = Math.max(...lines.map(l => m.measureText(l).width));
        if (widest + ext <= b.w - 6 && lines.length * lh + ext <= b.h - 4) break;
      }
      return { size, lines, ext, lh, widest };
    }
    let r;
    if (opts.frame && opts.frame !== 'none') {
      // 對話框：先在最大可用空間排字，再讓外框剛好包住文字
      const kind = opts.frame, pos = opts.position || 'bottom', side = pos === 'side';
      const tail = Math.min(18, Math.max(10, box.h * .16));
      const maxBody = { x: box.x + 3 + (side ? tail : 0), y: box.y + 3 + (pos === 'bottom' || pos === 'auto' ? tail : 0), w: box.w - 6 - (side ? tail : 0), h: box.h - 6 - (side ? 0 : tail) };
      const k = kind === 'burst' ? [.8, .68] : kind === 'cloud' ? [.8, .72] : [1, 1];
      const padFor = sz => [Math.max(8, sz * .5), Math.max(5, sz * .28)];
      const p0 = padFor(Math.min(maxBody.h * .4, maxBody.w * .22));
      r = fit({ x: 0, y: 0, w: maxBody.w * k[0] - p0[0] * 2, h: maxBody.h * k[1] - p0[1] * 2 });
      const [px, py] = padFor(r.size);
      const iw = r.widest + r.ext + 6, ih = r.lines.length * r.lh + r.ext * .5;
      const bw = Math.min(maxBody.w, (iw + px * 2) / k[0]), bh = Math.min(maxBody.h, (ih + py * 2) / k[1]);
      const bx = side ? maxBody.x : maxBody.x + (maxBody.w - bw) / 2;
      const by = pos === 'top' ? maxBody.y + maxBody.h - bh : side ? maxBody.y + (maxBody.h - bh) / 2 : maxBody.y;
      const body = { x: bx, y: by, w: bw, h: bh };
      drawFrame(ctx, kind, body, pos, tail);
      box = { x: body.x + (bw - bw * k[0]) / 2, y: body.y + (bh - bh * k[1]) / 2, w: bw * k[0], h: bh * k[1] };
    } else r = fit(box);
    const { size, lines, lh } = r;

    // 2. 在獨立圖層上繪製（像素字先畫小再放大）
    const scale = look.effect === 'pixel' ? Math.max(.22, Math.min(.55, 15 / size)) : 1;
    const layer = document.createElement('canvas');
    layer.width = Math.max(1, Math.ceil(W * scale)); layer.height = Math.max(1, Math.ceil(H * scale));
    const c = layer.getContext('2d');
    c.scale(scale, scale);
    c.font = `${look.weight} ${size}px ${fam}`;
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineCap = 'round'; c.miterLimit = 2;
    const dbl = opts.stroke === 'double', sw = strokeOn ? Math.max(2, size * .13) : 0, heavyW = look.heavy ? size * .035 * look.heavy : 0;
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
    if (dbl) { pass({ kind: 'stroke', width: sw * 2.6 + heavyW, color: sCol }); pass({ kind: 'stroke', width: sw * 1.25 + heavyW, color: '#fff6e0' }) }
    else if (strokeOn) pass({ kind: 'stroke', width: sw + heavyW + (look.effect === 'bubble' ? size * .1 : 0), color: look.effect === 'bubble' ? '#ffffff' : sCol });
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

  // ---- 對話框 ----
  // 在文字區畫出外框，回傳框內可放字的區域；尾巴指向角色
  function drawFrame(ctx, kind, f, position, tail) {
    const side = position === 'side', top = position === 'top', cx = f.x + f.w / 2, cy = f.y + f.h / 2;
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = '#2b2b2b'; ctx.fillStyle = '#fffaf0';
    // 尾巴朝向角色：文字在下方→往上、在上方→往下、在右側→往左
    const t = side ? [[f.x + 3, cy - tail * .45], [f.x - tail, cy - tail * .1], [f.x + 3, cy + tail * .45]]
      : top ? [[cx - tail * .55, f.y + f.h - 3], [cx - tail * .15, f.y + f.h + tail], [cx + tail * .5, f.y + f.h - 3]]
      : [[cx - tail * .5, f.y + 3], [cx - tail * .1, f.y - tail], [cx + tail * .55, f.y + 3]];
    const tailShape = () => { ctx.beginPath(); ctx.moveTo(...t[0]); ctx.lineTo(...t[1]); ctx.lineTo(...t[2]) };
    if (kind === 'round' || kind === 'burst') {
      ctx.fillStyle = kind === 'burst' ? '#fff3c4' : '#fffaf0';
      tailShape(); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      if (kind === 'round') { const r = Math.min(f.h / 2, 20); ctx.roundRect ? ctx.roundRect(f.x, f.y, f.w, f.h, r) : ctx.rect(f.x, f.y, f.w, f.h) }
      else { const n = Math.max(12, Math.round((f.w + f.h) / 16)); for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2, k = i % 2 ? .8 : 1; ctx.lineTo(cx + Math.cos(a) * f.w / 2 * k, cy + Math.sin(a) * f.h / 2 * k) } ctx.closePath() }
      ctx.fill(); ctx.stroke();
      // 蓋掉尾巴與外框相接處的線，讓尾巴和框連成一體
      ctx.beginPath(); ctx.moveTo(...t[0]); ctx.lineTo(...t[1]); ctx.lineTo(...t[2]); ctx.closePath(); ctx.save(); ctx.clip(); ctx.beginPath();
      if (kind === 'round') { const r = Math.min(f.h / 2, 20); ctx.roundRect ? ctx.roundRect(f.x + 2, f.y + 2, f.w - 4, f.h - 4, r) : ctx.rect(f.x + 2, f.y + 2, f.w - 4, f.h - 4) } else ctx.ellipse(cx, cy, f.w * .38, f.h * .38, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.restore(); tailShape(); ctx.stroke();
    } else if (kind === 'cloud') {
      const rx = f.w / 2, ry = f.h / 2, n = Math.max(8, Math.round(f.w / 30)), br = Math.min(ry * .42, rx * .3);
      const bumps = Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return [cx + Math.cos(a) * (rx - br), cy + Math.sin(a) * (ry - br)] });
      for (const [x, y] of bumps) { ctx.beginPath(); ctx.arc(x, y, br, 0, Math.PI * 2); ctx.stroke() }
      ctx.beginPath(); ctx.ellipse(cx, cy, rx - br * .9, ry - br * .9, 0, 0, Math.PI * 2); ctx.fill();
      for (const [x, y] of bumps) { ctx.beginPath(); ctx.arc(x, y, br - 1.5, 0, Math.PI * 2); ctx.fill() }
      const dir = side ? [-1, 0] : top ? [0, 1] : [0, -1], ox = side ? f.x : cx - f.w * .18, oy = side ? cy : top ? f.y + f.h : f.y;
      for (const [d, rr] of [[tail * .35, Math.max(3, tail * .3)], [tail * .85, Math.max(2, tail * .18)]]) { ctx.beginPath(); ctx.arc(ox + dir[0] * d, oy + dir[1] * d, rr, 0, Math.PI * 2); ctx.fill(); ctx.stroke() }
    } else if (kind === 'note') {
      ctx.translate(cx, cy); ctx.rotate(-.04); ctx.fillStyle = '#fff6c9';
      ctx.beginPath(); ctx.rect(-f.w / 2, -f.h / 2, f.w, f.h); ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = 'rgba(235,112,172,.55)'; ctx.fillRect(-Math.min(28, f.w * .14), -f.h / 2 - 6, Math.min(56, f.w * .28), 12);
    }
    ctx.restore();
  }

  // ---- 情緒點綴（漫符） ----
  function decor(ctx, mood, text, character) {
    if (!mood || !text) return;
    const s = Math.max(18, Math.min(44, Math.min(character.w, character.h) * .2));
    const m = Math.min(character.w, character.h), x = Math.min(character.x + character.w / 2 + m * .44, ctx.canvas.width - s * .8 - 10), y = Math.max(s * .9, character.y + m * .2), c = mood.color;
    ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = Math.max(1.5, s * .06); ctx.fillStyle = c;
    const heart = (hx, hy, hs) => { ctx.beginPath(); ctx.moveTo(hx, hy + hs * .3); ctx.bezierCurveTo(hx, hy - hs * .1, hx - hs * .55, hy - hs * .15, hx - hs * .5, hy + hs * .2); ctx.bezierCurveTo(hx - hs * .45, hy + hs * .5, hx - hs * .1, hy + hs * .65, hx, hy + hs * .85); ctx.bezierCurveTo(hx + hs * .1, hy + hs * .65, hx + hs * .45, hy + hs * .5, hx + hs * .5, hy + hs * .2); ctx.bezierCurveTo(hx + hs * .55, hy - hs * .15, hx, hy - hs * .1, hx, hy + hs * .3); ctx.fill(); ctx.stroke() };
    const star = (sx, sy, r) => { ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, k = i % 2 ? .32 : 1; ctx.lineTo(sx + Math.cos(a) * r * k, sy + Math.sin(a) * r * k) } ctx.closePath(); ctx.fill(); ctx.stroke() };
    const drop = (dx, dy, r) => { ctx.beginPath(); ctx.moveTo(dx, dy - r * 1.4); ctx.quadraticCurveTo(dx + r, dy - r * .1, dx, dy + r * .8); ctx.quadraticCurveTo(dx - r, dy - r * .1, dx, dy - r * 1.4); ctx.fill(); ctx.stroke() };
    switch (mood.id) {
      case 'love': heart(0, -s * .45, s); heart(-s * .75, s * .15, s * .5); break;
      case 'sparkle': star(0, 0, s * .55); star(-s * .7, s * .55, s * .28); break;
      case 'sweat': drop(0, 0, s * .32); drop(s * .45, s * .55, s * .2); break;
      case 'sad': drop(-s * .2, 0, s * .26); drop(s * .3, s * .35, s * .26); break;
      case 'angry': ctx.strokeStyle = c; ctx.lineWidth = s * .14; for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { ctx.beginPath(); ctx.moveTo(a * s * .12, b * s * .45); ctx.quadraticCurveTo(a * s * .12, b * s * .12, a * s * .45, b * s * .12); ctx.stroke() } break;
      case 'surprise': ctx.strokeStyle = c; ctx.lineWidth = s * .1; for (const a of [-1.9, -1.45, -1]) { ctx.beginPath(); ctx.moveTo(Math.cos(a) * s * .2, Math.sin(a) * s * .2 + s * .4); ctx.lineTo(Math.cos(a) * s * .7, Math.sin(a) * s * .7 + s * .4); ctx.stroke() } break;
      case 'sleep': ctx.fillStyle = c; ctx.font = `900 ${s * .55}px sans-serif`; ctx.textAlign = 'center'; ctx.lineWidth = 3; for (const [k, dx, dy] of [[1, 0, -s * .2], [.75, -s * .45, s * .25], [.55, -s * .8, s * .6]]) { ctx.font = `900 ${s * .6 * k}px sans-serif`; ctx.strokeText('Z', dx, dy); ctx.fillText('Z', dx, dy) } break;
      case 'sun': ctx.beginPath(); ctx.arc(0, 0, s * .3, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = s * .08; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(Math.cos(a) * s * .45, Math.sin(a) * s * .45); ctx.lineTo(Math.cos(a) * s * .62, Math.sin(a) * s * .62); ctx.stroke() } break;
      case 'music': ctx.beginPath(); ctx.ellipse(-s * .15, s * .3, s * .17, s * .12, -.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * .01, s * .28); ctx.lineTo(-s * .01, -s * .45); ctx.quadraticCurveTo(s * .25, -s * .3, s * .3, -s * .05); ctx.stroke(); star(-s * .7, -s * .2, s * .2); break;
      default: ctx.strokeStyle = c; ctx.lineWidth = s * .1; for (const [a, b, d] of [[-.2, -.5, .3], [.15, -.2, .4], [.2, .2, .3]]) { ctx.beginPath(); ctx.moveTo(a * s, b * s); ctx.lineTo(a * s + d * s, b * s - d * s * .3); ctx.stroke() }
    }
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

  return { draw, ensure, placeholder, decor, strokeColor, shade };
})();
if (typeof module !== 'undefined') module.exports = StickerText;
