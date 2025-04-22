import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDob, setUserDob] = useState("");
  const [discounts, setDiscounts] = useState({ discount_percent: 0, reason: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setIsLoggedIn(true);
      fetch(`/api/user/user/${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.dob) {
            setUserDob(data.dob);
          }
        })
        .catch((err) => console.error("Failed to fetch user DOB", err));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    fetch(`/api/admin/packages`)
      .then((res) => res.json())
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load packages');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (userDob) {
      fetch(`/api/discount/discount/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dob: userDob })
      })
        .then((res) => res.json())
        .then((data) => setDiscounts(data))
        .catch((err) => console.error("Failed to fetch discounts", err));
    }
  }, [userDob]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const handleCustomizeClick = (pkgId) => {
    if (!isLoggedIn) {
      alert("You need to log in to customize a package.");
      navigate('/login');
    } else {
      const selectedPackage = packages.find(pkg => pkg._id === pkgId);
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

  const handleViewCart = () => {
    navigate('/customized', { state: { cart } });
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading packages...</div>;
  if (error) return <div style={{ padding: '24px', color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#2563eb'
      }}>
        Available Holiday Packages
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {packages.map((pkg) => {
          const basePrice = pkg.computedPrice ?? pkg.price;
          const discount = discounts.discount_percent || 0;
          const discountedPrice = basePrice * (1 - discount / 100);
          return (
            <div key={pkg._id} style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}>

              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#3b82f6',
                marginBottom: '0.5rem'
              }}>
                {pkg.destination}
              </h3>
              <p><strong>Price:</strong> ${basePrice}</p>
              <p><strong>Duration:</strong> {pkg.duration}</p>
              <p><strong>Activities:</strong></p>
              <ul style={{ paddingLeft: '20px', marginTop: '4px', marginBottom: '8px' }}>
                {pkg.activities?.map((act, idx) => (
                  <li key={idx}>
                    {act.name}
                  </li>
                ))}
              </ul>
              <p style={{ color: '#059669' }}><strong>Discount:</strong> {discount}%</p>
              <p><strong>Discounted Price:</strong> ${discountedPrice.toFixed(2)}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <button
                  onClick={() => handleCustomizeClick(pkg._id)}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  Customize
                </button>

                <button
                  onClick={() => handleAddToCart({ ...pkg, discountedPrice })}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
                >
                  ➕ Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
      </div>
    </div>
  );
}

export default Packages;
