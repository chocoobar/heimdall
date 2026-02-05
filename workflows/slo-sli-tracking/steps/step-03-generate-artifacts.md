---
name: 'step-03-generate-artifacts'
description: 'Generate recording rules and dashboards'
workflow_path: 'workflows/slo-sli-tracking'
thisStepFile: './step-03-generate-artifacts.md'
nextStepFile: null
---

# Step 3: Generate Artifacts

**Goal:** Generate Prometheus rules and Grafana dashboard configurations.

---

## EXECUTION SEQUENCE

### 1. Prometheus Rules

Generate `rules-{service}.yaml`:

```yaml
groups:
  - name: slo-{service}
    interval: 30s
    rules:
      # Recording Rules
      - record: slo:availability:rate5m
        expr: {availability_expression}
        
      # Alerting Rules (Burn rates)
      - alert: SLOBurnRateFast
        expr: slo:burn_rate_1h > 14.4
        for: 2m
        labels:
          severity: page
```

### 2. Dashboard Config

Generate `dashboard-{service}.json` (or simplified YAML rep):
- Panel 1: Availability over time
- Panel 2: Error Budget Remaining
- Panel 3: Burn Rate

### 3. Save Output

Save all artifacts to `{sre_artifacts}/slo/`.

---

## FINAL OUTPUT

```
🛡️ SLO Tracking Setup Complete.

Artifacts:
1. SLO Definition: {slo_doc_path}
2. Prometheus Rules: {rules_path}
3. Dashboard: {dashboard_path}

Next Steps:
1. Deploy rules to Prometheus
2. Import dashboard to Grafana
```

## WORKFLOW COMPLETE

```
Continue with:
[1] Define another SLO
[2] Return to menu
```
