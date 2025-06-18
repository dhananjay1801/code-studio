import React, { useEffect, useRef } from 'react';
import { Terminal, CheckCircle, XCircle, Clock, MemoryStick } from 'lucide-react';

interface CompilerOutputProps {
  output: string;
  isRunning: boolean;
}

const CompilerOutput: React.FC<CompilerOutputProps> = ({ output, isRunning }) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

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
        {isRunning ? (
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
    </div>
  );
};

export default CompilerOutput;