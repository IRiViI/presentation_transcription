from elevenlabs.client import ElevenLabs
from models.config import settings
import base64


class TTSService:
    """Service for handling text-to-speech using ElevenLabs."""

    def __init__(self):
        self.client = ElevenLabs(api_key=settings.elevenlabs_api_key)

        # Default voice IDs for different languages
        # You can customize these with specific ElevenLabs voice IDs
        self.default_voices = {
            "ar": "pNInz6obpgDQGcFmaJgB",  # Adam - works well for Arabic
            "en": "21m00Tcm4TlvDq8ikWAM",  # Rachel
            "nl": "pNInz6obpgDQGcFmaJgB",  # Adam - works for Dutch
            "fr": "pNInz6obpgDQGcFmaJgB",  # Adam
            "de": "pNInz6obpgDQGcFmaJgB",  # Adam
            "es": "pNInz6obpgDQGcFmaJgB",  # Adam
        }

    async def text_to_speech(
        self, text: str, language: str = "ar", voice_id: str = None
    ) -> str:
        """
        Convert text to speech using ElevenLabs.

        Args:
            text: Text to convert to speech
            language: Language code for voice selection
            voice_id: Optional specific voice ID to use

        Returns:
            Base64 encoded audio data
        """
        try:
            # Use provided voice_id or get default for language
            selected_voice_id = voice_id or self.default_voices.get(
                language, self.default_voices["en"]
            )

            # Generate audio using ElevenLabs new API
            audio_generator = self.client.generate(
                text=text,
                voice=selected_voice_id,
                model="eleven_multilingual_v2",  # Supports multiple languages including Arabic
                voice_settings={
                    "stability": 0.5,
                    "similarity_boost": 0.75,
                    "style": 0.0,
                    "use_speaker_boost": True,
                },
            )

            # Collect audio chunks
            audio_bytes = b"".join(audio_generator)

            # Convert audio bytes to base64
            audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")

            return audio_base64

        except Exception as e:
            raise Exception(f"Text-to-speech error: {str(e)}")

    def get_available_voices(self) -> dict:
        """
        Get available voice IDs for different languages.

        Returns:
            Dictionary of language codes and their voice IDs
        """
        return self.default_voices
