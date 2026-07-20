import React, { useState, useEffect, useRef } from 'react';
import heroBgImg from './assets/terinn_hero_bg.png';
import gallery1Img from './assets/terinn_gallery_1.png';

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


function Home({ setView, addToCart }) {
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

  // Hero Carousel State & Multi-Slide Data
  const heroSlides = [
    {
      id: 0,
      tag: "Collection 01 • Mauve Compression Set",
      title: "Your New Everyday Power Fit.",
      desc: "Built for the girls who lift. Snatched, strong, and unapologetically you.",
      btnPrimaryText: "EXPLORE CUSTOMIZER",
      btnPrimaryAction: () => setView('store'),
      btnSecondaryText: "VIEW LOOKBOOK",
      btnSecondaryHref: "#lookbook",
      bgImg: heroBgImg
    },
    {
      id: 1,
      tag: "Collection 02 • Slate Blue Core Set",
      title: "Sculpted Active Compression.",
      desc: "Maximum breathability & support designed for heavy leg days and training.",
      btnPrimaryText: "SHOP SLATE BLUE",
      btnPrimaryAction: () => setView('store'),
      btnSecondaryText: "FIND YOUR FIT",
      btnSecondaryHref: "#size-guide",
      bgImg: gallery1Img
    },
    {
      id: 2,
      tag: "Bundle Deal • Save ₦6,000 Instantly",
      title: "Mix & Match Custom Sets.",
      desc: "Pair any Sports Bra or Crop Top with Leggings or Shorts & get ₦6k off.",
      btnPrimaryText: "BUILD YOUR SET",
      btnPrimaryAction: () => setView('store'),
      btnSecondaryText: "EXPLORE STORE",
      btnSecondaryAction: () => setView('store'),
      bgImg: cropTopImg
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleSlideChange = (index) => {
    if (index < 0) index = heroSlides.length - 1;
    if (index >= heroSlides.length) index = 0;
    setCurrentSlide(index);
  };

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

  // Policies Tab State
  const [activePolicy, setActivePolicy] = useState('orders');

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Waitlist Form State
  const [email, setEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState('');

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    setWaitlistStatus('Submitting...');
    setTimeout(() => {
      setWaitlistStatus('Welcome to the Terinn Fit Inner Circle! 🎉');
      setEmail('');
    }, 1000);
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <>
      <section className="hero-section-new">
        <div className="hero-layout">

          {/* Left: Glassmorphic card */}
          <div className="hero-card-new">

            <h2 className="hero-card-logo-new">TERINN FIT</h2>

            <div key={activeSlide.id} className="hero-slide-content">
              <h1 className="hero-card-title-new">
                {activeSlide.title}
              </h1>

              <p className="hero-card-desc-new">
                {activeSlide.desc}
              </p>

              <div className="hero-card-buttons-new">
                <button onClick={activeSlide.btnPrimaryAction} className="hero-card-btn primary">
                  {activeSlide.btnPrimaryText}
                </button>
                {activeSlide.btnSecondaryHref ? (
                  <a href={activeSlide.btnSecondaryHref} className="hero-card-btn secondary">
                    {activeSlide.btnSecondaryText}
                  </a>
                ) : (
                  <button onClick={activeSlide.btnSecondaryAction} className="hero-card-btn secondary">
                    {activeSlide.btnSecondaryText}
                  </button>
                )}
              </div>
            </div>

            <div className="hero-card-controls-new">
              <button className="arrow-btn-new" onClick={() => handleSlideChange(currentSlide - 1)}>←</button>
              <div className="dots-container-new">
                {heroSlides.map((_, idx) => (
                  <div key={idx} className={`dot-new ${currentSlide === idx ? 'active' : ''}`} onClick={() => handleSlideChange(idx)}></div>
                ))}
              </div>
              <button className="arrow-btn-new" onClick={() => handleSlideChange(currentSlide + 1)}>→</button>
            </div>

          </div>

          {/* Right: Dynamic Model photo overlay */}
          <img key={activeSlide.id} src={activeSlide.bgImg} alt="Terinn Fit Model" className="hero-model-img hero-model-fade" />

        </div>
        <div className="hero-bottom-tag-new">{activeSlide.tag}</div>
      </section>




      {/* ─── Bestsellers Section — 9 Products Grid ─── */}
      <section className="bestsellers-section">
        <div className="bestsellers-container">
          <div className="bestsellers-header">
            <span className="pre-title">Trending Now</span>
            <h2 className="bestsellers-title">Our Best Sellers</h2>
            <p className="bestsellers-subtitle">The absolute favorites, snatched and compression-optimized for peak performance.</p>
          </div>
          <div className="bestsellers-grid">
            {bestsellers.map((p) => (
              <div key={p.id} className="bestseller-card" onClick={() => setView('store')}>
                <div className="bestseller-img-wrap">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="bestseller-img" 
                    onError={(e) => { e.target.src = '/src/assets/logo.png'; }}
                  />
                  {p.tag && <span className="bestseller-badge">{p.tag}</span>}
                </div>
                <div className="bestseller-info">
                  <span className="bestseller-category">{p.category}</span>
                  <h3 className="bestseller-name">{p.name}</h3>
                  <span className="bestseller-price">₦{p.price.toLocaleString()}</span>
                  <button className="btn-bestseller-explore" onClick={(e) => handleAddBestseller(p, e)}>Add to Bag</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bestsellers-more-wrap">
            <button onClick={() => setView('store')} className="btn-bestsellers-more">
              Show More Products &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Lookbook Section */}
      <section id="lookbook" class="editorial-lookbook">
        <div class="editorial-section-title-wrap">
            <span class="pre-title">Selected Collections</span>
            <h2 class="editorial-section-title">Designed to Snatch</h2>
        </div>
        <div class="lookbook-grid">
            <div class="lookbook-item large-card">
                <div class="card-img-wrap">
                    <img src={gallery1Img} alt="Terinn Fit Slate Blue Collection" />
                </div>
                <div class="card-info">
                    <span class="card-category">Training / Yoga</span>
                    <h3>The Slate Blue Core Set</h3>
                    <p>Breathable, compressive nylon-spandex blend that holds you in at the right places.</p>
                </div>
            </div>
            <div class="lookbook-item text-card">
                <div class="text-card-content">
                    <span class="quote-icon">“</span>
                    <blockquote>
                        We believe activewear should be comfortable, stylish, and affordable. We also give our customers the freedom to shop individual pieces or complete sets based on their needs and budget.
                    </blockquote>
                    <cite>— Terinn Fit Ethos</cite>
                </div>
            </div>
        </div>
      </section>

      {/* Sizing Calculator Section */}
      <section id="size-guide" className="editorial-size-section">
        <div className="editorial-section-title-wrap">
          <span className="pre-title">Sizing Guide</span>
          <h2 className="editorial-section-title">Find Your Perfect Fit</h2>
        </div>

        <div className="size-calculator-grid">
          <div className="size-calc-card">
            <h3>Fit Recommendation Engine</h3>
            <p>Input your details or select your standard size system to find the optimal size for active compression.</p>
            
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
              <div className="calc-group">
                <label>Select Size System</label>
                <div className="size-system-selector" style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  {['UK', 'US', 'EUR'].map((sys) => (
                    <button
                      key={sys}
                      type="button"
                      className={`btn-secondary ${sizeSystem === sys ? 'active-sys' : ''}`}
                      style={{
                        padding: '6px 14px',
                        fontSize: 12,
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

                <select 
                  className="calc-select" 
                  value={standardVal}
                  onChange={(e) => setStandardVal(e.target.value)}
                >
                  {sizeSystem === 'UK' && (
                    <>
                      <option value="6">UK 6 (Extra Small)</option>
                      <option value="8">UK 8 (Small)</option>
                      <option value="10">UK 10 (Small / Medium)</option>
                      <option value="12">UK 12 (Medium)</option>
                      <option value="14">UK 14 (Large)</option>
                      <option value="16">UK 16 (Extra Large)</option>
                      <option value="18">UK 18 (XXL)</option>
                    </>
                  )}
                  {sizeSystem === 'US' && (
                    <>
                      <option value="2">US 2 (Extra Small)</option>
                      <option value="4">US 4 (Small)</option>
                      <option value="6">US 6 (Small / Medium)</option>
                      <option value="8">US 8 (Medium)</option>
                      <option value="10">US 10 (Large)</option>
                      <option value="12">US 12 (Extra Large)</option>
                    </>
                  )}
                  {sizeSystem === 'EUR' && (
                    <>
                      <option value="34">EUR 34 (XS)</option>
                      <option value="36">EUR 36 (S)</option>
                      <option value="38">EUR 38 (M)</option>
                      <option value="40">EUR 40 (M/L)</option>
                      <option value="42">EUR 42 (L)</option>
                      <option value="44">EUR 44 (XL)</option>
                    </>
                  )}
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

            <button 
              className="btn-calc-submit"
              onClick={calculateSize}
              style={{ width: '100%', marginTop: 8 }}
            >
              Calculate Size
            </button>

            {recommendedSize && (
              <div className="calc-result" style={{ display: 'block' }}>
                <span className="result-label">Recommended Size:</span>
                <span className="result-value">{recommendedSize}</span>
                <p className="result-details">{resultDetails}</p>
              </div>
            )}
          </div>

          <div className="size-table-card">
            <table className="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>UK</th>
                  <th>US</th>
                  <th>EUR</th>
                </tr>
              </thead>
              <tbody>
                <tr className={recommendedSize === 'S' ? 'highlight-row' : ''}>
                  <td><strong>S</strong></td>
                  <td>8 - 10</td>
                  <td>6</td>
                  <td>34 - 36</td>
                </tr>
                <tr className={recommendedSize === 'M' || (!recommendedSize) ? 'highlight-row' : ''}>
                  <td><strong>M</strong></td>
                  <td>12</td>
                  <td>8 - 10</td>
                  <td>38 - 40</td>
                </tr>
                <tr className={recommendedSize === 'L' ? 'highlight-row' : ''}>
                  <td><strong>L</strong></td>
                  <td>14 - 16</td>
                  <td>12 - 14</td>
                  <td>42 - 44</td>
                </tr>
                <tr className={recommendedSize === 'XL' ? 'highlight-row' : ''}>
                  <td><strong>XL</strong></td>
                  <td>18</td>
                  <td>16</td>
                  <td>46</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Designed to Snatch — Dual Auto-Scroll Carousels ─── */}
      <section className="snatch-section">
        <div className="snatch-header">
          <span className="pre-title">Selected Pieces</span>
          <h2 className="snatch-title">Designed to Snatch</h2>
        </div>

        {/* Row 1 — scrolls right */}
        <div className="snatch-track-wrapper">
          <div className="snatch-track snatch-track-right">
            {[...carouselProducts, ...carouselProducts].map((p, i) => (
              <div key={`r-${i}`} className="snatch-card" onClick={() => setView('store')}>
                <div className="snatch-card-img-wrap">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="snatch-card-img" 
                    onError={(e) => { e.target.src = '/src/assets/logo.png'; }}
                  />
                </div>
                <div className="snatch-card-tag">{p.tag || p.category}</div>
                <div className="snatch-card-body">
                  <div className="snatch-card-colors">
                    {(p.colors || []).slice(0, 4).map(c => (
                      <span key={c} className="snatch-dot" style={{ backgroundColor: colorHex[c] || '#8a5e66' }} title={c} />
                    ))}
                  </div>
                  <div className="snatch-card-name">{p.name}</div>
                  <div className="snatch-card-price">₦{p.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls left */}
        <div className="snatch-track-wrapper">
          <div className="snatch-track snatch-track-left">
            {[...carouselProductsAlt, ...carouselProductsAlt].map((p, i) => (
              <div key={`l-${i}`} className="snatch-card" onClick={() => setView('store')}>
                <div className="snatch-card-img-wrap">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="snatch-card-img" 
                    onError={(e) => { e.target.src = '/src/assets/logo.png'; }}
                  />
                </div>
                <div className="snatch-card-tag">{p.tag || p.category}</div>
                <div className="snatch-card-body">
                  <div className="snatch-card-colors">
                    {(p.colors || []).slice(0, 4).map(c => (
                      <span key={c} className="snatch-dot" style={{ backgroundColor: colorHex[c] || '#8a5e66' }} title={c} />
                    ))}
                  </div>
                  <div className="snatch-card-name">{p.name}</div>
                  <div className="snatch-card-price">₦{p.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
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
            <div className="form-input-row">
              <input 
                type="email" 
                className="waitlist-email-input" 
                placeholder="Your email address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
    </>
  );
}

export default Home;
