import React, { useState, useEffect } from 'react';

function ManageAccess() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/access/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        setRequests(result);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login first');
        return;
      }

      const response = await fetch('http://localhost:5000/api/access/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, status })
      });

      const result = await response.json();
      if (result.success) {
        alert(`Request ${status}!`);
        fetchRequests();
      } else {
        alert('Error: ' + result.msg);
      }
    } catch (error) {
      alert('Error responding to request: ' + error.message);
    }
  };

  const containerStyle = {
    padding: '30px',
    backgroundColor: '#f4f7fa',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: 'auto',
  };

  const headingStyle = {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const requestCardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    margin: '0 5px'
  };

  if (loading) {
    return <div style={containerStyle}>Loading requests...</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>📋 Doctor Access Requests</h2>
      
      {requests.length === 0 ? (
        <p style={{textAlign: 'center', color: '#666'}}>No pending access requests.</p>
      ) : (
        requests.map(request => (
          <div key={request._id} style={requestCardStyle}>
            <h4>👨‍⚕️ Dr. {request.doctorEmail}</h4>
            <p><strong>Reason:</strong> {request.reason}</p>
            <p style={{color: '#888', fontSize: '0.9rem'}}>Requested: {new Date(request.requestedAt).toLocaleDateString()}</p>
            
            <div style={{marginTop: '15px'}}>
              <button 
                style={{...buttonStyle, backgroundColor: '#27ae60', color: 'white'}}
                onClick={() => handleResponse(request._id, 'approved')}
              >
                ✅ Approve
              </button>
              <button 
                style={{...buttonStyle, backgroundColor: '#e74c3c', color: 'white'}}
                onClick={() => handleResponse(request._id, 'denied')}
              >
                ❌ Deny
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ManageAccess;