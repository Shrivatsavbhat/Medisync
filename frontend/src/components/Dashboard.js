import React, { useEffect, useState } from 'react';
import { hospitalTheme } from '../theme/hospitalTheme';

function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'doctor') {
      fetchDoctorStats();
    }
  }, []);

  const fetchDoctorStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const patientsRes = await fetch('http://localhost:5000/api/access/approved', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const requestsRes = await fetch('http://localhost:5000/api/access/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (patientsRes.ok && requestsRes.ok) {
        const patients = await patientsRes.json();
        const requests = await requestsRes.json();
        setStats({
          totalPatients: patients.length,
          pendingRequests: requests.length,
          consultations: patients.length + requests.length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  const cardStyle = {
    ...hospitalTheme.components.card,
    padding: '20px',
    margin: '10px',
    textAlign: 'center',
    minWidth: '200px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  return (
    <div style={containerStyle}>
      <div style={{marginBottom: '30px'}}>
        <h1 style={{color: hospitalTheme.colors.primary, marginBottom: '10px'}}>
          Welcome back, {userName}! 👋
        </h1>
        <p style={{color: hospitalTheme.colors.textLight, fontSize: '18px'}}>
          {userRole === 'patient' ? 'Manage your health records and medications' : 
           userRole === 'doctor' ? 'View your patients and consultations' : 
           'System administration dashboard'}
        </p>
      </div>

      {userRole === 'patient' ? (
        <div style={{textAlign: 'center', padding: '40px'}}>
          <div style={{fontSize: '4rem', marginBottom: '20px'}}>🏥</div>
          <h2 style={{color: hospitalTheme.colors.primary, marginBottom: '20px'}}>MediSync</h2>
          <p style={{fontSize: '18px', color: hospitalTheme.colors.textLight, maxWidth: '600px', margin: '0 auto', lineHeight: '1.6'}}>
            Your comprehensive healthcare management system. Manage medical records, 
            schedule medications, consult with doctors, and stay on top of your health journey.
          </p>
          <div style={{marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <div style={{...hospitalTheme.components.card, padding: '15px', minWidth: '200px'}}>
              <h4 style={{margin: '0 0 10px 0', color: hospitalTheme.colors.primary}}>📁 Medical Records</h4>
              <p style={{margin: 0, fontSize: '14px'}}>Upload and manage your health documents</p>
            </div>
            <div style={{...hospitalTheme.components.card, padding: '15px', minWidth: '200px'}}>
              <h4 style={{margin: '0 0 10px 0', color: hospitalTheme.colors.primary}}>💊 Medications</h4>
              <p style={{margin: 0, fontSize: '14px'}}>Smart reminders and scheduling</p>
            </div>
            <div style={{...hospitalTheme.components.card, padding: '15px', minWidth: '200px'}}>
              <h4 style={{margin: '0 0 10px 0', color: hospitalTheme.colors.primary}}>👨⚕️ Consultations</h4>
              <p style={{margin: 0, fontSize: '14px'}}>Connect with verified doctors</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center'}}>
          <div style={cardStyle}>
            <h3 style={{margin: '0 0 10px 0', fontSize: '2rem'}}>👥</h3>
            <h2 style={{margin: '0', fontSize: '2.5rem'}}>{stats.totalPatients}</h2>
            <p style={{margin: '5px 0 0 0'}}>Active Patients</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{margin: '0 0 10px 0', fontSize: '2rem'}}>📋</h3>
            <h2 style={{margin: '0', fontSize: '2.5rem'}}>{stats.pendingRequests}</h2>
            <p style={{margin: '5px 0 0 0'}}>Consultation Requests</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{margin: '0 0 10px 0', fontSize: '2rem'}}>🏥</h3>
            <h2 style={{margin: '0', fontSize: '2.5rem'}}>{stats.consultations}</h2>
            <p style={{margin: '5px 0 0 0'}}>Total Consultations</p>
          </div>
        </div>
      )}

      {userRole === 'doctor' && (
        <div style={{marginTop: '40px', padding: '20px', backgroundColor: hospitalTheme.colors.background, borderRadius: '10px'}}>
          <h3 style={{color: hospitalTheme.colors.primary, marginBottom: '15px'}}>Quick Actions</h3>
          <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
            <button style={hospitalTheme.components.button}>📋 View Requests</button>
            <button style={hospitalTheme.components.button}>👥 Select Patient</button>
            <button style={hospitalTheme.components.button}>💉 Prescribe Medication</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;