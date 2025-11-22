import { useState } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { ReviewPanel } from './components/ReviewPanel';
import { History } from './components/History';
import { Analytics } from './components/Analytics';
import { useReview } from './hooks/useReview';
import { useReviewStore } from './store/reviewStore';

type TabType = 'editor' | 'history' | 'stats';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('editor');

  const {
    isLoading,
    isStreaming,
    currentResult,
    streamingProgress,
    error,
    submitReview,
    submitReviewStream,
  } = useReview();

  const { history } = useReviewStore();

  const handleReview = async () => {
    // Use streaming review for real-time feedback
    await submitReviewStream();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Editor Tab */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Editor */}
            <div>
              <CodeEditor
                onSubmit={handleReview}
                isLoading={isLoading}
                isStreaming={isStreaming}
              />
            </div>

            {/* Review Results */}
            <div>
              <div className="sticky top-8">
                <ReviewPanel
                  result={currentResult}
                  isStreaming={isStreaming}
                  streamingProgress={streamingProgress}
                  error={error}
                />
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && <History items={history} />}

        {/* Analytics Tab */}
        {activeTab === 'stats' && <Analytics history={history} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">CodeMentor AI</h3>
              <p className="text-gray-400">
                Intelligent code review assistant powered by AI and advanced code analysis.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Real-time Code Review</a></li>
                <li><a href="#" className="hover:text-white transition">Vulnerability Detection</a></li>
                <li><a href="#" className="hover:text-white transition">Code Quality Metrics</a></li>
                <li><a href="#" className="hover:text-white transition">Analytics Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Tech Stack</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Groq API (gpt-oss-20b)</li>
                <li>FastAPI Backend</li>
                <li>MongoDB Database</li>
                <li>React 18 Frontend</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CodeMentor AI. Built with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
