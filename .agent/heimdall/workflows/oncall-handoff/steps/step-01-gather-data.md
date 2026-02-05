---
name: 'step-01-gather-data'
description: 'Gather current status and incidents'
workflow_path: 'workflows/oncall-handoff'
thisStepFile: './step-01-gather-data.md'
nextStepFile: './step-02-future-context.md'
---

# Step 1: Gather Data

**Goal:** Collect information about current status and recent incidents.

---

## EXECUTION SEQUENCE

### 1. Shift Information

If inputs not provided:

```
🛡️ On-Call Handoff.

Outgoing Engineer: {outgoing_engineer or input}
Incoming Engineer: {incoming_engineer or input}
```

**WAIT for user input.**

### 2. Status Check

```
🛡️ Systems Status.

Are there any active ongoing incidents? [Y/N]
```

If Y, gather details:
```
| ID | Severity | Status | Summary |
|----|----------|--------|---------|
| ... | ... | ... | ... |
```

### 3. Recent History

```
🛡️ Recent Incidents (Last 7 Days).

List resolved incidents/alerts:
- [ ] No major incidents
- [ ] ... (provide ID/Summary)
```

**WAIT for user input.**

Store in `{active_issues}` and `{recent_incidents}`.

---

## NEXT STEP

Read fully and follow: `step-02-future-context.md`
