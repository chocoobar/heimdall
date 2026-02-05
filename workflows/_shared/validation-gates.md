---
name: 'validation-gates'
description: 'Reusable validation functions for SRE outputs'
---

# Validation Gates

## Overview

This helper provides reusable validation functions for SRE workflow outputs.

---

## PromQL Syntax Validation

```yaml
function: validate_promql
inputs:
  query: string
outputs:
  valid: boolean
  errors: array
  suggestions: array
```

**Validation Rules:**

1. **Balanced Delimiters**
   - Parentheses: `(` and `)`
   - Brackets: `[` and `]`
   - Braces: `{` and `}`

2. **Valid Metric Names**
   - Pattern: `[a-zA-Z_:][a-zA-Z0-9_:]*`
   - No spaces or special characters

3. **Valid Label Matchers**
   - Operators: `=`, `!=`, `=~`, `!~`
   - Quoted values: `label="value"`
   - Valid regex for `=~` and `!~`

4. **Valid Functions**
   - Known functions: rate, irate, sum, avg, max, min, histogram_quantile, etc.
   - Correct argument count

5. **Valid Duration**
   - Pattern: `[0-9]+[smhdwy]`
   - Examples: `5m`, `1h`, `30s`

**Output:**
```yaml
valid: true/false
errors:
  - line: 1
    position: 15
    message: "Missing closing parenthesis"
suggestions:
  - "Add ')' at position 25"
```

---

## Template Compliance Validation

```yaml
function: validate_template_compliance
inputs:
  document: string
  template_type: string (rca, coe, runbook)
outputs:
  compliant: boolean
  missing_sections: array
  incomplete_sections: array
```

**Validation by Template:**

### RCA Template
Required sections:
- [ ] Document Information
- [ ] Incident Summary
- [ ] Impact Assessment
- [ ] Timeline (minimum 3 events)
- [ ] 5 Whys Analysis (all 5 levels)
- [ ] Root Cause Statement
- [ ] Recommendations
- [ ] Lessons Learned

### COE Template
Required sections:
- [ ] General Information
- [ ] Impact Assessment
- [ ] Timeline with milestones
- [ ] Root Cause Analysis
- [ ] Detection, Diagnosis & Mitigation
- [ ] Action Plan (with owners and dates)
- [ ] Lessons Learned

### Runbook Template
Required sections:
- [ ] Overview
- [ ] Prerequisites
- [ ] Procedure
- [ ] Rollback
- [ ] Verification
- [ ] Troubleshooting

**Output:**
```yaml
compliant: true/false
missing_sections:
  - "Rollback"
incomplete_sections:
  - section: "Action Plan"
    issue: "Missing owner for item 3"
```

---

## Code Syntax Validation

```yaml
function: validate_code_syntax
inputs:
  code: string
  language: string (sql, python, typescript, bash)
outputs:
  valid: boolean
  errors: array
```

**SQL Validation:**
- Balanced quotes
- Valid keywords
- Semicolon termination
- No obvious injection patterns

**Python/TypeScript Validation:**
- Balanced brackets and quotes
- Valid indentation (Python)
- No obvious syntax errors

**Bash Validation:**
- Valid command structure
- Quoted variables for safety
- No dangerous patterns (`rm -rf /`, etc.)

---

## Runbook Completeness Validation

```yaml
function: validate_runbook_completeness
inputs:
  runbook: string
outputs:
  complete: boolean
  missing: array
  warnings: array
```

**Required Elements:**
- [ ] All sections present
- [ ] Commands are executable (not placeholders)
- [ ] Expected outputs documented
- [ ] Rollback procedure included
- [ ] Escalation contacts listed
- [ ] Last tested date

**Warnings:**
- Commands without expected output
- Steps without verification
- Missing timeout guidance

---

## Validation Gate Usage

In workflow steps, call validation before output:

```yaml
# Before saving RCA
{call validate_template_compliance 
  document={rca_content} 
  template_type="rca"}

# If not compliant
{if not compliant}
  Display: "Validation failed. Missing: {missing_sections}"
  {halt for user confirmation}
{endif}

# Before outputting PromQL
{call validate_promql query={generated_query}}

# If not valid
{if not valid}
  Display: "Query syntax error: {errors}"
  Display: "Suggestion: {suggestions}"
  {fix and retry}
{endif}
```

---

## Validation Summary Report

After validation, provide summary:

```
🛡️ Validation Result.

Status: {PASS / FAIL}

{if PASS}
All checks passed:
✓ Template compliance
✓ Required sections
✓ No placeholders
✓ Action items complete
{endif}

{if FAIL}
Issues found:
✗ {issue_1}
✗ {issue_2}

Fix required before proceeding.
{endif}
```
