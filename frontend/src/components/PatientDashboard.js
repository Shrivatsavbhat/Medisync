// Patient Dashboard - Main interface for patient users
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalTheme } from '../theme/hospitalTheme';

import MedicalRecords from './MedicalRecords';
import MedicationReminders from './MedicationReminders';
import MedicationTimeline from './MedicationTimeline';
import ManageAccess from './ManageAccess';
import DoctorData from './DoctorData';
import MedicationScheduler from './MedicationScheduler';
import ConsultDoctor from './ConsultDoctor';
import ProfileSetup from './ProfileSetup';
import EditProfile from './EditProfile';
import Dashboard from './Dashboard';

function PatientDashboard() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editData, setEditData] = useState({});
  const [profileData, setProfileData] = useState(null);
  const [notification, setNotification] = useState('');

  // Check if patient profile is complete
  useEffect(() => {
    const checkProfileCompletion = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      if (userRole !== 'patient') return;
      
      try {
        const response = await fetch('http://localhost:5000/api/patient/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          const missingData = !data.age || !data.gender || !data.height || !data.weight;
          setShowProfileSetup(missingData);
        } else {
          setShowProfileSetup(true);
        }
      } catch (error) {
        setShowProfileSetup(true);
      }
    };
    
    checkProfileCompletion();
  }, []);

  // Fetch profile data when needed
  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/patient/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  useEffect(() => {
    if (showProfile && !profileData) {
      fetchProfileData();
    }
  }, [showProfile]);

  const dashboardStyles = {
    layout: { display: 'flex', height: '100vh', ...hospitalTheme.layout.pageContainer },
    sidebar: { width: '280px', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', borderRight: `1px solid rgba(8, 145, 178, 0.1)`, boxShadow: '4px 0 20px rgba(8, 145, 178, 0.08)', padding: '24px', backdropFilter: 'blur(10px)', overflowY: 'auto', height: '100vh' },
    navigationLink: { display: 'block', padding: '14px 18px', marginBottom: '6px', borderRadius: '12px', fontWeight: '500', backgroundColor: 'rgba(248, 250, 252, 0.6)', color: hospitalTheme.colors.text, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', border: '1px solid transparent' },
    activeLink: { background: 'linear-gradient(135deg, #0891b2, #06b6d4)', color: '#ffffff', boxShadow: '0 8px 25px rgba(8, 145, 178, 0.4)', border: '1px solid rgba(8, 145, 178, 0.2)', transform: 'translateX(4px)' },
    sectionHeader: { fontSize: '14px', fontWeight: '600', color: hospitalTheme.colors.textLight, marginTop: '20px', marginBottom: '10px', textTransform: 'uppercase' },
    mainContent: { flex: 1, padding: '30px', overflowY: 'auto', height: '100vh' }
  };

  const handleProfileUpdate = (updatedData) => {
    setProfileData(updatedData);
    setEditingProfile(false);
    setNotification('Profile updated successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleUserLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      {showProfileSetup && <ProfileSetup onComplete={() => setShowProfileSetup(false)} />}
      {editingProfile && <EditProfile profileData={editData} onSave={handleProfileUpdate} onCancel={() => setEditingProfile(false)} />}
      
      <div style={dashboardStyles.layout}>
        <aside style={dashboardStyles.sidebar}>
          {/* Header */}
          <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px', borderBottom: `2px solid ${hospitalTheme.colors.primary}`, paddingBottom: '15px'}}>
            <img src={hospitalTheme.logo.src} alt="MediSync" style={hospitalTheme.logo.style} />
            <div style={{color: hospitalTheme.colors.primary, fontWeight: '600', fontSize: '18px'}}>MediSync</div>
          </div>
          
          {/* Welcome message */}
          <div style={{marginBottom: '20px', padding: '10px', backgroundColor: hospitalTheme.colors.background, borderRadius: '8px'}}>
            <div style={{color: hospitalTheme.colors.primary, fontSize: '16px', fontWeight: '600'}}>
              Hi, {localStorage.getItem('userName') || 'Patient'}! 👋
            </div>
          </div>
          
          <h3>🧑⚕️ Patient Portal</h3>
          
          {/* Navigation */}
          <div style={dashboardStyles.sectionHeader}>Overview</div>
          <div onClick={() => setActiveTab('dashboard')} style={{...dashboardStyles.navigationLink, ...(activeTab === 'dashboard' ? dashboardStyles.activeLink : {})}}>
            📊 Dashboard
          </div>
          
          <div style={dashboardStyles.sectionHeader}>Account</div>
          <div onClick={() => setShowProfile(!showProfile)} style={{...dashboardStyles.navigationLink, ...(showProfile ? dashboardStyles.activeLink : {})}}>
            👤 My Profile
          </div>
          
          {/* Profile details */}
          {showProfile && (
            <div style={{marginTop: '10px', padding: '15px', backgroundColor: hospitalTheme.colors.background, borderRadius: '8px', border: `1px solid ${hospitalTheme.colors.border}`}}>
              <div style={{marginBottom: '8px'}}>
                <strong style={{color: hospitalTheme.colors.text}}>Name:</strong>
                <div style={{color: hospitalTheme.colors.textLight}}>{localStorage.getItem('userName') || 'Patient'}</div>
              </div>
              <div style={{marginBottom: '8px'}}>
                <strong style={{color: hospitalTheme.colors.text}}>Email:</strong>
                <div style={{color: hospitalTheme.colors.textLight, fontSize: '14px'}}>{localStorage.getItem('userEmail') || 'patient@example.com'}</div>
              </div>
              
              {profileData && (
                <>
                  <div style={{marginBottom: '8px'}}>
                    <strong style={{color: hospitalTheme.colors.text}}>Age:</strong>
                    <div style={{color: hospitalTheme.colors.textLight}}>{profileData.age} years</div>
                  </div>
                  <div style={{marginBottom: '8px'}}>
                    <strong style={{color: hospitalTheme.colors.text}}>Gender:</strong>
                    <div style={{color: hospitalTheme.colors.textLight}}>{profileData.gender}</div>
                  </div>
                  <div style={{marginBottom: '8px'}}>
                    <strong style={{color: hospitalTheme.colors.text}}>Height:</strong>
                    <div style={{color: hospitalTheme.colors.textLight}}>{profileData.height} cm</div>
                  </div>
                  <div style={{marginBottom: '15px'}}>
                    <strong style={{color: hospitalTheme.colors.text}}>Weight:</strong>
                    <div style={{color: hospitalTheme.colors.textLight}}>{profileData.weight} kg</div>
                  </div>
                  <button onClick={() => { setEditData(profileData); setEditingProfile(true); }} style={{...hospitalTheme.components.button, padding: '6px 12px', fontSize: '12px', width: '100%'}}>
                    ✏️ Edit Profile
                  </button>
                </>
              )}
            </div>
          )}
          
          <div style={dashboardStyles.sectionHeader}>Services</div>
          <div onClick={() => setActiveTab('consult')} style={{...dashboardStyles.navigationLink, ...(activeTab === 'consult' ? dashboardStyles.activeLink : {})}}>👨⚕️ Consult Doctor</div>
          <div onClick={() => setActiveTab('manage-access')} style={{...dashboardStyles.navigationLink, ...(activeTab === 'manage-access' ? dashboardStyles.activeLink : {})}}>🔐 Doctor Access</div>
          
          <div style={dashboardStyles.sectionHeader}>Records</div>
          <div onClick={() => setActiveTab('records')} style={{...dashboardStyles.navigationLink, ...(activeTab === 'records' ? dashboardStyles.activeLink : {})}}>📁 My Records</div>
          <div onClick={() => setActiveTab('doctor-data')} style={{...dashboardStyles.navigationLink, ...(activeTab === 'doctor-data' ? dashboardStyles.activeLink : {})}}>📝 Doctor Data</div>

          <div style={dashboardStyles.sectionHeader}>Medication</div>
          <div onClick={() => setActiveTab('schedule')} style={{...dashboardStyles.navigationLink, ...(activeTab === 'schedule' ? dashboardStyles.activeLink : {})}}>📅 Schedule</div>
          <div onClick={() => setActiveTab('reminders')} style={{...dashboardStyles.navigationLink, ...(activeTab === 'reminders' ? dashboardStyles.activeLink : {})}}>⏰ Reminders</div>
          <div onClick={() => setActiveTab('timeline')} style={{...dashboardStyles.navigationLink, ...(activeTab === 'timeline' ? dashboardStyles.activeLink : {})}}>📈 Timeline</div>
          
          <div style={{...dashboardStyles.sectionHeader, marginTop: '30px'}}>System</div>
          <div onClick={handleUserLogout} style={{...dashboardStyles.navigationLink, backgroundColor: '#dc3545', color: 'white'}}>🚪 Logout</div>
        </aside>

        <main style={dashboardStyles.mainContent}>
          {/* Notifications */}
          {notification && (
            <div style={{backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '4px', marginBottom: '20px', border: '1px solid #c3e6cb'}}>
              {notification}
            </div>
          )}

          {/* Content based on active tab */}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'consult' && <ConsultDoctor />}
          {activeTab === 'manage-access' && <ManageAccess />}
          {activeTab === 'records' && <MedicalRecords />}
          {activeTab === 'doctor-data' && <DoctorData />}
          {activeTab === 'schedule' && <MedicationScheduler />}
          {activeTab === 'reminders' && <MedicationReminders />}
          {activeTab === 'timeline' && <MedicationTimeline />}
        </main>
      </div>
    </>
  );
}

export default PatientDashboard;