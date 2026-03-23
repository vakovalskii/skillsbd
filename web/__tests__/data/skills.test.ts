import { describe, it, expect } from "vitest";
import { prisma } from "../mocks/prisma";
import { getSkills, getTotalInstalls, getTotalTrending, formatInstalls } from "@/data/skills";

describe("formatInstalls", () => {
  it("returns raw number under 1000", () => {
    expect(formatInstalls(0)).toBe("0");
    expect(formatInstalls(999)).toBe("999");
  });

  it("formats thousands as K", () => {
    expect(formatInstalls(1000)).toBe("1.0K");
    expect(formatInstalls(1500)).toBe("1.5K");
    expect(formatInstalls(42300)).toBe("42.3K");
  });

  it("formats millions as M", () => {
    expect(formatInstalls(1000000)).toBe("1.0M");
    expect(formatInstalls(2500000)).toBe("2.5M");
  });
});

describe("getSkills", () => {
  it("queries approved skills sorted by installs by default", async () => {
    prisma.skill.findMany.mockResolvedValue([]);
    await getSkills();
    expect(prisma.skill.findMany).toHaveBeenCalledWith({
      where: { status: "approved" },
      orderBy: { installs: "desc" },
      take: 100,
    });
  });

  it("sorts by trending when requested", async () => {
    prisma.skill.findMany.mockResolvedValue([]);
    await getSkills("trending");
    expect(prisma.skill.findMany).toHaveBeenCalledWith({
      where: { status: "approved" },
      orderBy: { trending24h: "desc" },
      take: 100,
    });
  });
});

describe("getTotalInstalls", () => {
  it("returns sum of installs", async () => {
    prisma.skill.aggregate.mockResolvedValue({ _sum: { installs: 5000 } });
    const result = await getTotalInstalls();
    expect(result).toBe(5000);
  });

  it("returns 0 when null", async () => {
    prisma.skill.aggregate.mockResolvedValue({ _sum: { installs: null } });
    const result = await getTotalInstalls();
    expect(result).toBe(0);
  });
});

describe("getTotalTrending", () => {
  it("returns sum of trending24h", async () => {
    prisma.skill.aggregate.mockResolvedValue({ _sum: { trending24h: 300 } });
    const result = await getTotalTrending();
    expect(result).toBe(300);
  });
});
