import { describe, it, expect } from "vitest";
import { prisma } from "../mocks/prisma";
import { toSlug, formatInstalls } from "@/data/skills";
import { mcpServers } from "@/data/mcp-servers";

// --- Skill interface validation ---

const REQUIRED_SKILL_FIELDS = [
  "id",
  "name",
  "owner",
  "repo",
  "description",
  "installs",
  "trending24h",
  "category",
  "tags",
  "type",
  "status",
  "createdAt",
];

const VALID_TYPES = ["skill", "mcp"];
const VALID_STATUSES = ["approved", "pending", "rejected"];

function validateSkill(skill: Record<string, unknown>): string[] {
  const errors: string[] = [];

  // Required fields
  for (const field of REQUIRED_SKILL_FIELDS) {
    if (skill[field] === undefined || skill[field] === null) {
      errors.push(`missing field: ${field}`);
    }
  }

  // Name: no leading/trailing whitespace
  if (typeof skill.name === "string") {
    if (skill.name !== skill.name.trim()) {
      errors.push(`name has leading/trailing whitespace: "${skill.name}"`);
    }
    if (skill.name.length === 0) {
      errors.push("name is empty");
    }
  }

  // Type validation
  if (!VALID_TYPES.includes(skill.type as string)) {
    errors.push(`invalid type: ${skill.type}`);
  }

  // Status validation
  if (!VALID_STATUSES.includes(skill.status as string)) {
    errors.push(`invalid status: ${skill.status}`);
  }

  // Tags: must be array, not empty for approved
  if (skill.status === "approved") {
    if (!Array.isArray(skill.tags) || skill.tags.length === 0) {
      errors.push(`approved skill has no tags: ${skill.name}`);
    }
  }

  // Description: not empty
  if (typeof skill.description === "string" && skill.description.trim().length < 10) {
    errors.push(`description too short: "${skill.description}"`);
  }

  // Owner: not empty, no spaces
  if (typeof skill.owner === "string") {
    if (skill.owner.trim().length === 0) {
      errors.push("owner is empty");
    }
  }

  // Installs: non-negative
  if (typeof skill.installs === "number" && skill.installs < 0) {
    errors.push(`negative installs: ${skill.installs}`);
  }

  // Trending: non-negative
  if (typeof skill.trending24h === "number" && skill.trending24h < 0) {
    errors.push(`negative trending24h: ${skill.trending24h}`);
  }

  // Trending should not exceed installs (sanity check)
  if (
    typeof skill.trending24h === "number" &&
    typeof skill.installs === "number" &&
    skill.trending24h > skill.installs + 10
  ) {
    errors.push(
      `trending24h (${skill.trending24h}) exceeds installs (${skill.installs})`
    );
  }

  return errors;
}

describe("Skill validation", () => {
  it("validates a correct skill", () => {
    const good = {
      id: "abc",
      name: "test-skill",
      owner: "user",
      repo: "repo",
      description: "A test skill for doing things",
      installs: 10,
      trending24h: 5,
      category: "утилиты",
      tags: ["test"],
      type: "skill",
      status: "approved",
      createdAt: "2026-01-01",
    };
    expect(validateSkill(good)).toEqual([]);
  });

  it("catches leading whitespace in name", () => {
    const bad = {
      id: "1",
      name: " bad-name",
      owner: "user",
      repo: "repo",
      description: "A description here",
      installs: 0,
      trending24h: 0,
      category: "x",
      tags: ["t"],
      type: "skill",
      status: "approved",
      createdAt: "2026-01-01",
    };
    const errors = validateSkill(bad);
    expect(errors.some((e) => e.includes("whitespace"))).toBe(true);
  });

  it("catches empty tags on approved skill", () => {
    const bad = {
      id: "1",
      name: "no-tags",
      owner: "user",
      repo: "repo",
      description: "A description here",
      installs: 0,
      trending24h: 0,
      category: "x",
      tags: [],
      type: "skill",
      status: "approved",
      createdAt: "2026-01-01",
    };
    const errors = validateSkill(bad);
    expect(errors.some((e) => e.includes("no tags"))).toBe(true);
  });

  it("catches trending exceeding installs", () => {
    const bad = {
      id: "1",
      name: "sus",
      owner: "user",
      repo: "repo",
      description: "A description for testing",
      installs: 5,
      trending24h: 100,
      category: "x",
      tags: ["t"],
      type: "skill",
      status: "approved",
      createdAt: "2026-01-01",
    };
    const errors = validateSkill(bad);
    expect(errors.some((e) => e.includes("exceeds installs"))).toBe(true);
  });

  it("catches invalid type", () => {
    const bad = {
      id: "1",
      name: "bad",
      owner: "user",
      repo: "repo",
      description: "A description for testing",
      installs: 0,
      trending24h: 0,
      category: "x",
      tags: ["t"],
      type: "invalid",
      status: "approved",
      createdAt: "2026-01-01",
    };
    const errors = validateSkill(bad);
    expect(errors.some((e) => e.includes("invalid type"))).toBe(true);
  });
});

// --- toSlug ---

describe("toSlug consistency", () => {
  it("produces lowercase slugs", () => {
    expect(toSlug("My Skill Name")).toBe("my-skill-name");
  });

  it("handles cyrillic", () => {
    const slug = toSlug("яндекс-метрика");
    expect(slug).toBe("яндекс-метрика");
  });

  it("removes special characters", () => {
    expect(toSlug("skill@v2.0!")).toBe("skillv20");
  });

  it("collapses spaces to hyphens", () => {
    expect(toSlug("Laravel API  Skill")).toBe("laravel-api-skill");
  });
});

// --- formatInstalls ---

describe("formatInstalls edge cases", () => {
  it("handles zero", () => {
    expect(formatInstalls(0)).toBe("0");
  });

  it("handles negative (should not happen but not crash)", () => {
    const result = formatInstalls(-1);
    expect(typeof result).toBe("string");
  });

  it("handles very large numbers", () => {
    expect(formatInstalls(999999999)).toMatch(/M/);
  });
});

// --- Static MCP data ---

describe("static MCP servers data", () => {
  it("all servers have required fields", () => {
    for (const server of mcpServers) {
      expect(server.name, `name missing`).toBeTruthy();
      expect(server.slug, `slug missing for ${server.name}`).toBeTruthy();
      expect(server.desc, `desc missing for ${server.name}`).toBeTruthy();
      expect(server.author, `author missing for ${server.name}`).toBeTruthy();
      expect(server.category, `category missing for ${server.name}`).toBeTruthy();
      expect(Array.isArray(server.tags), `tags not array for ${server.name}`).toBe(true);
      expect(server.tags.length, `no tags for ${server.name}`).toBeGreaterThan(0);
    }
  });

  it("all slugs are unique", () => {
    const slugs = mcpServers.map((s) => s.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  it("no empty install instructions", () => {
    for (const server of mcpServers) {
      expect(server.install.length, `empty install for ${server.name}`).toBeGreaterThan(0);
    }
  });

  it("URLs are valid", () => {
    for (const server of mcpServers) {
      expect(
        server.url.startsWith("http"),
        `bad URL for ${server.name}: ${server.url}`
      ).toBe(true);
    }
  });
});

// --- RU tag detection consistency ---

describe("RU tag detection", () => {
  const RU_TAGS = [
    "яндекс",
    "1с",
    "1c",
    "битрикс24",
    "gigachat",
    "сбер",
    "российские сервисы",
  ];

  function isRuSkill(tags: string[]): boolean {
    return tags.some((t) => RU_TAGS.includes(t.toLowerCase()));
  }

  it("detects yandex skills as RU", () => {
    expect(isRuSkill(["яндекс", "метрика"])).toBe(true);
  });

  it("detects 1C skills as RU", () => {
    expect(isRuSkill(["1с", "разработка"])).toBe(true);
    expect(isRuSkill(["1c", "enterprise"])).toBe(true);
  });

  it("detects gigachat as RU", () => {
    expect(isRuSkill(["gigachat", "sdk"])).toBe(true);
  });

  it("detects 'российские сервисы' tag", () => {
    expect(isRuSkill(["dadata", "российские сервисы"])).toBe(true);
  });

  it("does not flag non-RU skills", () => {
    expect(isRuSkill(["react", "frontend"])).toBe(false);
    expect(isRuSkill(["docker", "devops"])).toBe(false);
  });

  it("case insensitive", () => {
    expect(isRuSkill(["GigaChat", "API"])).toBe(true);
    expect(isRuSkill(["ЯНДЕКС"])).toBe(true);
  });
});

// Export for potential reuse
export { validateSkill };
