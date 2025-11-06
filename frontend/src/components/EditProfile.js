import React, { useState } from 'react';
import { hospitalTheme } from '../theme/hospitalTheme';

function EditProfile({ profileData, onSave, onCancel }) {
  const [age, setAge] = useState(profileData.age || '');
  const [gender, setGender] = useState(profileData.gender || '');
  const [height, setHeight] = useState(profileData.height || '');
  const [weight, setWeight] = useState(profileData.weight || '');

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/patient/updateProfile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ age, gender, height, weight })
    });

    if (response.ok) {
      onSave({ age, gender, height, weight });
    } else {
      alert('Error updating profile');
    }
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
      <div style={{backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '350px', maxWidth: '90vw'}}>
        <h3 style={{color: hospitalTheme.colors.primary, textAlign: 'center', marginBottom: '20px'}}>Edit Profile</h3>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={{...hospitalTheme.components.input, width: '100%'}} min="1" max="120" />
        </div>

        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={{...hospitalTheme.components.input, width: '100%'}}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Height (cm)</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} style={{...hospitalTheme.components.input, width: '100%'}} min="50" max="250" />
        </div>

        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Weight (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} style={{...hospitalTheme.components.input, width: '100%'}} min="10" max="300" />
        </div>

        <div style={{display: 'flex', gap: '10px'}}>
          <button onClick={handleSave} style={{...hospitalTheme.components.button, flex: 1, padding: '10px'}}>Save</button>
          <button onClick={onCancel} style={{...hospitalTheme.components.button, flex: 1, padding: '10px', backgroundColor: hospitalTheme.colors.textLight}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;