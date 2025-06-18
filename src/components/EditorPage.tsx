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
  Key
} from 'lucide-react';

const EditorPage: React.FC = () => {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);

  const languageNames: Record<string, string> = {
    javascript: 'JavaScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    kotlin: 'Kotlin'
  };

  const defaultCode: Record<string, string> = {
    javascript: `// Welcome to JavaScript
console.log("Hello, World!");

// Try some basic operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);

// Function example
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(8):", fibonacci(8));`,
    python: `# Welcome to Python
print("Hello, World!")

# Try some basic operations
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print("Doubled numbers:", doubled)

# Function example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(f"Fibonacci(8): {fibonacci(8)}")

# Class example
class Calculator:
    def add(self, a, b):
        return a + b
    
    def multiply(self, a, b):
        return a * b

calc = Calculator()
print(f"5 + 3 = {calc.add(5, 3)}")
print(f"5 * 3 = {calc.multiply(5, 3)}")`,
    java: `// Welcome to Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Array example
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.print("Original numbers: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        // Method call
        System.out.println("Fibonacci(8): " + fibonacci(8));
        
        // Object example
        Calculator calc = new Calculator();
        System.out.println("5 + 3 = " + calc.add(5, 3));
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    public int multiply(int a, int b) {
        return a * b;
    }
}`,
    cpp: `// Welcome to C++
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// Function declaration
int fibonacci(int n);

int main() {
    cout << "Hello, World!" << endl;
    
    // Vector example
    vector<int> numbers = {1, 2, 3, 4, 5};
    vector<int> doubled;
    
    transform(numbers.begin(), numbers.end(), back_inserter(doubled), 
              [](int n) { return n * 2; });
    
    cout << "Doubled numbers: ";
    for (int num : doubled) {
        cout << num << " ";
    }
    cout << endl;
    
    cout << "Fibonacci(8): " << fibonacci(8) << endl;
    
    return 0;
}

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    c: `// Welcome to C
#include <stdio.h>

// Function declaration
int fibonacci(int n);

int main() {
    printf("Hello, World!\\n");
    
    // Array example
    int numbers[] = {1, 2, 3, 4, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    printf("Original numbers: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    
    printf("Doubled numbers: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i] * 2);
    }
    printf("\\n");
    
    printf("Fibonacci(8): %d\\n", fibonacci(8));
    
    return 0;
}

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    kotlin: `// Welcome to Kotlin
fun main() {
    println("Hello, World!")
    
    // List example
    val numbers = listOf(1, 2, 3, 4, 5)
    val doubled = numbers.map { it * 2 }
    
    println("Original numbers: $numbers")
    println("Doubled numbers: $doubled")
    
    // Function call
    println("Fibonacci(8): \${fibonacci(8)}")
    
    // Class example
    val calc = Calculator()
    println("5 + 3 = \${calc.add(5, 3)}")
    println("5 * 3 = \${calc.multiply(5, 3)}")
}

fun fibonacci(n: Int): Int {
    return if (n <= 1) n else fibonacci(n - 1) + fibonacci(n - 2)
}

class Calculator {
    fun add(a: Int, b: Int) = a + b
    fun multiply(a: Int, b: Int) = a * b
}`
  };

  useEffect(() => {
    if (language && defaultCode[language]) {
      setCode(defaultCode[language]);
    }
  }, [language]);

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('❌ Error: No code to execute');
      return;
    }

    setIsRunning(true);
    setOutput('🔄 Compiling and executing code...\n');

    try {
      const result = await judge0Service.submitCode(language!, code);
      setOutput(result);
    } catch (error) {
      console.error('Compilation error:', error);
      
      // Check if it's an API key issue
      if (error instanceof Error && error.message.includes('API configuration')) {
        setOutput(`❌ API Configuration Error: ${error.message}\n\n💡 To use real compilation, you need to:\n1. Get a Judge0 API key from RapidAPI\n2. Add it to your environment variables\n\nFalling back to demo mode...`);
        
        // Fall back to simulation after a delay
        setTimeout(async () => {
          try {
            const simulatedResult = await judge0Service.simulateExecution(language!, code);
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
          
          <button className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white">
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
          
          <button className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white">
            <Settings className="h-4 w-4" />
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

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* File Explorer */}
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full bg-gray-800 border-r border-gray-700">
              <div className="h-8 bg-gray-750 border-b border-gray-700 flex items-center justify-between px-3">
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Explorer</span>
                </div>
              </div>
              <FileExplorer language={language || 'javascript'} />
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600 transition-colors" />

          {/* Editor and Output */}
          <Panel defaultSize={80}>
            <PanelGroup direction="vertical">
              {/* Code Editor */}
              <Panel defaultSize={70} minSize={30}>
                <div className="h-full bg-gray-900">
                  <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">
                        main.{language === 'cpp' ? 'cpp' : language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'c' ? 'c' : 'kt'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {language?.toUpperCase()}
                    </div>
                  </div>
                  <CodeEditor
                    language={language || 'javascript'}
                    value={code}
                    onChange={setCode}
                  />
                </div>
              </Panel>

              <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-gray-600 transition-colors" />

              {/* Output Terminal */}
              <Panel defaultSize={30} minSize={20}>
                <div className="h-full bg-gray-900">
                  <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                      <Terminal className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">Output</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isRunning && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                      <span className="text-xs text-gray-500">
                        {isRunning ? 'Running' : 'Ready'}
                      </span>
                    </div>
                  </div>
                  <CompilerOutput output={output} isRunning={isRunning} />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default EditorPage;