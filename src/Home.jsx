import React, { useState, useEffect, useRef } from 'react';
import heroBgImg from './assets/terinn_hero_bg.png';
import gallery1Img from './assets/terinn_gallery_1.png';
import modelRedStanding from './assets/model_red_standing.jpg';
import modelBurgundyStanding from './assets/model_burgundy_standing.jpg';
import modelBurgundyCrouch from './assets/model_burgundy_crouch.jpg';

// Product Images
import sportsBraImg from './assets/sports_bra_mauve.png';
import leggingsImg from './assets/leggings_mauve.png';
import cropTopImg from './assets/crop_top_black.png';
import longSleeveImg from './assets/terinn_hero_bg.png';
import bikerShortsImg from './assets/terinn_gallery_1.png';
import shortsImg from './assets/terinn_hero_bg.png';

// Accessory Images
import gymGlovesImg from './assets/gym_gloves.png';
import sanitizerImg from './assets/hand_sanitizer.png';
import waterBottleImg from './assets/water_bottle.png';
import gymBandsImg from './assets/resistance_bands.png';

// Real Model Showcase Slides (Default Fallback)
const DEFAULT_MODEL_SHOWCASE = [
  {
    id: 'slide-1',
    title: 'Crimson Red Power Bodysuit',
    tag: 'Signature Series • Sculpted Back',
    desc: 'High-compression, cross-back design built for maximum mobility, strength, and squat-proof support.',
    price: '₦22,000',
    colorName: 'Crimson Red',
    image: modelRedStanding,
  },
  {
    id: 'slide-2',
    title: 'Deep Wine Active Bodysuit',
    tag: 'Collection 02 • Snatched Core',
    desc: 'Deep burgundy compression bodysuit crafted to hold you in seamlessly while lifting and training.',
    price: '₦24,000',
    colorName: 'Deep Wine',
    image: modelBurgundyStanding,
  },
  {
    id: 'slide-3',
    title: 'Deep Wine Flex Bodysuit',
    tag: 'Flexibility & Strength • 4-Way Stretch',
    desc: 'Ergonomic, low-back compression unitard engineered for deep squats, mobility, and breathability.',
    price: '₦24,000',
    colorName: 'Deep Wine',
    image: modelBurgundyCrouch,
  }
];

// ─── Snatch Carousel Data ─────────────────────────────────────────────────
const snatchProducts = [
  { id: 'sports-bra',   name: 'Terinn Sports Bra',    price: 18000, category: 'Tops',    tag: 'Best Seller', colors: ['Terinn Mauve','Midnight Black','Slate Blue','Olive Green'], image: sportsBraImg },
  { id: 'leggings',     name: 'Terinn Leggings',       price: 20000, category: 'Bottoms', tag: 'Squat Proof', colors: ['Terinn Mauve','Midnight Black','Slate Blue','Olive Green'], image: leggingsImg },
  { id: 'crop-top',     name: 'Terinn Crop Top',       price: 20000, category: 'Tops',    tag: '',            colors: ['Midnight Black','Terinn Mauve','Slate Blue','Olive Green'], image: cropTopImg },
  { id: 'long-sleeve',  name: 'Terinn Long Sleeve',    price: 22000, category: 'Tops',    tag: '',            colors: ['Terinn Mauve','Midnight Black','Slate Blue','Olive Green'], image: longSleeveImg },
  { id: 'biker-shorts', name: 'Terinn Biker Shorts',   price: 16000, category: 'Bottoms', tag: '',            colors: ['Slate Blue','Terinn Mauve','Midnight Black','Olive Green'], image: bikerShortsImg },
  { id: 'shorts',       name: 'Terinn Shorts',         price: 15000, category: 'Bottoms', tag: '',            colors: ['Terinn Mauve','Midnight Black','Slate Blue','Olive Green'], image: shortsImg },
  { id: 'gym-gloves',   name: 'Terinn Gym Gloves',    price: 12000, category: 'Accessories', tag: '',         colors: ['Midnight Black','Slate Blue'], image: gymGlovesImg },
  { id: 'sanitizer',    name: 'Terinn Sanitizer',     price: 3500,  category: 'Accessories', tag: '',         colors: ['Clear'], image: sanitizerImg },
  { id: 'water-bottle', name: 'Terinn Water Bottle',  price: 8500,  category: 'Accessories', tag: '',         colors: ['Terinn Mauve','Midnight Black'], image: waterBottleImg },
  { id: 'bands',        name: 'Terinn Gym Bands',     price: 6000,  category: 'Accessories', tag: '',         colors: ['Terinn Mauve'], image: gymBandsImg },
];

const colorHex = {
  'Terinn Mauve':  '#8a5e66',
  'Midnight Black': '#1a1a1a',
  'Slate Blue':    '#5f6d7a',
  'Olive Green':   '#535d4f',
  'Clear':         '#e2e8f0',
};


function Home({ setView, addToCart, onOpenTrackModal }) {
  // Helper to add a bestseller product to cart
  const handleAddBestseller = (p, e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    btn.disabled = true;
    const oldText = btn.textContent;
    btn.textContent = 'Adding...';

    setTimeout(() => {
      addToCart({
        id: p.id,
        name: p.name,
        price: p.price,
        img: p.image,
        color: (p.colors && p.colors[0]) || 'Terinn Mauve',
        size: 'M',
        type: 'single',
        quantity: 1
      });
      btn.disabled = false;
      btn.textContent = oldText;
    }, 600);
  };

  // Load products from localStorage or default, and randomize
  const [carouselProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('terinn_admin_products');
      const base = stored ? JSON.parse(stored) : snatchProducts;
      const assetMap = {
        '/src/assets/sports_bra_mauve.png': sportsBraImg,
        '/src/assets/leggings_mauve.png': leggingsImg,
        '/src/assets/crop_top_black.png': cropTopImg,
        '/src/assets/terinn_hero_bg.png': longSleeveImg,
        '/src/assets/terinn_gallery_1.png': bikerShortsImg,
        '/src/assets/gym_gloves.png': gymGlovesImg,
        '/src/assets/hand_sanitizer.png': sanitizerImg,
        '/src/assets/water_bottle.png': waterBottleImg,
        '/src/assets/resistance_bands.png': gymBandsImg,
      };
      
      // Carousel Above: Apparel (everything except Accessories)
      const apparel = base.filter(p => p.category?.toLowerCase() !== 'accessories');
      const processed = apparel.map(p => ({
        ...p,
        image: assetMap[p.image] || p.image || sportsBraImg
      }));
      return [...processed].sort(() => Math.random() - 0.5);
    } catch (e) {
      return snatchProducts.filter(p => p.category?.toLowerCase() !== 'accessories').sort(() => Math.random() - 0.5);
    }
  });

  const [carouselProductsAlt] = useState(() => {
    try {
      const stored = localStorage.getItem('terinn_admin_products');
      const base = stored ? JSON.parse(stored) : snatchProducts;
      const assetMap = {
        '/src/assets/sports_bra_mauve.png': sportsBraImg,
        '/src/assets/leggings_mauve.png': leggingsImg,
        '/src/assets/crop_top_black.png': cropTopImg,
        '/src/assets/terinn_hero_bg.png': longSleeveImg,
        '/src/assets/terinn_gallery_1.png': bikerShortsImg,
        '/src/assets/gym_gloves.png': gymGlovesImg,
        '/src/assets/hand_sanitizer.png': sanitizerImg,
        '/src/assets/water_bottle.png': waterBottleImg,
        '/src/assets/resistance_bands.png': gymBandsImg,
      };

      // Carousel Below: Accessories only
      const accessories = base.filter(p => p.category?.toLowerCase() === 'accessories');
      const listToProcess = accessories.length > 0 ? accessories : snatchProducts.filter(p => p.category?.toLowerCase() === 'accessories');
      
      const processed = listToProcess.map(p => ({
        ...p,
        image: assetMap[p.image] || p.image || gymGlovesImg
      }));
      return [...processed].sort(() => Math.random() - 0.5);
    } catch (e) {
      return snatchProducts.filter(p => p.category?.toLowerCase() === 'accessories').sort(() => Math.random() - 0.5);
    }
  });

  const [bestsellers] = useState(() => {
    try {
      const stored = localStorage.getItem('terinn_admin_products');
      const base = stored ? JSON.parse(stored) : snatchProducts;
      const assetMap = {
        '/src/assets/sports_bra_mauve.png': sportsBraImg,
        '/src/assets/leggings_mauve.png': leggingsImg,
        '/src/assets/crop_top_black.png': cropTopImg,
        '/src/assets/terinn_hero_bg.png': longSleeveImg,
        '/src/assets/terinn_gallery_1.png': bikerShortsImg,
        '/src/assets/gym_gloves.png': gymGlovesImg,
        '/src/assets/hand_sanitizer.png': sanitizerImg,
        '/src/assets/water_bottle.png': waterBottleImg,
        '/src/assets/resistance_bands.png': gymBandsImg,
      };
      
      const processed = base.map(p => ({
        ...p,
        image: assetMap[p.image] || p.image || sportsBraImg
      }));

      // Filter products marked 'Best Seller'
      let filtered = processed.filter(p => p.tag === 'Best Seller');
      
      // If we don't have 9, pad with remaining items
      if (filtered.length < 9) {
        const remaining = processed.filter(p => p.tag !== 'Best Seller');
        filtered = [...filtered, ...remaining].slice(0, 9);
      } else {
        filtered = filtered.slice(0, 9);
      }
      return filtered;
    } catch (e) {
      return snatchProducts.slice(0, 9);
    }
  });

  // Size Calculator State
  const [calcTab, setCalcTab] = useState('standard');
  const [sizeSystem, setSizeSystem] = useState('UK');
  const [standardVal, setStandardVal] = useState('12');
  const [bustSize, setBustSize] = useState('');
  const [waistSize, setWaistSize] = useState('');
  const [recommendedSize, setRecommendedSize] = useState('');
  const [resultDetails, setResultDetails] = useState('');

  const calculateSize = () => {
    let size = 'M';
    let details = '';

    if (calcTab === 'standard') {
      if (standardVal === '8') {
        size = 'S';
      } else if (standardVal === '12') {
        size = 'M';
      } else if (standardVal === '14') {
        size = 'L';
      } else {
        size = 'XL';
      }
      details = `Standard ${sizeSystem} equivalent size recommended.`;
    } else {
      const bust = parseFloat(bustSize);
      const waist = parseFloat(waistSize);

      if (!bust || !waist) {
        alert('Please fill out both bust and waist measurements!');
        return;
      }

      if (waist <= 27 && bust <= 34) {
        size = 'S';
      } else if (waist <= 30 && bust <= 38) {
        size = 'M';
      } else if (waist <= 34 && bust <= 42) {
        size = 'L';
      } else {
        size = 'XL';
      }
      details = `Based on your bust (${bust}") and waist (${waist}") measurements.`;
    }

    setRecommendedSize(size);
    setResultDetails(`${details} Perfect snatched fit designed for training.`);
  };

  const [modelShowcaseSlides] = useState(() => {
    try {
      const stored = localStorage.getItem('terinn_admin_showcase');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const assetMap = {
            '/assets/model_red_standing.jpg': modelRedStanding,
            '/assets/model_burgundy_standing.jpg': modelBurgundyStanding,
            '/assets/model_burgundy_crouch.jpg': modelBurgundyCrouch,
            '/src/assets/model_red_standing.jpg': modelRedStanding,
            '/src/assets/model_burgundy_standing.jpg': modelBurgundyStanding,
            '/src/assets/model_burgundy_crouch.jpg': modelBurgundyCrouch,
          };
          return parsed.map(s => ({
            ...s,
            image: assetMap[s.image] || s.image || modelRedStanding
          }));
        }
      }
    } catch (e) {}
    return DEFAULT_MODEL_SHOWCASE;
  });

  const [modelSlideIdx, setModelSlideIdx] = useState(0);
  const [viewModalImage, setViewModalImage] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setModelSlideIdx(prev => (prev + 1) % modelShowcaseSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [modelShowcaseSlides.length]);

  // Policies Tab State
  const [activePolicy, setActivePolicy] = useState('orders');

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Waitlist Form State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState('');

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setWaitlistStatus('Submitting...');

    try {
      const stored = localStorage.getItem('terinn_admin_subscribers');
      const subscribers = stored ? JSON.parse(stored) : [];
      const newSub = {
        id: 'sub-' + Date.now(),
        email: email.trim(),
        phone: phone.trim() || 'N/A',
        date: new Date().toISOString()
      };
      subscribers.push(newSub);
      localStorage.setItem('terinn_admin_subscribers', JSON.stringify(subscribers));
    } catch(err) {}

    setTimeout(() => {
      setWaitlistStatus('Welcome to the Terinn Fit Inner Circle! 🎉 15% discount registered.');
      setEmail('');
      setPhone('');
    }, 800);
  };

  return (
    <>
      <section className="hero-section-new">
        <div className="hero-layout">

          {/* Left: Glassmorphic card */}
          <div className="hero-card-new">

            <h2 className="hero-card-logo-new">TERINN FIT</h2>

            <div className="hero-slide-content">
              <h1 className="hero-card-title-new">
                Your New Everyday Power Fit.
              </h1>

              <p className="hero-card-desc-new">
                Built for the girls who lift. Snatched, strong, and unapologetically you.
              </p>

              <div className="hero-card-buttons-new">
                <button onClick={() => setView('store')} className="hero-card-btn primary">
                  SHOP COLLECTION
                </button>
                <button 
                  onClick={() => { if (onOpenTrackModal) onOpenTrackModal(); }} 
                  className="hero-card-btn secondary hero-track-btn-desktop"
                >
                  📦 TRACK YOUR ITEM
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Only: Outside Card Container */}
          <div className="hero-outside-track-card" onClick={() => { if (onOpenTrackModal) onOpenTrackModal(); }}>
            <div className="track-card-left">
              <span className="live-dot" style={{ width: 8, height: 8 }}></span>
              <div style={{ textAlign: 'left' }}>
                <span className="track-card-tag">ALREADY ORDERED?</span>
                <h4 className="track-card-title">Track Your Item Status</h4>
              </div>
            </div>
            <button className="track-card-arrow-btn">
              TRACK ➔
            </button>
          </div>

          {/* Right: Model photo overlay */}
          <img src={heroBgImg} alt="Terinn Fit Model" className="hero-model-img" />

        </div>
        <div className="hero-bottom-tag-new">Collection 01 • Mauve Compression Set</div>
      </section>

      {/* ─── Bestsellers Section — 9 Products Grid ─── */}
      <section className="bestsellers-section">
        <div className="bestsellers-container">
          <div className="bestsellers-header">
            <span className="pre-title">Trending Now</span>
            <h2 className="bestsellers-title">Our Best Sellers</h2>
            <p className="bestsellers-sub">High performance compression activewear loved by our fitness community.</p>
          </div>

          <div className="bestsellers-grid">
            {bestsellers.map((prod) => (
              <div key={prod.id} className="bestseller-card compact-product-card" onClick={() => setView('store')}>
                <div className="bestseller-img-wrap product-img-wrap">
                  <img src={prod.image} alt={prod.name} onError={(e) => { e.target.src = '/src/assets/logo.png'; }} />
                  {prod.tag && <span className="product-tag">{prod.tag}</span>}
                  <button 
                    type="button"
                    className="quick-view-eye-btn-center"
                    title="Quick View Product"
                    onClick={(e) => {
                      e.stopPropagation();
                      setView('store');
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
                <div className="bestseller-info product-info">
                  <span className="product-cat-label">{prod.category || 'Activewear'}</span>
                  <h3 className="product-title">{prod.name}</h3>
                  <span className="product-price">₦{Number(prod.price).toLocaleString()}</span>
                  <button 
                    className="btn btn-add-cart" 
                    onClick={(e) => handleAddBestseller(prod, e)}
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Size Calculator & Sizing Section ─── */}
      <section id="size-guide" className="editorial-size-section">
        <div className="editorial-section-title-wrap">
          <span className="pre-title">Precision Fit</span>
          <h2 className="editorial-section-title">Find Your Perfect Fit</h2>
        </div>

        <div className="size-calculator-grid">
          {/* Left: Size Calculator Form */}
          <div className="size-calc-card">
            <h3>Interactive Size Calculator</h3>
            <p style={{ marginBottom: 20 }}>Select your usual clothing size or enter bust and waist measurements for a tailored fit recommendation.</p>

            <div className="calc-tabs">
              <button 
                className={`calc-tab ${calcTab === 'standard' ? 'active' : ''}`}
                onClick={() => setCalcTab('standard')}
              >
                Standard Size
              </button>
              <button 
                className={`calc-tab ${calcTab === 'measurements' ? 'active' : ''}`}
                onClick={() => setCalcTab('measurements')}
              >
                Exact Measurements
              </button>
            </div>

            {calcTab === 'standard' ? (
              <div className="calc-standard-group" style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Size System</label>
                <div className="size-system-pills" style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  {['UK', 'US', 'EUR'].map((sys) => (
                    <button
                      key={sys}
                      type="button"
                      style={{
                        padding: '6px 14px',
                        fontSize: 12,
                        fontWeight: 600,
                        borderRadius: 20,
                        border: '1px solid var(--color-border)',
                        background: sizeSystem === sys ? 'var(--color-brand-wine)' : 'transparent',
                        color: sizeSystem === sys ? '#fff' : 'inherit',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSizeSystem(sys)}
                    >
                      {sys}
                    </button>
                  ))}
                </div>
                <select className="calc-select" value={standardVal} onChange={(e) => setStandardVal(e.target.value)}>
                    <option value="8">8</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                </select>
              </div>
            ) : (
              <div className="calc-measurements-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Bust (inches)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 34" 
                    className="calc-select" 
                    value={bustSize}
                    onChange={(e) => setBustSize(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Waist (inches)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 28" 
                    className="calc-select" 
                    value={waistSize}
                    onChange={(e) => setWaistSize(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button className="btn btn-calc-submit" onClick={calculateSize}>Calculate My Fit</button>

            {recommendedSize && (
              <div className="calc-result">
                <span className="result-label">Recommended Terinn Size</span>
                <span className="result-value">{recommendedSize}</span>
                <p className="result-details">{resultDetails}</p>
              </div>
            )}
          </div>

          {/* Right: Sizing Chart */}
          <div className="size-table-card">
            <h3>Size Conversion Guide</h3>
            <p style={{ marginBottom: 20 }}>Use our general size conversion chart to find your perfect Terinn activewear size.</p>

            <table className="size-table">
              <thead>
                <tr>
                  <th>Terinn Size</th>
                  <th>UK Size</th>
                  <th>US Size</th>
                  <th>Bust (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr className={recommendedSize === 'S' ? 'highlight-row' : ''}>
                  <td><strong>S</strong></td>
                  <td>6 - 8</td>
                  <td>2 - 4</td>
                  <td>32 - 34</td>
                </tr>
                <tr className={recommendedSize === 'M' || (!recommendedSize) ? 'highlight-row' : ''}>
                  <td><strong>M</strong></td>
                  <td>10 - 12</td>
                  <td>6 - 8</td>
                  <td>36 - 38</td>
                </tr>
                <tr className={recommendedSize === 'L' ? 'highlight-row' : ''}>
                  <td><strong>L</strong></td>
                  <td>14 - 16</td>
                  <td>10 - 12</td>
                  <td>40 - 42</td>
                </tr>
                <tr className={recommendedSize === 'XL' ? 'highlight-row' : ''}>
                  <td><strong>XL</strong></td>
                  <td>18</td>
                  <td>14 - 16</td>
                  <td>44 - 46</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Real Model Showcase Carousel Section ─── */}
      <section className="model-carousel-section">
        <div className="model-carousel-container">
          <div className="model-carousel-header">
            <span className="pre-title">For The Girls Who Lift</span>
            <h2 className="model-carousel-title">Designed to Snatch</h2>
            <p className="model-carousel-sub">Real activewear performance worn by authentic fitness models.</p>
          </div>

          <div className="model-carousel-grid">
            {/* Left: Interactive Model Frame */}
            <div className="model-photo-frame">
              <img 
                key={modelShowcaseSlides[modelSlideIdx].id} 
                src={modelShowcaseSlides[modelSlideIdx].image} 
                alt={modelShowcaseSlides[modelSlideIdx].title} 
                className="model-showcase-img model-fade-in"
              />
              <button 
                type="button"
                className="quick-view-eye-btn-center"
                title="Quick View Full Resolution Fit"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewModalImage(modelShowcaseSlides[modelSlideIdx]);
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

              <span className="model-slide-tag">{modelShowcaseSlides[modelSlideIdx].tag}</span>
              
              {/* Carousel Controls */}
              <div className="model-carousel-controls">
                <button 
                  type="button"
                  className="model-nav-btn" 
                  onClick={() => setModelSlideIdx((modelSlideIdx - 1 + modelShowcaseSlides.length) % modelShowcaseSlides.length)}
                  title="Previous Model"
                >
                  ←
                </button>
                <div className="model-dots">
                  {modelShowcaseSlides.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`model-dot ${modelSlideIdx === idx ? 'active' : ''}`}
                      onClick={() => setModelSlideIdx(idx)}
                    />
                  ))}
                </div>
                <button 
                  type="button"
                  className="model-nav-btn" 
                  onClick={() => setModelSlideIdx((modelSlideIdx + 1) % modelShowcaseSlides.length)}
                  title="Next Model"
                >
                  →
                </button>
              </div>
            </div>

            {/* Right: Ethos Quote Card & Product Specs */}
            <div className="model-info-card">
              <div className="quote-block">
                <span className="quote-mark">“</span>
                <p className="ethos-quote">
                  We believe activewear should be comfortable, stylish, and affordable. We also give our customers the freedom to shop individual pieces or complete sets based on their needs and budget.
                </p>
                <span className="ethos-author">— TERINN FIT ETHOS</span>
              </div>

              <div className="active-look-box">
                <span className="look-badge">Featured Fit</span>
                <h3 className="look-title">{modelShowcaseSlides[modelSlideIdx].title}</h3>
                <p className="look-desc">{modelShowcaseSlides[modelSlideIdx].desc}</p>
                <div className="look-action-row">
                  <span className="look-price">
                    {
                      String(modelShowcaseSlides[modelSlideIdx].price || '').startsWith('₦')
                        ? modelShowcaseSlides[modelSlideIdx].price
                        : `₦${Number(modelShowcaseSlides[modelSlideIdx].price || 0).toLocaleString()}`
                    }
                  </span>
                  <button 
                    className="btn btn-calc-submit btn-shop-this-look" 
                    onClick={() => setView('store')}
                  >
                    Shop This Look &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Hub Section */}
      <section id="policies" className="editorial-policies-section">
        <div className="editorial-policies-grid">
          <div className="policy-hub-editorial">
            <div className="editorial-section-title-wrap text-left">
              <span className="pre-title">Support Hub</span>
              <h2 className="editorial-section-title">Order Policies</h2>
            </div>
            
            <div className="policy-tabs-editorial">
              <button 
                className={`policy-tab ${activePolicy === 'orders' ? 'active' : ''}`}
                onClick={() => setActivePolicy('orders')}
              >
                Orders & Delivery
              </button>
              <button 
                className={`policy-tab ${activePolicy === 'returns' ? 'active' : ''}`}
                onClick={() => setActivePolicy('returns')}
              >
                Returns & Exchanges
              </button>
              <button 
                className={`policy-tab ${activePolicy === 'pricing' ? 'active' : ''}`}
                onClick={() => setActivePolicy('pricing')}
              >
                Pricing & Privacy
              </button>
            </div>

            <div className="policy-content-box-editorial">
              {activePolicy === 'orders' && (
                <div className="policy-pane active">
                  <div className="policy-item-editorial">
                    <h4>Orders Confirmation</h4>
                    <p>Orders are confirmed only after full payment is received. Please review your size, color, address, and phone number before placing your order. Orders cannot be changed once processing begins.</p>
                  </div>
                  <div className="policy-item-editorial">
                    <h4>Delivery Timelines</h4>
                    <p>Orders are processed within 1-2 business days. Delivery timelines vary by address, location, and courier service.</p>
                  </div>
                </div>
              )}

              {activePolicy === 'returns' && (
                <div className="policy-pane active">
                  <div className="policy-item-editorial">
                    <h4>Returns & Exchanges</h4>
                    <p>Due to hygiene reasons, we do not accept returns on worn, washed, damaged, or altered items. Exchanges are accepted within 24 hours of delivery. Items must be unworn, unused, with tags and original packaging intact.</p>
                  </div>
                  <div className="policy-item-editorial">
                    <h4>Damaged/Incorrect Orders</h4>
                    <p>Report any issue within 24 hours of delivery. Kindly provide clear photos and an unboxing video. We will review and resolve verified issues promptly.</p>
                  </div>
                </div>
              )}

              {activePolicy === 'pricing' && (
                <div className="policy-pane active">
                  <div className="policy-item-editorial">
                    <h4>Pricing & Promotions</h4>
                    <p>Prices and promotions may change without prior notice. Discounts cannot be combined unless stated otherwise.</p>
                  </div>
                  <div className="policy-item-editorial">
                    <h4>Privacy Policy</h4>
                    <p>Customer information is used solely for order processing, delivery, and support. We secure all data and never share with third parties.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div id="faq" className="faq-accordion-editorial">
            <div className="editorial-section-title-wrap text-left">
              <span className="pre-title">FAQ</span>
              <h2 className="editorial-section-title">Common Questions</h2>
            </div>
            
            <div className="faq-list">
              <div className={`faq-item ${activeFaq === 0 ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(0)}>
                  <span>What makes Terinn.Fit different?</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer">
                  <p>We believe activewear should be comfortable, stylish, and affordable. We also give our customers the freedom to shop individual pieces or complete sets based on their needs and budget. Our fits are custom tailored for girls who lift, prioritizing compression, style, and high-performance durability.</p>
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 1 ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(1)}>
                  <span>Do you only sell matching sets?</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer">
                  <p>No! At Terinn.fit, we sell both matching sets and individual pieces. You can purchase tops, shorts, leggings, and other items separately or mix and match them to create your own unique look.</p>
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 2 ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(2)}>
                  <span>Where are you based and do you ship?</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer">
                  <p>We are based in Lagos, Nigeria. We offer swift delivery across Lagos and nationwide courier shipping to all states in Nigeria.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Waitlist Banner */}
      <section className="waitlist-editorial">
        <div className="waitlist-inner-card">
          <span className="waitlist-badge">Pre-Order Drops Only</span>
          <h2 className="waitlist-main-title">Join The Inner Circle</h2>
          <p>Subscribe to be notified of the next exclusive activewear drop. Early access members get 15% off their first custom set.</p>
          <form onSubmit={handleWaitlistSubmit} className="waitlist-form-editorial">
            <div className="form-input-row-vip">
              <input 
                type="email" 
                className="waitlist-email-input" 
                placeholder="Email address *" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="tel" 
                className="waitlist-email-input" 
                placeholder="WhatsApp / Phone (Optional)" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button type="submit" className="waitlist-submit-btn">Subscribe</button>
            </div>
            {waitlistStatus && (
              <div className={`form-status ${waitlistStatus.includes('Welcome') ? 'success' : ''}`}>
                {waitlistStatus}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Full Photo Quick View Modal */}
      {viewModalImage && (
        <div className="quick-view-modal-overlay" onClick={() => setViewModalImage(null)}>
          <div className="quick-view-modal-card" style={{ maxWidth: 560, padding: 28, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-quick-view" onClick={() => setViewModalImage(null)}>&times;</button>
            <div style={{ borderRadius: 18, overflow: 'hidden', background: '#fdfbf7', border: '1px solid var(--color-border)', marginBottom: 16 }}>
              <img 
                src={viewModalImage.image} 
                alt={viewModalImage.title} 
                style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain', display: 'block' }} 
              />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: 'var(--color-brand-wine)', marginBottom: 4 }}>
              {viewModalImage.title}
            </h3>
            <span style={{ fontSize: 13, color: '#db2777', fontWeight: 700, display: 'block', marginBottom: 8 }}>
              {viewModalImage.tag} • {viewModalImage.price}
            </span>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '0 auto 18px', maxWidth: 460 }}>
              {viewModalImage.desc}
            </p>
            <button 
              className="btn btn-calc-submit" 
              style={{ padding: '0.75rem 2rem', borderRadius: 25, fontSize: '0.85rem' }}
              onClick={() => {
                setViewModalImage(null);
                setView('store');
              }}
            >
              Shop This Look &rarr;
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
