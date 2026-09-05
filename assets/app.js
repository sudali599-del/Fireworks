/**
 * Selvaganapathy Traders - Sun Flag Fireworks, Sivakasi
 * Professional Web Application Engine & Order Management System
 * 100% English Clean Corporate Edition
 */

(function () {
  'use strict';

  // Constants
  const MIN_ORDER_VALUE = 0;
  const PRIMARY_PHONE = "916383144854";
  const SECONDARY_PHONE = "919944087728";
  const DEFAULT_GMAIL = "selvaganapathytraders@gmail.com";
  const ADMIN_EMAILS = ["selvaganapathytraders@gmail.com", "sudali599@gmail.com"];
  const PRIMARY_UPI_ID = "6383144854@upi";
  const BANK_INFO_TEXT = `Bank Account Details for Online Payment:
Account Name: SELVAGANAPATHY TRADERS
Bank: State Bank of India (SBI)
Account Number: 39845210987
IFSC Code: SBIN0000918
Branch: Sivakasi Main Branch, Tamil Nadu
UPI ID: 6383144854@upi`;

  // Application State
  const state = {
    cart: {}, // { [productId]: quantity }
    searchSno: "",
    searchQuery: "",
    selectedCategory: "ALL",
    expandedCategories: {}, // { [categoryName]: boolean } - closed by default
    customer: {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      pincode: ""
    }
  };

  // Load state from localStorage
  function loadPersistedState() {
    try {
      const savedCart = localStorage.getItem("sgt_cart_2026");
      if (savedCart) {
        state.cart = JSON.parse(savedCart);
      }
      const savedCustomer = localStorage.getItem("sgt_customer_2026");
      if (savedCustomer) {
        state.customer = { ...state.customer, ...JSON.parse(savedCustomer) };
      }
    } catch (e) {
      console.warn("Could not load persisted data", e);
    }
  }

  // Save state to localStorage
  function saveCartState() {
    try {
      localStorage.setItem("sgt_cart_2026", JSON.stringify(state.cart));
    } catch (e) {
      console.warn("Could not save cart", e);
    }
  }

  function saveCustomerState() {
    try {
      localStorage.setItem("sgt_customer_2026", JSON.stringify(state.customer));
    } catch (e) {
      console.warn("Could not save customer", e);
    }
  }

  // Cart Calculations
  function getCartSummary() {
    let totalItems = 0;
    let totalQuantity = 0;
    let grandTotal = 0;
    const cartItems = [];

    window.PRODUCTS_DATA.forEach(product => {
      const qty = parseInt(state.cart[product.id] || 0, 10);
      if (qty > 0) {
        const itemTotal = qty * product.price;
        totalItems += 1;
        totalQuantity += qty;
        grandTotal += itemTotal;
        cartItems.push({
          ...product,
          qty,
          itemTotal
        });
      }
    });

    return {
      totalItems,
      totalQuantity,
      grandTotal,
      cartItems,
      isMinReached: totalItems > 0,
      neededForMin: 0
    };
  }

  // Currency Formatter
  function formatINR(val) {
    return "₹ " + Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // DOM Elements
  const productsContainer = document.getElementById("products-container");
  const categoryNav = document.getElementById("category-nav");
  const searchSnoInput = document.getElementById("search-sno");
  const searchNameInput = document.getElementById("search-name");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  
  const floatingCart = document.getElementById("floating-cart");
  const floatingCartAmount = document.getElementById("floating-cart-amount");
  const floatingCartCount = document.getElementById("floating-cart-count");
  const headerCartCount = document.getElementById("header-cart-count");

  const cartDrawer = document.getElementById("cart-drawer");
  const cartDrawerBackdrop = document.getElementById("cart-drawer-backdrop");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartItemsList = document.getElementById("cart-items-list");
  const cartEmptyState = document.getElementById("cart-empty-state");
  const cartContentState = document.getElementById("cart-content-state");
  const cartDrawerTotal = document.getElementById("cart-drawer-total");
  const cartDrawerItemsCount = document.getElementById("cart-drawer-items-count");
  const cartDrawerQtyCount = document.getElementById("cart-drawer-qty-count");
  const minOrderBanner = document.getElementById("min-order-banner");
  const minOrderProgressBar = document.getElementById("min-order-progress-bar");
  const minOrderText = document.getElementById("min-order-text");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  const contactModal = document.getElementById("contact-modal");
  const openContactBtns = document.querySelectorAll(".open-contact-modal");
  const closeContactBtn = document.getElementById("close-contact-btn");

  const pricelistModal = document.getElementById("pricelist-modal");
  const openPricelistBtns = document.querySelectorAll(".open-pricelist-modal");
  const closePricelistBtn = document.getElementById("close-pricelist-btn");
  const pricelistTableBody = document.getElementById("pricelist-table-body");
  const printPricelistBtn = document.getElementById("print-pricelist-btn");

  const checkoutModal = document.getElementById("checkout-modal");
  const closeCheckoutBtn = document.getElementById("close-checkout-btn");
  const proceedToCheckoutBtn = document.getElementById("proceed-to-checkout-btn");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutSubtotal = document.getElementById("checkout-subtotal");
  const checkoutItemsCount = document.getElementById("checkout-items-count");
  const checkoutQtyCount = document.getElementById("checkout-qty-count");
  const copyOrderTextBtn = document.getElementById("copy-order-text-btn");

  // App Initialization
  function init() {
    loadPersistedState();
    renderCategories();
    renderProducts();
    updateCartUI();
    bindEvents();
    populatePricelistTable();
  }

  // Render Category Navigation Pills
  // Render Category Navigation Pills
  function renderCategories() {
    if (!categoryNav) return;
    
    categoryNav.innerHTML = window.CATEGORIES.map(cat => {
      const isActive = state.selectedCategory === cat;
      const count = cat === "ALL" 
        ? window.PRODUCTS_DATA.length 
        : window.PRODUCTS_DATA.filter(p => p.category === cat).length;

      return `
        <button 
          data-category="${cat}" 
          class="category-btn whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 shadow-md ${
            isActive 
              ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 text-white shadow-pink-500/30 ring-2 ring-yellow-400' 
              : 'bg-purple-950/60 hover:bg-purple-900 text-gray-200 border border-white/10'
          }"
        >
          <span>${cat === "ALL" ? "✨ All Products" : cat}</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300'}">${count}</span>
        </button>
      `;
    }).join("");
  }

  // Filter Product Catalog
  function getFilteredProducts() {
    return window.PRODUCTS_DATA.filter(item => {
      // Category filter
      if (state.selectedCategory !== "ALL" && item.category !== state.selectedCategory) {
        return false;
      }
      // S.No filter
      if (state.searchSno.trim() !== "") {
        const snoQuery = state.searchSno.trim();
        if (String(item.id) !== snoQuery && !String(item.id).startsWith(snoQuery)) {
          return false;
        }
      }
      // English Name & Category query
      if (state.searchQuery.trim() !== "") {
        const q = state.searchQuery.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchCat) {
          return false;
        }
      }
      return true;
    });
  }

  // Render Products
  function renderProducts() {
    if (!productsContainer) return;

    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
      productsContainer.innerHTML = `
        <div class="text-center py-16 bg-purple-950/40 border border-white/10 rounded-2xl backdrop-blur-md p-8">
          <div class="text-4xl mb-3">🔍</div>
          <h3 class="text-lg font-bold text-white mb-1">No crackers found</h3>
          <p class="text-gray-300 text-xs max-w-sm mx-auto mb-4">No fireworks match your search query or selected category. Try searching with a different item number or name.</p>
          <button id="reset-filter-btn" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 text-white font-extrabold text-xs transition-transform shadow-lg shadow-pink-500/30">
            Reset All Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById("reset-filter-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          state.searchSno = "";
          state.searchQuery = "";
          state.selectedCategory = "ALL";
          state.expandedCategories = {};
          if (searchSnoInput) searchSnoInput.value = "";
          if (searchNameInput) searchNameInput.value = "";
          renderCategories();
          renderProducts();
        });
      }
      return;
    }

    // Group items by category
    const grouped = {};
    filtered.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });

    let html = "";

    for (const [category, items] of Object.entries(grouped)) {
      // Auto-expand if user is actively searching by S.No/Name, or if single category selected
      const isSearching = state.searchSno.trim() !== "" || state.searchQuery.trim() !== "";
      const isSingleCategorySelected = state.selectedCategory !== "ALL" && state.selectedCategory === category;
      
      // Default is CLOSED (false) unless user clicked to open, or searching, or single category
      const isExpanded = isSearching || isSingleCategorySelected || !!state.expandedCategories[category];

      html += `
        <div class="category-block mb-4">
          <div 
            data-category-name="${category}"
            class="category-toggle-header font-brand w-full bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 text-white py-3.5 px-5 sm:px-6 rounded-xl shadow-lg border border-white/20 flex items-center justify-between mb-2.5 sticky top-[125px] sm:top-[76px] z-20 backdrop-blur-md cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all select-none"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-sm text-yellow-300">✦</span>
              <h3 class="text-sm sm:text-base font-black tracking-wider uppercase text-white drop-shadow">${category}</h3>
              <span class="text-xs bg-black/40 border border-white/20 px-2.5 py-0.5 rounded-full font-bold text-yellow-300">
                ${items.length} ${items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div class="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

          <div class="category-items-container space-y-2.5 transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}">
            ${items.map(product => renderProductCard(product)).join("")}
          </div>
        </div>
      `;
    }

    productsContainer.innerHTML = html;
    bindProductControls();
  }

  // Product Card Template (Matching selvaganapathytraders.in original layout)
  function renderProductCard(product) {
    const qty = parseInt(state.cart[product.id] || 0, 10);
    const itemTotal = qty * product.price;
    const isSelected = qty > 0;

    return `
      <div 
        id="product-card-${product.id}"
        class="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 backdrop-blur-sm border rounded-xl p-2.5 sm:p-3.5 hover:shadow-xl transition-all duration-300 ${
          isSelected 
            ? 'border-pink-500/70 shadow-lg shadow-pink-500/10 ring-1 ring-pink-500/40' 
            : 'border-white/10 hover:border-white/20'
        }"
      >
        <!-- Desktop Grid View -->
        <div class="hidden md:grid md:grid-cols-12 gap-4 items-center">
          <div class="col-span-1 flex justify-center">
            <div class="font-price text-base font-extrabold text-white bg-gray-700/50 rounded-full w-10 h-10 flex items-center justify-center border border-white/10 shadow-inner">
              ${product.id}
            </div>
          </div>
          
          <div class="col-span-4 text-left">
            <div class="font-brand text-white font-bold text-base sm:text-lg break-words leading-tight tracking-tight">
              ${product.name}
            </div>
            <div class="text-gray-300 text-xs sm:text-sm break-words leading-tight mt-1 flex items-center gap-2">
              <span class="bg-purple-950/60 text-pink-300 px-2 py-0.5 rounded border border-pink-500/20 font-semibold text-xs">1 ${product.per}</span>
              <span class="text-gray-400 text-xs">${product.category}</span>
            </div>
          </div>

          <div class="col-span-2 text-center">
            <div class="font-price text-emerald-400 font-extrabold text-2xl tracking-wide">₹${product.price.toFixed(2)}</div>
            <div class="text-gray-400 text-xs font-medium">per ${product.per}</div>
          </div>

          <div class="col-span-3 flex flex-col items-center justify-center">
            <div class="flex items-center space-x-2.5">
              <button 
                data-id="${product.id}" 
                data-action="decrease"
                class="qty-btn flex-shrink-0 aspect-square rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white flex items-center justify-center font-bold shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-200 w-10 h-10 disabled:opacity-30"
                ${qty === 0 ? 'disabled' : ''}
                title="Decrease"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"></path></svg>
              </button>
              
              <input 
                type="number" 
                min="0" 
                max="9999"
                data-id="${product.id}"
                value="${qty}" 
                class="font-price qty-input bg-gray-800/70 text-white px-3 py-2 rounded-lg font-bold text-xl w-16 text-center border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />

              <button 
                data-id="${product.id}" 
                data-action="increase"
                class="qty-btn flex-shrink-0 aspect-square rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center justify-center font-bold shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-200 w-10 h-10"
                title="Increase"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
              </button>
            </div>
            
            <!-- Quick Add buttons -->
            <div class="flex items-center gap-1.5 mt-1.5 font-brand">
              <button data-id="${product.id}" data-add="5" class="quick-add-btn text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/30">+5</button>
              <button data-id="${product.id}" data-add="10" class="quick-add-btn text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/30">+10</button>
              ${qty > 0 ? `<button data-id="${product.id}" data-clear="true" class="quick-clear-btn text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30">Clear</button>` : ''}
            </div>
          </div>

          <div class="col-span-2 text-right pr-2">
            <div class="font-price text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 glow-gold">
              ₹${itemTotal.toFixed(2)}
            </div>
          </div>
        </div>

        <!-- Mobile Layout -->
        <div class="md:hidden">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-start gap-2.5 flex-1 min-w-0">
              <div class="font-price text-xs font-bold text-white bg-gray-700/50 p-1.5 rounded-full w-7 h-7 flex items-center justify-center mt-0.5 flex-shrink-0">
                ${product.id}
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-brand text-white font-bold text-sm leading-tight break-words">
                  ${product.name}
                </div>
                <div class="text-gray-300 text-xs leading-tight mt-1 flex items-center gap-2">
                  <span class="font-price text-emerald-400 font-bold text-sm">₹${product.price.toFixed(2)}</span>
                  <span class="text-gray-400">/ ${product.per}</span>
                </div>
              </div>
            </div>

            <!-- Mobile Subtotal -->
            <div class="text-right flex-shrink-0">
              <div class="font-price text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 glow-gold">
                ₹${itemTotal.toFixed(2)}
              </div>
            </div>
          </div>

          <!-- Mobile Controls Row -->
          <div class="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5 font-brand">
            <div class="flex items-center gap-1">
              <button data-id="${product.id}" data-add="5" class="quick-add-btn text-[10px] font-bold px-2 py-1 rounded bg-purple-900/70 text-purple-200 border border-purple-500/30">+5</button>
              <button data-id="${product.id}" data-add="10" class="quick-add-btn text-[10px] font-bold px-2 py-1 rounded bg-purple-900/70 text-purple-200 border border-purple-500/30">+10</button>
              ${qty > 0 ? `<button data-id="${product.id}" data-clear="true" class="quick-clear-btn text-[10px] font-bold px-2 py-1 rounded bg-red-950/70 text-red-300 border border-red-500/30">✕</button>` : ''}
            </div>

            <div class="flex items-center space-x-2">
              <button 
                data-id="${product.id}" 
                data-action="decrease"
                class="qty-btn bg-gradient-to-r from-pink-500 to-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold shadow text-xs disabled:opacity-30"
                ${qty === 0 ? 'disabled' : ''}
              >
                −
              </button>
              
              <input 
                type="number" 
                min="0" 
                max="9999"
                data-id="${product.id}"
                value="${qty}" 
                class="font-price qty-input bg-gray-800/70 text-white px-1 py-0.5 rounded-lg font-bold w-12 text-center border border-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs"
              />

              <button 
                data-id="${product.id}" 
                data-action="increase"
                class="qty-btn bg-gradient-to-r from-green-500 to-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold shadow text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Bind Listeners for Product Rows
  function bindProductControls() {
    document.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute("data-id"), 10);
        const action = btn.getAttribute("data-action");
        const currentQty = parseInt(state.cart[id] || 0, 10);

        if (action === "increase") {
          updateItemQuantity(id, currentQty + 1);
        } else if (action === "decrease") {
          updateItemQuantity(id, Math.max(0, currentQty - 1));
        }
      });
    });

    document.querySelectorAll(".qty-input").forEach(input => {
      input.addEventListener("change", () => {
        const id = parseInt(input.getAttribute("data-id"), 10);
        const val = parseInt(input.value, 10);
        updateItemQuantity(id, isNaN(val) || val < 0 ? 0 : val);
      });
      input.addEventListener("focus", () => input.select());
    });

    document.querySelectorAll(".quick-add-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute("data-id"), 10);
        const addAmount = parseInt(btn.getAttribute("data-add"), 10);
        const currentQty = parseInt(state.cart[id] || 0, 10);
        updateItemQuantity(id, currentQty + addAmount);
      });
    });

    document.querySelectorAll(".quick-clear-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute("data-id"), 10);
        updateItemQuantity(id, 0);
      });
    });

    // Category Header Accordion Click Handler (Expand / Contract)
    document.querySelectorAll(".category-toggle-header").forEach(header => {
      header.addEventListener("click", () => {
        const catName = header.getAttribute("data-category-name");
        state.expandedCategories[catName] = !state.expandedCategories[catName];
        renderProducts();
      });
    });
  }

  // Update item quantity
  function updateItemQuantity(productId, qty) {
    if (qty <= 0) {
      delete state.cart[productId];
    } else {
      state.cart[productId] = qty;
    }
    saveCartState();
    updateSingleProductUI(productId);
    updateCartUI();
  }

  // Update single product card without full re-render
  function updateSingleProductUI(productId) {
    const product = window.PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const card = document.getElementById(`product-card-${productId}`);
    if (card) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = renderProductCard(product);
      const newCard = tempDiv.firstElementChild;
      card.replaceWith(newCard);
      bindCardControls(newCard);
    }
  }

  function bindCardControls(container) {
    container.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute("data-id"), 10);
        const action = btn.getAttribute("data-action");
        const currentQty = parseInt(state.cart[id] || 0, 10);
        if (action === "increase") updateItemQuantity(id, currentQty + 1);
        else if (action === "decrease") updateItemQuantity(id, Math.max(0, currentQty - 1));
      });
    });

    container.querySelectorAll(".qty-input").forEach(input => {
      input.addEventListener("change", () => {
        const id = parseInt(input.getAttribute("data-id"), 10);
        const val = parseInt(input.value, 10);
        updateItemQuantity(id, isNaN(val) || val < 0 ? 0 : val);
      });
      input.addEventListener("focus", () => input.select());
    });

    container.querySelectorAll(".quick-add-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute("data-id"), 10);
        const addAmount = parseInt(btn.getAttribute("data-add"), 10);
        const currentQty = parseInt(state.cart[id] || 0, 10);
        updateItemQuantity(id, currentQty + addAmount);
      });
    });

    container.querySelectorAll(".quick-clear-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute("data-id"), 10);
        updateItemQuantity(id, 0);
      });
    });
  }

  // Update Cart UI
  function updateCartUI() {
    const summary = getCartSummary();

    // Floating Cart Widget
    if (floatingCart) {
      if (summary.totalItems > 0) {
        floatingCart.classList.remove("hidden");
        floatingCart.classList.add("flex");
      } else {
        floatingCart.classList.add("hidden");
        floatingCart.classList.remove("flex");
      }
    }
    if (floatingCartAmount) floatingCartAmount.innerText = formatINR(summary.grandTotal);
    if (floatingCartCount) floatingCartCount.innerText = `${summary.totalQuantity} items`;
    if (headerCartCount) {
      headerCartCount.innerText = summary.totalQuantity;
      headerCartCount.style.display = summary.totalQuantity > 0 ? "inline-flex" : "none";
    }

    // Cart Drawer Content
    if (cartDrawerTotal) cartDrawerTotal.innerText = formatINR(summary.grandTotal);
    if (cartDrawerItemsCount) cartDrawerItemsCount.innerText = summary.totalItems;
    if (cartDrawerQtyCount) cartDrawerQtyCount.innerText = summary.totalQuantity;

    // Hide minimum order banner
    if (minOrderBanner) {
      minOrderBanner.style.display = "none";
    }

    // Checkout Button State
    if (proceedToCheckoutBtn) {
      if (summary.totalItems > 0) {
        proceedToCheckoutBtn.disabled = false;
        proceedToCheckoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
        proceedToCheckoutBtn.innerHTML = `Proceed to Checkout (${formatINR(summary.grandTotal)}) ➔`;
      } else {
        proceedToCheckoutBtn.disabled = true;
        proceedToCheckoutBtn.classList.add("opacity-50", "cursor-not-allowed");
        proceedToCheckoutBtn.innerHTML = "Cart is Empty";
      }
    }

    // Render Drawer Items List
    if (cartItemsList && cartEmptyState && cartContentState) {
      if (summary.cartItems.length === 0) {
        cartEmptyState.classList.remove("hidden");
        cartContentState.classList.add("hidden");
        cartItemsList.innerHTML = "";
      } else {
        cartEmptyState.classList.add("hidden");
        cartContentState.classList.remove("hidden");
        
        cartItemsList.innerHTML = summary.cartItems.map(item => `
          <div class="cart-item-row flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
            <div class="flex-1 min-w-0 pr-2">
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] font-bold bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded border border-slate-700">${item.id}</span>
                <span class="text-xs font-bold text-white truncate">${item.name}</span>
              </div>
              <div class="text-[11px] text-slate-400 mt-1">
                <span class="text-emerald-400 font-semibold">₹${item.price.toFixed(2)}</span> × ${item.qty} ${item.per} = <span class="text-white font-bold">₹${item.itemTotal.toFixed(2)}</span>
              </div>
            </div>

            <div class="flex items-center space-x-1.5 flex-shrink-0">
              <button data-id="${item.id}" data-action="decrease" class="drawer-qty-btn w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center border border-slate-700">−</button>
              <span class="text-xs font-bold text-white px-1 min-w-[20px] text-center">${item.qty}</span>
              <button data-id="${item.id}" data-action="increase" class="drawer-qty-btn w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center border border-slate-700">+</button>
              <button data-id="${item.id}" data-action="delete" class="drawer-del-btn w-6 h-6 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs flex items-center justify-center ml-1 border border-rose-800" title="Remove item">✕</button>
            </div>
          </div>
        `).join("");

        // Bind events inside drawer
        cartItemsList.querySelectorAll(".drawer-qty-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"), 10);
            const action = btn.getAttribute("data-action");
            const currentQty = parseInt(state.cart[id] || 0, 10);
            if (action === "increase") updateItemQuantity(id, currentQty + 1);
            else if (action === "decrease") updateItemQuantity(id, currentQty - 1);
          });
        });

        cartItemsList.querySelectorAll(".drawer-del-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"), 10);
            updateItemQuantity(id, 0);
          });
        });
      }
    }
  }

  // Populate Pricelist Table (Modal)
  function populatePricelistTable() {
    if (!pricelistTableBody) return;

    pricelistTableBody.innerHTML = window.PRODUCTS_DATA.map(p => `
      <tr class="border-b border-slate-800 hover:bg-slate-900/60 transition-colors">
        <td class="px-3 py-2.5 text-center font-bold text-slate-400 text-xs">${p.id}</td>
        <td class="px-3 py-2.5 font-bold text-white text-xs">${p.name}</td>
        <td class="px-3 py-2.5 text-slate-300 text-xs">${p.category}</td>
        <td class="px-3 py-2.5 text-slate-400 text-xs text-center">${p.per}</td>
        <td class="px-3 py-2.5 text-right font-extrabold text-emerald-400 text-xs">₹ ${p.price.toFixed(2)}</td>
      </tr>
    `).join("");
  }

  // Drawer / Modal Handlers
  function openCart() {
    if (!cartDrawer || !cartDrawerBackdrop) return;
    cartDrawerBackdrop.classList.remove("hidden");
    setTimeout(() => {
      cartDrawer.classList.remove("translate-x-full");
    }, 10);
  }

  function closeCart() {
    if (!cartDrawer || !cartDrawerBackdrop) return;
    cartDrawer.classList.add("translate-x-full");
    setTimeout(() => {
      cartDrawerBackdrop.classList.add("hidden");
    }, 300);
  }

  function openCheckout() {
    closeCart();
    const summary = getCartSummary();
    if (summary.totalItems === 0) {
      alert("Your cart is empty. Please select products to place an order.");
      return;
    }

    if (checkoutSubtotal) checkoutSubtotal.innerText = formatINR(summary.grandTotal);
    if (checkoutItemsCount) checkoutItemsCount.innerText = summary.totalItems;
    if (checkoutQtyCount) checkoutQtyCount.innerText = summary.totalQuantity;

    // Prefill form
    if (checkoutForm) {
      checkoutForm.elements["cust_name"].value = state.customer.name || "";
      checkoutForm.elements["cust_phone"].value = state.customer.phone || "";
      if (checkoutForm.elements["cust_email"]) {
        checkoutForm.elements["cust_email"].value = state.customer.email || "";
      }
      checkoutForm.elements["cust_address"].value = state.customer.address || "";
      checkoutForm.elements["cust_city"].value = state.customer.city || "";
      checkoutForm.elements["cust_pincode"].value = state.customer.pincode || "";
    }

    if (checkoutModal) checkoutModal.classList.remove("hidden");
  }

  let activeOrderNo = "";

  function getOrGenerateOrderNo() {
    if (!activeOrderNo) {
      activeOrderNo = "SGT-2026-" + Math.floor(100000 + Math.random() * 900000);
    }
    return activeOrderNo;
  }

  function resetOrderNo() {
    activeOrderNo = "";
  }

  function closeCheckout() {
    if (checkoutModal) checkoutModal.classList.add("hidden");
  }

  // Build Order Plain Text (For WhatsApp / Email / Clipboard)
  function buildOrderPlainText() {
    const summary = getCartSummary();
    const cust = state.customer;
    const dateStr = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    const timeStr = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
    const orderNo = getOrGenerateOrderNo();

    let text = `=================================================\n`;
    text += `       SELVAGANAPATHY TRADERS - SIVAKASI\n`;
    text += `    SUN FLAG FIREWORKS & SPARKLERS 2026\n`;
    text += `=================================================\n`;
    text += `🧾 OFFICIAL ORDER CONFIRMATION & ITEM LIST\n`;
    text += `=================================================\n`;
    text += `Order Reference: ${orderNo}\n`;
    text += `Date & Time: ${dateStr} at ${timeStr}\n`;
    text += `Order Status: ✅ CONFIRMED & REGISTERED\n`;
    text += `-------------------------------------------------\n`;
    text += `👤 CUSTOMER & DELIVERY DETAILS:\n`;
    text += `• Customer Name: ${cust.name.trim() || 'Valued Customer'}\n`;
    text += `• Contact Phone: ${cust.phone.trim()}\n`;
    if (cust.email && cust.email.trim()) {
      text += `• Email Address: ${cust.email.trim()}\n`;
    }
    text += `• Delivery Address: ${cust.address.trim()}, ${cust.city.trim()}${cust.pincode ? ' - ' + cust.pincode.trim() : ''}\n`;
    text += `-------------------------------------------------\n`;
    text += `📦 COMPLETE ORDER LIST (ITEMIZED BREAKDOWN):\n`;
    text += `-------------------------------------------------\n`;
    
    summary.cartItems.forEach((item, index) => {
      text += `${index + 1}. [Item #${item.id}] ${item.name}\n`;
      text += `   ↳ Category: ${item.category}\n`;
      text += `   ↳ Qty: ${item.qty} ${item.per} × ₹${item.price.toFixed(2)} = ₹${item.itemTotal.toFixed(2)}\n`;
    });

    text += `-------------------------------------------------\n`;
    text += `📊 ORDER SUMMARY & TOTALS:\n`;
    text += `• Total Product Varieties: ${summary.totalItems}\n`;
    text += `• Total Package Units: ${summary.totalQuantity} boxes/packets\n`;
    text += `💰 NET ORDER TOTAL: ₹ ${summary.grandTotal.toFixed(2)}\n`;
    text += `=================================================\n`;
    text += `🏢 MERCHANT & FACTORY CONTACT:\n`;
    text += `• Selvaganapathy Traders (Sun Flag Fireworks)\n`;
    text += `• Vembakkottai Road, Kananjampatti - Sivakasi, Tamil Nadu\n`;
    text += `• Mobile / WhatsApp: +91 6383144854 / +91 99440 87728\n`;
    text += `• Record Email: selvaganapathytraders@gmail.com\n`;
    text += `• Website: https://www.selvaganapathytraders.in\n`;
    text += `=================================================\n`;

    return text;
  }

  // Copy Order to Clipboard
  function copyOrderToClipboard(btnElement) {
    const text = buildOrderPlainText();
    navigator.clipboard.writeText(text).then(() => {
      const btn = btnElement || document.getElementById("copy-order-text-btn");
      if (btn) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = "<span>✓ Order Details Copied!</span>";
        btn.classList.add("bg-emerald-600", "text-white");
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove("bg-emerald-600", "text-white");
        }, 2500);
      } else {
        alert("Order list copied to clipboard!");
      }
    }).catch(err => {
      console.error("Could not copy", err);
      prompt("Copy your order quotation below:", text);
    });
  }

  // Open Gmail to Shopkeeper's Default Record Address
  function openShopkeeperGmailOrder() {
    const cust = state.customer;
    const summary = getCartSummary();
    const orderNo = getOrGenerateOrderNo();
    const subject = encodeURIComponent(`[NEW ORDER] #${orderNo} - ${cust.name || 'Customer'} - ₹${summary.grandTotal.toFixed(2)}`);
    const body = encodeURIComponent(buildOrderPlainText());
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${DEFAULT_GMAIL}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  }

  // Open Gmail to Customer's Email (with CC to Shopkeeper)
  function openCustomerGmailOrder() {
    const cust = state.customer;
    if (!cust.email || !cust.email.trim()) {
      alert("No customer email address was entered in the order form. You can forward the quotation from your inbox!");
      return;
    }
    const summary = getCartSummary();
    const orderNo = getOrGenerateOrderNo();
    const subject = encodeURIComponent(`Diwali 2026 Order Confirmation #${orderNo} - Selvaganapathy Traders Sivakasi`);
    const body = encodeURIComponent(buildOrderPlainText());
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cust.email.trim())}&cc=${DEFAULT_GMAIL}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  }

  // Generate WhatsApp Order Message (English)
  function buildWhatsAppMessage(phoneTarget) {
    const summary = getCartSummary();
    const cust = state.customer;
    const orderNo = getOrGenerateOrderNo();

    let text = `✨ *SELVAGANAPATHY TRADERS - SIVAKASI* ✨\n`;
    text += `*SUN FLAG FIREWORKS & SPARKLERS 2026*\n`;
    text += `=========================================\n`;
    text += `🧾 *OFFICIAL ORDER CONFIRMATION & ITEM LIST*\n`;
    text += `=========================================\n`;
    text += `*Order Ref:* \`${orderNo}\`\n`;
    text += `*Order Status:* ✅ *CONFIRMED*\n`;
    text += `-----------------------------------------\n`;
    text += `👤 *CUSTOMER & DELIVERY DETAILS:*\n`;
    text += `• *Name:* ${cust.name.trim()}\n`;
    text += `• *Phone:* ${cust.phone.trim()}\n`;
    if (cust.email && cust.email.trim()) {
      text += `• *Email:* ${cust.email.trim()}\n`;
    }
    text += `• *Delivery Address:* ${cust.address.trim()}, ${cust.city.trim()}${cust.pincode ? ' - ' + cust.pincode.trim() : ''}\n`;
    if (cust.notes && cust.notes.trim()) {
      text += `• *Notes / Instructions:* ${cust.notes.trim()}\n`;
    }
    text += `-----------------------------------------\n`;
    text += `📦 *ITEMIZED ORDER LIST:*\n`;
    
    summary.cartItems.forEach((item, index) => {
      text += `${index + 1}. [Item #${item.id}] *${item.name}*\n   ↳ Qty: *${item.qty}* ${item.per} × ₹${item.price.toFixed(2)} = *₹${item.itemTotal.toFixed(2)}*\n`;
    });

    text += `-----------------------------------------\n`;
    text += `📊 *SUMMARY & TOTALS:*\n`;
    text += `• *Total Varieties:* ${summary.totalItems}\n`;
    text += `• *Total Packages:* ${summary.totalQuantity}\n`;
    text += `💰 *NET ORDER TOTAL: ₹ ${summary.grandTotal.toFixed(2)}*\n`;
    text += `=========================================\n`;
    text += `✅ *Order placed successfully. Formal e-PDF estimate generated & dispatched to email / WhatsApp.*\n`;
    text += `_Location: Vembakkottai Road, Kananjampatti - Sivakasi_\n`;

    const encoded = encodeURIComponent(text);
    const target = phoneTarget || PRIMARY_PHONE;
    return `https://wa.me/${target}?text=${encoded}`;
  }

  // Generate Customer's Personal WhatsApp Link
  function buildCustomerWhatsAppMessage() {
    const cust = state.customer;
    const cleanPhone = cust.phone.replace(/[^0-9]/g, "");
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    return buildWhatsAppMessage(targetPhone);
  }

  // Build Clean Corporate A4 HTML Estimate
  function buildEstimateHtml(summary, cust, orderNo, dateStr) {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; padding: 20px; font-size: 12px; background: #ffffff; width: 100%; box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px;">
          <div>
            <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 2px 0;">SELVAGANAPATHY TRADERS</h1>
            <div style="font-size: 11px; font-weight: 700; color: #d97706; text-transform: uppercase; margin: 0 0 4px 0;">Sun Flag Fireworks &amp; Sparklers • Sivakasi</div>
            <div style="font-size: 10px; color: #475569; line-height: 1.4;">
              Vembakkottai Road, Kananjampatti - Sivakasi, Tamil Nadu, India<br>
              Phone: +91 6383144854 / +91 99440 87728 | Email: selvaganapathytraders@gmail.com
            </div>
          </div>
          <div style="text-align: right;">
            <span style="display: inline-block; background: #0f172a; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">Official Order Estimate</span>
            <div style="font-size: 10px; color: #475569; margin-top: 6px; line-height: 1.4;">
              <strong>Estimate Ref:</strong> ${orderNo}<br>
              <strong>Date:</strong> ${dateStr}
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; font-size: 11px;">
          <div style="line-height: 1.5;">
            <strong style="color: #0f172a;">CUSTOMER DETAILS:</strong><br>
            <strong>Name:</strong> ${cust.name || 'Valued Customer'}<br>
            <strong>Phone:</strong> ${cust.phone || '-'}<br>
            ${cust.email ? '<strong>Email:</strong> ' + cust.email + '<br>' : ''}
            <strong>Address:</strong> ${cust.address || '-'}${cust.city ? ', ' + cust.city : ''}${cust.pincode ? ' - ' + cust.pincode : ''}
          </div>
          <div style="text-align: right; line-height: 1.5;">
            <strong style="color: #0f172a;">ORDER SUMMARY:</strong><br>
            <strong>Product Varieties:</strong> ${summary.totalItems}<br>
            <strong>Total Package Units:</strong> ${summary.totalQuantity}<br>
            <strong>Booking Status:</strong> <span style="color: #059669; font-weight: bold; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">✅ Confirmed &amp; Dispatched</span><br>
            <strong>Dispatch Status:</strong> <span style="color: #059669; font-weight: bold;">Ready for Factory Packing</span>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 10px;">
          <thead>
            <tr style="background: #0f172a; color: #ffffff;">
              <th style="padding: 6px 8px; text-align: center; width: 30px;">#</th>
              <th style="padding: 6px 8px; text-align: left;">Product Description</th>
              <th style="padding: 6px 8px; text-align: left; width: 120px;">Category</th>
              <th style="padding: 6px 8px; text-align: center; width: 50px;">Unit</th>
              <th style="padding: 6px 8px; text-align: right; width: 70px;">Rate (₹)</th>
              <th style="padding: 6px 8px; text-align: center; width: 40px;">Qty</th>
              <th style="padding: 6px 8px; text-align: right; width: 75px;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${summary.cartItems.map((item, index) => `
              <tr style="border-bottom: 1px solid #e2e8f0; background: ${index % 2 === 1 ? '#f8fafc' : '#ffffff'};">
                <td style="padding: 5px 8px; text-align: center; font-weight: bold; color: #64748b;">${item.id}</td>
                <td style="padding: 5px 8px; font-weight: bold;">${item.name}</td>
                <td style="padding: 5px 8px; color: #475569;">${item.category}</td>
                <td style="padding: 5px 8px; text-align: center;">${item.per}</td>
                <td style="padding: 5px 8px; text-align: right;">${item.price.toFixed(2)}</td>
                <td style="padding: 5px 8px; text-align: center; font-weight: bold;">${item.qty}</td>
                <td style="padding: 5px 8px; text-align: right; font-weight: bold;">${item.itemTotal.toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 10px; gap: 15px;">
          <div style="flex: 1; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; background: #f8fafc; font-size: 10px;">
            <strong style="color: #0f172a; text-transform: uppercase;">🏭 Sivakasi Factory Dispatch Terms:</strong>
            <ul style="margin: 4px 0 0 12px; padding: 0; line-height: 1.4; color: #475569;">
              <li>Orders are safely packed with industrial cartons.</li>
              <li>Dispatches are routed via leading road parcel transport services.</li>
              <li>Support & Tracking: <strong>+91 6383144854 / +91 99440 87728</strong></li>
            </ul>
          </div>

          <div style="width: 250px; border: 1px solid #0f172a; border-radius: 6px; overflow: hidden; background: #ffffff;">
            <div style="display: flex; justify-content: space-between; padding: 5px 10px; font-size: 10px; border-bottom: 1px solid #e2e8f0;">
              <span>Product Varieties:</span>
              <strong>${summary.totalItems}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 5px 10px; font-size: 10px; border-bottom: 1px solid #e2e8f0;">
              <span>Total Packages:</span>
              <strong>${summary.totalQuantity} boxes</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 7px 10px; background: #0f172a; color: #ffffff; font-size: 11px; font-weight: 800;">
              <span>NET TOTAL:</span>
              <span>₹ ${summary.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 16px; padding-top: 8px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 9px; color: #64748b;">
          <div>
            <strong>SELVAGANAPATHY TRADERS (SUN FLAG FIREWORKS)</strong><br>
            Kananjampatti - Sivakasi, Tamil Nadu | selvaganapathytraders@gmail.com
          </div>
          <div style="text-align: right; border-top: 1px solid #0f172a; padding-top: 2px; font-weight: bold; color: #0f172a;">
            Authorized Signatory / Selvaganapathy Traders
          </div>
        </div>
      </div>
    `;
  }

  // Real PDF Generator & Automated Shopkeeper Dispatch
  async function downloadAndSendPdf(summary, cust, orderNo) {
    const dateStr = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const container = document.createElement("div");
    container.innerHTML = buildEstimateHtml(summary, cust, orderNo, dateStr);
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "780px";
    document.body.appendChild(container);

    if (window.html2pdf) {
      const opt = {
        margin: [6, 6, 6, 6],
        filename: `Estimate_${orderNo}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      try {
        // 1. Download PDF file directly for customer
        await html2pdf().set(opt).from(container).save();

        // 2. Generate PDF Blob and send directly to shopkeeper emails
        const pdfBlob = await html2pdf().set(opt).from(container).outputPdf('blob');
        dispatchPdfToShopkeeper(pdfBlob, orderNo, cust, summary);
      } catch (err) {
        console.warn("html2pdf generation error, using popup fallback:", err);
        printOrderEstimate();
      } finally {
        if (container.parentNode) container.parentNode.removeChild(container);
      }
    } else {
      printOrderEstimate();
      if (container.parentNode) container.parentNode.removeChild(container);
    }
  }

  // Dispatch only the PDF file to Shopkeeper, Backups & Customer
  function dispatchPdfToShopkeeper(pdfBlob, orderNo, cust, summary) {
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = function () {
      const base64data = reader.result;

      // 1. Send to Vercel Serverless Function on same domain (direct SMTP dispatch)
      fetch("/api/send-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNo,
          customer: cust,
          summary,
          pdfBase64: base64data
        })
      }).catch(() => {});

      // Full Multi-Line Summary Table
      const fullListText = summary.cartItems.map((item, idx) => 
        `${idx + 1}. [Code #${item.id}] ${item.name} (${item.category}) - ${item.qty} ${item.per} x ₹${item.price.toFixed(2)} = ₹${item.itemTotal.toFixed(2)}`
      ).join("\n");

      // 2. Prepare FormSubmit data for Shopkeeper
      const formSubmitData = new FormData();
      formSubmitData.append("attachment", pdfBlob, `Estimate_${orderNo}.pdf`);
      formSubmitData.append("_subject", `New Customer Purchase Receipt [${orderNo}] - ₹${summary.grandTotal.toFixed(2)} - ${cust.name || 'Customer'}`);
      formSubmitData.append("_template", "table");
      formSubmitData.append("_captcha", "false");
      formSubmitData.append("Order_Reference", orderNo);
      formSubmitData.append("Order_Date", new Date().toLocaleDateString("en-IN"));
      formSubmitData.append("Customer_Name", cust.name || "Valued Customer");
      formSubmitData.append("Customer_Phone", cust.phone || "-");
      formSubmitData.append("Customer_Email", cust.email || "Not Provided");
      formSubmitData.append("Delivery_Address", `${cust.address || ''}, ${cust.city || ''} ${cust.pincode ? '- ' + cust.pincode : ''}`);
      formSubmitData.append("Total_Varieties", `${summary.totalItems} items`);
      formSubmitData.append("Total_Packages", `${summary.totalQuantity} boxes`);
      formSubmitData.append("Grand_Total_INR", `₹ ${summary.grandTotal.toFixed(2)}`);

      // Add each ordered item with individual line details
      summary.cartItems.forEach((item, index) => {
        const itemNum = String(index + 1).padStart(2, '0');
        const cleanName = item.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
        formSubmitData.append(`Item_${itemNum}_${cleanName}`, `Code #${item.id} | ${item.name} (${item.category}) | ${item.per} | Rate: ₹${item.price.toFixed(2)} | Qty: ${item.qty} | Subtotal: ₹${item.itemTotal.toFixed(2)}`);
      });
      formSubmitData.append("Full_Receipt_Bill", fullListText);

      // Add CCs & reply-to for customer and secondary shopkeeper
      const ccList = ["sudali599@gmail.com"];
      const hasCustEmail = cust.email && cust.email.trim() && cust.email.includes("@");
      if (hasCustEmail) {
        ccList.push(cust.email.trim());
        formSubmitData.append("_replyto", cust.email.trim());
      }
      formSubmitData.append("_cc", ccList.join(","));

      // Send to Selvaganapathy Traders Gmail
      fetch("https://formsubmit.co/ajax/selvaganapathytraders@gmail.com", {
        method: "POST",
        body: formSubmitData
      }).catch(() => {});

      // Send to Sudali Gmail
      fetch("https://formsubmit.co/ajax/sudali599@gmail.com", {
        method: "POST",
        body: formSubmitData
      }).catch(() => {});

      // 3. If Customer provided an email, dispatch direct receipt copies directly to the customer
      if (hasCustEmail) {
        const custEmailTrimmed = cust.email.trim();

        // A. FormData with PDF attachment to customer
        const customerFormData = new FormData();
        customerFormData.append("attachment", pdfBlob, `Estimate_${orderNo}.pdf`);
        customerFormData.append("_subject", `Your Order Estimate & Receipt [${orderNo}] - Selvaganapathy Traders Sivakasi`);
        customerFormData.append("_template", "table");
        customerFormData.append("_captcha", "false");
        customerFormData.append("Order_Reference", orderNo);
        customerFormData.append("Order_Date", new Date().toLocaleDateString("en-IN"));
        customerFormData.append("Customer_Name", cust.name || "Valued Customer");
        customerFormData.append("Customer_Phone", cust.phone || "-");
        customerFormData.append("Customer_Email", custEmailTrimmed);
        customerFormData.append("Delivery_Address", `${cust.address || ''}, ${cust.city || ''} ${cust.pincode ? '- ' + cust.pincode : ''}`);
        customerFormData.append("Total_Varieties", `${summary.totalItems} items`);
        customerFormData.append("Total_Packages", `${summary.totalQuantity} boxes`);
        customerFormData.append("Grand_Total_INR", `₹ ${summary.grandTotal.toFixed(2)}`);
        customerFormData.append("Full_Receipt_Bill", fullListText);

        summary.cartItems.forEach((item, index) => {
          const itemNum = String(index + 1).padStart(2, '0');
          const cleanName = item.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
          customerFormData.append(`Item_${itemNum}_${cleanName}`, `Code #${item.id} | ${item.name} (${item.category}) | ${item.per} | Rate: ₹${item.price.toFixed(2)} | Qty: ${item.qty} | Subtotal: ₹${item.itemTotal.toFixed(2)}`);
        });

        fetch(`https://formsubmit.co/ajax/${encodeURIComponent(custEmailTrimmed)}`, {
          method: "POST",
          body: customerFormData
        }).catch(() => {});

        // B. Also JSON fallback to customer
        fetch(`https://formsubmit.co/ajax/${encodeURIComponent(custEmailTrimmed)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            _subject: `Order Receipt Confirmation [${orderNo}] - Selvaganapathy Traders`,
            _template: "table",
            _captcha: "false",
            Order_Reference: orderNo,
            Customer_Name: cust.name || "Valued Customer",
            Total_Items: `${summary.totalItems} varieties (${summary.totalQuantity} boxes)`,
            Grand_Total: `₹ ${summary.grandTotal.toFixed(2)}`,
            Receipt_Summary: fullListText,
            Store_Contact: "Selvaganapathy Traders, Sivakasi | +91 6383144854 / +91 99440 87728"
          })
        }).catch(() => {});
      }
    };
  }

  // Fallback Print
  function printOrderEstimate() {
    const summary = getCartSummary();
    const cust = state.customer;
    const dateStr = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    const orderNo = getOrGenerateOrderNo();

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download or print the e-PDF estimate.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Estimate ${orderNo} - Selvaganapathy Traders Sivakasi</title>
        <meta charset="utf-8">
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div style="text-align: right; padding: 10px;">
          <button onclick="window.print()" style="padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">🖨️ Print / Save as PDF</button>
        </div>
        ${buildEstimateHtml(summary, cust, orderNo, dateStr)}
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  // Bind UI Events
  function bindEvents() {
    // S.No Search
    if (searchSnoInput) {
      searchSnoInput.addEventListener("input", e => {
        state.searchSno = e.target.value;
        renderProducts();
      });
    }

    // Name Search
    if (searchNameInput) {
      searchNameInput.addEventListener("input", e => {
        state.searchQuery = e.target.value;
        renderProducts();
      });
    }

    // Clear Search
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        state.searchSno = "";
        state.searchQuery = "";
        if (searchSnoInput) searchSnoInput.value = "";
        if (searchNameInput) searchNameInput.value = "";
        renderProducts();
      });
    }

    // Category Filter Navigation
    if (categoryNav) {
      categoryNav.addEventListener("click", e => {
        const btn = e.target.closest(".category-btn");
        if (!btn) return;
        const cat = btn.getAttribute("data-category");
        state.selectedCategory = cat;
        renderCategories();
        renderProducts();
      });
    }

    // Floating Cart Click
    if (floatingCart) {
      floatingCart.addEventListener("click", openCart);
    }

    const headerCartBtn = document.getElementById("header-cart-btn");
    if (headerCartBtn) {
      headerCartBtn.addEventListener("click", openCart);
    }

    // Cart Drawer close
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
    if (cartDrawerBackdrop) cartDrawerBackdrop.addEventListener("click", closeCart);

    // Clear entire cart
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your cart?")) {
          state.cart = {};
          saveCartState();
          renderProducts();
          updateCartUI();
        }
      });
    }

    // Checkout modal openers/closers
    if (proceedToCheckoutBtn) proceedToCheckoutBtn.addEventListener("click", openCheckout);
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", closeCheckout);

    // Copy order text button
    if (copyOrderTextBtn) {
      copyOrderTextBtn.addEventListener("click", copyOrderToClipboard);
    }

    // Open Order Success Modal
    function openOrderSuccessModal() {
      const orderModal = document.getElementById("order-success-modal");
      if (!orderModal) return;

      const summary = getCartSummary();
      const cust = state.customer;
      const orderNo = getOrGenerateOrderNo();
      const upiUrl = `upi://pay?pa=${PRIMARY_UPI_ID}&pn=Selvaganapathy+Traders&am=${summary.grandTotal.toFixed(2)}&cu=INR&tn=Order+${orderNo}`;

      const refNoEl = document.getElementById("order-success-ref-no");
      const nameEl = document.getElementById("order-success-cust-name");
      const countEl = document.getElementById("order-success-items-count");
      const amountEl = document.getElementById("order-success-amount");
      const phoneEl = document.getElementById("order-success-cust-phone");
      const phoneBtnEl = document.getElementById("order-success-cust-phone-btn");

      if (refNoEl) refNoEl.textContent = orderNo;
      if (nameEl) nameEl.textContent = cust.name || "Valued Customer";
      if (countEl) countEl.textContent = `${summary.totalItems} varieties (${summary.totalQuantity} total packages)`;
      if (amountEl) amountEl.textContent = `₹ ${summary.grandTotal.toFixed(2)}`;
      if (phoneEl) phoneEl.textContent = cust.phone || "your phone";
      if (phoneBtnEl) phoneBtnEl.textContent = cust.phone || "your phone";

      const custEmailStatusEl = document.getElementById("order-success-cust-email-status");
      const custEmailValEl = document.getElementById("order-success-cust-email-val");
      if (custEmailStatusEl && custEmailValEl) {
        if (cust.email && cust.email.trim() && cust.email.includes("@")) {
          custEmailValEl.textContent = cust.email.trim();
          custEmailStatusEl.classList.remove("hidden");
        } else {
          custEmailStatusEl.classList.add("hidden");
        }
      }

      orderModal.classList.remove("hidden");
    }

    function closeOrderSuccessModal() {
      const orderModal = document.getElementById("order-success-modal");
      if (orderModal) orderModal.classList.add("hidden");
    }

    // Checkout Form Submission
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", e => {
        e.preventDefault();
        state.customer = {
          name: checkoutForm.elements["cust_name"].value,
          phone: checkoutForm.elements["cust_phone"].value,
          email: checkoutForm.elements["cust_email"] ? checkoutForm.elements["cust_email"].value : "",
          address: checkoutForm.elements["cust_address"].value,
          city: checkoutForm.elements["cust_city"].value,
          pincode: checkoutForm.elements["cust_pincode"].value
        };
        saveCustomerState();

        const submitAction = e.submitter ? e.submitter.getAttribute("data-action") : "place_order_all";

        if (submitAction === "copy_order") {
          copyOrderToClipboard();
        } else {
          closeCheckout();
          openOrderSuccessModal();
          
          const summary = getCartSummary();
          const cust = state.customer;
          const orderNo = getOrGenerateOrderNo();

          // 1. Automatically generate/download PDF and send PDF copy to shopkeeper
          downloadAndSendPdf(summary, cust, orderNo);

          // 2. Start automatic redirection back to main shopping catalog
          startAutoRedirectCountdown();
        }
      });
    }

    let redirectTimer = null;
    function startAutoRedirectCountdown() {
      let secondsLeft = 4;
      const countdownEl = document.getElementById("redirect-countdown");
      if (countdownEl) countdownEl.textContent = secondsLeft;

      if (redirectTimer) clearInterval(redirectTimer);
      redirectTimer = setInterval(() => {
        secondsLeft -= 1;
        if (countdownEl) countdownEl.textContent = secondsLeft;
        if (secondsLeft <= 0) {
          clearInterval(redirectTimer);
          // Reset cart & return to home view
          state.cart = {};
          resetOrderNo();
          saveCartState();
          renderProducts();
          updateCartUI();
          closeOrderSuccessModal();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 1000);
    }

    // Automatic Background Dispatch to Backend API & FormSubmit
    async function dispatchOrderToBackend(summary, cust, orderNo) {
      const emailContent = {
        _subject: `New Diwali 2026 Purchase [${orderNo}] - ₹${summary.grandTotal.toFixed(2)} - ${cust.name || 'Customer'}`,
        _template: "table",
        _captcha: "false",
        Order_Reference: orderNo,
        Order_Date: new Date().toLocaleDateString("en-IN"),
        Customer_Name: cust.name || "Valued Customer",
        Customer_Phone: cust.phone || "-",
        Customer_Email: cust.email || "Not Provided",
        Delivery_Address: `${cust.address || ''}, ${cust.city || ''} ${cust.pincode ? '- ' + cust.pincode : ''}`,
        Special_Notes: cust.notes || "None",
        Total_Varieties: `${summary.totalItems} items`,
        Total_Packages: `${summary.totalQuantity} boxes`,
        Grand_Total_INR: `₹ ${summary.grandTotal.toFixed(2)}`,
        Itemized_Bill: summary.cartItems.map(i => `#${i.id} | ${i.name} (${i.category}) | ${i.per} | Rate: ₹${i.price.toFixed(2)} | Qty: ${i.qty} | Total: ₹${i.itemTotal.toFixed(2)}`).join("\n\n")
      };

      // 1. Direct FormSubmit Email Dispatch to Shopkeeper (selvaganapathytraders@gmail.com)
      fetch("https://formsubmit.co/ajax/selvaganapathytraders@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(emailContent)
      }).catch(e => console.warn("Shopkeeper email dispatch:", e));

      // 2. Direct FormSubmit Email Dispatch to Shopkeeper Backup (sudali599@gmail.com)
      fetch("https://formsubmit.co/ajax/sudali599@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(emailContent)
      }).catch(e => console.warn("Backup email dispatch:", e));

      // 3. Direct FormSubmit to Customer Email if provided
      if (cust.email && cust.email.includes("@")) {
        fetch(`https://formsubmit.co/ajax/${cust.email.trim()}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(emailContent)
        }).catch(() => {});
      }

      // 4. REST API Server endpoint (Fireworks-Server)
      const payload = {
        orderNo,
        date: new Date().toLocaleDateString("en-IN"),
        customer: cust,
        totalItems: summary.totalItems,
        totalQuantity: summary.totalQuantity,
        grandTotal: summary.grandTotal,
        cartItems: summary.cartItems.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          per: item.per,
          price: item.price,
          qty: item.qty,
          itemTotal: item.itemTotal
        }))
      };

      const endpoints = [
        "https://fireworks-server.vercel.app/mail/send-order",
        "http://localhost:3000/mail/send-order"
      ];

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            console.log("Order successfully registered with server dispatch:", endpoint);
            break;
          }
        } catch (e) {
          // Silent fallback
        }
      }
    }

    // Wire up Order Success Modal Action Buttons
    const closeSuccessBtn = document.getElementById("close-order-success-btn");
    const downloadPdfBtn = document.getElementById("order-success-download-pdf-btn");
    const successCopyBtn = document.getElementById("order-success-copy-text-btn");
    const newOrderBtn = document.getElementById("order-success-new-order-btn");

    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener("click", () => {
        if (redirectTimer) clearInterval(redirectTimer);
        closeOrderSuccessModal();
      });
    }
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener("click", () => {
        downloadAndSendPdf(getCartSummary(), state.customer, getOrGenerateOrderNo());
        startAutoRedirectCountdown();
      });
    }
    if (successCopyBtn) successCopyBtn.addEventListener("click", () => copyOrderToClipboard(successCopyBtn));

    if (newOrderBtn) {
      newOrderBtn.addEventListener("click", () => {
        state.cart = {};
        resetOrderNo();
        saveCartState();
        renderProducts();
        updateCartUI();
        closeOrderSuccessModal();
      });
    }

    // Contact Navigation (Smooth Scroll to Bottom Contact Section)
    openContactBtns.forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const contactSec = document.getElementById("contact-section");
        if (contactSec) {
          contactSec.scrollIntoView({ behavior: "smooth" });
        } else if (contactModal) {
          contactModal.classList.remove("hidden");
        }
      });
    });
    if (closeContactBtn) {
      closeContactBtn.addEventListener("click", () => {
        if (contactModal) contactModal.classList.add("hidden");
      });
    }
    if (contactModal) {
      contactModal.addEventListener("click", e => {
        if (e.target === contactModal) contactModal.classList.add("hidden");
      });
    }

    // Pricelist Modal
    openPricelistBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (pricelistModal) pricelistModal.classList.remove("hidden");
      });
    });
    if (closePricelistBtn) {
      closePricelistBtn.addEventListener("click", () => {
        if (pricelistModal) pricelistModal.classList.add("hidden");
      });
    }
    if (pricelistModal) {
      pricelistModal.addEventListener("click", e => {
        if (e.target === pricelistModal) pricelistModal.classList.add("hidden");
      });
    }
    if (printPricelistBtn) {
      printPricelistBtn.addEventListener("click", () => {
        window.print();
      });
    }
  }

  // DOM Loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
