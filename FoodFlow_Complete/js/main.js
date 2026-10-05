(() => {
  const CART_KEY = "foodflowCart";
  const ORDERS_KEY = "foodflowOrders";

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }
  function updateCartCount() {
    const count = getCart().reduce((s, i) => s + Number(i.qty || 0), 0);
    document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
  }
  function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id && i.restaurantId === item.restaurantId);
    if (existing) existing.qty += item.qty || 1;
    else cart.push({...item, qty: item.qty || 1});
    saveCart(cart);
    showNotification(`${item.name} added to cart`);
  }
  function removeFromCart(id, restaurantId) {
    saveCart(getCart().filter(i => !(i.id === id && i.restaurantId === restaurantId)));
  }
  function changeQty(id, restaurantId, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id && i.restaurantId === restaurantId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id, restaurantId);
    else saveCart(cart);
  }
  function clearCart() { saveCart([]); }
  function showNotification(message) {
    let n = document.getElementById("ffNotification");
    if (!n) {
      n = document.createElement("div");
      n.id = "ffNotification";
      n.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:9999;background:#17202a;color:#fff;padding:13px 16px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18);opacity:0;transform:translateY(8px);transition:.2s";
      document.body.appendChild(n);
    }
    n.textContent = message;
    requestAnimationFrame(() => { n.style.opacity = "1"; n.style.transform = "translateY(0)"; });
    clearTimeout(window.__ffTimer);
    window.__ffTimer = setTimeout(() => { n.style.opacity = "0"; n.style.transform = "translateY(8px)"; }, 2200);
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    document.querySelector(".menu-toggle")?.addEventListener("click", () => {
      document.querySelector(".nav-links")?.classList.toggle("open");
    });

    document.querySelectorAll(".category-card").forEach(btn => {
      btn.addEventListener("click", () => {
        location.href = `pages/restaurants.html?category=${encodeURIComponent(btn.dataset.category)}`;
      });
    });

    document.getElementById("homeSearchBtn")?.addEventListener("click", doHomeSearch);
    document.getElementById("homeSearch")?.addEventListener("keydown", e => {
      if (e.key === "Enter") doHomeSearch();
    });

    document.querySelectorAll('a[href="pages/orders.html"]').forEach(a => {
      a.addEventListener("click", e => {
        if (!localStorage.getItem("foodflowCurrentUser")) {
          e.preventDefault();
          location.href = "pages/login.html?redirect=orders";
        }
      });
    });
  });

  function doHomeSearch() {
    const q = (document.getElementById("homeSearch")?.value || "").trim();
    location.href = q ? `pages/restaurants.html?search=${encodeURIComponent(q)}` : "pages/restaurants.html";
  }

  window.FoodFlow = { getCart, saveCart, addToCart, removeFromCart, changeQty, clearCart, updateCartCount, showNotification };
})();
