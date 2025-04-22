import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Recommendations() {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [recommendedPackages, setRecommendedPackages] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const TAG_API = 'http://localhost:5004/tags';
  const RECOMMEND_API = 'http://localhost:5004/recommend';

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get(TAG_API);
        setTags(res.data);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    fetchTags();

    const username = localStorage.getItem("username");
    if (username) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const toggleTag = (tagName) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const fetchRecommendations = async () => {
    if (selectedTags.length === 0) {
      alert('Select at least one tag');
      return;
    }

    try {
      const res = await axios.post(RECOMMEND_API,
        { tags: selectedTags },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setRecommendedPackages(res.data);
      setHasFetched(true);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  const handleCustomizeClick = (pkgId) => {
    if (!isLoggedIn) {
      alert("You need to log in to customize a package.");
      navigate('/login');
    } else {
      const selectedPackage = recommendedPackages.find(pkg => pkg._id === pkgId);
      navigate(`/customize/${pkgId}`, { state: { packageData: selectedPackage } });
    }
  };

  const handleAddToCart = (pkg) => {
    if (!isLoggedIn) {
      alert("You need to log in to add to cart.");
      navigate('/login');
      return;
    }

    const cartFromStorage = JSON.parse(localStorage.getItem('cart')) || [];

    const alreadyInCart = cartFromStorage.some(item =>
      item._id === pkg._id &&
      JSON.stringify(item.activities) === JSON.stringify(pkg.activities) &&
      item.selectedDates === pkg.selectedDates
    );

    if (!alreadyInCart) {
      let finalPkg = { ...pkg };

      if (pkg.activities && pkg.allActivities) {
        const selectedActivityNames = pkg.activities.map(act => act.name);
        const removedActivities = pkg.allActivities.filter(
          act => !selectedActivityNames.includes(act.name)
        );

        const removedAmount = removedActivities.reduce((acc, act) => acc + (act.price || 0), 0);
        finalPkg.finalPrice = Math.max(pkg.price - removedAmount, 0);
      }

      const updatedCart = [...cartFromStorage, finalPkg];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      alert("Package added to cart!");
    } else {
      alert("Package already in cart");
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
      }}>
        Get Holiday Recommendations
      </h2>

      {/* Tag Selection */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{
          marginBottom: '8px',
          fontWeight: '600'
        }}>
          Select tags you're interested in:
        </p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {tags.map((tag, i) => (
            <label key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f3f4f6',
              padding: '4px 12px',
              borderRadius: '9999px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                value={tag.name}
                checked={selectedTags.includes(tag.name)}
                onChange={() => toggleTag(tag.name)}
              />
              <span style={{ textTransform: 'capitalize' }}>{tag.name}</span>
            </label>
          ))}
        </div>

        <button
          onClick={fetchRecommendations}
          style={{
            marginTop: '16px',
            backgroundColor: '#059669',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
        >
          Show Recommendations
        </button>
      </div>

      {/* Recommendations */}
      <div>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          Recommended Packages:
        </h3>
        {recommendedPackages.length > 0 ? (
          <ul style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {recommendedPackages.map(pkg => (
              <li
                key={pkg._id}
                style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  backgroundColor: 'white'
                }}
              >
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold'
                }}>
                  {pkg.destination}
                </h4>
                <p>Price: ₹{pkg.price}</p>
                <p>Duration: {pkg.duration}</p>
                <p><strong>Activities:</strong></p>
                <ul style={{ paddingLeft: '20px', marginTop: '4px', marginBottom: '8px' }}>
                  {pkg.activities?.map((act, idx) => (
                    <li key={idx}>
                      {act.name}
                    </li>
                  ))}
                </ul>
                <p>Tags: {pkg.tags.join(', ')}</p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <button
                    onClick={() => handleCustomizeClick(pkg._id)}
                    style={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                  >
                    Customize
                  </button>

                  <button
                    onClick={() => handleAddToCart(pkg)}
                    style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
                  >
                    ➕ Add to Cart
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          hasFetched && (
            <p style={{
              color: '#6b7280',
              fontStyle: 'italic'
            }}>
              No packages matched your selected tags.
            </p>
          )
        )}
      </div>
    </div>
  );
}
