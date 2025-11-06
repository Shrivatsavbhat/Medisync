import React, { useState, useEffect } from 'react';
import { hospitalTheme } from '../theme/hospitalTheme';
import { useNotification } from './NotificationSystem';

function ConsultDoctor() {
  const { showSuccess, showError, showWarning } = useNotification();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [consultationMessage, setConsultationMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingProfile, setViewingProfile] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doctor => 
      doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const users = await response.json();
        console.log('All users:', users);
        const allDoctors = users.filter(user => user.role === 'doctor');
        console.log('All doctors:', allDoctors);
        const approvedDoctors = allDoctors.filter(doctor => doctor.approvalStatus === 'approved');
        console.log('Approved doctors:', approvedDoctors);
        // Temporarily show all doctors for testing
        setDoctors(allDoctors);
        setFilteredDoctors(allDoctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConsultation = async (doctor) => {
    if (!consultationMessage.trim()) {
      showWarning('Please enter your consultation message');
      return;
    }

    try {
      const patientEmail = localStorage.getItem('userEmail');
      const requestBody = {
        patientEmail: doctor.email,
        reason: `Consultation Request: ${consultationMessage}`
      };
      console.log('Sending consultation request:', requestBody);
      
      const response = await fetch('http://localhost:5000/api/access/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        showSuccess(`Consultation request sent to Dr. ${doctor.firstName}!`);
        setSelectedDoctor(null);
        setConsultationMessage('');
      } else {
        const errorData = await response.json();
        showError(errorData.msg || 'Failed to send consultation request');
      }
    } catch (error) {
      console.error('Error sending consultation request:', error);
      showError('Error sending consultation request');
    }
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto'
  };

  const cardStyle = {
    ...hospitalTheme.components.card,
    marginBottom: '20px',
    padding: '20px'
  };

  const doctorCardStyle = {
    ...cardStyle,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)'
    }
  };

  const buttonStyle = {
    ...hospitalTheme.components.button,
    padding: '8px 16px',
    fontSize: '14px'
  };

  const searchStyle = {
    width: '100%',
    padding: '12px',
    border: `1px solid ${hospitalTheme.colors.border}`,
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '20px',
    boxSizing: 'border-box'
  };

  const profileButtonStyle = {
    ...buttonStyle,
    backgroundColor: hospitalTheme.colors.secondary,
    marginRight: '10px'
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    width: '500px',
    maxWidth: '90vw'
  };

  if (loading) {
    return <div style={containerStyle}>Loading doctors...</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={{color: hospitalTheme.colors.primary, marginBottom: '20px'}}>
        👨⚕️ Consult a Doctor
      </h2>
      
      <input
        type="text"
        placeholder="Search doctors by name, specialization, or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchStyle}
      />
      
      {doctors.length === 0 ? (
        <div style={cardStyle}>
          <p>No doctors available for consultation at the moment.</p>
        </div>
      ) : (
        <div>
          {filteredDoctors.length === 0 ? (
            <div style={cardStyle}>
              <p>No doctors found matching your search criteria.</p>
            </div>
          ) : (
            filteredDoctors.map(doctor => (
              <div key={doctor._id} style={doctorCardStyle}>
                <div>
                  <h3 style={{margin: '0 0 10px 0', color: hospitalTheme.colors.text}}>
                    Dr. {doctor.firstName}
                  </h3>
                  <p style={{margin: '0 0 5px 0', color: hospitalTheme.colors.textLight}}>
                    <strong>Specialization:</strong> {doctor.specialization || 'Not specified'}
                  </p>
                  <p style={{margin: '0', color: hospitalTheme.colors.textLight}}>
                    <strong>Email:</strong> {doctor.email}
                  </p>
                  <p style={{margin: '5px 0 0 0', color: hospitalTheme.colors.textLight, fontSize: '12px'}}>
                    <strong>License:</strong> {doctor.medicalLicense || 'Not specified'}
                  </p>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <button 
                    style={profileButtonStyle}
                    onClick={() => setViewingProfile(doctor)}
                  >
                    View Profile
                  </button>
                  <button 
                    style={buttonStyle}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    Consult Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedDoctor && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3 style={{color: hospitalTheme.colors.primary, marginBottom: '20px'}}>
              Consult Dr. {selectedDoctor.firstName}
            </h3>
            <p style={{marginBottom: '15px', color: hospitalTheme.colors.textLight}}>
              <strong>Specialization:</strong> {selectedDoctor.specialization || 'Not specified'}
            </p>
            <textarea
              placeholder="Describe your symptoms or health concerns..."
              value={consultationMessage}
              onChange={(e) => setConsultationMessage(e.target.value)}
              style={{
                width: '100%',
                height: '120px',
                padding: '10px',
                border: `1px solid ${hospitalTheme.colors.border}`,
                borderRadius: '5px',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
              <button 
                style={buttonStyle}
                onClick={() => handleConsultation(selectedDoctor)}
              >
                Send Request
              </button>
              <button 
                style={{...buttonStyle, backgroundColor: hospitalTheme.colors.textLight}}
                onClick={() => {
                  setSelectedDoctor(null);
                  setConsultationMessage('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingProfile && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3 style={{color: hospitalTheme.colors.primary, marginBottom: '20px'}}>
              Dr. {viewingProfile.firstName} - Profile
            </h3>
            <div style={{textAlign: 'left', marginBottom: '20px'}}>
              <p style={{marginBottom: '10px'}}>
                <strong>Name:</strong> Dr. {viewingProfile.firstName}
              </p>
              <p style={{marginBottom: '10px'}}>
                <strong>Specialization:</strong> {viewingProfile.specialization || 'Not specified'}
              </p>
              <p style={{marginBottom: '10px'}}>
                <strong>Email:</strong> {viewingProfile.email}
              </p>
              <p style={{marginBottom: '10px'}}>
                <strong>Medical License:</strong> {viewingProfile.medicalLicense || 'Not specified'}
              </p>
              <p style={{marginBottom: '10px'}}>
                <strong>Status:</strong> <span style={{color: 'green'}}>Verified & Approved</span>
              </p>
              <p style={{marginBottom: '10px'}}>
                <strong>Joined:</strong> {new Date(viewingProfile.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button 
                style={buttonStyle}
                onClick={() => {
                  setViewingProfile(null);
                  setSelectedDoctor(viewingProfile);
                }}
              >
                Consult This Doctor
              </button>
              <button 
                style={{...buttonStyle, backgroundColor: hospitalTheme.colors.textLight}}
                onClick={() => setViewingProfile(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultDoctor;