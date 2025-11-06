import React, { useState, useEffect } from 'react';
import { useNotification } from './NotificationSystem';

function DoctorConsultationRequests() {
  const { showSuccess, showError } = useNotification();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching consultation requests for doctor...');
      const response = await fetch('http://localhost:5000/api/access/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      console.log('Consultation requests response:', result);
      if (response.ok) {
        setRequests(result);
      } else {
        console.error('Failed to fetch requests:', result);
        showError('Failed to fetch consultation requests');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error fetching consultation requests');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
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
        showSuccess(`Request ${status} successfully!`);
        fetchRequests();
      } else {
        showError('Failed to respond to request');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error responding to request');
    }
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading...</div>;

  return (
    <div style={{maxWidth: '850px', margin: '2rem auto', padding: '2.5rem', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 8px 32px rgba(8, 145, 178, 0.12)', border: '1px solid rgba(8, 145, 178, 0.08)'}}>
      <h2 style={{fontSize: '1.8rem', fontWeight: '600', color: '#0891b2', marginBottom: '1.5rem', textAlign: 'center'}}>📋 Consultation Requests</h2>
      

      
      {requests.length === 0 ? (
        <p>No requests.</p>
      ) : (
        requests.map(request => (
          <div key={request._id} style={{border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '18px', backgroundColor: '#f8fafc', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', transition: 'all 0.2s ease'}}>
            <h4>{request.patientEmail}</h4>
            <p>{request.reason}</p>
            <p>{new Date(request.requestedAt).toLocaleDateString()}</p>
            <button 
              style={{padding: '10px 18px', margin: '0 6px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: '#10b981', color: 'white', fontWeight: '500', transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}
              onClick={() => handleResponse(request._id, 'approved')}
            >
              ✅ Accept
            </button>
            <button 
              style={{padding: '10px 18px', margin: '0 6px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: '#ef4444', color: 'white', fontWeight: '500', transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}
              onClick={() => handleResponse(request._id, 'denied')}
            >
              ❌ Decline
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default DoctorConsultationRequests;