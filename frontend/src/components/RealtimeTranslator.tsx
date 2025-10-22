import React, { useState, useRef, useEffect } from 'react';

interface TranscriptionItem {
  id: string;
  dutch: string;
  arabic: string;
  timestamp: number;
}

const RealtimeTranslator: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentDutch, setCurrentDutch] = useState('');
  const [currentArabic, setCurrentArabic] = useState('');
  const [transcriptions, setTranscriptions] = useState<TranscriptionItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const currentItemIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      disconnect();
    };
  }, []);

  const connect = async () => {
    try {
      setError(null);

      // Create peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Set up to play remote audio from the model (though we're using text output)
      audioElementRef.current = document.createElement('audio');
      audioElementRef.current.autoplay = true;
      pc.ontrack = (e) => {
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = e.streams[0];
        }
      };

      // Add local audio track for microphone input
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 24000,
        },
      });
      pc.addTrack(ms.getTracks()[0]);

      // Set up data channel for sending and receiving events
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      // Listen for server events
      dc.addEventListener('message', (e) => {
        const event = JSON.parse(e.data);
        handleServerEvent(event);
      });

      dc.addEventListener('open', () => {
        console.log('Data channel opened');
        setIsConnected(true);
        setIsRecording(true);
      });

      dc.addEventListener('close', () => {
        console.log('Data channel closed');
        setIsConnected(false);
        setIsRecording(false);
      });

      dc.addEventListener('error', (e) => {
        console.error('Data channel error:', e);
        setError('Data channel error occurred');
      });

      // Start the session using the Session Description Protocol (SDP)
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send SDP to our backend server
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const sdpResponse = await fetch(`${backendUrl}/api/realtime/session`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`Failed to create session: ${sdpResponse.statusText}`);
      }

      const answerSdp = await sdpResponse.text();
      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: answerSdp,
      };
      await pc.setRemoteDescription(answer);

      console.log('Connected to OpenAI Realtime API');
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      disconnect();
    }
  };

  const disconnect = () => {
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
    }
    setIsConnected(false);
    setIsRecording(false);
  };

  const handleServerEvent = (event: any) => {
    console.log('Server event:', event);

    switch (event.type) {
      case 'conversation.item.input_audio_transcription.delta':
        // Incremental Dutch transcription
        setCurrentDutch((prev) => prev + event.delta);
        currentItemIdRef.current = event.item_id;
        break;

      case 'conversation.item.input_audio_transcription.completed':
        // Final Dutch transcription
        setCurrentDutch(event.transcript);
        currentItemIdRef.current = event.item_id;
        break;

      case 'response.text.delta':
        // Incremental Arabic translation
        setCurrentArabic((prev) => prev + event.delta);
        break;

      case 'response.text.done':
        // Final Arabic translation
        setCurrentArabic(event.text);
        break;

      case 'response.done':
        // Response is complete, save to history
        if (currentDutch.trim() && currentArabic.trim()) {
          const newItem: TranscriptionItem = {
            id: Date.now().toString(),
            dutch: currentDutch.trim(),
            arabic: currentArabic.trim(),
            timestamp: Date.now(),
          };
          setTranscriptions((prev) => [newItem, ...prev]);
        }
        // Reset current text
        setCurrentDutch('');
        setCurrentArabic('');
        currentItemIdRef.current = null;
        break;

      case 'error':
        console.error('Server error:', event);
        setError(event.error?.message || 'Unknown error occurred');
        break;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dutch to Arabic Real-time Translator</h1>
        <p style={styles.subtitle}>Speak in Dutch and see the Arabic translation in real-time</p>
      </div>

      <div style={styles.controls}>
        {!isConnected ? (
          <button onClick={connect} style={styles.connectButton}>
            Start Recording
          </button>
        ) : (
          <button onClick={disconnect} style={styles.disconnectButton}>
            Stop Recording
          </button>
        )}
        {isRecording && (
          <div style={styles.recordingIndicator}>
            <span style={styles.recordingDot}></span>
            Recording...
          </div>
        )}
      </div>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={styles.currentSection}>
        <div style={styles.currentBox}>
          <h3 style={styles.boxTitle}>Dutch (Current)</h3>
          <p style={styles.currentText}>
            {currentDutch || <span style={styles.placeholder}>Listening...</span>}
          </p>
        </div>

        <div style={styles.arrow}>→</div>

        <div style={styles.currentBox}>
          <h3 style={styles.boxTitle}>Arabic (Translation)</h3>
          <p style={{ ...styles.currentText, direction: 'rtl', textAlign: 'right' }}>
            {currentArabic || <span style={styles.placeholder}>Waiting for translation...</span>}
          </p>
        </div>
      </div>

      <div style={styles.historySection}>
        <h3 style={styles.historyTitle}>Translation History</h3>
        <div style={styles.historyList}>
          {transcriptions.length === 0 ? (
            <p style={styles.emptyHistory}>No translations yet. Start speaking in Dutch!</p>
          ) : (
            transcriptions.map((item) => (
              <div key={item.id} style={styles.historyItem}>
                <div style={styles.historyItemRow}>
                  <div style={styles.historyItemLabel}>Dutch:</div>
                  <div style={styles.historyItemText}>{item.dutch}</div>
                </div>
                <div style={styles.historyItemRow}>
                  <div style={styles.historyItemLabel}>Arabic:</div>
                  <div style={{ ...styles.historyItemText, direction: 'rtl', textAlign: 'right' }}>
                    {item.arabic}
                  </div>
                </div>
                <div style={styles.historyItemTime}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  connectButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#10a37f',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  disconnectButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  recordingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#ef4444',
    fontWeight: 'bold',
  },
  recordingDot: {
    width: '10px',
    height: '10px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
    animation: 'pulse 1.5s infinite',
  },
  error: {
    padding: '12px',
    marginBottom: '20px',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    color: '#c00',
  },
  currentSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '40px',
  },
  currentBox: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    minHeight: '150px',
  },
  boxTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: '12px',
    textTransform: 'uppercase',
  },
  currentText: {
    fontSize: '18px',
    color: '#1a1a1a',
    lineHeight: '1.6',
    minHeight: '80px',
  },
  placeholder: {
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  arrow: {
    fontSize: '32px',
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  historySection: {
    marginTop: '40px',
  },
  historyTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '16px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#9ca3af',
    fontStyle: 'italic',
    padding: '40px',
  },
  historyItem: {
    padding: '16px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  historyItemRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
  },
  historyItemLabel: {
    fontWeight: 'bold',
    color: '#6b7280',
    minWidth: '60px',
  },
  historyItemText: {
    flex: 1,
    color: '#1a1a1a',
    lineHeight: '1.5',
  },
  historyItemTime: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '8px',
    textAlign: 'right',
  },
};

export default RealtimeTranslator;
