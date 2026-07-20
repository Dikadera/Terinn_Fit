import React from 'react';

function CartDrawer({ isOpen, setIsOpen, cart, updateQuantity, removeItem, handleCheckout, setView }) {
  // Calculate Subtotals & Set Discounts
  let subtotal = 0;
  let setDiscountsCount = 0;
  let topsCount = 0;
  let bottomsCount = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    if (item.type === 'custom-set') {
      setDiscountsCount += item.quantity;
    } else if (item.id === 'sports-bra' || item.id === 'crop-top' || item.id === 'long-sleeve') {
      topsCount += item.quantity;
    } else if (item.id === 'leggings' || item.id === 'biker-shorts' || item.id === 'shorts') {
      bottomsCount += item.quantity;
    }
  });

  // Check matching tops and bottoms in cart
  const automaticSets = Math.min(topsCount, bottomsCount);
  setDiscountsCount += automaticSets;

  const totalDiscount = setDiscountsCount * 6000;
  const estimatedTotal = subtotal - totalDiscount;

  return (
    <>
      <div 
        className={`cart-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`cart-drawer ${isOpen ? 'active' : ''}`}>
        <div className="cart-header">
          <h3>Shopping Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
          <button className="close-cart-btn" onClick={() => setIsOpen(false)}>
            &times;
          </button>
        </div>
        
        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="empty-cart-message" id="emptyCartMessage">
              <p>Your shopping bag is currently empty.</p>
              <button 
                className="btn btn-nav btn-shop-now"
                onClick={() => {
                  setIsOpen(false);
                  setView('store');
                }}
              >
                Shop Pieces
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.img} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <span className="cart-item-meta">Color: {item.color} | Size: {item.size}</span>
                  <div className="cart-item-qty-row">
                    <div className="qty-selector">
                      <button className="qty-btn minus-btn" onClick={() => updateQuantity(index, -1)}>-</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn plus-btn" onClick={() => updateQuantity(index, 1)}>+</button>
                    </div>
                    <button className="cart-remove-item" onClick={() => removeItem(index)}>Remove</button>
                  </div>
                </div>
                <div className="cart-item-price">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="cart-summary-row discount-row">
                <span>Set Discount</span>
                <span>-₦{totalDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="cart-summary-row total-row">
              <span>Estimated Total</span>
              <span className="total-val">₦{estimatedTotal.toLocaleString()}</span>
            </div>
            <button className="btn btn-editorial-buy btn-checkout" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
