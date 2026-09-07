import React, { useState, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus, ShoppingBag, Search } from "lucide-react";
import generateBill from "../src/generateBill.js";

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
  // NEW: Separate states for each search bar
  const [searchQueryByName, setSearchQueryByName] = useState("");
  const [searchQueryBySno, setSearchQueryBySno] = useState("");

  const productTypes = [
    'ONE SOUND CRACKERS',
    'FLOWER POTS',
    'GROUND CHAKKAR',
    'ROCKETS',
    'TWINKLING STAR',
    'ELECTRIC CRACKERS',
    'DELUXE CRACKERS',
    'SPECIAL GARLANDS',
    'BIJILI',
    'BOMBS',
    'PENCIL',
    'SPARKLERS',
    'FANCY FOUNTAINS',
    'MUSICAL ITEMS',
    'AERIAL FANCY',
    'AERIAL FANCY SHOTS',
    'AERIAL MULTI SHOTS FANCY',
    'SPECIAL FANCY FOUNTAIN',
    'SPECIAL FOUNTAINS',
    'NEW ARRIVAL FOUNTAINS',
    'CHILDRENS FANCY',
    'CAPS & SERPENT',
    'GIFT BOXES'
  ];

  const groupByCategory = (productsList) => {
    const grouped = productsList.reduce((acc, product) => {
      const category = product.productType || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    const orderedGrouped = {};
    productTypes.forEach(type => {
      if (grouped[type]) {
        orderedGrouped[type] = grouped[type];
      }
    });

    Object.keys(grouped).forEach(category => {
      if (!productTypes.includes(category)) {
        orderedGrouped[category] = grouped[category];
      }
    });

    return orderedGrouped;
  };

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
    return (total * (1 - cartDiscount / 100)).toFixed(2);
  };

  const getSelectedItems = () => {
    return products.filter((item) => quantities[item._id] > 0);
  };

  const handleViewCartClick = () => {
    if (getTotalItems() === 0) {
      setShowEmptyCartModal(true);
      return;
    }
    setShowModal(true);
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

  const SectionHeader = ({ title }) => (
    <div className="w-full bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 text-white py-4 px-6 mb-2 rounded-lg shadow-lg border border-white/20">
      <h3 className="text-lg font-bold tracking-wide">
        {title}
        {title === 'GIFT BOXES' && (
          <span className="ml-2 text-sm font-normal">(Discount not applied)</span>
        )}
      </h3>
    </div>
  );

  const ProductRow = ({ item, index }) => {
    const quantity = quantities[item._id] || 0;
    const price = item.actualPrice;
    const [inputValue, setInputValue] = useState(quantity.toString());

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
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 backdrop-blur-sm border border-white/10 rounded-xl mb-3 p-2 hover:shadow-xl transition-all duration-300">
        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 items-center">
          <div className="flex justify-center">
            <div className="text-lg font-bold text-white bg-gray-700/50 p-3 rounded-full w-10 h-10 flex items-center justify-center">
              {index + 1}
            </div>
          </div>
          <div className="text-left">
            <div className="text-white font-semibold text-lg break-words leading-tight">
              {item.name}
            </div>
            <div className="text-gray-300 text-sm break-words leading-tight mt-1">
              {item.productDescription}
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold text-xl">
              ₹{price.toFixed(2)}
            </div>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={handleDecrement}
              className="flex-shrink-0 aspect-square rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 
              text-white flex items-center justify-center font-bold shadow-lg transform hover:scale-110 transition-all duration-200
              w-10 h-10 md:w-12 md:h-12"
            >
              <Minus size={16} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="bg-gray-800/70 text-white px-3 py-2 rounded-lg font-bold text-lg w-16 text-center 
              border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0"
            />
            <button
              onClick={handleIncrement}
              className="flex-shrink-0 aspect-square rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 
              text-white flex items-center justify-center font-bold shadow-lg transform hover:scale-110 transition-all duration-200
              w-10 h-10 md:w-12 md:h-12"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
              ₹{calculateTotal(price, quantity)}
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="grid grid-cols-12 gap-2 items-center px-1 min-h-[60px]">
            <div className="col-span-1 flex justify-center">
              <div className="text-xs font-bold text-white bg-gray-700/50 p-1.5 rounded-full w-6 h-6 flex items-center justify-center">
                {index + 1}
              </div>
            </div>
            <div className="col-span-4 text-left pl-1 min-w-0">
              <div className="text-white font-semibold text-sm leading-tight break-words hyphens-auto">
                {item.name}
              </div>
              <div className="text-gray-300 text-xs leading-tight mt-0.5 break-words hyphens-auto">
                {item.productDescription}
              </div>
            </div>
            <div className="col-span-3 text-center">
            </div>
            <div className="col-span-2 flex justify-center items-center">
              <div className="flex flex-col items-center space-y-1">
                <button
                  onClick={handleIncrement}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg text-xs"
                >
                  <Plus size={12} />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="bg-gray-800/70 text-white px-1 py-0.5 rounded-lg font-bold w-8 text-center border border-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-xs"
                  placeholder="0"
                />
                <button
                  onClick={handleDecrement}
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg text-xs"
                >
                  <Minus size={12} />
                </button>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
                ₹{calculateTotal(price, quantity)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // NEW: Filtering logic that combines both searches
  const filteredProducts = products.filter((product, index) => {
    const nameQuery = searchQueryByName.toLowerCase();
    const snoQuery = searchQueryBySno.toLowerCase();

    // Check for name match
    const matchesName = product.name.toLowerCase().includes(nameQuery) ||
      (product.productDescription && product.productDescription.toLowerCase().includes(nameQuery));

    // Check for S.No match (only if a number is entered)
    const matchesSno = snoQuery === "" || (index + 1).toString().includes(snoQuery);

    return matchesName && matchesSno;
  });

  const categorizedProducts = groupByCategory(filteredProducts);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl shadow-2xl overflow-hidden border border-white/20">
      {/* Search Bars Container */}
      <div className="p-4 md:p-6  from-purple-900/80 via-indigo-900/80 to-blue-900/80 flex flex-col md:flex-row gap-4">

        {/* Search by S.No */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by S.No..."
            value={searchQueryBySno}
            onChange={(e) => setSearchQueryBySno(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {/* Search by Name */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQueryByName}
            onChange={(e) => setSearchQueryByName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden md:block bg-gradient-to-r from-purple-800/80 via-indigo-800/80 to-blue-800/80 backdrop-blur-sm text-white border-y border-white/20 mx-4 rounded-lg mb-4">
        <div className="grid grid-cols-5 gap-4 px-6 py-4 font-bold text-sm">
          <div className="text-center">No.</div>
          <div className="text-left">Product Name</div>
          <div className="text-center">Price</div>
          <div className="text-center">Quantity</div>
          <div className="text-center">Total</div>
        </div>
      </div>

      {/* Mobile Table Header */}
      <div className="md:hidden bg-gradient-to-r from-purple-800/80 via-indigo-800/80 to-blue-800/80 backdrop-blur-sm text-white border-y border-white/20 mx-2 rounded-lg mb-2">
        <div className="grid grid-cols-12 gap-2 px-2 py-2 text-xs font-bold">
          <div className="col-span-1 text-center">No.</div>
          <div className="col-span-4 text-left pl-1">Product</div>
          <div className="col-span-3 text-center">Price</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-center">Total</div>
        </div>
      </div>

      {/* Products */}
      <div className="px-1 md:px-4 pb-6">
        {(() => {
          let globalIndex = 0;
          const productRows = Object.entries(categorizedProducts).map(([category, items]) => (
            <React.Fragment key={category}>
              <SectionHeader title={category.toUpperCase()} />
              <div className="space-y-1 md:space-y-3">
                {items.map((item) => {
                  globalIndex += 1;
                  return (
                    <ProductRow key={item._id} item={item} index={globalIndex - 1} />
                  );
                })}
              </div>
            </React.Fragment>
          ));

          if (productRows.length === 0) {
            return (
              <div className="text-center text-gray-400 py-8">
                No products found matching your search.
              </div>
            );
          }
          return productRows;
        })()}
      </div>

      {showEmptyCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
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
                Please select at least one product to view your cart and proceed
                with the purchase.
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-white/20 relative">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/20">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Generate Bill
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-300 hover:text-white transition-colors p-1"
                disabled={loading}
              >
                <X size={20} />
              </button>
            </div>
            <div
              className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-200px)]"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Selected Items
                </h3>
                <div
                  className="max-h-48 overflow-y-auto bg-black/20 rounded-lg p-3"
                  style={{
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                >
                  {getSelectedItems().length === 0 ? (
                    <div className="text-center text-gray-400 py-4">
                      No items selected
                    </div>
                  ) : (
                    getSelectedItems().map((item) => {
                      const quantity = quantities[item._id] || 0;
                      const price = item.discountedPrice || item.actualPrice;
                      const total = calculateTotal(price, quantity);
                      return (
                        <div
                          key={item._id}
                          className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0"
                        >
                          <div className="text-white font-semibold flex-1 pr-2 min-w-0">
                            <div className="text-sm break-words">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              ₹{price.toFixed(2)} x {quantity}
                            </div>
                          </div>
                          <div className="text-green-400 font-bold text-sm flex-shrink-0">
                            ₹{total}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 font-bold text-lg border-t border-white/20 mb-6">
                <div className="text-white">Total Amount</div>
                <div className="text-green-400">₹{discountApplied ? getDiscountedTotal() : calculateGrandTotal()}</div>
              </div>
              <form onSubmit={handleGenerateBill} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-4 py-3 bg-black/20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 text-white placeholder-gray-400 ${phoneError ? "border-red-500" : "border-white/20"
                      }`}
                    placeholder="Enter phone number"
                    required
                  />
                  {phoneError && (
                    <p className="text-red-400 text-xs mt-1">{phoneError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Email (optional - to receive PDF)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Enter email address to receive PDF"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    If provided, the bill PDF will be sent to your email
                  </p>
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Discount on Total Bill (%)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={cartDiscount}
                      onChange={e => setCartDiscount(Number(e.target.value))}
                      min="0"
                      max="100"
                      className="w-24 px-3 py-2 rounded-lg border border-white/20 bg-black/20 text-white"
                      placeholder="0"
                      disabled={discountApplied}
                    />
                    <button
                      type="button"
                      onClick={() => setDiscountApplied(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-bold"
                      disabled={discountApplied || cartDiscount <= 0}
                    >
                      Apply Discount
                    </button>
                    {discountApplied && (
                      <button
                        type="button"
                        onClick={() => { setDiscountApplied(false); setCartDiscount(0); }}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-bold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {discountApplied && (
                    <div className="mt-2 text-green-400 font-bold">
                      Discounted Total: ₹{getDiscountedTotal()}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center py-3 font-bold text-lg border-t border-white/20 mb-6">
                  <div className="text-white">Total Amount</div>
                  <div className="text-green-400">
                    ₹{discountApplied ? getDiscountedTotal() : calculateGrandTotal()}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  disabled={loading || getSelectedItems().length === 0}
                >
                  <ShoppingCart size={18} />
                  <span>{loading ? "Generating..." : "Generate Bill"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrackersCartTable;
