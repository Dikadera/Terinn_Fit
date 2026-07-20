import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Store from './Store';
import CartDrawer from './CartDrawer';
import logoImg from './assets/logo.png';
import { saveOrderToCloud, fetchOrderFromCloud } from './firebase';

function App() {
  const [view, setView] = useState('home'); // 'home' or 'store'
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('terinn_cart_react');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Preloader State
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Track Item Modal State
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState(null);

  const DEFAULT_ORDERS = [
    {
      id: 'TF-104920',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      customerName: 'Kemi Adebayo',
      customerEmail: 'kemi.adebayo@gmail.com',
      customerPhone: '+2348012345678',
      address: '14 Admiralty Way, Lekki Phase 1, Lagos State',
      items: [{ name: 'Terinn Leggings', quantity: 1, price: 20000 }, { name: 'Terinn Sports Bra', quantity: 1, price: 18000 }],
      total: 38000,
      status: 'Dispatched'
    },
    {
      id: 'TF-104921',
      date: new Date(Date.now() - 86400000).toISOString(),
      customerName: 'Blessing Okon',
      customerEmail: 'blessing.okon@yahoo.com',
      customerPhone: '+2349087654321',
      address: '42 Isaac John Street, Ikeja GRA, Lagos State',
      items: [{ name: 'Terinn Crop Top', quantity: 2, price: 20000 }],
      total: 40000,
      status: 'Processing'
    },
    {
      id: 'TF-104922',
      date: new Date().toISOString(),
      customerName: 'Chioma Nnadi',
      customerEmail: 'chioma.n@gmail.com',
      customerPhone: '+2347033445566',
      address: 'Plot 10 Victoria Island Extension, Lagos State',
      items: [{ name: 'Crimson Red Power Bodysuit', quantity: 1, price: 22000 }],
      total: 22000,
      status: 'Delivered'
    }
  ];

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    const query = trackQuery.trim();
    if (!query) return;

    try {
      const match = await fetchOrderFromCloud(query);
      if (match) {
        setTrackResult({ found: true, order: match });
      } else {
        setTrackResult({ found: false, query: trackQuery });
      }
    } catch (err) {
      setTrackResult({ found: false, query: trackQuery });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 18) + 12);
      });
    }, 110);
    return () => clearInterval(interval);
  }, []);

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
            { id: 'gym-gloves', name: 'Terinn Gym Gloves', price: 12000, category: 'Accessories', stock: 15, tag: '', image: '/assets/gym_gloves.png', colors: ['Midnight Black', 'Slate Blue'] },
            { id: 'sanitizer', name: 'Terinn Sanitizer', price: 3500, category: 'Accessories', stock: 50, tag: '', image: '/assets/hand_sanitizer.png', colors: ['Clear'] },
            { id: 'water-bottle', name: 'Terinn Water Bottle', price: 8500, category: 'Accessories', stock: 25, tag: '', image: '/assets/water_bottle.png', colors: ['Terinn Mauve', 'Midnight Black'] },
            { id: 'bands', name: 'Terinn Gym Bands', price: 6000, category: 'Accessories', stock: 30, tag: '', image: '/assets/resistance_bands.png', colors: ['Terinn Mauve'] }
          ];
          localStorage.setItem('terinn_admin_products', JSON.stringify([...parsed, ...defaultAccs]));
          window.location.reload();
        }
      } else {
        const defaultList = [
          { id: 'sports-bra', name: 'Terinn Sports Bra', price: 18000, category: 'Tops', stock: 24, tag: 'Best Seller', image: '/assets/sports_bra_mauve.png', colors: ['Terinn Mauve', 'Midnight Black', 'Slate Blue', 'Olive Green'] },
          { id: 'leggings', name: 'Terinn Leggings', price: 20000, category: 'Bottoms', stock: 18, tag: 'Best Seller', image: '/assets/leggings_mauve.png', colors: ['Terinn Mauve', 'Midnight Black', 'Slate Blue', 'Olive Green'] },
          { id: 'crop-top', name: 'Terinn Crop Top', price: 20000, category: 'Tops', stock: 15, tag: 'Best Seller', image: '/assets/crop_top_black.png', colors: ['Midnight Black', 'Terinn Mauve', 'Slate Blue', 'Olive Green'] },
          { id: 'long-sleeve', name: 'Terinn Long Sleeve', price: 22000, category: 'Tops', stock: 10, tag: 'Best Seller', image: '/assets/terinn_hero_bg.png', colors: ['Terinn Mauve', 'Midnight Black', 'Slate Blue', 'Olive Green'] },
          { id: 'biker-shorts', name: 'Terinn Biker Shorts', price: 16000, category: 'Bottoms', stock: 20, tag: 'Best Seller', image: '/assets/terinn_gallery_1.png', colors: ['Slate Blue', 'Terinn Mauve', 'Midnight Black', 'Olive Green'] },
          { id: 'shorts', name: 'Terinn Shorts', price: 15000, category: 'Bottoms', stock: 12, tag: 'Best Seller', image: '/assets/terinn_hero_bg.png', colors: ['Terinn Mauve', 'Midnight Black', 'Slate Blue', 'Olive Green'] },
          { id: 'gym-gloves', name: 'Terinn Gym Gloves', price: 12000, category: 'Accessories', stock: 15, tag: 'Best Seller', image: '/assets/gym_gloves.png', colors: ['Midnight Black', 'Slate Blue'] },
          { id: 'sanitizer', name: 'Terinn Sanitizer', price: 3500, category: 'Accessories', stock: 50, tag: '', image: '/assets/hand_sanitizer.png', colors: ['Clear'] },
          { id: 'water-bottle', name: 'Terinn Water Bottle', price: 8500, category: 'Accessories', stock: 25, tag: 'Best Seller', image: '/assets/water_bottle.png', colors: ['Terinn Mauve', 'Midnight Black'] },
          { id: 'bands', name: 'Terinn Gym Bands', price: 6000, category: 'Accessories', stock: 30, tag: 'Best Seller', image: '/assets/resistance_bands.png', colors: ['Terinn Mauve'] }
        ];
        localStorage.setItem('terinn_admin_products', JSON.stringify(defaultList));
        window.location.reload();
      }
    } catch (e) { }
  }, []);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // VIP Newsletter Modal State
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipEmail, setVipEmail] = useState('');
  const [vipPhone, setVipPhone] = useState('');
  const [vipSuccessMsg, setVipSuccessMsg] = useState('');

  useEffect(() => {
    const dismissed = localStorage.getItem('terinn_vip_newsletter_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowVipModal(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleVipSubmit = (e) => {
    e.preventDefault();
    if (!vipEmail.trim()) return;

    try {
      const stored = localStorage.getItem('terinn_admin_subscribers');
      const subscribers = stored ? JSON.parse(stored) : [];
      const newSub = {
        id: 'sub-' + Date.now(),
        email: vipEmail.trim(),
        phone: vipPhone.trim() || 'N/A',
        date: new Date().toISOString()
      };
      subscribers.push(newSub);
      localStorage.setItem('terinn_admin_subscribers', JSON.stringify(subscribers));
    } catch (err) { }

    localStorage.setItem('terinn_vip_newsletter_dismissed', 'true');
    setVipSuccessMsg('🎉 Welcome to the TERINN FIT Inner Circle! Check your email for your 15% discount code.');
    setTimeout(() => {
      setShowVipModal(false);
      setVipSuccessMsg('');
    }, 3200);
  };

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
  const [successModalData, setSuccessModalData] = useState(null);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCheckoutModalOpen(true);
  };

  const calculateOrderTotals = () => {
    let currentSettings = { whatsapp: '2349053602119', discount: 0, freeDelivery: 15000 };
    try {
      const saved = localStorage.getItem('terinn_admin_settings');
      if (saved) currentSettings = JSON.parse(saved);
    } catch (err) { }

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
      } catch (err) { }

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
              status: 'paid'
            };

            saveOrderToCloud(newOrder);

            clearCart();
            setCheckoutModalOpen(false);
            setSuccessModalData(newOrder);
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

      saveOrderToCloud(newOrder);

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
      {/* Luxury Brand Preloader Overlay */}
      {loading && (
        <div className={`terinn-preloader ${progress >= 100 ? 'fade-out' : ''}`}>
          <div className="preloader-content">
            <div className="preloader-logo-ring">
              <img src={logoImg} alt="Terinn Fit Logo" className="preloader-logo-img" />
              <div className="orbiting-spinner"></div>
            </div>
            <h1 className="preloader-brand-title">TERINN FIT</h1>
            <p className="preloader-tagline">SNATCHED & POWERFUL</p>
            <div className="preloader-progress-track">
              <div className="preloader-progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="preloader-percent-text">{progress}%</span>
          </div>
        </div>
      )}

      <Navbar
        view={view}
        setView={setView}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        setIsCartOpen={setIsCartOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenTrackModal={() => setTrackModalOpen(true)}
      />

      {view === 'home' ? (
        <Home setView={setView} addToCart={addToCart} onOpenTrackModal={() => setTrackModalOpen(true)} />
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

      {/* Custom Dynamic Payment Success Modal */}
      {successModalData && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 5, 8, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: 16
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #421820 0%, #260c12 100%)',
            border: '1px solid rgba(255, 255, 255, 0.28)',
            borderRadius: 24,
            padding: '32px 24px',
            width: '100%',
            maxWidth: 420,
            color: '#ffffff',
            boxShadow: '0 30px 70px rgba(0,0,0,0.65)',
            textAlign: 'center'
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(37, 211, 102, 0.18)',
              border: '2px solid #25d366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 34,
              color: '#25d366',
              boxShadow: '0 0 30px rgba(37, 211, 102, 0.45)'
            }}>
              ✓
            </div>

            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#81c784', fontWeight: 700 }}>Payment Confirmed</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, margin: '6px 0 8px', color: '#ffffff' }}>Order Successful!</h3>
            <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 20, lineHeight: 1.4 }}>
              Thank you <strong style={{ color: '#ffffff' }}>{successModalData.customerName}</strong>! Your payment was received and your snatched fit is being prepared.
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 16,
              padding: '16px 14px',
              marginBottom: 20,
              textAlign: 'left',
              fontSize: 12
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ opacity: 0.7 }}>Order Ref:</span>
                <strong style={{ color: '#f3d4d3', letterSpacing: 0.5 }}>{successModalData.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ opacity: 0.7 }}>Total Amount:</span>
                <strong style={{ color: '#ffffff', fontSize: 14 }}>₦{successModalData.total.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.7 }}>Payment Status:</span>
                <span style={{ color: '#81c784', fontWeight: 600 }}>✓ Paid Online</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => setSuccessModalData(null)}
                className="btn-calc-submit"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 14,
                  marginTop: 0,
                  background: '#db2777',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '1px'
                }}
              >
                CONTINUE SHOPPING ➔
              </button>
            </div>
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
              <li><a href="#" onClick={(e) => { e.preventDefault(); setTrackModalOpen(true); }}>Track Item</a></li>
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
          <p>&copy; 2026 Terinn Fit Activewear. Designed with ❤️ by techBundo. Lagos, Nigeria.</p>
          <a href="/admin.html" target="_blank" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', letterSpacing: '1px', marginTop: 4, display: 'inline-block' }} title="Admin Access">admin ⚙</a>
        </div>
      </footer>

      {/* Track Item / Order Modal */}
      {trackModalOpen && (
        <div className="quick-view-modal-overlay" onClick={() => { setTrackModalOpen(false); setTrackResult(null); }}>
          <div className="quick-view-modal-card track-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-quick-view" onClick={() => { setTrackModalOpen(false); setTrackResult(null); }}>&times;</button>

            <div className="track-header-badge">
              <span className="live-dot"></span>
              <span>LIVE PACKAGE STATUS</span>
            </div>

            <h2 className="track-modal-title">TRACK YOUR ORDER</h2>
            <p className="track-modal-subtitle">
              Enter your Order Reference Number (e.g. <strong>TF-104920</strong>) below.
            </p>

            <form onSubmit={handleTrackSubmit} className="track-input-form">
              <input
                type="text"
                className="track-input-field"
                placeholder="Order Reference ID (e.g. TF-104920) *"
                required
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-calc-submit track-submit-btn"
              >
                TRACK PACKAGE ➔
              </button>
            </form>

            {trackResult && (
              trackResult.found ? (
                <div className="track-result-box success">
                  <div className="track-order-top-row">
                    <span className="track-order-id">ORDER #{trackResult.order.id}</span>
                    <span className="track-status-pill">
                      {trackResult.order.status || 'PROCESSING'}
                    </span>
                  </div>

                  {/* Step-by-step Visual Fulfillment Pipeline */}
                  <div className="tracking-pipeline-stepper">
                    <div className={`step-node ${['processing', 'dispatched', 'delivered', 'completed', 'paid', 'pending'].includes((trackResult.order.status || '').toLowerCase()) ? 'active' : ''}`}>
                      <div className="step-circle">1</div>
                      <span className="step-label">Processing</span>
                    </div>
                    <div className={`step-line ${['dispatched', 'delivered', 'completed'].includes((trackResult.order.status || '').toLowerCase()) ? 'active' : ''}`}></div>
                    <div className={`step-node ${['dispatched', 'delivered', 'completed'].includes((trackResult.order.status || '').toLowerCase()) ? 'active' : ''}`}>
                      <div className="step-circle">2</div>
                      <span className="step-label">Dispatched</span>
                    </div>
                    <div className={`step-line ${['delivered', 'completed'].includes((trackResult.order.status || '').toLowerCase()) ? 'active' : ''}`}></div>
                    <div className={`step-node ${['delivered', 'completed'].includes((trackResult.order.status || '').toLowerCase()) ? 'active' : ''}`}>
                      <div className="step-circle">3</div>
                      <span className="step-label">Delivered</span>
                    </div>
                  </div>

                  <div className="track-details-grid">
                    <div>
                      <span className="track-detail-label">Customer Name</span>
                      <strong className="track-detail-val">{trackResult.order.customerName}</strong>
                    </div>
                    <div>
                      <span className="track-detail-label">Order Total</span>
                      <strong className="track-detail-val">₦{Number(trackResult.order.total).toLocaleString()}</strong>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <span className="track-detail-label">Delivery Address</span>
                    <p className="track-detail-val" style={{ margin: '2px 0 0', fontWeight: 500 }}>{trackResult.order.address}</p>
                  </div>
                </div>
              ) : (
                <div className="track-result-box not-found">
                  <div style={{ fontSize: 24, marginBottom: 4 }}>📦</div>
                  <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: '#f87171' }}>No record found for "{trackResult.query}"</h4>
                  <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 14px', lineHeight: 1.4 }}>
                    Please verify your Order ID or connect with our Terinn Fit Live Support team on WhatsApp.
                  </p>
                  <a
                    href={`https://wa.me/2349053602119?text=Hello%20Terinn%20Fit,%20I%20would%20like%20to%20track%20my%20order:%20${encodeURIComponent(trackResult.query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="track-whatsapp-btn"
                  >
                    💬 Ask Live Support on WhatsApp
                  </a>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Luxury VIP Newsletter & Pre-Order Popup Modal */}
      {showVipModal && (
        <div className="quick-view-modal-overlay" onClick={() => { setShowVipModal(false); localStorage.setItem('terinn_vip_newsletter_dismissed', 'true'); }}>
          <div className="quick-view-modal-card" style={{ maxWidth: 480, padding: 32, textAlign: 'center', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-quick-view" onClick={() => { setShowVipModal(false); localStorage.setItem('terinn_vip_newsletter_dismissed', 'true'); }}>&times;</button>
            <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#db2777', fontWeight: 800, display: 'block', marginBottom: 6 }}>
              EXCLUSIVE INNER CIRCLE
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-brand-wine)', marginBottom: 8 }}>
              JOIN THE TERINN FIT CLUB
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 20 }}>
              Subscribe to get instant alerts on secret activewear drops, pre-orders, and <strong>15% OFF</strong> your first snatched fit.
            </p>

            {vipSuccessMsg ? (
              <div style={{ background: '#ecfdf5', color: '#047857', padding: '16px', borderRadius: '16px', fontSize: 13.5, fontWeight: 600, border: '1px solid #a7f3d0' }}>
                {vipSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleVipSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email address *"
                    required
                    value={vipEmail}
                    onChange={(e) => setVipEmail(e.target.value)}
                    style={{ width: '100%', padding: '13px 18px', borderRadius: '30px', border: '1.5px solid var(--color-border)', fontSize: '14px', outline: 'none', background: '#fdfbf7' }}
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="WhatsApp / Phone number (Optional)"
                    value={vipPhone}
                    onChange={(e) => setVipPhone(e.target.value)}
                    style={{ width: '100%', padding: '13px 18px', borderRadius: '30px', border: '1.5px solid var(--color-border)', fontSize: '14px', outline: 'none', background: '#fdfbf7' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-calc-submit"
                  style={{ width: '100%', padding: '14px', borderRadius: '30px', fontSize: '14px', marginTop: 4 }}
                >
                  GET MY 15% DISCOUNT &rarr;
                </button>
              </form>
            )}
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#999', fontSize: 12, marginTop: 14, cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => { setShowVipModal(false); localStorage.setItem('terinn_vip_newsletter_dismissed', 'true'); }}
            >
              No thanks, I'll pay full price
            </button>
          </div>
        </div>
      )}
      {/* Dynamic Floating Glassmorphic Side Social Dock */}
      <div className="floating-side-social-dock">
        <a 
          href="https://instagram.com/terinn.fit" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="side-social-btn instagram"
          title="Follow @terinn.fit on Instagram"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span className="side-social-tooltip">@terinn.fit</span>
        </a>
        <a 
          href="https://wa.me/2349053602119?text=Hello%20Terinn%20Fit,%20I'm%20interested%20in%20your%20activewear!" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="side-social-btn whatsapp"
          title="Chat on WhatsApp"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span className="side-social-tooltip">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

export default App;
