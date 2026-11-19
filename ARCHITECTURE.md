# CareerOS — System Architecture

**Version:** 1.0  
**Status:** Approved  
**Source of Truth:** CareerOS PRD v1.0

## 1. Architecture Overview

CareerOS is a public, multi-user job discovery and application assistance platform for private-sector IT/software jobs and government recruitment opportunities in India and the UAE.

The system follows a **modular monolith architecture with independent background workers**.

The application is divided into three main processes:

- `apps/web` — Next.js frontend.
- `apps/api` — NestJS backend.
- `apps/worker` — Background processing.

The platform uses PostgreSQL for persistent data, Redis for queues and short-lived operational data, and S3-compatible storage for documents.

### Architecture Diagram

```text
                  USERS
                    |
                    v
          Next.js Web Application
                    |
                    v
              NestJS REST API
                    |
       +------------+-------------+
       |            |             |
       v            v             v
   PostgreSQL     Redis       Object Storage
    + Prisma      BullMQ        S3-compatible
                    |
                    v
             Background Workers
                    |
       +------------+-------------+
       |            |             |
       v            v             v
   Job Sources   AI Providers   External APIs
   Government    Gemini        Gmail OAuth
   Notifications
```

The API remains responsible for authentication, authorization, business operations, and data access. Background workers handle scheduled and long-running tasks.

## 2. Approved Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Queue | BullMQ |
| Queue infrastructure | Redis |
| Storage | S3-compatible private object storage |
| AI | Provider-independent gateway, initially Gemini |
| Authentication | Secure session-based authentication |
| API | Versioned REST |
| Monorepo | pnpm workspaces |
| Containers | Docker |
| Testing | Vitest, Supertest, Playwright |

Do not replace major components without an approved Architecture Decision Record (ADR).

## 3. Repository Structure

```text
careeros/
├── apps/
│   ├── web/
│   ├── api/
│   └── worker/
├── packages/
│   ├── database/
│   ├── contracts/
│   ├── ui/
│   ├── config/
│   └── utils/
├── infrastructure/
├── docs/
├── PRD.md
├── ARCHITECTURE.md
├── DESIGN.md
├── TASKS.md
├── RULES.md
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

Applications must communicate through approved interfaces and shared packages. Avoid direct imports between application internals.

## 4. Frontend Architecture

The frontend uses Next.js App Router.

### Responsibilities

- Public landing page.
- Authentication screens.
- Candidate onboarding.
- Candidate dashboard.
- Private-sector job search.
- Government recruitment discovery.
- Job details.
- Resume management.
- Application tracking.
- Recruiter outreach.
- Notifications.
- Account settings.
- Administrative interfaces.

### Frontend Principles

- Prefer server components when appropriate.
- Use client components for interactive features.
- Separate presentation components from data-fetching logic.
- Validate forms.
- Handle loading, empty, and error states.
- Build responsive layouts.
- Enforce accessibility standards.
- Never expose backend secrets to the browser.

The frontend must not directly access PostgreSQL from browser code.

## 5. Backend Architecture

The backend uses NestJS modules corresponding to business domains.

### Identity Module

Responsibilities:

- Registration.
- Authentication.
- Email verification.
- Password reset.
- Session management.
- Role-based authorization.
- Account deletion.

### Candidate Profile Module

Responsibilities:

- Candidate information.
- Education.
- Skills.
- Projects.
- Experience.
- Internships.
- Certifications.
- Job preferences.

### Source Registry Module

Responsibilities:

- Registered job sources.
- Source collection methods.
- Scan schedules.
- Source restrictions.
- Rate limits.
- Source operational status.

### Job Ingestion Module

Responsibilities:

- Source adapters.
- Job retrieval.
- Data normalization.
- Deduplication.
- Freshness verification.
- Ingestion history.

### Job Catalog Module

Responsibilities:

- Job listings.
- Job search.
- Filtering.
- Job details.
- Saved jobs.
- Source attribution.

### Matching Module

Responsibilities:

- Candidate/job compatibility.
- Hard requirement evaluation.
- Structured matching scores.
- AI-assisted explanations.
- Missing skill identification.

### Government Recruitment Module

Responsibilities:

- Official recruitment notices.
- Government posts.
- Notification extraction.
- Eligibility rules.
- Recruitment timelines.
- Deadline tracking.
- Official application links.

### Resume Module

Responsibilities:

- Secure uploads.
- Resume extraction.
- Structured editing.
- AI-assisted tailoring.
- PDF export.
- Version history.

### Contact Module

Responsibilities:

- Professional recruitment contacts.
- Contact provenance.
- Verification state.
- Correction and removal.

### Outreach Module

Responsibilities:

- Email drafting.
- Manual outreach.
- Gmail OAuth.
- Explicit send approval.
- Sending history.
- Duplicate prevention.
- Sending limits.

### Applications Module

Responsibilities:

- Private-sector applications.
- Government application tracking.
- Status transitions.
- Application snapshots.
- Status history.
- Notes and follow-ups.

### Notifications Module

Responsibilities:

- Deadline reminders.
- Recruitment updates.
- Application reminders.
- In-app notifications.

### AI Gateway Module

Responsibilities:

- Provider integration.
- Prompt templates.
- Structured output validation.
- Cost tracking.
- Quotas.
- Retry and timeout handling.
- Prompt-injection defenses.

### Administration Module

Responsibilities:

- Source management.
- Ingestion monitoring.
- Reported jobs.
- Contact reports.
- Government notice review.
- Usage monitoring.
- Operational controls.

## 6. Database Architecture

PostgreSQL is the persistent source of truth.

Prisma manages database access and versioned migrations.

### Core Entity Groups

**Identity**
- Users.
- Sessions.
- Authentication verification records.

**Candidate**
- Candidate profiles.
- Education.
- Skills.
- Projects.
- Experience.
- Preferences.

**Job Discovery**
- Sources.
- Source runs.
- Organizations.
- Jobs.
- Job versions.
- Saved jobs.
- Matches.

**Government Recruitment**
- Recruitment notices.
- Recruitment posts.
- Eligibility requirements.
- Recruitment events.
- Eligibility evaluations.

**Documents**
- Documents.
- Resume versions.
- Resume tailoring records.

**Outreach**
- Professional contacts.
- Contact sources.
- OAuth connections.
- Outreach drafts.
- Send attempts.

**Applications**
- Applications.
- Application status history.
- Notes.
- Reminders.

**Operations**
- Notifications.
- AI usage records.
- Audit events.

### Database Requirements

- Enforce foreign keys and appropriate unique constraints.
- Index frequently queried fields.
- Preserve important historical records.
- Use transactions for atomic operations.
- Enforce user ownership.
- Use versioned migrations.
- Avoid holding database transactions open during external API calls.

## 7. API Architecture

CareerOS uses versioned REST APIs under:

`/api/v1`

Representative routes:

```text
/api/v1/auth
/api/v1/profile
/api/v1/jobs
/api/v1/saved-jobs
/api/v1/matches
/api/v1/government
/api/v1/resumes
/api/v1/contacts
/api/v1/outreach
/api/v1/applications
/api/v1/notifications
/api/v1/settings
/api/v1/admin
```

The exact route contracts must be finalized during implementation design.

### API Standards

- Runtime request validation.
- Authentication where required.
- Resource-level authorization.
- Pagination.
- Consistent error responses.
- Rate limiting.
- Idempotency for consequential actions.
- Documented request and response schemas.

Long-running operations should return a task reference rather than blocking HTTP requests unnecessarily.

## 8. Background Worker Architecture

Redis and BullMQ support asynchronous processing.

### Queue Categories

- Job source scanning.
- Job normalization.
- Source verification.
- Government notification processing.
- Resume extraction.
- Resume tailoring.
- AI processing.
- Notification scheduling.
- Approved email sending.

### Reliability

Workers require:

- Stable job identifiers.
- Bounded retries.
- Backoff.
- Timeouts.
- Idempotency.
- Concurrency limits.
- Failure monitoring.
- Safe shutdown.

Do not blindly retry email sending after an ambiguous external result.

## 9. Job Discovery Architecture

CareerOS discovers jobs from permitted sources such as:

- Official company career pages.
- Startup career pages.
- Supported job board APIs and feeds.
- Official government recruitment sources.

Each source uses an adapter implementing a common contract.

### Ingestion Pipeline

```text
Registered Source
       |
       v
Source Adapter
       |
       v
Raw Data Validation
       |
       v
Normalization
       |
       v
Deduplication
       |
       v
PostgreSQL Job Catalog
       |
       v
Search and Matching
```

### Source Requirements

Every job should retain:

- Original source.
- Original URL.
- External identifier when available.
- Discovery timestamp.
- Last verification timestamp.
- Relevant extraction metadata.

Unknown information must not be fabricated.

Shared ingestion should serve multiple users to control costs.

## 10. Government Recruitment Architecture

Government recruitment is a dedicated domain, not merely a job category.

### Processing Pipeline

```text
Official Recruitment Source
          |
          v
Notification Retrieval
          |
          v
PDF/HTML Text Extraction
          |
          v
Structured Field Extraction
          |
          v
Validation and Source Evidence
          |
          v
Recruitment Database
          |
          v
Deterministic Eligibility Engine
          |
          v
Candidate Eligibility Explanation
```

### Eligibility Outcomes

- Eligible.
- Possibly eligible.
- Not eligible.
- Unknown.

Individual criteria are evaluated as passed, failed, or unresolved.

AI may assist with extraction and explanation but must not override deterministic eligibility rules.

Critical eligibility information must retain official source evidence.

Government applications are prepared and tracked by CareerOS but submitted through official recruitment procedures.

## 11. Matching Architecture

The matching engine uses two layers.

### Deterministic Layer

Evaluates:

- Mandatory qualifications.
- Experience requirements.
- Skill overlap.
- Location suitability.
- Employment preferences.
- Explicit restrictions.

### AI Explanation Layer

Explains:

- Why a job may be suitable.
- Matching skills.
- Missing skills.
- Important uncertainties.

AI explanations must be grounded in candidate information and the actual job description.

A match score is not a prediction of receiving an interview or job offer.

## 12. Resume Architecture

### Workflow

```text
Resume Upload
     |
     v
Private Storage
     |
     v
Text Extraction
     |
     v
Structured Resume
     |
     v
Candidate Verification
     |
     v
Job-Specific Tailoring
     |
     v
Candidate Approval
     |
     v
Versioned PDF Export
```

Resume tailoring must not fabricate:

- Work experience.
- Education.
- Certifications.
- Skills.
- Achievements.
- Metrics.

Every application should reference the resume version used when that information is available.

## 13. Recruiter Outreach Architecture

### Contact Discovery

Store only legitimately sourced professional recruitment contacts.

Each contact should have:

- Contact information.
- Organization.
- Public source.
- Verification state.
- Last verification time.
- Correction/removal status.

### Email Workflow

```text
Selected Job
     |
     v
Professional Contact
     |
     v
AI-Assisted Draft
     |
     v
User Review
     |
     +----> Copy / Manual Send
     |
     +----> Gmail OAuth
                |
                v
         Explicit Confirmation
                |
                v
          Controlled Send
                |
                v
           Send History
```

Gmail access must use appropriate OAuth permissions and protected token storage.

Email sending requires explicit per-message approval.

Gmail API acceptance does not prove that the recipient received or read the email.

## 14. Authentication and Security Architecture

Use secure session-based authentication.

### Security Controls

- Secure password hashing.
- HTTP-only session cookies.
- Secure cookie configuration.
- Session expiration and revocation.
- CSRF protection where applicable.
- Rate limiting.
- Server-side authorization.
- User data isolation.
- Encrypted sensitive tokens.
- Private object storage.
- File validation and malware scanning.
- Audit logging.
- Secret management.

Administrative access must follow least-privilege principles.

All externally sourced content, including job descriptions and resumes, must be treated as untrusted input.

## 15. AI Gateway Architecture

All AI requests must pass through one provider-independent gateway.

### Responsibilities

- Provider selection.
- Model configuration.
- Structured prompts.
- Input limits.
- Output schema validation.
- Timeouts.
- Retry controls.
- Usage tracking.
- Cost monitoring.
- Fallback behavior.

Gemini is the initial preferred provider, but business modules must not depend directly on Gemini-specific APIs.

External documents must never be allowed to override trusted system instructions.

## 16. Notifications Architecture

Notifications are created from domain events and scheduled background jobs.

Supported events include:

- Upcoming application deadlines.
- Government notification changes.
- Recruitment milestones.
- Application reminders.
- Recruiter follow-up reminders.
- Important account events.

In-app notifications are the baseline delivery channel.

Additional channels require explicit scope and integration approval.

## 17. Observability

The platform requires:

- Structured application logs.
- Request correlation IDs.
- API error monitoring.
- Worker queue metrics.
- Source scan metrics.
- Job freshness monitoring.
- AI usage and cost monitoring.
- Audit events.
- Health checks.

Logs must not expose passwords, tokens, private resumes, or unnecessary personal data.

## 18. Deployment Architecture

### Local Development

Docker Compose runs supporting services such as PostgreSQL, Redis, and local object storage.

The web, API, and worker applications may run locally or in containers.

### Production

Deploy:

- Next.js web application.
- NestJS API service.
- Background worker service.
- Managed or securely operated PostgreSQL.
- Redis.
- Private object storage.

Use HTTPS, secret management, health checks, backups, monitoring, and documented rollback procedures.

### Scaling

Initially scale application processes and worker concurrency as necessary.

Do not introduce microservices, Kafka, Kubernetes, or Elasticsearch without a demonstrated requirement and approved ADR.

## 19. Performance and Cost

Initial targets:

- Cached job search: p95 under 500ms.
- Standard profile operations: p95 under 500ms.
- Application status operations: p95 under 500ms.
- AI and document processing: asynchronous.

Cost controls include:

- Shared ingestion.
- Source-specific scan frequency.
- AI quotas.
- Caching.
- Storage limits.
- Queue concurrency limits.
- Outreach quotas.
- Usage monitoring.

A free-to-users platform still incurs infrastructure and external API costs.

## 20. Testing Architecture

### Unit Tests

- Matching logic.
- Government eligibility.
- Normalization.
- Deduplication.
- Application status transitions.
- Resume validation.

### Integration Tests

- PostgreSQL and Prisma.
- BullMQ workers.
- Object storage.
- Authentication.
- External integration adapters.
- AI gateway.

### End-to-End Tests

- Registration.
- Onboarding.
- Job discovery.
- Government eligibility.
- Resume tailoring.
- Application tracking.
- Recruiter outreach approval.

### Security Tests

- Cross-user access.
- Unauthorized API operations.
- Unsafe uploads.
- Prompt injection.
- Unauthorized email sending.

## 21. Implementation Sequence

Follow `TASKS.md`.

Recommended milestones:

1. M0 — Engineering foundation.
2. M1 — Identity and candidate profiles.
3. M2 — Private-sector job discovery.
4. M3 — Matching and application tracking.
5. M4 — Government recruitment.
6. M5 — Resume intelligence.
7. M6 — Recruiter outreach.
8. M7 — Public-release hardening.

Security, testing, accessibility, and observability are continuous requirements, not final-stage additions.

## 22. Architectural Change Control

Any change to the approved technology stack, deployment model, module boundaries, authentication approach, or major data flow requires an Architecture Decision Record.

The ADR must document:

- Problem.
- Proposed decision.
- Alternatives.
- Tradeoffs.
- Risks.
- Migration impact.
- Approval.

---

**End of ARCHITECTURE.md**

This document defines the technical architecture. Mandatory implementation behavior belongs in `RULES.md`.