-- CreateTable
CREATE TABLE IF NOT EXISTS "Audit" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "checkName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Audit_skillId_checkName_key" ON "Audit"("skillId", "checkName");
CREATE INDEX IF NOT EXISTS "Audit_skillId_idx" ON "Audit"("skillId");

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Audit_skillId_fkey') THEN
    ALTER TABLE "Audit" ADD CONSTRAINT "Audit_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
