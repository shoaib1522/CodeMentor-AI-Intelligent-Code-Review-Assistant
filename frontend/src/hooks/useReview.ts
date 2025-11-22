import { useCallback } from 'react';
import { apiClient } from '../services/api';
import { useReviewStore } from '../store/reviewStore';
import { CodeReviewRequest, ReviewHistory } from '../types';

export const useReview = () => {
  const {
    isLoading,
    isStreaming,
    currentCode,
    currentLanguage,
    currentResult,
    streamingProgress,
    error,
    setLoading,
    setStreaming,
    setStreamingProgress,
    setResult,
    setError,
    addToHistory,
    reset,
  } = useReviewStore();

  const submitReview = useCallback(
    async (code?: string, language?: string) => {
      const reviewCode = code || currentCode;
      const reviewLanguage = language || currentLanguage;

      if (!reviewCode.trim()) {
        setError('Please enter some code to review');
        return;
      }

      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const request: CodeReviewRequest = {
          code: reviewCode,
          language: reviewLanguage,
        };

        const result = await apiClient.submitCodeReview(request);
        setResult(result);

        // Add to history
        const historyItem: ReviewHistory = {
          id: result.id,
          fileName: `${reviewLanguage}_review`,
          timestamp: new Date().toISOString(),
          language: reviewLanguage,
          vulnerabilityCount: result.vulnerabilities.length,
          severity: result.vulnerabilities.length > 0 ? 'high' : 'none',
          score: result.overallScore,
        };
        addToHistory(historyItem);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to review code';
        setError(errorMessage);
        console.error('Review error:', err);
      } finally {
        setLoading(false);
      }
    },
    [currentCode, currentLanguage, setLoading, setError, setResult, addToHistory]
  );

  const submitReviewStream = useCallback(
    async (code?: string, language?: string) => {
      const reviewCode = code || currentCode;
      const reviewLanguage = language || currentLanguage;

      if (!reviewCode.trim()) {
        setError('Please enter some code to review');
        return;
      }

      setStreaming(true);
      setError(null);
      setResult(null);
      setStreamingProgress('Initializing review...');

      try {
        const request: CodeReviewRequest = {
          code: reviewCode,
          language: reviewLanguage,
        };

        await apiClient.submitCodeReviewStream(request, (chunk) => {
          switch (chunk.type) {
            case 'start':
              setStreamingProgress('Starting analysis...');
              break;
            case 'vulnerability':
              setStreamingProgress('Analyzing vulnerabilities...');
              break;
            case 'quality':
              setStreamingProgress('Checking code quality...');
              break;
            case 'suggestion':
              setStreamingProgress('Generating suggestions...');
              break;
            case 'summary':
              setStreamingProgress('Finalizing review...');
              break;
            case 'complete':
              if (chunk.data) {
                setResult(chunk.data as any);
                const historyItem: ReviewHistory = {
                  id: (chunk.data as any).id,
                  fileName: `${reviewLanguage}_review`,
                  timestamp: new Date().toISOString(),
                  language: reviewLanguage,
                  vulnerabilityCount: (chunk.data as any).vulnerabilities?.length || 0,
                  severity: (chunk.data as any).vulnerabilities?.length > 0 ? 'high' : 'none',
                  score: (chunk.data as any).overallScore || 0,
                };
                addToHistory(historyItem);
              }
              setStreamingProgress('Review complete!');
              break;
            case 'error':
              setError(chunk.message || 'An error occurred');
              break;
          }
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to review code';
        setError(errorMessage);
        console.error('Stream review error:', err);
      } finally {
        setStreaming(false);
        setTimeout(() => setStreamingProgress(''), 2000);
      }
    },
    [currentCode, currentLanguage, setStreaming, setError, setResult, setStreamingProgress, addToHistory]
  );

  return {
    isLoading,
    isStreaming,
    currentCode,
    currentLanguage,
    currentResult,
    streamingProgress,
    error,
    submitReview,
    submitReviewStream,
    reset,
  };
};
