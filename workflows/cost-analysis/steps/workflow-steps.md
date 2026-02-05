---
name: 'cost-analysis-steps'
description: 'Cost Analysis workflow steps'
---

# Cost Analysis Workflow

## Step 1: Define Scope

```
🛡️ Cost Analysis.

Analysis scope:
[1] Single service
[2] Team/Department
[3] Full infrastructure
[4] Specific resource type (compute, storage, network)
```

**WAIT for user input.**

---

## Step 2: Gather Cost Data

```
🛡️ Cost Data.

Provide cost data (paste or path):
- Cloud provider billing export
- Resource utilization metrics
- Current spend summary

Format: CSV, JSON, or paste summary

Or type 'MANUAL' for guided input.
```

**WAIT for user input.**

If manual:
```
| Resource Type | Current Cost | Utilization |
|---------------|--------------|-------------|
| Compute (VMs) | $___/month | ___% |
| Kubernetes | $___/month | ___% |
| Storage | $___/month | ___% |
| Network | $___/month | N/A |
| Database | $___/month | ___% |
| Other | $___/month | ___% |
```

---

## Step 3: Analyze Waste

Check for:

### Compute Waste
- [ ] Oversized instances (CPU <30% sustained)
- [ ] Idle resources (running but unused)
- [ ] On-demand where reserved/spot would work
- [ ] Orphaned volumes/snapshots

### Container Waste
- [ ] Over-provisioned requests/limits
- [ ] Low pod density
- [ ] Idle namespaces

### Storage Waste
- [ ] Unused volumes
- [ ] Old snapshots
- [ ] Wrong storage tier

### Database Waste
- [ ] Oversized instances
- [ ] Unused replicas
- [ ] Provisioned IOPS not utilized

---

## Step 4: Generate Recommendations

```
🛡️ Cost Optimization Report.

Current Monthly Spend: ${total}
Identified Savings: ${savings} ({percentage}%)

| # | Optimization | Savings | Effort | Risk |
|---|--------------|---------|--------|------|
| 1 | Right-size compute | ${x}/mo | Low | Low |
| 2 | Reserved instances | ${x}/mo | Med | Low |
| 3 | Delete unused | ${x}/mo | Low | Low |
| 4 | Storage tiering | ${x}/mo | Med | Med |

ROI Timeline:
- Quick wins (30 days): ${quick_savings}
- Medium term (90 days): ${medium_savings}
- Long term (6 months): ${long_savings}

Detailed Recommendations:

1. **Right-size Compute**
   Current: {instance_type}
   Recommended: {new_type}
   Savings: ${monthly}
   
2. **Reserved Instances**
   Resources: {list}
   Commitment: 1yr / 3yr
   Savings: ${monthly}

Report: {output_path}
```

---

## Step 5: Save Report

Save to `{sre_artifacts}/cost/analysis-{date}.md`.

Include:
- Executive summary
- Current spend breakdown
- Optimization recommendations with ROI
- Implementation timeline
- Risk assessment

```
🛡️ Cost analysis complete.

Scope: {scope}
Spend: ${total}/month
Savings: ${potential} ({percentage}%)
Report: {output_path}

Quick wins ready for implementation.
```
