const defaultProducts = [
  { id: 1, name: "Headphone", price: 199.99, image: "headphone.jpg", description: "High-quality wireless headphones with noise cancellation.", category: "Electronics" },
  { id: 2, name: "Smart Watch", price: 149.99, image: "watch.jpg", description: "Track your fitness and stay connected on the go.", category: "Accessories" },
  { id: 3, name: "Mouse", price: 49.99, image: "mouse.jpg", description: "Ergonomic design with customizable buttons and RGB lighting.", category: "Electronics" },
  { id: 4, name: "Backpack", price: 39.99, image: "backpack.jpg", description: "Stylish and durable backpack with laptop compartment.", category: "Bags" },
  { id: 5, name: "Speaker", price: 89.99, image: "speaker.jpg", description: "Portable speaker with deep bass and long battery life.", category: "Electronics" },
  { id: 6, name: "Shoes", price: 129.99, image: "shoe.jpg", description: "Comfortable and breathable running shoes for daily use.", category: "Footwear" },
  { id: 7, name: "Sunglasses", price: 29.99, image: "sunglasses.jpg", description: "Timeless design with UV protection.", category: "Accessories" },
  { id: 8, name: "T-Shirt", price: 19.99, image: "shirt.jpg", description: "Cotton t-shirt with cool prints and a relaxed fit.", category: "Clothing" },
  { id: 9, name: "Fit Tracker", price: 59.99, image: "fitness.jpg", description: "Track your steps, heart rate, and sleep quality.", category: "Health" },
  { id: 10, name: "Mini Drone", price: 299.99, image: "drone.jpg", description: "Lightweight drone with HD camera and easy controls.", category: "Gadgets" }
];

function getAllProducts() {
  const adminProducts = JSON.parse(localStorage.getItem("products")) || [];
  return [...defaultProducts, ...adminProducts];
}

let products = getAllProducts();

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  alert(`${product.name} added to cart.`);
}


const container = document.getElementById("all-products");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const featuredContainer = document.getElementById("featured-products");

function renderProducts(filteredProducts) {
  if (!container) return;

  container.innerHTML = '';

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="not-found">
        <p>No items found. Try a different search.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredProducts.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₦${product.price.toLocaleString()}</p>
      <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    </div>
  `).join('');

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      addToCart(id);
    });
  });
}

function renderFeaturedProducts() {
  if (!featuredContainer) return;
  const featured = products.slice(0, 4);

  featuredContainer.innerHTML = featured.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₦${product.price.toLocaleString()}</p>
      <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    </div>
  `).join('');

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      addToCart(id);
    });
  });
}

function filterProducts() {
  const searchTerm = searchInput?.value.toLowerCase() || '';
  const selectedCategory = categoryFilter?.value || 'all';

  const filtered = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  renderProducts(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  products = getAllProducts();
  if (featuredContainer) renderFeaturedProducts();
  if (container) renderProducts(products);
  if (searchInput) searchInput.addEventListener("input", filterProducts);
  if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);

  window.addEventListener("storage", () => {
    products = getAllProducts();
    filterProducts();
    renderFeaturedProducts();
  });

  const adminLink = document.getElementById("admin-link");
  const loginRegister = document.getElementById("login-register");
  const profileIcon = document.getElementById("profile-icon");

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (user) {
    if (profileIcon) {
      profileIcon.style.display = "inline-block";
      profileIcon.style.cursor = "pointer";
      profileIcon.addEventListener("click", () => {
        window.location.href = "profile.html";
      });
    }
    if (loginRegister) loginRegister.style.display = "none";
    if (adminLink) {
      adminLink.style.display = (user.role === "admin") ? "inline-block" : "none";
    }
  } else {
    if (loginRegister) loginRegister.style.display = "inline-block";
    if (profileIcon) profileIcon.style.display = "none";
    if (adminLink) adminLink.style.display = "none";
  }
});