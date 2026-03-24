#!/usr/bin/env node

import { writeFileSync, existsSync, cpSync, mkdirSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName || projectName === "--help" || projectName === "-h") {
  console.log(`
  \x1b[36mcreate-skillsbd\x1b[0m — генератор skill-библиотек для AI-агентов

  npx create-skillsbd <название>     Создать библиотеку навыков
  npx create-skillsbd my-skills      Пример

  Подробнее: https://skillsbd.ru/docs
`);
  process.exit(0);
}

const targetDir = resolve(process.cwd(), projectName);
if (existsSync(targetDir)) {
  console.error(`\x1b[31m✗\x1b[0m Директория ${projectName} уже существует`);
  process.exit(1);
}

console.log(`\n  \x1b[36mcreate-skillsbd\x1b[0m — создаю ${projectName}...\n`);

// Create structure
mkdirSync(join(targetDir, "skills", "example"), { recursive: true });

// package.json
writeFileSync(join(targetDir, "package.json"), JSON.stringify({
  name: projectName,
  version: "0.1.0",
  description: `Библиотека навыков для AI-агентов — ${projectName}`,
  bin: { [projectName]: "./cli.js" },
  type: "module",
  keywords: ["ai", "skills", "agents", "claude-code", "cursor", projectName],
  license: "MIT",
  engines: { node: ">=18" },
  files: ["cli.js", "skills/"],
}, null, 2) + "\n");

// CLI
writeFileSync(join(targetDir, "cli.js"), `#!/usr/bin/env node
import { existsSync, mkdirSync, cpSync, readdirSync, readFileSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEST = ".skills";
const NAME = "${projectName}";
const args = process.argv.slice(2);
const cmd = args[0];
const src = join(__dirname, "skills");
const dest = resolve(process.cwd(), DEST);

if (!cmd || cmd === "--help") {
  console.log(\`\\n  \\x1b[36m\${NAME}\\x1b[0m — навыки для AI-агентов\\n\\n  npx \${NAME} add <skill>   Установить\\n  npx \${NAME} list          Доступные\\n  npx \${NAME} installed     Установленные\\n\`);
  process.exit(0);
}

if (cmd === "list" || cmd === "ls") {
  const entries = readdirSync(src).filter(e => !e.startsWith("."));
  console.log("\\n  Доступные навыки:\\n");
  for (const e of entries) {
    const f = join(src, e, "SKILL.md");
    if (!existsSync(f)) continue;
    const c = readFileSync(f, "utf-8");
    const d = c.match(/description:\\s*(.+)/)?.[1] || e;
    console.log(\`  \\x1b[36m\${e}\\x1b[0m  \${d}\`);
  }
  console.log();
} else if (cmd === "installed") {
  if (!existsSync(dest)) { console.log("  Не установлено."); process.exit(0); }
  const e = readdirSync(dest).filter(x => !x.startsWith("."));
  console.log(\`\\n  Установлено: \${e.length}\\n\`);
  e.forEach(x => console.log(\`  \\x1b[36m\${x}\\x1b[0m\`));
  console.log();
} else if (cmd === "add") {
  const name = args[1];
  if (!name) { console.error("  Укажите навык"); process.exit(1); }
  const s = join(src, name);
  if (!existsSync(s)) { console.error(\`  Навык "\${name}" не найден\`); process.exit(1); }
  mkdirSync(join(dest, name), { recursive: true });
  cpSync(s, join(dest, name), { recursive: true });
  console.log(\`  \\x1b[32m✓\\x1b[0m Установлен: \${name}\`);
} else {
  console.error(\`  Неизвестная команда: \${cmd}\`);
  process.exit(1);
}
`);

// Example SKILL.md
writeFileSync(join(targetDir, "skills", "example", "SKILL.md"), `---
name: example
description: Пример навыка — замените на свой
---

# Example Skill

Это пример навыка. Замените содержимое на инструкции для AI-агента.

## Когда использовать

- Когда пользователь просит помощь с [вашей задачей]

## Инструкции

1. Сделать X
2. Проверить Y
3. Вернуть Z
`);

// README
writeFileSync(join(targetDir, "README.md"), `# ${projectName}

Библиотека навыков для AI-агентов.

## Установка

\`\`\`bash
npx ${projectName} add <skill-name>
npx ${projectName} list
\`\`\`

## Добавить навык

Создайте \`skills/<name>/SKILL.md\` и опубликуйте:

\`\`\`bash
npm publish --access public
\`\`\`

Для приватного реестра (GitHub Packages, Verdaccio):
\`\`\`bash
npm publish --registry=https://npm.pkg.github.com
\`\`\`

Сгенерировано с [create-skillsbd](https://skillsbd.ru).
`);

// .gitignore
writeFileSync(join(targetDir, ".gitignore"), "node_modules\n.env\n");

console.log(`  \x1b[32m✓\x1b[0m Создано: ${projectName}/`);
console.log(`\n  cd ${projectName}`);
console.log(`  # Добавьте навыки в skills/`);
console.log(`  npm publish --access public\n`);
console.log(`  Разработчики устанавливают:`);
console.log(`  npx ${projectName} add <skill-name>\n`);
