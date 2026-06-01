import { useState } from 'react';
import './navbar2.css';
import { NavLink, useNavigate } from 'react-router-dom';

const Nav2 = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className='navbar2'>
      {/* Logo */}
      <div className="logo2">
        <NavLink to='/'>
          <span className="ai-block">AI</span>
          <span className="brand-text"> Powered Resume Analyzer</span>
        </NavLink>
      </div>

      {/* Desktop links */}
      <ul className="nav-links2">
        <li>
          <button className="link-btn" onClick={() => navigate('/Login')}>Login</button>
        </li>
        <li>
          <button className="link-btn signup-btn" onClick={() => navigate('/Signup')}>Sign up</button>
        </li>
      </ul>

      {/* Hamburger */}
      <button
        className='nav2-hamburger'
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className='nav2-mobile-menu'>
          <button onClick={() => { navigate('/Login'); setMenuOpen(false); }}>Login</button>
          <button className='signup-btn-mobile' onClick={() => { navigate('/Signup'); setMenuOpen(false); }}>Sign up</button>
        </div>
      )}
    </nav>
  );
};

export default Nav2;
