const products = [
  {
    id: 1,
    category: 'Техника',
    name: 'AirBeam Pro',
    price: 24990,
    oldPrice: 29990,
    stock: 12,
    rating: 4.9,
    badge: 'Новинка',
    description: 'Премиальные беспроводные наушники с глубоким басом и 30 часами работы.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    category: 'Дом',
    name: 'Smart Lamp X',
    price: 6990,
    oldPrice: 8990,
    stock: 24,
    rating: 4.8,
    badge: 'Популярно',
    description: 'Умная лампа с управлением голосом, настройками цвета и таймером.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    category: 'Аксессуары',
    name: 'Travel Pack',
    price: 3590,
    oldPrice: 4990,
    stock: 42,
    rating: 4.7,
    badge: 'Скидка',
    description: 'Комплект чемоданного набора для отдыха и поездок.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    category: 'Кухня',
    name: 'Chef Mini',
    price: 12990,
    oldPrice: 15990,
    stock: 9,
    rating: 4.9,
    badge: 'Лидер',
    description: 'Премиальная мини-печь с интеллектом приготовления и автоочисткой.',
    image: 'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    category: 'Гаджеты',
    name: 'Pulse Watch',
    price: 18990,
    oldPrice: 22990,
    stock: 15,
    rating: 4.8,
    badge: 'Тренд',
    description: 'Часы с мониторингом активности, сердечного ритма и сна.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    category: 'Красота',
    name: 'Glow Care',
    price: 4590,
    oldPrice: 5990,
    stock: 31,
    rating: 4.6,
    badge: 'Новый',
    description: 'Умная система ухода с антиоксидантной технологией и USB-подзарядкой.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'
  }
];

const currency = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
});

const cartKey = 'nova-cart';
const currentPage = document.body.dataset.page;

function getCart() {
  const raw = localStorage.getItem(cartKey);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function priceFormat(value) {
  return currency.format(value).replace('₽', '₽');
}

function formatPriceText(value) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

function renderHomePage() {
  const filters = {
    category: 'all',
    search: '',
    sort: 'popular'
  };

  const productGrid = document.getElementById('productGrid');
  const categoryFilters = document.getElementById('categoryFilters');
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const cartPanel = document.getElementById('cartPanel');
  const cartToggle = document.getElementById('cartToggle');
  const closeCart = document.getElementById('closeCart');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const checkoutButton = document.getElementById('checkoutButton');
  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckout = document.getElementById('closeCheckout');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutItems = document.getElementById('checkoutItems');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const checkoutSuccess = document.getElementById('checkoutSuccess');
  const checkoutSuccessText = document.getElementById('checkoutSuccessText');
  const finishCheckout = document.getElementById('finishCheckout');

  function getCategories() {
    return ['all', ...new Set(products.map((product) => product.category))];
  }

  function renderCategoryFilters() {
    const categories = getCategories();
    categoryFilters.innerHTML = categories
      .map((category) => {
        const active = filters.category === category ? 'active' : '';
        const label = category === 'all' ? 'Все' : category;
        return `<button class="filter-chip ${active}" data-category="${category}">${label}</button>`;
      })
      .join('');

    document.querySelectorAll('.filter-chip').forEach((button) => {
      button.addEventListener('click', () => {
        filters.category = button.dataset.category;
        renderProducts();
        renderCategoryFilters();
      });
    });
  }

  function getVisibleProducts() {
    let items = products.filter((product) => {
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    switch (filters.sort) {
      case 'price-asc':
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case 'new':
        items = [...items].sort((a, b) => b.id - a.id);
        break;
      default:
        items = [...items].sort((a, b) => b.rating - a.rating);
    }

    return items;
  }

  function renderProducts() {
    const visibleProducts = getVisibleProducts();

    if (!visibleProducts.length) {
      productGrid.innerHTML = `
        <div class="empty-state">
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить фильтр или поисковый запрос.</p>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = visibleProducts
      .map(
        (product) => `
          <article class="product-card">
            <div class="product-media">
              <img class="product-thumb" src="${product.image}" alt="${product.name}" />
              <span class="product-badge">${product.badge}</span>
            </div>
            <div class="product-body">
              <div class="product-meta">
                <span class="product-category">${product.category}</span>
                <span class="product-rating">★ ${product.rating}</span>
              </div>
              <h3 class="product-name">${product.name}</h3>
              <p class="product-desc">${product.description}</p>
              <div class="product-price-row">
                <div>
                  <div class="price-main">${priceFormat(product.price)}</div>
                  <div class="price-old">${priceFormat(product.oldPrice)}</div>
                </div>
              </div>
              <div class="product-actions">
                <span class="stock">${product.stock} в наличии</span>
                <button class="add-btn" data-id="${product.id}">В корзину</button>
              </div>
            </div>
          </article>
        `
      )
      .join('');

    document.querySelectorAll('.add-btn').forEach((button) => {
      button.addEventListener('click', () => addToCart(Number(button.dataset.id)));
    });
  }

  function addToCart(productId) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      const product = products.find((item) => item.id === productId);
      cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
    renderCart();
    cartPanel.classList.add('open');
  }

  function removeFromCart(productId) {
    const cart = getCart().filter((item) => item.id !== productId);
    saveCart(cart);
    renderCart();
  }

  function renderCart() {
    const cart = getCart();

    if (!cart.length) {
      cartItems.innerHTML = '<p class="empty-state" style="margin:0; padding:20px">Корзина пуста</p>';
      cartTotal.textContent = '0 ₽';
      cartCount.textContent = '0';
      return;
    }

    cartItems.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" />
            <div>
              <h4>${item.name}</h4>
              <p>${item.qty} × ${priceFormat(item.price)}</p>
            </div>
            <button data-remove="${item.id}" aria-label="Удалить из корзины">×</button>
          </div>
        `
      )
      .join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotal.textContent = formatPriceText(total);
    cartCount.textContent = String(cart.reduce((sum, item) => sum + item.qty, 0));

    document.querySelectorAll('[data-remove]').forEach((button) => {
      button.addEventListener('click', () => removeFromCart(Number(button.dataset.remove)));
    });
  }

  function openCheckout() {
    const cart = getCart();
    if (!cart.length) return;

    checkoutItems.innerHTML = cart
      .map((item) => `
        <div class="checkout-item">
          <span>${item.name} × ${item.qty}</span>
          <strong>${formatPriceText(item.price * item.qty)}</strong>
        </div>
      `)
      .join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    checkoutTotal.textContent = formatPriceText(total);
    checkoutForm.hidden = false;
    checkoutSuccess.hidden = true;
    checkoutModal.hidden = false;
    document.body.classList.add('modal-open');
    document.querySelector('#checkoutForm [name="name"]').focus();
  }

  function closeCheckoutModal() {
    checkoutModal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  searchInput.addEventListener('input', (event) => {
    filters.search = event.target.value.trim();
    renderProducts();
  });

  sortSelect.addEventListener('change', (event) => {
    filters.sort = event.target.value;
    renderProducts();
  });

  cartToggle.addEventListener('click', () => {
    cartPanel.classList.toggle('open');
  });

  closeCart.addEventListener('click', () => {
    cartPanel.classList.remove('open');
  });

  checkoutButton.addEventListener('click', openCheckout);
  closeCheckout.addEventListener('click', closeCheckoutModal);
  finishCheckout.addEventListener('click', closeCheckoutModal);

  checkoutModal.addEventListener('click', (event) => {
    if (event.target === checkoutModal) closeCheckoutModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !checkoutModal.hidden) closeCheckoutModal();
  });

  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const customerName = new FormData(checkoutForm).get('name');

    checkoutSuccessText.textContent = `${customerName}, спасибо! Номер вашего заказа: №${orderNumber}.`;
    checkoutForm.hidden = true;
    checkoutSuccess.hidden = false;
    saveCart([]);
    renderCart();
    cartPanel.classList.remove('open');
  });

  renderCategoryFilters();
  renderProducts();
  renderCart();
}

function renderProductPage() {
  const detail = document.getElementById('productDetail');
  if (!detail) return;

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id'));
  const product = products.find((item) => item.id === productId) || products[0];

  detail.innerHTML = `
    <div class="product-layout">
      <div class="product-photo">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-info">
        <div class="meta-row">
          <span class="product-meta-tag">${product.category}</span>
          <span class="product-meta-tag">★ ${product.rating}</span>
        </div>
        <h1>${product.name}</h1>
        <div class="product-price">${formatPriceText(product.price)}</div>
        <p class="product-description">${product.description}</p>
        <div class="product-action-row">
          <button class="primary-btn add-detail-btn" data-id="${product.id}">Добавить в корзину</button>
          <a href="index.html" class="secondary-btn">Назад в каталог</a>
        </div>
      </div>
    </div>
  `;

  const addButton = document.querySelector('.add-detail-btn');
  addButton.addEventListener('click', () => {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1 });
    saveCart(cart);
    window.location.href = 'index.html';
  });
}

function renderAuthPage() {
  const windows = document.querySelectorAll('.auth-window');

  document.querySelectorAll('.auth-switch').forEach((button) => {
    button.addEventListener('click', () => {
      windows.forEach((window) => {
        window.hidden = window.id !== button.dataset.show;
      });
    });
  });

  document.querySelector('.auth-form[data-type="login"]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Вход выполнен успешно (демо-режим)');
  });

  document.querySelector('.auth-form[data-type="register"]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Регистрация выполнена успешно (демо-режим)');
  });
}

function renderAdminPage() {
  const recentOrders = [
    { id: '№1042', customer: 'Анна К.', amount: '12 490 ₽', status: 'Новый' },
    { id: '№1038', customer: 'Иван П.', amount: '24 980 ₽', status: 'В работе' },
    { id: '№1034', customer: 'Мария С.', amount: '7 990 ₽', status: 'Готово' },
    { id: '№1029', customer: 'Дмитрий Л.', amount: '18 450 ₽', status: 'Отменён' }
  ];

  const recentOrdersTable = document.getElementById('recentOrders');
  if (recentOrdersTable) {
    recentOrdersTable.innerHTML = recentOrders
      .map((order) => {
        const statusClass =
          order.status === 'Готово'
            ? 'status-done'
            : order.status === 'В работе'
              ? 'status-pending'
              : order.status === 'Отменён'
                ? 'status-pending'
                : 'status-new';

        return `
          <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.amount}</td>
            <td><span class="status-pill ${statusClass}">${order.status}</span></td>
          </tr>
        `;
      })
      .join('');
  }

  const adminProducts = document.getElementById('adminProducts');
  if (adminProducts) {
    adminProducts.innerHTML = products
      .slice(0, 4)
      .map((product) => `
        <li>
          <span>${product.name}</span>
          <strong>${product.stock} шт</strong>
        </li>
      `)
      .join('');
  }

  const adminUsers = document.getElementById('adminUsers');
  if (adminUsers) {
    adminUsers.innerHTML = [
      { name: 'Анна К.', role: 'USER' },
      { name: 'Иван П.', role: 'ADMIN' },
      { name: 'Мария С.', role: 'USER' },
      { name: 'Алексей Н.', role: 'USER' }
    ]
      .map((user) => `
        <li>
          <span>${user.name}</span>
          <strong>${user.role}</strong>
        </li>
      `)
      .join('');
  }
}

switch (currentPage) {
  case 'home':
    renderHomePage();
    break;
  case 'product':
    renderProductPage();
    break;
  case 'auth':
    renderAuthPage();
    break;
  case 'admin':
    renderAdminPage();
    break;
  default:
    break;
}
