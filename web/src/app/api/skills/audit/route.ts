import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DANGEROUS_PATTERNS = [
  /rm\s+-rf\s+\//i,
  /curl\s+.*\|\s*(bash|sh|zsh)/i,
  /wget\s+.*\|\s*(bash|sh|zsh)/i,
  /eval\s*\(/i,
  /exec\s*\(/i,
  /process\.env\.\w+/i,
  /\/etc\/passwd/i,
  /\/etc\/shadow/i,
  /chmod\s+777/i,
  /base64\s+-d/i,
];

interface GHRepo {
  private: boolean;
  license: { spdx_id: string } | null;
  pushed_at: string;
  stargazers_count: number;
}

interface GHUser {
  created_at: string;
  public_repos: number;
}

async function ghFetch(url: string): Promise<Response> {
  return fetch(url, {
    headers: { "User-Agent": "skillsbd-audit", Accept: "application/vnd.github+json" },
  });
}

async function checkRepo(owner: string, repo: string): Promise<{ status: string; details: string }> {
  try {
    const res = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!res.ok) return { status: "fail", details: "Репозиторий не найден или недоступен" };
    const data: GHRepo = await res.json();
    if (data.private) return { status: "fail", details: "Репозиторий приватный" };
    return { status: "pass", details: `Публичный репозиторий, ${data.stargazers_count} звёзд` };
  } catch {
    return { status: "fail", details: "Ошибка при проверке репозитория" };
  }
}

async function checkLicense(owner: string, repo: string): Promise<{ status: string; details: string }> {
  try {
    const res = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!res.ok) return { status: "warn", details: "Не удалось проверить" };
    const data: GHRepo = await res.json();
    if (!data.license) return { status: "warn", details: "Лицензия не указана" };
    return { status: "pass", details: `Лицензия: ${data.license.spdx_id}` };
  } catch {
    return { status: "warn", details: "Ошибка при проверке лицензии" };
  }
}

async function checkActivity(owner: string, repo: string): Promise<{ status: string; details: string }> {
  try {
    const res = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!res.ok) return { status: "warn", details: "Не удалось проверить" };
    const data: GHRepo = await res.json();
    const lastPush = new Date(data.pushed_at);
    const monthsAgo = (Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsAgo > 6) return { status: "warn", details: `Последний коммит: ${Math.floor(monthsAgo)} мес. назад` };
    return { status: "pass", details: `Последний коммит: ${Math.floor(monthsAgo)} мес. назад` };
  } catch {
    return { status: "warn", details: "Ошибка при проверке активности" };
  }
}

async function checkAuthor(owner: string): Promise<{ status: string; details: string }> {
  try {
    const res = await ghFetch(`https://api.github.com/users/${owner}`);
    if (!res.ok) return { status: "warn", details: "Автор не найден" };
    const data: GHUser = await res.json();
    const created = new Date(data.created_at);
    const daysOld = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld < 30) return { status: "warn", details: `Аккаунт создан ${Math.floor(daysOld)} дн. назад` };
    return { status: "pass", details: `Аккаунт: ${Math.floor(daysOld / 365)} г., ${data.public_repos} публичных репо` };
  } catch {
    return { status: "warn", details: "Ошибка при проверке автора" };
  }
}

async function checkSecurity(owner: string, repo: string, skillName: string): Promise<{ status: string; details: string }> {
  try {
    // Try to find SKILL.md in skills/<name>/ or plugins/<name>/ or root
    const paths = [
      `plugins/${skillName}/skills`,
      `skills/${skillName}`,
      "",
    ];

    for (const basePath of paths) {
      const dirUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${basePath}`;
      const dirRes = await ghFetch(dirUrl);
      if (!dirRes.ok) continue;
      const files = await dirRes.json();
      if (!Array.isArray(files)) continue;

      const skillMd = files.find((f: { name: string }) => f.name === "SKILL.md" || f.name === "skill.md");
      if (!skillMd) continue;

      const contentRes = await ghFetch(skillMd.download_url);
      if (!contentRes.ok) continue;
      const content = await contentRes.text();

      const found = DANGEROUS_PATTERNS.filter((p) => p.test(content));
      if (found.length > 0) {
        return { status: "fail", details: `Обнаружено ${found.length} потенциально опасных паттернов` };
      }
      return { status: "pass", details: "SKILL.md проверен, опасных команд не найдено" };
    }

    return { status: "warn", details: "SKILL.md не найден для проверки" };
  } catch {
    return { status: "warn", details: "Ошибка при проверке безопасности" };
  }
}

export async function POST(request: NextRequest) {
  const { skillId } = await request.json();
  if (!skillId) return NextResponse.json({ error: "skillId required" }, { status: 400 });

  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });

  const checks = [
    { name: "repository", fn: () => checkRepo(skill.owner, skill.repo) },
    { name: "license", fn: () => checkLicense(skill.owner, skill.repo) },
    { name: "activity", fn: () => checkActivity(skill.owner, skill.repo) },
    { name: "author", fn: () => checkAuthor(skill.owner) },
    { name: "security", fn: () => checkSecurity(skill.owner, skill.repo, skill.name) },
  ];

  const results = [];

  for (const check of checks) {
    const result = await check.fn();
    await prisma.audit.upsert({
      where: { skillId_checkName: { skillId, checkName: check.name } },
      update: { status: result.status, details: result.details, createdAt: new Date() },
      create: { skillId, checkName: check.name, status: result.status, details: result.details },
    });
    results.push({ check: check.name, ...result });
  }

  return NextResponse.json(results);
}

export async function GET(request: NextRequest) {
  const skillId = request.nextUrl.searchParams.get("skillId");
  if (!skillId) return NextResponse.json({ error: "skillId required" }, { status: 400 });

  const audits = await prisma.audit.findMany({ where: { skillId }, orderBy: { checkName: "asc" } });
  return NextResponse.json(audits);
}
