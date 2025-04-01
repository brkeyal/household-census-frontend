import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Household Census
        </Link>
        
        <div className="nav-links" style={{ display: 'flex', gap: '1rem' }}>
          <Link 
            to="/" 
            className="nav-link" 
            style={{ 
              color: 'white', 
              textDecoration: 'none !important',
              opacity: location.pathname === '/' ? 1 : 0.8,
              fontWeight: location.pathname === '/' ? '600' : '400',
              padding: '0.5rem 0.75rem',
              borderRadius: '4px',
              backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              transition: 'all 0.2s'
            }}>
            Dashboard
          </Link>
          <Link 
            to="/statistics" 
            className="nav-link" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              opacity: location.pathname === '/statistics' ? 1 : 0.8,
              fontWeight: location.pathname === '/statistics' ? '600' : '400',
              padding: '0.5rem 0.75rem',
              borderRadius: '4px',
              backgroundColor: location.pathname === '/statistics' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              transition: 'all 0.2s'
            }}>
            Statistics
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="mobile-menu-toggle" style={{ display: 'none', cursor: 'pointer' }} onClick={toggleMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
        
        {/* Mobile menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} style={{ 
          position: 'fixed', 
          top: '60px', 
          left: 0, 
          right: 0, 
          backgroundColor: 'var(--primary-color)', 
          padding: '1rem',
          display: 'none',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <Link to="/" className="nav-link mobile" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}>
            Dashboard
          </Link>
          <Link to="/statistics" className="nav-link mobile" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}>
            Statistics
          </Link>
        </div>
        
        {/* Mobile styles */}
        <style jsx>{`
          @media (max-width: 768px) {
            .nav-links {
              display: none !important;
            }
            .mobile-menu-toggle {
              display: block !important;
            }
            .mobile-menu.open {
              display: flex !important;
            }
          }
        `}</style>
      </div>
    </nav>
  );
};

export default Navbar;