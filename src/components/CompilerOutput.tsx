import React, { useEffect, useRef, useState } from 'react';
import { Terminal, CheckCircle, XCircle, Clock, MemoryStick, Send } from 'lucide-react';

interface CompilerOutputProps {
  output: string;
  isRunning: boolean;
  onInputSubmit?: (input: string) => void;
  waitingForInput?: boolean;
}

const CompilerOutput: React.FC<CompilerOutputProps> = ({ 
  output, 
  isRunning, 
  onInputSubmit,
  waitingForInput = false 
}) => {
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [waitingForInput]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && onInputSubmit) {
      onInputSubmit(inputValue);
      setInputValue('');
    }
  };

  const formatOutput = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      let className = 'text-gray-300';
      let icon = null;

      if (line.includes('✅')) {
        className = 'text-green-400 font-medium';
        icon = <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />;
      } else if (line.includes('❌')) {
        className = 'text-red-400 font-medium';
        icon = <XCircle className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" />;
      } else if (line.includes('⏱️')) {
        className = 'text-blue-400';
        icon = <Clock className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />;
      } else if (line.includes('📊')) {
        className = 'text-purple-400';
        icon = <MemoryStick className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />;
      } else if (line.includes('Error') || line.includes('error')) {
        className = 'text-red-400';
      } else if (line.includes('Warning') || line.includes('warning')) {
        className = 'text-yellow-400';
      }

      return (
        <div key={index} className={`flex items-start ${className} py-0.5`}>
          {icon}
          <span className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {line.replace(/[✅❌⏱️📊]/g, '').trim()}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex-1 overflow-auto p-4" ref={outputRef}>
        {isRunning && !waitingForInput ? (
          <div className="flex items-center space-x-3 text-yellow-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="font-mono text-sm">Compiling and executing...</span>
          </div>
        ) : output ? (
          <div className="space-y-1">
            {formatOutput(output)}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Click "Run Code" to see output here</p>
              <p className="text-xs mt-2 opacity-75">Your program's output, errors, and execution details will appear in this terminal</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Input field for interactive programs */}
      {waitingForInput && (
        <div className="border-t border-gray-700 p-3 bg-gray-800">
          <form onSubmit={handleInputSubmit} className="flex items-center space-x-2">
            <span className="text-green-400 font-mono text-sm">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter input..."
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!onInputSubmit}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || !onInputSubmit}
              className="p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CompilerOutput;