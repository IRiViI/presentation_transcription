from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from models.config import settings


class TranslationService:
    """Service for handling text translation using ChatGPT and LangChain."""

    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",  # Using GPT-4o-mini for cost-effectiveness
            temperature=0.3,  # Lower temperature for more consistent translations
            openai_api_key=settings.openai_api_key,
        )

        # Translation prompt template
        self.translation_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """You are a professional translator. Translate the following text from {source_language} to {target_language}.

Rules:
- Provide ONLY the translation, without any explanations or additional text
- Maintain the original meaning and context
- Use natural, fluent language in the target language
- Preserve formatting, punctuation, and emphasis where appropriate
- If the text contains technical terms, translate them appropriately for the context""",
                ),
                ("user", "{text}"),
            ]
        )

    async def translate_text(
        self, text: str, source_language: str = "Dutch", target_language: str = "Arabic"
    ) -> str:
        """
        Translate text from source language to target language.

        Args:
            text: Text to translate
            source_language: Source language name (e.g., "Dutch", "English")
            target_language: Target language name (e.g., "Arabic", "French")

        Returns:
            Translated text
        """
        try:
            # Create the translation chain
            chain = self.translation_prompt | self.llm

            # Execute translation
            result = chain.invoke(
                {
                    "source_language": source_language,
                    "target_language": target_language,
                    "text": text,
                }
            )

            return result.content.strip()

        except Exception as e:
            raise Exception(f"Translation error: {str(e)}")

    def get_language_name(self, language_code: str) -> str:
        """
        Convert language code to full language name.

        Args:
            language_code: ISO language code (e.g., "nl", "ar", "en")

        Returns:
            Full language name
        """
        language_map = {
            "nl": "Dutch",
            "ar": "Arabic",
            "en": "English",
            "fr": "French",
            "de": "German",
            "es": "Spanish",
            "it": "Italian",
            "tr": "Turkish",
            "pl": "Polish",
            "ru": "Russian",
            "zh": "Chinese",
            "ja": "Japanese",
            "ko": "Korean",
        }

        return language_map.get(language_code.lower(), language_code)
