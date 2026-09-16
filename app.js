const MEDICINE_BUDDHA_IMAGE = "data:image/jpeg;base64,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";

const products = [
  { id: 1, name: "藥師佛藥香2H", type: "MEDICINE BUDDHA INCENSE", note: "古藥房的藥香味道・2H盤香", description: "藥師佛藥香2H，商品頁以「古藥房的藥香味道」介紹此款香品。官方訂購頁目前標示買5送1。", price: 350, badge: "藥師香", spec: "2H盤香・買5送1", image: MEDICINE_BUDDHA_IMAGE, sourceUrl: "https://www.wumas.url.tw/product_1529298.html" },
  { id: 2, name: "月白檀香", type: "CALMING INCENSE", note: "老山檀・柔和奶香・溫潤", description: "香氣柔和圓潤，適合閱讀、工作與初次接觸木質香氣的人。", price: 520, badge: "初次推薦", spec: "20公分線香・約30支", bg: "#dad6c8", box: "#f7f2e6", ink: "#7b4a37" },
  { id: 3, name: "山嵐肖楠", type: "FOREST INCENSE", note: "肖楠・森林苔蘚・清冽", description: "帶有清楚的森林氣息與木質感，適合雨天、夜晚與想轉換空間氛圍時。", price: 580, badge: "台灣香材", spec: "20公分線香・約30支", bg: "#abb2a1", box: "#d8d8c8", ink: "#23382e" }
];

const FREE_SHIPPING = 1200;
let cart = JSON.parse(localStorage.getItem("incense-demo-cart") || "{}");
const $ = selector => document.querySelector(selector);
const money = value => `NT$${value.toLocaleString("zh-TW")}`;
const saveCart = () => localStorage.setItem("incense-demo-cart", JSON.stringify(cart));

function productVisual(product, compact = false) {
  if (product.image) {
    return `<div class="product-visual${compact ? " compact" : ""}" style="background:#e8e1d1">
      <span class="product-badge">${product.badge}</span>
      <img src="${product.image}" alt="${product.name}產品實物照片" loading="${compact ? "eager" : "lazy"}" style="width:100%;height:100%;object-fit:cover;position:relative;z-index:1;display:block;">
    </div>`;
  }
  return `<div class="product-visual${compact ? " compact" : ""}" style="--product-bg:${product.bg};--product-box:${product.box};--product-ink:${product.ink}">
    <span class="product-badge">${product.badge}</span>
    <div class="product-box">${product.name}</div>
  </div>`;
}

function renderProducts() {
  const grid = $("#productGrid");
  if (!grid) return;
  grid.innerHTML = products.map(product => `
    <article class="product-card reveal">
      <a href="product.html?id=${product.id}" class="product-link" aria-label="查看${product.name}商品詳情">
        ${productVisual(product)}
        <div class="product-info">
          <span class="product-meta">${product.type}</span>
          <h3>${product.name}</h3>
          <p>${product.note}<br>${product.spec}</p>
        </div>
      </a>
      <div class="product-footer product-card-footer">
        <strong>${money(product.price)}</strong>
        <button class="add-button" type="button" data-add="${product.id}" aria-label="將${product.name}加入購物車">＋</button>
      </div>
    </article>
  `).join("");
}

function renderProductDetail() {
  const mount = $("#productDetail");
  if (!mount) return;
  const id = Number(new URLSearchParams(location.search).get("id")) || 1;
  const product = products.find(item => item.id === id) || products[0];
  document.title = `${product.name}｜一縷清香`;
  const sourceLink = product.sourceUrl ? `<p class="detail-demo"><a href="${product.sourceUrl}" target="_blank" rel="noopener">查看原商品資料</a></p>` : "";
  mount.innerHTML = `
    <div class="detail-visual">${productVisual(product, true)}</div>
    <div class="detail-copy">
      <p class="eyebrow">${product.type}</p>
      <p class="detail-breadcrumb"><a href="index.html">首頁</a> / <a href="index.html#products">香品選物</a> / ${product.name}</p>
      <h1>${product.name}</h1>
      <p class="detail-note-line">${product.note}</p>
      <p class="detail-description">${product.description}</p>
      <ul class="detail-list"><li>規格：${product.spec}</li><li>建議：使用時保持室內通風</li><li>保存：密封、乾燥、避免陽光直射</li></ul>
      <div class="detail-buy"><strong>${money(product.price)}</strong><button type="button" data-add="${product.id}">加入購物車</button></div>
      ${sourceLink}
      <p class="detail-demo">目前為展示網站，購物車不會建立真實訂單或付款。</p>
    </div>`;
}

function cartEntries() { return Object.entries(cart).filter(([, quantity]) => quantity > 0); }
function cartTotal(entries = cartEntries()) {
  return entries.reduce((sum, [id, quantity]) => {
    const product = products.find(item => item.id === Number(id));
    return product ? sum + product.price * quantity : sum;
  }, 0);
}

function renderCart() {
  const entries = cartEntries();
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = cartTotal(entries);
  const countNode = $("#cartCount");
  if (countNode) countNode.textContent = count;
  const empty = $("#cartEmpty");
  const summary = $("#cartSummary");
  if (empty) empty.hidden = entries.length > 0;
  if (summary) summary.hidden = entries.length === 0;
  const items = $("#cartItems");
  if (items) {
    items.innerHTML = entries.map(([id, quantity]) => {
      const product = products.find(item => item.id === Number(id));
      if (!product) return "";
      return `<div class="cart-item"><div class="cart-thumb">${product.name.slice(0, 2)}</div><div><h3>${product.name}</h3><p>${money(product.price)}</p><div class="quantity"><button data-change="${id}" data-delta="-1" aria-label="減少${product.name}數量">−</button><span>${quantity}</span><button data-change="${id}" data-delta="1" aria-label="增加${product.name}數量">＋</button></div></div><button class="remove-item" data-remove="${id}" aria-label="移除${product.name}">移除</button></div>`;
    }).join("");
  }
  const totalNode = $("#cartTotal");
  if (totalNode) totalNode.textContent = money(total);
  const remaining = Math.max(0, FREE_SHIPPING - total);
  const message = $("#shippingMessage");
  const bar = $("#shippingBar");
  if (message) message.textContent = remaining === 0 ? "已達滿額免運門檻。" : `再選購 ${money(remaining)} 即享滿額免運。`;
  if (bar) bar.style.width = `${Math.min(100, (total / FREE_SHIPPING) * 100)}%`;
}

function openCart() {
  const drawer = $("#cartDrawer"), overlay = $("#overlay");
  if (!drawer || !overlay) return;
  drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); overlay.hidden = false; document.body.style.overflow = "hidden";
}
function closeCart() {
  const drawer = $("#cartDrawer"), overlay = $("#overlay");
  if (!drawer || !overlay) return;
  drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); overlay.hidden = true; document.body.style.overflow = "";
}
function showToast(message) {
  const toast = $("#toast"); if (!toast) return; toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function toggleMenu() {
  const button = $("#menuButton"), nav = $("#mainNav"); if (!button || !nav) return; const open = nav.classList.toggle("open"); button.setAttribute("aria-expanded", String(open));
}

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const change = event.target.closest("[data-change]");
  const remove = event.target.closest("[data-remove]");
  const navLink = event.target.closest("#mainNav a");
  if (add) { const id = add.dataset.add; cart[id] = (cart[id] || 0) + 1; saveCart(); renderCart(); showToast("已加入購物車"); openCart(); }
  if (change) { const id = change.dataset.change; cart[id] = Math.max(0, (cart[id] || 0) + Number(change.dataset.delta)); if (!cart[id]) delete cart[id]; saveCart(); renderCart(); }
  if (remove) { delete cart[remove.dataset.remove]; saveCart(); renderCart(); }
  if (navLink) { $("#mainNav")?.classList.remove("open"); $("#menuButton")?.setAttribute("aria-expanded", "false"); }
});

$("#openCart")?.addEventListener("click", openCart);
$("#closeCart")?.addEventListener("click", closeCart);
$("#overlay")?.addEventListener("click", closeCart);
$("#continueShopping")?.addEventListener("click", closeCart);
$("#checkoutButton")?.addEventListener("click", () => showToast("這是展示網站，尚未連接真實付款"));
$("#menuButton")?.addEventListener("click", toggleMenu);
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
$("#newsletterForm")?.addEventListener("submit", event => { event.preventDefault(); $("#formMessage").textContent = "訂閱示範完成（未儲存真實資料）"; event.currentTarget.reset(); });

renderProducts();
renderProductDetail();
renderCart();

const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); }, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
