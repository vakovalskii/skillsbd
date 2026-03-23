import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

const ghHeaders: Record<string, string> = {
  "User-Agent": "skillsbd",
  Accept: "application/vnd.github+json",
};
if (process.env.GITHUB_TOKEN) {
  ghHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

interface FoundSkill {
  name: string;
  path: string;
  hasSkillMd: boolean;
}

async function ghFetch(url: string) {
  const res = await fetch(url, { headers: ghHeaders });
  if (!res.ok) return null;
  return res.json();
}

async function scanRepo(owner: string, repo: string): Promise<FoundSkill[]> {
  const found: FoundSkill[] = [];

  // Check directories: skills/, plugins/, .claude/skills/
  const dirs = ["skills", "plugins", ".claude/skills"];

  for (const dir of dirs) {
    const entries = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/contents/${dir}`);
    if (!Array.isArray(entries)) continue;

    for (const entry of entries) {
      if (entry.type !== "dir" || entry.name.startsWith(".")) continue;

      // Check for SKILL.md in multiple locations
      const paths = [
        `${dir}/${entry.name}/SKILL.md`,
        `${dir}/${entry.name}/skills/${entry.name}/SKILL.md`,
      ];

      let hasSkillMd = false;
      for (const p of paths) {
        const check = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/contents/${p}`);
        if (check && check.name) {
          hasSkillMd = true;
          break;
        }
      }

      found.push({ name: entry.name, path: `${dir}/${entry.name}`, hasSkillMd });
    }
  }

  // Check root SKILL.md
  const rootSkill = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/contents/SKILL.md`);
  if (rootSkill && rootSkill.name) {
    found.push({ name: repo, path: "SKILL.md", hasSkillMd: true });
  }

  return found;
}

// POST: scan repo for skills
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { repoUrl, authorName, telegramLink, category } = await request.json();

  if (!repoUrl) return NextResponse.json({ error: "repoUrl required" }, { status: 400 });

  // Parse owner/repo from URL or short format
  const cleaned = repoUrl.replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "").replace(/\.git$/, "");
  const parts = cleaned.split("/");
  if (parts.length < 2) return NextResponse.json({ error: "Invalid repo format" }, { status: 400 });

  const owner = parts[0];
  const repo = parts[1];

  // Get repo info
  const repoInfo = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!repoInfo) return NextResponse.json({ error: "Repository not found" }, { status: 404 });

  // Scan for skills
  const skills = await scanRepo(owner, repo);

  return NextResponse.json({
    owner,
    repo,
    stars: repoInfo.stargazers_count || 0,
    description: repoInfo.description || "",
    license: repoInfo.license?.spdx_id || null,
    skills,
  });
}

// PUT: import selected skills from scan results
export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { owner, repo, skills, authorName, telegramLink, category, featured } = await request.json();

  if (!owner || !repo || !Array.isArray(skills) || skills.length === 0) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const ghRes = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`);
  const stars = ghRes?.stargazers_count || 0;

  const created = [];
  for (const skillName of skills) {
    // Check if already exists
    const existing = await prisma.skill.findFirst({ where: { name: skillName, owner, repo } });
    if (existing) continue;

    // Try to get description from plugin.json or SKILL.md
    let description = `Навык ${skillName}`;
    const pluginPaths = [
      `plugins/${skillName}/.claude-plugin/plugin.json`,
      `plugins/${skillName}/plugin.json`,
    ];
    for (const p of pluginPaths) {
      const data = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/contents/${p}`);
      if (data?.content) {
        try {
          const decoded = JSON.parse(Buffer.from(data.content, "base64").toString());
          if (decoded.description) description = decoded.description;
        } catch {}
        break;
      }
    }

    const skill = await prisma.skill.create({
      data: {
        name: skillName,
        owner,
        repo,
        description,
        category: category || "утилиты",
        authorName: authorName || null,
        telegramLink: telegramLink || null,
        featured: featured || false,
        status: "approved",
        githubStars: stars,
      },
    });

    // Auto-run audit
    fetch(`${process.env.NEXTAUTH_URL || "https://skillsbd.ru"}/api/skills/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId: skill.id }),
    }).catch(() => {});

    created.push(skill);
  }

  return NextResponse.json({ imported: created.length, skills: created });
}
