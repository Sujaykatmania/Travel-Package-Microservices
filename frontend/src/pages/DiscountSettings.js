import React, { useEffect, useState } from 'react';

export default function DiscountSettings() {
  const [months, setMonths] = useState('');
  const [discount, setDiscount] = useState('');
  const [existingDiscount, setExistingDiscount] = useState(null);
  const [message, setMessage] = useState('');

  const API_URL = '/api/discount/admin/discount';

  // Fetch current discount from the backend
  const fetchDiscounts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.months) {
        setExistingDiscount(data);
        setMonths(data.months.join(','));
        setDiscount(data.discount);
      } else {
        setExistingDiscount(null);
      }
    } catch (err) {
      console.error("Error fetching discount:", err);
      setMessage("Failed to fetch discount settings.");
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Handle saving the discount
  const handleSave = async () => {
    const monthList = months
      .split(',')
      .map(m => parseInt(m.trim()))
      .filter(m => !isNaN(m));

    const validMonths = monthList.every(m => m >= 1 && m <= 12);
    const validDiscount = discount > 0 && discount <= 100;

    if (!validMonths) {
      setMessage("Invalid months! Use numbers between 1-12.");
      return;
    }

    if (!validDiscount) {
      setMessage("Discount should be between 1% and 100%");
      return;
    }

    const payload = {
      months: monthList,
      discount: parseInt(discount)
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      setMessage(result.message);
      fetchDiscounts();
      setMonths('');
      setDiscount('');
    } catch (err) {
      console.error("Error saving discount:", err);
      setMessage("Failed to save discount.");
    }
  };

  // Handle deleting the discount
  const handleDelete = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Discount deleted successfully");
        fetchDiscounts();
      } else {
        alert("Failed to delete discount");
      }
    } catch (err) {
      console.error("Error deleting discount:", err);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        Seasonal Discount Settings
      </h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '1.5rem',
        alignItems: 'flex-end'
      }}>
        <input
          type="text"
          placeholder="Discount Months (e.g. 4,6,12)"
          value={months}
          onChange={e => setMonths(e.target.value)}
          style={{
            border: '1px solid #d1d5db',
            padding: '8px',
            borderRadius: '4px',
            width: '33%'
          }}
        />
        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={e => setDiscount(e.target.value)}
          style={{
            border: '1px solid #d1d5db',
            padding: '8px',
            borderRadius: '4px',
            width: '25%'
          }}
        />
        <button
          onClick={handleSave}
          style={{
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
          Save Discount
        </button>
      </div>

      {message && <p style={{
        marginBottom: '1rem',
        color: '#2563eb',
        fontWeight: '600'
      }}>{message}</p>}

      <div style={{
        marginTop: '32px',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '0.5rem'
        }}>Current Discount:</h3>
        {existingDiscount ? (
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p><strong>Months:</strong> {existingDiscount.months.join(', ')}</p>
            <p><strong>Discount:</strong> {existingDiscount.discount}%</p>
            <button
              onClick={handleDelete}
              style={{
                marginTop: '16px',
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Delete Discount
            </button>
          </div>
        ) : (
          <p style={{ color: '#6b7280' }}>No seasonal discount set.</p>
        )}
      </div>
    </div>
  );
}