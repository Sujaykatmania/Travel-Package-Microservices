import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const [birthdayWish, setBirthdayWish] = useState('');
  const [error, setError] = useState('');

  // Fetch admin data (including birthday wish) on page load
  useEffect(() => {
    const fetchAdminData = async () => {
      const username = localStorage.getItem("username");

      if (!username) {
        alert("You must be logged in to view your dashboard.");
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`/api/admin?username=${username}`);
        const data = await response.json();

        if (response.ok) {
          setBirthdayWish(data.birthday_wish);
        } else {
          setError(data.error || "Unknown error fetching data.");
          console.error("Error fetching admin data:", data);
        }
      } catch (err) {
        setError("Error fetching data from server.");
        console.error("Error fetching admin data:", err);
      }
    };

    fetchAdminData();
  }, [navigate]);

  return (
    <div>
      <section style={{
        textAlign: 'center',
        padding: '80px 20px',
        background: 'linear-gradient(to right, #bfdbfe, #93c5fd)',
        color: 'white'
      }}>
      <h2 style={{
        fontSize: '2.25rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>👩‍💼 Welcome, Admin!</h2>

      {birthdayWish && (
        <div style={{
          backgroundColor: '#fef3c7',
          color: '#92400e',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>{birthdayWish}</h3>
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>{error}</h3>
        </div>
      )}

      <p style={{
        fontSize: '1.125rem',
        marginBottom: '2rem'
      }}>Choose a service to manage:</p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px'
        }}>
        <button
          onClick={() => navigate('/admin/edit-packages')}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
         >
          ✏️ Edit Packages
        </button>

        <button
          onClick={() => navigate('/admin/discount')}
          style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
        >
          💸 Edit Discounts
          </button>
      </div>
      </section>
    </div>
  );
}