import React, { useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  fontSize?: number;
  wordWrap?: boolean;
  lineNumbers?: boolean;
  codeSuggestions?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  language, 
  value, 
  onChange, 
  fontSize = 14, 
  wordWrap = false, 
  lineNumbers = true,
  codeSuggestions = true
}) => {
  const editorRef = useRef<any>(null);
  


  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.updateOptions({
        fontSize: fontSize,
        lineNumbers: lineNumbers ? 'on' : 'off',
        
        wordWrap: wordWrap ? 'on' : 'off',
        suggest: {
          showKeywords: codeSuggestions,
          showSnippets: codeSuggestions,
          showFunctions: codeSuggestions,
          showVariables: codeSuggestions,
        },
        quickSuggestions: {
          other: codeSuggestions,
          comments: codeSuggestions,
          strings: true,
        },
        parameterHints: {
          enabled: codeSuggestions,
        },
      });
    }
  }, [fontSize, wordWrap, lineNumbers, codeSuggestions]);



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

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: fontSize,
          lineNumbers: lineNumbers ? 'on' : 'off',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          detectIndentation: false,
          wordWrap: wordWrap ? 'on' : 'off',
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
            showKeywords: codeSuggestions,
            showSnippets: codeSuggestions,
            showFunctions: codeSuggestions,
            showVariables: codeSuggestions,
          },
          quickSuggestions: {
            other: codeSuggestions,
            comments: codeSuggestions,
            strings: true,
          },
          parameterHints: {
            enabled: codeSuggestions,
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