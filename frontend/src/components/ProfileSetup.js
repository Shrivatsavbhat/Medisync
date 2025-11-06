import React, { useState } from 'react';
import { hospitalTheme } from '../theme/hospitalTheme';

function ProfileSetup({ onComplete }) {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!age || !gender || !height || !weight) {
      alert('Please fill in all fields');
      return;
    }

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/patient/updateProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ age, gender, height, weight })
    });

    if (response.ok) {
      onComplete();
    } else {
      alert('Error updating profile');
    }
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
      <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90vw'}}>
        <h2 style={{color: hospitalTheme.colors.primary, textAlign: 'center', marginBottom: '20px'}}>Complete Your Profile</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={{...hospitalTheme.components.input, width: '100%'}} min="1" max="120" />
          </div>

          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} style={{...hospitalTheme.components.input, width: '100%'}}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} style={{...hospitalTheme.components.input, width: '100%'}} min="50" max="250" />
          </div>

          <div style={{marginBottom: '25px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} style={{...hospitalTheme.components.input, width: '100%'}} min="10" max="300" />
          </div>

          <button type="submit" style={{...hospitalTheme.components.button, width: '100%', padding: '12px'}}>
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;