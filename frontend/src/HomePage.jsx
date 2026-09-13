import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CrackersCartTable from "./CrackersCartTable.jsx";
import Footer from "./Footer.jsx";
import { ShoppingCart, ShoppingBag, X } from "lucide-react";
import FireworksBackground from "./FireworksBackground.jsx";
import { catalogData } from "./catalogData.js";

export default function HomePage() {
  const year = new Date().getFullYear().toString();
  const [isPressed, setIsPressed] = useState(false);

  // Initialize with authentic catalog data so page renders instantly without white flash
  const initialProducts = catalogData.map((item) => ({
    ...item,
    _id: item._id || `catalog_${item.siNo}`,
  }));

  // State lifted here for products, quantities, modal toggle
  const [products, setProducts] = useState(initialProducts);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // State for the empty cart modal
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);

  // Fetch updated products from API in background if online
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/products`
        );
        if (response.ok) {
          const data = await response.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (err) {
        console.warn("Using bundled catalog data:", err.message);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateQuantity = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change),
    }));
  };

  const setQuantityForId = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, value),
    }));
  };

  const getTotalItems = () =>
    Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const calculateGrandTotal = () => {
    return products
      .reduce((total, item) => {
        const quantity = quantities[item._id] || 0;
        const price = item.discountedPrice || item.actualPrice;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  // NEW: Handler for the floating cart button click
  const handleCartButtonClick = () => {
    if (getTotalItems() > 0) {
      setShowModal(true);
    } else {
      setShowEmptyCartModal(true);
    }
  };

  // Logo interaction handlers (unchanged)
  const handleLogoInteraction = () => {
    const isMobile = window.innerWidth <= 768;
    let pressTimer;
    let clickCount = 0;

    const mobileHandlers = {
      onTouchStart: (e) => {
        e.preventDefault();
        setIsPressed(true);
        pressTimer = setTimeout(() => {
          window.location.href = "/_admin";
        }, 800);
      },
      onTouchEnd: (e) => {
        e.preventDefault();
        setIsPressed(false);
        clearTimeout(pressTimer);
      },
      onTouchCancel: (e) => {
        e.preventDefault();
        setIsPressed(false);
        clearTimeout(pressTimer);
      },
    };

    const desktopHandlers = {
      onClick: (e) => {
        e.preventDefault();
        clickCount++;
        if (clickCount === 1) {
          setTimeout(() => {
            if (clickCount === 2) {
              window.location.href = "/_admin";
            }
            clickCount = 0;
          }, 300);
        }
      },
    };
    return isMobile ? mobileHandlers : desktopHandlers;
  };

  // Responsive Interactive Logo component
  const InteractiveLogo = () => (
    <div
      className={`cursor-pointer transition-all duration-200 select-none ${isPressed ? "scale-95 opacity-80" : "hover:scale-105"
        }`}
      {...handleLogoInteraction()}
    >
      <img
        src="./logo.png"
        alt="Selvaganapathy Traders Logo"
        className="h-14 w-14 object-contain m-0 p-0 transition-all duration-200 brightness-100"
        draggable={false}
      />
    </div>
  );

  return (
    <div
      className="min-h-screen relative overflow-x-hidden flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #1a0a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)",
      }}
    >
      {/* ================= FLOATING CART SUMMARY (DESKTOP) ================= */}
      {!showModal && !showEmptyCartModal && (
        <>
          <div
            onClick={handleCartButtonClick}
            className="hidden sm:flex fixed bottom-6 right-6 z-[9980] bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 text-white rounded-2xl shadow-2xl px-5 py-3.5 items-center space-x-4 cursor-pointer select-none hover:scale-105 hover:shadow-pink-500/30 transition-all duration-300 border border-white/20 backdrop-blur-md"
            title="Click to view cart"
          >
            <div className="relative">
              <ShoppingCart size={28} className="text-white" />
              {getTotalItems() > 0 && (
                <div className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[11px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                  {getTotalItems() > 999 ? "999+" : getTotalItems()}
                </div>
              )}
            </div>
            <div>
              <div className="text-[10px] text-pink-200 uppercase tracking-wider font-semibold">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in cart
              </div>
              <div className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-200 to-white">
                ₹ {calculateGrandTotal()}
              </div>
            </div>
          </div>

          {/* ================= FLOATING CART SUMMARY (MOBILE DOCK) ================= */}
          <div
            onClick={handleCartButtonClick}
            className="sm:hidden fixed bottom-3 left-3 right-3 z-[9980] bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-800 text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center justify-between cursor-pointer border border-white/25 backdrop-blur-lg active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart size={24} className="text-white" />
                {getTotalItems() > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white shadow">
                    {getTotalItems() > 99 ? "99+" : getTotalItems()}
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-pink-200 block leading-tight">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </span>
                <span className="text-base font-extrabold text-white">
                  ₹ {calculateGrandTotal()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all">
              <span>View Cart</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </>
      )}

      {/* Header with Interactive Logo and Shop Name - FIXED TOPMOST */}
      <header className="fixed top-0 left-0 right-0 z-[9990] w-full shadow-2xl backdrop-blur-md bg-opacity-95">
        <div
          className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 min-h-[64px] sm:min-h-[72px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,10,46,0.95) 0%, rgba(22,33,62,0.95) 25%, rgba(15,52,96,0.95) 50%, rgba(83,52,131,0.95) 75%, rgba(114,9,183,0.95) 100%)",
          }}
        >
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <InteractiveLogo />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm xs:text-base sm:text-xl md:text-2xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 truncate">
                SELVAGANAPATHY TRADERS
              </h1>
              <p className="text-yellow-300 text-[11px] sm:text-xs md:text-sm font-medium tracking-wide truncate">
                Premium Fireworks & Crackers • Sivakasi
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
            {/* Button 1 - Contact Us */}
            <button
              className="px-2.5 sm:px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md flex items-center gap-1 sm:gap-1.5"
              onClick={() =>
                document
                  .getElementById("footer")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
              <span className="hidden xs:inline">Contact</span>
            </button>

            {/* Button 2 - Price List PDF */}
            <button
              className="px-2.5 sm:px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md flex items-center gap-1 sm:gap-1.5 border border-white/10"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/Pricelist.pdf";
                link.download = "Pricelist.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM4 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.91.395c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029z" />
              </svg>
              <span className="hidden xs:inline">Price List</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Big Animated Fireworks Blasting Background */}
      <FireworksBackground />

      {/* Main Content with Responsive Padding */}
      <main className="relative z-10 flex-1 w-full pt-20 sm:pt-24 md:pt-28 pb-28 sm:pb-20">
        <div className="container mx-auto px-2 sm:px-4 md:px-6">
          {/* Hero Section */}
          <section className="text-center mb-6 sm:mb-10">
            <div className="max-w-4xl mx-auto px-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
                <span>✨</span>
                <span>Authentic Sivakasi Crackers Catalog</span>
                <span>✨</span>
              </div>
              <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-2 sm:mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 tracking-tight">
                HAPPY DIWALI!
              </h2>
              <p className="text-gray-300 text-xs sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Celebrate the festival of lights with our premium collection of
                crackers, ground chakkars, sparklers and fancy aerial shots.
              </p>
            </div>
          </section>

          {/* Products Section */}
          <section className="w-full">
            <div className="max-w-7xl mx-auto">
              <CrackersCartTable
                products={products}
                quantities={quantities}
                updateQuantity={updateQuantity}
                setQuantityForId={setQuantityForId}
                isLoading={isLoading}
                error={error}
                showModal={showModal}
                setShowModal={setShowModal}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Empty cart modal (Portal to document.body) */}
      {showEmptyCartModal && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEmptyCartModal(false);
            }
          }}
        >
          <div className="bg-gradient-to-br from-red-950/95 to-pink-950/95 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/30 relative overflow-hidden my-auto">
            <div className="relative z-10 p-6 text-center">
              <button
                onClick={() => setShowEmptyCartModal(false)}
                className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <div className="mb-4 flex justify-center">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-full p-4 shadow-lg">
                  <ShoppingBag size={38} className="text-white" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                Your Cart is Empty
              </h2>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Please add at least one cracker or sparkler to your cart to view your order and generate the bill.
              </p>
              <button
                onClick={() => setShowEmptyCartModal(false)}
                className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:from-pink-600 hover:to-red-600 text-white py-3 rounded-xl font-black text-sm shadow-xl transition-all duration-200 cursor-pointer active:scale-95"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}