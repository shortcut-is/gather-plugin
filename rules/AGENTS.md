# Gather Agent Guardrails

Always follow these operational rules when using the `gather` MCP server:

1. **Discover IDs first**: Start with `gather_get_workspace_summary`, then call `gather_list_people`, `gather_list_clients`, `gather_list_roles`, and `gather_list_projects` (or `gather_get_project`) before creating or modifying records. Never invent entity IDs, dates, or role names.
2. **Preview writes with `dry_run: true`**: Run `dry_run: true` before committing allocations, resizes, project pauses, or deletions, and summarize the resulting utilization / schedule-shift / overbooking (`>100%`) impact to the user before confirming writes.
3. **Deduplicate retries with `idempotency_key`**: Pass a unique `idempotency_key` on retryable creation and non-idempotent tools (`gather_create_project`, `gather_create_allocation`, `gather_create_phase`, `gather_pause_project`, `gather_create_time_off`, `gather_create_custom_holiday`, `gather_create_lead`, `gather_log_lead_activity`, `gather_convert_lead_to_project`) whenever re-trying an interrupted request.
4. **Pause vs status updates**: Use `gather_pause_project` and `gather_resume_project` for real pauses so open allocations and phases shift across calendar working days cleanly.
5. **Project statuses**: Gather normalizes completed/closed projects to `ARCHIVED` (`ACTIVE`, `TENTATIVE`, `PAUSED`, `ARCHIVED`). Never invent custom status strings.
6. **Boundary guarantees**: Gather MCP intentionally omits financials (rates, margins, revenue, cost) and private time-off notes. Never extrapolate or fabricate financial figures.
