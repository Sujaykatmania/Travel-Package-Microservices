import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <section style={{
        textAlign: 'center',
        padding: '80px 20px',
        background: 'linear-gradient(to right, #bfdbfe, #93c5fd)',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Plan Your Dream Vacation ✈️
        </h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
          Custom packages, discounts, and eco-friendly travel—all in one place.
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
          Explore Now
        </button>
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        padding: '24px'
      }}>
        {[
          {
            title: 'Plan a Trip',
            link: '/packages',
            description: 'Browse and customize holiday packages to fit your dream destination, activities, and budget!'
          },
          {
            title: 'Check Discounts',
            link: '/packages',
            description: 'Get the best discounts on your favorite destinations—save more on every trip!'
          },
          {
            title: 'Recommendations',
            link: '/recommend',
            description: 'Not sure where to go? Tell us what you like, and we’ll recommend packages just for you!'
          }
        ].map(({ title, link, description }, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: '#4b5563' }}>{description}</p>
            <button
              onClick={() => navigate(link)}
              style={{
                marginTop: '1rem',
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Go
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;
