import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './navbar.css';

const Nav = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const profileInitial = user
    ? (user.username?.[0] || user.email?.[0] || 'U').toUpperCase()
    : '';

  return (
    <nav className='navbar'>
      {/* Logo */}
      <h2 className='logo'>
        <NavLink to='/home'>
          <p>AI</p> Powered Resume Analyzer
        </NavLink>
      </h2>

      {/* Desktop links */}
      <ul>
        <li><NavLink to='/home'>Home</NavLink></li>
        <li><NavLink to='/About'>About</NavLink></li>
        {user ? (
          <li className='profile-container'>
            <div className='profile-btn' onClick={() => setDropdownOpen(!dropdownOpen)}>
              {profileInitial}
            </div>
            {dropdownOpen && (
              <div className='profile-dropdown'>
                <p><strong>{user.username}</strong></p>
                <p>{user.email}</p>
                <button onClick={handleLogout}>Sign Out</button>
              </div>
            )}
          </li>
        ) : (
          <li><NavLink to='/Login'>Login</NavLink></li>
        )}
      </ul>

      {/* Hamburger button */}
      <button
        className='nav-hamburger'
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className='nav-mobile-menu'>
          <NavLink to='/home' onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to='/About' onClick={() => setMenuOpen(false)}>About</NavLink>
          {user ? (
            <>
              <span className='nav-mobile-user'>{user.username} · {user.email}</span>
              <button className='nav-mobile-signout' onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <NavLink className='nav-mobile-login' to='/Login' onClick={() => setMenuOpen(false)}>Login</NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
