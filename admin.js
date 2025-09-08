
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || currentUser.role !== "admin") {
    alert("Access denied. Admins only!");
    window.location.href = "login.html";
    return;
  }
});

const btnAdd = document.getElementById('btn-add');
const btnLogout = document.getElementById('btn-logout');
const btnHome = document.getElementById('btn-home');
const productsGrid = document.getElementById('products-grid');
const noProductsEl = document.getElementById('no-products');

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');

const productForm = document.getElementById('product-form');
const pId = document.getElementById('p-id');
const pName = document.getElementById('p-name');
const pPrice = document.getElementById('p-price');
const pCategory = document.getElementById('p-category');
const pDesc = document.getElementById('p-desc');
const pImage = document.getElementById('p-image');

const previewWrap = document.getElementById('preview-wrap');
const previewImg = document.getElementById('preview-img');
const clearImageBtn = document.getElementById('clear-image');

const saveBtn = document.getElementById('save-product');
const deleteBtn = document.getElementById('delete-product');

const FALLBACK_DEFAULTS = [
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

const DEFAULT_IDS = new Set(FALLBACK_DEFAULTS.map(p => String(p.id)));

function loadAdminProducts() {
  try {
    const raw = localStorage.getItem('products');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveAdminProducts(arr) {
  localStorage.setItem('products', JSON.stringify(arr));
  try { localStorage.setItem('products_updated_at', Date.now()); } catch {}
}

function getAllProductsMerged() {
  let defaults = FALLBACK_DEFAULTS;
  if (typeof defaultProducts !== 'undefined' && Array.isArray(defaultProducts)) {
    defaults = defaultProducts;
  }

  const map = new Map();
  defaults.forEach(d => map.set(String(d.id), { ...d }));

  const adminArr = loadAdminProducts();
  adminArr.forEach(a => {
    const id = String(a.id);
    if (a._deleted) {
      map.delete(id);
      return;
    }
    map.set(id, { ...map.get(id), ...a });
  });

  const result = [];
  const added = new Set();

  defaults.forEach(d => {
    const id = String(d.id);
    if (map.has(id)) {
      result.push(map.get(id));
      added.add(id);
    }
  });
  for (const [id, val] of map.entries()) {
    if (!added.has(id)) result.push(val);
  }

  return result;
}

function escapeHtml(s){ if (s===null||s===undefined) return ''; return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
function formatNGN(n){ const v = Number(n) || 0; return `₦${Math.round(v).toLocaleString()}`; }

function fileToDataUrl(file){
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(new Error('file-read-failed'));
    r.readAsDataURL(file);
  });
}

function renderProducts() {
  const all = getAllProductsMerged();
  const q = (searchInput?.value || '').toLowerCase();
  const cat = (categoryFilter?.value || 'all').toLowerCase();

  const filtered = all.filter(p => {
    const matchesQ = !q || (p.name||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q);
    const matchesCat = cat === 'all' || ((p.category||'').toLowerCase() === cat);
    return matchesQ && matchesCat;
  });

  productsGrid.innerHTML = '';
  if (!filtered.length) {
    noProductsEl.hidden = false;
    return;
  }
  noProductsEl.hidden = true;

  filtered.forEach(p => {
    const imgSrc = p.image || 'placeholder.png';
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(p.name||'Product')}" />
      <h3>${escapeHtml(p.name||'Untitled')}</h3>
      <p class="meta">${formatNGN(p.price||0)} <span style="color:#666;font-weight:400">• ${escapeHtml(p.category||'—')}</span></p>
      <p style="color:#666; font-size:.82rem; min-height:36px;">${escapeHtml((p.description||'').slice(0,140))}</p>
      <div class="card-actions" style="margin-top:auto; display:flex; gap:.4rem; justify-content:flex-end;">
        <button class="btn ghost edit-btn" data-id="${p.id}">Edit</button>
        <button class="btn outline delete-btn" data-id="${p.id}">Delete</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  productsGrid.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', (e) => {
    openEditModal(e.target.dataset.id);
  }));
  productsGrid.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    removeProductById(id);
  }));
}

function addAdminProduct(prod) {
  const arr = loadAdminProducts();
  arr.push(prod);
  saveAdminProducts(arr);
  renderProducts();
}

function updateAdminProductById(id, updated) {
  const arr = loadAdminProducts();
  const idx = arr.findIndex(x => String(x.id) === String(id));
  if (idx !== -1) {
    arr[idx] = { ...arr[idx], ...updated };
    saveAdminProducts(arr);
    renderProducts();
    return true;
  }
  const override = { id, ...updated };
  arr.push(override);
  saveAdminProducts(arr);
  renderProducts();
  return true;
}

function removeProductById(id) {
  const arr = loadAdminProducts();
  const idx = arr.findIndex(x => String(x.id) === String(id));
  if (idx !== -1) {
    if (!arr[idx]._deleted) {
      arr.splice(idx, 1);
      saveAdminProducts(arr);
      renderProducts();
      alert('Product removed.');
      return;
    }
  }

  if (DEFAULT_IDS.has(String(id))) {
    if (!confirm('This is a default product. Deleting will hide it from the store. Continue?')) return;
    arr.push({ id, _deleted: true });
    saveAdminProducts(arr);
    renderProducts();
    alert('Default product hidden.');
    return;
  }

  alert('Product not found.');
}
function openAddModal() {
  pId.value = '';
  modalTitle.textContent = 'Add product';
  productForm.reset();
  previewImg.src = '';
  previewWrap.hidden = true;
  deleteBtn.classList.add('hidden');
  showModal();
}

async function openEditModal(id) {
  const adminArr = loadAdminProducts();
  let p = adminArr.find(x => String(x.id) === String(id) && !x._deleted);
  if (!p) {
    const allDefaults = (typeof defaultProducts !== 'undefined' && Array.isArray(defaultProducts)) ? defaultProducts : FALLBACK_DEFAULTS;
    p = allDefaults.find(x => String(x.id) === String(id));
  }
  if (!p) { alert('Product not found.'); return; }

  pId.value = p.id;
  pName.value = p.name || '';
  pPrice.value = p.price || '';
  pCategory.value = p.category || '';
  pDesc.value = p.description || '';
  if (p.image) {
    previewImg.src = p.image;
    previewWrap.hidden = false;
  } else {
    previewImg.src = '';
    previewWrap.hidden = true;
  }
  deleteBtn.classList.remove('hidden');
  modalTitle.textContent = 'Edit product';
  showModal();
}

function showModal() {
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(() => pName.focus(), 60);
}
function closeModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  productForm.reset();
  pId.value = '';
  previewImg.src = '';
  previewWrap.hidden = true;
  deleteBtn.classList.add('hidden');
}

productForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const name = pName.value.trim();
  const price = Number(pPrice.value) || 0;
  const category = pCategory.value.trim() || 'Uncategorized';
  const description = pDesc.value.trim() || '';

  if (!name) { alert('Name required'); pName.focus(); return; }

  let imageData = '';
  if (pImage.files && pImage.files[0]) {
    try {
      imageData = await fileToDataUrl(pImage.files[0]);
    } catch (err) {
      console.error(err);
      alert('Failed reading image file.');
      return;
    }
  } else if (!previewWrap.hidden && previewImg.src) {
    imageData = previewImg.src;
  } else {
    imageData = '';
  }

  if (pId.value) {
    const ok = updateAdminProductById(pId.value, { name, price, category, description, image: imageData });
    if (ok) alert('Product updated.');
  } else {
    const newProd = {
      id: Date.now(),
      name, price, category, description, image: imageData
    };
    addAdminProduct(newProd);
    alert('Product added.');
  }

  closeModal();
});

deleteBtn.addEventListener('click', () => {
  const id = pId.value;
  if (!id) return;
  if (!confirm('Delete this product?')) return;
  removeProductById(id);
  closeModal();
});

pImage.addEventListener('change', async () => {
  const f = pImage.files[0];
  if (!f) return;
  try {
    const d = await fileToDataUrl(f);
    previewImg.src = d;
    previewWrap.hidden = false;
  } catch {
    alert('Unable to preview image.');
  }
});
clearImageBtn.addEventListener('click', () => {
  pImage.value = '';
  previewImg.src = '';
  previewWrap.hidden = true;
});

modalClose.addEventListener('click', closeModal);

searchInput?.addEventListener('input', renderProducts);
categoryFilter?.addEventListener('change', renderProducts);

btnAdd?.addEventListener('click', openAddModal);
btnLogout?.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
});
btnHome?.addEventListener('click', (e) => {
  window.location.href = 'products.html';
});

window.addEventListener('storage', (e) => {
  if (!e.key) return;
  if (e.key === 'products' || e.key === 'products_updated_at' || e.key === 'defaultProducts') {
    renderProducts();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();

});
