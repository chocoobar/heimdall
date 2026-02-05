---
name: 'step-02-analyze-waste'
description: 'Identify idle resources and over-provisioning'
workflow_path: 'workflows/cost-analysis'
thisStepFile: './step-02-analyze-waste.md'
nextStepFile: './step-03-recommendations.md'
---

# Step 2: Analyze Waste

**Goal:** Identify inefficiencies in resource usage.

---

## EXECUTION SEQUENCE

### 1. Compute Analysis

For Compute/Kubernetes resources:
- Check for Idle instances (< 5% CPU)
- Check for Over-provisioning (Allocated >> Used)
- Check for Spot opportunities (Stateless workloads)

### 2. Storage Analysis

For Storage/Database:
- Check for Unattached volumes
- Check for Old snapshots (> 90 days)
- Check for Cold data in hot tiers

### 3. Report Findings

```
🛡️ Waste Analysis.

Findings:
1. Compute: {compute_finding} (Est. Waste: ${amount})
2. Storage: {storage_finding} (Est. Waste: ${amount})
3. Other: ...
```

**WAIT for user input.**

Store in `{findings}`.

---

## NEXT STEP

Read fully and follow: `step-03-recommendations.md`
