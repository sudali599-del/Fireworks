import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, X, Plus, Minus, ShoppingBag, Search, Sparkles, ChevronRight, ChevronLeft, Check, Phone, Mail, FileText } from "lucide-react";
import generateBill from "../src/generateBill.js";
import { CANONICAL_CATEGORIES, organizeProductsBySequence, normalizeCategoryName } from "./productsSequence.js";

const STORAGE_KEY = 'fireworks_categories_data';

const getStoredCategories = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...parsed].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
      }
    }
  } catch (e) {
    console.error('Failed to read categories from storage:', e);
  }
  return CANONICAL_CATEGORIES;
};

const CrackersCartTable = ({
  products,
  quantities,
  updateQuantity,
  setQuantityForId,
  isLoading,
  error,
  showModal,
  setShowModal,
}) => {
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartDiscount, setCartDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [searchQueryByName, setSearchQueryByName] = useState("");
  const [searchQueryBySno, setSearchQueryBySno] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("ALL");

  const [categories, setCategories] = useState(getStoredCategories);
  const categoryNavRef = useRef(null);

  // Category scroll navigation states
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkCategoryScroll = useCallback(() => {
    if (categoryNavRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryNavRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  }, []);

  useEffect(() => {
    checkCategoryScroll();
    const nav = categoryNavRef.current;
    if (nav) {
      nav.addEventListener('scroll', checkCategoryScroll);
      window.addEventListener('resize', checkCategoryScroll);
    }
    return () => {
      if (nav) nav.removeEventListener('scroll', checkCategoryScroll);
      window.removeEventListener('resize', checkCategoryScroll);
    };
  }, [checkCategoryScroll]);

  const scrollCategory = (direction) => {
    if (categoryNavRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      categoryNavRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    if (!categoryNavRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - categoryNavRef.current.offsetLeft);
    setScrollLeftState(categoryNavRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !categoryNavRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryNavRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    categoryNavRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (showModal || showEmptyCartModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal, showEmptyCartModal]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showModal) setShowModal(false);
        if (showEmptyCartModal) setShowEmptyCartModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, showEmptyCartModal, setShowModal]);

  // Fetch categories to sort by sequence number and listen to real-time admin reordering
  useEffect(() => {
    const updateFromStorage = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories([...parsed].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)));
          }
        }
      } catch (e) {}
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const sorted = [...data].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
            setCategories(sorted);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('Failed to fetch categories:', err);
      }
    };

    fetchCategories();

    window.addEventListener('storage', updateFromStorage);
    window.addEventListener('categoriesUpdated', updateFromStorage);

    return () => {
      window.removeEventListener('storage', updateFromStorage);
      window.removeEventListener('categoriesUpdated', updateFromStorage);
    };
  }, []);

  // 1. Organize products in strict sequence order of categories and products
  const { orderedCategories, categorizedProducts, allOrderedProducts } = useMemo(() => {
    return organizeProductsBySequence(products, categories);
  }, [products, categories]);

  // 2. Filter products based on S.No, Name, and optional active category pill
  const filteredCategorizedProducts = useMemo(() => {
    const nameQuery = searchQueryByName.toLowerCase().trim();
    const snoQuery = searchQueryBySno.toLowerCase().trim();

    const result = {};

    orderedCategories.forEach(({ name }) => {
      if (activeCategoryFilter !== "ALL" && activeCategoryFilter !== name) {
        return;
      }

      const items = categorizedProducts[name] || [];
      const matchedItems = items.filter((product) => {
        // Match Name / Description / Tamil Name
        const matchesName =
          !nameQuery ||
          product.name.toLowerCase().includes(nameQuery) ||
          (product.productDescription && product.productDescription.toLowerCase().includes(nameQuery)) ||
          (product.tamilName && product.tamilName.toLowerCase().includes(nameQuery));

        // Match S.No with actual displayed number / computedSiNo
        const matchesSno =
          !snoQuery ||
          product.displayIndex.toString().includes(snoQuery) ||
          (product.computedSiNo && product.computedSiNo.toString().includes(snoQuery));

        return matchesName && matchesSno;
      });

      if (matchedItems.length > 0) {
        result[name] = matchedItems;
      }
    });

    return result;
  }, [orderedCategories, categorizedProducts, searchQueryByName, searchQueryBySno, activeCategoryFilter]);

  const calculateTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  const getTotalItems = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const calculateGrandTotal = () => {
    return products
      .reduce((total, item) => {
        const quantity = quantities[item._id] || 0;
        return total + item.actualPrice * quantity;
      }, 0)
      .toFixed(2);
  };

  const getDiscountedTotal = () => {
    const total = parseFloat(calculateGrandTotal());
    return (total * (cartDiscount > 0 ? (1 - cartDiscount / 100) : 1)).toFixed(2);
  };

  const getSelectedItems = () => {
    return products.filter((item) => quantities[item._id] > 0);
  };

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      return;
    }
    setPhoneError("");

    const selected = getSelectedItems();
    if (selected.length === 0) {
      alert("Please select at least one item to generate the bill.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address to receive the PDF.");
      return;
    }

    setLoading(true);
    try {
      const productsWithQuantities = selected.map((product) => ({
        ...product,
        selectedQuantity: quantities[product._id] || 0,
      }));

      const pdfBlob = await generateBill(
        productsWithQuantities,
        phone,
        email,
        discountApplied ? cartDiscount : 0
      );

      if (email && pdfBlob) {
        try {
          const formData = new FormData();
          formData.append("file", pdfBlob, `bill_${phone}_${Date.now()}.pdf`);
          formData.append("email", email);

          const emailResponse = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/mail/send-pdf`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!emailResponse.ok) {
            const errorData = await emailResponse.json();
            throw new Error(errorData.message || "Failed to send email");
          }

          const emailResult = await emailResponse.json();
          console.log("Email sent successfully:", emailResult);
          alert("Bill generated successfully and sent to your email!");
        } catch (emailError) {
          console.error("Email sending error:", emailError);
          alert(
            "Bill generated successfully and downloaded, but failed to send email. Please check your email address."
          );
        }
      } else {
        alert("Bill generated and downloaded successfully!");
      }

      setShowModal(false);
      setPhone("");
      setEmail("");
      // Clear the cart
      Object.keys(quantities).forEach((id) => setQuantityForId(id, 0));
    } catch (err) {
      console.error("Bill generation error:", err);
      alert("Failed to generate bill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToCategory = (catName) => {
    if (activeCategoryFilter === catName) {
      setActiveCategoryFilter("ALL");
      return;
    }
    setActiveCategoryFilter(catName);
    setTimeout(() => {
      const elem = document.getElementById(`cat-sec-${catName.replace(/[^a-zA-Z0-9]/g, '-')}`) || document.getElementById("crackers-table-root");
      if (elem) {
        const headerOffset = 130;
        const elementPosition = elem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth"
        });
      }
    }, 50);
  };

  const handleSelectAll = () => {
    setActiveCategoryFilter("ALL");
    const elem = document.getElementById("crackers-table-root");
    if (elem) {
      const headerOffset = 130;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth"
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Section Header Component
  const SectionHeader = ({ title, count, sequence }) => {
    return (
      <div
        id={`cat-sec-${title.replace(/[^a-zA-Z0-9]/g, '-')}`}
        className="w-full bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 text-white py-3 px-3 sm:py-4 sm:px-6 mb-3 rounded-xl shadow-lg border border-white/20 flex items-center justify-between transition-all duration-300"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {sequence && (
            <span className="flex-shrink-0 bg-black/30 backdrop-blur-sm text-yellow-300 text-xs sm:text-sm font-black px-2.5 py-1 rounded-md border border-yellow-400/30">
              #{sequence}
            </span>
          )}
          <h3 className="text-sm sm:text-base md:text-lg font-extrabold tracking-wide uppercase truncate">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/30 backdrop-blur-sm">
            {count} {count === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>
    );
  };

  // Product Row Component (Responsive with Desktop & Mobile View)
  const ProductRow = ({ item }) => {
    const quantity = quantities[item._id] || 0;
    const price = item.actualPrice;
    const [inputValue, setInputValue] = useState(quantity.toString());
    const isSelected = quantity > 0;

    useEffect(() => {
      setInputValue(quantity.toString());
    }, [quantity]);

    const handleInputChange = (e) => {
      const value = e.target.value;
      if (value === "" || /^\d+$/.test(value)) {
        setInputValue(value);
      }
    };

    const handleInputBlur = () => {
      const num = parseInt(inputValue, 10);
      setQuantityForId(item._id, isNaN(num) ? 0 : num);
      setInputValue(isNaN(num) ? "0" : num.toString());
    };

    const handleDecrement = () => {
      const num = Math.max(0, quantity - 1);
      setQuantityForId(item._id, num);
    };

    const handleIncrement = () => {
      const num = quantity + 1;
      setQuantityForId(item._id, num);
    };

    return (
      <div
        className={`transition-all duration-200 rounded-xl mb-2.5 border backdrop-blur-sm ${
          isSelected
            ? "bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-pink-900/40 border-pink-500/50 shadow-lg shadow-purple-950/40"
            : "bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-blue-950/40 border-white/10 hover:border-white/20 hover:bg-purple-900/30"
        }`}
      >
        {/* ================= DESKTOP VIEW (md and up) ================= */}
        <div className="hidden md:grid md:grid-cols-12 gap-3 items-center px-4 py-3">
          {/* No. */}
          <div className="col-span-1 flex justify-center">
            <div
              className={`text-sm font-bold rounded-full w-9 h-9 flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/40 scale-105"
                  : "text-gray-300 bg-white/10 border border-white/15"
              }`}
            >
              {item.displayIndex}
            </div>
          </div>

          {/* Product Name & Description */}
          <div className="col-span-5 text-left pl-2">
            <div className="text-white font-semibold text-base leading-tight break-words flex items-center gap-2">
              <span>{item.name}</span>
              {isSelected && (
                <span className="bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Added
                </span>
              )}
            </div>
            <div className="text-gray-300 text-xs leading-relaxed mt-1 flex items-center gap-2 flex-wrap">
              {item.productDescription && (
                <span className="bg-white/10 px-2 py-0.5 rounded text-gray-200 font-medium">
                  {item.productDescription}
                </span>
              )}
              {item.tamilName && (
                <span className="text-yellow-300/90 text-xs">
                  {item.tamilName}
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="col-span-2 text-center">
            <div className="text-emerald-400 font-extrabold text-lg">
              ₹{price.toFixed(2)}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="col-span-2 flex justify-center items-center gap-1.5">
            <button
              onClick={handleDecrement}
              disabled={quantity === 0}
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold shadow-md transition-all duration-200 active:scale-95 ${
                quantity > 0
                  ? "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white cursor-pointer"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }`}
              title="Decrease quantity"
            >
              <Minus size={15} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="bg-black/40 text-white font-bold text-base w-12 py-1 text-center rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="0"
            />
            <button
              onClick={handleIncrement}
              className="w-9 h-9 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center justify-center font-bold shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
              title="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>

          {/* Total Amount */}
          <div className="col-span-2 text-center">
            <div
              className={`font-black text-lg transition-all ${
                isSelected
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 scale-105"
                  : "text-gray-400 font-semibold"
              }`}
            >
              ₹{calculateTotal(price, quantity)}
            </div>
          </div>
        </div>

        {/* ================= MOBILE VIEW (< md) ================= */}
        <div className="md:hidden p-3">
          {/* Top Row: S.No badge, Name, Package */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              <span
                className={`flex-shrink-0 text-xs font-bold w-6 h-6 rounded-md flex items-center justify-center mt-0.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                    : "bg-white/15 text-gray-300 border border-white/10"
                }`}
              >
                {item.displayIndex}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-bold text-sm leading-snug break-words">
                  {item.name}
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  {item.productDescription && (
                    <span className="text-[11px] text-gray-300 font-medium bg-white/10 px-1.5 py-0.2 rounded">
                      {item.productDescription}
                    </span>
                  )}
                  {item.tamilName && (
                    <span className="text-[11px] text-yellow-300/80">
                      {item.tamilName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Total on top right if selected */}
            {isSelected && (
              <div className="text-right flex-shrink-0">
                <span className="text-xs text-gray-400 block font-normal">Total</span>
                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  ₹{calculateTotal(price, quantity)}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Row: Unit Price & Horizontal Stepper */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
            {/* Unit Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-400">Price:</span>
              <span className="text-emerald-400 font-extrabold text-base">
                ₹{price.toFixed(2)}
              </span>
            </div>

            {/* Accessible Touch-Friendly Stepper */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                disabled={quantity === 0}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-150 active:scale-95 ${
                  quantity > 0
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md cursor-pointer"
                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                }`}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="w-12 h-9 sm:h-10 bg-black/40 text-white font-black text-sm sm:text-base text-center rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="0"
              />

              <button
                onClick={handleIncrement}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center font-bold shadow-md transition-all duration-150 active:scale-95 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        <p className="text-gray-300 font-medium text-sm animate-pulse">Loading authentic Diwali catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8 bg-red-950/40 rounded-xl border border-red-500/30 p-6">
        <p className="font-semibold text-lg mb-2">Error loading products</p>
        <p className="text-sm text-gray-300">{error}</p>
      </div>
    );
  }

  const categoryEntries = Object.entries(filteredCategorizedProducts);

  return (
    <div id="crackers-table-root" className="w-full rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm bg-black/20">
      {/* Search Bars Container */}
      <div className="p-3 sm:p-5 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-blue-950/90 border-b border-white/15">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search by S.No */}
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search by S.No (e.g. 1, 25)..."
              value={searchQueryBySno}
              onChange={(e) => setSearchQueryBySno(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchQueryBySno && (
              <button
                onClick={() => setSearchQueryBySno("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-white/10"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search by Name */}
          <div className="relative w-full sm:w-2/3">
            <input
              type="text"
              placeholder="Search by cracker name, sparkler, or type..."
              value={searchQueryByName}
              onChange={(e) => setSearchQueryByName(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchQueryByName && (
              <button
                onClick={() => setSearchQueryByName("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-white/10"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Navigation Chips */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center relative">
          <div className="text-gray-400 text-[11px] font-semibold mr-1.5 flex-shrink-0 flex items-center gap-1 pl-0.5">
            <Sparkles size={13} className="text-yellow-400 animate-pulse" />
            <span className="hidden xs:inline">Categories:</span>
          </div>

          {/* Left chevron button for desktop */}
          <button
            type="button"
            onClick={() => scrollCategory('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll categories left"
            className={`hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-black/60 hover:bg-pink-600 text-white border border-white/20 shadow-md transition-all flex-shrink-0 mr-1 z-10 ${
              !canScrollLeft ? 'opacity-25 cursor-not-allowed' : 'opacity-90 hover:scale-110 active:scale-95'
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Scrollable chip container with hidden scrollbar and momentum */}
          <div
            ref={categoryNavRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs cursor-grab active:cursor-grabbing smooth-scroll-x select-none flex-1 min-w-0"
          >
            <button
              onClick={handleSelectAll}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all font-bold flex-shrink-0 text-xs flex items-center gap-1 ${
                activeCategoryFilter === "ALL"
                  ? "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-md shadow-pink-500/40 ring-1 ring-white/30 scale-105"
                  : "bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 border border-white/10"
              }`}
            >
              All ({allOrderedProducts.length})
            </button>
            {orderedCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => scrollToCategory(cat.name)}
                className={`px-2.5 py-1.5 rounded-full whitespace-nowrap transition-all text-xs font-semibold flex-shrink-0 flex items-center gap-1.5 ${
                  activeCategoryFilter === cat.name
                    ? "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-md shadow-pink-500/40 ring-1 ring-white/30 scale-105"
                    : "bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    activeCategoryFilter === cat.name ? "bg-black/30 text-yellow-300" : "text-yellow-400 bg-white/10"
                  }`}
                >
                  {cat.itemCount}
                </span>
              </button>
            ))}
          </div>

          {/* Right chevron button for desktop */}
          <button
            type="button"
            onClick={() => scrollCategory('right')}
            disabled={!canScrollRight}
            aria-label="Scroll categories right"
            className={`hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-black/60 hover:bg-pink-600 text-white border border-white/20 shadow-md transition-all flex-shrink-0 ml-1 z-10 ${
              !canScrollRight ? 'opacity-25 cursor-not-allowed' : 'opacity-90 hover:scale-110 active:scale-95'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden md:block bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-md text-white border-b border-white/20 mx-3 sm:mx-4 rounded-xl mt-4 mb-3">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-200">
          <div className="col-span-1 text-center">No.</div>
          <div className="col-span-5 text-left pl-2">Product Details</div>
          <div className="col-span-2 text-center">Unit Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-center">Total Amount</div>
        </div>
      </div>

      {/* Product List Grouped Strictly in Sequence Order */}
      <div className="px-2 sm:px-4 pb-6 mt-2">
        {categoryEntries.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-base font-semibold text-white">No products found matching your search</p>
            <p className="text-xs text-gray-400 mt-1">Try clearing your search query or choosing another category.</p>
            <button
              onClick={() => {
                setSearchQueryByName("");
                setSearchQueryBySno("");
                setActiveCategoryFilter("ALL");
              }}
              className="mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-bold transition-all shadow"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          categoryEntries.map(([categoryName, items], index) => {
            const catObj = orderedCategories.find(c => c.name === categoryName);
            return (
              <div key={categoryName} className="mb-6 last:mb-0">
                <SectionHeader
                  title={categoryName}
                  count={items.length}
                  sequence={catObj?.sequence}
                />
                <div className="space-y-1.5 sm:space-y-2">
                  {items.map((item) => (
                    <ProductRow key={item._id || item.id || item.computedSiNo} item={item} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= GENERATE BILL MODAL (PORTAL TO DOCUMENT.BODY) ================= */}
      {showModal && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) {
              setShowModal(false);
            }
          }}
        >
          <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 rounded-2xl shadow-2xl w-full max-w-lg max-h-[86vh] sm:max-h-[88vh] flex flex-col border border-white/20 relative overflow-hidden my-auto">
            {/* Modal Fixed Header */}
            <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-3.5 border-b border-white/15 bg-black/40 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center border border-pink-500/40 text-pink-400">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                    Order Summary & Bill
                  </h2>
                  <p className="text-[11px] text-pink-300 font-medium">
                    {getSelectedItems().length} {getSelectedItems().length === 1 ? "item" : "items"} • {getTotalItems()} total qty
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                disabled={loading}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form wrapping Body & Pinned Footer */}
            <form onSubmit={handleGenerateBill} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Modal Scrollable Body */}
              <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 min-h-0 space-y-3.5 text-sm custom-scrollbar">
                {/* Selected Items Box */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider text-gray-300">
                      Items in Cart
                    </h3>
                    <span className="text-xs text-yellow-300 font-semibold">
                      ₹{calculateGrandTotal()} Subtotal
                    </span>
                  </div>
                  <div className="max-h-36 sm:max-h-44 overflow-y-auto bg-black/40 rounded-xl p-2 border border-white/10 space-y-1.5 custom-scrollbar">
                    {getSelectedItems().length === 0 ? (
                      <div className="text-center text-gray-400 py-4 text-xs">
                        No items selected
                      </div>
                    ) : (
                      getSelectedItems().map((item) => {
                        const qty = quantities[item._id] || 0;
                        const pr = item.actualPrice;
                        const tot = calculateTotal(pr, qty);
                        return (
                          <div
                            key={item._id}
                            className="flex justify-between items-center py-2 px-2.5 rounded-lg bg-white/5 border border-white/5 text-xs"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <div className="text-white font-semibold truncate text-xs sm:text-sm">
                                {item.name}
                              </div>
                              <div className="text-gray-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                                <span>₹{pr.toFixed(2)} × {qty}</span>
                                {item.productDescription && (
                                  <span className="text-gray-400">({item.productDescription})</span>
                                )}
                              </div>
                            </div>
                            <div className="text-emerald-400 font-black text-sm flex-shrink-0">
                              ₹{tot}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Bill Breakdown Box */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 space-y-2">
                  <div className="flex justify-between text-gray-300 text-xs">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">₹{calculateGrandTotal()}</span>
                  </div>

                  {/* Discount */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs text-gray-300 font-medium">Discount (%)</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={cartDiscount}
                          onChange={(e) => setCartDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                          min="0"
                          max="100"
                          className="w-16 px-2 py-1 rounded-lg bg-black/40 border border-white/20 text-white text-xs text-center font-bold focus:outline-none focus:ring-1 focus:ring-pink-500"
                          placeholder="0"
                          disabled={discountApplied}
                        />
                        {!discountApplied ? (
                          <button
                            type="button"
                            onClick={() => setDiscountApplied(true)}
                            disabled={cartDiscount <= 0}
                            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
                          >
                            Apply
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setDiscountApplied(false);
                              setCartDiscount(0);
                            }}
                            className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-xs text-emerald-400 font-semibold mt-1.5">
                        <span>Discount Applied</span>
                        <span>-{cartDiscount}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-white text-xs font-bold mb-1">
                      Phone Number <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (phoneError) setPhoneError("");
                        }}
                        className={`w-full pl-9 pr-3.5 py-2 bg-black/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400 text-sm ${
                          phoneError ? "border-red-500 focus:ring-red-500" : "border-white/20"
                        }`}
                        placeholder="Enter 10-digit mobile number"
                        required
                      />
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {phoneError && (
                      <p className="text-red-400 text-xs mt-1 font-semibold">{phoneError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-xs font-bold mb-1">
                      Email Address <span className="text-gray-400 font-normal">(Optional - to receive PDF)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-black/40 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400 text-sm"
                        placeholder="name@example.com"
                      />
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Bill PDF will be generated instantly and downloaded to your device.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Sticky Pinned Footer - ALWAYS VISIBLE */}
              <div className="p-3.5 sm:p-4 border-t border-white/15 bg-black/60 backdrop-blur-md flex-shrink-0 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-300 font-semibold">
                    Grand Total:
                  </span>
                  <span className="text-emerald-400 font-black text-xl sm:text-2xl">
                    ₹{discountApplied ? getDiscountedTotal() : calculateGrandTotal()}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:shadow-pink-500/25 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base cursor-pointer"
                  disabled={loading || getSelectedItems().length === 0}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating Bill PDF...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Download Bill & Place Order</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CrackersCartTable;
