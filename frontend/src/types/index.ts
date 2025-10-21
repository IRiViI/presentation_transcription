export interface LanguageOption {
  code: string;
  name: string;
  enabled: boolean;
}

export interface TranscriptionResponse {
  text: string;
  language: string;
}

export interface TranslationResponse {
  original_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
}

export interface TTSResponse {
  audio_data: string;
  language: string;
}

export interface SettingsResponse {
  languages: LanguageOption[];
  default_source_language: string;
}

export interface SubtitleData {
  id: string;
  originalText: string;
  translatedText: string;
  timestamp: number;
  language: string;
}

export interface AppSettings {
  enabledLanguages: string[];
  sourceLanguage: string;
  autoPlayTTS: boolean;
  showOriginalText: boolean;
  fontSize: number;
}
