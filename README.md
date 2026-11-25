# Gather MCP Plugin (`shortcut-is/gather-plugin`)

Cross-platform plugin bundle connecting **Antigravity (AGY)**, **Claude Code**, **OpenAI Codex**, **Gemini CLI**, and **Cursor** to Gather's hosted Streamable HTTP MCP server (`https://gather.shortcut.is/api/mcp`) with zero-secret **OAuth 2.1 + PKCE**.

## Features

- **31 Studio Planning Tools (`v1.4.0`)**: Workspace summary, weekly schedule & utilization, capacity search, projects & phases, real pause/resume timeline shifting, allocations & placeholder roles, time off, custom studio holidays, and sales pipeline leads.
- **Native MCP Prompts**: `weekly-hygiene`, `capacity-check`, and `staff-project`.
- **Interactive SEP-1865 MCP App (`ui://gather/schedule-preview.html`)**: Renders inline studio utilization cards and weekly schedule heatmaps in supporting hosts.
- **On-Demand Skills & Self-Describing MCP Guardrails**: `gather-resourcing` and `gather-weekly-hygiene` (operational guardrails live in MCP `instructions`, typed tool schemas, and skills rather than always-on global rules).
- **OAuth 2.1 + PKCE (`S256`) & Dynamic Client Registration**: Automatic browser sign-in with workspace studio selector and live Gather role permission enforcement (`VIEWER` read-only, `SCHEDULER` resourcing/projects, `ADMIN` full incl. Pipeline).

---

## Quick Install (Zero-Secret OAuth 2.1)

### Claude Code (Plugin Marketplace)
```bash
/plugin marketplace add shortcut-is/gather-plugin
/plugin install gather@shortcut-gather
```
Or add the HTTP server directly:
```bash
claude mcp add --transport http gather https://gather.shortcut.is/api/mcp
```

### Antigravity (AGY)
Install from the Antigravity Plugins UI or symlink/install this repository (`plugin.json` + `mcp_config.json`).

### Gemini CLI (Extension or MCP)
```bash
gemini extensions install https://github.com/shortcut-is/gather-plugin
```
Or register the HTTP server directly:
```bash
gemini mcp add --transport http gather https://gather.shortcut.is/api/mcp
```

### OpenAI Codex
```bash
codex mcp add gather --url https://gather.shortcut.is/api/mcp
```
Plugin manifest available at `.codex-plugin/plugin.json` (with `codex/plugin.json` preserved for compatibility).

### Cursor
Add to `.cursor/mcp.json` or `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "gather": {
      "url": "https://gather.shortcut.is/api/mcp"
    }
  }
}
```

---

## Validation

Run the repository manifest validator before releasing:

```bash
node scripts/validate.mjs
```

## OAuth 2.1 vs API Keys

- **Interactive AI Clients (Recommended)**: Use **OAuth 2.1**. Connect with only `https://gather.shortcut.is/api/mcp`; Gather automatically advertises RFC 9728 / RFC 8414 discovery metadata, registers your client via RFC 7591, opens `/oauth/authorize` for studio & scope approval, and attributes every action to your Gather member account. Manage or revoke connected apps anytime in **Settings -> Workspace -> Integrations -> Connected AI apps**.
- **Headless Automation / CI**: Workspace Admins on Studio Pro can still create scoped `gth_live_…` Workspace API keys under **Settings -> Workspace -> Integrations -> Workspace API keys** (`read`, `projects:write`, `schedule:write`, `leads:write`).

## Security & Data Boundary

- Gather MCP never exposes billing rates, hourly cost rates, target margins, sold revenue/budget, or private time-off notes.
- Write tools support `dry_run: true` previews and 24-hour retry deduplication via `idempotency_key`.
- Security Policy: [SECURITY.md](SECURITY.md)
- Privacy Policy: https://gather.shortcut.is/privacy · Terms of Service: https://gather.shortcut.is/terms

## License

MIT — Shortcut (Toma El Atajo SAPI de CV)
