import React from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalTheme } from '../theme/hospitalTheme';

function Home() {
  const navigate = useNavigate();

  const styles = {
    pageContainer: {
      ...hospitalTheme.layout.pageContainer,
      textAlign: 'center'
    },
    
    header: {
      backgroundColor: hospitalTheme.colors.surface,
      padding: '20px 0',
      boxShadow: '0 2px 10px rgba(44, 90, 160, 0.1)',
      marginBottom: '50px'
    },
    
    logo: {
      width: '100px',
      height: '100px',
      margin: '0 auto 20px'
    },
    
    title: {
      fontSize: '3rem',
      color: hospitalTheme.colors.primary,
      fontWeight: '700',
      margin: '20px 0'
    },
    
    subtitle: {
      fontSize: '1.2rem',
      color: hospitalTheme.colors.textLight,
      margin: '0 0 40px 0'
    },
    
    heroSection: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 20px'
    },
    
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      margin: '50px 0',
      padding: '0 20px'
    },
    
    featureCard: {
      ...hospitalTheme.components.card,
      textAlign: 'center',
      padding: '30px 20px'
    },
    
    featureIcon: {
      fontSize: '3rem',
      marginBottom: '15px'
    },
    
    featureTitle: {
      fontSize: '1.3rem',
      color: hospitalTheme.colors.text,
      fontWeight: '600',
      marginBottom: '10px'
    },
    
    featureDesc: {
      color: hospitalTheme.colors.textLight,
      lineHeight: '1.6'
    },
    
    ctaSection: {
      backgroundColor: hospitalTheme.colors.surface,
      padding: '50px 20px',
      margin: '50px 0 0 0'
    },
    
    ctaButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    
    button: {
      ...hospitalTheme.components.button,
      padding: '15px 30px',
      fontSize: '18px',
      minWidth: '150px'
    },
    
    secondaryButton: {
      ...hospitalTheme.components.button,
      backgroundColor: hospitalTheme.colors.secondary,
      padding: '15px 30px',
      fontSize: '18px',
      minWidth: '150px'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <img 
          src={hospitalTheme.logo.src} 
          alt="MediSync Logo" 
          style={styles.logo}
        />
        <h1 style={styles.title}>MediSync</h1>
        <p style={styles.subtitle}>Your Digital Healthcare Companion</p>
      </header>

      <div style={styles.heroSection}>
        <h2 style={{fontSize: '2.5rem', color: hospitalTheme.colors.text, marginBottom: '20px'}}>
          Revolutionizing Healthcare Management
        </h2>
        <p style={{fontSize: '1.1rem', color: hospitalTheme.colors.textLight, lineHeight: '1.8'}}>
          MediSync connects patients, doctors, and administrators in a seamless digital healthcare ecosystem. 
          Manage medical records, track medications, and communicate securely - all in one platform.
        </p>
      </div>

      <div style={styles.featuresGrid}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>👥</div>
          <h3 style={styles.featureTitle}>For Patients</h3>
          <p style={styles.featureDesc}>
            Manage your health records, track medications, and communicate with healthcare providers securely.
          </p>
        </div>
        
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>👨‍⚕️</div>
          <h3 style={styles.featureTitle}>For Doctors</h3>
          <p style={styles.featureDesc}>
            Access patient records, manage prescriptions, and provide better care with comprehensive health data.
          </p>
        </div>
        
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>⚙️</div>
          <h3 style={styles.featureTitle}>For Administrators</h3>
          <p style={styles.featureDesc}>
            Oversee system operations, manage users, and ensure compliance with healthcare regulations.
          </p>
        </div>
      </div>

      <div style={styles.ctaSection}>
        <h2 style={{fontSize: '2rem', color: hospitalTheme.colors.text, marginBottom: '30px'}}>
          Get Started Today
        </h2>
        <div style={styles.ctaButtons}>
          <button 
            style={styles.button}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            style={styles.secondaryButton}
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;