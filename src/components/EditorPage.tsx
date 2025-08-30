import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CodeEditor from './CodeEditor';
import CompilerOutput from './CompilerOutput';
import FileExplorer from './FileExplorer';
import { judge0Service } from '../services/judge0';
import { 
  Code2, 
  Play, 
  Save, 
  Settings, 
  ArrowLeft,
  FileText,
  Terminal,
  Folder,
  AlertCircle,
  Key,
  Plus
} from 'lucide-react';

const EditorPage: React.FC = () => {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(14);

  const [wordWrap, setWordWrap] = useState<boolean>(false);
  const [lineNumbers, setLineNumbers] = useState<boolean>(true);
  const [codeSuggestions, setCodeSuggestions] = useState<boolean>(true);
  const languageNames: Record<string, string> = {
    javascript: 'JavaScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    kotlin: 'Kotlin'
  };

  // Default code is now just a comment
  const defaultCode: Record<string, string> = {
    javascript: '// Welcome to JavaScript editor',
    python: '# Welcome to Python editor',
    java: '// Welcome to Java editor',
    cpp: '// Welcome to C++ editor',
    c: '// Welcome to C editor',
    kotlin: '// Welcome to Kotlin editor',
    default: '// Welcome to editor',
  };

  // File state: { name: string, code: string }
  const initialFileName = (() => {
    if (language === 'cpp') return 'main.cpp';
    if (language === 'javascript') return 'main.js';
    if (language === 'python') return 'main.py';
    if (language === 'java') return 'main.java';
    if (language === 'c') return 'main.c';
    if (language === 'kotlin') return 'main.kt';
    return 'main.txt';
  })();
  const initialCode = defaultCode[language || 'default'] || defaultCode.default;
  const [files, setFiles] = useState<{ name: string; code: string }[]>([
    { name: initialFileName, code: initialCode }
  ]);
  const [currentFile, setCurrentFile] = useState<string>(initialFileName);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    if (language && defaultCode[language]) {
      setFiles(prev => prev.map(f => f.name === initialFileName ? { ...f, code: defaultCode[language] } : f));
    }
  }, [language]);

  const handleRunCode = async () => {
    if (!files.find(f => f.name === currentFile)?.code.trim()) {
      setOutput('❌ Error: No code to execute');
      return;
    }

    setIsRunning(true);
    setOutput('🔄 Compiling and executing code...\n');

    try {
      const result = await judge0Service.submitCode(language!, files.find(f => f.name === currentFile)?.code || '');
      setOutput(result);
    } catch (error) {
      console.error('Compilation error:', error);
      
      // Check if it's an API key issue
      if (error instanceof Error && error.message.includes('API configuration')) {
        setOutput(`❌ API Configuration Error: ${error.message}\n\n💡 To use real compilation, you need to:\n1. Get a Judge0 API key from RapidAPI\n2. Add it to your environment variables\n\nFalling back to demo mode...`);
        
        // Fall back to simulation after a delay
        setTimeout(async () => {
          try {
            const simulatedResult = await judge0Service.simulateExecution(language!, files.find(f => f.name === currentFile)?.code || '');
            setOutput(simulatedResult + '\n\n⚠️  This is simulated output. Configure Judge0 API for real compilation.');
          } catch (simError) {
            setOutput('❌ Failed to execute code');
          }
        }, 1000);
      } else {
        setOutput(`❌ Execution Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const currentLanguageName = language ? languageNames[language] || language : 'Unknown';

  // Get code for current file
  const code = files.find(f => f.name === currentFile)?.code || '';
  const setCode = (newCode: string) => {
    setFiles(prev => prev.map(f => f.name === currentFile ? { ...f, code: newCode } : f));
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <Code2 className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-white">{currentLanguageName} Editor</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-md bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors text-white"
          >
            <Play className="h-4 w-4" />
            <span className="text-sm">{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
          
                     <button 
             onClick={() => {
               const currentFileData = files.find(f => f.name === currentFile);
               if (currentFileData) {
                 const blob = new Blob([currentFileData.code], { type: 'text/plain' });
                 const url = URL.createObjectURL(blob);
                 const a = document.createElement('a');
                 a.href = url;
                 a.download = currentFileData.name;
                 document.body.appendChild(a);
                 a.click();
                 document.body.removeChild(a);
                 URL.revokeObjectURL(url);
               }
             }}
             className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
           >
             <Save className="h-4 w-4" />
             <span className="text-sm">Save</span>
           </button>
          
          <button 
            onClick={() => setShowApiKeyModal(true)}
            className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
            title="API Configuration"
          >
            <Key className="h-4 w-4" />
          </button>
          
                     <button 
             onClick={() => setShowSettingsModal(true)}
             className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
             title="Settings"
           >
             <Settings className="h-4 w-4" />
           </button>
          <button
            onClick={() => setShowNewFileModal(true)}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 transition-colors text-white ml-2"
            title="Create New File"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">New File</span>
          </button>
        </div>
      </header>

      {/* API Key Configuration Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">API Configuration</h3>
            </div>
            
            <div className="space-y-4 text-sm text-gray-300">
              <p>To enable real code compilation, you need a Judge0 API key:</p>
              
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Visit <a href="https://rapidapi.com/judge0-official/api/judge0-ce" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">RapidAPI Judge0</a></li>
                <li>Subscribe to the free tier</li>
                <li>Copy your API key</li>
                <li>Add <code className="bg-gray-700 px-1 rounded">VITE_JUDGE0_API_KEY=your_key_here</code> to your .env file</li>
              </ol>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 mt-4">
                <p className="text-yellow-300 text-xs">
                  <strong>Note:</strong> Without an API key, the editor will use simulated output for demonstration purposes.
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
             )}

       {/* Settings Modal */}
       {showSettingsModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
             <div className="flex items-center space-x-2 mb-4">
               <Settings className="h-5 w-5 text-blue-400" />
               <h3 className="text-lg font-semibold text-white">Settings</h3>
             </div>
             
             <div className="space-y-4 text-sm text-gray-300">
               {/* Font Size */}
               <div>
                 <label className="block text-sm font-medium mb-2">Font Size: {fontSize}px</label>
                 <input
                   type="range"
                   min="10"
                   max="24"
                   value={fontSize}
                   onChange={(e) => setFontSize(Number(e.target.value))}
                   className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                 />
               </div>

               

               {/* Word Wrap */}
               <div className="flex items-center justify-between">
                 <label className="text-sm font-medium">Word Wrap</label>
                 <input
                   type="checkbox"
                   checked={wordWrap}
                   onChange={(e) => setWordWrap(e.target.checked)}
                   className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                 />
               </div>

               {/* Line Numbers */}
               <div className="flex items-center justify-between">
                 <label className="text-sm font-medium">Line Numbers</label>
                 <input
                   type="checkbox"
                   checked={lineNumbers}
                   onChange={(e) => setLineNumbers(e.target.checked)}
                   className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                 />
               </div>

               {/* Code Suggestions */}
               <div className="flex items-center justify-between">
                 <label className="text-sm font-medium">Code Suggestions</label>
                 <input
                   type="checkbox"
                   checked={codeSuggestions}
                   onChange={(e) => setCodeSuggestions(e.target.checked)}
                   className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                 />
               </div>
             </div>
             
             <button
               onClick={() => setShowSettingsModal(false)}
               className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
             >
               Close
             </button>
           </div>
         </div>
       )}

       {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-xs w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Create New File</h3>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter file name (e.g. utils.js)"
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewFileModal(false)}
                className="px-3 py-1 rounded bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const trimmed = newFileName.trim();
                  if (trimmed && !files.some(f => f.name === trimmed)) {
                    setFiles(prev => [...prev, { name: trimmed, code: defaultCode[language || 'default'] || defaultCode.default }]);
                    setCurrentFile(trimmed);
                    setShowNewFileModal(false);
                    setNewFileName('');
                  }
                }}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar file list */}
        <div className="w-48 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="h-10 flex items-center px-4 border-b border-gray-700 text-xs font-bold text-gray-300 uppercase tracking-wide">Files</div>
          <div className="flex-1 overflow-auto">
            {files.map(file => (
              <div
                key={file.name}
                className={`px-4 py-2 cursor-pointer text-sm flex items-center justify-between ${file.name === currentFile ? 'bg-blue-500/20 text-white font-medium' : 'text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setCurrentFile(file.name)}
              >
                <span className="truncate">{file.name}</span>
                {file.name === currentFile && <span className="ml-2 text-xs text-blue-400">●</span>}
              </div>
            ))}
          </div>
        </div>
        {/* Editor and Output */}
        <div className="flex-1 flex flex-col">
          <PanelGroup direction="vertical">
            {/* Code Editor */}
                         <Panel defaultSize={70} minSize={30}>
               <div className="h-full bg-gray-900 flex flex-col">
                 <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 flex-shrink-0">
                   <div className="flex items-center space-x-2">
                     <FileText className="h-4 w-4 text-blue-400" />
                     <span className="text-sm text-gray-300">{currentFile}</span>
                   </div>
                   <div className="text-xs text-gray-500">{language?.toUpperCase()}</div>
                 </div>
                 <div className="flex-1 overflow-hidden">
                                                            <CodeEditor
                       language={language || 'javascript'}
                       value={code}
                       onChange={setCode}
                       fontSize={fontSize}
                       wordWrap={wordWrap}
                       lineNumbers={lineNumbers}
                       codeSuggestions={codeSuggestions}
                     />
                 </div>
               </div>
             </Panel>
            <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-gray-600 transition-colors" />
            {/* Output Terminal */}
                         <Panel defaultSize={30} minSize={20}>
               <div className="h-full bg-gray-900 flex flex-col">
                 <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 flex-shrink-0">
                   <div className="flex items-center space-x-2">
                     <Terminal className="h-4 w-4 text-green-400" />
                     <span className="text-sm text-gray-300">Output</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     {isRunning && (
                       <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                     )}
                     <span className="text-xs text-gray-500">{isRunning ? 'Running' : 'Ready'}</span>
                   </div>
                 </div>
                 <div className="flex-1 overflow-hidden">
                   <CompilerOutput output={output} isRunning={isRunning} />
                 </div>
               </div>
             </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;