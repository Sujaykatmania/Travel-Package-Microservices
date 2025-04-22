import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    dob: "",
    email: "",  // Added email field
    userType: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registration successful!");
      navigate("/login");
    } else {
      alert(data.error || "Registration failed.");
    }
  };

  return (
    <div style={{
      maxWidth: '448px',
      margin: '40px auto',
      backgroundColor: 'white',
      padding: '32px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>Register</h2>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          style={{
            width: '100%',
            border: '1px solid #d1d5db',
            padding: '8px',
            borderRadius: '4px'
          }}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          style={{
            width: '100%',
            border: '1px solid #d1d5db',
            padding: '8px',
            borderRadius: '4px'
          }}
          onChange={handleChange}
          required
        />
        <input
          type="email"  // Email input type added
          name="email"
          placeholder="Email"
          style={{
            width: '100%',
            border: '1px solid #d1d5db',
            padding: '8px',
            borderRadius: '4px'
          }}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dob"
          style={{
            width: '100%',
            border: '1px solid #d1d5db',
            padding: '8px',
            borderRadius: '4px'
          }}
          onChange={handleChange}
          required
        />
        <select
          name="userType"
          style={{
            width: '100%',
            border: '1px solid #d1d5db',
            padding: '8px',
            borderRadius: '4px',
            backgroundColor: 'white'
          }}
          onChange={handleChange}
          value={formData.userType}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Register
        </button>
      </form>

      <p style={{
        marginTop: '1rem',
        textAlign: 'center'
      }}>
        Already have an account?{' '}
        <span
          style={{
            color: '#2563eb',
            cursor: 'pointer',
            ':hover': {
              textDecoration: 'underline'
            }
          }}
          onClick={() => navigate('/login')}
        >
          Login here
        </span>
      </p>
    </div>
  );
}
