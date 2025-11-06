import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalTheme } from '../theme/hospitalTheme';
import PatientSearch from './PatientSearch';
import ViewRecords from './ViewRecords';
import AddMedicalData from './AddMedicalData';
import MedicationManagement from './MedicationManagement';
import PrescriptionHistory from './PrescriptionHistory';
import DoctorConsultationRequests from './DoctorConsultationRequests';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const styles = {
    layout: { display: 'flex', height: '100vh', ...hospitalTheme.layout.pageContainer },
    sidebar: { width: '280px', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', borderRight: `1px solid rgba(8, 145, 178, 0.1)`, boxShadow: '4px 0 20px rgba(8, 145, 178, 0.08)', padding: '24px', backdropFilter: 'blur(10px)', overflowY: 'auto', height: '100vh' },
    link: { display: 'block', padding: '14px 18px', marginBottom: '6px', borderRadius: '12px', fontWeight: '500', backgroundColor: 'rgba(248, 250, 252, 0.6)', color: hospitalTheme.colors.text, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', border: '1px solid transparent' },
    activeLink: { background: 'linear-gradient(135deg, #0891b2, #06b6d4)', color: '#ffffff', boxShadow: '0 8px 25px rgba(8, 145, 178, 0.4)', border: '1px solid rgba(8, 145, 178, 0.2)', transform: 'translateX(4px)' },
    disabledLink: { backgroundColor: '#e9ecef', color: hospitalTheme.colors.textLight, cursor: 'not-allowed', opacity: 0.6 },
    header: { fontSize: '14px', fontWeight: '600', color: hospitalTheme.colors.textLight, marginTop: '20px', marginBottom: '10px', textTransform: 'uppercase' },
    content: { flex: 1, padding: '30px', overflowY: 'auto', height: '100vh' }
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px', borderBottom: `2px solid ${hospitalTheme.colors.primary}`, paddingBottom: '15px'}}>
          <img src={hospitalTheme.logo.src} alt="MediSync" style={hospitalTheme.logo.style} />
          <div style={{color: hospitalTheme.colors.primary, fontWeight: '600', fontSize: '18px'}}>MediSync</div>
        </div>
        <div style={{marginBottom: '20px', padding: '10px', backgroundColor: hospitalTheme.colors.background, borderRadius: '8px'}}>
          <div style={{color: hospitalTheme.colors.primary, fontSize: '16px', fontWeight: '600'}}>Hi, Dr. {localStorage.getItem('userName') || 'Doctor'}! 👋</div>
        </div>
        <h3>👨⚕️ Doctor Portal</h3>
        
        {selectedPatient && (
          <div style={{...hospitalTheme.components.card, backgroundColor: '#e8f5e9', borderLeft: `4px solid ${hospitalTheme.colors.secondary}`, marginBottom: '15px', fontSize: '14px'}}>
            <strong style={{color: hospitalTheme.colors.secondary}}>👤 Selected Patient:</strong><br/>
            <span style={{fontWeight: '600'}}>{selectedPatient.name}</span><br/>
            <small style={{color: hospitalTheme.colors.textLight}}>{selectedPatient.email}</small>
          </div>
        )}

        <div style={styles.header}>Overview</div>
        <div onClick={() => setActiveTab('dashboard')} style={{...styles.link, ...(activeTab === 'dashboard' ? styles.activeLink : {})}}>🏥 Dashboard</div>
        
        <div style={styles.header}>Patient Management</div>
        <div onClick={() => setActiveTab('consultation-requests')} style={{...styles.link, ...(activeTab === 'consultation-requests' ? styles.activeLink : {})}}>📋 Consultation Requests</div>
        <div onClick={() => setActiveTab('patient-search')} style={{...styles.link, ...(activeTab === 'patient-search' ? styles.activeLink : {})}}>🔍 Select Patient</div>


        <div style={styles.header}>Medical Records</div>
        <div onClick={() => selectedPatient && setActiveTab('view-records')} style={{...styles.link, ...(selectedPatient ? (activeTab === 'view-records' ? styles.activeLink : {}) : styles.disabledLink)}}>📄 View Records</div>
        <div onClick={() => selectedPatient && setActiveTab('add-data')} style={{...styles.link, ...(selectedPatient ? (activeTab === 'add-data' ? styles.activeLink : {}) : styles.disabledLink)}}>➕ Add Medical Data</div>

        <div style={styles.header}>Treatment</div>
        <div onClick={() => selectedPatient && setActiveTab('medication-management')} style={{...styles.link, ...(selectedPatient ? (activeTab === 'medication-management' ? styles.activeLink : {}) : styles.disabledLink)}}>💊 Medication Management</div>
        <div onClick={() => selectedPatient && setActiveTab('prescription-history')} style={{...styles.link, ...(selectedPatient ? (activeTab === 'prescription-history' ? styles.activeLink : {}) : styles.disabledLink)}}>📜 Prescription History</div>
        
        <div style={{...styles.header, marginTop: '30px'}}>System</div>
        <div onClick={handleLogout} style={{...styles.link, backgroundColor: '#dc3545', color: 'white'}}>🚪 Logout</div>
      </aside>

      <main style={styles.content}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '30px'}}>
              <img src={hospitalTheme.logo.src} alt="MediSync" style={hospitalTheme.logo.style} />
              <h2 style={{fontSize: '2rem', color: hospitalTheme.colors.primary, fontWeight: '600', margin: 0}}>Doctor Portal - MediSync</h2>
            </div>

            <div style={{...hospitalTheme.components.card, marginBottom: '20px'}}>
              <h3 style={{color: hospitalTheme.colors.primary, marginBottom: '15px'}}>🏥 Welcome to MediSync</h3>
              <p style={{lineHeight: '1.6', color: hospitalTheme.colors.text, marginBottom: '15px'}}>
                A comprehensive healthcare management system for secure patient care and medical record management.
              </p>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                <div style={{padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px'}}>
                  <h4 style={{color: '#1976d2', margin: '0 0 8px 0'}}>👥 Patient Management</h4>
                  <p style={{margin: 0, fontSize: '14px', color: '#555'}}>View consultation requests and manage patient communications</p>
                </div>
                <div style={{padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px'}}>
                  <h4 style={{color: '#388e3c', margin: '0 0 8px 0'}}>📄 Medical Records</h4>
                  <p style={{margin: 0, fontSize: '14px', color: '#555'}}>Access and add patient medical records securely</p>
                </div>
                <div style={{padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px'}}>
                  <h4 style={{color: '#f57c00', margin: '0 0 8px 0'}}>💊 Treatment</h4>
                  <p style={{margin: 0, fontSize: '14px', color: '#555'}}>Manage medications and prescription history</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'consultation-requests' && <DoctorConsultationRequests />}
        {activeTab === 'patient-search' && <PatientSearch onPatientSelect={setSelectedPatient} />}

        {activeTab === 'view-records' && selectedPatient && <ViewRecords selectedPatient={selectedPatient.email} />}
        {activeTab === 'add-data' && selectedPatient && <AddMedicalData selectedPatient={selectedPatient.email} />}
        {activeTab === 'medication-management' && selectedPatient && <MedicationManagement selectedPatient={selectedPatient.email} />}
        {activeTab === 'prescription-history' && selectedPatient && <PrescriptionHistory selectedPatient={selectedPatient.email} />}
      </main>
    </div>
  );
}

export default DoctorDashboard;