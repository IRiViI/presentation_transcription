import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/services/store';
import { api } from '@/services/api';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    availableLanguages,
    updateSettings,
    setAvailableLanguages,
    toggleLanguage,
  } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await api.getSettings();
      setAvailableLanguages(result.languages);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageToggle = async (languageCode: string) => {
    toggleLanguage(languageCode);

    // Update backend
    try {
      const updatedLanguages = availableLanguages.map((lang) =>
        lang.code === languageCode ? { ...lang, enabled: !lang.enabled } : lang
      );
      await api.updateLanguageSettings(updatedLanguages);
    } catch (error) {
      console.error('Failed to update language settings:', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Instellingen</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.content}>
          {/* Language Selection */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Vertaal Talen</h3>
            <p style={styles.description}>
              Selecteer de talen waarnaar je wilt vertalen
            </p>

            {loading ? (
              <div style={styles.loading}>Laden...</div>
            ) : (
              <div style={styles.languageList}>
                {availableLanguages.map((lang) => (
                  <div key={lang.code} style={styles.languageItem}>
                    <label style={styles.label}>
                      <input
                        type="checkbox"
                        checked={lang.enabled}
                        onChange={() => handleLanguageToggle(lang.code)}
                        style={styles.checkbox}
                      />
                      <span style={styles.languageName}>
                        {lang.name} ({lang.code.toUpperCase()})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Display Options */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Weergave Opties</h3>

            <div style={styles.option}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={settings.showOriginalText}
                  onChange={(e) =>
                    updateSettings({ showOriginalText: e.target.checked })
                  }
                  style={styles.checkbox}
                />
                <span>Toon originele tekst</span>
              </label>
            </div>

            <div style={styles.option}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={settings.autoPlayTTS}
                  onChange={(e) =>
                    updateSettings({ autoPlayTTS: e.target.checked })
                  }
                  style={styles.checkbox}
                />
                <span>Automatisch voorlezen</span>
              </label>
            </div>

            <div style={styles.option}>
              <label style={styles.labelBlock}>
                <span>Lettergrootte</span>
                <input
                  type="range"
                  min="16"
                  max="48"
                  value={settings.fontSize}
                  onChange={(e) =>
                    updateSettings({ fontSize: parseInt(e.target.value) })
                  }
                  style={styles.slider}
                />
                <span style={styles.sliderValue}>{settings.fontSize}px</span>
              </label>
            </div>
          </section>

          {/* Source Language */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Bron Taal</h3>
            <select
              value={settings.sourceLanguage}
              onChange={(e) => updateSettings({ sourceLanguage: e.target.value })}
              style={styles.select}
            >
              <option value="nl">Nederlands</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
            </select>
          </section>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(5px)',
  },
  panel: {
    backgroundColor: '#2a2a2a',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #3a3a3a',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    backgroundColor: 'transparent',
    color: '#888',
    fontSize: '24px',
    padding: '4px 12px',
    cursor: 'pointer',
    borderRadius: '8px',
  },
  content: {
    padding: '24px',
    overflowY: 'auto',
    maxHeight: 'calc(80vh - 80px)',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '8px',
  },
  description: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '16px',
  },
  languageList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
  },
  languageItem: {
    backgroundColor: '#3a3a3a',
    padding: '12px',
    borderRadius: '8px',
  },
  option: {
    backgroundColor: '#3a3a3a',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  labelBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    color: '#fff',
    fontSize: '14px',
  },
  languageName: {
    fontSize: '14px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  select: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3a3a3a',
    color: '#fff',
    border: '1px solid #4a4a4a',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
  },
  sliderValue: {
    color: '#888',
    fontSize: '12px',
  },
  loading: {
    color: '#888',
    textAlign: 'center',
    padding: '20px',
  },
};

export default SettingsPanel;
