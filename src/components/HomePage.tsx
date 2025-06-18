import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Coffee, FileText, Zap, Database, Terminal } from 'lucide-react';

const languages = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: Zap,
    description: 'Dynamic web programming language',
    color: 'from-yellow-400 to-orange-500',
    extension: '.js'
  },
  {
    id: 'python',
    name: 'Python',
    icon: Database,
    description: 'Versatile programming language',
    color: 'from-blue-400 to-green-500',
    extension: '.py'
  },
  {
    id: 'java',
    name: 'Java',
    icon: Coffee,
    description: 'Enterprise-grade programming',
    color: 'from-red-400 to-orange-600',
    extension: '.java'
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: Terminal,
    description: 'High-performance programming',
    color: 'from-blue-500 to-purple-600',
    extension: '.cpp'
  },
  {
    id: 'c',
    name: 'C',
    icon: FileText,
    description: 'System programming language',
    color: 'from-gray-400 to-blue-500',
    extension: '.c'
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    icon: Code2,
    description: 'Modern JVM language',
    color: 'from-purple-400 to-pink-500',
    extension: '.kt'
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = (languageId: string) => {
    navigate(`/editor/${languageId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Code2 className="h-8 w-8 text-blue-400 mr-3" />
            <h1 className="text-2xl font-bold text-white">CodeStudio</h1>
            <span className="ml-3 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
              Online IDE
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Programming Language
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Write, compile, and run code in your browser with our powerful online IDE.
            Select a language below to get started.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {languages.map((language) => {
            const Icon = language.icon;
            return (
              <div
                key={language.id}
                onClick={() => handleLanguageSelect(language.id)}
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${language.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${language.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {language.name}
                    <span className="text-sm text-gray-400 ml-2">
                      {language.extension}
                    </span>
                  </h3>
                  
                  <p className="text-gray-400 mb-4">
                    {language.description}
                  </p>
                  
                  <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                    Start Coding
                    <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Terminal className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Compilation</h3>
            <p className="text-gray-400">
              Compile and run your code instantly with real-time output and error handling.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code2 className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Syntax Highlighting</h3>
            <p className="text-gray-400">
              Advanced Monaco Editor with intelligent syntax highlighting and code completion.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Resizable Panels</h3>
            <p className="text-gray-400">
              Customize your workspace with movable and resizable editor panels.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;