# Presentatie Vertaal Applicatie

Een real-time presentatie tool met automatische transcriptie, vertaling en text-to-speech functionaliteit. Perfect voor meertalige presentaties waarbij je spreekt in het Nederlands en de tekst automatisch wordt vertaald naar andere talen zoals Arabisch.

## 🎯 Functionaliteiten

- **PDF Presentatie Viewer**: Bekijk je PowerPoint/Google Slides als PDF met eenvoudige navigatie
- **Real-time Transcriptie**: Zet Nederlandse spraak om naar tekst met OpenAI Whisper
- **Automatische Vertaling**: Vertaal de tekst naar meerdere talen tegelijk met ChatGPT
- **Text-to-Speech**: Laat de vertaalde tekst automatisch voorlezen met ElevenLabs
- **Subtitle Overlay**: Toon vertalingen als ondertitels over je presentatie
- **Multi-taal Support**: Arabisch, Engels, Frans, Duits, Spaans, Italiaans, Turks, Pools, Russisch
- **Aanpasbare Instellingen**: Kies welke talen je wilt, pas lettergrootte aan, etc.

## 🏗️ Technologie Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Snelle development server
- **Zustand** - State management
- **React-PDF** - PDF rendering
- **Axios** - HTTP client

### Backend
- **Python 3.10+** - Backend runtime
- **FastAPI** - Modern web framework
- **OpenAI Whisper** - Speech-to-text (via API)
- **ChatGPT (GPT-4o-mini)** - Vertaling via LangChain
- **ElevenLabs** - Text-to-speech

## 📋 Vereisten

- **Node.js** 18+ en npm/yarn
- **Python** 3.10 of hoger
- **API Keys**:
  - OpenAI API key (voor Whisper en ChatGPT)
  - ElevenLabs API key (voor text-to-speech)

## 🚀 Installatie

### 1. Clone de Repository

```bash
git clone <repository-url>
cd presentation_transcription
```

### 2. Backend Setup

```bash
cd backend

# Maak een virtual environment aan
python -m venv venv

# Activeer de virtual environment
# Op Windows:
venv\Scripts\activate
# Op macOS/Linux:
source venv/bin/activate

# Installeer dependencies
pip install -r requirements.txt

# Kopieer .env.example naar .env
cp .env.example .env

# Bewerk .env en voeg je API keys toe
# OPENAI_API_KEY=your_openai_api_key_here
# ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### 3. Frontend Setup

```bash
cd ../frontend

# Installeer dependencies
npm install
```

## 🔑 API Keys Verkrijgen

### OpenAI API Key
1. Ga naar https://platform.openai.com/api-keys
2. Maak een account aan of log in
3. Klik op "Create new secret key"
4. Kopieer de key en plak in `.env` bestand

### ElevenLabs API Key
1. Ga naar https://elevenlabs.io
2. Maak een account aan of log in
3. Ga naar "Profile" → "API Keys"
4. Kopieer de key en plak in `.env` bestand

## 🏃 Applicatie Starten

### Start Backend Server

```bash
cd backend
# Zorg dat virtual environment actief is
python main.py
```

De backend draait nu op: http://localhost:8000
API documentatie: http://localhost:8000/docs

### Start Frontend Development Server

Open een nieuwe terminal:

```bash
cd frontend
npm run dev
```

De frontend draait nu op: http://localhost:5173

## 📖 Gebruik

### 1. PDF Uploaden
- Klik op "📄 Upload PDF" in het linker paneel
- Selecteer je presentatie PDF (export van PowerPoint of Google Slides)
- Navigeer met pijltjestoetsen of door te klikken

### 2. Instellingen Configureren
- Klik op ⚙️ (rechtsboven)
- Selecteer welke talen je wilt voor vertaling
- Pas instellingen aan zoals lettergrootte en auto-play TTS
- Sla op door het paneel te sluiten

### 3. Presentatie Geven
- Klik op "🎤 Start Opname"
- Begin met spreken in het Nederlands
- De tekst wordt:
  1. Automatisch getranscribeerd
  2. Vertaald naar geselecteerde talen
  3. Getoond als ondertitel
  4. Voorgelezen (indien ingeschakeld)

### 4. Audio Uploaden
- Als alternatief kun je een audio bestand uploaden
- Klik op "📁 Upload Audio"
- Selecteer je audio bestand

## 🎨 Sneltoetsen

- **→ (Pijl Rechts)** of **Spatie**: Volgende slide
- **← (Pijl Links)**: Vorige slide
- **Klik overal op scherm**: Volgende slide

## 🔧 Project Structuur

```
presentation_transcription/
├── backend/
│   ├── models/
│   │   ├── __init__.py          # Data models
│   │   └── config.py            # Configuration
│   ├── routes/
│   │   └── api.py               # API endpoints
│   ├── services/
│   │   ├── transcription_service.py  # Whisper integration
│   │   ├── translation_service.py    # ChatGPT translation
│   │   └── tts_service.py           # ElevenLabs TTS
│   ├── main.py                  # FastAPI app
│   ├── requirements.txt         # Python dependencies
│   └── .env.example            # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PDFViewer.tsx          # PDF display
│   │   │   ├── SubtitleOverlay.tsx    # Subtitle display
│   │   │   ├── ControlPanel.tsx       # Recording controls
│   │   │   ├── SettingsPanel.tsx      # Settings UI
│   │   │   └── SettingsButton.tsx     # Settings trigger
│   │   ├── services/
│   │   │   ├── api.ts                 # Backend API client
│   │   │   ├── audioService.ts        # Audio recording
│   │   │   └── store.ts               # State management
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript types
│   │   ├── styles/
│   │   │   └── index.css              # Global styles
│   │   ├── App.tsx                    # Main app component
│   │   └── main.tsx                   # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── README.md
```

## 🛠️ API Endpoints

### Backend API

- `POST /api/transcribe` - Transcribeer audio data naar tekst
- `POST /api/transcribe/file` - Transcribeer geüploade audio bestand
- `POST /api/translate` - Vertaal tekst van bron naar doel taal
- `POST /api/tts` - Converteer tekst naar spraak
- `GET /api/settings` - Haal beschikbare talen op
- `POST /api/settings/languages` - Update taal instellingen
- `GET /api/health` - Health check

API Documentatie: http://localhost:8000/docs (als server draait)

## 💡 Tips

### Beste Resultaten
- Gebruik een goede microfoon voor betere transcriptie
- Spreek duidelijk en niet te snel
- Gebruik korte zinnen voor betere vertaling
- Test je presentatie eerst zonder publiek

### Kosten Besparen
- Whisper API is zeer goedkoop (~$0.006 per minuut)
- GPT-4o-mini is kosteneffectief voor vertalingen
- ElevenLabs heeft een gratis tier (10,000 karakters/maand)
- Zet auto-play TTS uit als je het niet nodig hebt

### Performance
- Sluit andere toepassingen voor betere performance
- Gebruik Chrome of Edge voor beste compatibiliteit
- Zorg voor stabiele internetverbinding (API calls)

## 🐛 Troubleshooting

### "Kan microfoon niet openen"
- Controleer browser machtigingen voor microfoon
- Gebruik HTTPS of localhost (HTTP zonder S werkt niet voor microfoon)
- Probeer een andere browser

### "API Error"
- Controleer of API keys correct zijn in `.env`
- Controleer of backend server draait
- Bekijk de browser console voor details

### "PDF wordt niet weergegeven"
- Zorg dat je een PDF bestand upload (geen PPT/PPTX)
- Exporteer PowerPoint naar PDF via "Bestand" → "Exporteren" → "PDF maken"
- Voor Google Slides: "Bestand" → "Downloaden" → "PDF Document"

### "Vertaling duurt lang"
- Dit is normaal voor eerste request (API warm-up)
- Vertalingen zijn typisch 2-5 seconden
- Meerdere talen nemen proportioneel meer tijd

## 🔒 Beveiliging

- **NOOIT** commit je `.env` bestand met echte API keys
- Gebruik `.env.example` als template
- API keys blijven lokaal op je machine
- Alle API calls gaan direct naar OpenAI/ElevenLabs (niet via tussenserver)

## 📝 Licentie

Dit project is gemaakt voor persoonlijk gebruik.

## 🤝 Bijdragen

Dit is een persoonlijk project. Fork en pas aan naar eigen wens!

## 📧 Support

Bij problemen:
1. Check de troubleshooting sectie
2. Bekijk backend logs in terminal
3. Bekijk frontend console (F12 in browser)
4. Controleer API key configuratie

## 🎉 Veel Succes!

Succes met je meertalige presentaties! 🚀
