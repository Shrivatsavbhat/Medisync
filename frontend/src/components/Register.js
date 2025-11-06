import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '', specialization: '', medicalLicense: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (formData.role === 'doctor' && (!formData.specialization || !formData.medicalLicense)) {
      setMessage({ text: 'Specialization and Medical License are required for doctors', type: 'error' });
      return;
    }

    try {
      const requestData = { name: formData.name, email: formData.email, password: formData.password, role: formData.role };
      if (formData.role === 'doctor') {
        requestData.specialization = formData.specialization;
        requestData.medicalLicense = formData.medicalLicense;
      }

      const response = await axios.post('http://localhost:5000/api/register', requestData);
      if (response.data.msg === 'Success') {
        if (formData.role === 'doctor') {
          setMessage({ text: 'Registration submitted! Your account is pending admin approval. Redirecting to login...', type: 'success' });
        } else {
          setMessage({ text: 'Registration successful! Redirecting to login...', type: 'success' });
        }
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage({ text: response.data.msg || 'Registration failed', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Registration failed. Try again.', type: 'error' });
    }
  };

  const styles = {
    container: {
      width: '400px',
      margin: '60px auto',
      padding: '40px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      fontFamily: "'Segoe UI', sans-serif",
      textAlign: 'center',
      position: 'relative',
      zIndex: 2,
    },
    pageBackground: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'url("https://images.unsplash.com/photo-1504439468489-c8920d796a29?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'brightness(0.75)',
      zIndex: -1,
    },
    input: {
      width: '92%',
      padding: '15px',
      margin: '12px 0',
      borderRadius: '12px',
      border: '1px solid #a3d5ff',
      fontSize: '16px',
      outline: 'none',
      boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
    },
    select: {
      width: '96%',
      padding: '15px',
      margin: '12px 0',
      borderRadius: '12px',
      border: '1px solid #a3d5ff',
      fontSize: '16px',
      outline: 'none',
      boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
    },
    button: {
      width: '100%',
      padding: '15px',
      background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
      color: '#fff',
      border: 'none',
      borderRadius: '15px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
    },
    heading: {
      marginBottom: '30px',
      fontSize: '28px',
      fontWeight: '700',
      color: '#0072ff',
      textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
    },
    link: {
      marginTop: '18px',
      color: '#0072ff',
      cursor: 'pointer',
      textDecoration: 'underline',
      display: 'inline-block',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.pageBackground}>
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          required 
          style={styles.input}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input 
          type="email" 
          placeholder="Email" 
          required 
          style={styles.input}
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password" 
          required 
          style={styles.input}
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <select 
          value={formData.role} 
          onChange={(e) => setFormData({...formData, role: e.target.value})} 
          style={styles.select}
          required
        >
          <option value="" disabled>Select Role</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          <option value="admin">Admin</option>
        </select>
        
        {formData.role === 'doctor' && (
          <>
            <input 
              type="text" 
              placeholder="Specialization (e.g., Cardiology)" 
              required 
              style={styles.input}
              value={formData.specialization}
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Medical License Number" 
              required 
              style={styles.input}
              value={formData.medicalLicense}
              onChange={(e) => setFormData({...formData, medicalLicense: e.target.value})}
            />
          </>
        )}
        <button type="submit" style={styles.button}>Register</button>
      </form>
      
      {message.text && (
        <div style={{
          color: message.type === 'success' ? '#155724' : '#721c24',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          padding: '10px',
          margin: '15px 0',
          fontSize: '14px'
        }}>
          {message.text}
        </div>
      )}
      
      <div style={styles.link} onClick={() => navigate('/login')}>
        Already have an account? Login here
      </div>
      <div style={{...styles.link, marginTop: '10px'}} onClick={() => navigate('/')}>
        ← Back to Home
      </div>
    </div>
    </div>
  );
}

export default Register;