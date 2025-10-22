from fastapi import APIRouter, Request, Response, HTTPException
from models.config import settings
import httpx
import json

router = APIRouter()


@router.post("/session")
async def create_realtime_session(request: Request):
    """
    Create a WebRTC session with OpenAI Realtime API for Dutch-to-Arabic translation.
    Receives SDP from client and returns SDP from OpenAI.
    """
    try:
        # Get SDP from client
        sdp = await request.body()
        sdp_text = sdp.decode('utf-8')

        # Configure session for Dutch transcription and Arabic translation
        session_config = {
            "type": "realtime",
            "model": "gpt-realtime",
            "output_modalities": ["text"],  # Text only output (no audio response)
            "audio": {
                "input": {
                    "format": {
                        "type": "audio/pcm",
                        "rate": 24000
                    },
                    "transcription": {
                        "model": "gpt-4o-transcribe",
                        "language": "nl"  # Dutch language code
                    },
                    "turn_detection": {
                        "type": "server_vad",
                        "threshold": 0.5,
                        "prefix_padding_ms": 300,
                        "silence_duration_ms": 500
                    }
                }
            },
            "instructions": """You are a Dutch-to-Arabic translator.

When you receive Dutch speech:
1. Listen carefully to the Dutch input
2. Translate it accurately to Modern Standard Arabic
3. Respond ONLY with the Arabic translation as text
4. Do not add explanations or comments
5. Maintain the meaning and tone of the original Dutch text

Always respond in Arabic text only."""
        }

        # Create multipart form data
        async with httpx.AsyncClient(timeout=30.0) as client:
            files = {
                'sdp': (None, sdp_text, 'application/sdp'),
                'session': (None, json.dumps(session_config), 'application/json')
            }

            response = await client.post(
                "https://api.openai.com/v1/realtime/calls",
                files=files,
                headers={
                    "Authorization": f"Bearer {settings.openai_api_key}"
                }
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"OpenAI API error: {response.text}"
                )

            # Return SDP response to client
            return Response(
                content=response.text,
                media_type="application/sdp"
            )

    except Exception as e:
        print(f"Session creation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")
