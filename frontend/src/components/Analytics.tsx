import { TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { ReviewHistory } from '../types';

interface AnalyticsProps {
  history: ReviewHistory[];
}

export const Analytics = ({ history }: AnalyticsProps) => {
  if (history.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Analytics Data</h3>
        <p className="text-gray-600">Submit your first code review to see analytics</p>
      </div>
    );
  }

  // Calculate statistics
  const totalReviews = history.length;
  const totalVulnerabilities = history.reduce((sum, item) => sum + item.vulnerabilityCount, 0);
  const averageScore = Math.round(history.reduce((sum, item) => sum + item.score, 0) / history.length);
  const criticalCount = history.filter((item) => item.severity === 'critical').length;

  // Language distribution
  const languageDistribution = history.reduce(
    (acc, item) => {
      acc[item.language] = (acc[item.language] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Severity distribution
  const severityDistribution = history.reduce(
    (acc, item) => {
      acc[item.severity] = (acc[item.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const maxLanguageCount = Math.max(...Object.values(languageDistribution));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Reviews</p>
              <p className="text-4xl font-bold">{totalReviews}</p>
            </div>
            <Zap className="w-12 h-12 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Issues</p>
              <p className="text-4xl font-bold">{totalVulnerabilities}</p>
            </div>
            <AlertTriangle className="w-12 h-12 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Average Score</p>
              <p className="text-4xl font-bold">{averageScore}%</p>
            </div>
            <CheckCircle className="w-12 h-12 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Critical Issues</p>
              <p className="text-4xl font-bold">{criticalCount}</p>
            </div>
            <TrendingUp className="w-12 h-12 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Language Distribution</h3>
          <div className="space-y-4">
            {Object.entries(languageDistribution).map(([language, count]) => (
              <div key={language}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{language}</span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${(count / maxLanguageCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Severity Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                  Critical
                </span>
                <span className="text-sm font-bold text-gray-900">{severityDistribution['critical'] || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${((severityDistribution['critical'] || 0) / totalReviews) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
                  High
                </span>
                <span className="text-sm font-bold text-gray-900">{severityDistribution['high'] || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${((severityDistribution['high'] || 0) / totalReviews) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-600 rounded-full"></span>
                  Medium
                </span>
                <span className="text-sm font-bold text-gray-900">{severityDistribution['medium'] || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${((severityDistribution['medium'] || 0) / totalReviews) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                  Low
                </span>
                <span className="text-sm font-bold text-gray-900">{severityDistribution['low'] || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${((severityDistribution['low'] || 0) / totalReviews) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                  None
                </span>
                <span className="text-sm font-bold text-gray-900">{severityDistribution['none'] || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${((severityDistribution['none'] || 0) / totalReviews) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Trend */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Score Trend</h3>
        <div className="space-y-2">
          {history.slice(-5).reverse().map((item, index) => (
            <div key={item.id} className="flex items-center gap-4">
              <span className="text-sm text-gray-600 min-w-24">{item.fileName}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    item.score >= 80
                      ? 'bg-green-600'
                      : item.score >= 60
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900 min-w-12">{item.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
