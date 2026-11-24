---
name: gather-resourcing
description: Studio resourcing and capacity scheduling workflow for Gather MCP. Use when staffing a project, checking bench availability, resolving overbooking, logging time off or studio holidays, or shifting project timelines.
---

# Gather Studio Resourcing Workflow

Use this playbook for staffing, capacity forecasting, and timeline adjustments in Gather.

## 1. Establish Studio Pulse & Entities

1. Call `gather_get_workspace_summary` to inspect the workspace timezone, `today`, team headcount, project counts, overbooked members, and bench availability.
2. Resolve exact entity IDs before planning changes:
   - People: `gather_list_people` (note `weeklyCapacity`, `workDays`, and `role`)
   - Projects & phases: `gather_list_projects` or `gather_get_project`
   - Clients & roles: `gather_list_clients`, `gather_list_roles`
3. When any list returns `has_more: true`, paginate with `offset: next_offset` before concluding.

## 2. Forecast Capacity & Staff Projects

1. Use `gather_find_available_capacity` with `role`, `start_date`, `end_date`, and `min_free_hours_per_week` (`every_week` vs `average`).
2. Inspect individual or project timelines via `gather_get_schedule` (`person` or `project` filters unlock up to 52-week windows).
3. Account for holidays and time off with `gather_list_time_off` — both public statutory holidays (scoped by `countryCode`) and custom studio closures reduce effective weekly capacity.

## 3. Execute Safe Writes (`dry_run` + `idempotency_key`)

- Always call `dry_run: true` first on write tools (`gather_create_allocation`, `gather_update_allocation`, `gather_delete_allocation`, `gather_pause_project`, `gather_create_phase`, `gather_create_project`, `gather_create_time_off`, `gather_create_custom_holiday`).
- Review any `overbooked` warnings (`>100%` weekly utilization) or schedule shifts with the user before re-running without `dry_run`.
- Include a stable `idempotency_key` on retryable creation mutations so network retries do not duplicate bookings or projects within a 24-hour window.
- For placeholder staffing gaps before hiring, create allocations with `placeholder_role` and backfill once assigned.
