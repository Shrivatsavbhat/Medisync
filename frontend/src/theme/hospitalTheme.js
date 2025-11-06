export const hospitalTheme = {
  logo: {
    src: 'https://cdn3.f-cdn.com/contestentries/2370502/69235584/65d555ab1ce53_thumb900.jpg',
    style: {
      width: '60px',
      height: '60px',
      margin: '0 10px 0 0',
      display: 'inline-block'
    }
  },
  colors: {
    primary: '#0891b2',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    background: '#f0fdfa',
    surface: '#ffffff',
    text: '#0f172a',
    textLight: '#64748b',
    border: '#e2e8f0'
  },
  
  layout: {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    pageContainer: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }
  },
  
  components: {
    button: {
      backgroundColor: '#2c5aa0',
      color: '#ffffff',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #dee2e6',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease'
    },
    
    card: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      border: '1px solid #e9ecef'
    }
  }
};