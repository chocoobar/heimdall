---
name: 'step-03-generate-handoff'
description: 'Generate and validate handoff document'
workflow_path: 'workflows/oncall-handoff'
thisStepFile: './step-03-generate-handoff.md'
nextStepFile: null
---

# Step 3: Generate Handoff Document

**Goal:** Compile collected data into a formal handoff document.

---

## EXECUTION SEQUENCE

### 1. Generate Document

Create `{sre_artifacts}/oncall/handoff-{date}.md` with:

```markdown
# On-Call Handoff
Date: {date}
Shift: {outgoing_engineer} -> {incoming_engineer}

## Status Overview
{status_summary}

## Active Incidents
{active_issues_table}

## Recent History
{recent_incidents_list}

## Upcoming Schedule
{scheduled_changes_table}

## Watch Items
{watch_items_list}

## Sign-off
Current On-call: {outgoing_engineer}
Next On-call: {incoming_engineer}
```

### 2. Acknowledgment

```
🛡️ Handoff Generated.

Review with incoming engineer.
[ ] Incoming engineer acknowledged receipt?
[ ] PagerDuty schedule updated?
```

## FINAL OUTPUT

```
🛡️ Handoff Complete.

Document: {output_path}
Status: Shift transferred.
```

## WORKFLOW COMPLETE

```
[1] Return to menu
```
