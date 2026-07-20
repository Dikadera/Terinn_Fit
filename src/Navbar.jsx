import React, { useState, useEffect } from 'react';
import logoImg from './assets/logo.png';

function Navbar({ view, setView, cartCount, setIsCartOpen, mobileMenuOpen, setMobileMenuOpen, onOpenTrackModal }) {
  const [scrolled, setScrolled] = useState(false);

  // Scroll listener — marks navbar as scrolled past 60px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (targetView, hash = '') => {
    setView(targetView);
    setMobileMenuOpen(false);
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // On homepage: transparent at top, frosted glass when scrolled
  // On other pages: always solid
  const headerClass = [
    'header',
    view === 'home' && !scrolled ? 'header-transparent' : '',
    scrolled ? 'header-scrolled' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <header className={headerClass}>
        <div className="header-container">
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
            <img src={logoImg} alt="Terinn Fit Logo" />
            <span className="logo-text">TERINN FIT</span>
          </a>

          <nav className="nav-menu" id="navMenu">
            <a href="#" className={`nav-link ${view === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
              Home
            </a>
            <a href="#" className={`nav-link ${view === 'store' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('store'); }}>
              Store
            </a>
            <a href="#" className="nav-link"
              onClick={(e) => { e.preventDefault(); if (onOpenTrackModal) onOpenTrackModal(); }}>
              Track Item
            </a>
            <a href="#size-guide" className="nav-link"
              onClick={(e) => { e.preventDefault(); handleNavClick('home', '#size-guide'); }}>
              Sizing
            </a>
            <a href="#policies" className="nav-link"
              onClick={(e) => { e.preventDefault(); handleNavClick('home', '#policies'); }}>
              Info
            </a>
            <a href="#faq" className="nav-link"
              onClick={(e) => { e.preventDefault(); handleNavClick('home', '#faq'); }}>
              FAQ
            </a>
          </nav>

          <div className="header-actions">
            <button className="cart-toggle-btn" id="cartToggleBtn"
              onClick={() => setIsCartOpen(true)} aria-label="View Cart">
              <span className="cart-text">Bag</span>
              <span className="cart-badge" id="cartBadgeCount">{cartCount}</span>
            </button>
            <button
              className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
              id="mobileToggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'active' : ''}`} id="mobileDrawer">
        <div className="drawer-inner-header">
          <span className="drawer-collection-tag">NAVIGATION MENU</span>
        </div>

        <div className="drawer-content">
          <a href="#" className={`drawer-link ${view === 'home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
            <span className="drawer-num">01</span>
            <span className="drawer-text">Home</span>
            <span className="drawer-arrow">➔</span>
          </a>
          <a href="#" className={`drawer-link ${view === 'store' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setView('store'); setMobileMenuOpen(false); }}>
            <span className="drawer-num">02</span>
            <span className="drawer-text">Shop Collection</span>
            <span className="drawer-arrow">➔</span>
          </a>
          <a href="#" className="drawer-link"
            onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); if (onOpenTrackModal) onOpenTrackModal(); }}>
            <span className="drawer-num">03</span>
            <span className="drawer-text">Track Item</span>
            <span className="drawer-arrow">➔</span>
          </a>
          <a href="#size-guide" className="drawer-link"
            onClick={(e) => { e.preventDefault(); handleNavClick('home', '#size-guide'); }}>
            <span className="drawer-num">04</span>
            <span className="drawer-text">Size Calculator</span>
            <span className="drawer-arrow">➔</span>
          </a>
          <a href="#policies" className="drawer-link"
            onClick={(e) => { e.preventDefault(); handleNavClick('home', '#policies'); }}>
            <span className="drawer-num">05</span>
            <span className="drawer-text">Store Info</span>
            <span className="drawer-arrow">➔</span>
          </a>
          <a href="#faq" className="drawer-link"
            onClick={(e) => { e.preventDefault(); handleNavClick('home', '#faq'); }}>
            <span className="drawer-num">06</span>
            <span className="drawer-text">FAQ & Support</span>
            <span className="drawer-arrow">➔</span>
          </a>
        </div>

        <div className="drawer-footer-note">
          <span>TERINN FIT ACTIVEWEAR</span>
          <span>LAGOS • NIGERIA</span>
        </div>
      </div>
    </>
  );
}

export default Navbar;
