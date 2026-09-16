const products = [
  { id: 1, name: "雲水沉香", type: "DAILY INCENSE", note: "沉香・雪松・微甜木質", description: "沉穩但不厚重，適合茶席、靜坐與夜晚放鬆。", price: 680, badge: "人氣選物", bg: "#c9c2ae", box: "#eee9dc", ink: "#26362e" },
  { id: 2, name: "月白檀香", type: "CALMING INCENSE", note: "老山檀・柔和奶香・溫潤", description: "香氣柔和圓潤，適合閱讀、工作與初次接觸木質香氣的人。", price: 520, badge: "初次推薦", bg: "#dad6c8", box: "#f7f2e6", ink: "#7b4a37" },
  { id: 3, name: "山嵐肖楠", type: "FOREST INCENSE", note: "肖楠・森林苔蘚・清冽", description: "帶有清楚的森林氣息與木質感，適合雨天、夜晚與想轉換空間氛圍時。", price: 580, badge: "台灣香材", bg: "#abb2a1", box: "#d8d8c8", ink: "#23382e" }
];

const FREE_SHIPPING = 1200;
let cart = JSON.parse(localStorage.getItem("incense-demo-cart") || "{}");
const $ = selector => document.querySelector(selector);
const money = value => `NT$${value.toLocaleString("zh-TW")}`;
const saveCart = () => localStorage.setItem("incense-demo-cart", JSON.stringify(cart));

function productVisual(product, compact = false) {
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
          <p>${product.note}<br>20公分線香・約30支</p>
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
  mount.innerHTML = `
    <div class="detail-visual">${productVisual(product, true)}</div>
    <div class="detail-copy">
      <p class="eyebrow">${product.type}</p>
      <p class="detail-breadcrumb"><a href="index.html">首頁</a> / <a href="index.html#products">香品選物</a> / ${product.name}</p>
      <h1>${product.name}</h1>
      <p class="detail-note-line">${product.note}</p>
      <p class="detail-description">${product.description}</p>
      <ul class="detail-list"><li>規格：20 公分線香，約 30 支</li><li>建議：保持室內通風，每次依空間大小適量使用</li><li>保存：密封、乾燥、避免陽光直射</li></ul>
      <div class="detail-buy"><strong>${money(product.price)}</strong><button type="button" data-add="${product.id}">加入購物車</button></div>
      <p class="detail-demo">目前為展示網站，購物車不會建立真實訂單或付款。</p>
    </div>`;
}

function cartEntries() {
  return Object.entries(cart).filter(([, quantity]) => quantity > 0);
}

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
      return `<div class="cart-item">
        <div class="cart-thumb">${product.name.slice(0, 2)}</div>
        <div><h3>${product.name}</h3><p>${money(product.price)}</p>
          <div class="quantity"><button data-change="${id}" data-delta="-1" aria-label="減少${product.name}數量">−</button><span>${quantity}</span><button data-change="${id}" data-delta="1" aria-label="增加${product.name}數量">＋</button></div>
        </div>
        <button class="remove-item" data-remove="${id}" aria-label="移除${product.name}">移除</button>
      </div>`;
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
  const drawer = $("#cartDrawer");
  const overlay = $("#overlay");
  if (!drawer || !overlay) return;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCart() {
  const drawer = $("#cartDrawer");
  const overlay = $("#overlay");
  if (!drawer || !overlay) return;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.body.style.overflow = "";
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function toggleMenu() {
  const button = $("#menuButton");
  const nav = $("#mainNav");
  if (!button || !nav) return;
  const open = nav.classList.toggle("open");
  button.setAttribute("aria-expanded", String(open));
}

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const change = event.target.closest("[data-change]");
  const remove = event.target.closest("[data-remove]");
  const navLink = event.target.closest("#mainNav a");

  if (add) {
    const id = add.dataset.add;
    cart[id] = (cart[id] || 0) + 1;
    saveCart(); renderCart(); showToast("已加入購物車"); openCart();
  }
  if (change) {
    const id = change.dataset.change;
    cart[id] = Math.max(0, (cart[id] || 0) + Number(change.dataset.delta));
    if (!cart[id]) delete cart[id];
    saveCart(); renderCart();
  }
  if (remove) {
    delete cart[remove.dataset.remove];
    saveCart(); renderCart();
  }
  if (navLink) {
    const nav = $("#mainNav");
    const button = $("#menuButton");
    nav?.classList.remove("open");
    button?.setAttribute("aria-expanded", "false");
  }
});

$("#openCart")?.addEventListener("click", openCart);
$("#closeCart")?.addEventListener("click", closeCart);
$("#overlay")?.addEventListener("click", closeCart);
$("#continueShopping")?.addEventListener("click", closeCart);
$("#checkoutButton")?.addEventListener("click", () => showToast("這是展示網站，尚未連接真實付款"));
$("#menuButton")?.addEventListener("click", toggleMenu);
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });

$("#newsletterForm")?.addEventListener("submit", event => {
  event.preventDefault();
  $("#formMessage").textContent = "訂閱示範完成（未儲存真實資料）";
  event.currentTarget.reset();
});

renderProducts();
renderProductDetail();
renderCart();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
