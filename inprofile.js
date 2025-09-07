
const $ = id => document.getElementById(id);


const displayName = $('display-name');
const displayEmail = $('display-email');
const yearEl = $('year');

const fullNameEl = $('fullName');
const emailEl = $('email');
const saveBtn = $('save-profile');
const logoutBtn = $('logout-btn');

const cardsListEl = $('cards-list');
const cardNumberEl = $('card-number');
const cardNameEl = $('card-name');
const cardExpiryEl = $('card-expiry');
const cardCvcEl = $('card-cvc');
const addCardBtn = $('add-card-btn');

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('currentUser')) || null; }
  catch { return null; }
}
function setCurrentUser(u) { localStorage.setItem('currentUser', JSON.stringify(u)); }
function getPaymentKey(email) { return `paymentMethods_${email || 'guest'};` }
function loadPaymentMethods(email) {
  try { return JSON.parse(localStorage.getItem(getPaymentKey(email))) || []; }
  catch { return []; }
}
function savePaymentMethods(email, arr) {
  localStorage.setItem(getPaymentKey(email), JSON.stringify(arr));
}

function formatCardNumber(num) {
  const d = String(num || '').replace(/\D/g, '').slice(0, 16);
  return (d.match(/.{1,4}/g) || []).join(' ');
}
function maskCard(num) {
  const d = String(num || '').replace(/\D/g, '');
  return d.length >= 4 ? '**** **** **** ' + d.slice(-4) : '';
}
function formatExpiry(value) {
  const d = String(value || '').replace(/\D/g, '').slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0,2)}/${d.slice(2)}`;
}

function renderProfile() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  displayName.textContent = user.name || '—';
  displayEmail.textContent = user.email || '—';

  fullNameEl.value = user.name || '';
  emailEl.value = user.email || '';
}

function renderCards() {
  cardsListEl.innerHTML = '';
  const user = getCurrentUser();
  if (!user) return;

  const email = user.email;
  const cards = loadPaymentMethods(email);

  if (!cards.length) {
    cardsListEl.innerHTML = '<p class="small">No saved payment methods.</p>';
    return;
  }

  cards.forEach((c, idx) => {
    const div = document.createElement('div');
    div.className = 'card-item';
    div.innerHTML = `
      <div class="card-left">
        <div class="card-meta">
          <div><strong>${c.name || 'Card'}</strong></div>
          <div class="small">${maskCard(c.number)} • Expires ${c.expiry || '—'}</div>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn ghost set-default" data-idx="${idx}">${c.default ? 'Default' : 'Set default'}</button>
        <button class="btn ghost remove-card" data-idx="${idx}">Remove</button>
      </div>
    `;
    cardsListEl.appendChild(div);
  });

  document.querySelectorAll('.remove-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      if (!confirm('Remove this card?')) return;
      const email = getCurrentUser()?.email;
      const arr = loadPaymentMethods(email);
      arr.splice(idx,1);
      savePaymentMethods(email, arr);
      renderCards();
    });
  });

  document.querySelectorAll('.set-default').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      const email = getCurrentUser()?.email;
      const arr = loadPaymentMethods(email);
      arr.forEach((a,i)=> a.default = (i===idx));
      savePaymentMethods(email, arr);
      renderCards();
    });
  });
}

saveBtn?.addEventListener('click', () => {
  const name = fullNameEl.value.trim();
  const email = emailEl.value.trim();
  if (!name || !email) { alert('Name and email are required.'); return; }
  let user = getCurrentUser() || {};
  user.name = name;
  user.email = email;
  setCurrentUser(user);
  renderProfile();
  alert('Profile updated.');
});

logoutBtn?.addEventListener('click', () => {
  if (!confirm('Log out?')) return;
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
});

addCardBtn?.addEventListener('click', () => {
  const num = cardNumberEl.value.replace(/\s/g,'');
  const name = cardNameEl.value.trim() || 'Card';
  const expiry = cardExpiryEl.value.trim();
  const cvc = cardCvcEl.value.trim();

  if (!/^\d{12,19}$/.test(num)) {
    alert('Enter a valid card number (12–19 digits).');
    return;
  }

  const email = getCurrentUser()?.email;
  const arr = loadPaymentMethods(email);
  arr.push({ number: num, name, expiry, cvc, default: arr.length===0 });
  savePaymentMethods(email, arr);

  cardNumberEl.value = cardNameEl.value = cardExpiryEl.value = cardCvcEl.value = '';
  renderCards();
});

if (cardNumberEl) cardNumberEl.addEventListener('input', e => e.target.value = formatCardNumber(e.target.value));
if (cardExpiryEl) cardExpiryEl.addEventListener('input', e => e.target.value = formatExpiry(e.target.value));
if (cardCvcEl) cardCvcEl.addEventListener('input', e => e.target.value = (e.target.value || '').replace(/\D/g,'').slice(0,4));


document.addEventListener('DOMContentLoaded', () => {
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  renderProfile();
  renderCards();
});