---
name: 'step-03-recommendations'
description: 'Generate cost optimization report with ROI'
workflow_path: 'workflows/cost-analysis'
thisStepFile: './step-03-recommendations.md'
nextStepFile: null
---

# Step 3: Generate Recommendations

**Goal:** Provide actionable cost-saving recommendations with ROI.

---

## EXECUTION SEQUENCE

### 1. Generate Recommendations

For each finding in Step 2, generate a recommendation:

**Structure:**
- Action (e.g., Downsize Instance)
- Effort (Low/Med/High)
- Savings ($/month)
- Risk (Low/Med/High)

### 2. Generate Report

Create `{sre_artifacts}/cost/analysis-{date}.md`:

```markdown
# Cost Analysis Report
Date: {date}
Scope: {scope}

## Summary
Total Spend: ${total_spend}
Potential Savings: ${total_savings} ({percentage}%)

## Recommendations

### Quick Wins (Low Effort, Low Risk)
| Action | Savings | Priority |
|--------|---------|----------|
| {action} | ${amount} | P1 |

### Strategic Changes (Med/High Effort)
| Action | Savings | ROI Timeline |
|--------|---------|--------------|
| {action} | ${amount} | {months} |

## Detailed Findings
{detailed_findings}
```

### 3. Final Output

```
🛡️ Cost Analysis Complete.

Report: {output_path}
Total Potential Savings: ${total_savings}/month

Top Recommendation: {top_rec}
```

## WORKFLOW COMPLETE

```
[1] Return to menu
```
