import axios, { AxiosInstance } from 'axios';
import { CodeReviewRequest, CodeReviewResult, StreamChunk } from '../types';

class APIClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
    });
  }

  async submitCodeReview(request: CodeReviewRequest): Promise<CodeReviewResult> {
    const response = await this.client.post<CodeReviewResult>('/api/review', request);
    return response.data;
  }

  async submitCodeReviewStream(
    request: CodeReviewRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(
        `${this.baseURL}/api/review/stream?code=${encodeURIComponent(request.code)}&language=${request.language}`
      );

      eventSource.onmessage = (event) => {
        try {
          const chunk: StreamChunk = JSON.parse(event.data);
          onChunk(chunk);

          if (chunk.type === 'complete') {
            eventSource.close();
            resolve();
          }
        } catch (error) {
          console.error('Failed to parse stream chunk:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Stream error:', error);
        eventSource.close();
        reject(error);
      };
    });
  }

  async getReviewHistory(limit: number = 20): Promise<any[]> {
    const response = await this.client.get('/api/reviews/history', { params: { limit } });
    return response.data;
  }

  async getProjectList(): Promise<any[]> {
    const response = await this.client.get('/api/projects');
    return response.data;
  }

  async createProject(name: string, description: string): Promise<any> {
    const response = await this.client.post('/api/projects', { name, description });
    return response.data;
  }

  async getProjectStats(): Promise<any> {
    const response = await this.client.get('/api/stats');
    return response.data;
  }
}

export const apiClient = new APIClient();
