#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, resolve } from "path";

const VERSION = "0.1.0";

const HELP = `
  skillsru - CLI для установки навыков AI-агентов

  Использование:
    npx skillsru add <owner/repo>           Установить все навыки из репозитория
    npx skillsru add <owner/repo/skill>     Установить конкретный навык
    npx skillsru list                       Показать установленные навыки
    npx skillsru search <запрос>            Поиск навыков в каталоге
    npx skillsru remove <skill>             Удалить навык
    npx skillsru --help                     Показать справку
    npx skillsru --version                  Показать версию

  Примеры:
    npx skillsru add skillsru/agent-skills
    npx skillsru add skillsru/agent-skills/react-best-practices
    npx skillsru search react
    npx skillsru list
`;

const AGENTS_DIR = ".skills";

function log(msg) {
  console.log(`  \x1b[36m>\x1b[0m ${msg}`);
}

function success(msg) {
  console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
}

function error(msg) {
  console.error(`  \x1b[31m✗\x1b[0m ${msg}`);
}

function ensureSkillsDir() {
  const dir = resolve(process.cwd(), AGENTS_DIR);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function cloneSkill(ownerRepo, skillName) {
  const parts = ownerRepo.split("/");
  if (parts.length < 2) {
    error("Формат: owner/repo или owner/repo/skill-name");
    process.exit(1);
  }

  const owner = parts[0];
  const repo = parts[1];
  const skill = skillName || parts[2];
  const repoUrl = `https://github.com/${owner}/${repo}.git`;

  const skillsDir = ensureSkillsDir();
  const tempDir = join(skillsDir, ".tmp-clone");

  log(`Клонирование ${owner}/${repo}...`);

  try {
    execSync(`git clone --depth 1 ${repoUrl} "${tempDir}" 2>/dev/null`, {
      stdio: "pipe",
    });
  } catch {
    error(`Не удалось клонировать ${repoUrl}`);
    error("Проверьте, существует ли репозиторий и доступен ли он.");
    process.exit(1);
  }

  // Look for SKILL.md files
  const skillsPath = join(tempDir, "skills");
  if (!existsSync(skillsPath)) {
    // Try root-level SKILL.md
    const rootSkill = join(tempDir, "SKILL.md");
    if (existsSync(rootSkill)) {
      const destDir = join(skillsDir, repo);
      mkdirSync(destDir, { recursive: true });
      const content = readFileSync(rootSkill, "utf-8");
      writeFileSync(join(destDir, "SKILL.md"), content);
      success(`Установлен навык: ${repo}`);
    } else {
      error("Навыки не найдены в репозитории (нет директории skills/ или SKILL.md)");
    }
    cleanup(tempDir);
    return;
  }

  // Install specific or all skills
  try {
    const entries = execSync(`ls "${skillsPath}"`, { encoding: "utf-8" })
      .trim()
      .split("\n")
      .filter(Boolean);

    let installed = 0;

    for (const entry of entries) {
      if (skill && entry !== skill) continue;

      const skillMd = join(skillsPath, entry, "SKILL.md");
      if (existsSync(skillMd)) {
        const destDir = join(skillsDir, entry);
        mkdirSync(destDir, { recursive: true });

        // Copy all files from skill directory
        execSync(`cp -r "${join(skillsPath, entry)}/." "${destDir}/"`);
        success(`Установлен: ${entry}`);
        installed++;
      }
    }

    if (installed === 0) {
      error(skill ? `Навык "${skill}" не найден` : "Навыки не найдены");
    } else {
      log(`Установлено навыков: ${installed}`);
    }
  } catch (e) {
    error("Ошибка при установке навыков");
  }

  cleanup(tempDir);
}

function cleanup(dir) {
  try {
    execSync(`rm -rf "${dir}"`);
  } catch {}
}

function listSkills() {
  const dir = resolve(process.cwd(), AGENTS_DIR);
  if (!existsSync(dir)) {
    log("Навыки не установлены. Используйте: npx skillsru add <owner/repo>");
    return;
  }

  try {
    const entries = execSync(`ls "${dir}"`, { encoding: "utf-8" })
      .trim()
      .split("\n")
      .filter((e) => e && !e.startsWith("."));

    if (entries.length === 0) {
      log("Навыки не установлены.");
      return;
    }

    console.log("\n  Установленные навыки:\n");
    for (const entry of entries) {
      const skillMd = join(dir, entry, "SKILL.md");
      if (existsSync(skillMd)) {
        const content = readFileSync(skillMd, "utf-8");
        const nameMatch = content.match(/name:\s*(.+)/);
        const descMatch = content.match(/description:\s*(.+)/);
        const name = nameMatch ? nameMatch[1].trim() : entry;
        const desc = descMatch ? descMatch[1].trim() : "";
        console.log(`  \x1b[36m${name}\x1b[0m`);
        if (desc) console.log(`    ${desc}`);
        console.log();
      } else {
        console.log(`  \x1b[36m${entry}\x1b[0m\n`);
      }
    }
  } catch {
    log("Навыки не установлены.");
  }
}

function removeSkill(name) {
  if (!name) {
    error("Укажите имя навыка: npx skillsru remove <name>");
    process.exit(1);
  }

  const dir = join(resolve(process.cwd(), AGENTS_DIR), name);
  if (!existsSync(dir)) {
    error(`Навык "${name}" не найден`);
    process.exit(1);
  }

  execSync(`rm -rf "${dir}"`);
  success(`Удален: ${name}`);
}

function searchSkills(query) {
  if (!query) {
    error("Укажите запрос: npx skillsru search <запрос>");
    process.exit(1);
  }

  log(`Поиск "${query}" в каталоге Skills.RU...`);
  log("(в прототипе поиск работает по локальным данным)");
  console.log();

  // Mock search results
  const results = [
    { name: "react-best-practices", owner: "skillsru/agent-skills", installs: "156.2K" },
    { name: "frontend-design", owner: "community/skills", installs: "98.7K" },
    { name: "nextjs-app-router", owner: "skillsru/agent-skills", installs: "87.4K" },
    { name: "typescript-patterns", owner: "community/ts-skills", installs: "76.5K" },
    { name: "tailwind-mastery", owner: "skillsru/agent-skills", installs: "65.3K" },
  ];

  const q = query.toLowerCase();
  const matched = results.filter(
    (r) => r.name.includes(q) || r.owner.includes(q)
  );

  if (matched.length === 0) {
    log("Ничего не найдено. Попробуйте другой запрос.");
    return;
  }

  for (const r of matched) {
    console.log(`  \x1b[36m${r.name}\x1b[0m  \x1b[90m${r.owner}\x1b[0m  ${r.installs} установок`);
  }
  console.log();
  log(`Установка: npx skillsru add <owner/repo>`);
}

// Main
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "--help" || command === "-h") {
  console.log(HELP);
  process.exit(0);
}

if (command === "--version" || command === "-v") {
  console.log(`skillsru v${VERSION}`);
  process.exit(0);
}

console.log();
console.log("  \x1b[36m███████╗██╗  ██╗██╗██╗     ██╗     ███████╗\x1b[0m");
console.log("  \x1b[36m██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝\x1b[0m");
console.log("  \x1b[36m███████╗█████╔╝ ██║██║     ██║     ███████╗\x1b[0m");
console.log("  \x1b[36m╚════██║██╔═██╗ ██║██║     ██║     ╚════██║\x1b[0m");
console.log("  \x1b[36m███████║██║  ██╗██║███████╗███████╗███████║\x1b[0m");
console.log("  \x1b[36m╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝\x1b[0m");
console.log("  \x1b[90mSkills.RU — навыки для AI-агентов\x1b[0m\n");

switch (command) {
  case "add":
  case "install":
  case "i":
    cloneSkill(args[1], args[2]);
    break;
  case "list":
  case "ls":
    listSkills();
    break;
  case "remove":
  case "rm":
    removeSkill(args[1]);
    break;
  case "search":
  case "find":
    searchSkills(args.slice(1).join(" "));
    break;
  default:
    error(`Неизвестная команда: ${command}`);
    console.log(HELP);
    process.exit(1);
}

console.log();
