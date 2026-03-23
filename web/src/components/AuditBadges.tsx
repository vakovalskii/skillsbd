"use client";

import { useState, useEffect } from "react";

interface AuditResult {
  checkName: string;
  status: string;
  details: string | null;
}

const CHECK_LABELS: Record<string, string> = {
  repository: "Репозиторий",
  license: "Лицензия",
  activity: "Активность",
  author: "Автор",
  security: "Безопасность",
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pass: { bg: "bg-green-900/30 border-green-800/50", text: "text-green-400", label: "Pass" },
  warn: { bg: "bg-yellow-900/30 border-yellow-800/50", text: "text-yellow-400", label: "Warn" },
  fail: { bg: "bg-red-900/30 border-red-800/50", text: "text-red-400", label: "Fail" },
  pending: { bg: "bg-gray-900 border-gray-800", text: "text-gray-500", label: "..." },
};

export default function AuditBadges({ skillId }: { skillId: string }) {
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetch(`/api/skills/audit?skillId=${skillId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAudits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [skillId]);

  async function runAudit() {
    setRunning(true);
    try {
      const res = await fetch("/api/skills/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId }),
      });
      const data = await res.json();
      if (Array.isArray(data)) setAudits(data);
    } catch {}
    setRunning(false);
  }

  if (loading) {
    return <div className="h-8 w-48 animate-pulse rounded bg-gray-800" />;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-lg font-semibold">Аудит безопасности</h2>
        <button
          onClick={runAudit}
          disabled={running}
          className="rounded-md border border-gray-800 px-3 py-1 text-xs text-gray-400 hover:border-gray-600 hover:text-foreground transition-colors disabled:opacity-50"
        >
          {running ? "Проверка..." : audits.length > 0 ? "Перепроверить" : "Запустить аудит"}
        </button>
      </div>

      {audits.length === 0 ? (
        <p className="text-sm text-gray-600">Аудит ещё не проводился</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {audits.map((audit) => {
            const style = STATUS_STYLES[audit.status] || STATUS_STYLES.pending;
            return (
              <div
                key={audit.checkName}
                className={`rounded-lg border p-3 ${style.bg}`}
              >
                <p className="text-xs text-gray-500 mb-1">
                  {CHECK_LABELS[audit.checkName] || audit.checkName}
                </p>
                <p className={`text-sm font-medium ${style.text}`}>{style.label}</p>
                {audit.details && (
                  <p className="text-[11px] text-gray-500 mt-1 leading-tight">{audit.details}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
