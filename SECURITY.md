# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in `shortcut-is/gather-plugin` or the Gather Remote MCP server (`https://gather.shortcut.is/api/mcp`), please report it responsibly before public disclosure.

**Email:** security@shortcut.is (or hola@shortcut.is)

Please include:

- A concise description of the vulnerability and affected endpoint or manifest
- Reproduction steps or a minimal proof of concept
- Potential security impact (e.g., OAuth token handling, scope boundary, multi-tenant isolation)

We aim to acknowledge reports within **2 business days** and deliver a fix or mitigation plan within **7 business days** for critical issues.

## Scope

This policy covers:

- The `shortcut-is/gather-plugin` repository (manifests, skills, rules, and installation docs)
- Gather's Remote MCP & OAuth 2.1 endpoints under `https://gather.shortcut.is/api/mcp`, `https://gather.shortcut.is/.well-known/*`, `https://gather.shortcut.is/api/oauth/*`, and `https://gather.shortcut.is/oauth/authorize`

## Privacy & Data Boundary

Gather MCP intentionally excludes financial metrics (hourly rates, cost rates, sold revenue, margins, budgets) and private time-off notes. Every OAuth grant is strictly scoped to one studio and bounded live by the authenticated user's Gather role (`VIEWER`, `SCHEDULER`, or `ADMIN`).
