import { create } from 'zustand';
import { SubtitleData, LanguageOption, AppSettings } from '@/types';

interface AppState {
  // PDF state
  pdfUrl: string | null;
  currentPage: number;
  totalPages: number;

  // Subtitle state
  subtitles: SubtitleData[];
  currentSubtitle: SubtitleData | null;

  // Recording state
  isRecording: boolean;
  isPaused: boolean;

  // Settings
  settings: AppSettings;
  availableLanguages: LanguageOption[];

  // Actions
  setPdfUrl: (url: string) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  nextPage: () => void;
  previousPage: () => void;

  addSubtitle: (subtitle: SubtitleData) => void;
  setCurrentSubtitle: (subtitle: SubtitleData | null) => void;
  clearSubtitles: () => void;

  setIsRecording: (isRecording: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;

  updateSettings: (settings: Partial<AppSettings>) => void;
  setAvailableLanguages: (languages: LanguageOption[]) => void;
  toggleLanguage: (languageCode: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  pdfUrl: null,
  currentPage: 1,
  totalPages: 0,

  subtitles: [],
  currentSubtitle: null,

  isRecording: false,
  isPaused: false,

  settings: {
    enabledLanguages: ['ar'],
    sourceLanguage: 'nl',
    autoPlayTTS: true,
    showOriginalText: true,
    fontSize: 24,
  },

  availableLanguages: [],

  // PDF actions
  setPdfUrl: (url) => set({ pdfUrl: url }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),

  nextPage: () =>
    set((state) => ({
      currentPage: Math.min(state.currentPage + 1, state.totalPages),
    })),

  previousPage: () =>
    set((state) => ({
      currentPage: Math.max(state.currentPage - 1, 1),
    })),

  // Subtitle actions
  addSubtitle: (subtitle) =>
    set((state) => ({
      subtitles: [...state.subtitles, subtitle],
    })),

  setCurrentSubtitle: (subtitle) => set({ currentSubtitle: subtitle }),

  clearSubtitles: () => set({ subtitles: [], currentSubtitle: null }),

  // Recording actions
  setIsRecording: (isRecording) => set({ isRecording }),
  setIsPaused: (isPaused) => set({ isPaused }),

  // Settings actions
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  setAvailableLanguages: (languages) => set({ availableLanguages: languages }),

  toggleLanguage: (languageCode) =>
    set((state) => ({
      availableLanguages: state.availableLanguages.map((lang) =>
        lang.code === languageCode ? { ...lang, enabled: !lang.enabled } : lang
      ),
      settings: {
        ...state.settings,
        enabledLanguages: state.availableLanguages
          .map((lang) =>
            lang.code === languageCode
              ? { ...lang, enabled: !lang.enabled }
              : lang
          )
          .filter((lang) => lang.enabled)
          .map((lang) => lang.code),
      },
    })),
}));
