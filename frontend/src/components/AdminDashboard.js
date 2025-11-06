import React, { useState, useEffect } from 'react';
import { useNotification } from './NotificationSystem';

function AdminDashboard() {
  const { showSuccess, showError } = useNotification();
  const [users, setUsers] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordFilter, setRecordFilter] = useState('');
  const [recordStatusFilter, setRecordStatusFilter] = useState('all');
  const [prescriptionFilter, setPrescriptionFilter] = useState('');
  const [prescriptionStatusFilter, setPrescriptionStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
    fetchAllAccessRequests();
    fetchPendingDoctors();
    fetchAllRecords();
    fetchAllPrescriptions();
  }, []);

  const fetchAllRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setRecords(result);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const fetchAllPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/prescriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setPrescriptions(result);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesFilter = record.Email?.toLowerCase().includes(recordFilter.toLowerCase()) ||
                         record.title?.toLowerCase().includes(recordFilter.toLowerCase());
    const matchesStatus = recordStatusFilter === 'all' || record.status === recordStatusFilter;
    return matchesFilter && matchesStatus;
  });

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesFilter = prescription.patientEmail?.toLowerCase().includes(prescriptionFilter.toLowerCase()) ||
                         prescription.doctorEmail?.toLowerCase().includes(prescriptionFilter.toLowerCase()) ||
                         prescription.name?.toLowerCase().includes(prescriptionFilter.toLowerCase());
    const matchesStatus = prescriptionStatusFilter === 'all' || prescription.status === prescriptionStatusFilter;
    return matchesFilter && matchesStatus;
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setUsers(result);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAllAccessRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/all-access-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setAccessRequests(result);
      }
    } catch (error) {
      console.error('Error fetching access requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/pending-doctors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setPendingDoctors(result);
      }
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
    }
  };

  const handleDoctorApproval = async (doctorId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/update-doctor-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ doctorId, status })
      });
      
      if (response.ok) {
        const result = await response.json();
        showSuccess(result.msg || `Doctor ${status} successfully!`);
        fetchPendingDoctors();
        fetchUsers();
      } else {
        const error = await response.json();
        showError(error.msg || 'Error updating doctor status');
      }
    } catch (error) {
      console.error('Error updating doctor status:', error);
      showError('Server error. Please try again.');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user: ${userName}?`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        const result = await response.json();
        showSuccess(result.msg || 'User deleted successfully!');
        fetchUsers();
        fetchPendingDoctors();
      } else {
        const error = await response.json();
        showError(error.msg || 'Error deleting user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Server error. Please try again.');
    }
  };

  const containerStyle = {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const cardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  };

  const thStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    border: '1px solid #ddd'
  };

  const tdStyle = {
    padding: '12px',
    border: '1px solid #ddd'
  };

  const buttonStyle = {
    padding: '6px 12px',
    margin: '0 4px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  };

  const approveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white'
  };

  const rejectButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white'
  };

  if (loading) {
    return <div style={containerStyle}>Loading admin dashboard...</div>;
  }

  return (
    <div style={containerStyle}>
      <h1>🔧 Admin Dashboard</h1>
      
      {/* Pending Doctor Approvals */}
      {pendingDoctors.length > 0 && (
        <div style={cardStyle}>
          <h3>⏳ Pending Doctor Approvals</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Specialization</th>
                <th style={thStyle}>Medical License</th>
                <th style={thStyle}>Registered</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDoctors.map(doctor => (
                <tr key={doctor._id}>
                  <td style={tdStyle}>{doctor.firstName}</td>
                  <td style={tdStyle}>{doctor.email}</td>
                  <td style={tdStyle}>{doctor.specialization}</td>
                  <td style={tdStyle}>{doctor.medicalLicense}</td>
                  <td style={tdStyle}>{new Date(doctor.createdAt).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <button 
                      style={approveButtonStyle}
                      onClick={() => handleDoctorApproval(doctor._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button 
                      style={rejectButtonStyle}
                      onClick={() => handleDoctorApproval(doctor._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Statistics Overview */}
      <div style={cardStyle}>
        <h3>📊 System Statistics</h3>
        <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
          <div style={{padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px'}}>
            <h4>Patients: {users.filter(u => u.role === 'patient').length}</h4>
          </div>
          <div style={{padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px'}}>
            <h4>Doctors: {users.filter(u => u.role === 'doctor' && u.approvalStatus === 'approved').length}</h4>
          </div>
          <div style={{padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px'}}>
            <h4>Pending Doctors: {pendingDoctors.length}</h4>
          </div>
          <div style={{padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px'}}>
            <h4>Total Users: {users.length}</h4>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div style={cardStyle}>
        <h3>👨‍⚕️ Doctors</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Specialization</th>
              <th style={thStyle}>License</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Registered</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.role === 'doctor').map(doctor => (
              <tr key={doctor._id}>
                <td style={tdStyle}>{doctor.firstName}</td>
                <td style={tdStyle}>{doctor.email}</td>
                <td style={tdStyle}>{doctor.specialization || 'Not specified'}</td>
                <td style={tdStyle}>{doctor.medicalLicense || 'Not specified'}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 
                      doctor.approvalStatus === 'approved' ? '#d4edda' :
                      doctor.approvalStatus === 'pending' ? '#fff3cd' : '#f8d7da',
                    color:
                      doctor.approvalStatus === 'approved' ? '#155724' :
                      doctor.approvalStatus === 'pending' ? '#856404' : '#721c24'
                  }}>
                    {doctor.approvalStatus}
                  </span>
                </td>
                <td style={tdStyle}>{new Date(doctor.createdAt || Date.now()).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <button 
                    style={rejectButtonStyle}
                    onClick={() => handleDeleteUser(doctor._id, doctor.firstName)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Medical Records */}
      <div style={cardStyle}>
        <h3>📁 All Medical Records</h3>
        <div style={{marginBottom: '15px'}}>
          <input
            type="text"
            placeholder="Filter by patient email or title..."
            value={recordFilter}
            onChange={(e) => setRecordFilter(e.target.value)}
            style={{padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '200px'}}
          />
          <select
            value={recordStatusFilter}
            onChange={(e) => setRecordStatusFilter(e.target.value)}
            style={{padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Added By</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.slice(0, 10).map(record => (
              <tr key={record._id}>
                <td style={tdStyle}>{record.Email}</td>
                <td style={tdStyle}>{record.title}</td>
                <td style={tdStyle}>{record.addedBy} ({record.addedByRole})</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 
                      record.status === 'approved' ? '#d4edda' :
                      record.status === 'pending' ? '#fff3cd' : '#f8d7da',
                    color:
                      record.status === 'approved' ? '#155724' :
                      record.status === 'pending' ? '#856404' : '#721c24'
                  }}>
                    {record.status}
                  </span>
                </td>
                <td style={tdStyle}>{new Date(record.uploadedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Prescriptions */}
      <div style={cardStyle}>
        <h3>💊 All Prescriptions</h3>
        <div style={{marginBottom: '15px'}}>
          <input
            type="text"
            placeholder="Filter by patient, doctor, or medication..."
            value={prescriptionFilter}
            onChange={(e) => setPrescriptionFilter(e.target.value)}
            style={{padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '250px'}}
          />
          <select
            value={prescriptionStatusFilter}
            onChange={(e) => setPrescriptionStatusFilter(e.target.value)}
            style={{padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Doctor</th>
              <th style={thStyle}>Medication</th>
              <th style={thStyle}>Dosage</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.slice(0, 10).map(prescription => (
              <tr key={prescription._id}>
                <td style={tdStyle}>{prescription.patientEmail}</td>
                <td style={tdStyle}>{prescription.doctorEmail}</td>
                <td style={tdStyle}>{prescription.name}</td>
                <td style={tdStyle}>{prescription.dosage}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 
                      prescription.status === 'approved' ? '#d4edda' :
                      prescription.status === 'pending' ? '#fff3cd' : '#f8d7da',
                    color:
                      prescription.status === 'approved' ? '#155724' :
                      prescription.status === 'pending' ? '#856404' : '#721c24'
                  }}>
                    {prescription.status}
                  </span>
                </td>
                <td style={tdStyle}>{new Date(prescription.createdAt || prescription.prescribedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Patients Table */}
      <div style={cardStyle}>
        <h3>👥 Patients</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Age</th>
              <th style={thStyle}>Gender</th>
              <th style={thStyle}>Registered</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.role === 'patient').map(patient => (
              <tr key={patient._id}>
                <td style={tdStyle}>{patient.firstName}</td>
                <td style={tdStyle}>{patient.email}</td>
                <td style={tdStyle}>{patient.age || 'Not set'}</td>
                <td style={tdStyle}>{patient.gender || 'Not set'}</td>
                <td style={tdStyle}>{new Date(patient.createdAt || Date.now()).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <button 
                    style={rejectButtonStyle}
                    onClick={() => handleDeleteUser(patient._id, patient.firstName)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Access Requests */}
      <div style={cardStyle}>
        <h3>🔐 Access Requests Overview</h3>
        <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
          <div style={{padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px'}}>
            <h4>Pending: {accessRequests.filter(r => r.status === 'pending').length}</h4>
          </div>
          <div style={{padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px'}}>
            <h4>Approved: {accessRequests.filter(r => r.status === 'approved').length}</h4>
          </div>
          <div style={{padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px'}}>
            <h4>Denied: {accessRequests.filter(r => r.status === 'denied').length}</h4>
          </div>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Doctor</th>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Requested</th>
              <th style={thStyle}>Reason</th>
            </tr>
          </thead>
          <tbody>
            {accessRequests.slice(0, 10).map(request => (
              <tr key={request._id}>
                <td style={tdStyle}>{request.doctorEmail}</td>
                <td style={tdStyle}>{request.patientEmail}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 
                      request.status === 'pending' ? '#fff3cd' :
                      request.status === 'approved' ? '#d4edda' : '#f8d7da',
                    color:
                      request.status === 'pending' ? '#856404' :
                      request.status === 'approved' ? '#155724' : '#721c24'
                  }}>
                    {request.status}
                  </span>
                </td>
                <td style={tdStyle}>{new Date(request.requestedAt).toLocaleDateString()}</td>
                <td style={tdStyle}>{request.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button 
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
        style={{
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '30px'
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;