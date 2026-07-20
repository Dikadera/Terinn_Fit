import React, { useState } from 'react';
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

function Store({ addToCart }) {
  const [activeTab, setActiveTab] = useState('catalog');

  // Catalog products state (loads from localStorage or default)
  const [productsList] = useState(() => {
    const fallbackList = [
      { id: 'sports-bra', name: 'Terinn Sports Bra', price: 18000, img: sportsBraImg, desc: 'High support, compressive, double-lined crop top style sports bra.', tag: 'Best Seller', colors: ['Terinn Mauve', 'Midnight Black', 'Slate Blue', 'Olive Green'] },
      { id: 'leggings', name: 'Terinn Leggings', price: 20000, img: leggingsImg, desc: 'High-waisted compression leggings, seamless front waistband design.', tag: 'Squat Proof', colors: ['Terinn Mauve', 'Midnight Black', 'Slate Blue', 'Olive Green'] },
      { id: 'crop-top', name: 'Terinn Crop Top', price: 20000, img: cropTopImg, desc: 'Ultra lightweight, breathable cropped tee for heavy lift sessions.', colors: ['Midnight Black', 'Terinn Mauve', 'Slate Blue', 'Olive Green'] },
      { id: 'long-sleeve', name: 'Terinn Long Sleeve', price: 22000, img: longSleeveImg, desc: 'Snug fitted training top with functional thumbholes and zip neck.', colors: ['Terinn Mauve', 'Midnight Black', 'Slate Blue', 'Olive Green'] },
      { id: 'biker-shorts', name: 'Terinn Biker Shorts', price: 16000, img: bikerShortsImg, desc: 'Mid-thigh compression shorts designed to prevent roll-up while lifting.', colors: ['Slate Blue', 'Terinn Mauve', 'Midnight Black', 'Olive Green'] },
      { id: 'shorts', name: 'Terinn Shorts', price: 15000, img: shortsImg, desc: 'Breathable, relaxed-fit outer shell shorts with built-in compression liner.', colors: ['Terinn Mauve', 'Midnight Black', 'Slate Blue', 'Olive Green'] },
      { id: 'gym-gloves', name: 'Terinn Gym Gloves', price: 12000, img: gymGlovesImg, desc: 'Premium fitness lifting gloves designed for maximum palm protection and grip.', colors: ['Midnight Black', 'Slate Blue'] },
      { id: 'sanitizer', name: 'Terinn Sanitizer', price: 3500, img: sanitizerImg, desc: 'Sleek, pocket-sized organic hand sanitizer spray with a refreshing clean scent.', colors: ['Clear'] },
      { id: 'water-bottle', name: 'Terinn Water Bottle', price: 8500, img: waterBottleImg, desc: 'Premium matte insulated steel water bottle to keep your drinks ice cold.', colors: ['Terinn Mauve', 'Midnight Black'] },
      { id: 'bands', name: 'Terinn Gym Bands', price: 6000, img: gymBandsImg, desc: 'Set of premium fabric resistance loops in pastel tones, squat-proof design.', colors: ['Terinn Mauve'] }
    ];
    try {
      const stored = localStorage.getItem('terinn_admin_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        const assetMap = {
          '/assets/sports_bra_mauve.png': sportsBraImg,
          '/assets/leggings_mauve.png': leggingsImg,
          '/assets/crop_top_black.png': cropTopImg,
          '/assets/terinn_hero_bg.png': longSleeveImg,
          '/assets/terinn_gallery_1.png': bikerShortsImg,
          '/assets/gym_gloves.png': gymGlovesImg,
          '/assets/hand_sanitizer.png': sanitizerImg,
          '/assets/water_bottle.png': waterBottleImg,
          '/assets/resistance_bands.png': gymBandsImg,
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
        return parsed.map(p => ({
          ...p,
          img: assetMap[p.image] || p.image || sportsBraImg,
          desc: p.desc || 'Premium, high-performance training activewear designed to snatch.'
        }));
      }
    } catch(e) {}
    return fallbackList;
  });

  // Load dynamic category list
  const activeCategories = (() => {
    try {
      const stored = localStorage.getItem('terinn_admin_categories');
      const baseCats = stored ? JSON.parse(stored) : ['Tops', 'Bottoms', 'Sets', 'Accessories'];
      const hasBestsellers = productsList.some(p => p.tag === 'Best Seller');
      if (hasBestsellers) {
        return ['Best Sellers', ...baseCats];
      }
      return baseCats;
    } catch(e) {
      return ['Best Sellers', 'Tops', 'Bottoms', 'Sets', 'Accessories'];
    }
  })();

  // Catalog item choices state (keyed by product ID)
  const [choices, setChoices] = useState(() => {
    const defaultChoices = {
      'sports-bra': { color: 'Terinn Mauve', size: 'M' },
      'leggings': { color: 'Terinn Mauve', size: 'M' },
      'crop-top': { color: 'Midnight Black', size: 'M' },
      'long-sleeve': { color: 'Terinn Mauve', size: 'M' },
      'biker-shorts': { color: 'Slate Blue', size: 'M' },
      'shorts': { color: 'Terinn Mauve', size: 'M' },
      'gym-gloves': { color: 'Midnight Black', size: 'M' },
      'sanitizer': { color: 'Clear', size: 'M' },
      'water-bottle': { color: 'Terinn Mauve', size: 'M' },
      'bands': { color: 'Terinn Mauve', size: 'M' },
    };
    try {
      const stored = localStorage.getItem('terinn_admin_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.forEach(p => {
          if (!defaultChoices[p.id]) {
            defaultChoices[p.id] = { color: (p.colors && p.colors[0]) || 'Terinn Mauve', size: 'M' };
          }
        });
      }
    } catch(e) {}
    return defaultChoices;
  });

  const handleChoiceChange = (productId, field, value) => {
    setChoices((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  // Color hex mapping for dynamic colorways rendering in customizer
  const colorHex = {
    'Terinn Mauve':  '#8a5e66',
    'Midnight Black': '#1a1a1a',
    'Slate Blue':    '#5f6d7a',
    'Olive Green':   '#535d4f',
    'Clear':         '#e2e8f0',
  };

  // Dynamic top and bottom styles derived from productsList set in admin
  const topStyles = productsList
    .filter(p => (p.category || '').toLowerCase() === 'tops')
    .map(p => ({ name: p.name.replace('Terinn ', ''), value: p.id, price: p.price }));

  const bottomStyles = productsList
    .filter(p => (p.category || '').toLowerCase() === 'bottoms')
    .map(p => ({ name: p.name.replace('Terinn ', ''), value: p.id, price: p.price }));

  // Customizer States
  const [selectedTop, setSelectedTop] = useState(() => topStyles[0]?.value || 'sports-bra');
  const [selectedBottom, setSelectedBottom] = useState(() => bottomStyles[0]?.value || 'leggings');
  const [selectedTopPrice, setSelectedTopPrice] = useState(() => topStyles[0]?.price || 18000);
  const [selectedBottomPrice, setSelectedBottomPrice] = useState(() => bottomStyles[0]?.price || 20000);
  const [selectedColor, setSelectedColor] = useState('#8a5e66');
  const [selectedColorName, setSelectedColorName] = useState('Terinn Mauve');
  const [selectedSize, setSelectedSize] = useState('M');

  // Derive unique colors from the current selected top and bottom products
  const selectedTopObj = productsList.find(p => p.id === selectedTop);
  const selectedBottomObj = productsList.find(p => p.id === selectedBottom);
  const combinedColors = Array.from(new Set([
    ...(selectedTopObj?.colors || []),
    ...(selectedBottomObj?.colors || [])
  ]));

  const colorways = combinedColors.length > 0 
    ? combinedColors.map(c => ({ name: c, hex: colorHex[c] || '#8a5e66' }))
    : [
        { name: 'Terinn Mauve', hex: '#8a5e66' },
        { name: 'Midnight Black', hex: '#1a1a1a' },
        { name: 'Slate Blue', hex: '#5f6d7a' },
        { name: 'Olive Green', hex: '#535d4f' }
      ];

  const sizes = ['S', 'M', 'L', 'XL'];

  const handleTopSelect = (val, price) => {
    setSelectedTop(val);
    setSelectedTopPrice(price);
  };

  const handleBottomSelect = (val, price) => {
    setSelectedBottom(val);
    setSelectedBottomPrice(price);
  };

  // Customizer Set Details
  const rawSum = selectedTopPrice + selectedBottomPrice;
  const discount = 6000;
  const finalPrice = rawSum - discount;

  const handleAddCustomSet = (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    const oldText = btn.textContent;
    btn.textContent = 'Adding Custom Set...';

    const topObj = topStyles.find(t => t.value === selectedTop);
    const bottomObj = bottomStyles.find(b => b.value === selectedBottom);
    const topName = topObj ? topObj.name : 'Top';
    const bottomName = bottomObj ? bottomObj.name : 'Bottom';

    setTimeout(() => {
      addToCart({
        id: `${selectedTop}_${selectedBottom}`,
        name: `Custom Set: ${topName} + ${bottomName}`,
        price: selectedTopPrice + selectedBottomPrice,
        img: longSleeveImg,
        color: selectedColorName,
        size: selectedSize,
        type: 'custom-set',
        quantity: 1
      });
      btn.disabled = false;
      btn.textContent = oldText;
    }, 800);
  };


  const handleAddCatalogItem = (product, e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = 'Adding...';

    const pChoice = choices[product.id];

    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        color: pChoice.color,
        size: pChoice.size,
        type: 'single',
        quantity: 1
      });
      btn.disabled = false;
      btn.textContent = 'Add to Bag';
    }, 600);
  };

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <>
      {/* Store Hero Banner */}
      <section className="store-hero">
        <div className="store-hero-content">
          <span className="pre-title">Official Collection</span>
          <h1>Shop The Elite Snatched Fits</h1>
          <p>Elevate your training and lifestyle. Mix and match pieces or order complete customized sets with special package discounts.</p>
        </div>
      </section>

      {/* Store Navigation Tabs */}
      <div className="store-tabs-bar">
        <div className="store-tabs-container">
          <button 
            className={`store-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            Individual Pieces
          </button>
          <button 
            className={`store-tab-btn ${activeTab === 'customizer-sec' ? 'active' : ''}`}
            onClick={() => setActiveTab('customizer-sec')}
          >
            Mix & Match Customizer
          </button>
        </div>
      </div>

      {/* Catalog Section */}
      <section id="catalog" className={`store-section ${activeTab === 'catalog' ? 'active' : ''}`}>
        <div className="store-container">
          {activeCategories.map((category) => {
            const categoryProducts = category === 'Best Sellers'
              ? productsList.filter((p) => p.tag === 'Best Seller')
              : productsList.filter((p) => (p.category || 'Other').toLowerCase() === category.toLowerCase());
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category} className="store-category-section">
                <div className="store-category-header">
                  <h2 className="store-category-title">{category}</h2>
                </div>
                <div className="products-grid">
                  {categoryProducts.map((prod) => (
                    <div key={prod.id} className="product-card compact-product-card" onClick={() => setQuickViewProduct(prod)}>
                      <div className="product-img-wrap">
                        <img src={prod.img} alt={prod.name} />
                        {prod.tag && <span className="product-tag">{prod.tag}</span>}
                        <button 
                          type="button"
                          className="quick-view-eye-btn-center"
                          title="Quick View Product"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProduct(prod);
                          }}
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </div>
                      <div className="product-info">
                        <h3 className="product-title">{prod.name}</h3>
                        <span className="product-price">₦{prod.price.toLocaleString()}</span>
                        
                        <button 
                          className="btn btn-add-cart"
                          style={{ marginTop: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddCatalogItem(prod, e);
                          }}
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="quick-view-modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="quick-view-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-quick-view" onClick={() => setQuickViewProduct(null)}>&times;</button>
            <div className="quick-view-grid">
              <div className="quick-view-img-col">
                <img src={quickViewProduct.img} alt={quickViewProduct.name} />
                {quickViewProduct.tag && <span className="product-tag">{quickViewProduct.tag}</span>}
              </div>
              <div className="quick-view-info-col">
                <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-brand-wine)', fontWeight: 700 }}>
                  {quickViewProduct.category || 'Activewear'}
                </span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, margin: '4px 0 6px', color: 'var(--color-brand-wine)' }}>
                  {quickViewProduct.name}
                </h2>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#db2777', display: 'block', marginBottom: 12 }}>
                  ₦{quickViewProduct.price.toLocaleString()}
                </span>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 18 }}>
                  {quickViewProduct.desc}
                </p>

                <div className="quick-view-selectors" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="select-field">
                    <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-text-muted)', marginBottom: 6 }}>Select Color</label>
                    <select 
                      className="prod-color-select"
                      value={choices[quickViewProduct.id] ? choices[quickViewProduct.id].color : (quickViewProduct.colors ? quickViewProduct.colors[0] : 'Terinn Mauve')}
                      onChange={(e) => handleChoiceChange(quickViewProduct.id, 'color', e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: 8 }}
                    >
                      {(quickViewProduct.colors || ['Terinn Mauve']).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="select-field">
                    <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-text-muted)', marginBottom: 6 }}>Select Size</label>
                    <select 
                      className="prod-size-select"
                      value={choices[quickViewProduct.id] ? choices[quickViewProduct.id].size : 'M'}
                      onChange={(e) => handleChoiceChange(quickViewProduct.id, 'size', e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: 8 }}
                    >
                      {sizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  className="btn-calc-submit"
                  style={{ marginTop: 20, width: '100%' }}
                  onClick={(e) => {
                    handleAddCatalogItem(quickViewProduct, e);
                    setQuickViewProduct(null);
                  }}
                >
                  Add ₦{quickViewProduct.price.toLocaleString()} to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customizer Section */}
      <section id="customizer-sec" className={`store-section fashion-customizer-section ${activeTab === 'customizer-sec' ? 'active' : ''}`}>
        <div className="customizer-split-grid">
          {/* Left Preview silhouette */}
          <div className="customizer-preview-frame">
            <div className="preview-border-container">
              <span className="preview-edition">Interactive Customizer</span>
              <div className="avatar-silhouette">
                {/* Top Silhouette SVG */}
                <svg className="activewear-svg top-svg" id="svgTop" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    id="sports-bra" 
                    className="activewear-path"
                    d="M 60,30 C 70,30 80,35 100,55 C 120,35 130,30 140,30 L 145,55 C 145,55 130,68 132,100 L 68,100 C 70,68 55,55 55,55 Z" 
                    fill={selectedColor} 
                    style={{ display: selectedTop === 'sports-bra' ? 'block' : 'none' }}
                  />
                  <path 
                    id="crop-top" 
                    className="activewear-path"
                    d="M 50,25 C 65,25 75,30 100,50 C 125,30 135,25 150,25 L 155,75 C 150,85 145,95 138,115 L 62,115 C 55,95 50,85 45,75 Z" 
                    fill={selectedColor}
                    style={{ display: selectedTop === 'crop-top' ? 'block' : 'none' }}
                  />
                  <path 
                    id="long-sleeve" 
                    className="activewear-path"
                    d="M 65,25 C 80,30 90,40 100,50 C 110,40 120,30 135,25 L 140,40 L 175,100 L 160,105 L 132,65 L 130,110 L 70,110 L 68,65 L 40,105 L 25,100 L 60,40 Z" 
                    fill={selectedColor}
                    style={{ display: selectedTop === 'long-sleeve' ? 'block' : 'none' }}
                  />
                </svg>

                {/* Bottom Silhouette SVG */}
                <svg className="activewear-svg bottom-svg" id="svgBottom" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    id="leggings" 
                    className="activewear-path" 
                    d="M 68,2 L 132,2 C 132,2 135,25 140,60 C 145,100 148,150 142,220 L 118,220 C 118,220 115,160 100,100 L 100,100 C 85,160 82,220 82,220 L 58,220 C 52,150 55,100 60,60 C 65,25 68,2 68,2 Z" 
                    fill={selectedColor}
                    style={{ display: selectedBottom === 'leggings' ? 'block' : 'none' }}
                  />
                  <path 
                    id="biker-shorts" 
                    className="activewear-path"
                    d="M 68,2 L 132,2 C 132,2 134,25 138,55 C 140,75 141,95 136,120 L 115,120 C 115,120 110,80 100,55 L 100,55 C 90,80 85,120 85,120 L 64,120 C 59,95 60,75 62,55 C 66,25 68,2 68,2 Z" 
                    fill={selectedColor}
                    style={{ display: selectedBottom === 'biker-shorts' ? 'block' : 'none' }}
                  />
                  <path 
                    id="shorts" 
                    className="activewear-path"
                    d="M 68,2 L 132,2 C 132,2 133,20 136,45 C 138,58 138,62 132,75 L 114,75 C 114,75 110,50 100,40 L 100,40 C 90,50 86,75 86,75 L 68,75 C 62,62 62,58 64,45 C 67,20 68,2 68,2 Z" 
                    fill={selectedColor}
                    style={{ display: selectedBottom === 'shorts' ? 'block' : 'none' }}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Customizer Settings */}
          <div className="customizer-options-panel">
            <div className="options-header">
              <span className="step-num">Design A Complete Set</span>
              <h2>Customize Your Power Fit</h2>
              <p>Select your top and bottom styles, customize colorway, and grab a set to automatically receive our custom discount.</p>
            </div>

            {/* Tops */}
            <div className="select-group-editorial">
              <span className="group-title">Choose Active Top</span>
              <div className="editorial-cards-row">
                {topStyles.map((t) => (
                  <div 
                    key={t.value} 
                    className={`option-card ${selectedTop === t.value ? 'active' : ''}`}
                    onClick={() => handleTopSelect(t.value, t.price)}
                  >
                    <span className="option-name">{t.name}</span>
                    <span className="option-price">₦{t.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottoms */}
            <div className="select-group-editorial">
              <span className="group-title">Choose Active Bottom</span>
              <div className="editorial-cards-row">
                {bottomStyles.map((b) => (
                  <div 
                    key={b.value} 
                    className={`option-card ${selectedBottom === b.value ? 'active' : ''}`}
                    onClick={() => handleBottomSelect(b.value, b.price)}
                  >
                    <span className="option-name">{b.name}</span>
                    <span className="option-price">₦{b.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="select-group-editorial">
              <span className="group-title">Select Colorway</span>
              <div className="color-picker-row">
                {colorways.map((col) => (
                  <button 
                    key={col.hex}
                    className={`color-dot ${selectedColor === col.hex ? 'active' : ''}`}
                    style={{ backgroundColor: col.hex }}
                    onClick={() => {
                      setSelectedColor(col.hex);
                      setSelectedColorName(col.name);
                    }}
                    title={col.name}
                  />
                ))}
              </div>
              <div className="color-name-display">Selected Color: {selectedColorName}</div>
            </div>

            {/* Size */}
            <div className="select-group-editorial">
              <span className="group-title">Select Size</span>
              <div className="size-picker-row">
                {sizes.map((s) => (
                  <button 
                    key={s}
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price block */}
            <div className="editorial-summary-card">
              <div className="editorial-price-row">
                <div className="editorial-price-info">
                  <span className="item-summary-title">
                    {topStyles.find(t => t.value === selectedTop).name} +{' '}
                    {bottomStyles.find(b => b.value === selectedBottom).name}
                  </span>
                  <span className="discount-badge">Save ₦6,000 (Set Discount Applied)</span>
                </div>
                <div className="editorial-price-box">
                  <span className="original-price">₦{rawSum.toLocaleString()}</span>
                  <span className="final-price">₦{finalPrice.toLocaleString()}</span>
                </div>
              </div>
              <button 
                className="btn btn-editorial-buy" 
                onClick={handleAddCustomSet}
              >
                Add Custom Set to Bag
              </button>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default Store;
