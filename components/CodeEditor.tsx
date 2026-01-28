"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";
import type { SupportedLanguage } from "@/types/language";
import AiResponsePage from "./ResponseModal";
interface CodeEditorProps {
  language: SupportedLanguage;   // selected language from parent
  onSubmit: (code: string) => void;
}

export default function CodeEditor() {
  const [errorText, setErrorText] = useState<string>(""); 
  const [data, setData] = useState<string>("");
  const test = async () => {
    const res = await fetch("/api/stacktrace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        errorText,
      }),
    });

    const json = await res.json();
     const aiText =
      json.result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    setData(aiText)
  };

  return (
    <div className="flex flex-col">
      <textarea name="" id="" className="border-2 " onChange={(e) => {
        setErrorText(e.target.value)
      }}></textarea>
      <div className="overflow-hidden  px-0 pt-2 py-2">
        <button
          onClick={test}

          className=" bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
        >
          Debug Code
        </button>
      </div>
      <AiResponsePage data={data}/>
    </div>
  );
}

