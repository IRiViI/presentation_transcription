from fastapi import APIRouter, HTTPException, UploadFile, File
from models import (
    TranscriptionRequest,
    TranslationRequest,
    TTSRequest,
    LanguageOption,
    SettingsResponse,
)
from services.transcription_service import TranscriptionService
from services.translation_service import TranslationService
from services.tts_service import TTSService
from typing import List

router = APIRouter()

# Initialize services
transcription_service = TranscriptionService()
translation_service = TranslationService()
tts_service = TTSService()

# Available languages configuration
AVAILABLE_LANGUAGES = [
    LanguageOption(code="ar", name="Arabic", enabled=True),
    LanguageOption(code="en", name="English", enabled=False),
    LanguageOption(code="fr", name="French", enabled=False),
    LanguageOption(code="de", name="German", enabled=False),
    LanguageOption(code="es", name="Spanish", enabled=False),
    LanguageOption(code="it", name="Italian", enabled=False),
    LanguageOption(code="tr", name="Turkish", enabled=False),
    LanguageOption(code="pl", name="Polish", enabled=False),
    LanguageOption(code="ru", name="Russian", enabled=False),
]


@router.post("/transcribe")
async def transcribe_audio(request: TranscriptionRequest):
    """
    Transcribe audio data to text.

    Args:
        request: TranscriptionRequest with audio data and language

    Returns:
        Dict with transcribed text
    """
    try:
        text = await transcription_service.transcribe_audio(
            request.audio_data, request.language
        )
        return {"text": text, "language": request.language}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/transcribe/file")
async def transcribe_audio_file(file: UploadFile = File(...), language: str = "nl"):
    """
    Transcribe uploaded audio file to text.

    Args:
        file: Audio file
        language: Source language code

    Returns:
        Dict with transcribed text
    """
    try:
        text = await transcription_service.transcribe_audio_stream(file.file, language)
        return {"text": text, "language": language}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/translate")
async def translate_text(request: TranslationRequest):
    """
    Translate text from source language to target language.

    Args:
        request: TranslationRequest with text and language codes

    Returns:
        Dict with translated text
    """
    try:
        source_lang_name = translation_service.get_language_name(request.source_language)
        target_lang_name = translation_service.get_language_name(request.target_language)

        translated_text = await translation_service.translate_text(
            request.text, source_lang_name, target_lang_name
        )

        return {
            "original_text": request.text,
            "translated_text": translated_text,
            "source_language": request.source_language,
            "target_language": request.target_language,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech.

    Args:
        request: TTSRequest with text, language, and optional voice_id

    Returns:
        Dict with base64 encoded audio data
    """
    try:
        audio_data = await tts_service.text_to_speech(
            request.text, request.language, request.voice_id
        )

        return {"audio_data": audio_data, "language": request.language}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/settings", response_model=SettingsResponse)
async def get_settings():
    """
    Get application settings including available languages.

    Returns:
        SettingsResponse with language options
    """
    return SettingsResponse(languages=AVAILABLE_LANGUAGES, default_source_language="nl")


@router.post("/settings/languages")
async def update_language_settings(languages: List[LanguageOption]):
    """
    Update enabled languages.

    Args:
        languages: List of language options with enabled status

    Returns:
        Updated language settings
    """
    global AVAILABLE_LANGUAGES
    AVAILABLE_LANGUAGES = languages
    return {"languages": AVAILABLE_LANGUAGES, "message": "Languages updated successfully"}


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Presentation Translation API is running"}
