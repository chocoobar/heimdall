---
name: 'step-01-gather-spend'
description: 'Collect cost data and define scope'
workflow_path: 'workflows/cost-analysis'
thisStepFile: './step-01-gather-spend.md'
nextStepFile: './step-02-analyze-waste.md'
---

# Step 1: Gather Spend Data

**Goal:** Define analysis scope and collect cost/utilization data.

---

## EXECUTION SEQUENCE

### 1. Define Scope

If `{scope}` not provided:

```
🛡️ Cost Analysis.

Analysis Scope:
[1] Single Service
[2] Team/Department
[3] Full Infrastructure
[4] Specific Resource (e.g. EC2, S3)
```

**WAIT for user input.**

Store `{scope}`.

### 2. Collect Data

```
🛡️ Cost Data Collection.

Provide current spend and utilization:
(Format: Resource | Monthly Cost | Avg Utilization)

Example:
EC2 | $5000 | 20%
RDS | $2000 | 45%
S3  | $500  | N/A
```

**WAIT for user input.**

Store in `{spend_data}`.

---

## NEXT STEP

Read fully and follow: `step-02-analyze-waste.md`
