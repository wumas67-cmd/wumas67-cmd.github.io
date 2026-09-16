const products = [
  { id: 1, name: "藥師佛藥香2H", type: "MEDICINE BUDDHA INCENSE", note: "古藥房的藥香味道・2H盤香", price: 350, badge: "藥師香", bg: "#e8e1d1", box: "#eee9dc", ink: "#26362e", url: "product.html?id=1", image: "images/medicine-buddha-incense.jpg?v=20260916-7" },
  { id: 2, name: "月白檀香", type: "CALMING INCENSE", note: "老山檀・柔和奶香・溫潤", price: 520, badge: "初次推薦", bg: "#dad6c8", box: "#f7f2e6", ink: "#7b4a37" },
  { id: 3, name: "山嵐肖楠", type: "FOREST INCENSE", note: "肖楠・森林苔蘚・清冽", price: 580, badge: "台灣香材", bg: "#abb2a1", box: "#d8d8c8", ink: "#23382e" }
];

let cart = JSON.parse(localStorage.getItem("incense-demo-cart") || "{}");
const $ = (selector) => document.querySelector(selector);
const productGrid = $("#productGrid");

const money = (value) => `NT$${value.toLocaleString("zh-TW")}`;

if (productGrid) productGrid.innerHTML = products.map(product => `
  <article class="product-card reveal">
    <div class="product-visual" style="--product-bg:${product.bg};--product-box:${product.box};--product-ink:${product.ink}">
      <span class="product-badge">${product.badge}</span>
      <div class="product-box">${product.name}</div>
    </div>
    <div class="product-info">
      <span class="product-meta">${product.type}</span>
      <h3>${product.name}</h3>
      <p>${product.note}<br>20公分線香・約30支</p>
      <div class="product-footer">
        <strong>${money(product.price)}</strong>
        <button class="add-button" type="button" data-add="${product.id}" aria-label="將${product.name}加入購物車">＋</button>
      </div>
    </div>
  </article>
`).join("");

const saveCart = () => localStorage.setItem("incense-demo-cart", JSON.stringify(cart));

function renderCart() {
  const entries = Object.entries(cart).filter(([id, quantity]) => quantity > 0 && products.some(item => item.id === Number(id)));
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  $("#cartCount").textContent = count;
  $("#cartEmpty").hidden = entries.length > 0;
  $("#cartSummary").hidden = entries.length === 0;

  $("#cartItems").innerHTML = entries.map(([id, quantity]) => {
    const product = products.find(item => item.id === Number(id));
    const productUrl = product.url || `index.html#products`;
    const thumbnail = product.image
      ? `<img src="${product.image}" alt="${product.name}">`
      : product.name.slice(0, 2);
    return `<div class="cart-item">
      <a class="cart-thumb" href="${productUrl}" aria-label="查看${product.name}商品頁">${thumbnail}</a>
      <div><h3><a href="${productUrl}">${product.name}</a></h3><p>${money(product.price)}</p>
        <div class="quantity"><button data-change="${id}" data-delta="-1" aria-label="減少數量">−</button><span>${quantity}</span><button data-change="${id}" data-delta="1" aria-label="增加數量">＋</button></div>
      </div>
      <button class="remove-item" data-remove="${id}">移除</button>
    </div>`;
  }).join("");

  const total = entries.reduce((sum, [id, quantity]) => sum + products.find(item => item.id === Number(id)).price * quantity, 0);
  $("#cartTotal").textContent = money(total);
}

function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  $("#overlay").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  $("#overlay").hidden = true;
  document.body.style.overflow = "";
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const change = event.target.closest("[data-change]");
  const remove = event.target.closest("[data-remove]");
  if (add) {
    const id = add.dataset.add;
    cart[id] = (cart[id] || 0) + 1;
    saveCart(); renderCart();
    showToast("已加入購物袋");
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
});

$("#openCart")?.addEventListener("click", openCart);
$("#closeCart")?.addEventListener("click", closeCart);
$("#overlay")?.addEventListener("click", closeCart);
$("#continueShopping")?.addEventListener("click", closeCart);
$("#checkoutButton")?.addEventListener("click", () => showToast("這是展示網站，未連接真實付款"));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });

$("#newsletterForm")?.addEventListener("submit", event => {
  event.preventDefault();
  $("#formMessage").textContent = "訂閱示範完成（未儲存真實資料）";
  event.currentTarget.reset();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

renderCart();
