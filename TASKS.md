# CareerOS — Implementation Task Breakdown

**Document ID:** CAREEROS-IMP-001  
**Version:** 1.0  
**Status:** Approved — Ready for Implementation  
**Source of Truth:** Approved PRD v1.0, SAD v1.0, Engineering Rules v1.0, Design Specification v1.0  
**Purpose:** Define the complete implementation sequence without writing application code.

---

## 1. Implementation Strategy

CareerOS will be developed as a modular monolith using:

- Next.js, React, and TypeScript.
- NestJS for backend APIs.
- PostgreSQL with Prisma.
- Redis and BullMQ.
- S3-compatible object storage.
- Provider-independent AI gateway.
- Docker and pnpm workspaces.

Implementation follows vertical slices. Each slice must deliver working functionality rather than disconnected frontend screens or backend endpoints.

### Mandatory execution rules

1. Complete tasks in dependency order.
2. Implement one approved task at a time.
3. Test each task before proceeding.
4. Do not introduce unapproved features.
5. Do not claim functionality is complete without verification.
6. Preserve user data and security boundaries throughout development.
7. Document architectural deviations before implementation.

## 2. Project Milestones

| Milestone | Deliverable | Exit requirement |
|---|---|---|
| M0 | Engineering foundation | Repository, CI, development infrastructure |
| M1 | Identity and candidate profiles | Secure registration and onboarding |
| M2 | Private-sector job discovery | Real sourced jobs, searchable and traceable |
| M3 | Matching and application tracking | Explainable matching and reliable application history |
| M4 | Government recruitment | Official notices, eligibility and deadlines |
| M5 | Resume intelligence | Verified resume extraction, tailoring and PDF export |
| M6 | Recruiter outreach | Legitimate contacts, drafts, manual and approved Gmail sending |
| M7 | Public-release hardening | Security, reliability, accessibility and deployment readiness |

**Important:** M7 is not the first time security or testing occurs. Those requirements apply throughout all milestones.

---

# 3. Milestone M0 — Engineering Foundation

**Goal:** Establish a reliable development environment before implementing product features.

### TASK-001 — Initialize Monorepo

**Priority:** Critical  
**Dependencies:** None

Work:
- Create pnpm workspace.
- Initialize Next.js application.
- Initialize NestJS API.
- Initialize worker application.
- Create shared packages.
- Configure TypeScript strict mode.
- Configure linting and formatting.

Acceptance:
- Dependencies install reproducibly.
- Applications build.
- Type checking passes.
- Workspace boundaries are documented.

### TASK-002 — Configure Development Infrastructure

**Dependencies:** TASK-001

Work:
- Configure PostgreSQL.
- Configure Redis.
- Configure local S3-compatible storage.
- Create Docker Compose environment.
- Define environment variable templates.
- Add health checks.

Acceptance:
- Services start consistently.
- Database and Redis connectivity can be verified.
- Secrets are excluded from version control.

### TASK-003 — Configure Prisma

**Dependencies:** TASK-002

Work:
- Initialize Prisma.
- Configure migrations.
- Define database naming conventions.
- Establish migration and seed procedures.
- Add integration-test database configuration.

Acceptance:
- Initial migration succeeds.
- Migrations can run on a clean database.
- Database connectivity is tested.

### TASK-004 — Configure CI Quality Gates

**Dependencies:** TASK-001

Work:
- Automated linting.
- Type checking.
- Unit tests.
- Build verification.
- Dependency security checks.
- Pull request validation.

Acceptance:
- CI runs automatically.
- Failing checks prevent merging.
- No production credentials are required for ordinary CI tests.

### TASK-005 — Establish API and Observability Standards

**Dependencies:** TASK-001, TASK-002

Work:
- API versioning.
- Standardized errors.
- Request validation.
- Structured logging.
- Request correlation identifiers.
- Basic metrics and health endpoints.

Acceptance:
- API errors follow a documented contract.
- Sensitive values are excluded from logs.
- Failed requests can be traced.

**M0 completion gate:** The development environment, CI, database migrations, and basic operational controls work reproducibly.

---

# 4. Milestone M1 — Identity and Candidate Profiles

### TASK-006 — User Authentication

**Dependencies:** M0

Work:
- Registration.
- Login.
- Password hashing.
- Email verification.
- Password reset.
- Secure session management.
- Logout and session revocation.

Acceptance:
- Valid users can authenticate.
- Invalid credentials are rejected.
- Session security is tested.
- Authentication endpoints are rate-limited.

### TASK-007 — Authorization and Data Isolation

**Dependencies:** TASK-006

Work:
- Candidate and administrator roles.
- Ownership enforcement.
- Authorization guards.
- Cross-user access tests.

Acceptance:
- Candidates cannot access other candidates' private resources.
- Administrative access is explicitly restricted.
- Unauthorized requests fail safely.

### TASK-008 — Candidate Profile Backend

**Dependencies:** TASK-007

Work:
- Profile model.
- Education records.
- Skills.
- Projects.
- Internships.
- Experience.
- Certifications.
- Job preferences.

Acceptance:
- Users can create and update their own profiles.
- Input validation works.
- Data ownership is enforced.

### TASK-009 — Candidate Onboarding UI

**Dependencies:** TASK-008

Work:
- Multi-step onboarding.
- Career preferences.
- Education.
- Skills and experience.
- Profile review.
- Save and resume functionality.

Acceptance:
- Onboarding works on mobile and desktop.
- Optional fields can be skipped.
- Invalid input receives useful feedback.
- Progress is not lost unnecessarily.

### TASK-010 — Account and Privacy Controls

**Dependencies:** TASK-007, TASK-008

Work:
- Account settings.
- Profile editing.
- Data access/export workflow.
- Account deletion workflow.
- Session management controls.

Acceptance:
- Users can manage their account.
- Deletion handles dependent private records according to the documented retention policy.
- Security-sensitive actions require appropriate confirmation.

**M1 completion gate:** A candidate can securely register, sign in, complete onboarding, edit their profile, and manage their account.

---

# 5. Milestone M2 — Private-Sector Job Discovery

### TASK-011 — Job Source Registry

**Dependencies:** M0

Work:
- Source registration model.
- Supported collection methods.
- Scan frequency.
- Rate limits.
- Source status.
- Administrative controls.

Acceptance:
- Sources can be enabled and disabled.
- Collection restrictions are recorded.
- Unsupported sources are not scheduled.

### TASK-012 — Source Adapter Contract

**Dependencies:** TASK-011

Work:
- Standard source interface.
- Raw job schema.
- Adapter error handling.
- Pagination and cursor support.
- Test fixtures.

Acceptance:
- Adapters conform to one contract.
- Source failures are isolated.
- Contract tests run against controlled fixtures.

### TASK-013 — Initial Real Job Source Integrations

**Dependencies:** TASK-012

Work:
- Implement a small set of permitted private-sector sources.
- Include suitable India and UAE sources where available.
- Preserve original job identifiers and URLs.
- Document coverage limitations.

Acceptance:
- At least one real, permitted source is operational.
- Every displayed vacancy has source provenance.
- No fabricated listings are used as production data.

A broader source count is not an initial acceptance requirement. Quality and permission to collect take priority.

### TASK-014 — Job Normalization

**Dependencies:** TASK-012

Work:
- Normalize titles.
- Normalize locations.
- Normalize employment types.
- Extract requirements.
- Preserve unknown fields.
- Record extraction provenance.

Acceptance:
- Different sources produce a consistent internal representation.
- Missing data is not invented.
- Invalid records are rejected or flagged.

### TASK-015 — Job Deduplication

**Dependencies:** TASK-014

Work:
- External identifier matching.
- Canonical URL matching.
- Employer and title normalization.
- Duplicate candidate review.
- Source-to-job relationships.

Acceptance:
- Exact duplicates are handled.
- Distinct vacancies are not merged solely due to matching titles.
- Deduplication decisions are testable.

### TASK-016 — Scheduled Ingestion Workers

**Dependencies:** TASK-013, TASK-014, TASK-015

Work:
- BullMQ queues.
- Daily scans.
- Source-specific schedules.
- Retry policies.
- Idempotent upserts.
- Failed-job inspection.

Acceptance:
- Jobs can be ingested automatically.
- Failed scans do not corrupt existing listings.
- Duplicate scans are controlled.
- Source health is observable.

### TASK-017 — Job Catalog API

**Dependencies:** TASK-014, TASK-015

Work:
- Job search.
- Pagination.
- Filters.
- Job details.
- Source verification.
- Freshness indicators.

Acceptance:
- Users can query normalized jobs.
- Results support pagination.
- Source links and verification states are available.

### TASK-018 — Job Search Interface

**Dependencies:** TASK-017

Work:
- Search bar.
- Country and location filters.
- Role filters.
- Job cards.
- Detail view.
- Responsive filters.
- Empty and loading states.

Acceptance:
- Users can discover and inspect real vacancies.
- Search works on desktop and mobile.
- Unverified information is clearly identified.

### TASK-019 — Job Refresh and Freshness

**Dependencies:** TASK-016, TASK-017

Work:
- Rate-limited manual refresh.
- Last verification timestamps.
- Stale listing indicators.
- Closure detection.
- Source failure handling.

Acceptance:
- Refresh requests cannot create unrestricted crawling.
- Stale jobs are labeled appropriately.
- Temporary source failures do not automatically close all jobs.

**M2 completion gate:** Users can discover, filter, inspect, and open real private-sector IT vacancies with transparent source information.

---

# 6. Milestone M3 — Matching and Application Tracking

### TASK-020 — Candidate Matching Data Preparation

**Dependencies:** M1, M2

Work:
- Normalize candidate skills.
- Map job requirements.
- Identify mandatory qualifications.
- Represent missing information.

Acceptance:
- Matching inputs are structured.
- Missing data remains explicit.
- Candidate information is not fabricated.

### TASK-021 — Deterministic Matching Engine

**Dependencies:** TASK-020

Work:
- Hard requirement checks.
- Skill overlap scoring.
- Experience alignment.
- Location alignment.
- Configurable scoring weights.

Acceptance:
- Hard eligibility failures are identified.
- Scores are reproducible.
- Matching rules have unit tests.

### TASK-022 — AI Match Explanations

**Dependencies:** TASK-021, AI gateway foundation

Work:
- Explain matching qualifications.
- Explain missing skills.
- Identify uncertainty.
- Validate structured output.

Acceptance:
- Explanations are grounded in candidate and job information.
- AI cannot override hard requirement failures.
- Failed AI calls have a fallback.

### TASK-023 — Saved Jobs

**Dependencies:** TASK-017, TASK-007

Work:
- Save and unsave jobs.
- Saved-job listing.
- User ownership.
- Duplicate-save protection.

Acceptance:
- Saved jobs are private to their owner.
- Repeated save requests do not create duplicates.

### TASK-024 — Application Tracking Backend

**Dependencies:** TASK-023

Work:
- Application records.
- Status transitions.
- Status history.
- Job snapshots.
- Notes and dates.
- Resume version references when available.

Acceptance:
- Users can track applications.
- Invalid transitions are handled.
- History is preserved.
- Opening an application link does not mark an application submitted.

### TASK-025 — Application Tracker UI

**Dependencies:** TASK-024

Work:
- Table view.
- Board view for private-sector applications.
- Application details.
- Status updates.
- Filtering and sorting.

Acceptance:
- Users can manage applications on mobile and desktop.
- Status changes remain visible in history.

### TASK-026 — Matching UI

**Dependencies:** TASK-021, TASK-022

Work:
- Match summary.
- Matching skills.
- Missing requirements.
- Hard eligibility warnings.
- Explanation of score limitations.

Acceptance:
- Users understand why a job was recommended.
- A suitability score is not presented as an interview probability.

**M3 completion gate:** Users can evaluate suitable jobs, save them, and track real application progress.

---

# 7. Milestone M4 — Government Recruitment Intelligence

### TASK-027 — Government Source Registry

**Dependencies:** TASK-011

Work:
- Official recruitment source classification.
- Country and jurisdiction metadata.
- Source authority.
- Notification discovery configuration.

Acceptance:
- Official sources are distinguishable from third-party sources.
- Source restrictions are respected.

### TASK-028 — Government Notice Ingestion

**Dependencies:** TASK-027, TASK-016

Work:
- Discover official notifications.
- Retrieve permitted documents.
- Store source metadata.
- Record document versions.
- Detect updated notifications.

Acceptance:
- Notices retain official-source links.
- Document changes are traceable.
- Unsupported documents are flagged.

### TASK-029 — Document Extraction Pipeline

**Dependencies:** TASK-028, object storage foundation

Work:
- PDF text extraction.
- OCR fallback for supported scanned documents.
- Structured extraction.
- Validation.
- Extraction confidence and review status.

Acceptance:
- Critical extracted fields retain evidence.
- Extraction failures are recoverable.
- Low-confidence results are not silently treated as verified.

### TASK-030 — Government Recruitment Data Model

**Dependencies:** TASK-028

Work:
- Recruitment notices.
- Posts.
- Eligibility requirements.
- Application windows.
- Recruitment events.
- Source evidence.

Acceptance:
- Multiple posts can belong to one notification.
- Dates and requirements are versioned appropriately.

### TASK-031 — Eligibility Rule Engine

**Dependencies:** TASK-029, TASK-030, TASK-008

Work:
- Qualification checks.
- Age checks.
- Experience checks.
- Nationality and authorization checks.
- Unknown-condition handling.
- Aggregate eligibility classification.

Acceptance:
- Explicit failures produce appropriate outcomes.
- Unknown critical conditions prevent false certainty.
- Rules have comprehensive unit tests.

### TASK-032 — Government Job Search UI

**Dependencies:** TASK-030

Work:
- Government vacancy listing.
- Country and jurisdiction filters.
- Qualification filters.
- Official notice links.
- Deadline indicators.

Acceptance:
- Users can find supported government vacancies.
- Official and third-party information are distinguishable.

### TASK-033 — Government Eligibility UI

**Dependencies:** TASK-031

Work:
- Eligibility check.
- Passed requirements.
- Failed requirements.
- Unresolved requirements.
- Source evidence.
- User confirmation prompts.

Acceptance:
- Eligibility results are understandable.
- The UI never guarantees eligibility without sufficient evidence.

### TASK-034 — Recruitment Timeline Tracking

**Dependencies:** TASK-030, TASK-024

Work:
- Application windows.
- Examination dates.
- Correction windows.
- Admit card milestones.
- Result milestones.
- Change history.

Acceptance:
- Confirmed and uncertain dates are distinguishable.
- Date changes are retained.
- Government applications support recruitment-specific states.

### TASK-035 — Government Application Assistant

**Dependencies:** TASK-033, TASK-034

Work:
- Application checklist.
- Required document guidance.
- Official portal navigation.
- Manual submission tracking.
- Application reference recording.

Acceptance:
- Users can prepare and track government applications.
- The system never falsely claims to submit an external application.

**M4 completion gate:** Users can discover supported official government vacancies, review eligibility evidence, follow application procedures, and track recruitment milestones.

---

# 8. Milestone M5 — Resume Intelligence

### TASK-036 — Private Document Storage

**Dependencies:** M0, M1

Work:
- Secure upload.
- File validation.
- Malware scanning.
- Private storage.
- Signed access.
- Document ownership.

Acceptance:
- Unauthorized users cannot access documents.
- Unsafe files are rejected.
- Storage failures are handled.

### TASK-037 — Resume Extraction

**Dependencies:** TASK-036, AI gateway foundation

Work:
- Text extraction.
- Structured resume parsing.
- Candidate fact mapping.
- Extraction review.
- Correction workflow.

Acceptance:
- Extracted information can be corrected.
- Unverified extraction does not automatically overwrite approved profile facts.

### TASK-038 — Structured Resume Editor

**Dependencies:** TASK-037

Work:
- Resume sections.
- Skills and projects.
- Education and experience.
- Preview.
- Validation.

Acceptance:
- Users can edit approved resume information.
- Changes persist reliably.

### TASK-039 — Resume Tailoring

**Dependencies:** TASK-038, TASK-017

Work:
- Job-specific suggestions.
- Relevant skill prioritization.
- Project selection.
- Keyword analysis.
- Factual validation.
- User approval.

Acceptance:
- No unsupported claims are introduced.
- Users can review and reject suggestions.
- Tailoring failures preserve the original resume.

### TASK-040 — Resume PDF Export

**Dependencies:** TASK-038, TASK-039

Work:
- Deterministic rendering.
- Consistent templates.
- PDF generation.
- Version history.
- Secure download.

Acceptance:
- Exported PDFs are readable.
- Resume versions are preserved.
- Application records can reference the correct version.

### TASK-041 — Resume Manager UI

**Dependencies:** TASK-037–040

Work:
- Resume library.
- Upload.
- Editing.
- Tailoring comparison.
- PDF preview.
- Version history.

Acceptance:
- The full resume workflow is usable on desktop and mobile.
- Factual changes require appropriate review.

**M5 completion gate:** Users can upload, correct, tailor, version, and export truthful resumes.

---

# 9. Milestone M6 — Recruiter Outreach

### TASK-042 — Professional Contact Model

**Dependencies:** TASK-011, TASK-017

Work:
- Contact records.
- Organization association.
- Source provenance.
- Verification status.
- Removal and correction status.

Acceptance:
- Every contact has traceable provenance.
- Unsupported or removed contacts are not presented as verified.

### TASK-043 — Contact Discovery Adapters

**Dependencies:** TASK-042

Work:
- Collect permitted professional recruitment contacts.
- Prioritize official recruitment channels.
- Record source and collection method.
- Apply source restrictions.

Acceptance:
- No fabricated contacts.
- No private contact harvesting.
- No unsupported verification claims.

### TASK-044 — Outreach Draft Generation

**Dependencies:** TASK-042, TASK-008, AI gateway foundation

Work:
- Job-specific email drafting.
- Candidate fact grounding.
- Subject generation.
- Editable drafts.
- Resume selection.

Acceptance:
- Drafts reference actual candidate information.
- Users can edit all generated content.

### TASK-045 — Manual Outreach Workflow

**Dependencies:** TASK-044

Work:
- Copy email.
- Open email application.
- Manual outreach tracking.
- Follow-up notes.

Acceptance:
- Users can perform outreach without Gmail integration.
- Manual actions are not misrepresented as confirmed delivery.

### TASK-046 — Gmail OAuth Integration

**Dependencies:** TASK-006, TASK-007

Work:
- Google authorization.
- Minimal required permissions.
- Encrypted token storage.
- Token refresh.
- Connection status.
- Disconnection.

Acceptance:
- Users can connect and disconnect Gmail where the integration is approved and available.
- Credentials are protected.
- Failed authorization is recoverable.

### TASK-047 — Approved Email Sending

**Dependencies:** TASK-044, TASK-046

Work:
- Explicit send confirmation.
- Recipient validation.
- Attachment review.
- Send idempotency.
- Delivery-attempt history.
- Rate limits.
- Failure reconciliation.

Acceptance:
- No email is sent without approval.
- Duplicate sending is prevented as far as technically possible.
- Ambiguous external send outcomes are handled safely.

### TASK-048 — Outreach Dashboard

**Dependencies:** TASK-045, TASK-047

Work:
- Draft list.
- Contact information.
- Outreach status.
- Follow-up reminders.
- Connection status.

Acceptance:
- Users can distinguish drafts, attempted sends, accepted sends, failures, and manually recorded outreach.

**M6 completion gate:** Users can discover legitimate professional contacts, prepare personalized outreach, and use manual or explicitly approved Gmail sending.

---

# 10. Cross-Cutting Tasks

These tasks must be scheduled alongside the milestones they support, not postponed until the end.

### TASK-049 — AI Gateway Foundation

**Start:** Before the first AI-dependent feature.

Work:
- Provider adapter.
- Runtime schema validation.
- Model configuration.
- Usage tracking.
- Timeouts.
- Quotas.
- Prompt-injection defenses.

Acceptance:
- AI failures are contained.
- Invalid outputs are rejected.
- Usage and cost can be measured.

### TASK-050 — Notifications and Reminders

**Start:** Alongside application tracking.

Work:
- Reminder scheduling.
- In-app notifications.
- Deadline changes.
- Delivery status.
- User preferences.

Acceptance:
- Reminders are scheduled reliably.
- Duplicate delivery is controlled.
- Users can inspect relevant notifications.

### TASK-051 — Administrative Operations

**Start:** Alongside source ingestion.

Work:
- Source management.
- Failed-job inspection.
- Reported listings.
- Contact correction requests.
- Operational metrics.

Acceptance:
- Administrators can manage problematic sources.
- Private candidate data remains protected.

### TASK-052 — Observability and Cost Controls

**Start:** M0, expanded with each milestone.

Work:
- Structured logs.
- Queue metrics.
- AI cost monitoring.
- Source freshness monitoring.
- Alerts.
- Usage limits.

Acceptance:
- Critical failures are visible.
- Cost-intensive workflows can be limited.

### TASK-053 — Accessibility and Responsive Validation

**Start:** With the first frontend screen.

Work:
- Keyboard testing.
- Screen-reader checks.
- Contrast validation.
- Mobile layouts.
- Error announcements.
- Dialog accessibility.

Acceptance:
- Core workflows target WCAG 2.2 AA.
- Known exceptions are documented and tracked.

---

# 11. Milestone M7 — Public-Release Hardening

### TASK-054 — Security Assessment

Work:
- Authentication review.
- Authorization testing.
- Cross-user access testing.
- Upload security.
- Prompt-injection testing.
- OAuth token protection.
- Abuse prevention.

Acceptance:
- No known critical security defects remain.
- High-severity findings are resolved or explicitly block release.

### TASK-055 — Data Privacy Review

Work:
- Data inventory.
- Retention policies.
- User deletion workflows.
- Consent requirements.
- Third-party processing review.
- India and UAE privacy considerations.

Acceptance:
- Privacy controls match documented behavior.
- Unresolved legal or compliance blockers prevent affected features from launching.

### TASK-056 — Reliability and Load Testing

Work:
- API performance.
- Queue recovery.
- Source failure simulations.
- Database backup and restore.
- Email failure scenarios.
- AI provider outages.

Acceptance:
- Critical workflows recover from expected failures.
- Performance targets are measured under representative load.

### TASK-057 — Production Deployment

Work:
- Production infrastructure.
- Secret management.
- Database migrations.
- HTTPS.
- Health checks.
- Monitoring.
- Backup and rollback procedures.

Acceptance:
- Production deployment is reproducible.
- Rollback and recovery procedures are documented and tested.

### TASK-058 — Controlled Public Beta

Work:
- Invite initial users.
- Observe onboarding.
- Measure job relevance.
- Review government eligibility errors.
- Collect usability feedback.
- Monitor operational costs.

Acceptance:
- Core journeys work with real users.
- No unresolved critical reliability or security issue blocks expansion.
- Known source-coverage limitations are visible.

### TASK-059 — Public Launch Review

Work:
- Confirm PRD acceptance criteria.
- Review source coverage.
- Review Gmail integration availability.
- Verify privacy documentation.
- Review operational readiness.
- Approve release scope.

Acceptance:
- All launch-critical requirements are met.
- Unsupported integrations are disabled or clearly identified.
- Public release is explicitly approved.

---

# 12. Dependency Summary

The critical implementation path is:

```text
Foundation
    ↓
Authentication and Profiles
    ↓
Private-Sector Job Discovery
    ↓
Matching and Application Tracking
    ↓
Government Recruitment
    ↓
Resume Intelligence
    ↓
Recruiter Outreach
    ↓
Public-Release Hardening
```

Some tasks may proceed in parallel once their dependencies are satisfied.

Examples:

- AI gateway development can begin alongside early job ingestion.
- Resume storage can begin after authentication.
- Government source research can begin while private-sector ingestion is being built.
- Accessibility testing must accompany frontend development.
- Notifications can begin after application tracking is available.

The sequence describes recommended delivery order, not an artificial requirement to complete every unrelated task serially.

# 13. Task Sizing Rules

Before implementation, each task must be broken down further if it cannot be:

- Understood independently.
- Implemented within a manageable change.
- Reviewed coherently.
- Tested with clear acceptance criteria.

Large tasks such as Gmail OAuth, government eligibility, and job-source integration will likely require smaller implementation subtasks.

Task identifiers must remain stable once work begins.

# 14. Required Task Template

Every implementation task must use this structure:

**Task ID:**  
**Title:**  
**Related PRD requirements:**  
**Related architecture modules:**  
**Dependencies:**  
**Objective:**  
**In scope:**  
**Out of scope:**  
**Expected files/modules:**  
**Security considerations:**  
**Implementation steps:**  
**Acceptance criteria:**  
**Required tests:**  
**Definition of Done:**

An AI coding assistant must not treat a task title alone as sufficient implementation instructions.

# 15. Project Risks

| Risk | Severity | Required response |
|---|---|---|
| Job source restrictions | High | Validate source access before integration |
| Government eligibility errors | Critical | Evidence-backed deterministic rules |
| Cross-user data exposure | Critical | Ownership enforcement and security tests |
| AI hallucinations | High | Structured validation and grounding |
| Gmail OAuth approval delays | High | Maintain manual outreach fallback |
| Free SaaS operating costs | High | Quotas, caching and monitoring |
| Government notification changes | High | Versioning and scheduled verification |
| Scope expansion | High | PRD change control |
| Weak automated testing | High | CI gates and regression tests |

# 16. Estimated Development Effort

The following estimates are planning ranges, not commitments.

Assumptions:

- One developer.
- AI-assisted coding.
- Familiarity with JavaScript and React.
- Additional learning required for NestJS, PostgreSQL, queues, and production security.
- Limited initial source integrations.
- No dedicated design, QA, or DevOps team.

| Milestone | Indicative effort |
|---|---|
| M0 — Foundation | 1–2 weeks |
| M1 — Identity and Profiles | 2–3 weeks |
| M2 — Job Discovery | 3–6 weeks |
| M3 — Matching and Applications | 2–4 weeks |
| M4 — Government Recruitment | 4–8 weeks |
| M5 — Resume Intelligence | 3–5 weeks |
| M6 — Recruiter Outreach | 3–6 weeks |
| M7 — Public-Release Hardening | 3–6 weeks |

These ranges exclude major delays caused by source restrictions, external service approval, legal review, or significant rework. Cross-cutting tasks are included approximately within the milestone ranges.

A solo developer should not assume that the complete public SaaS can be made production-ready in a few weeks.

A narrower working prototype can be completed substantially earlier than the full approved MVP.

# 17. Definition of Milestone Completion

A milestone is complete when:

1. Required functionality is implemented.
2. Acceptance criteria are satisfied.
3. Automated tests pass.
4. Relevant manual tests are completed.
5. Security and ownership controls are verified.
6. Documentation is updated.
7. Known limitations are recorded.
8. No unresolved critical defects remain.
9. The milestone receives explicit approval.

# 18. Implementation Authorization

Approval of this document authorizes the **implementation plan**, not automatic execution of all tasks.

The development process must begin with TASK-001 and follow the approved task-level workflow.

No autonomous agent may implement unrelated tasks or deploy changes without appropriate authorization.

---

**End of CareerOS Implementation Task Breakdown v1.0**

**Total:** 59 numbered tasks  
**Milestones:** 8 (M0–M7)  
**Status:** Approved — Ready for Implementation