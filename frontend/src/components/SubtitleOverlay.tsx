import React from 'react';
import { useAppStore } from '@/services/store';

const SubtitleOverlay: React.FC = () => {
  const { currentSubtitle, settings } = useAppStore();

  if (!currentSubtitle) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.subtitleBox}>
        {settings.showOriginalText && currentSubtitle.originalText && (
          <div style={styles.originalText}>{currentSubtitle.originalText}</div>
        )}

        {currentSubtitle.translatedText && (
          <div style={{ ...styles.translatedText, fontSize: settings.fontSize }}>
            {currentSubtitle.translatedText}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    pointerEvents: 'none',
    width: '90%',
    maxWidth: '1200px',
  },
  subtitleBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: '20px 30px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  originalText: {
    color: '#aaa',
    fontSize: '16px',
    marginBottom: '8px',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  translatedText: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: '1.4',
    direction: 'auto', // Auto-detect RTL for Arabic
  },
};

export default SubtitleOverlay;
