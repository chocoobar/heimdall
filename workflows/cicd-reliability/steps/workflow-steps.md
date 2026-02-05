---
name: 'cicd-reliability-steps'
description: 'Combined CI/CD reliability workflow steps'
---

# CI/CD Reliability Workflow

## Step 1: Collect Pipeline Data

```
🛡️ CI/CD Reliability Analysis.

Pipeline name: _______
CI System: [GitHub Actions] [GitLab CI] [Jenkins] [Other]
```

**WAIT for user input.**

Collect metrics:

| Metric | Value |
|--------|-------|
| Build success rate (30d) | ___% |
| Mean build time | ___ min |
| Flaky test rate | ___% |
| Deployment frequency | ___ /week |
| Change failure rate | ___% |
| Mean time to recovery | ___ min |

```
🛡️ Provide metrics or 'ESTIMATE' to skip.
```

---

## Step 2: Assess Pipeline Health

Using knowledge base `cicd-reliability-checklist.md`, evaluate:

### Build Phase
- [ ] Reproducible builds
- [ ] Dependency pinning
- [ ] Build caching
- [ ] Artifact management

### Test Phase
- [ ] Test coverage >80%
- [ ] No flaky tests (or quarantined)
- [ ] Parallel test execution
- [ ] Test data isolation

### Security
- [ ] SAST scanning
- [ ] Dependency scanning
- [ ] Container scanning
- [ ] Secret detection

### Deployment
- [ ] Blue-green/Canary
- [ ] Automated rollback
- [ ] Feature flags
- [ ] Health checks

### Observability
- [ ] Pipeline metrics
- [ ] Deployment annotations
- [ ] Alerting on failures

**Score each area:** Good (3) / Needs Work (2) / Critical (1)

---

## Step 3: Generate Recommendations

Based on assessment, prioritize improvements:

```
🛡️ Pipeline Reliability Report.

Overall Score: {score}/100

| Area | Score | Status |
|------|-------|--------|
| Build | {x}/3 | {status} |
| Test | {x}/3 | {status} |
| Security | {x}/3 | {status} |
| Deployment | {x}/3 | {status} |
| Observability | {x}/3 | {status} |

Top Recommendations:

1. [P1] {recommendation}
   Impact: {impact}
   Effort: {effort}

2. [P2] {recommendation}
   Impact: {impact}
   Effort: {effort}

DORA Metrics Assessment:
- Deployment Frequency: {level}
- Lead Time: {level}
- Change Failure Rate: {level}
- MTTR: {level}

Report: {output_path}
```
