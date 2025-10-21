import base64
import io
from openai import OpenAI
from models.config import settings


class TranscriptionService:
    """Service for handling audio transcription using OpenAI Whisper."""

    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)

    async def transcribe_audio(self, audio_data: str, language: str = "nl") -> str:
        """
        Transcribe audio data to text using OpenAI Whisper.

        Args:
            audio_data: Base64 encoded audio data
            language: Source language code (default: nl for Dutch)

        Returns:
            Transcribed text
        """
        try:
            # Decode base64 audio data
            audio_bytes = base64.b64decode(audio_data)

            # Create a file-like object from bytes
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = "audio.webm"  # Whisper needs a filename

            # Call Whisper API
            transcript = self.client.audio.transcriptions.create(
                model="whisper-1", file=audio_file, language=language, response_format="text"
            )

            return transcript

        except Exception as e:
            raise Exception(f"Transcription error: {str(e)}")

    async def transcribe_audio_stream(self, audio_file, language: str = "nl") -> str:
        """
        Transcribe audio file directly (for file uploads).

        Args:
            audio_file: Audio file object
            language: Source language code

        Returns:
            Transcribed text
        """
        try:
            transcript = self.client.audio.transcriptions.create(
                model="whisper-1", file=audio_file, language=language, response_format="text"
            )

            return transcript

        except Exception as e:
            raise Exception(f"Transcription error: {str(e)}")
