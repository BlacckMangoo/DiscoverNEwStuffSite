import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  theme?: string;
}

const CodeEditor = ({ 
  value = '// Write your JavaScript code here\nconsole.log("Hello, World!");', 
  onChange, 
  language = 'javascript',
  theme = 'vs-dark' // Default theme,
}: CodeEditorProps) => {
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme={theme}
        value={value}
        onChange={onChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
