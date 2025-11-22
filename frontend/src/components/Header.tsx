import { Code2, Zap, BarChart3 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'editor' | 'history' | 'stats';
  onTabChange: (tab: 'editor' | 'history' | 'stats') => void;
}

export const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Code2 size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CodeMentor AI</h1>
              <p className="text-indigo-100 text-sm">Intelligent Code Review Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-lg">
            <Zap size={20} className="text-yellow-300" />
            <span className="text-sm font-medium">Powered by Groq</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-t border-white border-opacity-20 pt-4">
          <button
            onClick={() => onTabChange('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'editor'
                ? 'bg-white text-indigo-600 shadow-lg'
                : 'text-white hover:bg-white hover:bg-opacity-10'
            }`}
          >
            <Code2 size={18} />
            Code Editor
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white text-indigo-600 shadow-lg'
                : 'text-white hover:bg-white hover:bg-opacity-10'
            }`}
          >
            <BarChart3 size={18} />
            History
          </button>
          <button
            onClick={() => onTabChange('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-white text-indigo-600 shadow-lg'
                : 'text-white hover:bg-white hover:bg-opacity-10'
            }`}
          >
            <BarChart3 size={18} />
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
