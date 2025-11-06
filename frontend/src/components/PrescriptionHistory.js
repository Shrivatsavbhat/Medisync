import React, { useState, useEffect } from 'react';
import { hospitalTheme } from '../theme/hospitalTheme';

function PrescriptionHistory({ selectedPatient }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, [selectedPatient]);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctor/prescriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const filtered = selectedPatient ? 
          data.filter(p => p.patientEmail === selectedPatient) : data;
        setPrescriptions(filtered);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#ffc107';
    }
  };

  if (loading) return <div>Loading prescriptions...</div>;

  return (
    <div style={{padding: '20px'}}>
      <h2 style={{color: hospitalTheme.colors.primary, marginBottom: '20px'}}>
        📜 Prescription History {selectedPatient && `- ${selectedPatient}`}
      </h2>
      
      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        prescriptions.map((prescription) => (
          <div key={prescription._id} style={{
            ...hospitalTheme.components.card,
            marginBottom: '15px',
            borderLeft: `4px solid ${getStatusColor(prescription.status)}`
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <div style={{flex: 1}}>
                <h4 style={{margin: '0 0 10px 0', color: hospitalTheme.colors.text}}>
                  💊 {prescription.name}
                </h4>
                <p style={{margin: '5px 0', color: hospitalTheme.colors.textLight}}>
                  <strong>Patient:</strong> {prescription.patientEmail}
                </p>
                <p style={{margin: '5px 0', color: hospitalTheme.colors.textLight}}>
                  <strong>Dosage:</strong> {prescription.dosage}
                </p>
                <p style={{margin: '5px 0', color: hospitalTheme.colors.textLight}}>
                  <strong>Frequency:</strong> {prescription.frequency}
                </p>
                <p style={{margin: '5px 0', color: hospitalTheme.colors.textLight}}>
                  <strong>Notes:</strong> {prescription.notes}
                </p>
                <p style={{margin: '5px 0', color: hospitalTheme.colors.textLight, fontSize: '12px'}}>
                  <strong>Prescribed:</strong> {new Date(prescription.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: getStatusColor(prescription.status),
                color: 'white'
              }}>
                {prescription.status.toUpperCase()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PrescriptionHistory;
