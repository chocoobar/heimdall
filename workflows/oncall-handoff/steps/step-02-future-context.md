---
name: 'step-02-future-context'
description: 'Identify upcoming changes and watch items'
workflow_path: 'workflows/oncall-handoff'
thisStepFile: './step-02-future-context.md'
nextStepFile: './step-03-generate-handoff.md'
---

# Step 2: Future Context

**Goal:** Identify scheduled changes and potential risks for the incoming shift.

---

## EXECUTION SEQUENCE

### 1. Scheduled Changes

```
🛡️ Upcoming Changes.

Are there any maintenance windows or deployments scheduled?
```
If yes:
```
| Date/Time | Change Description | Owner |
|-----------|-------------------|-------|
| ... | ... | ... |
```

### 2. Things to Watch

```
🛡️ Watch Items.

Any shaky services, new features, or flaky alerts to watch?
- [ ] None
- [ ] ... (list items)
```

**WAIT for user input.**

Store in `{scheduled_changes}` and `{watch_items}`.

---

## NEXT STEP

Read fully and follow: `step-03-generate-handoff.md`
