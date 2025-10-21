from pydantic import BaseModel
from typing import Optional, List


class TranscriptionRequest(BaseModel):
    """Request model for audio transcription."""

    audio_data: str  # Base64 encoded audio
    language: str = "nl"  # Default Dutch


class TranslationRequest(BaseModel):
    """Request model for text translation."""

    text: str
    source_language: str = "nl"
    target_language: str


class TTSRequest(BaseModel):
    """Request model for text-to-speech."""

    text: str
    language: str
    voice_id: Optional[str] = None


class LanguageOption(BaseModel):
    """Language option model."""

    code: str
    name: str
    enabled: bool = False


class SettingsResponse(BaseModel):
    """Settings response model."""

    languages: List[LanguageOption]
    default_source_language: str = "nl"
