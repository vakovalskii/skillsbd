import { vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => import("./mocks/prisma"));
vi.mock("@/lib/auth", () => import("./mocks/auth"));

beforeEach(() => {
  vi.clearAllMocks();
});
