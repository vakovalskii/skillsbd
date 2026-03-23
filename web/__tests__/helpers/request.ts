import { NextRequest } from "next/server";

export function makeRequest(
  url: string,
  options?: { method?: string; body?: object; ip?: string }
): NextRequest {
  const { method = "GET", body, ip = "127.0.0.1" } = options || {};

  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
  };

  if (body) {
    init.body = JSON.stringify(body);
  }

  return new NextRequest(new URL(url, "https://skillsbd.ru"), init);
}
