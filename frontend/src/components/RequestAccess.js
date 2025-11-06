import React, { useState } from 'react';

function RequestAccess() {
  const [patientEmail, setPatientEmail] = useState('');
  const [reason, setReason] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/access/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ patientEmail, reason })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Access request sent to patient!');
        setPatientEmail('');
        setReason('');
      } else {
        alert('Error: ' + result.msg);
      }
    } catch (error) {
      alert('Error sending request: ' + error.message);
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%'
  };

  return (
    <div style={containerStyle}>
      <h2>🔐 Request Patient Data Access</h2>
      <form onSubmit={handleRequest}>
        <input
          type="email"
          placeholder="Patient Email"
          value={patientEmail}
          onChange={(e) => setPatientEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <textarea
          placeholder="Reason for access request"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{...inputStyle, height: '100px'}}
          required
        />
        <button type="submit" style={buttonStyle}>
          Send Access Request
        </button>
      </form>
    </div>
  );
}

export default RequestAccess;