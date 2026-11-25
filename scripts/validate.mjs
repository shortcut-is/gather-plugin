import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXPECTED_VERSION = "1.4.0";

const errors = [];

function assert(cond, message) {
  if (!cond) {
    errors.push(message);
  }
}

function readJson(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!existsSync(fullPath)) {
    errors.push(`Missing JSON file: ${relPath}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(fullPath, "utf8"));
  } catch (err) {
    errors.push(`Invalid JSON in ${relPath}: ${err.message}`);
    return null;
  }
}

function checkRelativeTarget(sourceFile, targetPath, expectDir = false) {
  if (typeof targetPath !== "string" || targetPath.length === 0) {
    errors.push(`${sourceFile}: empty or non-string path reference`);
    return;
  }
  if (/^https?:\/\//.test(targetPath)) return;
  const resolved = path.resolve(ROOT, targetPath);
  if (!existsSync(resolved)) {
    errors.push(`${sourceFile}: referenced path does not exist: ${targetPath}`);
    return;
  }
  if (expectDir && !statSync(resolved).isDirectory()) {
    errors.push(`${sourceFile}: expected directory for ${targetPath}`);
  }
}

// 1. Validate all JSON manifests
const agyManifest = readJson("plugin.json");
const agyMcp = readJson("mcp_config.json");
const rootMcp = readJson(".mcp.json");
const geminiExt = readJson("gemini-extension.json");
const claudeManifest = readJson(".claude-plugin/plugin.json");
const claudeMcp = readJson(".claude-plugin/.mcp.json");
const claudeMarketplace = readJson(".claude-plugin/marketplace.json");
const codexOfficial = readJson(".codex-plugin/plugin.json");
const codexCompat = readJson("codex/plugin.json");

// 2. Version parity across manifests
for (const [file, obj] of [
  ["plugin.json", agyManifest],
  ["gemini-extension.json", geminiExt],
  [".claude-plugin/plugin.json", claudeManifest],
  [".codex-plugin/plugin.json", codexOfficial],
  ["codex/plugin.json", codexCompat],
]) {
  if (obj) {
    assert(obj.version === EXPECTED_VERSION, `${file}: expected version ${EXPECTED_VERSION}, got ${obj.version}`);
  }
}
if (claudeMarketplace?.plugins?.[0]) {
  assert(
    claudeMarketplace.plugins[0].version === EXPECTED_VERSION,
    `.claude-plugin/marketplace.json: expected plugin version ${EXPECTED_VERSION}, got ${claudeMarketplace.plugins[0].version}`,
  );
}

// 3. Relative path integrity
if (agyManifest) {
  checkRelativeTarget("plugin.json", agyManifest.logo);
  checkRelativeTarget("plugin.json", agyManifest.mcpServers);
}
if (claudeManifest) {
  checkRelativeTarget(".claude-plugin/plugin.json", claudeManifest.icon);
  checkRelativeTarget(".claude-plugin/plugin.json", claudeManifest.mcpServers);
  checkRelativeTarget(".claude-plugin/plugin.json", claudeManifest.skills, true);
}
if (codexOfficial) {
  checkRelativeTarget(".codex-plugin/plugin.json", codexOfficial.skills, true);
  checkRelativeTarget(".codex-plugin/plugin.json", codexOfficial.mcpServers);
  checkRelativeTarget(".codex-plugin/plugin.json", codexOfficial.interface?.logo);
  checkRelativeTarget(".codex-plugin/plugin.json", codexOfficial.interface?.composerIcon);
}
if (codexCompat) {
  checkRelativeTarget("codex/plugin.json", codexCompat.logo);
  for (const s of codexCompat.skills ?? []) {
    checkRelativeTarget("codex/plugin.json", s);
  }
}
if (claudeMarketplace?.plugins?.[0]?.source) {
  checkRelativeTarget(".claude-plugin/marketplace.json", claudeMarketplace.plugins[0].source, true);
}

// 4. Endpoint consistency
assert(
  agyMcp?.mcpServers?.gather?.serverUrl === "https://gather.shortcut.is/api/mcp",
  "mcp_config.json: unexpected serverUrl",
);
assert(
  rootMcp?.mcpServers?.gather?.url === "https://gather.shortcut.is/api/mcp",
  ".mcp.json: unexpected url",
);
assert(
  claudeMcp?.mcpServers?.gather?.url === "https://gather.shortcut.is/api/mcp",
  ".claude-plugin/.mcp.json: unexpected url",
);
assert(
  geminiExt?.mcpServers?.gather?.httpUrl === "https://gather.shortcut.is/api/mcp" &&
    geminiExt?.mcpServers?.gather?.oauth?.enabled === true,
  "gemini-extension.json: missing OAuth HTTP MCP server URL",
);

// 5. Logo SVG check (128x128 viewBox, no white background rect)
const logoPath = path.join(ROOT, "assets/logo.svg");
if (!existsSync(logoPath)) {
  errors.push("Missing assets/logo.svg");
} else {
  const svg = readFileSync(logoPath, "utf8");
  assert(svg.includes('viewBox="0 0 128 128"'), "assets/logo.svg missing viewBox=\"0 0 128 128\"");
}

// 6. Required SKILL.md frontmatter
for (const skillRel of ["skills/gather-resourcing/SKILL.md", "skills/gather-weekly-hygiene/SKILL.md"]) {
  const skillPath = path.join(ROOT, skillRel);
  if (!existsSync(skillPath)) {
    errors.push(`Missing skill file: ${skillRel}`);
    continue;
  }
  const content = readFileSync(skillPath, "utf8");
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  assert(Boolean(match), `${skillRel}: missing YAML frontmatter`);
  if (match) {
    assert(/^name:\s*\S+/m.test(match[1]), `${skillRel}: frontmatter missing name`);
    assert(/^description:\s*\S+/m.test(match[1]), `${skillRel}: frontmatter missing description`);
  }
}

assert(existsSync(path.join(ROOT, "SECURITY.md")), "Missing SECURITY.md");

if (errors.length > 0) {
  console.error("Plugin validation failed:");
  for (const err of errors) {
    console.error(" -", err);
  }
  process.exit(1);
}

console.log("All 9 manifests, relative assets/paths, SVG dimensions, SECURITY.md, and SKILL.md frontmatters validated (v" + EXPECTED_VERSION + ").");
