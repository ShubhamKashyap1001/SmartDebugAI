"use client";

import { Github, X } from "lucide-react";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const handleGithubLogin = () => {
    window.location.href = "/api/auth/github";
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-96 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-white mb-4 text-center">
          Sign in to smartDebugAI
        </h2>

        <button
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded"
        >
          <Github size={18} />
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
