import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CustomizePackage() {
  const [customizedPackage, setCustomizedPackage] = useState(null);
  const [selectedDates, setSelectedDates] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const packageData = location.state?.packageData;

  useEffect(() => {
    if (!packageData) {
      setError("No package data available.");
      setLoading(false);
    } else {
      setCustomizedPackage(packageData);
      setSelectedActivities(packageData.activities); // this should be array of activity objects
      setLoading(false);
    }
  }, [packageData]);

  const handleDateChange = (e) => {
    setSelectedDates(e.target.value);
  };

  const handleActivityChange = (activityObj) => {
  setSelectedActivities((prev) =>
    prev.some((a) => a.name === activityObj.name)
      ? prev.filter((a) => a.name !== activityObj.name)
      : [...prev, activityObj]
  );
};

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Customized Package:', {
      ...customizedPackage,
      selectedDates,
      selectedActivities,
    });
    alert("Package customized successfully!");
  };

  const handleAddToCart = () => {
  if (!selectedDates) {
    alert("Please select a date before adding to cart.");
    return;
  }

  // Calculate the final price based on customization
  const finalPrice = calculateTotalPrice(); // Get the dynamically calculated price

  const customized = {
    ...customizedPackage,
    selectedDates,
    activities: selectedActivities,
    finalPrice: calculateTotalPrice(),  // Add the dynamically calculated price
  };

  const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

  const alreadyInCart = existingCart.some(
    (pkg) =>
      pkg._id === customized._id &&
      pkg.selectedDates === customized.selectedDates &&
      JSON.stringify(pkg.activities) === JSON.stringify(customized.activities)
  );

  if (alreadyInCart) {
    alert("This customized package is already in your cart.");
    return;
  }

  const updatedCart = [...existingCart, customized];
  localStorage.setItem('cart', JSON.stringify(updatedCart));

  alert("Customized package added to cart!");
};

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading package details...</div>;
  }

  if (error) {
    return <div style={{ padding: '24px', color: '#ef4444' }}>{error}</div>;
  }

  const calculateTotalPrice = () => {
  if (!customizedPackage) return 0;

  const basePrice = customizedPackage.price || 0;

  const originalCustomizables = customizedPackage.activities.filter(act => act.customizable);

  const removed = originalCustomizables.filter(
    act => !selectedActivities.some(sel => sel.name === act.name)
  );

  const deduction = removed.reduce((sum, act) => sum + (act.price || 0), 0);

  return basePrice - deduction;
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#2563eb'
      }}>
        Customize Package
      </h2>

      {customizedPackage && (
        <div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#3b82f6',
            marginBottom: '0.5rem'
          }}>
            {customizedPackage.destination}
          </h3>
          <p><strong>Original Price:</strong> ${customizedPackage.price}</p>
          <p><strong>Duration:</strong> {customizedPackage.duration}</p>

          {/* Select Dates */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Choose your date:
            </label>
            <input
              type="date"
              value={selectedDates}
              onChange={handleDateChange}
              style={{
                width: '100%',
                border: '1px solid #d1d5db',
                padding: '8px',
                borderRadius: '4px'
              }}
            />
          </div>

          {/* Select Activities */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Choose Activities:
              </label>
              {customizedPackage.activities?.map((activity, idx) => {
                const isSelected = selectedActivities.some((a) => a.name === activity.name);
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <input
                      type="checkbox"
                      value={activity.name}
                      checked={isSelected}
                      onChange={() => handleActivityChange(activity)}
                      disabled={!activity.customizable}
                      style={{ marginRight: '8px' }}
                    />
                    <span>
                      {activity.name} (${activity.price})
                      {!activity.customizable && (
                        <span style={{ color: '#9ca3af', marginLeft: '8px', fontStyle: 'italic' }}>
                          (non-customizable)
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
            <p style={{
              marginTop: '12px',
              fontWeight: '600',
              color: '#10b981'
            }}>
              Total Price: ${calculateTotalPrice()}
            </p>

          <button
            onClick={handleSubmit}
            style={{
              marginTop: '16px',
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
            Confirm Customization
          </button>

          <button
            onClick={handleAddToCart}
            style={{
              marginTop: '12px',
              marginLeft: '12px',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            ➕ Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomizePackage;
