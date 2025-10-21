import axios from 'axios';
import {
  TranscriptionResponse,
  TranslationResponse,
  TTSResponse,
  SettingsResponse,
  LanguageOption,
} from '@/types';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  /**
   * Transcribe audio data to text
   */
  transcribeAudio: async (
    audioData: string,
    language: string = 'nl'
  ): Promise<TranscriptionResponse> => {
    const response = await apiClient.post<TranscriptionResponse>('/transcribe', {
      audio_data: audioData,
      language,
    });
    return response.data;
  },

  /**
   * Transcribe uploaded audio file
   */
  transcribeAudioFile: async (
    file: File,
    language: string = 'nl'
  ): Promise<TranscriptionResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<TranscriptionResponse>(
      `/transcribe/file?language=${language}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Translate text from source to target language
   */
  translateText: async (
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TranslationResponse> => {
    const response = await apiClient.post<TranslationResponse>('/translate', {
      text,
      source_language: sourceLanguage,
      target_language: targetLanguage,
    });
    return response.data;
  },

  /**
   * Convert text to speech
   */
  textToSpeech: async (
    text: string,
    language: string,
    voiceId?: string
  ): Promise<TTSResponse> => {
    const response = await apiClient.post<TTSResponse>('/tts', {
      text,
      language,
      voice_id: voiceId,
    });
    return response.data;
  },

  /**
   * Get application settings
   */
  getSettings: async (): Promise<SettingsResponse> => {
    const response = await apiClient.get<SettingsResponse>('/settings');
    return response.data;
  },

  /**
   * Update language settings
   */
  updateLanguageSettings: async (
    languages: LanguageOption[]
  ): Promise<{ languages: LanguageOption[]; message: string }> => {
    const response = await apiClient.post('/settings/languages', languages);
    return response.data;
  },

  /**
   * Health check
   */
  healthCheck: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};
