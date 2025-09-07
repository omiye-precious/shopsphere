
(function requireLogin() {
  const raw = localStorage.getItem('currentUser');
  if (!raw) {
    const returnTo = encodeURIComponent('checkout.html');
    alert('Please login to continue to checkout.');
    window.location.replace(`login.html?returnTo=${returnTo}`);
    throw new Error('not-logged-in');
  }
})();

const $ = id => document.getElementById(id);

const summaryItems = $('summary-items');
const subtotalEl = $('subtotal');
const shippingEl = $('shipping');
const taxEl = $('tax');
const totalEl = $('total');
const checkoutForm = $('checkout-form');
const placeOrderBtn = $('place-order');

const stateSel = $('stateSel');
const citySel = $('citySel');
const lgaSel = $('lgaSel');

const phoneEl = $('phone');

const cardFields = $('card-fields');
const cardNumberEl = $('cardNumber');
const cardExpiryEl = $('cardExpiry');
const cardCvcEl = $('cardCvc');
const cardNameEl = $('cardName');

let savedCardsContainer;
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('currentUser')) || null; }
  catch { return null; }
}
function getPaymentKey(email) { return `paymentMethods_${email || 'guest'}` }
function loadPaymentMethods(email) {
  try { return JSON.parse(localStorage.getItem(getPaymentKey(email))) || []; }
  catch { return []; }
}
function savePaymentMethods(email, arr) {
  localStorage.setItem(getPaymentKey(email), JSON.stringify(arr));
}
function getCurrentUserId() {
  try { const u = JSON.parse(localStorage.getItem('currentUser')); return u?.id || null; }
  catch { return null; }
}
function loadCart() {
  const userId = getCurrentUserId();
  const key = userId ? `cart_${userId}` : 'cart';
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
function saveCartArr(arr) {
  const userId = getCurrentUserId();
  const key = userId ? `cart_${userId}` : 'cart';
  localStorage.setItem(key, JSON.stringify(arr));
  localStorage.setItem(key + '_updated_at', Date.now());
}
function onlyDigits(s='') {
   return String(s || '').replace(/\D/g,'');
   }
function formatNGN(n) { 
  const v = Number(n) || 0; return `₦${Math.round(v).toLocaleString()}`
 }
function formatCardNumber(num) { 
  const d=String(num||'').replace(/\D/g,'').slice(0,16); return (d.match(/.{1,4}/g)||[]).join(' '); 
}
function formatExpiry(value) { 
  const d=String(value||'').replace(/\D/g,'').slice(0,4); return d.length<=2 ? d : `${d.slice(0,2)}/${d.slice(2)};`
 }
function maskCard(num) { 
  const d=String(num||'').replace(/\D/g,''); return d.length>=4 ? '**** **** **** '+d.slice(-4) : ''; 
}

const ADDRESS_DATA = [
  { key: 'oyo', label: 'Oyo', cities: [
    { name: 'Ibadan', lgas: [ {name:'Challenge', fee:250}, {name:'Mokola', fee:200}, {name:'Ojo', fee:300} ] },
    { name: 'Ogbomoso', lgas: [ {name:'Takie', fee:280}, {name:'Isale Ora', fee:260}, {name:'Arowomole', fee:240} ] }
  ]},
  { key: 'ondo', label: 'Ondo', cities: [
    { name: 'Akure', lgas: [ {name:'Akure South', fee:150}, {name:'Akure North', fee:120}, {name:'Ifedore', fee:200} ] },
    { name: 'Owo', lgas: [ {name:'Owo East', fee:180}, {name:'Owo West', fee:160}, {name:'Ese-Odo', fee:220} ] }
  ]},
  { key: 'lagos', label: 'Lagos', cities: [
    { name: 'Ikeja', lgas: [ {name:'Ojota', fee:400}, {name:'Maryland', fee:420}, {name:'Alausa', fee:380} ] },
    { name: 'Lekki', lgas: [ {name:'Ajah', fee:600}, {name:'Ikate', fee:700}, {name:'VGC', fee:800} ] }
  ]}
];
const FREE_THRESHOLD = 1000;
const CITY_MAP = {}; const LGA_MAP = {};
(function buildMaps(){
  ADDRESS_DATA.forEach(s => {
    CITY_MAP[s.key] = s.cities.map(c => c.name);
    LGA_MAP[s.key] = {};
    s.cities.forEach(c => LGA_MAP[s.key][c.name]=(c.lgas||[]).slice());
  });
})();

function populateStates() {
  if (!stateSel) return;
  stateSel.innerHTML = '<option value="">Select State</option>';
  ADDRESS_DATA.forEach(s => {
    const o = document.createElement('option');
    o.value = s.key;
    o.textContent = s.label;
    stateSel.appendChild(o);
  });
  stateSel.disabled = false;
  citySel.innerHTML = '<option value="">Select City / Town</option>';
  citySel.disabled = true;
  lgaSel.innerHTML = '<option value="">Select LGA</option>';
  lgaSel.disabled = true;
}

function populateCities() {
  const stKey = (stateSel.value || '').toLowerCase();
  citySel.innerHTML = '<option value="">Select City / Town</option>';
  lgaSel.innerHTML = '<option value="">Select LGA</option>';
  lgaSel.disabled = true;
  
  if (!stKey || !CITY_MAP[stKey]) { renderCartAndTotals(); return; }

  CITY_MAP[stKey].forEach(cityName => {
    const o = document.createElement('option');
    o.value = cityName;
    o.textContent = cityName;
    citySel.appendChild(o);
  });

  citySel.disabled = false;
  renderCartAndTotals();
}

function populateLgas() {
  const stKey = (stateSel.value || '').toLowerCase();
  const cityName = citySel.value || '';
  lgaSel.innerHTML = '<option value="">Select LGA</option>';
  lgaSel.disabled = true;

  if (!stKey || !cityName || !Array.isArray(LGA_MAP[stKey]?.[cityName])) {
    renderCartAndTotals();
    return;
  }

  LGA_MAP[stKey][cityName].forEach(l => {
    const o = document.createElement('option');
    o.value = l.name;
    o.textContent = l.name;
    o.dataset.fee = l.fee;
    lgaSel.appendChild(o);
  });

  lgaSel.disabled = false;
  renderCartAndTotals();
}

if (stateSel) stateSel.addEventListener('change', () => {
  populateCities();
  lgaSel.innerHTML = '<option value="">Select LGA </option>';
  lgaSel.disabled = true;
});

if (citySel) citySel.addEventListener('change', populateLgas);
if (lgaSel) lgaSel.addEventListener('change', renderCartAndTotals);

function calcShipping(subtotal) {
  if(Number(subtotal)>=FREE_THRESHOLD) return 0;
  const opt = lgaSel.options[lgaSel.selectedIndex];
  if(opt && opt.dataset && opt.dataset.fee) return Number(opt.dataset.fee)||0;
  return 0;
}
function renderCartAndTotals() {
  const cart=loadCart(); summaryItems.innerHTML='';
  if(!Array.isArray(cart)||cart.length===0){ summaryItems.innerHTML='<p>Your cart is empty.</p>'; 
    subtotalEl.textContent='₦0'; 
    shippingEl.textContent='₦0'; 
    taxEl.textContent='₦0'; totalEl.textContent='₦0'; 
    if(placeOrderBtn) placeOrderBtn.disabled=true; return; 
  }
  let subtotal=0;
  cart.forEach(item=>{
    const qty=Number(item.quantity||1); const price=Number(item.price||0); 
    const itemTotal=price*qty; subtotal+=itemTotal;
    const div=document.createElement('div'); div.className='summary-item';
    div.innerHTML=`<img src="${item.image||''}" alt="${item.name||''}" /><div><h4>${item.name||''}</h4><p>${formatNGN(price)} × ${qty}</p></div><div><strong>${formatNGN(itemTotal)}</strong></div>`;
    summaryItems.appendChild(div);
  });
  const shipping=calcShipping(subtotal); 
  const tax=Math.round(subtotal*0.075); 
  const total=Math.round(subtotal+shipping+tax);
  subtotalEl.textContent=formatNGN(subtotal); 
  shippingEl.textContent=formatNGN(shipping); 
  taxEl.textContent=formatNGN(tax); 
  totalEl.textContent=formatNGN(total);
  if(placeOrderBtn) placeOrderBtn.disabled=false;
}

function updateCardVisibility() {
  const sel=document.querySelector('input[name="payMethod"]:checked')?.value||'cod';
  if(!cardFields) return;
  if(sel==='card') cardFields.classList.add('show'); else cardFields.classList.remove('show');
}
document.querySelectorAll('input[name="payMethod"]').forEach(r=>r.addEventListener('change',updateCardVisibility));
updateCardVisibility();

if(cardNumberEl) cardNumberEl.addEventListener('input',()=>{ const d=onlyDigits(cardNumberEl.value).slice(0,19); 
  cardNumberEl.value=(d.match(/.{1,4}/g)||[]).join(' '); 
});
if(cardExpiryEl) cardExpiryEl.addEventListener('input',()=>{ let d=onlyDigits(cardExpiryEl.value).slice(0,4); 
  cardExpiryEl.value=d.length<=2?d:`${d.slice(0,2)}/${d.slice(2,4)}`; 
});
if(cardCvcEl) cardCvcEl.addEventListener('input',()=>cardCvcEl.value=onlyDigits(cardCvcEl.value).slice(0,3));
if(phoneEl) phoneEl.addEventListener('input',()=>phoneEl.value=onlyDigits(phoneEl.value).slice(0,11));

function renderSavedCards() {
  const user=getCurrentUser(); if(!user) return;
  const email=user.email;
  const cards=loadPaymentMethods(email); if(!cards.length) return;
  if(!savedCardsContainer){
    savedCardsContainer=document.createElement('div'); savedCardsContainer.id='saved-cards'; 
    savedCardsContainer.style.margin='1rem 0';
    cardFields.parentNode.insertBefore(savedCardsContainer, cardFields);
  }
  savedCardsContainer.innerHTML='<p><strong>Saved Cards:</strong></p>';
  cards.forEach((c,idx)=>{
    const btn=document.createElement('button'); btn.type='button'; 
    btn.className='btn ghost'; btn.style.margin='0.25rem';
    btn.textContent=`${c.name} • ${maskCard(c.number)}`;
    btn.addEventListener('click',()=>{ cardNumberEl.value=formatCardNumber(c.number); 
      cardExpiryEl.value=c.expiry; cardCvcEl.value=c.cvc; cardNameEl.value=c.name; 
    });
    savedCardsContainer.appendChild(btn);
  });
}

const TEST_CARDS={"1111111111111111":"success","0000000000000000":"insufficient"};
function handlePlaceOrder(){
  const cart=loadCart(); if(!Array.isArray(cart)||cart.length===0){ alert('Cart empty'); return; 
  }
const required = ['fullName','email','phone'];
for (const id of required) {
  const el = $(id);
  if (!el || !el.value.trim()) {
    alert(`Please fill the ${id} field`);
    el?.focus();
    return;
  }
}

if (!stateSel.value.trim() || !citySel.value.trim() || !lgaSel.value.trim()) {
  alert('Please complete address selection (State, City, and LGA).');
  return;
}

const pay = document.querySelector('input[name="payMethod"]:checked')?.value || 'cod';
if (pay === 'card') {
  if (!cardNumberEl.value.trim() || !cardExpiryEl.value.trim() || !cardCvcEl.value.trim() || !cardNameEl.value.trim()) {
    alert('Please fill in all card details.');
    return;
  }
}
  let subtotal=0; 
  cart.forEach(it=>subtotal+=(Number(it.price||0)*Number(it.quantity||1))); 
  const shipping=calcShipping(subtotal); const tax=Math.round(subtotal*0.075); 
  const total=Math.round(subtotal+shipping+tax);
  const order={ orderId:`ORD-${Date.now()}-${Math.floor(Math.random()*900+100)}`, 
  userId:getCurrentUserId(), 
  placedAt:Date.now(), items:cart.map(it=>({ id:it.id, 
  name:it.name, price:Number(it.price||0), 
  quantity:Number(it.quantity||1), 
  image:it.image||'' })), 
  subtotal, 
  shipping, 
  tax, 
  total, 
  shippingAddress:{state:stateSel.value, 
  city:citySel.value, lga:lgaSel.value}, 
  paymentMethod:pay, status:'Completed' 
};
  try{ const raw=localStorage.getItem('orders'); 
    const arr=raw?JSON.parse(raw):[]; arr.push(order); 
    localStorage.setItem('orders',JSON.stringify(arr)); 
  }
  catch(e){ 
    localStorage.setItem('orders',JSON.stringify([order])); 
  }
  saveCartArr([]); 
  alert(`Order placed! Total: ${formatNGN(total)}`); 
  window.location.href='success.html';
}
if(placeOrderBtn) placeOrderBtn.addEventListener('click',e=>{ e.preventDefault(); handlePlaceOrder(); });

window.addEventListener('storage',e=>{ 
  const userId=getCurrentUserId(); 
  const cartKey=userId?`cart_${userId}`:'cart'; if(!e.key) return; 
  if(e.key===cartKey||e.key===cartKey+'_updated_at'||e.key==='products'){ renderCartAndTotals(); } 
});

document.addEventListener('DOMContentLoaded',()=>{
  populateStates(); if(citySel) citySel.disabled=true; if(lgaSel) lgaSel.disabled=true;
  renderCartAndTotals();
  renderSavedCards();
});
if(stateSel) stateSel.addEventListener('change',populateCities);
if(citySel) citySel.addEventListener('change',populateLgas);
if(lgaSel) lgaSel.addEventListener('change',renderCartAndTotals);