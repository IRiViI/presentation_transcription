import React from 'react';

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => {
  return (
    <button style={styles.button} onClick={onClick} title="Instellingen">
      ⚙️
    </button>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: '#fff',
    fontSize: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    border: 'none',
    transition: 'all 0.2s ease',
  },
};

export default SettingsButton;
