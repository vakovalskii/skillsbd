import { vi } from "vitest";

export const auth = vi.fn().mockResolvedValue(null);
export const handlers = {};
export const signIn = vi.fn();
export const signOut = vi.fn();
