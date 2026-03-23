import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../mocks/prisma";
import { makeRequest } from "../../helpers/request";
import { POST } from "@/app/api/skills/install/route";

describe("POST /api/skills/install", () => {
  it("returns 400 when name missing", async () => {
    const req = makeRequest("https://skillsbd.ru/api/skills/install", {
      method: "POST",
      body: { owner: "x", repo: "y" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns tracked:false when version missing", async () => {
    const req = makeRequest("https://skillsbd.ru/api/skills/install", {
      method: "POST",
      body: { name: "test-skill" },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.tracked).toBe(false);
    expect(data.reason).toContain("version");
  });

  it("increments installs when skill found", async () => {
    const mockSkill = { id: "s1", name: "test", installs: 10 };
    prisma.skill.findFirst.mockResolvedValue(mockSkill);
    prisma.skill.update.mockResolvedValue({ ...mockSkill, installs: 11 });

    const req = makeRequest("https://skillsbd.ru/api/skills/install", {
      method: "POST",
      body: { name: "test", owner: "o", repo: "r", v: "0.3.1" },
      ip: "10.0.0.1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(data.tracked).toBe(true);
    expect(prisma.skill.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: {
        installs: { increment: 1 },
        trending24h: { increment: 1 },
      },
    });
  });

  it("returns tracked:false when skill not in catalog", async () => {
    prisma.skill.findFirst.mockResolvedValue(null);

    const req = makeRequest("https://skillsbd.ru/api/skills/install", {
      method: "POST",
      body: { name: "unknown", v: "0.3.1" },
      ip: "10.0.0.2",
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.tracked).toBe(false);
    expect(data.reason).toContain("not in catalog");
  });
});
