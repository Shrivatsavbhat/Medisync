import React, { useState } from 'react';
import { hospitalTheme } from '../theme/hospitalTheme';
import { useNotification } from './NotificationSystem';

function AddMedicalData({ selectedPatient }) {
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.notes || !formData.file) {
      showError('Please fill all required fields and select a file');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login first');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('patientId', selectedPatient);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('notes', formData.notes);
    formDataToSend.append('file', formData.file);

    try {
      const response = await fetch('http://localhost:5000/api/patient/addRecord', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (result.success) {
        showSuccess('Medical record added successfully!');
        setFormData({
          title: '',
          notes: '',
          file: null
        });
        document.querySelector('input[type="file"]').value = '';
      } else {
        showError('Error: ' + result.msg);
      }
    } catch (error) {
      showError('Error uploading record: ' + error.message);
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
    fontWeight: '600'
  };

  const formGroupStyle = {
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333'
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '150px',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    resize: 'vertical'
  };

  const inputStyle = {
    ...hospitalTheme.components.input,
    width: '100%',
    marginBottom: '1rem'
  };

  const fileUploadStyle = {
    padding: '1rem',
    border: `2px dashed ${hospitalTheme.colors.border}`,
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '1rem',
    cursor: 'pointer',
    backgroundColor: hospitalTheme.colors.background
  };

  const buttonStyle = {
    ...hospitalTheme.components.button,
    width: '100%',
    marginTop: '1rem'
  };

  return (
    <div style={containerStyle}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '30px'}}>
        <img src={hospitalTheme.logo.src} alt="MediSync" style={hospitalTheme.logo.style} />
        <h2 style={headingStyle}>➕ Add Medical Data</h2>
      </div>
      
      {selectedPatient && (
        <div style={{
          ...hospitalTheme.components.card,
          backgroundColor: '#e8f5e9',
          borderLeft: `4px solid ${hospitalTheme.colors.secondary}`,
          marginBottom: '20px'
        }}>
          <strong style={{color: hospitalTheme.colors.secondary}}>Adding data for:</strong> {selectedPatient}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Title</label>
          <input 
            type="text"
            name="title" 
            style={inputStyle}
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter record title"
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Notes</label>
          <textarea 
            name="notes"
            placeholder="Enter detailed medical notes here..."
            value={formData.notes}
            onChange={handleChange}
            style={textareaStyle}
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Medical File</label>
          <div style={fileUploadStyle}>
            <input 
              type="file" 
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              style={{ 
                width: '100%',
                padding: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
              required
            />
            {formData.file && (
              <div style={{ marginTop: '0.5rem', color: hospitalTheme.colors.primary, fontWeight: '500' }}>
                ✅ Selected: {formData.file.name}
              </div>
            )}
          </div>
        </div>

        <button type="submit" style={buttonStyle}>Upload Medical Data</button>
      </form>
    </div>
  );
}

export default AddMedicalData;
