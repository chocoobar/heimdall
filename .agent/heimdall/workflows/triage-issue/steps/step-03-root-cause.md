---
name: 'step-03-root-cause'
description: 'Identify potential root causes with codebase reference'
workflow_path: 'workflows/triage-issue'
thisStepFile: './step-03-root-cause.md'
nextStepFile: './step-04-generate-report.md'
---

# Step 3: Root Cause Identification

**Goal:** Identify potential root causes and investigation paths, leveraging codebase when available.

---

## AVAILABLE STATE

From previous steps:
- `{ticket_id}` - JIRA ticket identifier
- `{ticket_data}` - Complete ticket content (including attachments)
- `{ticket_attachments}` - Attachment content (logs, configs)
- `{issue_category}` - Issue classification
- `{assessed_severity}` - Severity level
- `{identified_patterns}` - Recognized patterns
- `{impact_assessment}` - Impact metrics
- `{codebase_available}` - Whether codebase context is available
- `{project_root}` - Project root directory (if codebase available)

---

## ROOT CAUSE ANALYSIS

### 1. Apply 5 Whys Method

Based on the issue description and patterns, generate 5 Whys analysis:

```
Why 1: Why did the incident occur?
→ {immediate_cause}

Why 2: Why did {immediate_cause} happen?
→ {contributing_cause_1}

Why 3: Why did {contributing_cause_1} happen?
→ {contributing_cause_2}

Why 4: Why did {contributing_cause_2} happen?
→ {underlying_cause}

Why 5: Why did {underlying_cause} happen?
→ {root_cause_hypothesis}
```

Set `{root_cause_hypothesis}` based on analysis.

---

### 2. Codebase Investigation (if available)

**If `{codebase_available}` = true:**

Use the available tools to investigate the codebase:

#### 2.1 Search for Error Patterns

If error messages or stack traces are present in `{ticket_data}` or `{ticket_attachments}`:

```
Use grep_search to find error patterns in the codebase:
- Search for exception class names
- Search for error message strings
- Search for function names from stack traces
```

**Example:**
```
grep_search(Query: "ConnectionPoolExhausted", SearchPath: {project_root})
grep_search(Query: "TimeoutException", SearchPath: {project_root})
```

#### 2.2 Identify Affected Files

Based on stack traces or component names:

```
Use find_by_name to locate relevant files:
- Service files mentioned in errors
- Configuration files for affected components
- Database/API client implementations
```

#### 2.3 Analyze Recent Changes

If deploy correlation detected:

```
Use git commands to check recent changes:
git log --oneline -n 20
git diff HEAD~5 -- {affected_files}
```

#### 2.4 View Relevant Code

Once suspicious files are identified:

```
Use view_file to examine:
- Error handling code
- Configuration loading
- Connection pool settings
- Timeout configurations
```

**Store findings in `{code_analysis}`:**
- Files examined
- Suspicious code patterns found
- Configuration issues identified
- Missing error handling

---

### 3. Category-Specific Root Cause Trees

#### Availability Issues
```
Service Down
├── Deployment failure
│   ├── Bad code change → USE CODEBASE: Check recent commits
│   ├── Configuration error → USE CODEBASE: Check config files
│   └── Rollback failure
├── Resource exhaustion
│   ├── Memory leak → USE CODEBASE: Check for unbounded caches
│   ├── CPU saturation
│   └── Disk full
├── Dependency failure
│   ├── Database down
│   ├── Cache unavailable
│   └── External API failure → USE CODEBASE: Check retry logic
└── Infrastructure failure
```

#### Latency Issues
```
Slow Responses
├── Database queries
│   ├── Missing indexes → USE CODEBASE: Check query patterns
│   ├── Lock contention
│   └── Connection pool exhaustion → USE CODEBASE: Check pool config
├── Application issues
│   ├── N+1 queries → USE CODEBASE: Check ORM usage
│   ├── Synchronous blocking → USE CODEBASE: Check async patterns
│   └── Memory garbage collection
```

#### Capacity Issues
```
Resource Exhaustion
├── Memory leak
│   ├── Application bug → USE CODEBASE: Check for leaks
│   ├── Cache unbounded growth → USE CODEBASE: Check cache config
│   └── Connection leak → USE CODEBASE: Check connection handling
```

Select applicable branches based on `{issue_category}` and `{identified_patterns}`.

---

### 4. Evidence Mapping

Map evidence from ticket AND code analysis to hypotheses:

| Evidence Source | Evidence | Supports Hypothesis |
|----------------|----------|---------------------|
| JIRA | {evidence_1} | {hypothesis_1} |
| Attachment | {evidence_2} | {hypothesis_1}, {hypothesis_2} |
| Code Analysis | {code_finding_1} | {hypothesis_2} |
| Stack Trace | {evidence_3} | {hypothesis_1} |

Calculate confidence for each hypothesis:
- **High**: Multiple pieces of evidence + code confirms
- **Medium**: Some evidence, code partially supports
- **Low**: Plausible but lacks direct evidence

Set `{root_cause_confidence}` (high/medium/low).

---

### 5. Investigation Recommendations

Based on hypotheses, recommend investigation steps:

**Immediate Checks:**
```bash
# Check recent deployments
kubectl rollout history deployment/{service}

# Check resource usage
kubectl top pods -n {namespace}

# Check logs for errors
kubectl logs deployment/{service} --since=1h | grep -i error

# Check database connectivity
psql -h {host} -c "SELECT 1"
```

**Code-Level Investigation (if codebase available):**
```
Files to examine:
1. {file_1} - {reason}
2. {file_2} - {reason}
3. {file_3} - {reason}

Suspicious patterns found:
- {pattern_1} in {file}
- {pattern_2} in {file}
```

**Metrics to Review:**
- Error rate: {prometheus_query_1}
- Latency: {prometheus_query_2}
- Saturation: {prometheus_query_3}

Set `{investigation_recommendations}` with specific steps.

---

### 6. Similar Incidents Reference

If knowledge base contains similar incidents:

| Incident | Similarity | Resolution |
|----------|------------|------------|
| {incident_1} | {similarity_%} | {how_resolved} |
| {incident_2} | {similarity_%} | {how_resolved} |

Set `{similar_incidents}` for reference.

---

## OUTPUT

Display root cause analysis:
```
🛡️ Root Cause Analysis.

Primary Hypothesis: {root_cause_hypothesis}
Confidence: {root_cause_confidence}

Evidence:
- {evidence_1}
- {evidence_2}
{if code_analysis:}
- Code: {code_finding_1}
{/if}

Investigation Path:
1. {investigation_step_1}
2. {investigation_step_2}
3. {investigation_step_3}

{if codebase_available:}
Code Files to Review:
- {file_1}
- {file_2}
{/if}

Similar Incidents: {similar_incidents or "None found"}

Generating report.
```

---

## NEXT STEP

Read fully and follow: `step-04-generate-report.md`
