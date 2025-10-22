# Dutch to Arabic Real-time Translation Demo

This demo uses the OpenAI Realtime API with WebRTC to provide real-time Dutch-to-Arabic translation.

## Flow

```
Dutch Audio (Microphone) → Dutch Text (Transcription) → Arabic Text (Translation)
```

## Features

- **Real-time Dutch Speech Recognition**: Speak in Dutch and see the transcription appear in real-time
- **Automatic Arabic Translation**: The transcribed Dutch text is automatically translated to Arabic
- **WebRTC Streaming**: Low-latency audio streaming using WebRTC
- **History**: View all previous translations in a scrollable history

## Setup

### Prerequisites

- OpenAI API key with access to the Realtime API
- Node.js (for frontend)
- Python 3.8+ (for backend)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a `.env` file from the example:
```bash
cp .env.example .env
```

3. Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_actual_openai_api_key_here
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Start the backend server:
```bash
python main.py
```

The backend will start on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. Open your browser to `http://localhost:5173`
2. The app will default to "Realtime Translator" mode
3. Click **"Start Recording"** to begin
4. Grant microphone permissions when prompted
5. Start speaking in Dutch
6. Watch as your Dutch speech is:
   - Transcribed to Dutch text (left panel)
   - Translated to Arabic text (right panel)
7. Click **"Stop Recording"** to end the session
8. View your translation history below the current translation

## How It Works

### Backend (`/api/realtime/session`)

The backend creates a WebRTC session with OpenAI's Realtime API:

1. Receives SDP (Session Description Protocol) from the browser
2. Configures the session with:
   - Input transcription model: `gpt-4o-transcribe` for Dutch (`nl`)
   - Output modality: Text only
   - Instructions: Translate Dutch to Arabic
   - Voice Activity Detection (VAD) for automatic turn detection
3. Forwards the configuration to OpenAI's `/v1/realtime/calls` endpoint
4. Returns the SDP answer to the browser

### Frontend (`RealtimeTranslator.tsx`)

The frontend manages the WebRTC connection:

1. Creates a WebRTC peer connection
2. Captures microphone audio (24kHz PCM mono)
3. Sends audio to OpenAI via WebRTC
4. Listens for server events via the data channel:
   - `conversation.item.input_audio_transcription.delta`: Incremental Dutch transcription
   - `conversation.item.input_audio_transcription.completed`: Final Dutch transcription
   - `response.text.delta`: Incremental Arabic translation
   - `response.text.done`: Final Arabic translation
5. Displays the results in real-time

## Configuration

### Change Target Language

To translate to a different language, edit `backend/routes/realtime.py`:

```python
"instructions": """You are a Dutch-to-[TARGET LANGUAGE] translator.

When you receive Dutch speech:
1. Listen carefully to the Dutch input
2. Translate it accurately to [TARGET LANGUAGE]
3. Respond ONLY with the [TARGET LANGUAGE] translation as text
...
"""
```

### Change Source Language

To transcribe a different source language, edit `backend/routes/realtime.py`:

```python
"transcription": {
    "model": "gpt-4o-transcribe",
    "language": "nl"  # Change to ISO-639-1 code (e.g., "en", "fr", "de")
}
```

### Adjust Voice Activity Detection

To modify when the system detects speech, edit the VAD settings in `backend/routes/realtime.py`:

```python
"turn_detection": {
    "type": "server_vad",
    "threshold": 0.5,              # Sensitivity (0.0-1.0)
    "prefix_padding_ms": 300,      # Audio before speech start
    "silence_duration_ms": 500     # Silence before turn end
}
```

## Troubleshooting

### "Failed to connect" Error

- Ensure your OpenAI API key is correctly set in `backend/.env`
- Verify the backend is running on `http://localhost:8000`
- Check the browser console for detailed error messages

### Microphone Not Working

- Grant microphone permissions in your browser
- Check that no other application is using the microphone
- Try using Chrome or Edge (best WebRTC support)

### No Translation Appearing

- Speak clearly in Dutch
- Wait for a pause (VAD needs silence to detect turn end)
- Check the browser console for server events
- Verify the backend logs for errors

### CORS Errors

- Ensure `CORS_ORIGINS` in `backend/.env` includes your frontend URL
- Default is `http://localhost:5173,http://localhost:3000`

## Switching Modes

The app includes two modes:

1. **Realtime Translator** (default): Dutch-to-Arabic real-time translation
2. **Presentation Mode**: The original presentation translation app

Click the toggle button in the top-right corner to switch between modes.

## API Reference

### Backend Endpoint

**POST** `/api/realtime/session`

- **Content-Type**: `application/sdp`
- **Body**: SDP offer from WebRTC peer connection
- **Response**: SDP answer for establishing the connection

### OpenAI Events Handled

- `conversation.item.input_audio_transcription.delta`: Incremental transcription
- `conversation.item.input_audio_transcription.completed`: Complete transcription
- `response.text.delta`: Incremental translation response
- `response.text.done`: Complete translation response
- `response.done`: Full response complete
- `error`: Error events from the server

## References

- [OpenAI Realtime API WebRTC Guide](https://platform.openai.com/docs/guides/realtime-webrtc)
- [OpenAI Realtime Transcription](https://platform.openai.com/docs/guides/realtime-transcription)
- [OpenAI Realtime Models & Prompting](https://platform.openai.com/docs/guides/realtime-models-prompting)
- [WebRTC API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
