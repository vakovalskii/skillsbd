ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'pending';
UPDATE "Skill" SET status = 'approved' WHERE status = 'pending';
