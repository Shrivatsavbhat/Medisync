import React, { useState, useEffect } from 'react';
import { hospitalTheme } from '../theme/hospitalTheme';
import { useNotification } from './NotificationSystem';

function MedicationScheduler() {
  const { showSuccess, showError, showWarning } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    doctor: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [medications, setMedications] = useState([]);
  const [pendingPrescriptions, setPendingPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('view');

  useEffect(() => {
    fetchMedications();
    fetchPendingPrescriptions();
  }, []);

  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem('token');
      const patientEmail = localStorage.getItem('userEmail');
      
      const response = await fetch('http://localhost:5000/api/patient/getTrackers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setMedications(result);
      }
    } catch (err) {
      console.error('Error fetching medications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/patient/getPendingPrescriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setPendingPrescriptions(result);
      }
    } catch (err) {
      console.error('Error fetching pending prescriptions:', err);
    }
  };

  const handlePrescriptionAction = async (prescriptionId, status) => {
    // Immediate UI update
    setPendingPrescriptions(prev => prev.filter(p => p._id !== prescriptionId));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/patient/updatePrescriptionStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prescriptionId, status })
      });
      
      if (response.ok) {
        const result = await response.json();
        showSuccess(`Prescription ${status} successfully!`);
        if (status === 'approved') {
          fetchMedications();
        }
      } else {
        const errorData = await response.json();
        // Revert UI change on error
        fetchPendingPrescriptions();
        showError(errorData.msg || 'Error updating prescription');
      }
    } catch (error) {
      // Revert UI change on error
      fetchPendingPrescriptions();
      showError('Error updating prescription: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      showWarning('End date must be after start date');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login first');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/patient/addTracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        showSuccess('Medication schedule created successfully!');
        setFormData({
          name: '',
          dosage: '',
          doctor: '',
          startDate: '',
          endDate: '',
          notes: ''
        });
        fetchMedications();
        setActiveView('view');
      } else {
        showError('Error: ' + (result.msg || 'Unknown error'));
      }
    } catch (error) {
      showError('Error creating schedule: ' + error.message);
    }
  };

  const containerStyle = {
    ...hospitalTheme.layout.container,
    fontFamily: hospitalTheme.layout.pageContainer.fontFamily
  };

  const tabStyle = {
    ...hospitalTheme.components.button,
    margin: '0 10px 20px 0',
    padding: '10px 20px'
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: hospitalTheme.colors.secondary
  };

  const inputStyle = {
    ...hospitalTheme.components.input,
    width: '100%',
    marginBottom: '15px'
  };

  return (
    <div style={containerStyle}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '30px'}}>
        <img src={hospitalTheme.logo.src} alt="MediSync" style={hospitalTheme.logo.style} />
        <h2 style={{fontSize: '2rem', color: hospitalTheme.colors.primary, fontWeight: '600', margin: 0}}>💊 Medication Management</h2>
      </div>

      <div style={{marginBottom: '20px'}}>
        <button 
          style={activeView === 'view' ? activeTabStyle : tabStyle}
          onClick={() => setActiveView('view')}
        >
          📄 View Medications
        </button>
        <button 
          style={activeView === 'add' ? activeTabStyle : tabStyle}
          onClick={() => setActiveView('add')}
        >
          ➕ Add Medication
        </button>
        <button 
          style={activeView === 'pending' ? activeTabStyle : tabStyle}
          onClick={() => setActiveView('pending')}
        >
          ⏳ Pending Prescriptions ({pendingPrescriptions.length})
        </button>
      </div>

      {activeView === 'view' && (
        <div>
          {loading ? (
            <p>Loading medications...</p>
          ) : medications.length === 0 ? (
            <p style={{textAlign: 'center', color: hospitalTheme.colors.textLight}}>No medications scheduled.</p>
          ) : (
            medications.map((med, i) => (
              <div key={i} style={{
                ...hospitalTheme.components.card,
                borderLeft: `4px solid ${hospitalTheme.colors.secondary}`,
                marginBottom: '15px'
              }}>
                <div style={{fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px'}}>
                  💊 {med.name}
                </div>
                <p><strong>Frequency:</strong> {med.frequency}</p>
                <p><strong>Doctor:</strong> {med.doctor}</p>
                <p><strong>Start Date:</strong> {med.startDate ? new Date(med.startDate).toLocaleDateString() : 'Not set'}</p>
                {med.endDate && <p><strong>End Date:</strong> {new Date(med.endDate).toLocaleDateString()}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {activeView === 'add' && (
        <div style={{
          ...hospitalTheme.components.card,
          padding: '30px'
        }}>
          <h3 style={{ marginBottom: '20px', color: hospitalTheme.colors.text }}>📝 Schedule New Medication</h3>
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
        
        <input
          type="text"
          name="doctor"
          placeholder="Prescribed by Doctor"
          value={formData.doctor}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <label style={{display: 'block', marginBottom: '5px', fontWeight: '500', color: hospitalTheme.colors.text}}>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          style={inputStyle}
          min={new Date().toISOString().split('T')[0]}
          required
        />
        
        <label style={{display: 'block', marginBottom: '5px', fontWeight: '500', color: hospitalTheme.colors.text}}>End Date (Optional):</label>
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
          placeholder="Additional notes"
          value={formData.notes}
          onChange={handleChange}
          style={{...inputStyle, height: '80px'}}
          required
        />
        
            <button type="submit" style={{
              ...hospitalTheme.components.button,
              width: '100%',
              marginTop: '20px'
            }}>
              📅 Create Schedule
            </button>
          </form>
          
          <div style={{
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: hospitalTheme.colors.background, 
            borderRadius: '8px',
            border: `1px solid ${hospitalTheme.colors.border}`
          }}>
            <h4 style={{color: hospitalTheme.colors.text}}>📋 Frequency Guide:</h4>
            <p><strong>1-0-1:</strong> Morning (8 AM) & Night (8 PM)</p>
            <p><strong>1-1-1:</strong> Morning (8 AM), Afternoon (2 PM), Night (8 PM)</p>
            <p><strong>1-0-0:</strong> Morning (8 AM) only</p>
          </div>
        </div>
      )}

      {activeView === 'pending' && (
        <div>
          {pendingPrescriptions.length === 0 ? (
            <p style={{textAlign: 'center', color: hospitalTheme.colors.textLight}}>No pending prescriptions.</p>
          ) : (
            pendingPrescriptions.map((prescription) => (
              <div key={prescription._id} style={{
                ...hospitalTheme.components.card,
                borderLeft: `4px solid #ffc107`,
                marginBottom: '15px'
              }}>
                <div style={{fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px'}}>
                  💊 {prescription.name}
                </div>
                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                <p><strong>Frequency:</strong> {prescription.frequency}</p>
                <p><strong>Prescribed by:</strong> {prescription.doctorEmail}</p>
                <p><strong>Start Date:</strong> {new Date(prescription.startDate).toLocaleDateString()}</p>
                {prescription.endDate && <p><strong>End Date:</strong> {new Date(prescription.endDate).toLocaleDateString()}</p>}
                <p><strong>Notes:</strong> {prescription.notes}</p>
                <div style={{marginTop: '15px'}}>
                  <button 
                    style={{
                      ...hospitalTheme.components.button,
                      backgroundColor: '#28a745',
                      marginRight: '10px'
                    }}
                    onClick={() => handlePrescriptionAction(prescription._id, 'approved')}
                  >
                    ✅ Accept
                  </button>
                  <button 
                    style={{
                      ...hospitalTheme.components.button,
                      backgroundColor: '#dc3545'
                    }}
                    onClick={() => handlePrescriptionAction(prescription._id, 'rejected')}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MedicationScheduler;