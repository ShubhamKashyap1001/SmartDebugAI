"use client";

import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Read username from URL after login (optional, lightweight)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    if (user) {
      setUsername(user);
    }
  }, []);

  return (
    <>
      <nav className="bg-black p-4 border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/smartDebugAI.png" alt="Logo" width={36} height={36} />
            <span className="text-xl font-bold text-white">
              smart<span className="text-green-400">Debug</span>AI
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-6 text-gray-300">
            <Link href="/" className="hover:text-green-400">
              Home
            </Link>

            {username && (
              <span className="text-sm text-green-400">
                @{username}
              </span>
            )}

            {/* GitHub Login Icon */}
            <button
              onClick={() => setOpen(true)}
              className="hover:text-white transition"
              aria-label="Login with GitHub"
            >
              <Github size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {open && <AuthModal onClose={() => setOpen(false)} />}
    </>
  );
}
