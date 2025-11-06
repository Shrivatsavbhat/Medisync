import React, { useState } from 'react';

function MedicationManagement({ selectedPatient }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '1-0-1',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const doctorEmail = localStorage.getItem('userEmail');
      
      const response = await fetch('http://localhost:5000/api/doctor/prescribeMedication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          patientEmail: selectedPatient,
          doctorEmail
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Medication prescribed successfully! Patient will need to approve it.');
        setFormData({
          name: '',
          dosage: '',
          frequency: '1-0-1',
          startDate: '',
          endDate: '',
          notes: ''
        });
      } else {
        alert('Error: ' + (result.msg || 'Unknown error'));
      }
    } catch (error) {
      alert('Error prescribing medication: ' + error.message);
    }
  };

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%'
  };

  if (!selectedPatient) {
    return (
      <div style={containerStyle}>
        <h2>💊 Medication Management</h2>
        <p>Please select a patient first to prescribe medication.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2>💊 Prescribe Medication</h2>
      <p><strong>Patient:</strong> {selectedPatient}</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Medication Name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <input
          type="text"
          name="dosage"
          placeholder="Dosage (e.g., 500mg)"
          value={formData.dosage}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <select
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="1-0-0">Morning Only (1-0-0)</option>
          <option value="0-1-0">Afternoon Only (0-1-0)</option>
          <option value="0-0-1">Night Only (0-0-1)</option>
          <option value="1-0-1">Morning & Night (1-0-1)</option>
          <option value="1-1-0">Morning & Afternoon (1-1-0)</option>
          <option value="0-1-1">Afternoon & Night (0-1-1)</option>
          <option value="1-1-1">Three Times Daily (1-1-1)</option>
        </select>
        
        <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          style={inputStyle}
          min={new Date().toISOString().split('T')[0]}
          required
        />
        
        <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>End Date (Optional):</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          style={inputStyle}
          min={formData.startDate || new Date().toISOString().split('T')[0]}
        />
        
        <textarea
          name="notes"
          placeholder="Prescription notes and instructions"
          value={formData.notes}
          onChange={handleChange}
          style={{...inputStyle, height: '80px'}}
          required
        />
        
        <button type="submit" style={buttonStyle}>
          💊 Prescribe Medication
        </button>
      </form>
    </div>
  );
}

export default MedicationManagement;
