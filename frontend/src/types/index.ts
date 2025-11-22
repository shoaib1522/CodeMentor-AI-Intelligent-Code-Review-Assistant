export interface CodeReviewRequest {
  code: string;
  language: string;
  projectId?: string;
  fileName?: string;
}

export interface CodeReviewResult {
  id: string;
  vulnerabilities: Vulnerability[];
  codeQuality: CodeQualityMetrics;
  suggestions: Suggestion[];
  summary: string;
  overallScore: number;
  analysisTime: number;
}

export interface Vulnerability {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  line: number;
  column?: number;
  message: string;
  description: string;
  recommendation: string;
  cwe?: string;
}

export interface CodeQualityMetrics {
  complexity: number;
  maintainability: number;
  coverage: number;
  duplication: number;
  issues: string[];
}

export interface Suggestion {
  id: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
  suggestion: string;
  line?: number;
}

export interface ReviewHistory {
  id: string;
  fileName: string;
  timestamp: string;
  language: string;
  vulnerabilityCount: number;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'none';
  score: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  reviewCount: number;
  averageScore: number;
}

export interface StreamChunk {
  type: 'start' | 'vulnerability' | 'quality' | 'suggestion' | 'summary' | 'complete' | 'error';
  data?: unknown;
  message?: string;
}
