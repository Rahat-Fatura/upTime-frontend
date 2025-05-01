export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 1000,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
};

export const formContainerStyle = {
  p: 4,
  overflowY: 'auto',
  maxHeight: 'calc(90vh - 120px)',
};

export const buttonContainerStyle = {
  p: 2,
  borderTop: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 1,
};

export const formSectionStyle = {
  backgroundColor: '#f8f9fa',
  borderRadius: 2,
  p: 3,
  mb: 5,
  border: '1px solid',
  borderColor: 'divider',
};

export const sectionTitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  mb: 2,
  color: '#1976d2',
  fontWeight: 'bold',
};

export const stepIndicatorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 2,
  color: '#1976d2',
  fontWeight: 'bold',
  fontSize: '0.875rem',
};

export const stepNumberStyle = {
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: '#1976d2',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 'bold',
}; 