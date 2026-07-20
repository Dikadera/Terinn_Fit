import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Store from './Store';
import CartDrawer from './CartDrawer';
import logoImg from './assets/logo.png';

function App() {
  const [view, setView] = useState('home'); // 'home' or 'store'
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('terinn_cart_react');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('terinn_cart_react', JSON.stringify(cart));
  }, [cart]);

  // Seeding check to auto-populate default accessories if missing from localStorage database
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('terinn_admin_products');
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        const hasGymGloves = parsed.some(p => p.id === 'gym-gloves');
        if (!hasGymGloves) {
          const defaultAccs = [
            { id: 'gym-gloves',   name: 'Terinn Gym Gloves',   price: 12000, category: 'Accessories', stock: 15, tag: '', image: '/src/assets/gym_gloves.png', colors: ['Midnight Black','Slate Blue'] },
            { id: 'sanitizer',    name: 'Terinn Sanitizer',    price: 3500,  category: 'Accessories', stock: 50, tag: '', image: '/src/assets/hand_sanitizer.png', colors: ['Clear'] },
            { id: 'water-bottle', name: 'Terinn Water Bottle', price: 8500,  category: 'Accessories', stock: 25, tag: '', image: '/src/assets/water_bottle.png', colors: ['Terinn Mauve','Midnight Black'] },
            { id: 'bands',        name: 'Terinn Gym Bands',    price: 6000,  category: 'Accessories', stock: 30, tag: '', image: '/src/assets/resistance_bands.png', colors: ['Terinn Mauve'] }
          ];
          localStorage.setItem('terinn_admin_products', JSON.stringify([...parsed, ...defaultAccs]));
          window.location.reload();
        }
      } else {
        const defaultList = [
          { id: 'sports-bra',   name: 'Terinn Sports Bra',    price: 18000, category: 'Tops',    stock: 24, tag: 'Best Seller', image: '/src/assets/sports_bra_mauve.png', colors: ['Terinn Mauve','Midnight Black','Slate Blue','Olive Green'] },
          { id: 'leggings',     name: 'Terinn Leggings',       price: 20000, category: 'Bottoms', stock: 18, tag: 'Best Seller', image: '/src/assets/leggings_mauve.png', colors: ['Terinn Mauve','Midnight Black','Slate Blue','Olive Green'] },
          { id: 'crop-top',     name: 'Terinn Crop Top',       price: 20000, category: 'Tops',    stock: 15, tag: 'Best Seller',           image: '/src/assets/crop_top_black.png', colors: ['Midnight Black','Terinn Mauve','Slate Blue','Olive Green'] },
          { id: 'long-sleeve',  name: 'Terinn Long Sleeve',    price: 22000, category: 'Tops',    stock: 10, tag: 'Best Seller',           image: '/src/assets/terinn_hero_bg.png', colors: ['Terinn Mauve','Midnight Black','Slate Blue','Olive Green'] },
          { id: 'biker-shorts', name: 'Terinn Biker Shorts',   price: 16000, category: 'Bottoms', stock: 20, tag: 'Best Seller',           image: '/src/assets/terinn_gallery_1.png', colors: ['Slate Blue','Terinn Mauve','Midnight Black','Olive Green'] },
          { id: 'shorts',       name: 'Terinn Shorts',         price: 15000, category: 'Bottoms', stock: 12, tag: 'Best Seller',           image: '/src/assets/terinn_hero_bg.png', colors: ['Terinn Mauve','Midnight Black','Slate Blue','Olive Green'] },
          { id: 'gym-gloves',   name: 'Terinn Gym Gloves',    price: 12000, category: 'Accessories', stock: 15, tag: 'Best Seller',       image: '/src/assets/gym_gloves.png', colors: ['Midnight Black','Slate Blue'] },
          { id: 'sanitizer',    name: 'Terinn Sanitizer',     price: 3500,  category: 'Accessories', stock: 50, tag: '',       image: '/src/assets/hand_sanitizer.png', colors: ['Clear'] },
          { id: 'water-bottle', name: 'Terinn Water Bottle',  price: 8500,  category: 'Accessories', stock: 25, tag: 'Best Seller',       image: '/src/assets/water_bottle.png', colors: ['Terinn Mauve','Midnight Black'] },
          { id: 'bands',        name: 'Terinn Gym Bands',     price: 6000,  category: 'Accessories', stock: 30, tag: 'Best Seller',       image: '/src/assets/resistance_bands.png', colors: ['Terinn Mauve'] }
        ];
        localStorage.setItem('terinn_admin_products', JSON.stringify(defaultList));
        window.location.reload();
      }
    } catch (e) {}
  }, []);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Cart operations
  const addToCart = (item) => {
    setCart((prevCart) => {
      const duplicateIndex = prevCart.findIndex(
        (c) =>
          c.id === item.id &&
          c.color === item.color &&
          c.size === item.size &&
          c.type === item.type
      );
      if (duplicateIndex > -1) {
        const updated = [...prevCart];
        updated[duplicateIndex].quantity += 1;
        return updated;
      }
      return [...prevCart, item];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (index, delta) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity = newQty;
      }
      return updated;
    });
  };

  const removeItem = (index) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      updated.splice(index, 1);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [paymentChoice, setPaymentChoice] = useState('flutterwave');

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCheckoutModalOpen(true);
  };

  const calculateOrderTotals = () => {
    let currentSettings = { whatsapp: '2349053602119', discount: 0, freeDelivery: 15000 };
    try {
      const saved = localStorage.getItem('terinn_admin_settings');
      if (saved) currentSettings = JSON.parse(saved);
    } catch (err) {}

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

    const automaticSets = Math.min(topsCount, bottomsCount);
    setDiscountsCount += automaticSets;
    const totalDiscount = setDiscountsCount * 6000;
    
    const finalSubtotal = subtotal - totalDiscount;
    const sitewideDiscount = (currentSettings.discount || 0) / 100;
    const finalTotal = finalSubtotal * (1 - sitewideDiscount);

    return { finalTotal, currentSettings };
  };

  const submitCheckout = (e) => {
    e.preventDefault();
    if (!custName || !custEmail || !custPhone || !custAddress) {
      alert('Please fill out all delivery and contact details!');
      return;
    }

    const { finalTotal, currentSettings } = calculateOrderTotals();
    const orderId = 'TF-' + Math.floor(100000 + Math.random() * 900000);

    if (paymentChoice === 'flutterwave') {
      let flwKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-da72e21bfb9208b8afbb18cb';
      try {
        const savedSettings = JSON.parse(localStorage.getItem('terinn_admin_settings') || '{}');
        if (savedSettings.flwPublicKey) {
          flwKey = savedSettings.flwPublicKey;
        }
      } catch (err) {}
      
      flwKey = (flwKey || '').trim();

      if (!window.FlutterwaveCheckout) {
        alert('Flutterwave SDK is loading. Please check your network and try again in a moment.');
        return;
      }

      window.FlutterwaveCheckout({
        public_key: flwKey,
        PBFPubKey: flwKey,
        tx_ref: orderId,
        amount: finalTotal,
        currency: 'NGN',
        payment_options: 'card,banktransfer,ussd,account',
        customer: {
          email: custEmail.trim(),
          phone_number: custPhone.trim(),
          name: custName.trim(),
        },
        customizations: {
          title: 'TERINN FIT Activewear',
          description: `Payment for Order ${orderId}`,
          logo: window.location.origin + '/src/assets/logo.png',
        },
        callback: function (data) {
          if (data.status === 'successful' || data.status === 'completed') {
            const newOrder = {
              id: orderId,
              flwTransactionId: data.transaction_id || data.tx_ref,
              date: new Date().toISOString(),
              customerName: custName,
              customerEmail: custEmail,
              customerPhone: custPhone,
              address: custAddress,
              paymentMethod: 'Flutterwave (Paid)',
              items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, color: i.color, size: i.size })),
              total: finalTotal,
              status: 'Paid'
            };

            try {
              const existingOrders = JSON.parse(localStorage.getItem('terinn_admin_orders') || '[]');
              existingOrders.unshift(newOrder);
              localStorage.setItem('terinn_admin_orders', JSON.stringify(existingOrders));
            } catch (err) {}

            alert(`🎉 Payment Successful!\nOrder Ref: ${orderId}\nThank you for shopping with Terinn Fit!`);
            clearCart();
            setCheckoutModalOpen(false);
            setCustName('');
            setCustEmail('');
            setCustPhone('');
            setCustAddress('');
          } else {
            alert('Payment was not completed. Please try again.');
          }
        },
        onclose: function () {
          console.log('Flutterwave payment window closed.');
        }
      });

    } else {
      // WhatsApp Checkout Option
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        customerName: custName,
        customerEmail: custEmail,
        customerPhone: custPhone,
        address: custAddress,
        paymentMethod: 'WhatsApp Checkout',
        items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, color: i.color, size: i.size })),
        total: finalTotal,
        status: 'pending'
      };

      try {
        const existingOrders = JSON.parse(localStorage.getItem('terinn_admin_orders') || '[]');
        existingOrders.unshift(newOrder);
        localStorage.setItem('terinn_admin_orders', JSON.stringify(existingOrders));
      } catch (err) {}

      const text = `Hi Terinn Fit, I'd like to place an order!
Order ID: ${orderId}
Name: ${custName}
Email: ${custEmail}
Phone: ${custPhone}
Delivery Address: ${custAddress}

Items:
${cart.map(i => `- ${i.name} (Qty: ${i.quantity}, Size: ${i.size}, Color: ${i.color})`).join('\n')}

Total Amount: ₦${finalTotal.toLocaleString()}

Please send payment details to confirm.`;

      const cleanNum = currentSettings.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`, '_blank');

      clearCart();
      setCheckoutModalOpen(false);
      setCustName('');
      setCustEmail('');
      setCustPhone('');
      setCustAddress('');
    }
  };

  const totals = calculateOrderTotals();

  return (
    <div className="App">
      <Navbar 
        view={view} 
        setView={setView} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        setIsCartOpen={setIsCartOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {view === 'home' ? (
        <Home setView={setView} addToCart={addToCart} />
      ) : (
        <Store addToCart={addToCart} />
      )}

      {checkoutModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 5, 8, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #421820 0%, #260c12 100%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 24,
            padding: '28px 24px',
            width: '100%',
            maxWidth: 440,
            color: '#ffffff',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button 
              onClick={() => setCheckoutModalOpen(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: 18,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              &times;
            </button>

            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#f3d4d3', fontWeight: 600 }}>Secure Checkout</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, margin: '4px 0 6px', color: '#ffffff' }}>Customer Details</h3>
            <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 20 }}>Complete your details to pay securely online via Flutterwave or order on WhatsApp.</p>
            
            <form onSubmit={submitCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name *</label>
                <input 
                  type="text" 
                  className="calc-select" 
                  value={custName} 
                  onChange={e => setCustName(e.target.value)} 
                  placeholder="e.g. Jane Doe" 
                  required 
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address *</label>
                <input 
                  type="email" 
                  className="calc-select" 
                  value={custEmail} 
                  onChange={e => setCustEmail(e.target.value)} 
                  placeholder="e.g. jane@example.com" 
                  required 
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone / WhatsApp Number *</label>
                <input 
                  type="tel" 
                  className="calc-select" 
                  value={custPhone} 
                  onChange={e => setCustPhone(e.target.value)} 
                  placeholder="e.g. 08012345678" 
                  required 
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Address *</label>
                <textarea 
                  className="calc-select" 
                  value={custAddress} 
                  onChange={e => setCustAddress(e.target.value)} 
                  placeholder="Street Address, City, State" 
                  required 
                  rows="2"
                  style={{ width: '100%', resize: 'none', height: 'auto' }}
                />
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginTop: 4 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select Payment Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('flutterwave')}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 12,
                      border: paymentChoice === 'flutterwave' ? '2px solid #db2777' : '1px solid rgba(255,255,255,0.2)',
                      background: paymentChoice === 'flutterwave' ? 'rgba(219, 39, 119, 0.25)' : 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span>💳 Pay Online</span>
                    <span style={{ fontSize: 10, opacity: 0.8 }}>(Card / Transfer)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChoice('whatsapp')}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 12,
                      border: paymentChoice === 'whatsapp' ? '2px solid #25d366' : '1px solid rgba(255,255,255,0.2)',
                      background: paymentChoice === 'whatsapp' ? 'rgba(37, 211, 102, 0.25)' : 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span>💬 WhatsApp</span>
                    <span style={{ fontSize: 10, opacity: 0.8 }}>(Manual Order)</span>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-calc-submit" 
                style={{ 
                  marginTop: 10,
                  background: paymentChoice === 'flutterwave' ? '#db2777' : '#25d366',
                  boxShadow: paymentChoice === 'flutterwave' ? '0 8px 22px rgba(219, 39, 119, 0.4)' : '0 8px 22px rgba(37, 211, 102, 0.4)'
                }}
              >
                {paymentChoice === 'flutterwave' 
                  ? `Pay ₦${totals.finalTotal.toLocaleString()} via Flutterwave` 
                  : `Open WhatsApp Order →`
                }
              </button>
            </form>
          </div>
        </div>
      )}

      <CartDrawer 
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        handleCheckout={handleCheckout}
        setView={setView}
      />

      {/* Shared Footer Section */}
      <footer className="footer-editorial">
        <div className="footer-grid">
          <div className="footer-branding-col">
            <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setView('home'); }}>
              <img src={logoImg} alt="Terinn Fit Logo" />
              <span className="logo-text">TERINN FIT</span>
            </a>
            <p>For the girls who lift. Snatched fits only. Built in Lagos, Nigeria.</p>
            <div className="editorial-socials">
              <a href="https://instagram.com/terinn.fit" target="_blank" rel="noopener noreferrer">Instagram</a> / {' '}
              <a href="https://wa.me/2349053602119" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
          <div className="footer-links-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setView('home'); }}>Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setView('store'); }}>Store</a></li>
              <li><a href="#lookbook">Lookbook</a></li>
              <li><a href="#size-guide">Size Guide</a></li>
            </ul>
          </div>
          <div className="footer-contact-col">
            <h4>Support</h4>
            <p>For inquiries, custom set requests, and order details:</p>
            <a href="mailto:terinnfit@gmail.com" className="footer-mail-link">terinnfit@gmail.com</a>
          </div>
        </div>
        <div className="footer-bottom-row">
          <p>&copy; 2026 Terinn Fit Activewear. Designed with strength and elegance. Lagos, Nigeria.</p>
          <a href="/admin.html" target="_blank" style={{color:'rgba(255,255,255,0.2)',fontSize:'11px',letterSpacing:'1px',marginTop:4,display:'inline-block'}} title="Admin Access">admin ⚙</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
