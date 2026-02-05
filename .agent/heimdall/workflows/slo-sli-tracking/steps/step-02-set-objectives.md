---
name: 'step-02-set-objectives'
description: 'Set SLO targets and error budget'
workflow_path: 'workflows/slo-sli-tracking'
thisStepFile: './step-02-set-objectives.md'
nextStepFile: './step-03-generate-artifacts.md'
---

# Step 2: Set Objectives and Error Budgets

**Goal:** Define the reliability targets (SLOs) and calculate error budgets.

---

## EXECUTION SEQUENCE

### 1. Set Targets

For each SLI defined in Step 1:

```
🛡️ SLO Targets.

For SLI: {sli_name}

Target percentage (e.g. 99.9%):
Compliance Window (e.g. 28d, 30d):
```

**WAIT for user input.**

### 2. Calculate Error Budget

Calculate and display the error budget:

| SLO | Target | Error Budget (%) | Allowed Downtime/Window |
|-----|--------|------------------|-------------------------|
| {name} | {target} | {100-target} | {time_calc} |

Validate if this is realistic with the team/user.

```
Is this error budget realistic?
[Y] Accepted
[N] Adjust target
```

**WAIT for user input.**

Store final SLOs in `{slos}`.

---

## NEXT STEP

Read fully and follow: `step-03-generate-artifacts.md`
