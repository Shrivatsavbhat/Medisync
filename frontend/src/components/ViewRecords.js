import React, { useState, useEffect } from 'react';
import { hospitalTheme } from '../theme/hospitalTheme';

function ViewRecords({ selectedPatient }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedPatient) {
      fetchRecords();
    }
  }, [selectedPatient]);

  const downloadFile = async (fileId, filename) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/record/download/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download file');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading file');
    }
  };

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      if (!selectedPatient) {
        setError('No patient selected');
        setLoading(false);
        return;
      }

      // Fetch records for the selected patient
      const recordResponse = await fetch(`http://localhost:5000/api/record/records/${selectedPatient}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (recordResponse.ok) {
        const allRecords = await recordResponse.json();
        setRecords(allRecords);
      } else {
        console.error('Failed to fetch records:', recordResponse.status);
        setError('Failed to fetch records');
      }
    } catch (err) {
      setError('Error fetching records: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    ...hospitalTheme.layout.container,
    fontFamily: hospitalTheme.layout.pageContainer.fontFamily
  };

  const headingStyle = {
    fontSize: '2rem',
    color: hospitalTheme.colors.primary,
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontWeight: '600',
    display: 'block'
  };

  const listStyle = {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  };

  const getCardColor = (type) => {
    switch(type) {
      case 'prescription': return '#e3f2fd'; 
      case 'report': return '#e8f5e9';
      case 'analysis': return '#fff8e1';
      default: return '#f5f5f5';
    }
  };

  const cardStyle = (type) => ({
    ...hospitalTheme.components.card,
    backgroundColor: getCardColor(type),
    borderLeft: `4px solid ${type === 'prescription' ? hospitalTheme.colors.primary : 
                 type === 'report' ? hospitalTheme.colors.secondary : '#ffc107'}`
  });

  const cardHeaderStyle = {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    color: '#333',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const iconStyle = {
    fontSize: '1.5rem'
  };

  const detailStyle = {
    color: '#555',
    lineHeight: '1.6'
  };

  const getIcon = (type) => {
    switch(type) {
      case 'prescription': return '💊';
      case 'report': return '📊';
      case 'analysis': return '📈';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2 style={headingStyle}>Loading Records...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h2 style={headingStyle}>Error</h2>
        <p style={{color: 'red', textAlign: 'center'}}>{error}</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '30px'}}>
        <img src={hospitalTheme.logo.src} alt="MediSync" style={hospitalTheme.logo.style} />
        <h2 style={headingStyle}>Patient Medical Records</h2>
      </div>
      <ul style={listStyle}>
        {records.map((rec, i) => (
          <li key={i} style={{
            ...hospitalTheme.components.card,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <div>
              <div style={{fontSize: '1.2rem', fontWeight: '600', marginBottom: '5px'}}>
                📄 {rec.title || 'Untitled Document'}
              </div>
              <p style={{color: hospitalTheme.colors.textLight, fontSize: '14px', margin: 0}}>
                {new Date(rec.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <button 
              onClick={() => downloadFile(rec._id, rec.filename)}
              style={{
                ...hospitalTheme.components.button,
                padding: '8px 16px'
              }}
            >
              📥 Download
            </button>
          </li>
        ))}
        {records.length === 0 && (
          <p style={{textAlign: 'center', color: '#666'}}>No medical records found for approved patients.</p>
        )}
      </ul>
    </div>
  );
}

export default ViewRecords;
