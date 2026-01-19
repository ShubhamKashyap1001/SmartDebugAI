"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";
import type { SupportedLanguage } from "@/types/language";

interface CodeEditorProps {
  language: SupportedLanguage;   // selected language from parent
  onSubmit: (code: string) => void;
}

export default function CodeEditor({ language, onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState<string>(""); // blank editor

  return (
    <div>
      <Editor
        height="350px"
        language={language}         
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />

      <button
        onClick={() => onSubmit(code)}
        disabled={!code.trim()}
        className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
      >
        Debug Code
      </button>
    </div>
  );
}
