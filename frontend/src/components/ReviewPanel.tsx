import { AlertCircle, CheckCircle, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import { CodeReviewResult, Vulnerability } from '../types';

interface ReviewPanelProps {
  result: CodeReviewResult | null;
  isStreaming: boolean;
  streamingProgress: string;
  error: string | null;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-600' };
    case 'high':
      return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600' };
    case 'medium':
      return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-600' };
    case 'low':
      return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' };
    default:
      return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-600' };
  }
};

const SeverityIcon = ({ severity }: { severity: string }) => {
  const iconClass = 'w-5 h-5';
  switch (severity) {
    case 'critical':
      return <AlertCircle className={iconClass} />;
    case 'high':
      return <AlertTriangle className={iconClass} />;
    case 'medium':
      return <Info className={iconClass} />;
    case 'low':
      return <CheckCircle className={iconClass} />;
    default:
      return <CheckCircle className={iconClass} />;
  }
};

const VulnerabilityCard = ({ vuln }: { vuln: Vulnerability }) => {
  const colors = getSeverityColor(vuln.severity);

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 space-y-2`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={colors.icon}>
            <SeverityIcon severity={vuln.severity} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-semibold ${colors.text}`}>{vuln.type}</h4>
              <span className={`text-xs font-bold px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
                {vuln.severity.toUpperCase()}
              </span>
            </div>
            <p className={`text-sm ${colors.text} mt-1`}>{vuln.message}</p>
          </div>
        </div>
      </div>

      <div className={colors.text}>
        <p className="text-sm font-medium">Line {vuln.line}</p>
      </div>

      <div className="bg-white bg-opacity-50 rounded p-3 space-y-2">
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase">Description</p>
          <p className="text-sm text-gray-700">{vuln.description}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase">Recommendation</p>
          <p className="text-sm text-gray-700">{vuln.recommendation}</p>
        </div>
        {vuln.cwe && (
          <div>
            <p className="text-xs font-semibold text-gray-700">CWE: {vuln.cwe}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const ReviewPanel = ({ result, isStreaming, streamingProgress, error }: ReviewPanelProps) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (isStreaming) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-8 text-center">
        <div className="inline-block">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-spin opacity-30"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-indigo-900 mb-2">AI Code Review in Progress</h3>
        <p className="text-indigo-700 font-medium mb-4">{streamingProgress}</p>
        <div className="w-full bg-indigo-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <Code2Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Review Yet</h3>
        <p className="text-gray-600">Submit your code above to get started with an AI-powered review</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Code Review Summary</h3>
            <p className="text-indigo-100">Analysis completed in {result.analysisTime}ms</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{result.overallScore}</div>
            <p className="text-indigo-100">Overall Score</p>
          </div>
        </div>
        <p className="text-indigo-50 leading-relaxed">{result.summary}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Vulnerabilities</p>
          <p className="text-3xl font-bold text-red-600">{result.vulnerabilities.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Complexity</p>
          <p className="text-3xl font-bold text-orange-600">{result.codeQuality.complexity}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Maintainability</p>
          <p className="text-3xl font-bold text-green-600">{result.codeQuality.maintainability}%</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Duplication</p>
          <p className="text-3xl font-bold text-blue-600">{result.codeQuality.duplication}%</p>
        </div>
      </div>

      {/* Vulnerabilities */}
      {result.vulnerabilities.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Security Vulnerabilities ({result.vulnerabilities.length})
          </h4>
          <div className="space-y-3">
            {result.vulnerabilities.map((vuln) => (
              <VulnerabilityCard key={vuln.id} vuln={vuln} />
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Suggestions ({result.suggestions.length})
          </h4>
          <div className="space-y-2">
            {result.suggestions.map((sugg) => (
              <div key={sugg.id} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-indigo-900">{sugg.category}</h5>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    sugg.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : sugg.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {sugg.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-indigo-800 mb-2">{sugg.message}</p>
                <p className="text-sm text-indigo-700 bg-white bg-opacity-50 p-2 rounded">💡 {sugg.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Icon component
const Code2Icon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const Zap = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);
