"use client";

import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import FileUpload from "@/components/FileUpload";
import DebugResult from "@/components/DebugResult";

type SupportedLanguage = "javascript" | "typescript" | "python" | "java";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>("typescript");

  async function handleDebug(code: string) {
    setLoading(true);

    try {
      const res = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          fileName: `snippet.${language === "typescript" ? "ts" : "js"}`,
        }),
      });

      const data = await res.json();
      setResult(data); 
    } catch (err) {
      console.error(err);
      setResult({
        errors: ["API Error"],
        suggestions: [],
        fixedCode: "",
      });
    }

    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Code Editor */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Paste Your Error</h2>
        <CodeEditor />
      </div>

      {/* File Upload */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Upload File</h2>
        <FileUpload onResult={setResult} />
      </div>

      {/* Result */}
      <div className="col-span-1 lg:col-span-2">
        <DebugResult result={result} loading={loading} />
      </div>

    </div>
  );
}