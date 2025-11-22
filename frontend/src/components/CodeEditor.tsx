import { useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { Play, Zap, Copy, Trash2 } from 'lucide-react';
import { useReviewStore } from '../store/reviewStore';

interface CodeEditorProps {
  onSubmit: () => void;
  isLoading: boolean;
  isStreaming: boolean;
}

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML' },
];

export const CodeEditor = ({ onSubmit, isLoading, isStreaming }: CodeEditorProps) => {
  const { currentCode, currentLanguage, setCode, setLanguage } = useReviewStore();
  const editorRef = useRef<any>(null);

  const handleEditorMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
  };

  const handleClearCode = () => {
    setCode('');
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <label className="font-medium text-gray-700">Language:</label>
          <select
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isLoading || isStreaming}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            disabled={!currentCode || isLoading || isStreaming}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Copy code"
          >
            <Copy size={20} />
          </button>
          <button
            onClick={handleClearCode}
            disabled={!currentCode || isLoading || isStreaming}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Clear code"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={onSubmit}
            disabled={!currentCode.trim() || isLoading || isStreaming}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isStreaming ? (
              <>
                <Zap size={18} className="animate-spin" />
                Reviewing...
              </>
            ) : (
              <>
                <Play size={18} />
                Review Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <Editor
          height="500px"
          language={currentLanguage}
          value={currentCode}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorMount}
          theme="vs-light"
          options={{
            minimap: { enabled: true },
            wordWrap: 'on',
            fontSize: 14,
            lineHeight: 1.6,
            padding: { top: 16, bottom: 16 },
            formatOnPaste: true,
            formatOnType: true,
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
          }}
        />
      </div>

      {/* Code stats */}
      {currentCode && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Lines of Code</p>
            <p className="text-2xl font-bold text-indigo-600">{currentCode.split('\n').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Characters</p>
            <p className="text-2xl font-bold text-indigo-600">{currentCode.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Language</p>
            <p className="text-2xl font-bold text-indigo-600">
              {LANGUAGE_OPTIONS.find((l) => l.value === currentLanguage)?.label}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-2xl font-bold text-green-600">Ready</p>
          </div>
        </div>
      )}
    </div>
  );
};
