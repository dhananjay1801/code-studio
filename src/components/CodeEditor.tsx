import React from 'react';
import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => {
  const getMonacoLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      kotlin: 'kotlin'
    };
    return langMap[lang] || 'javascript';
  };

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          bracketPairColorization: { enabled: true },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          selectOnLineNumbers: true,
          mouseWheelZoom: true,
          contextmenu: true,
          copyWithSyntaxHighlighting: true,
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
            showVariables: true,
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
          parameterHints: {
            enabled: true,
          },
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          unfoldOnClickAfterEndOfLine: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12,
          },
        }}
      />
    </div>
  );
};

export default CodeEditor;