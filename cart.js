
const cartContainer = document.getElementById('cart-container');
const cartSummary = document.getElementById('cart-summary');
const checkoutBtn = document.getElementById('checkout-btn');

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('currentUser')) || null; }
  catch { return null; }
}
function getCurrentUserId() {
  return getCurrentUser()?.id || null;
}
function getCartKey() {
  const userId = getCurrentUserId();
  return userId ? `cart_${userId}` : 'cart';
}
function loadCart() {
  const raw = localStorage.getItem(getCartKey());
  return raw ? JSON.parse(raw) : [];
}
function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
  localStorage.setItem(getCartKey() + '_updated_at', Date.now());
}

let cart = loadCart();

function renderCart() {
  cartContainer.innerHTML = '';
  cartSummary.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.setAttribute('data-id', item.id);
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <span>₦${subtotal.toLocaleString()} (${item.quantity} × ₦${item.price.toLocaleString()})</span>
        <div class="quantity-control">
          <button onclick="updateQuantity(${item.id}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  cartSummary.innerHTML = `
    <p>Total: ₦${total.toLocaleString()}</p>
    <button onclick="clearCart()" style="background-color:#ff4d4d;color:#fff;border:none;padding:0.5rem 0.8rem;border-radius:4px;margin-top:1rem;cursor:pointer;">Clear Cart</button>
  `;

  if (checkoutBtn) checkoutBtn.disabled = false;
}

function updateQuantity(id, amount) {
  cart = cart.map(item => {
    if (item.id === id) {
      let newQty = item.quantity + amount;
      if (newQty <= 0) newQty = 1;
      if (newQty > item.stock) { alert(`Only ${item.stock} in stock`); newQty = item.quantity; }
      return { ...item, quantity: newQty };
    }
    return item;
  });
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  if (confirm("Remove this item from your cart?")) {
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
  }
}

function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    cart = [];
    saveCart(cart);
    renderCart();
  }
}

checkoutBtn?.addEventListener('click', e => {
  e.preventDefault?.();

  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before checking out.");
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    const returnTo = encodeURIComponent('checkout.html');
    window.location.href = `login.html?returnTo=${returnTo}`;
    return;
  }

  window.location.href = 'checkout.html';
});

renderCart();