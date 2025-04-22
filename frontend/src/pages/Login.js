import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Save username to localStorage
      localStorage.setItem("username", username);

      // 🔥 Fix: store username and role at root level, not nested in role
      login({ username, role: data.userType });

      if (data.userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh'
    }}>
      <form onSubmit={handleLogin} style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '384px'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>Login</h2>

        <input
          type="text"
          placeholder="Username"
          style={{
            width: '100%',
            border: '1px solid #d1d5db',
            padding: '8px',
            marginBottom: '1rem',
            borderRadius: '4px'
          }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={{
            width: '100%',
            border: '1px solid #d1d5db',
            padding: '8px',
            marginBottom: '1rem',
            borderRadius: '4px'
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Login
        </button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account?{' '}
          <span
            style={{
              color: '#2563eb',
              cursor: 'pointer',
              ':hover': {
                textDecoration: 'underline'
              }
            }}
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;