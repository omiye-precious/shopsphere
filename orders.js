const $ = id => document.getElementById(id);


const ordersListEl = $('orders-list');
const noOrdersEl = $('no-orders');
const yearEl = document.getElementById('year');

function formatNGN(n) {
  const v = Number(n) || 0;
  return `₦${Math.round(v).toLocaleString()}`;
}
function formatDate(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch { return ''; }
}
function getCurrentUserId() {
  try {
    const u = JSON.parse(localStorage.getItem('currentUser'));
    return u?.id || null;
  } catch { return null; }
}
function loadOrdersArr() {
  try {
    const raw = localStorage.getItem('orders');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveCartForUser(userId, cartArr) {
  const key = userId ? `cart_${userId}` : 'cart';
  localStorage.setItem(key, JSON.stringify(cartArr));
  localStorage.setItem(key + '_updated_at', Date.now());
}
function loadCartForUser(userId) {
  const key = userId ? `cart_${userId}` : 'cart';
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}

function renderOrders() {
  const all = loadOrdersArr();
  const uid = getCurrentUserId();
  let orders = all || [];
  if (uid) {
    orders = orders.filter(o => o.userId === uid);
  }

  orders.sort((a,b) => (b.placedAt || 0) - (a.placedAt || 0));

  ordersListEl.innerHTML = '';

  if (!orders.length) {
    noOrdersEl.hidden = false;
    return;
  }
  noOrdersEl.hidden = true;

  orders.forEach(order => {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <div class="order-head">
        <div class="order-meta">
          <div class="order-id">Order: <span class="id-val">${escapeHtml(order.orderId || '—')}</span></div>
          <div class="order-date muted"><span class="muted">${formatDate(order.placedAt)}</></div>
        </div>
        <div class="order-main" style="display:flex; align-items:center; gap:12px;">
          <div class="order-total">${formatNGN(order.total)}</div>
          <div class="order-actions">
            <button class="btn small view-btn">View</button>
            <button class="btn small reorder-btn">Reorder</button>
          </div>
        </div>
      </div>

      <div class="order-body" aria-hidden="true">
        <div class="items-list"></div>

        <div class="invoice-summary">
          <div class="inv-row"><span>Subtotal</span><span class="inv-subtotal">${formatNGN(order.subtotal)}</span></div>
          <div class="inv-row"><span>Shipping</span><span class="inv-shipping">${formatNGN(order.shipping)}</span></div>
          <div class="inv-row"><span>Tax</span><span class="inv-tax">${formatNGN(order.tax)}</span></div>
          <div class="inv-row total"><span>Total</span><span class="inv-total">${formatNGN(order.total)}</span></div>
        </div>

        <div style="margin-top:8px;">
          <div class="card-note"><strong>Shipping:</strong> <span class="ship-addr"></span></div>
          <div class="card-note"><strong>Payment:</strong> <span class="pay-method"></span></div>
        </div>

        <div class="card-foot">
          <div class="card-note muted">Status: <strong class="status-val">${escapeHtml(order.status || '')}</strong></div>
          <div style="display:flex; gap:8px;">
            <button class="btn small print-btn">Print</button>
            <button class="btn small close-btn">Close</button>
          </div>
        </div>
      </div>
    `;

    const itemsList = card.querySelector('.items-list');
    (order.items || []).forEach(it => {
      const itEl = document.createElement('div');
      itEl.className = 'item-row';
      itEl.innerHTML = `
        <img src="${escapeHtml(it.image || '')}" alt="${escapeHtml(it.name || '')}" />
        <div class="item-meta">
          <h4>${escapeHtml(it.name || 'Item')}</h4>
          <p class="muted">${escapeHtml(it.quantity + ' × ₦' + Number(it.price || 0).toLocaleString())}</p>
        </div>
        <div class="item-price">${formatNGN(Number(it.price || 0) * Number(it.quantity || 1))}</div>
      `;
      itemsList.appendChild(itEl);
    });

    const shipEl = card.querySelector('.ship-addr');
    const payEl = card.querySelector('.pay-method');
    const addr = order.shippingAddress || {};
    const stateLabel = (addr.state ? addr.state : '') + (addr.city ? ', ' + addr.city : '') + (addr.lga ? ', ' + addr.lga : '');
    shipEl.textContent = stateLabel || '—';
    payEl.textContent = (order.paymentMethod || '—').toUpperCase();

    const viewBtn = card.querySelector('.view-btn');
    const closeBtn = card.querySelector('.close-btn');
    const printBtn = card.querySelector('.print-btn');
    const reorderBtn = card.querySelector('.reorder-btn');
    const body = card.querySelector('.order-body');

    viewBtn.addEventListener('click', () => {
      const open = body.classList.toggle('open');
      body.setAttribute('aria-hidden', !open);
      viewBtn.textContent = open ? 'Hide' : 'View';
      if (open) {
        body.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
    closeBtn.addEventListener('click', () => {
      body.classList.remove('open');
      body.setAttribute('aria-hidden', 'true');
      viewBtn.textContent = 'View';
    });

    printBtn.addEventListener('click', () => {
      printOrder(order);
    });

    reorderBtn.addEventListener('click', () => {
      reorder(order);
    });

    ordersListEl.appendChild(card);
  });
}

function printOrder(order) {
  const w = window.open('', '_blank', 'width=800,height=900');
  if (!w) { alert('Popup blocked. Allow popups to print invoice.'); return; }
  const itemsHtml = (order.items || []).map(it => `
    <tr>
      <td style="padding:6px;border-bottom:1px solid #eee">${escapeHtml(it.name)}</td>
      <td style="padding:6px;border-bottom:1px solid #eee;text-align:center">${it.quantity}</td>
      <td style="padding:6px;border-bottom:1px solid #eee;text-align:right">${formatNGN(it.price)}</td>
      <td style="padding:6px;border-bottom:1px solid #eee;text-align:right">${formatNGN(Number(it.price) * Number(it.quantity))}</td>
    </tr>
  `).join('');

  const html = `
    <html><head><title>Invoice ${escapeHtml(order.orderId)}</title>
      <style>
        body{ font-family: Arial, Helvetica, sans-serif; color:#111; padding:20px }
        h1{ font-size:18px }
        table{ width:100%; border-collapse:collapse; margin-top:12px }
        th{text-align:left;padding:8px;border-bottom:1px solid #ddd}
      </style>
    </head><body>
      <h1>Invoice — ${escapeHtml(order.orderId)}</h1>
      <div>Placed: ${formatDate(order.placedAt)}</div>
      <div style="margin-top:10px">
        <table>
          <thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      </div>
      <div style="margin-top:12px">
        <div>Subtotal: ${formatNGN(order.subtotal)}</div>
        <div>Shipping: ${formatNGN(order.shipping)}</div>
        <div>Tax: ${formatNGN(order.tax)}</div>
        <div style="font-weight:800;margin-top:6px">Total: ${formatNGN(order.total)}</div>
      </div>
      <script>window.print();</script>
    </body></html>
  `;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

function reorder(order) {
  const uid = getCurrentUserId();
  let cart = loadCartForUser(uid);
  const items = order.items || [];
  items.forEach(it => {
    const existing = cart.find(c => c.id === it.id);
    if (existing) existing.quantity = Number(existing.quantity || 0) + Number(it.quantity || 0);
    else cart.push({ ...it });
  });
  saveCartForUser(uid, cart);
  alert('Items added to cart. Redirecting to cart...');
  window.location.href = 'cart.html';
}

function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'", '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  const now = new Date().getFullYear();
  if (yearEl) yearEl.textContent = now;
  renderOrders();
});