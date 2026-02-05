---
name: 'step-01-collect-data'
description: 'Collect pipeline metrics and configuration'
workflow_path: 'workflows/cicd-reliability'
thisStepFile: './step-01-collect-data.md'
nextStepFile: './step-02-assess-health.md'
---

# Step 1: Collect Pipeline Data

**Goal:** Gather quantitative and qualitative data about the CI/CD pipeline.

---

## EXECUTION SEQUENCE

### 1. Identify Pipeline

If `{pipeline_name}` not provided:

```
🛡️ CI/CD Reliability Analysis.

Pipeline name: {pipeline_name or input}
CI System: [GitHub Actions] [GitLab CI] [Jenkins] [Other]
```

**WAIT for user input.**

Store `{pipeline_name}` and `{ci_system}`.

---

### 2. Collect Reliability Metrics

Ask for key reliability metrics (DORA + others):

```
🛡️ Pipeline Metrics Collection.

Provide values (or 'ESTIMATE'):

1. Build success rate (last 30d): ___%
2. Mean build time: ___ min
3. Flaky test rate: ___%
4. Deployment frequency: ___/week
5. Change failure rate: ___%
6. Mean time to recovery (pipeline failures): ___ min
```

**WAIT for user input.**

Store in `{metrics}` object.

---

### 3. Pipeline Structure

Ask about pipeline stages:

```
🛡️ Pipeline Configuration.

Does the pipeline include:
- [ ] Linting/Static Analysis
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] Security Scans
- [ ] Staging Deploy
- [ ] Production Deploy (Manual/Auto)
```

**WAIT for user input.**

Store in `{pipeline_components}`.

---

## NEXT STEP

Read fully and follow: `step-02-assess-health.md`
