// Utility script to help replace alert() calls with notification system
// This is a reference for manual replacement

const alertReplacements = {
  // Success messages
  'successfully': 'showSuccess',
  'Success': 'showSuccess',
  'added successfully': 'showSuccess',
  'created successfully': 'showSuccess',
  'updated successfully': 'showSuccess',
  'sent successfully': 'showSuccess',
  
  // Error messages
  'Error': 'showError',
  'Failed': 'showError',
  'error': 'showError',
  'Server error': 'showError',
  
  // Warning messages
  'Please': 'showWarning',
  'must be': 'showWarning',
  'required': 'showWarning'
};

// Import pattern to add to components:
// import { useNotification } from './NotificationSystem';

// Hook usage pattern:
// const { showSuccess, showError, showWarning, showInfo } = useNotification();

// Replacement patterns:
// alert('Success message') → showSuccess('Success message')
// alert('Error message') → showError('Error message')
// alert('Warning message') → showWarning('Warning message')
// alert('Info message') → showInfo('Info message')

export default alertReplacements;