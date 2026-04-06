-- Enable trigram extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN indexes for trigram search
CREATE INDEX IF NOT EXISTS idx_skill_name_trgm ON "Skill" USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_skill_desc_trgm ON "Skill" USING GIN (description gin_trgm_ops);
