import { describe, it, expect } from "vitest";
import { prisma } from "../../mocks/prisma";
import { auth } from "../../mocks/auth";
import { makeRequest } from "../../helpers/request";
import { POST } from "@/app/api/skills/submit/route";

describe("POST /api/skills/submit", () => {
  it("returns 401 when unauthenticated", async () => {
    auth.mockResolvedValue(null);

    const req = makeRequest("https://skillsbd.ru/api/skills/submit", {
      method: "POST",
      body: { name: "x", owner: "o", repo: "r", description: "d", category: "c" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields missing", async () => {
    auth.mockResolvedValue({ user: { id: "u1" } });

    const req = makeRequest("https://skillsbd.ru/api/skills/submit", {
      method: "POST",
      body: { name: "test" }, // missing owner, repo, description, category
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates skill with status pending", async () => {
    auth.mockResolvedValue({ user: { id: "u1" } });
    prisma.skill.create.mockResolvedValue({ id: "new1", name: "test", status: "pending" });

    const req = makeRequest("https://skillsbd.ru/api/skills/submit", {
      method: "POST",
      body: {
        name: "my-skill",
        owner: "me",
        repo: "my-repo",
        description: "does stuff",
        category: "утилиты",
        authorName: "Author",
        telegramLink: "https://t.me/test",
      },
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    expect(prisma.skill.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "my-skill",
        status: "pending",
        authorId: "u1",
      }),
    });
  });
});
