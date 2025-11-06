import React, { useState } from "react";
import axios from "axios";

function PatientSearch({ onPatientSelect }) {
  const [patientId, setPatientId] = useState("");
  const [approvedPatients, setApprovedPatients] = useState([]);
  const [reason, setReason] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);

  React.useEffect(() => {
    fetchApprovedPatients();
  }, []);

  const fetchApprovedPatients = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/access/approved', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      setApprovedPatients(result);
    } catch (error) {
      console.error('Error fetching approved patients:', error);
    }
  };

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/record/records/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Handle search results if needed
    } catch (err) {
      console.error("Error fetching reports:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || "Failed to fetch reports";
      
      if (errorMsg.includes("Access denied")) {
        setShowRequestForm(true);
      }
      alert(errorMsg);
    }
  };

  const requestAccess = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/api/access/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ patientEmail: patientId, reason })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Access request sent to patient!');
        setShowRequestForm(false);
        setReason("");
      } else {
        alert('Error: ' + result.msg);
      }
    } catch (error) {
      alert('Error sending request: ' + error.message);
    }
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f4f7fa", borderRadius: "10px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ fontSize: "2rem", textAlign: "center" }}>🔍 Select Approved Patient</h2>

      {approvedPatients.length > 0 ? (
        <div>
          <h3>Approved Patients:</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {approvedPatients.map((patient, index) => (
              <div key={index} style={{
                padding: '15px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #ddd',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onClick={() => onPatientSelect && onPatientSelect({email: patient.email, name: patient.name})}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e3f2fd'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
              >
                <strong>👥 {patient.name}</strong>
                <p style={{margin: '5px 0', color: '#666'}}>{patient.email}</p>
                <p style={{margin: '5px 0', color: '#28a745', fontSize: '12px'}}>✓ Access Approved</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{textAlign: 'center', color: '#666'}}>No approved patients found.</p>
      )}

      <hr style={{margin: '30px 0'}} />
      <h3>Request New Patient Access:</h3>
      <input
        type="text"
        placeholder="Enter Patient Email"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        style={{ width: "100%", padding: "10px", margin: "10px 0" }}
      />

      <button
        style={{ backgroundColor: "#28a745", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", width: "100%" }}
        onClick={() => setShowRequestForm(true)}
      >
        Request Access
      </button>

      {/* Access Request Form */}
      {showRequestForm && (
        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff3cd", borderRadius: "5px" }}>
          <h4>🔐 Request Access to Patient Data</h4>
          <textarea
            placeholder="Reason for access request"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "10px 0", height: "80px" }}
          />
          <button
            style={{ backgroundColor: "#28a745", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", marginRight: "10px" }}
            onClick={requestAccess}
          >
            Send Request
          </button>
          <button
            style={{ backgroundColor: "#6c757d", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px" }}
            onClick={() => setShowRequestForm(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default PatientSearch;
