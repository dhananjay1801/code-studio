// Judge0 API service for code compilation and execution
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';

// Language ID mapping for Judge0 API
export const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // Java
  cpp: 54,        // C++ (GCC 9.2.0)
  c: 50,          // C (GCC 9.2.0)
  kotlin: 78      // Kotlin
};

export interface CompilationResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
}

export interface SubmissionResponse {
  token: string;
}

class Judge0Service {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    // In production, this should be stored in environment variables
    // For demo purposes, we'll use a placeholder
    this.apiKey = import.meta.env.VITE_JUDGE0_API_KEY || 'demo-key';
    this.baseURL = JUDGE0_API_URL;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    };
  }

  async submitCode(language: string, sourceCode: string, input?: string): Promise<string> {
    const languageId = LANGUAGE_IDS[language as keyof typeof LANGUAGE_IDS];
    
    if (!languageId) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const submissionData = {
      language_id: languageId,
      source_code: btoa(sourceCode), // Base64 encode
      stdin: input ? btoa(input) : undefined,
      expected_output: undefined
    };

    try {
      const response = await fetch(`${this.baseURL}/submissions?base64_encoded=true&wait=true`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: CompilationResult = await response.json();
      return this.formatOutput(result);
    } catch (error) {
      console.error('Judge0 API Error:', error);
      throw new Error('Failed to compile code. Please check your API configuration.');
    }
  }

  private formatOutput(result: CompilationResult): string {
    let output = '';
    
    // Add compilation output if present
    if (result.compile_output) {
      const compileOutput = atob(result.compile_output);
      if (compileOutput.trim()) {
        output += `📋 Compilation Output:\n${compileOutput}\n\n`;
      }
    }

    // Add execution status
    const statusIcon = result.status.id === 3 ? '✅' : '❌';
    output += `${statusIcon} Status: ${result.status.description}\n`;

    // Add stdout if present
    if (result.stdout) {
      const stdout = atob(result.stdout);
      if (stdout.trim()) {
        output += `\n📤 Output:\n${stdout}\n`;
      }
    }

    // Add stderr if present
    if (result.stderr) {
      const stderr = atob(result.stderr);
      if (stderr.trim()) {
        output += `\n❌ Error:\n${stderr}\n`;
      }
    }

    // Add execution stats
    if (result.time && result.memory) {
      output += `\n⏱️  Execution time: ${result.time}s\n`;
      output += `📊 Memory used: ${(result.memory / 1024).toFixed(1)} MB`;
    }

    return output || 'No output generated.';
  }

  // Fallback method for demo purposes when API key is not available
  async simulateExecution(language: string, sourceCode: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const outputs: Record<string, string> = {
      javascript: `Hello, World!
Doubled numbers: [ 2, 4, 6, 8, 10 ]
Fibonacci(8): 21

✅ Status: Accepted
⏱️  Execution time: 0.045s
📊 Memory used: 2.1 MB`,
      python: `Hello, World!
Doubled numbers: [2, 4, 6, 8, 10]
Fibonacci(8): 21
5 + 3 = 8
5 * 3 = 15

✅ Status: Accepted
⏱️  Execution time: 0.123s
📊 Memory used: 3.2 MB`,
      java: `Hello, World!
Original numbers: 1 2 3 4 5 
Fibonacci(8): 21
5 + 3 = 8

✅ Status: Accepted
⏱️  Execution time: 0.067s
📊 Memory used: 15.4 MB`,
      cpp: `Hello, World!
Doubled numbers: 2 4 6 8 10 
Fibonacci(8): 21

✅ Status: Accepted
⏱️  Execution time: 0.023s
📊 Memory used: 1.8 MB`,
      c: `Hello, World!
Original numbers: 1 2 3 4 5 
Doubled numbers: 2 4 6 8 10 
Fibonacci(8): 21

✅ Status: Accepted
⏱️  Execution time: 0.019s
📊 Memory used: 1.2 MB`,
      kotlin: `Hello, World!
Original numbers: [1, 2, 3, 4, 5]
Doubled numbers: [2, 4, 6, 8, 10]
Fibonacci(8): 21
5 + 3 = 8
5 * 3 = 15

✅ Status: Accepted
⏱️  Execution time: 0.089s
📊 Memory used: 28.7 MB`
    };

    return outputs[language] || 'No output available for this language.';
  }
}

export const judge0Service = new Judge0Service();