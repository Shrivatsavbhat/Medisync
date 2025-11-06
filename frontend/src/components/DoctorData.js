import React, { useState, useEffect } from 'react';

function DoctorData() {
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      
      // Fetch medical records added by doctors
      const recordsResponse = await fetch(`http://localhost:5000/api/record/records/${userEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch all prescriptions from doctors
      const prescriptionsResponse = await fetch('http://localhost:5000/api/patient/getAllPrescriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = [];
      
      if (recordsResponse.ok) {
        const records = await recordsResponse.json();
        const doctorRecords = records.filter(record => record.addedByRole === 'doctor');
        doctorRecords.forEach(record => {
          data.push({
            type: 'Medical Record',
            content: `${record.title} - ${record.notes}`,
            addedBy: record.addedBy,
            date: new Date(record.uploadedAt).toLocaleDateString(),
            status: record.status
          });
        });
      }
      
      if (prescriptionsResponse.ok) {
        const prescriptions = await prescriptionsResponse.json();
        prescriptions.forEach(prescription => {
          data.push({
            type: 'Prescription',
            content: `${prescription.name} - ${prescription.dosage} (${prescription.frequency})`,
            addedBy: prescription.doctorEmail,
            date: new Date(prescription.prescribedAt).toLocaleDateString(),
            status: prescription.status,
            notes: prescription.notes
          });
        });
      }
      
      setDoctorData(data);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: '30px',
    backgroundColor: '#f4f7fa',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: 'auto',
  };

  const headingStyle = {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: '0',
  };

  const listItemStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    padding: '15px',
    margin: '10px 0',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
  };

  const listItemHoverStyle = {
    transform: 'scale(1.02)',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>📝 Doctor-Added Data</h2>
      {loading ? (
        <p style={{textAlign: 'center'}}>Loading doctor data...</p>
      ) : doctorData.length === 0 ? (
        <p style={{textAlign: 'center', color: '#666'}}>No data added by doctors yet.</p>
      ) : (
        <ul style={listStyle}>
          {doctorData.map((item, index) => (
            <li
              key={index}
              style={listItemStyle}
              onMouseOver={(e) => (e.currentTarget.style.transform = listItemHoverStyle.transform)}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1}}>
                  <strong style={{color: '#2c3e50'}}>{item.type}:</strong>
                  <div style={{margin: '5px 0', color: '#34495e'}}>{item.content}</div>
                  <div style={{fontSize: '12px', color: '#7f8c8d'}}>
                    Added by: {item.addedBy} • {item.date}
                  </div>
                  {item.notes && (
                    <div style={{fontSize: '12px', color: '#7f8c8d', marginTop: '5px'}}>
                      Notes: {item.notes}
                    </div>
                  )}
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: item.status === 'approved' ? '#d4edda' : item.status === 'pending' ? '#fff3cd' : '#f8d7da',
                  color: item.status === 'approved' ? '#155724' : item.status === 'pending' ? '#856404' : '#721c24'
                }}>
                  {item.status}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DoctorData;
