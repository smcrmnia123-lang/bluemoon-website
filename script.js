// ===== CART FUNCTIONS (shared across pages) =====
// Cart is stored in localStorage as an array of {name, price}

function getCart() {
  const data = localStorage.getItem('bluemoon-cart');
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem('bluemoon-cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const cart = getCart();
  cart.push({ name: name, price: price });
  saveCart(cart);
  updateCartBar();
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCartPage();
}

function cartTotal(cart) {
  return cart.reduce(function (sum, item) { return sum + item.price; }, 0);
}

// ===== UPDATE STICKY CART BAR (on shop.html) =====
function updateCartBar() {
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');
  if (!countEl || !totalEl) return;
  const cart = getCart();
  countEl.textContent = cart.length;
  totalEl.textContent = cartTotal(cart);
}

// ===== ADD TO CART BUTTONS (on shop.html) =====
document.addEventListener('DOMContentLoaded', function () {
  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      addToCart(name, price);
      btn.textContent = 'Added ✓';
      setTimeout(function () { btn.textContent = 'Add to Cart'; }, 1200);
    });
  });
  updateCartBar();

  // ===== SHOP CATEGORY FILTER (on shop.html) =====
  const tabs = document.querySelectorAll('.shop-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      const cards = document.querySelectorAll('#shop-grid .prod-card');
      cards.forEach(function (card) {
        if (filter === 'all' || card.getAttribute('data-cat') === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ===== RENDER CART PAGE (on cart.html) =====
  renderCartPage();

  // ===== CONTACT FORM (on contact.html) =====
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      document.getElementById('form-status').textContent =
        'Thank you! We received your request and will contact you shortly.';
      form.reset();
    });
  }
});

function renderCartPage() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-2);">Your cart is empty. <a href="shop.html" style="color:var(--gold-dark);font-weight:600;">Start shopping</a>.</p>';
  } else {
    container.innerHTML = cart.map(function (item, index) {
      return '<div class="menu-item">' +
        '<div class="info"><h4>' + item.name + '</h4></div>' +
        '<div class="price">₱' + item.price + ' <button data-index="' + index + '" class="remove-item" style="margin-left:10px;background:none;border:none;color:#B91C1C;cursor:pointer;font-size:13px;">Remove</button></div>' +
        '</div>';
    }).join('');

    container.querySelectorAll('.remove-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        removeFromCart(parseInt(btn.getAttribute('data-index')));
      });
    });
  }

  const grandTotalEl = document.getElementById('grand-total');
  if (grandTotalEl) grandTotalEl.textContent = cartTotal(cart);
}
