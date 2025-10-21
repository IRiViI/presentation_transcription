# 🚀 Quick Start Guide

## Snelle Setup (5 minuten)

### 1. API Keys Verkrijgen

**OpenAI**: https://platform.openai.com/api-keys
- Maak account → "Create new secret key" → Kopieer key

**ElevenLabs**: https://elevenlabs.io
- Maak account → Profile → API Keys → Kopieer key

### 2. Installatie

```bash
# Backend
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# ✏️ Bewerk .env en voeg je API keys toe!

# Frontend (nieuwe terminal)
cd frontend
npm install
```

### 3. Starten

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Openen

Browser: http://localhost:5173

### 5. Gebruiken

1. Klik ⚙️ → Selecteer talen (bijv. Arabisch) → Sluit
2. Klik 📄 Upload PDF → Selecteer je presentatie
3. Klik 🎤 Start Opname → Begin met spreken!

## ✅ Checklist

- [ ] Python 3.10+ geïnstalleerd
- [ ] Node.js 18+ geïnstalleerd
- [ ] OpenAI API key verkregen
- [ ] ElevenLabs API key verkregen
- [ ] Backend dependencies geïnstalleerd
- [ ] Frontend dependencies geïnstalleerd
- [ ] `.env` bestand aangemaakt met keys
- [ ] Backend server draait (http://localhost:8000)
- [ ] Frontend draait (http://localhost:5173)

## 🎯 Test Setup

1. Ga naar http://localhost:5173
2. Klik op instellingen (⚙️)
3. Als je talen ziet → Setup werkt! ✅

## 💰 Kosten Indicatie

- **Whisper**: ~€0.006 per minuut spraak
- **GPT-4o-mini**: ~€0.0001 per vertaling
- **ElevenLabs**: GRATIS tot 10,000 karakters/maand

**Voorbeeld**: 30 min presentatie met Arabische vertaling ≈ €0.20

## ❗ Problemen?

### Microfoon werkt niet
→ Geef browser toegang tot microfoon (popup)

### API Error
→ Check `.env` bestand: zijn keys correct?

### PDF laadt niet
→ Export PowerPoint/Slides eerst naar PDF

### "Module not found"
→ Zorg dat je in juiste folder bent:
  - Backend: `cd backend`
  - Frontend: `cd frontend`

## 📚 Meer Info

Zie README.md voor volledige documentatie.

---

**Klaar om te beginnen? Start met stap 1! 🎉**
