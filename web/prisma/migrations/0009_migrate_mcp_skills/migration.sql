-- Migrate MCP servers that were submitted as skills to type "mcp"
UPDATE "Skill" SET "type" = 'mcp' WHERE "id" = 'cmn6evn2x0004nj01io3c135p'; -- mcp-max-messenger
UPDATE "Skill" SET "type" = 'mcp' WHERE "id" = 'cmn2zqm8r0006of01x6cwjslq'; -- 1c-lsp-mcp-skill
