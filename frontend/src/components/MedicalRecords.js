import React, { useState, useEffect } from 'react';
import axios from "axios";
import { hospitalTheme } from '../theme/hospitalTheme';
import { useNotification } from './NotificationSystem';

function MedicalRecords() {
  const { showSuccess, showError, showWarning } = useNotification();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); 
  const [filePreview, setFilePreview] = useState(null);
  const [records, setRecords] = useState([]);
  const [pendingRecords, setPendingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('view'); // 'view', 'add', or 'pending'
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchRecords();
    fetchPendingRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      
      const response = await fetch(`http://localhost:5000/api/record/records/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setRecords(result);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (fileId, filename) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/record/download/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        showError('Failed to download file');
      }
    } catch (error) {
      console.error('Download error:', error);
      showError('Error downloading file');
    }
  };

  const fetchPendingRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/patient/pendingRecords', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const records = await response.json();
        setPendingRecords(records);
      }
    } catch (err) {
      console.error('Error fetching pending records:', err);
    }
  };

  const updateRecordStatus = async (recordId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/patient/updateRecordStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recordId, status })
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccess(`Record ${status} successfully!`);
        fetchPendingRecords();
        fetchRecords();
      } else {
        showError('Error: ' + result.msg);
      }
    } catch (error) {
      showError('Error updating record: ' + error.message);
    }
  };

  const confirmDelete = (recordId, filename) => {
    setDeleteConfirm({ recordId, filename });
  };

  const deleteRecord = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/patient/deleteRecord/${deleteConfirm.recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccess('Record deleted successfully!');
        fetchRecords();
      } else {
        showError('Error: ' + result.msg);
      }
    } catch (error) {
      showError('Error deleting record: ' + error.message);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !notes.trim()) {
      showWarning("Please provide a title and notes.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login first');
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("notes", notes);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/patient/addRecord", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });

      console.log("Backend response:", res.data);

      if (res.data.success) {
        showSuccess("Medical record uploaded successfully!");
        setFile(null);
        setFilePreview(null);
        setTitle("");
        setNotes("");
        fetchRecords(); // Refresh records list
        setActiveView('view'); // Switch to view mode
      } else {
        showError("Upload failed: " + (res.data.msg || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      if (selected.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result);
        reader.readAsDataURL(selected);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
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

  const headingStyle = {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '30px',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };

  const sectionStyle = {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '25px',
    backdropFilter: 'blur(10px)',
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    margin: '10px 0',
    borderRadius: '10px',
    border: 'none',
    fontSize: '1rem',
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#333',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
  };

  const textareaStyle = {
    ...inputStyle,
    height: '120px',
    resize: 'vertical',
  };

  const fileInputStyle = {
    ...inputStyle,
    padding: '10px',
    border: '2px dashed rgba(0,0,0,0.2)',
    backgroundColor: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    cursor: 'pointer',
  };

  const filePreviewStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
    margin: '10px 0',
    display: 'block',
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: '#fff',
    padding: '15px 25px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    marginTop: '15px',
    transition: 'all 0.3s ease',
  };

  const buttonHoverStyle = {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
  };

  const removeButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    width: 'auto',
    padding: '8px 15px',
    fontSize: '0.9rem',
  };

  return (
    <div style={containerStyle}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '30px'}}>
        <img src={hospitalTheme.logo.src} alt="MediSync" style={hospitalTheme.logo.style} />
        <h2 style={{fontSize: '2rem', color: hospitalTheme.colors.primary, fontWeight: '600', margin: 0}}>📁 My Medical Records</h2>
      </div>

      <div style={{marginBottom: '20px'}}>
        <button 
          style={activeView === 'view' ? activeTabStyle : tabStyle}
          onClick={() => setActiveView('view')}
        >
          📄 View Records
        </button>
        <button 
          style={activeView === 'add' ? activeTabStyle : tabStyle}
          onClick={() => setActiveView('add')}
        >
          ➕ Add Record
        </button>
        <button 
          style={activeView === 'pending' ? activeTabStyle : tabStyle}
          onClick={() => setActiveView('pending')}
        >
          ⏳ Pending Approvals ({pendingRecords.length})
        </button>
      </div>

      {activeView === 'view' && (
        <div>
          {loading ? (
            <p>Loading records...</p>
          ) : records.length === 0 ? (
            <p style={{textAlign: 'center', color: hospitalTheme.colors.textLight}}>No medical records found.</p>
          ) : (
            records.map((rec, i) => (
              <div key={i} style={{
                ...hospitalTheme.components.card,
                borderLeft: `4px solid ${hospitalTheme.colors.primary}`,
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{fontSize: '1.2rem', fontWeight: '600', marginBottom: '5px'}}>
                    📄 {rec.title || 'Untitled Document'}
                  </div>
                  <p style={{color: hospitalTheme.colors.textLight, fontSize: '14px', margin: 0}}>
                    {new Date(rec.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button 
                    onClick={() => downloadFile(rec._id, rec.filename)}
                    style={{
                      ...hospitalTheme.components.button,
                      padding: '8px 16px'
                    }}
                  >
                    📥 Download
                  </button>
                  <button 
                    onClick={() => confirmDelete(rec._id, rec.filename)}
                    style={{
                      ...hospitalTheme.components.button,
                      backgroundColor: '#ef4444',
                      padding: '8px 16px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
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
          <h3 style={{ marginBottom: '20px', color: hospitalTheme.colors.text }}>📝 Add New Record</h3>

          <input
            type="text"
            placeholder="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              ...hospitalTheme.components.input,
              width: '100%',
              marginBottom: '15px'
            }}
          />
          <textarea
            placeholder="Metadata or Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              ...hospitalTheme.components.input,
              width: '100%',
              height: '120px',
              marginBottom: '15px',
              resize: 'vertical'
            }}
          />

          <h4 style={{ margin: '15px 0 10px 0', color: hospitalTheme.colors.text }}>📎 Attach File</h4>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileChange}
            style={{
              ...hospitalTheme.components.input,
              width: '100%',
              padding: '10px',
              border: `2px dashed ${hospitalTheme.colors.border}`,
              backgroundColor: hospitalTheme.colors.background,
              textAlign: 'center',
              cursor: 'pointer'
            }}
          />
        {selectedFile && (
          <div
            style={{
              margin: '10px 0',
              padding: '10px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
          >
            <p style={{ margin: '0 0 5px 0', color: '#333' }}>
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
            {filePreview && <img src={filePreview} alt="Preview" style={filePreviewStyle} />}
            <button
              style={removeButtonStyle}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, removeButtonStyle)}
              onClick={removeFile}
            >
              ❌ Remove File
            </button>
          </div>
        )}

          <button
            style={{
              ...hospitalTheme.components.button,
              width: '100%',
              marginTop: '20px'
            }}
            onClick={handleUpload}
          >
            💾 Upload Record
          </button>
        </div>
      )}

      {activeView === 'pending' && (
        <div>
          {pendingRecords.length === 0 ? (
            <p style={{textAlign: 'center', color: hospitalTheme.colors.textLight}}>
              No pending records to approve.
            </p>
          ) : (
            pendingRecords.map((record) => (
              <div key={record._id} style={{
                ...hospitalTheme.components.card,
                borderLeft: `4px solid ${hospitalTheme.colors.accent}`,
                marginBottom: '20px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                  <div>
                    <div style={{fontSize: '1.2rem', fontWeight: '600', marginBottom: '5px'}}>
                      📄 {record.title || 'Untitled Document'}
                    </div>
                    <p style={{color: hospitalTheme.colors.textLight, fontSize: '14px', margin: 0}}>
                      {new Date(record.uploadedAt).toLocaleDateString()} • Added by {record.addedBy}
                    </p>
                  </div>
                </div>
                
                <div style={{display: 'flex', gap: '10px'}}>
                  <button 
                    style={{
                      ...hospitalTheme.components.button,
                      backgroundColor: hospitalTheme.colors.secondary,
                      padding: '8px 16px'
                    }}
                    onClick={() => updateRecordStatus(record._id, 'approved')}
                  >
                    ✅ Approve
                  </button>
                  <button 
                    style={{
                      ...hospitalTheme.components.button,
                      backgroundColor: hospitalTheme.colors.accent,
                      padding: '8px 16px'
                    }}
                    onClick={() => updateRecordStatus(record._id, 'rejected')}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3 style={{color: '#ef4444', marginBottom: '15px'}}>🗑️ Delete Record</h3>
            <p style={{marginBottom: '20px', color: '#666'}}>Are you sure you want to delete <strong>{deleteConfirm.filename}</strong>? This action cannot be undone.</p>
            <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
              <button 
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={deleteRecord}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalRecords;
