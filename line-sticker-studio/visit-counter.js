/* 到訪人次計數：使用免費計數服務 Abacus（不需帳號、不需金鑰）
 * 同一個瀏覽器分頁工作階段只計一次，重新整理不會重複累加。
 * 只送出「+1」請求，不傳送任何圖片或使用者資料。 */
(function () {
  'use strict';

  var NAMESPACE = 'wumas67-line-sticker-studio';
  var KEY = 'visits';
  var API = 'https://abacus.jasoncameron.dev';
  var SESSION_FLAG = 'sticker-studio-visit-counted';

  function injectStyle() {
    var css =
      '.visit-counter{display:inline-flex;align-items:center;gap:6px;margin-right:auto;' +
      'color:#8a948b;font-size:11px;letter-spacing:.02em}' +
      '.visit-counter .vc-dot{width:6px;height:6px;border-radius:50%;background:#ff755e;display:inline-block}' +
      '.visit-counter strong{color:#223028;font-weight:700;font-variant-numeric:tabular-nums}' +
      'footer.has-visit-counter{display:flex !important;justify-content:space-between !important;' +
      'align-items:center;flex-wrap:wrap;gap:8px 16px}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function mount() {
    var footer = document.querySelector('main > footer') || document.querySelector('footer');
    if (!footer) return null;
    footer.classList.add('has-visit-counter');
    var box = document.createElement('span');
    box.className = 'visit-counter';
    box.setAttribute('aria-live', 'polite');
    box.innerHTML = '<span class="vc-dot" aria-hidden="true"></span>到訪人次 <strong id="visitCount">…</strong>';
    footer.insertBefore(box, footer.firstChild);
    return box.querySelector('#visitCount');
  }

  function alreadyCounted() {
    try { return sessionStorage.getItem(SESSION_FLAG) === '1'; } catch (e) { return false; }
  }

  function markCounted() {
    try { sessionStorage.setItem(SESSION_FLAG, '1'); } catch (e) { /* 無痕模式等情況忽略 */ }
  }

  function load(output) {
    var action = alreadyCounted() ? 'get' : 'hit';
    fetch(API + '/' + action + '/' + NAMESPACE + '/' + KEY, { cache: 'no-store' })
      .then(function (r) {
        // 首次 get 時計數鍵可能尚未建立（404），視為 0
        if (r.status === 404) return { value: 0 };
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (action === 'hit') markCounted();
        var n = Number(data && data.value);
        output.textContent = isFinite(n) ? n.toLocaleString('zh-TW') : '—';
      })
      .catch(function () {
        output.textContent = '—';
      });
  }

  function init() {
    injectStyle();
    var output = mount();
    if (output) load(output);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
