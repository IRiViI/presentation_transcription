import React, { useRef, useState } from 'react';
import { useAppStore } from '@/services/store';
import { audioService } from '@/services/audioService';
import { api } from '@/services/api';

interface ControlPanelProps {
  onTranscription: (text: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onTranscription }) => {
  const { isRecording, isPaused, setIsRecording, setIsPaused, setPdfUrl } =
    useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleStartRecording = async () => {
    try {
      await audioService.initialize();
      audioService.startRecording();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Kan microfoon niet openen. Controleer de machtigingen.');
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsProcessing(true);
      const audioBlob = await audioService.stopRecording();
      setIsRecording(false);

      // Convert to base64 and transcribe
      const base64Audio = await audioService.blobToBase64(audioBlob);
      const result = await api.transcribeAudio(base64Audio, 'nl');

      onTranscription(result.text);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      alert('Fout bij het verwerken van audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      audioService.resumeRecording();
      setIsPaused(false);
    } else {
      audioService.pauseRecording();
      setIsPaused(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const result = await api.transcribeAudioFile(file, 'nl');
      onTranscription(result.text);
    } catch (error) {
      console.error('Failed to transcribe file:', error);
      alert('Fout bij het verwerken van audiobestand');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPdfUrl(url);

    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>PDF Presentatie</h3>
        <button
          style={styles.button}
          onClick={() => pdfInputRef.current?.click()}
        >
          📄 Upload PDF
        </button>
        <input
          ref={pdfInputRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={handlePdfUpload}
        />
      </div>

      <div style={styles.divider} />

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Audio Transcriptie</h3>

        {!isRecording ? (
          <>
            <button
              style={{ ...styles.button, ...styles.recordButton }}
              onClick={handleStartRecording}
              disabled={isProcessing}
            >
              🎤 Start Opname
            </button>

            <button
              style={styles.button}
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              📁 Upload Audio
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </>
        ) : (
          <div style={styles.recordingControls}>
            <button
              style={{ ...styles.button, ...styles.pauseButton }}
              onClick={handlePauseResume}
            >
              {isPaused ? '▶️ Hervat' : '⏸️ Pauzeer'}
            </button>

            <button
              style={{ ...styles.button, ...styles.stopButton }}
              onClick={handleStopRecording}
            >
              ⏹️ Stop
            </button>

            <div style={styles.recordingIndicator} className="pulse">
              🔴 Opname bezig...
            </div>
          </div>
        )}

        {isProcessing && (
          <div style={styles.processingIndicator}>Verwerken...</div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: '20px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    minWidth: '280px',
  },
  section: {
    marginBottom: '15px',
  },
  sectionTitle: {
    fontSize: '14px',
    color: '#aaa',
    marginBottom: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  button: {
    backgroundColor: '#4a4a4a',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    width: '100%',
    marginBottom: '8px',
    fontWeight: '500',
  },
  recordButton: {
    backgroundColor: '#e74c3c',
  },
  pauseButton: {
    backgroundColor: '#f39c12',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
  },
  recordingControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  recordingIndicator: {
    color: '#e74c3c',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '8px',
    fontWeight: '600',
  },
  processingIndicator: {
    color: '#3498db',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '8px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#333',
    margin: '15px 0',
  },
};

export default ControlPanel;
