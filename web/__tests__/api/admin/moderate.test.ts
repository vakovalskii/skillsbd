import { describe, it, expect } from "vitest";
import { prisma } from "../../mocks/prisma";
import { auth } from "../../mocks/auth";
import { makeRequest } from "../../helpers/request";
import { GET, POST } from "@/app/api/admin/moderate/route";

describe("GET /api/admin/moderate", () => {
  it("returns 403 when unauthenticated", async () => {
    auth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(403);
  });

  it("returns 403 for non-admin user", async () => {
    auth.mockResolvedValue({ user: { id: "u2", email: "random@mail.com", name: "random" } });
    const res = await GET();
    expect(res.status).toBe(403);
  });

  it("returns pending skills for admin by email", async () => {
    auth.mockResolvedValue({ user: { id: "u1", email: "kovalskyvr@mail.ru", name: "someone" } });
    const mockPending = [{ id: "p1", name: "pending-skill", status: "pending" }];
    prisma.skill.findMany.mockResolvedValue(mockPending);

    const res = await GET();
    const data = await res.json();
    expect(data).toEqual(mockPending);
  });

  it("returns pending skills for admin by GitHub name", async () => {
    auth.mockResolvedValue({ user: { id: "u1", email: "other@mail.com", name: "vakovalskii" } });
    prisma.skill.findMany.mockResolvedValue([]);

    const res = await GET();
    expect(res.status).toBe(200);
  });
});

describe("POST /api/admin/moderate", () => {
  it("returns 403 for non-admin", async () => {
    auth.mockResolvedValue({ user: { id: "u2", email: "hacker@mail.com" } });

    const req = makeRequest("https://skillsbd.ru/api/admin/moderate", {
      method: "POST",
      body: { skillId: "s1", action: "approve" },
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("approves skill", async () => {
    auth.mockResolvedValue({ user: { id: "u1", email: "kovalskyvr@mail.ru" } });
    prisma.skill.update.mockResolvedValue({ id: "s1", status: "approved" });

    const req = makeRequest("https://skillsbd.ru/api/admin/moderate", {
      method: "POST",
      body: { skillId: "s1", action: "approve" },
    });
    const res = await POST(req);
    const data = await res.json();

    expect(prisma.skill.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { status: "approved" },
    });
  });

  it("rejects (deletes) skill", async () => {
    auth.mockResolvedValue({ user: { id: "u1", email: "kovalskyvr@mail.ru" } });
    prisma.skill.delete.mockResolvedValue({});

    const req = makeRequest("https://skillsbd.ru/api/admin/moderate", {
      method: "POST",
      body: { skillId: "s1", action: "reject" },
    });
    const res = await POST(req);
    const data = await res.json();

    expect(prisma.skill.delete).toHaveBeenCalledWith({ where: { id: "s1" } });
    expect(data.deleted).toBe(true);
  });

  it("returns 400 for invalid action", async () => {
    auth.mockResolvedValue({ user: { id: "u1", email: "kovalskyvr@mail.ru" } });

    const req = makeRequest("https://skillsbd.ru/api/admin/moderate", {
      method: "POST",
      body: { skillId: "s1", action: "invalid" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
