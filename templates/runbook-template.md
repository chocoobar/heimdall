# Runbook: {RUNBOOK_TITLE}

## Document Information

| Field | Value |
|-------|-------|
| **Runbook ID** | RB-{SERVICE}-{NNN} |
| **Version** | 1.0 |
| **Last Updated** | {DATE} |
| **Author** | {AUTHOR} |
| **Owner** | {TEAM} |
| **Review Cycle** | Quarterly |
| **Next Review** | {DATE} |

---

## 1. Overview

### 1.1 Purpose

{BRIEF_DESCRIPTION_OF_WHAT_THIS_RUNBOOK_COVERS}

### 1.2 Scope

**This runbook covers:**
- {SCENARIO_1}
- {SCENARIO_2}
- {SCENARIO_3}

**This runbook does NOT cover:**
- {EXCLUSION_1}
- {EXCLUSION_2}

### 1.3 When to Use

Use this runbook when:
- [ ] {TRIGGER_CONDITION_1}
- [ ] {TRIGGER_CONDITION_2}
- [ ] {TRIGGER_CONDITION_3}

### 1.4 Expected Outcome

After completing this runbook:
- {EXPECTED_RESULT_1}
- {EXPECTED_RESULT_2}

### 1.5 Estimated Time

| Step | Duration |
|------|----------|
| Total Time | {MINUTES} minutes |
| Prerequisites | {MINUTES} minutes |
| Procedure | {MINUTES} minutes |
| Verification | {MINUTES} minutes |

---

## 2. Prerequisites

### 2.1 Required Access

| System | Access Level | How to Request |
|--------|--------------|----------------|
| {SYSTEM_1} | {LEVEL} | {REQUEST_PROCESS} |
| {SYSTEM_2} | {LEVEL} | {REQUEST_PROCESS} |

### 2.2 Required Tools

- [ ] {TOOL_1} - {PURPOSE}
- [ ] {TOOL_2} - {PURPOSE}
- [ ] {TOOL_3} - {PURPOSE}

### 2.3 Required Knowledge

- [ ] Understanding of {CONCEPT_1}
- [ ] Familiarity with {CONCEPT_2}
- [ ] Access to {RESOURCE}

### 2.4 Pre-checks

Before starting, verify:

```bash
# Check 1: Verify connectivity
{COMMAND_TO_CHECK}

# Check 2: Verify permissions
{COMMAND_TO_CHECK}

# Check 3: Verify service status
{COMMAND_TO_CHECK}
```

---

## 3. Procedure

### Step 1: {STEP_TITLE}

**Purpose:** {WHY_THIS_STEP}

**Actions:**

1. {ACTION_1}
   ```bash
   {COMMAND}
   ```

2. {ACTION_2}
   ```bash
   {COMMAND}
   ```

**Expected Output:**
```
{EXPECTED_OUTPUT}
```

**If this fails:**
- Check {TROUBLESHOOTING_HINT}
- See [Troubleshooting Section 6.1](#61-step-1-failures)

---

### Step 2: {STEP_TITLE}

**Purpose:** {WHY_THIS_STEP}

**Actions:**

1. {ACTION_1}
   ```bash
   {COMMAND}
   ```

2. {ACTION_2}
   ```bash
   {COMMAND}
   ```

**Expected Output:**
```
{EXPECTED_OUTPUT}
```

**If this fails:**
- Check {TROUBLESHOOTING_HINT}
- See [Troubleshooting Section 6.2](#62-step-2-failures)

---

### Step 3: {STEP_TITLE}

**Purpose:** {WHY_THIS_STEP}

**Actions:**

1. {ACTION_1}
   ```bash
   {COMMAND}
   ```

2. {ACTION_2}
   ```bash
   {COMMAND}
   ```

**Expected Output:**
```
{EXPECTED_OUTPUT}
```

**If this fails:**
- Check {TROUBLESHOOTING_HINT}
- See [Troubleshooting Section 6.3](#63-step-3-failures)

---

## 4. Rollback

> ⚠️ **IMPORTANT:** Use this section if the procedure needs to be reversed.

### 4.1 When to Rollback

Rollback if:
- {CONDITION_1}
- {CONDITION_2}
- {CONDITION_3}

### 4.2 Rollback Steps

1. **Stop current procedure**
   ```bash
   {COMMAND}
   ```

2. **Revert changes**
   ```bash
   {COMMAND}
   ```

3. **Restore previous state**
   ```bash
   {COMMAND}
   ```

4. **Verify rollback success**
   ```bash
   {COMMAND}
   ```

### 4.3 Post-Rollback Actions

- [ ] Notify {TEAM/CHANNEL}
- [ ] Create incident ticket if not already exists
- [ ] Document what went wrong

---

## 5. Verification

### 5.1 Success Criteria

| Check | Expected | Command |
|-------|----------|---------|
| {CHECK_1} | {EXPECTED} | `{COMMAND}` |
| {CHECK_2} | {EXPECTED} | `{COMMAND}` |
| {CHECK_3} | {EXPECTED} | `{COMMAND}` |

### 5.2 Verification Steps

1. **Verify service health**
   ```bash
   {COMMAND}
   ```
   Expected: `{OUTPUT}`

2. **Verify metrics**
   - Dashboard: {GRAFANA_URL}
   - Key metrics to check:
     - {METRIC_1}: should be {VALUE}
     - {METRIC_2}: should be {VALUE}

3. **Verify logs**
   ```bash
   {LOG_COMMAND}
   ```
   Look for: `{EXPECTED_LOG_PATTERN}`

### 5.3 Post-Procedure Checklist

- [ ] All verification checks passed
- [ ] Metrics returned to normal
- [ ] No new alerts triggered
- [ ] Documented execution in {LOCATION}
- [ ] Notified {TEAM/CHANNEL} of completion

---

## 6. Troubleshooting

### 6.1 Step 1 Failures

**Symptom:** {SYMPTOM_DESCRIPTION}

**Possible Causes:**
1. {CAUSE_1}
2. {CAUSE_2}

**Resolution:**
```bash
{RESOLUTION_COMMAND}
```

---

### 6.2 Step 2 Failures

**Symptom:** {SYMPTOM_DESCRIPTION}

**Possible Causes:**
1. {CAUSE_1}
2. {CAUSE_2}

**Resolution:**
```bash
{RESOLUTION_COMMAND}
```

---

### 6.3 Step 3 Failures

**Symptom:** {SYMPTOM_DESCRIPTION}

**Possible Causes:**
1. {CAUSE_1}
2. {CAUSE_2}

**Resolution:**
```bash
{RESOLUTION_COMMAND}
```

---

### 6.4 Common Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| {ISSUE_1} | {SYMPTOM} | {SOLUTION} |
| {ISSUE_2} | {SYMPTOM} | {SOLUTION} |
| {ISSUE_3} | {SYMPTOM} | {SOLUTION} |

---

## 7. Escalation

### 7.1 When to Escalate

Escalate if:
- Runbook steps don't resolve the issue
- Rollback fails
- Impact exceeds expected scope
- Unsure about proceeding

### 7.2 Escalation Path

| Level | Contact | When |
|-------|---------|------|
| L1 | {TEAM_SLACK_CHANNEL} | First attempt |
| L2 | {ON_CALL_ENGINEER} | After 15 min |
| L3 | {ENGINEERING_MANAGER} | After 30 min |
| L4 | {VP_ENGINEERING} | P1 incidents |

### 7.3 Information to Provide

When escalating, include:
- Runbook being executed: {RUNBOOK_ID}
- Step where issue occurred: Step {N}
- Error message/symptom: {DESCRIPTION}
- Actions already taken: {LIST}
- Current impact: {DESCRIPTION}

---

## 8. Related Resources

### 8.1 Related Runbooks

- [RB-{SERVICE}-{NNN}]({LINK}): {DESCRIPTION}
- [RB-{SERVICE}-{NNN}]({LINK}): {DESCRIPTION}

### 8.2 Dashboards

- [Service Dashboard]({GRAFANA_URL})
- [Infrastructure Dashboard]({GRAFANA_URL})

### 8.3 Documentation

- [Architecture Doc]({CONFLUENCE_URL})
- [API Documentation]({URL})

### 8.4 Contacts

| Role | Name | Contact |
|------|------|---------|
| Service Owner | {NAME} | @{SLACK_HANDLE} |
| On-Call | {ROTATION} | {PAGERDUTY_LINK} |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {DATE} | {AUTHOR} | Initial version |

---

*Last tested: {DATE} by {NAME}*
*Next scheduled test: {DATE}*
