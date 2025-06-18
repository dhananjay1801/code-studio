import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Code, 
  Coffee,
  Database,
  Terminal,
  Zap,
  Plus,
  MoreVertical,
  File
} from 'lucide-react';

interface FileExplorerProps {
  language: string;
}

const languageIcons: Record<string, any> = {
  javascript: Zap,
  python: Database,
  java: Coffee,
  cpp: Terminal,
  c: Terminal,
  kotlin: Code
};

const FileExplorer: React.FC<FileExplorerProps> = ({ language }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  
  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const getLanguageExtension = (lang: string) => {
    const extensions: Record<string, string> = {
      javascript: '.js',
      python: '.py',
      java: '.java',
      cpp: '.cpp',
      c: '.c',
      kotlin: '.kt'
    };
    return extensions[lang] || '.txt';
  };

  const LanguageIcon = languageIcons[language] || FileText;
  const extension = getLanguageExtension(language);

  const fileStructure = [
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: `main${extension}`, type: 'file', active: true },
        { name: `utils${extension}`, type: 'file' },
        { name: `helpers${extension}`, type: 'file' }
      ]
    },
    {
      name: 'tests',
      type: 'folder',
      children: [
        { name: `test${extension}`, type: 'file' }
      ]
    },
    { name: 'README.md', type: 'file' },
    { name: '.gitignore', type: 'file' }
  ];

  const renderFileTree = (items: any[], depth = 0) => {
    return items.map((item, index) => (
      <div key={index}>
        <div
          className={`flex items-center px-2 py-1 hover:bg-gray-700 cursor-pointer group ${
            item.active ? 'bg-blue-500/20 border-r-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => item.type === 'folder' && toggleFolder(item.name)}
        >
          {item.type === 'folder' ? (
            expandedFolders.has(item.name) ? (
              <FolderOpen className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
            )
          ) : (
            <div className="mr-2 flex-shrink-0">
              {item.name.endsWith(extension) ? (
                <LanguageIcon className="h-4 w-4 text-green-400" />
              ) : item.name.endsWith('.md') ? (
                <FileText className="h-4 w-4 text-blue-300" />
              ) : (
                <File className="h-4 w-4 text-gray-400" />
              )}
            </div>
          )}
          <span className={`text-sm flex-1 ${
            item.active ? 'text-white font-medium' : 'text-gray-300'
          }`}>
            {item.name}
          </span>
        </div>
        
        {item.type === 'folder' && item.children && expandedFolders.has(item.name) && (
          <div>
            {renderFileTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* File tree */}
      <div className="flex-1 overflow-auto py-2">
        {renderFileTree(fileStructure)}
      </div>

      {/* Footer actions */}
      <div className="border-t border-gray-700 p-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {language.toUpperCase()} Project
          </span>
          <div className="flex items-center space-x-1">
            <button className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white transition-colors">
              <Plus className="h-3 w-3" />
            </button>
            <button className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white transition-colors">
              <MoreVertical className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;