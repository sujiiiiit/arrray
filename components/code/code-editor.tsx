'use client';

import React, { memo, useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';

type EditorProps = {
  height: string;
  content: string;
  onSaveContent: (updatedContent: string, debounce: boolean) => void;
  status: 'streaming' | 'idle';
  isCurrentVersion: boolean;
  currentVersionIndex: number;
};

function PureCodeEditor({ height,content, onSaveContent, status }: EditorProps) {
  const editorRef = useRef<any>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure we only render the editor on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    // Listen for content changes and trigger onSaveContent callback
    editor.onDidChangeModelContent(() => {
      const newContent = editor.getValue();
      onSaveContent(newContent, true);
    });
  };

  // Synchronize external content updates with the editor
  useEffect(() => {
    if (editorRef.current) {
      const currentContent = editorRef.current.getValue();
      if (status === 'streaming' || currentContent !== content) {
        editorRef.current.setValue(content);
      }
    }
  }, [content, status]);

  if (!mounted) return null;

  // Determine the current theme from next-themes
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  // Map next-themes value to Monaco Editor theme
  const monacoTheme = currentTheme === 'dark' ? 'vs-dark' : 'light';

  return (
    <Editor
      height={height}
      defaultLanguage="javascript"
      theme={monacoTheme}
      defaultValue={content}
      onMount={handleEditorMount}
      options={{
        automaticLayout: true,
        minimap: { enabled: true },
      }}
    />
  );
}

function areEqual(prevProps: EditorProps, nextProps: EditorProps) {
  if (prevProps.currentVersionIndex !== nextProps.currentVersionIndex) return false;
  if (prevProps.isCurrentVersion !== nextProps.isCurrentVersion) return false;
  if (prevProps.status === 'streaming' && nextProps.status === 'streaming') return false;
  if (prevProps.content !== nextProps.content) return false;

  return true;
}

export const CodeEditor = memo(PureCodeEditor, areEqual);
