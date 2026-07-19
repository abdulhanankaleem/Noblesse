/* ---------------- State ---------------- */
let cart = []; // {id, size, qty}
let currentProductId = null;
let activeFilter = 'All';

/* ---------------- Render helpers ---------------- */
function money(n){ return '$' + n.toLocaleString('en-US'); }

function productCard(p){
  return `<div class="product-card" onclick="location.hash='#/product/${p.id}'">
    <div class="frame">
      <img src="${p.img}" alt="${p.name}">
      <div class="corner-tag tag">${p.fabric.split(' ')[0]}</div>
    </div>
    <div class="name serif">${p.name}</div>
    <div class="meta">
      <span class="cat">${p.cat}</span>
      <span class="price">${money(p.price)}</span>
    </div>
  </div>`;
}

function renderFeatured(){
  const featured = PRODUCTS.slice(0,6);
  document.getElementById('featuredGrid').innerHTML = featured.map(productCard).join('');
}

function renderFilters(){
  document.getElementById('filterRow').innerHTML = CATEGORIES.map(c =>
    `<button class="filter-chip ${c===activeFilter?'active':''}" onclick="setFilter('${c}')">${c}</button>`
  ).join('');
}
function setFilter(c){ activeFilter = c; renderFilters(); renderShop(); }

function renderShop(){
  const list = activeFilter==='All' ? PRODUCTS : PRODUCTS.filter(p=>p.cat===activeFilter);
  document.getElementById('shopGrid').innerHTML = list.map(productCard).join('');
}

function renderJournal(){
  document.getElementById('journalGrid').innerHTML = JOURNAL.map(j => `
    <div class="journal-entry">
      <div class="figure"><img src="${j.img}" alt=""></div>
      <h3 class="serif">${j.title}</h3>
      <p>${j.text}</p>
    </div>
  `).join('');
}

const SIZES = ['XS','S','M','L','XL'];
let selectedSize = 'M';
let mainImgIndex = 0;

function renderProduct(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){ document.getElementById('pdContainer').innerHTML = '<p>Piece not found.</p>'; return; }
  currentProductId = id;
  selectedSize = 'M';
  mainImgIndex = 0;
  const images = [p.img, p.img2];
  const related = PRODUCTS.filter(x=>x.cat===p.cat && x.id!==p.id).slice(0,3);

  document.getElementById('pdContainer').innerHTML = `
    <div class="pd-gallery">
      <div class="main"><img id="pdMainImg" src="${images[0]}" alt="${p.name}"></div>
      <div class="thumbs">
        ${images.map((im,i)=>`<div class="${i===0?'active':''}" onclick="setMainImg(${i})"><img src="${im}" alt=""></div>`).join('')}
        <div style="background:var(--ink);display:flex;align-items:center;justify-content:center;"><span class="tag dark">${p.cat}</span></div>
        <div style="display:flex;align-items:center;justify-content:center;background:var(--ivory-dim);"><span class="eyebrow">${p.origin}</span></div>
      </div>
    </div>
    <div class="pd-info">
      <span class="eyebrow">${p.cat} — ${p.origin}</span>
      <h1 class="serif">${p.name}</h1>
      <div class="price">${money(p.price)}</div>
      <p class="desc">${p.desc}</p>

      <div class="size-row">
        <span class="label">Size</span>
        <div class="size-chips" id="sizeChips">
          ${SIZES.map(s=>`<div class="size-chip ${s===selectedSize?'active':''}" onclick="setSize('${s}')">${s}</div>`).join('')}
        </div>
      </div>

      <div class="add-row">
        <div class="qty">
          <button onclick="changeQty(-1)">–</button>
          <span id="qtyVal">1</span>
          <button onclick="changeQty(1)">+</button>
        </div>
        <button class="btn" onclick="addToCart('${p.id}')">Add to Bag</button>
      </div>

      <div class="care-label">
        <div class="col">
          <div class="label">Fabric</div>
          <div class="val">${p.fabric}</div>
        </div>
        <div class="col">
          <div class="label">Origin</div>
          <div class="val">${p.origin}</div>
        </div>
        <div class="col">
          <div class="label">Care</div>
          <div class="val">${p.care}</div>
        </div>
      </div>
    </div>
  `;

  if(related.length){
    document.getElementById('pdContainer').insertAdjacentHTML('afterend', `
      <div style="margin-top:96px;">
        <div class="section-head"><div><span class="eyebrow">Paired Well</span><h2 class="serif">You may also hold</h2></div></div>
        <div class="product-grid">${related.map(productCard).join('')}</div>
      </div>
    `);
  }
}
let pdQty = 1;
function setMainImg(i){
  mainImgIndex = i;
  const p = PRODUCTS.find(x=>x.id===currentProductId);
  const imgs = [p.img,p.img2];
  document.getElementById('pdMainImg').src = imgs[i];
  document.querySelectorAll('.pd-gallery .thumbs > div').forEach((el,idx)=>el.classList.toggle('active', idx===i));
}
function setSize(s){
  selectedSize = s;
  document.querySelectorAll('#sizeChips .size-chip').forEach(el=>{
    el.classList.toggle('active', el.textContent.trim()===s);
  });
}
function changeQty(d){
  pdQty = Math.max(1, pdQty + d);
  document.getElementById('qtyVal').textContent = pdQty;
}
function addToCart(id){
  const existing = cart.find(c=>c.id===id && c.size===selectedSize);
  if(existing){ existing.qty += pdQty; }
  else { cart.push({id, size:selectedSize, qty:pdQty}); }
  pdQty = 1;
  updateCartCount();
  showToast(`Added to bag — ${PRODUCTS.find(p=>p.id===id).name} (${selectedSize})`);
}
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}
function updateCartCount(){
  const count = cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById('cartCount').textContent = `(${count})`;
}

function removeFromCart(idx){
  cart.splice(idx,1);
  renderCart();
  updateCartCount();
}
function changeCartQty(idx, d){
  cart[idx].qty = Math.max(1, cart[idx].qty + d);
  renderCart();
  updateCartCount();
}

function renderCart(){
  const el = document.getElementById('cartContainer');
  if(cart.length===0){
    el.innerHTML = `<div class="empty-state">
      <span class="serif">Your bag is empty.</span>
      <p style="margin-bottom:24px;">Nothing held yet — the collection is waiting.</p>
      <a class="btn ghost-dark" href="#/shop">Browse the Shop →</a>
    </div>`;
    return;
  }
  const rows = cart.map((c,idx)=>{
    const p = PRODUCTS.find(x=>x.id===c.id);
    return `<div class="cart-item">
      <div class="thumb"><img src="${p.img}" alt=""></div>
      <div class="info">
        <div class="name serif">${p.name}</div>
        <div class="sub">Size ${c.size} · ${p.fabric}</div>
        <div class="qty" style="width:fit-content;">
          <button onclick="changeCartQty(${idx},-1)">–</button>
          <span>${c.qty}</span>
          <button onclick="changeCartQty(${idx},1)">+</button>
        </div>
      </div>
      <div class="price-col">
        ${money(p.price * c.qty)}
        <span class="remove" onclick="removeFromCart(${idx})">Remove</span>
      </div>
    </div>`;
  }).join('');

  const subtotal = cart.reduce((s,c)=> s + PRODUCTS.find(p=>p.id===c.id).price * c.qty, 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  el.innerHTML = `<div class="cart-layout">
    <div>${rows}</div>
    <div class="summary">
      <h3>Order Summary</h3>
      <div class="sum-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
      <div class="sum-row"><span>Shipping</span><span>Complimentary</span></div>
      <div class="sum-row total"><span>Total</span><span>${money(total)}</span></div>
      <button class="btn" style="width:100%;margin-top:20px;justify-content:center;" onclick="showToast('This is a design preview — checkout is not connected.')">Checkout →</button>
    </div>
  </div>`;
}

/* ---------------- Router ---------------- */
const VIEWS = ['home','shop','product','cart','house','lookbook'];
function router(){
  const hash = location.hash || '#/home';
  const parts = hash.replace('#/','').split('/');
  const route = parts[0] || 'home';

  VIEWS.forEach(v => document.getElementById('view-'+v)?.classList.remove('active'));
  document.querySelectorAll('nav.links a').forEach(a=>a.classList.remove('active'));

  if(route === 'product' && parts[1]){
    document.getElementById('view-product').classList.add('active');
    renderProduct(parts[1]);
  } else if(VIEWS.includes(route)){
    document.getElementById('view-'+route).classList.add('active');
    if(route==='cart') renderCart();
    document.querySelector(`nav.links a[data-route="${route}"]`)?.classList.add('active');
  } else {
    document.getElementById('view-home').classList.add('active');
  }
  window.scrollTo(0,0);
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  renderFilters();
  renderShop();
  renderJournal();
  updateCartCount();
  router();
});
