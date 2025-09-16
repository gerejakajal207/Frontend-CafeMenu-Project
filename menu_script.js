// ---------- Navbar collapse ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const collapsed = navLinks.getAttribute('data-collapsed') === 'true';
    navLinks.setAttribute('data-collapsed', (!collapsed).toString());
    navToggle.setAttribute('aria-expanded', (!collapsed).toString());
  });
}

// ---------- Toast ----------
const toast = document.getElementById('toast');
let toastTimeout;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 1800);
}

// ---------- Cart Logic ----------
let cart = [];
const cartItems = document.getElementById('cart-items');
const total = document.getElementById('total');
const cartCount = document.getElementById('cart-count');

function renderCart() {
  cartItems.innerHTML = '';
  let sum = 0;
  cart.forEach((c, i) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span class="name">${c.item}</span>
      <span>₹${c.price}</span>
      <button class="remove" data-index="${i}">Remove</button>
    `;
    cartItems.appendChild(li);
    sum += c.price;
  });
  total.textContent = `Total: ₹${sum}`;
  cartCount.textContent = cart.length;

  // remove handlers
  cartItems.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.index, 10);
      cart.splice(idx, 1);
      renderCart();
    });
  });
}

// Add-to-cart buttons
document.querySelectorAll('.cart-btn').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.dataset.item;
    const price = parseInt(button.dataset.price, 10) || 0;
    cart.push({ item, price });
    renderCart();
    showToast(`✅ ${item} added to cart`);
  });
});

// Order now
document.getElementById('order-now').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Your cart is empty');
    return;
  }
  showToast('🎉 Order placed successfully!');
  cart = [];
  renderCart();
});

// ---------- Menu Pagination (category pages) ----------
// We show 2 category sections per "menu-page". Buttons: 1, 2, ...
const pages = Array.from(document.querySelectorAll('.menu-page'));
const pager = document.getElementById('menu-pager');

function renderPager() {
  pager.innerHTML = '';
  pages.forEach((page, idx) => {
    const num = idx + 1;
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    btn.textContent = String(num);
    btn.setAttribute('aria-label', `Go to page ${num}`);
    btn.addEventListener('click', () => showPage(num));
    if (!page.hasAttribute('hidden')) btn.setAttribute('aria-current', 'true');
    pager.appendChild(btn);
  });
}

function showPage(n) {
  pages.forEach((p, i) => {
    const num = i + 1;
    if (num === n) {
      p.removeAttribute('hidden');
    } else {
      p.setAttribute('hidden', '');
    }
  });
  renderPager();
}

showPage(1);

// ---------- Feedback ----------
const nps = document.getElementById('nps');
let npsScore = null;
if (nps) {
  nps.addEventListener('click', (e) => {
    const btn = e.target.closest('.nps-btn');
    if (!btn) return;
    nps.querySelectorAll('.nps-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    npsScore = btn.dataset.score;
  });
}

document.getElementById('feedback-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('feedback-msg');
  msg.textContent = 'Thank you for your feedback!';
  showToast('💬 Feedback submitted — thanks!');
  e.target.reset();
  // reset NPS highlight
  npsScore = null;
  nps?.querySelectorAll('.nps-btn').forEach(b => b.classList.remove('active'));
});
