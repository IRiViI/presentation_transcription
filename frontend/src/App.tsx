import React, { useState, useEffect } from 'react';
import PDFViewer from '@/components/PDFViewer';
import SubtitleOverlay from '@/components/SubtitleOverlay';
import ControlPanel from '@/components/ControlPanel';
import SettingsPanel from '@/components/SettingsPanel';
import SettingsButton from '@/components/SettingsButton';
import { useAppStore } from '@/services/store';
import { api } from '@/services/api';
import { audioService } from '@/services/audioService';
import { SubtitleData } from '@/types';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, addSubtitle, setCurrentSubtitle } = useAppStore();

  useEffect(() => {
    // Cleanup audio service on unmount
    return () => {
      audioService.cleanup();
    };
  }, []);

  const handleTranscription = async (originalText: string) => {
    if (!originalText.trim()) {
      return;
    }

    console.log('Transcribed:', originalText);

    // Process each enabled language
    for (const languageCode of settings.enabledLanguages) {
      try {
        // Translate text
        const translation = await api.translateText(
          originalText,
          settings.sourceLanguage,
          languageCode
        );

        const subtitle: SubtitleData = {
          id: Date.now().toString() + '-' + languageCode,
          originalText: originalText,
          translatedText: translation.translated_text,
          timestamp: Date.now(),
          language: languageCode,
        };

        // Add to history
        addSubtitle(subtitle);

        // Display current subtitle
        setCurrentSubtitle(subtitle);

        // Auto-hide subtitle after 5 seconds
        setTimeout(() => {
          setCurrentSubtitle(null);
        }, 5000);

        // Text-to-speech if enabled
        if (settings.autoPlayTTS) {
          try {
            const ttsResult = await api.textToSpeech(
              translation.translated_text,
              languageCode
            );

            // Play audio
            await audioService.playAudio(ttsResult.audio_data);
          } catch (error) {
            console.error('TTS error:', error);
          }
        }
      } catch (error) {
        console.error(`Translation error for ${languageCode}:`, error);
      }
    }
  };

  return (
    <div style={styles.app}>
      <PDFViewer />
      <SubtitleOverlay />
      <ControlPanel onTranscription={handleTranscription} />
      <SettingsButton onClick={() => setIsSettingsOpen(true)} />
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
  },
};

export default App;
