---
name: 'step-03-recommendations'
description: 'Generate prioritized improvements'
workflow_path: 'workflows/cicd-reliability'
thisStepFile: './step-03-recommendations.md'
nextStepFile: null
---

# Step 3: Generate Recommendations

**Goal:** Provide actionable recommendations to improve pipeline reliability/speed.

---

## EXECUTION SEQUENCE

### 1. Identify Priorities

Based on low scores in step 2:

**Critical (score 1):** Immediate remediation needed.
**Needs Work (score 2):** Planned improvements.
**Good (score 3):** Optimization only.

### 2. Generate Recommendations

For each reliability gap, generate a recommendation:

**Example:**
- Gap: High flaky test rate (> 5%)
- Rec: Implement test quarantining and retry logic.
- Effort: Medium
- Impact: High

**Example:**
- Gap: Slow build time (> 20m)
- Rec: Implement dependency caching and parallelize test stages.
- Effort: Low
- Impact: High

### 3. Generate Report

Create report at `{sre_artifacts}/cicd/reliability-{pipeline}-{date}.md`.

Content:
1. **Executive Summary** (Score + DORA level)
2. **Metrics Analysis** (Current values vs targets)
3. **Health Assessment** (Detailed breakdown)
4. **Prioritized Recommendations** (P1/P2/P3 with effort/impact)

---

## FINAL OUTPUT

```
🛡️ CI/CD Reliability Report.

Pipeline: {pipeline_name}
Overall Score: {score}/100
DORA Level: {dora_level}

Top Recommendations:
1. {rec_1} (Impact: {impact})
2. {rec_2} (Impact: {impact})
3. {rec_3} (Impact: {impact})

Report saved: {output_path}
```

## WORKFLOW COMPLETE

```
Continue with:
[1] Analyze another pipeline
[2] Return to menu
```
