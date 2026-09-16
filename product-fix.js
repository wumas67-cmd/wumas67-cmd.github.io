(() => {
  const product = {
    id: 1,
    name: '藥師佛藥香2H',
    type: 'MEDICINE BUDDHA INCENSE',
    note: '古藥房的藥香味道・2H盤香',
    description: '藥師佛藥香2H，以古藥房的藥香味道為主要香氣特色。商品頁目前標示買5送1，適合日常聞香、靜心與居家空間使用。',
    price: 350,
    spec: '2H盤香・買5送1',
    image: 'images/medicine-buddha-incense.jpg',
    sourceUrl: 'https://www.wumas.url.tw/product_1529298.html'
  };

  const money = value => `NT$${value.toLocaleString('zh-TW')}`;

  function productImage(compact = false) {
    const imageSrc = product.image.startsWith('data:')
      ? product.image
      : `${product.image}?v=20260916-6`;
    return `<div class="product-visual${compact ? ' compact' : ''}" style="background:#e8e1d1">
      <span class="product-badge">藥師香</span>
      <img class="medicine-buddha-photo" src="${imageSrc}" alt="藥師佛藥香2H產品實物照片">
    </div>`;
  }

  function patchHomepageCard() {
    const grid = document.querySelector('#productGrid');
    if (!grid) return;
    const card = grid.querySelector('.product-card');
    if (!card) return;

    card.innerHTML = `
      <a href="product.html?id=1" class="product-link" aria-label="查看藥師佛藥香2H商品詳情">
        ${productImage(false)}
        <div class="product-info">
          <span class="product-meta">${product.type}</span>
          <h3>${product.name}</h3>
          <p>${product.note}<br>${product.spec}</p>
        </div>
      </a>
      <div class="product-footer product-card-footer">
        <strong>${money(product.price)}</strong>
        <button class="add-button" type="button" data-add="1" aria-label="將藥師佛藥香2H加入購物車">＋</button>
      </div>`;
  }

  function patchProductDetail() {
    const mount = document.querySelector('#productDetail');
    if (!mount) return;
    const id = Number(new URLSearchParams(location.search).get('id')) || 1;
    if (id !== 1) return;

    document.title = '藥師佛藥香2H｜一縷清香';
    mount.innerHTML = `
      <div class="detail-visual">${productImage(true)}</div>
      <div class="detail-copy">
        <p class="eyebrow">${product.type}</p>
        <p class="detail-breadcrumb"><a href="index.html">首頁</a> / <a href="index.html#products">香品選物</a> / ${product.name}</p>
        <h1>${product.name}</h1>
        <p class="detail-note-line">${product.note}</p>
        <p class="detail-description">${product.description}</p>
        <ul class="detail-list">
          <li>規格：${product.spec}</li>
          <li>香氣特色：古藥房的藥香味道</li>
          <li>使用建議：點香時保持室內空氣流通</li>
          <li>保存方式：密封、乾燥、避免陽光直射</li>
        </ul>
        <div class="detail-buy"><strong>${money(product.price)}</strong><button type="button" data-add="1">加入購物車</button></div>
        <p class="detail-demo"><a href="${product.sourceUrl}" target="_blank" rel="noopener">查看原商品資料</a></p>
        <p class="detail-demo">目前為展示網站，購物車不會建立真實訂單或付款。</p>
      </div>`;
  }

  function patch() {
    patchHomepageCard();
    patchProductDetail();
  }

  async function loadBase64Image() {
    try {
      const response = await fetch('images/medicine-buddha-incense.base64.txt?v=20260916-6');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const dataUrl = (await response.text()).trim();
      if (!dataUrl.startsWith('data:image/jpeg;base64,')) {
        throw new Error('Invalid image data URL');
      }
      product.image = dataUrl;
      patch();
    } catch (error) {
      console.warn('Base64 product image could not be loaded; using the JPG fallback.', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(patch, 0));
  } else {
    setTimeout(patch, 0);
  }
  loadBase64Image();
})();
