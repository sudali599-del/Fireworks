import React, { useState, useEffect } from "react";
import CrackersCartTable from "./CrackersCartTable.jsx";
import Footer from "./Footer.jsx";
import { ShoppingCart, ShoppingBag, X } from "lucide-react";

export default function HomePage() {
  const year = new Date().getFullYear().toString();
  const [isPressed, setIsPressed] = useState(false);

  // State lifted here for products, quantities, modal toggle
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // NEW: State for the empty cart modal
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/products`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
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
      {/* Floating Cart Summary - fixed bottom right, clickable */}
      <div
        onClick={handleCartButtonClick} // Changed to the new handler
        className="fixed bottom-5 right-5 z-[9998] bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 text-white rounded-xl shadow-xl px-6 py-4 flex items-center space-x-4 cursor-pointer select-none hover:scale-105 transition-transform duration-300"
        title="Click to view cart"
      >
        {/* Cart Icon with Badge */}
        <div className="relative">
          <ShoppingCart size={32} className="text-white" />
          {/* Badge with count */}
          {getTotalItems() > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-lg">
              {getTotalItems() > 999 ? "999+" : getTotalItems()}
            </div>
          )}
        </div>
        {/* Total Price */}
        <div className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
          ₹ {calculateGrandTotal()}
        </div>
      </div>

      {/* Header with Interactive Logo and Shop Name - FIXED TOPMOST */}
      <header className="fixed top-0 left-0 right-0 z-[9999] w-full shadow-2xl">
        <div
          className="flex items-center justify-center px-2 sm:px-4 md:px-6 gap-2 sm:gap-3 md:gap-4 py-3 sm:py-3 md:py-4 min-h-[80px] sm:min-h-[60px]"
          style={{
            background:
              "linear-gradient(135deg, #1a0a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)",
          }}
        >
          <div className="flex-shrink-0">
            <InteractiveLogo />
          </div>
          <div className="leading-none text-white text-left flex-1 min-w-0 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 break-words hyphens-auto">
                SELVAGANAPATHY TRADERS
              </h1>
              <p className="text-yellow-300 text-xs sm:text-sm md:text-base font-medium tracking-wider text-left">
                Premium Fireworks & Crackers
              </p>
            </div>
            {/* Animated Hover Buttons */}
            <div className="flex gap-2 sm:gap-3 ml-2 sm:ml-4 flex-shrink-0">
              {/* Button 1 - Contact Us */}
              <button
                className="group relative px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50 transform hover:-translate-y-1"
                onClick={() =>
                  document
                    .getElementById("footer")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:rotate-12"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Contact</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
              {/* Button 2 - WhatsApp */}
              <button
                className="group relative px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50 transform hover:-translate-y-1"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/Pricelist.pdf";
                  link.download = "Pricelist.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    width="24"
                    height="24"
                  >
                    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM4 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                    <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.91.395c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029z" />
                  </svg>
                  <span className="hidden sm:inline">Price List</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Fireworks Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-16 h-16 animate-pulse">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 opacity-80 animate-ping"></div>
        </div>
        <div className="absolute top-1/2 right-1/3 w-12 h-12 animate-pulse delay-300">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 opacity-70 animate-ping"></div>
        </div>
        <div className="absolute top-2/3 right-1/5 w-10 h-10 animate-pulse delay-700">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-60 animate-ping"></div>
        </div>
        <div className="absolute top-1/4 right-2/5 w-8 h-8 animate-pulse delay-1000">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-500 opacity-50 animate-ping"></div>
        </div>
      </div>

      {/* Main Content - Added responsive padding-top to prevent content from hiding behind fixed header */}
      <main className="relative z-10 flex-1 w-full pt-16 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section with HAPPY DIWALI and Year */}
          <section className="text-center mb-12">
            <div className="max-w-4xl mx-auto">
              <h2
                className="sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"
                style={{ fontSize: "3rem" }}
              >
                HAPPY DIWALI!
              </h2>
              <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
                Celebrate the festival of lights with our premium collection of
                crackers and sparklers
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

      {/* NEW: Empty cart modal */}
      {showEmptyCartModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-red-900/90 to-pink-900/90 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-pink-600/20 to-purple-600/20 animate-pulse"></div>
            <div className="relative z-10 p-6 text-center">
              <button
                onClick={() => setShowEmptyCartModal(false)}
                className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
              <div className="mb-4 flex justify-center">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-full p-4 shadow-lg">
                  <ShoppingBag size={40} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Your Cart is Empty
              </h2>
              <p className="text-gray-200 mb-6 leading-relaxed">
                Please add items to your cart before proceeding to checkout.
              </p>
              <button
                onClick={() => setShowEmptyCartModal(false)}
                className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}