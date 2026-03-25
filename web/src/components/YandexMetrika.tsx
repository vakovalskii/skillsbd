"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const METRIKA_ID = process.env.NEXT_PUBLIC_METRIKA_ID;

export default function YandexMetrika() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!METRIKA_ID) return;
    // Track page views on route change
    if (typeof window !== "undefined" && (window as any).ym) {
      (window as any).ym(Number(METRIKA_ID), "hit", window.location.href);
    }
  }, [pathname, searchParams]);

  if (!METRIKA_ID) return null;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(${METRIKA_ID}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
          });
        `,
      }}
    />
  );
}
