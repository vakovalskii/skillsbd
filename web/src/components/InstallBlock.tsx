"use client";

import { useState } from "react";

interface Props {
  command: string;
  zipUrl: string;
  skillName: string;
  owner: string;
  repo: string;
}

export default function InstallBlock({ command, zipUrl, skillName, owner, repo }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleZipDownload() {
    // Track install before downloading
    fetch("/api/skills/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: skillName, owner, repo, v: "web-zip" }),
    }).catch(() => {});
    window.open(zipUrl, "_blank");
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">Установка</h2>
      <div
        onClick={copyCommand}
        className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 font-mono text-sm overflow-x-auto whitespace-nowrap mb-3 cursor-pointer group hover:border-gray-700 transition-all relative"
      >
        <span className="text-gray-500">$ </span>
        {command}
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-all ${
          copied ? "text-green-400" : "text-gray-600 opacity-0 group-hover:opacity-100"
        }`}>
          {copied ? "Скопировано!" : "Копировать"}
        </span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleZipDownload}
          className="inline-flex items-center gap-2 rounded-md border border-gray-800 px-3 py-1.5 text-xs text-gray-400 hover:border-gray-600 hover:text-foreground transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Скачать ZIP
        </button>
      </div>
    </div>
  );
}
