"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetch("/api/github/repos")
      .then((res) => res.json())
      .then((data) => setRepos(data.repos || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your GitHub Repositories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo: any) => (
          <div key={repo.id} className="bg-gray-900 p-4 rounded">
            <h3 className="text-lg font-semibold">{repo.name}</h3>
            <p className="text-sm text-gray-400">{repo.full_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
