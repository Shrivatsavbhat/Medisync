import React, { useState, useEffect } from 'react';

function MedicationTimeline() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReminders();
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/patient/getReminders?date=${selectedDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) setReminders(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Taken': { bg: '#0891b2', icon: '✅' },
      'Missed': { bg: '#ef4444', icon: '❌' },
      'Pending': { bg: '#f59e0b', icon: '⏳' }
    };
    const color = colors[status] || colors['Pending'];
    return (
      <span style={{padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: color.bg, color: '#fff'}}>
        {color.icon} {status}
      </span>
    );
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading...</div>;

  return (
    <div style={{maxWidth: '850px', margin: '2rem auto', padding: '2.5rem', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 8px 32px rgba(8, 145, 178, 0.12)', border: '1px solid rgba(8, 145, 178, 0.08)'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px'}}>
        <h2 style={{fontSize: '1.8rem', fontWeight: '600', color: '#0891b2', margin: 0}}>📅 Medication History</h2>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: '#f8fafc'}} />
      </div>

      {reminders.length === 0 ? (
        <p style={{textAlign: 'center', color: '#666', padding: '40px'}}>No medications for this date.</p>
      ) : (
        <>
          {reminders.map(reminder => (
            <div key={reminder._id} style={{padding: '20px', marginBottom: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease'}}>
              <div>
                <h4 style={{margin: '0 0 4px 0'}}>{reminder.medicineName}</h4>
                <p style={{margin: 0, color: '#666', fontSize: '14px'}}>{reminder.dosage} • {reminder.time} • {new Date(reminder.date).toLocaleTimeString()}</p>
              </div>
              {getStatusBadge(reminder.status)}
            </div>
          ))}
          <div style={{marginTop: '24px', padding: '16px', backgroundColor: '#f0fdfa', borderRadius: '8px', display: 'flex', gap: '20px'}}>
            <span>✅ Taken: {reminders.filter(r => r.status === 'Taken').length}</span>
            <span>❌ Missed: {reminders.filter(r => r.status === 'Missed').length}</span>
            <span>⏳ Pending: {reminders.filter(r => r.status === 'Pending').length}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default MedicationTimeline;