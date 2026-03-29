"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-lg animate-slide-up">
      <div className="rounded-xl border border-gray-800 bg-gray-900/95 backdrop-blur-md p-4 shadow-2xl">
        <p className="text-sm text-gray-400 mb-3">
          Мы используем файлы cookie и Яндекс.Метрику для улучшения работы сайта.
          Продолжая использовать сайт, вы соглашаетесь с{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            политикой конфиденциальности
          </Link>
          .
        </p>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Принять
          </button>
          <button
            onClick={accept}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 transition-colors hover:text-foreground hover:border-gray-600"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
