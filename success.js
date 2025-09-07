const $ = id => document.getElementById(id);

const orderIdEl = $('order-id');
const placedAtEl = $('placed-at');
const orderSummaryEl = $('order-summary');
const summarySubtotalEl = $('summary-subtotal');
const summaryShippingEl = $('summary-shipping');
const summaryTaxEl = $('summary-tax');
const summaryTotalEl = $('summary-total');
const addressContentEl = $('address-content');
const paymentMethodEl = $('payment-method');
const orderStatusEl = $('order-status');
const yearEl = $('year');

const continueBtn = $('continue-shopping');
const viewOrdersBtn = $('view-orders');
const printBtn = $('print-invoice');

function formatNGN(n) {
  const v = Number(n) || 0;
  return `₦${Math.round(v).toLocaleString()}`;
}
function safe(v, fallback='—'){ return (v === null || v === undefined || v === '') ? fallback : v; }

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

const STATE_LABELS = { oyo: 'Oyo', ondo: 'Ondo', lagos: 'Lagos' };

function getLatestOrder() {
  const uid = getCurrentUserId();
  const orders = loadOrdersArr();
  if (!orders || orders.length === 0) return null;

  let userOrders = orders;
  if (uid) {
    userOrders = orders.filter(o => o.userId === uid);
    if (!userOrders.length) userOrders = orders;
  }

  userOrders.sort((a,b) => (b.placedAt || 0) - (a.placedAt || 0));
  return userOrders[0] || null;
}


function renderItems(items = []) {
  orderSummaryEl.innerHTML = '';
  if (!Array.isArray(items) || items.length === 0) {
    orderSummaryEl.innerHTML = '<p>No items in this order.</p>';
    return;
  }

  items.forEach(it => {
    const row = document.createElement('div');
    row.className = 'summary-item';
    row.innerHTML = `
      <img src="${safe(it.image, '')}" alt="${escapeHtml(safe(it.name,'Item'))}" />
      <div style="flex:1;">
        <h4>${escapeHtml(safe(it.name,'Item'))}</h4>
        <p>${formatNGN(it.price)} × ${it.quantity}</p>
      </div>
      <div><strong>${formatNGN(it.price * it.quantity)}</strong></div>
    `;
    orderSummaryEl.appendChild(row);
  });
}

function renderAddress(addr = {}) {
  if (!addr || (!addr.state && !addr.city && !addr.lga)) {
    addressContentEl.textContent = '—';
    return;
  }
  const stateLabel = STATE_LABELS[addr.state] || addr.state || '';
  addressContentEl.innerHTML = `
    <div style="font-size:.95rem;">
      <div>${escapeHtml(stateLabel)}</div>
      <div>${escapeHtml(addr.city || '')}${addr.city ? ', ' : ''}${escapeHtml(addr.lga || '')}</div>
    </div>
  `;
}

function renderTotals(order) {
  if (!order) {
    summarySubtotalEl.textContent = '₦0';
    summaryShippingEl.textContent = '₦0';
    summaryTaxEl.textContent = '₦0';
    summaryTotalEl.textContent = '₦0';
    return;
  }
  summarySubtotalEl.textContent = formatNGN(order.subtotal);
  summaryShippingEl.textContent = formatNGN(order.shipping);
  summaryTaxEl.textContent = formatNGN(order.tax);
  summaryTotalEl.textContent = formatNGN(order.total);
}

function renderPayment(order) {
  paymentMethodEl.textContent = safe(order.paymentMethod?.toUpperCase?.() || order.paymentMethod || '—');
  orderStatusEl.textContent = safe(order.status || '—');
}

function renderOrder(order) {
  if (!order) {
    orderIdEl.textContent = '—';
    placedAtEl.textContent = '';
    orderSummaryEl.innerHTML = '<p>No recent order found.</p>';
    renderTotals(null);
    renderAddress(null);
    renderPayment({});
    return;
  }

  orderIdEl.textContent = order.orderId || '—';
  const d = order.placedAt ? new Date(order.placedAt) : null;
  placedAtEl.textContent = d ? `Placed on ${d.toLocaleString()}` : '';
  renderItems(order.items || []);
  renderTotals(order);
  renderAddress(order.shippingAddress || {});
  renderPayment(order);
}

function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  yearEl.textContent = new Date().getFullYear();

  const order = getLatestOrder();
  renderOrder(order);
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (continueBtn) continueBtn.addEventListener('click', (e) => {
  });
  if (viewOrdersBtn) viewOrdersBtn.addEventListener('click', (e) => {
  });
});