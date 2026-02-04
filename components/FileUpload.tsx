"use client";
import { useState } from "react";

export default function FileUpload({ onResult }: { onResult: (data: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"local" | "github">("local");

  const [githubUser, setGithubUser] = useState("");
  const [repo, setRepo] = useState("");
  const [filePath, setFilePath] = useState("");
  const [loading, setLoading] = useState(false);

  function extractGitHubInfo(input: string) {
    const cleaned = input.trim();

    // Case 1: plain username
    if (!cleaned.startsWith("http")) {
      return { owner: cleaned, repoFromUrl: "" };
    }
    try {
      const url = new URL(cleaned);
      const parts = url.pathname.split("/").filter(Boolean); // remove empty
      const owner = parts[0] || "";
      const repoFromUrl = parts[1] || "";
      return { owner, repoFromUrl };
    } catch {
      return { owner: cleaned, repoFromUrl: "" };
    }
  }

  async function handleLocalUpload() {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    onResult(data.result.result);
    setLoading(false);
  }

  async function handleGithubUpload() {
    if (!githubUser || !repo || !filePath) return;

    setLoading(true);
    const { owner, repoFromUrl } = extractGitHubInfo(githubUser);
    const finalRepo = repoFromUrl || repo;

    const res = await fetch("/api/github-fetch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: owner,           
        repo: finalRepo,       
        path: filePath,
        branch: "main",        
      }),
    });

    const data = await res.json();
    if (data?.code) {
      const debugRes = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: data.code,
          fileName: data.fileName || filePath,
          language: filePath.endsWith(".ts") || filePath.endsWith(".tsx") ? "typescript" : "javascript",
        }),
      });

      const debugData = await debugRes.json();
      onResult(debugData?.data?.result);
    } else {
      // fallback if your API already returns debug result
      onResult(data.result?.result || data);
    }

    setLoading(false);
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-md">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode("local")}
          className={`px-4 py-2 rounded ${
            mode === "local" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Local File
        </button>

        <button
          onClick={() => setMode("github")}
          className={`px-4 py-2 rounded ${
            mode === "github" ? "bg-purple-600" : "bg-gray-700"
          }`}
        >
          GitHub File
        </button>
      </div>

      {mode === "local" ? (
        <div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-3 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0 file:text-sm file:bg-gray-800 file:text-white
            hover:file:bg-gray-700"
          />
          <button
            onClick={handleLocalUpload}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload & Debug"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="GitHub Username or URL (e.g. ShubhamKashyap1001 OR https://github.com/ShubhamKashyap1001/SmartDebugAI)"
            value={githubUser}
            onChange={(e) => {
              const value = e.target.value;
              setGithubUser(value);

              const { repoFromUrl } = extractGitHubInfo(value);
              if (repoFromUrl) setRepo(repoFromUrl);
            }}
            className="w-full p-2 bg-black border border-gray-700 rounded"
          />

          <input
            type="text"
            placeholder="Repository Name (e.g. SmartDebugAI)"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full p-2 bg-black border border-gray-700 rounded"
          />

          <input
            type="text"
            placeholder="File Path (e.g. app/page.tsx)"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            className="w-full p-2 bg-black border border-gray-700 rounded"
          />

          <button
            onClick={handleGithubUpload}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded w-full"
            disabled={loading}
          >
            {loading ? "Fetching from GitHub..." : "Fetch & Debug from GitHub"}
          </button>
        </div>
      )}
    </div>
  );
}
