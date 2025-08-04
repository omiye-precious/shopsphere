const cartContainer = document.getElementById('cart-container');
const cartSummary = document.getElementById('cart-summary');

// Fetch cart from localStorage or initialize
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Render cart
function renderCart() {
  cartContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartSummary.innerHTML = '';
    return;
  }

  cart.forEach(item => {
    total += item.price;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <span>₦${item.price.toLocaleString()}</span>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  cartSummary.innerHTML = `<p>Total: ₦${total.toLocaleString()}</p>`;
}

// Remove item
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Initial load
renderCart();
