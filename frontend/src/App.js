import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from "./pages/Register";
import Admin from './pages/Admin';
import User from './pages/User';
import Packages from './pages/Packages';
import EditPackages from './pages/EditPackages';
import CustomizePackage from './pages/CustomizePackage';
import DiscountSettings from './pages/DiscountSettings';
import Recommendations from './pages/Recommendations';
import CustomizedParts from './pages/CustomizedParts';

function LoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    alert("Please log in to view your cart.");
    navigate("/login");
  }, [navigate]);

  return null;
}

function App() {
  const { user, logout } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cartItems.length);

    const handleStorage = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(updatedCart.length);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      color: '#1f2937',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Navbar */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#2563eb'
        }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#2563eb' }}>MMT Clone</Link>
        </h1>

        <nav style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          fontSize: '0.95rem',
          fontWeight: '500'
        }}>
          <Link to="/" style={{ color: '#4b5563', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/packages" style={{ color: '#4b5563', textDecoration: 'none' }}>
            Packages
          </Link>
          <Link to="/customized" style={{
            backgroundColor: 'none',
            color: '#4b5563',
            padding: '6px 12px',
            borderRadius: '6px',
            textDecoration: 'none'
          }}>
            Cart
          </Link>

          {user && (
            <Link
              to={user.role === 'admin' ? "/admin" : "/user"}
              style={{
                color: '#4b5563',
                textDecoration: 'none'
              }}
            >
              Dashboard
            </Link>
          )}

          {!user ? (
            <Link to="/login" style={{ color: '#4b5563', textDecoration: 'none' }}>
              Login
            </Link>
          ) : (
            <>
              <span style={{ color: '#4b5563' }}>
                Hi, {user.username || user.role}
              </span>
              <button
                onClick={logout}
                style={{
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '8px',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Routes */}
      <div style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<User />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/admin/edit-packages" element={<EditPackages />} />
          <Route path="/customize/:pkgId" element={<CustomizePackage />} />
          <Route path="/admin/discount" element={<DiscountSettings />} />
          <Route path="/recommend" element={<Recommendations />} />
          <Route path="/customized" element={user ? <CustomizedParts /> : <LoginRedirect />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '16px',
        fontSize: '0.875rem',
        color: '#6b7280',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb'
      }}>
        © 2025 MakeMyTrip Clone – Built with ❤️
      </footer>
    </div>
  );
}

export default App;
