// Product data (same as before)
const products = [
  { id: 1, name: "Wireless Headphones", price: 199.99, image: "assets/images/headphones.jpg", description: "High-quality wireless headphones with noise cancellation.", category: "Electronics" },
  { id: 2, name: "Smart Watch", price: 149.99, image: "assets/images/smartwatch.jpg", description: "Track your fitness and stay connected on the go.", category: "Accessories" },
  { id: 3, name: "Gaming Mouse", price: 49.99, image: "assets/images/mouse.jpg", description: "Ergonomic design with customizable buttons and RGB lighting.", category: "Electronics" },
  { id: 4, name: "Laptop Backpack", price: 39.99, image: "assets/images/backpack.jpg", description: "Stylish and durable backpack with laptop compartment.", category: "Bags" },
  { id: 5, name: "Bluetooth Speaker", price: 89.99, image: "assets/images/speaker.jpg", description: "Portable speaker with deep bass and long battery life.", category: "Electronics" },
  { id: 6, name: "Running Shoes", price: 129.99, image: "assets/images/shoes.jpg", description: "Comfortable and breathable running shoes for daily use.", category: "Footwear" },
  { id: 7, name: "Classic Sunglasses", price: 29.99, image: "assets/images/sunglasses.jpg", description: "Timeless design with UV protection.", category: "Accessories" },
  { id: 8, name: "Graphic T-Shirt", price: 19.99, image: "assets/images/tshirt.jpg", description: "Cotton t-shirt with cool prints and a relaxed fit.", category: "Clothing" },
  { id: 9, name: "Fitness Tracker", price: 59.99, image: "assets/images/fitness.jpg", description: "Track your steps, heart rate, and sleep quality.", category: "Health" },
  { id: 10, name: "Mini Drone", price: 299.99, image: "assets/images/drone.jpg", description: "Lightweight drone with HD camera and easy controls.", category: "Gadgets" },
   { id:11, name: "Wireless Headphones", price: 199.99, image: "assets/images/headphones.jpg", description: "High-quality wireless headphones with noise cancellation.", category: "Electronics" },
  { id: 12, name: "Smart Watch", price: 149.99, image: "assets/images/smartwatch.jpg", description: "Track your fitness and stay connected on the go.", category: "Accessories" },
  { id: 13, name: "Gaming Mouse", price: 49.99, image: "assets/images/mouse.jpg", description: "Ergonomic design with customizable buttons and RGB lighting.", category: "Electronics" },
  { id: 14, name: "Laptop Backpack", price: 39.99, image: "assets/images/backpack.jpg", description: "Stylish and durable backpack with laptop compartment.", category: "Bags" },
  { id: 15, name: "Bluetooth Speaker", price: 89.99, image: "assets/images/speaker.jpg", description: "Portable speaker with deep bass and long battery life.", category: "Electronics" },
  { id: 16, name: "Running Shoes", price: 129.99, image: "assets/images/shoes.jpg", description: "Comfortable and breathable running shoes for daily use.", category: "Footwear" },
  { id: 17, name: "Classic Sunglasses", price: 29.99, image: "assets/images/sunglasses.jpg", description: "Timeless design with UV protection.", category: "Accessories" },
  { id: 18, name: "Graphic T-Shirt", price: 19.99, image: "assets/images/tshirt.jpg", description: "Cotton t-shirt with cool prints and a relaxed fit.", category: "Clothing" },
  { id: 19, name: "Fitness Tracker", price: 59.99, image: "assets/images/fitness.jpg", description: "Track your steps, heart rate, and sleep quality.", category: "Health" },
  { id: 20, name: "Mini Drone", price: 299.99, image: "assets/images/drone.jpg", description: "Lightweight drone with HD camera and easy controls.", category: "Gadgets" },
   { id: 21, name: "Wireless Headphones", price: 199.99, image: "assets/images/headphones.jpg", description: "High-quality wireless headphones with noise cancellation.", category: "Electronics" },
  { id: 22, name: "Smart Watch", price: 149.99, image: "assets/images/smartwatch.jpg", description: "Track your fitness and stay connected on the go.", category: "Accessories" },
  { id: 23, name: "Gaming Mouse", price: 49.99, image: "assets/images/mouse.jpg", description: "Ergonomic design with customizable buttons and RGB lighting.", category: "Electronics" },
  { id: 24, name: "Laptop Backpack", price: 39.99, image: "assets/images/backpack.jpg", description: "Stylish and durable backpack with laptop compartment.", category: "Bags" },
  { id: 25, name: "Bluetooth Speaker", price: 89.99, image: "assets/images/speaker.jpg", description: "Portable speaker with deep bass and long battery life.", category: "Electronics" },
  { id: 26, name: "Running Shoes", price: 129.99, image: "assets/images/shoes.jpg", description: "Comfortable and breathable running shoes for daily use.", category: "Footwear" },
  { id: 27, name: "Classic Sunglasses", price: 29.99, image: "assets/images/sunglasses.jpg", description: "Timeless design with UV protection.", category: "Accessories" },
  { id: 28, name: "Graphic T-Shirt", price: 19.99, image: "assets/images/tshirt.jpg", description: "Cotton t-shirt with cool prints and a relaxed fit.", category: "Clothing" },
  { id: 29, name: "Fitness Tracker", price: 59.99, image: "assets/images/fitness.jpg", description: "Track your steps, heart rate, and sleep quality.", category: "Health" },
  { id: 30, name: "Mini Drone", price: 299.99, image: "assets/images/drone.jpg", description: "Lightweight drone with HD camera and easy controls.", category: "Gadgets" },
   { id: 31, name: "Wireless Headphones", price: 199.99, image: "assets/images/headphones.jpg", description: "High-quality wireless headphones with noise cancellation.", category: "Electronics" },
  { id: 32, name: "Smart Watch", price: 149.99, image: "assets/images/smartwatch.jpg", description: "Track your fitness and stay connected on the go.", category: "Accessories" },
  { id: 33, name: "Gaming Mouse", price: 49.99, image: "assets/images/mouse.jpg", description: "Ergonomic design with customizable buttons and RGB lighting.", category: "Electronics" },
  { id: 34, name: "Laptop Backpack", price: 39.99, image: "assets/images/backpack.jpg", description: "Stylish and durable backpack with laptop compartment.", category: "Bags" },
  { id: 35, name: "Bluetooth Speaker", price: 89.99, image: "assets/images/speaker.jpg", description: "Portable speaker with deep bass and long battery life.", category: "Electronics" },
  { id: 36, name: "Running Shoes", price: 129.99, image: "assets/images/shoes.jpg", description: "Comfortable and breathable running shoes for daily use.", category: "Footwear" },
  { id: 37, name: "Classic Sunglasses", price: 29.99, image: "assets/images/sunglasses.jpg", description: "Timeless design with UV protection.", category: "Accessories" },
  { id: 38, name: "Graphic T-Shirt", price: 19.99, image: "assets/images/tshirt.jpg", description: "Cotton t-shirt with cool prints and a relaxed fit.", category: "Clothing" },
  { id: 39, name: "Fitness Tracker", price: 59.99, image: "assets/images/fitness.jpg", description: "Track your steps, heart rate, and sleep quality.", category: "Health" },
  { id: 40, name: "Mini Drone", price: 299.99, image: "assets/images/drone.jpg", description: "Lightweight drone with HD camera and easy controls.", category: "Gadgets" },
];

const container = document.getElementById("all-products");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

// Main render function for products
function renderProducts(filteredProducts) {
  // Clear content
  container.innerHTML = '';

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="not-found">
        <p>No items found. Try a different search.</p>
      </div>
    `;
    return;
  }

  // Render all matched products
  container.innerHTML = filteredProducts.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₦${product.price.toLocaleString()}</p>
      <a href="product-details.html?id=${product.id}" class="btn">View</a>
    </div>
  `).join('');
}

// Featured section (e.g. homepage)
const featuredContainer = document.getElementById('featured-products');

function renderFeaturedProducts() {
  const featured = products.slice(0, 4); // Change slice if you want fewer/more
  featuredContainer.innerHTML = '';

  featured.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₦${product.price.toLocaleString()}</p>
      <a href="pages/product-details.html?id=${product.id}" class="btn">View</a>
    `;
    featuredContainer.appendChild(div);
  });
}

// Apply on page load
document.addEventListener('DOMContentLoaded', () => {
  if (featuredContainer) renderFeaturedProducts();
});

// Filtering logic
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  renderProducts(filtered);
}

// Hook search and filter on DOM load
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  searchInput.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);
});
