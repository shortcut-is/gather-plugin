---
name: gather-weekly-hygiene
description: Weekly studio operations hygiene runbook for Gather MCP. Use when auditing ended schedules to archive, overbooked team members, unassigned role placeholders, stale sales leads, or due follow-ups.
---

# Gather Weekly Studio Hygiene Runbook

Follow this structured sequence (or invoke Gather's native `weekly-hygiene` MCP prompt) to clean up schedule drift and pipeline staleness without unexpected writes.

## 1. Gather Diagnostic Signals (Read-Only)

1. Run `gather_get_workspace_summary` for current-week utilization and overbooked/bench flags.
2. Call `gather_list_projects` (default `ACTIVE` + `TENTATIVE`) and identify:
   - Active projects flagged `is_schedule_ended: true` (latest booking ended more than 7 days ago).
   - Active projects with zero upcoming allocations (`upcoming_allocations: 0`).
3. Call `gather_get_schedule` for the next 2–5 weeks to spot `>100%` overbookings and unfilled `placeholder_role` bookings.
4. If the workspace has Pipeline enabled (and your session holds Admin permissions), call `gather_get_pipeline_summary` and `gather_list_leads` with `stale_only: true` and `wake_up_due: true`.
5. Call `gather_list_time_off` for the upcoming 4 weeks so staffing changes respect vacations and studio holidays.

## 2. Present Findings & Confirm Item-by-Item

Group recommendations into concise action buckets:
- **Projects ready to archive** (`gather_update_project` → `status: "ARCHIVED"`)
- **Projects to pause/resume** (`gather_pause_project` / `gather_resume_project`)
- **Overbooked weeks to rebalance** (`gather_update_allocation` / `gather_create_allocation` with `dry_run: true` previews)
- **Stale leads & due wake-ups** (`gather_log_lead_activity`, `gather_update_lead`, or `gather_convert_lead_to_project`)

**Never** apply batch mutations silently. Present exact proposed changes and wait for confirmation (using `dry_run: true` and `idempotency_key` on writes).
