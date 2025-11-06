import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function MedicationReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchTodayReminders();
    
    // Setup Socket.IO connection
    const socket = io('http://localhost:5000');
    
    socket.on('reminder', (dueReminders) => {
      const userEmail = localStorage.getItem('userEmail');
      const userReminders = dueReminders.filter(r => r.patientEmail === userEmail);
      
      if (userReminders.length > 0) {
        userReminders.forEach(reminder => {
          const notificationText = `💊 ${reminder.medicationName || reminder.medicineName} (${reminder.dosage}) - ${reminder.time.toUpperCase()} dose`;
          
        
          if (Notification.permission === 'granted') {
            new Notification('💊 Medication Reminder', {
              body: notificationText,
              icon: '/favicon.ico',
              requireInteraction: true
            });
          }
          
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.play().catch(() => {}); 
          } catch (e) {}
          
          // Add to notifications list
          setNotifications(prev => [{
            id: Date.now() + Math.random(),
            text: notificationText,
            time: new Date().toLocaleTimeString(),
            isNew: true
          }, ...prev.slice(0, 4)]); // Keep only last 5
        });
        
        // Refresh reminders to update status
        fetchTodayReminders();
      }
    });
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    return () => socket.disconnect();
  }, []);

  const fetchTodayReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/patient/getTodayReminders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (response.ok) {
        setReminders(result);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReminderStatus = async (reminderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/patient/updateReminder/${reminderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchTodayReminders(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const getTimeIcon = (time) => {
    switch(time) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'night': return '🌙';
      default: return '💊';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Taken': return '#28a745';
      case 'Missed': return '#dc3545';
      default: return '#ffc107';
    }
  };

  const containerStyle = {
    maxWidth: '850px',
    margin: '2rem auto',
    padding: '2.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(8, 145, 178, 0.12)',
    border: '1px solid rgba(8, 145, 178, 0.08)'
  };

  const reminderCardStyle = {
    backgroundColor: '#f8fafc',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '18px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.2s ease'
  };

  const buttonStyle = {
    padding: '10px 18px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 6px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  if (loading) {
    return <div style={containerStyle}>Loading reminders...</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={{fontSize: '1.8rem', fontWeight: '600', color: '#0891b2', marginBottom: '1.5rem', textAlign: 'center'}}>⏰ Today's Medication Reminders</h2>
      
      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div style={{
          backgroundColor: '#f0fdfa',
          padding: '18px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #0891b2',
          boxShadow: '0 2px 8px rgba(8, 145, 178, 0.08)'
        }}>
          <h4 style={{margin: '0 0 12px 0', color: '#0891b2', fontSize: '1.1rem', fontWeight: '600'}}>🔔 Recent Notifications</h4>
          {notifications.map(notification => (
            <div key={notification.id} style={{
              padding: '10px',
              borderBottom: '1px solid #bbdefb',
              fontSize: '14px',
              backgroundColor: notification.isNew ? '#fff3cd' : 'transparent',
              borderRadius: '4px',
              margin: '5px 0'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span><strong>{notification.time}:</strong> {notification.text}</span>
                {notification.isNew && <span style={{color: '#856404', fontSize: '12px'}}>NEW</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {reminders.length === 0 ? (
        <p style={{textAlign: 'center', color: '#666'}}>No medication reminders for today.</p>
      ) : (
        reminders.map(reminder => (
          <div key={reminder._id} style={reminderCardStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <h4 style={{margin: '0 0 10px 0'}}>
                  {getTimeIcon(reminder.time)} {reminder.medicineName || reminder.medicationName}
                </h4>
                <p style={{margin: '5px 0', color: '#666'}}>
                  <strong>Dosage:</strong> {reminder.dosage}
                </p>
                <p style={{margin: '5px 0', color: '#666'}}>
                  <strong>Time:</strong> {reminder.time} ({new Date(reminder.date).toLocaleTimeString()})
                </p>
                <p style={{margin: '5px 0', color: '#666'}}>
                  <strong>Medication:</strong> {reminder.medicineName || reminder.medicationName}
                </p>
                <p style={{margin: '5px 0', color: getStatusColor(reminder.status), fontWeight: 'bold'}}>
                  Status: {reminder.status}
                </p>
              </div>
              
              {reminder.status === 'Pending' && (() => {
                const now = new Date();
                const scheduledTime = new Date(reminder.date);
                const canUpdate = now >= scheduledTime;
                
                return (
                  <div>
                    {canUpdate ? (
                      <>
                        <button 
                          style={{...buttonStyle, backgroundColor: '#28a745', color: 'white'}}
                          onClick={() => updateReminderStatus(reminder._id, 'Taken')}
                        >
                          ✅ Taken
                        </button>
                        <button 
                          style={{...buttonStyle, backgroundColor: '#dc3545', color: 'white'}}
                          onClick={() => updateReminderStatus(reminder._id, 'Missed')}
                        >
                          ❌ Missed
                        </button>
                      </>
                    ) : (
                      <span style={{color: '#6c757d', fontSize: '12px'}}>
                        Available at {scheduledTime.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        ))
      )}
      
      <button 
        onClick={fetchTodayReminders}
        style={{
          ...buttonStyle, 
          backgroundColor: '#007bff', 
          color: 'white', 
          marginTop: '20px',
          width: '100%'
        }}
      >
        🔄 Refresh Reminders
      </button>
    </div>
  );
}

export default MedicationReminders;