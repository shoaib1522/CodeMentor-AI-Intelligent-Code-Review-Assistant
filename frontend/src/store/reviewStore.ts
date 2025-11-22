import { create } from 'zustand';
import { CodeReviewResult, ReviewHistory, StreamChunk } from '../types';

interface ReviewState {
  isLoading: boolean;
  isStreaming: boolean;
  currentCode: string;
  currentLanguage: string;
  currentResult: CodeReviewResult | null;
  streamingProgress: string;
  error: string | null;
  history: ReviewHistory[];

  // Actions
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setStreamingProgress: (progress: string) => void;
  setResult: (result: CodeReviewResult | null) => void;
  setError: (error: string | null) => void;
  setHistory: (history: ReviewHistory[]) => void;
  addToHistory: (item: ReviewHistory) => void;
  reset: () => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  isLoading: false,
  isStreaming: false,
  currentCode: '',
  currentLanguage: 'javascript',
  currentResult: null,
  streamingProgress: '',
  error: null,
  history: [],

  setCode: (code) => set({ currentCode: code }),
  setLanguage: (language) => set({ currentLanguage: language }),
  setLoading: (loading) => set({ isLoading: loading }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setStreamingProgress: (progress) => set({ streamingProgress: progress }),
  setResult: (result) => set({ currentResult: result }),
  setError: (error) => set({ error }),
  setHistory: (history) => set({ history }),
  addToHistory: (item) => set((state) => ({ history: [item, ...state.history] })),
  reset: () =>
    set({
      currentCode: '',
      currentResult: null,
      streamingProgress: '',
      error: null,
      isStreaming: false,
    }),
}));
