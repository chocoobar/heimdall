---
name: 'step-02-assess-health'
description: 'Assess against reliability checklist'
workflow_path: 'workflows/cicd-reliability'
thisStepFile: './step-02-assess-health.md'
nextStepFile: './step-03-recommendations.md'
---

# Step 2: Assess Pipeline Health

**Goal:** Evaluate pipeline against SRE best practices and identify gaps.

---

## EXECUTION SEQUENCE

### 1. Build & Test Phase Assessment

Using `cicd-reliability-checklist.md` knowledge:

**Build Assessment:**
- [ ] Reproducible builds (pinned dependencies)?
- [ ] Build caching enabled?
- [ ] Artifacts versioned properly?
- [ ] Fast feedback loop (< 10 min)?

**Test Assessment:**
- [ ] Good coverage (> 80%)?
- [ ] Flaky tests managed/quarantined?
- [ ] Parallel execution?
- [ ] Test data isolation (no shared state)?

Score each: (Good / Needs Work / Critical)

### 2. Security & Deployment

**Security Assessment:**
- [ ] SAST enabled?
- [ ] Dependency scanning?
- [ ] Secret detection enabled?
- [ ] Container scanning?

**Deployment Assessment:**
- [ ] Minimal downtime strategy (Blue-Green/Canary)?
- [ ] Automated rollback capability?
- [ ] Feature flag usage?
- [ ] Health checks before/after deploy?

Score each: (Good / Needs Work / Critical)

### 3. Observability & DORA

**Observability:**
- [ ] Pipeline failure alerts?
- [ ] Deployment annotations in metrics?
- [ ] Logs centralized?

**DORA Level:**
Based on metrics from Step 1, classify:
- Elite / High / Medium / Low

---

## OUTPUT

Display interim assessment:

```
🛡️ Reliability Assessment.

Build Health: {build_score}
Test Health: {test_score}
Security: {security_score}
Deployment: {deployment_score}
Observability: {observability_score}

DORA Classification: {dora_level}

Proceeding to recommendations.
```

## NEXT STEP

Read fully and follow: `step-03-recommendations.md`
