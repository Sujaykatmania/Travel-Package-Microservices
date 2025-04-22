import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function User() {
  const navigate = useNavigate();
  const [birthdayWish, setBirthdayWish] = useState('');

  // Fetch user data (including birthday wish) on page load
  useEffect(() => {
    const fetchUserData = async () => {
      const username = localStorage.getItem("username");  // Assuming username is stored in localStorage

      if (!username) {
        alert("You must be logged in to view your dashboard.");
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`/api/user/user?username=${username}`);
        const data = await response.json();

        if (response.ok) {
          setBirthdayWish(data.birthday_wish);  // Set birthday message if it's the user's birthday
        } else {
          console.error("Error fetching user data:", data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
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
        }}>
          Welcome, Traveler! 🧳
        </h2>
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
            }}>
              {birthdayWish}
            </h3>
          </div>
        )}
        <p style={{
          fontSize: '1.125rem',
          marginBottom: '1.5rem'
        }}>
          Customize your package, explore discounts, and more.
        </p>
        <button
          onClick={() => navigate('/packages')}
          style={{
            backgroundColor: 'white',
            color: '#2563eb',
            padding: '8px 24px',
            borderRadius: '9999px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          View Packages
        </button>
      </section>
    </div>
  );
}

export default User;