import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      if (response.data.success) {
        setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', formData.role);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', response.data.userName || formData.email.split('@')[0]);
        
        setTimeout(() => {
          switch (formData.role) {
            case 'doctor': navigate('/doctordashboard'); break;
            case 'admin': navigate('/admindashboard'); break;
            default: navigate('/patientdashboard');
          }
        }, 1000);
      } else {
        setMessage({ text: response.data.msg || 'Login failed', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Server connection failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', backgroundImage: 'url(https://wallpaperaccess.com/full/958470.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'}}>
      <div style={{width: '400px', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.08)', backgroundColor: 'rgba(255, 255, 255, 0.98)', textAlign: 'center', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)'}}>
        
        <img src="https://cdn3.f-cdn.com/contestentries/2370502/69235584/65d555ab1ce53_thumb900.jpg" alt="MediSync Logo" style={{width: '90px', height: '90px', margin: '0 auto 25px', display: 'block', borderRadius: '50%', boxShadow: '0 8px 25px rgba(8, 145, 178, 0.3)'}} />
        <h2 style={{marginBottom: '25px', fontSize: '28px', background: 'linear-gradient(135deg, #0891b2, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700', letterSpacing: '-0.5px'}}>Welcome Back</h2>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
            disabled={loading}
            style={{width: '90%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', transition: 'all 0.3s ease', backgroundColor: 'rgba(248, 250, 252, 0.8)'}} 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
            disabled={loading}
            style={{width: '90%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', transition: 'all 0.3s ease', backgroundColor: 'rgba(248, 250, 252, 0.8)'}} 
          />
          
          <select 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})} 
            required
            disabled={loading}
            style={{width: '95%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', backgroundColor: 'rgba(248, 250, 252, 0.8)', transition: 'all 0.3s ease'}}
          >
            <option value="" disabled>Select Your Role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Administrator</option>
          </select>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{width: '100%', padding: '15px', background: loading ? '#6c757d' : 'linear-gradient(135deg, #0891b2, #06b6d4)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '15px', boxShadow: '0 8px 25px rgba(8, 145, 178, 0.3)', transition: 'all 0.3s ease'}}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
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
        
        <div style={{marginTop: '15px', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px'}} onClick={() => navigate('/register')}>
          Don't have an account? Register here
        </div>
      </div>
    </div>
  );
}

export default Login;