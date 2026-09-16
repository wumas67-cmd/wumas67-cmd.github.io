(() => {
  const catalog = {
    1: {
      id: 1, name: '藥師佛藥香2H', type: 'MEDICINE BUDDHA INCENSE', note: '古藥房的藥香味道・2H盤香',
      description: '藥師佛藥香2H，以古藥房的藥香味道為主要香氣特色。商品頁目前標示買5送1，適合日常聞香、靜心與居家空間使用。',
      price: 350, spec: '2H盤香・買5送1', badge: '藥師香', background: '#e8e1d1',
      images: ['images/medicine-buddha-incense.jpg'], base64Files: ['images/medicine-buddha-incense.base64.txt'],
      sourceUrl: 'https://www.wumas.url.tw/product_1529298.html'
    },
    2: {
      id: 2, name: '拙具羅(7寸線/盒)', detailName: '拙具羅(7寸線/盒)(買5送1)', type: 'DHARMA PROTECTOR INCENSE',
      note: '供護法・清淨莊嚴壇城',
      description: '新包裝的拙具羅香，可作為供護法與日常修持用香。商品說明記載其可幫助壇城清淨、莊嚴道場，以心香召請諸佛菩薩降臨。',
      price: 600, spec: '7寸線香／盒・買5送1', badge: '供護法', background: '#d9d0bd',
      images: ['images/zhujuluo-incense-01.jpg', 'images/zhujuluo-incense-02.jpg', 'images/zhujuluo-incense-03.jpg'],
      base64Files: ['images/zhujuluo-incense-01.base64.txt', 'images/zhujuluo-incense-02.base64.txt', 'images/zhujuluo-incense-03.base64.txt'],
      sourceUrl: 'https://wumas1216.pixnet.net/blog/posts/16096543718'
    }
  };

  const money = value => `NT$${value.toLocaleString('zh-TW')}`;
  const imageSource = source => source.startsWith('data:') ? source : `${source}?v=20260916-10`;

  function productImage(product, compact = false) {
    return `<div class="product-visual${compact ? ' compact' : ''}" style="background:${product.background}">
      <span class="product-badge">${product.badge}</span>
      <img class="product-photo" src="${imageSource(product.images[0])}" alt="${product.name}產品實物照片">
    </div>`;
  }

  function productGallery(product) {
    if (product.images.length === 1) return productImage(product, true);
    return `<div class="product-gallery" data-gallery="${product.id}">
      <div class="product-visual compact product-gallery-main" style="background:${product.background}">
        <span class="product-badge">${product.badge}</span>
        <img class="product-photo" data-gallery-main src="${imageSource(product.images[0])}" alt="${product.name}主要商品照片">
      </div>
      <div class="product-gallery-thumbnails" aria-label="${product.name}商品圖片">
        ${product.images.map((image, index) => `<button class="${index === 0 ? 'active' : ''}" type="button" data-gallery-image="${index}" aria-label="查看第${index + 1}張商品圖片" aria-pressed="${index === 0}"><img src="${imageSource(image)}" alt="${product.name}商品照片${index + 1}"></button>`).join('')}
      </div>
    </div>`;
  }

  function patchHomepageCards() {
    const cards = document.querySelectorAll('#productGrid .product-card');
    [catalog[1], catalog[2]].forEach(product => {
      const card = cards[product.id - 1];
      if (!card) return;
      card.innerHTML = `<a href="product.html?id=${product.id}" class="product-link" aria-label="查看${product.name}商品詳情">${productImage(product)}</a>
        <div class="product-info"><a href="product.html?id=${product.id}" class="product-copy-link" aria-label="查看${product.name}商品詳情">
          <span class="product-meta">${product.type}</span><h3>${product.name}</h3><p>${product.note}<br>${product.spec}</p></a>
          <div class="product-footer product-card-footer"><strong>${money(product.price)}</strong>
            <button class="add-button" type="button" data-add="${product.id}" aria-label="將${product.name}加入購物車">＋</button></div></div>`;
    });
  }

  function medicineStory() {
    return {
      story: `<div class="product-story-heading"><p class="eyebrow">PRODUCT STORY</p><h2 id="productStoryTitle">藥師佛藥香的誕生</h2><p class="product-story-lead">2022年，最令人高興的是——醞釀了一年的《藥師佛藥香》終於出爐了。</p></div><div class="product-story-body"><p>也許是宿世關係，我個人非常喜歡古藥房的藥香味道，因此有了這款藥香的製作。使用與《藥師佛藥供塔》同樣的材料，製成盤香，提供 2H、4H 兩款。</p><p>在修法、念經、念咒或日常功課時，是最好的陪伴。</p><div class="product-variants" aria-label="藥師佛藥香規格與價格"><p><strong>藥師佛藥香 2H盤香</strong><span>350元／盒・買5送1</span></p><p><strong>藥師佛藥香 4H盤香</strong><span>450元／盒・買5送1</span></p></div><p class="product-purpose">敬佛・禮佛・祭祀・修法・品茶，最佳供香。</p><ul class="product-offers"><li>購買香品滿二千元免運費。</li><li>購買香品滿二千元，可指定結緣品《御守護》一個或閉關筆記一本。</li></ul></div>`,
      notes: `<div><p class="eyebrow">INCENSE NOTES</p><h2>古藥房的藥香氣息，<br>陪伴日常靜心時光。</h2></div><div class="detail-note-grid"><p><strong>香氣特色</strong><span>古藥房風格的藥香味道</span></p><p><strong>商品形式</strong><span>2H盤香</span></p><p><strong>保存方式</strong><span>避免潮濕與陽光直射，密封乾燥保存</span></p></div>`
    };
  }

  function zhujuluoStory() {
    return {
      story: `<div class="product-story-heading"><p class="eyebrow">PRODUCT STORY</p><h2 id="productStoryTitle">拙具羅香・供護法</h2><p class="product-story-lead">新包裝～～供護法～～拙具羅香～～最好～～金光明經如是說</p></div><div class="product-story-body"><p>可幫助壇城的清淨，莊嚴壇城道場，以心香召請諸佛菩薩降臨。</p><p>在經典中記載其功能：安神、醒腦、鎮魄、除穢、闢邪惡、辟蠱毒、除惡臭。</p><p class="product-purpose">供護法～～講究ㄟ～～</p><div class="product-variants" aria-label="拙具羅香規格與價格"><p><strong>拙具羅臥香</strong><span>600元／盒・滿滿一大盒・買5送1</span></p><p><strong>拙具羅2H</strong><span>600元／盒・香味滿滿・買5送1</span></p></div><p>這一批做的量多，把價格優惠給同修們～～</p><div class="scripture-quotes"><blockquote><p>《金光明最勝王經・四天王護國品第十二》云：所謂安息、栴檀、龍腦、蘇合、多揭羅、薰陸，皆須等分，和合一處，手執香爐，燒香供養，清淨澡浴，著鮮潔衣，於一靜室，可誦神咒，請我薜室末挐天王……</p></blockquote><blockquote><p>《千手千眼觀世音菩薩廣大圓滿無礙大悲心陀羅尼經》提到：此觀世音菩薩，所說神咒，真實不虛。若欲請此菩薩來，咒拙具羅三七遍，燒，菩薩即來……</p></blockquote></div><p class="maker-note"><strong>製香老師曰：</strong>親選材料，反覆調配，傾心力作，四天王、財寶天王、增長天王開運臻寶！日日供之，招財開運，得獲守護，修行必備！非一般市售商品可比擬～～</p><p class="story-source"><a href="${catalog[2].sourceUrl}" target="_blank" rel="noopener">參照原說明文章</a></p></div>`,
      notes: `<div><p class="eyebrow">INCENSE NOTES</p><h2>供護法的心香，<br>清淨莊嚴壇城。</h2></div><div class="detail-note-grid"><p><strong>商品形式</strong><span>7寸線香／盒</span></p><p><strong>商品優惠</strong><span>600元／盒・買5送1</span></p><p><strong>保存方式</strong><span>避免潮濕與陽光直射，密封乾燥保存</span></p></div>`
    };
  }

  function patchProductStory(product) {
    const story = document.querySelector('#productStory');
    const notes = document.querySelector('#productNotes');
    if (!story || !notes) return;
    const content = product.id === 2 ? zhujuluoStory() : medicineStory();
    story.innerHTML = content.story;
    notes.innerHTML = content.notes;
  }

  function patchProductDetail() {
    const mount = document.querySelector('#productDetail');
    if (!mount) return;
    const id = Number(new URLSearchParams(location.search).get('id')) || 1;
    const product = catalog[id];
    if (!product) return;
    const displayName = product.detailName || product.name;
    document.title = `${displayName}｜禪修林都是好香`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `禪修林都是好香｜${displayName}商品詳情・售價${money(product.price)}`;
    mount.innerHTML = `<div class="detail-visual">${productGallery(product)}</div><div class="detail-copy">
      <p class="eyebrow">${product.type}</p><p class="detail-breadcrumb"><a href="index.html">首頁</a> / <a href="index.html#products">香品選物</a> / ${product.name}</p>
      <h1>${displayName}</h1><p class="detail-note-line">${product.note}</p><p class="detail-description">${product.description}</p>
      <ul class="detail-list"><li>規格：${product.spec}</li><li>${product.id === 2 ? '用途：供護法、修持與莊嚴壇城' : '香氣特色：古藥房的藥香味道'}</li><li>使用建議：點香時保持室內空氣流通</li><li>保存方式：密封、乾燥、避免陽光直射</li></ul>
      <div class="detail-buy"><strong>${money(product.price)}</strong><button type="button" data-add="${product.id}">加入購物車</button></div>
      <p class="detail-demo"><a href="${product.sourceUrl}" target="_blank" rel="noopener">查看原商品資料</a></p><p class="detail-demo">目前為展示網站，購物車不會建立真實訂單或付款。</p></div>`;
    patchProductStory(product);
  }

  function patch() { patchHomepageCards(); patchProductDetail(); }

  async function loadBase64Images(product) {
    product.images = await Promise.all(product.base64Files.map(async (file, index) => {
      try {
        const response = await fetch(`${file}?v=20260916-10`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const dataUrl = (await response.text()).trim();
        if (!dataUrl.startsWith('data:image/jpeg;base64,')) throw new Error('Invalid image data URL');
        return dataUrl;
      } catch (error) {
        console.warn(`Base64 product image ${index + 1} could not be loaded; using the JPG fallback.`, error);
        return product.images[index];
      }
    }));
    patch();
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-gallery-image]');
    if (!button) return;
    const gallery = button.closest('[data-gallery]');
    const product = catalog[Number(gallery?.dataset.gallery)];
    const main = gallery?.querySelector('[data-gallery-main]');
    const index = Number(button.dataset.galleryImage);
    if (!product || !main || !product.images[index]) return;
    main.src = imageSource(product.images[index]);
    main.alt = `${product.name}商品照片${index + 1}`;
    gallery.querySelectorAll('[data-gallery-image]').forEach((item, itemIndex) => {
      const active = itemIndex === index;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(patch, 0));
  else setTimeout(patch, 0);
  Object.values(catalog).forEach(loadBase64Images);
})();
