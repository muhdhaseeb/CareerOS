# CareerOS — Engineering and AI Coding Rules

**Version:** 1.0  
**Status:** Approved Engineering Standards  
**Applies To:** All developers, AI coding agents, and automated development workflows.

## 1. Mandatory Instructions

You are working on CareerOS, a public multi-user AI-assisted job discovery and application platform.

Before implementing any task, read:

1. `PRD.md` — Product requirements.
2. `ARCHITECTURE.md` — Approved technical architecture.
3. `DESIGN.md` — UI/UX specifications.
4. `TASKS.md` — Implementation tasks and dependencies.
5. `RULES.md` — Mandatory engineering rules.

The documents have the following authority:

PRD → Architecture → Engineering Rules → Design and Implementation Tasks → Existing Code.

Do not silently override approved decisions.

## 2. Task-by-Task Development

- Work on one explicitly authorized task at a time.
- Follow task dependencies in `TASKS.md`.
- Do not implement future tasks without permission.
- Do not introduce unrelated features.
- Inspect existing code before making changes.
- Prepare a concise implementation plan.
- Obtain approval when required.
- Implement the smallest coherent solution.
- Run relevant tests.
- Report results and remaining limitations.

Never claim that code works unless it has been verified.

## 3. Approved Technology Stack

Use:

- Next.js and React for frontend.
- TypeScript throughout.
- NestJS for backend.
- PostgreSQL for persistent data.
- Prisma for database access.
- Redis and BullMQ for background processing.
- S3-compatible private object storage.
- Provider-independent AI gateway.
- pnpm workspaces.
- Docker for containerized environments.
- Vitest, Supertest, and Playwright for testing.

Do not replace approved technologies without an ADR and approval.

Do not introduce microservices, Kubernetes, Kafka, or Elasticsearch without a demonstrated requirement.

## 4. TypeScript Rules

- Enable strict TypeScript checking.
- Avoid `any`.
- Use `unknown` for untrusted data.
- Validate external inputs at runtime.
- Define explicit public interfaces.
- Handle null and undefined values.
- Avoid unnecessary type assertions.
- Never suppress compiler errors without documented justification.

TypeScript types do not replace runtime validation.

## 5. Code Quality Rules

- Write readable, maintainable code.
- Use meaningful names.
- Keep functions focused.
- Avoid unnecessary abstractions.
- Avoid duplicate business logic.
- Do not leave dead code.
- Do not add dependencies without justification.
- Handle errors explicitly.
- Use automated formatting and linting.
- Do not refactor unrelated code during feature tasks.

Comments should explain important reasoning, not repeat obvious code.

## 6. Repository Boundaries

Follow the monorepo architecture.

- `apps/web` contains frontend application code.
- `apps/api` contains backend API code.
- `apps/worker` contains background processing.
- `packages/database` contains shared database access.
- `packages/contracts` contains shared contracts.
- `packages/ui` contains reusable UI components.
- `packages/config` contains shared configuration.
- `packages/utils` contains general reusable utilities.

Applications must not import internal files directly from other applications.

Business logic must remain within appropriate domain modules.

Avoid circular dependencies.

## 7. Frontend Rules

- Follow `DESIGN.md`.
- Use Next.js App Router.
- Prefer server components where appropriate.
- Use client components when interactivity requires them.
- Keep data-fetching logic separate from presentation where practical.
- Validate forms.
- Provide loading, empty, success, and error states.
- Support responsive layouts.
- Use accessible semantic HTML.
- Provide keyboard navigation.
- Ensure visible focus indicators.
- Target WCAG 2.2 AA.

Never expose backend secrets in client-side code.

Do not make unsupported claims in the UI.

## 8. Backend Rules

Use NestJS modules organized by business domain.

- Controllers handle HTTP concerns.
- Services implement application workflows.
- Data-access layers manage persistence.
- Guards enforce authentication and authorization.
- DTOs and validation enforce request contracts.
- External integrations use adapters.

Do not place complex business logic inside controllers.

Do not trust frontend authorization.

Every protected backend operation must verify user permissions.

## 9. API Rules

- Use versioned REST endpoints under `/api/v1`.
- Validate request bodies, parameters, and queries.
- Use consistent response and error structures.
- Apply pagination to collection endpoints.
- Enforce rate limits where appropriate.
- Do not expose internal stack traces.
- Document API contracts.
- Protect consequential operations against duplicate execution.

An API retry must not unintentionally send duplicate emails or create duplicate application records.

## 10. Database Rules

PostgreSQL is the source of truth.

Use Prisma for database access.

- Define appropriate primary keys.
- Use foreign keys.
- Apply unique constraints.
- Index important query fields.
- Use explicit nullability.
- Enforce user ownership.
- Use transactions for atomic changes.
- Preserve relevant history.
- Use versioned migrations.

Never run destructive production migrations without an approved recovery plan.

Do not hold database transactions open while waiting for external APIs.

Test backup restoration.

## 11. Multi-User Security Rules

CareerOS is a public multi-user platform.

Every private record must have an enforceable ownership boundary.

- Users cannot access another user's resume.
- Users cannot read another user's private profile.
- Users cannot modify another user's applications.
- Users cannot access another user's Gmail connection.
- Users cannot access another user's outreach history.
- Administrative access follows least privilege.

Write tests that attempt unauthorized cross-user access.

Never rely on hiding UI elements as an authorization mechanism.

## 12. Authentication Rules

- Use secure password hashing.
- Protect authentication endpoints with rate limits.
- Use secure HTTP-only session cookies.
- Implement session expiration.
- Support session revocation.
- Protect password reset flows.
- Apply CSRF protection where relevant.
- Protect authentication secrets.
- Enforce authorization server-side.

Never store plaintext passwords.

Never expose authentication tokens in logs.

## 13. Job Discovery Rules

- Collect jobs only from permitted sources.
- Prefer official APIs, feeds, and authorized integrations.
- Respect source access restrictions.
- Do not bypass CAPTCHA or technical protections.
- Record source provenance.
- Preserve original job URLs.
- Record discovery and verification timestamps.
- Normalize source data.
- Deduplicate carefully.
- Mark uncertain information as unknown.
- Monitor source failures.

Never fabricate:

- Job listings.
- Salaries.
- Requirements.
- Application deadlines.
- Employer details.
- Application links.

Do not treat successful retrieval as proof that a vacancy remains open.

## 14. Government Recruitment Rules

Government recruitment requires additional accuracy.

- Prefer official notifications.
- Preserve source evidence.
- Track notification versions.
- Record deadline changes.
- Extract eligibility requirements carefully.
- Evaluate explicit requirements deterministically.
- Identify missing information.
- Preserve uncertainty.
- Link to official application portals.

Supported eligibility results:

- Eligible.
- Possibly eligible.
- Not eligible.
- Unknown.

AI must not override deterministic eligibility failures.

Never guarantee government eligibility without sufficient evidence.

Never claim an application was submitted merely because an official portal was opened.

## 15. AI Rules

All AI requests must use the approved AI gateway.

- Validate structured outputs.
- Enforce timeouts.
- Apply usage limits.
- Track costs.
- Handle provider failures.
- Treat AI output as untrusted.
- Ground generated information in approved source data.
- Protect against prompt injection.

External job descriptions, websites, resumes, and government notifications must not be allowed to override trusted instructions.

AI must not invent:

- Candidate qualifications.
- Work experience.
- Certifications.
- Recruiter contacts.
- Government requirements.
- Job vacancies.
- Application outcomes.

AI-generated suggestions must remain reviewable before consequential actions.

## 16. Resume Rules

- Preserve candidate-approved facts.
- Allow correction of extracted information.
- Never fabricate experience.
- Never invent certifications.
- Never create unsupported achievement metrics.
- Never claim skills the candidate has not confirmed.
- Version exported resumes.
- Preserve the resume used for each application where available.
- Require approval for factual changes.

ATS analysis must not guarantee interviews or employment.

## 17. Recruiter Contact Rules

- Collect only legitimately available professional recruitment contacts.
- Preserve contact provenance.
- Record verification status.
- Support correction and removal.
- Do not scrape private personal contact information.
- Do not guess email addresses and label them verified.
- Respect applicable source and communication restrictions.

If no legitimate contact exists, show that no verified contact is available.

Do not use official government enquiry contacts for generic job solicitation.

## 18. Email Outreach Rules

- Generate relevant, factual outreach drafts.
- Allow editing before sending.
- Require explicit approval for each Gmail message.
- Display recipient, subject, body, and attachments before confirmation.
- Protect OAuth tokens.
- Enforce sending quotas.
- Prevent duplicate sends.
- Record sending attempts.
- Respect opt-outs.
- Support manual outreach when Gmail is unavailable.

Never send emails automatically without user authorization.

Never claim an email was delivered or read based solely on Gmail API acceptance.

## 19. Background Worker Rules

All BullMQ workers must support appropriate:

- Job identifiers.
- Idempotency.
- Bounded retries.
- Backoff.
- Timeouts.
- Concurrency limits.
- Error monitoring.
- Safe shutdown.
- Recovery procedures.

Never retry irreversible external operations blindly.

Scheduled scans must not create uncontrolled duplicate work.

## 20. File Storage Rules

- Use private object storage.
- Validate uploaded file types.
- Enforce file size limits.
- Scan uploads for malware.
- Protect download access.
- Use appropriate signed URLs.
- Enforce ownership.
- Apply retention and deletion policies.

Never expose private resumes through unrestricted public URLs.

## 21. Secrets and Environment Rules

Never commit:

- API keys.
- Database credentials.
- OAuth client secrets.
- Access tokens.
- Session secrets.
- Production environment files.

Use environment variables or approved secret management.

Provide `.env.example` files containing placeholders only.

Never log secrets.

## 22. Privacy Rules

- Collect only necessary personal information.
- Explain relevant data processing.
- Protect sensitive eligibility information.
- Provide account deletion.
- Support appropriate data access and export.
- Apply retention limits.
- Document third-party data processing.
- Review applicable India and UAE privacy obligations.

Do not claim legal compliance without appropriate review.

## 23. Testing Rules

Every meaningful feature requires relevant tests.

### Unit Tests

Test:

- Matching.
- Government eligibility.
- Job normalization.
- Deduplication.
- Application status transitions.
- Resume validation.
- Outreach authorization.

### Integration Tests

Test:

- Prisma/database operations.
- Authentication.
- Queue processing.
- Object storage.
- AI gateway.
- External adapters.
- OAuth and email integration.

### End-to-End Tests

Test critical user journeys.

### Security Tests

Test:

- Unauthorized access.
- Cross-user access.
- Unsafe uploads.
- Prompt injection.
- Unauthorized email sending.
- Rate-limit enforcement.

Never remove or weaken tests solely to make the build pass.

Never claim tests passed without running them.

## 24. Git Rules

- Use short-lived feature branches.
- Make focused commits.
- Write meaningful commit messages.
- Avoid unrelated changes.
- Keep secrets out of Git.
- Protect the main branch.
- Require review and CI checks before merging.
- Maintain traceability to implementation tasks.

Do not force-push shared protected branches.

## 25. CI/CD Rules

Required checks:

- Formatting.
- Linting.
- Type checking.
- Unit tests.
- Relevant integration tests.
- Build verification.
- Security and dependency checks.

Do not bypass required checks without an approved emergency procedure.

## 26. Performance Rules

- Use pagination.
- Avoid unbounded queries.
- Index important database fields.
- Avoid unnecessary API requests.
- Use background processing for long-running tasks.
- Define cache invalidation.
- Measure performance.

Initial targets from the approved architecture:

- Cached job search: p95 under 500ms.
- Profile operations: p95 under 500ms.
- Application status operations: p95 under 500ms.

Do not claim performance targets are met without measurement.

## 27. Cost Control Rules

CareerOS is free to users at launch, not free to operate.

- Limit AI usage.
- Rate-limit expensive endpoints.
- Share job ingestion across users.
- Control source scanning frequency.
- Limit uploads.
- Monitor storage consumption.
- Control worker concurrency.
- Apply outreach quotas.
- Track infrastructure and API costs.

Do not assume unlimited free third-party services.

## 28. Documentation Rules

Keep documentation aligned with implementation.

- Update API contracts when endpoints change.
- Document database migrations.
- Document source adapters.
- Record important architecture decisions.
- Document deployment procedures.
- Record known limitations.
- Distinguish planned features from implemented features.

Do not silently modify approved requirements.

## 29. AI Coding Agent Workflow

For every authorized task, follow this sequence.

### Step 1 — Read

Read the relevant project documents and inspect existing code.

### Step 2 — Understand

Identify:

- Task objective.
- Dependencies.
- Relevant modules.
- Acceptance criteria.
- Security considerations.
- Required tests.

### Step 3 — Plan

Explain:

- What will change.
- Which files may be affected.
- How the feature will work.
- How it will be tested.
- Important risks.

### Step 4 — Implement

Implement only the authorized task.

Do not add unrelated features.

### Step 5 — Verify

Run:

- Relevant tests.
- Type checking.
- Linting.
- Build checks where appropriate.

### Step 6 — Report

Provide:

- Completed changes.
- Files modified.
- Tests executed.
- Test results.
- Known limitations.
- Remaining work.

### Step 7 — Stop

After completing the authorized task, stop and wait for the next instruction.

Do not automatically proceed through all tasks in `TASKS.md`.

## 30. Prohibited AI Agent Behavior

An AI coding agent must never:

- Change approved architecture without permission.
- Invent requirements.
- Implement unrelated features.
- Fabricate test results.
- Claim unexecuted commands succeeded.
- Hardcode credentials.
- Disable authorization for convenience.
- Remove failing tests without justification.
- Invent job listings.
- Fabricate recruiter contacts.
- Invent government eligibility.
- Fabricate resume achievements.
- Send email without approval.
- Claim an external application was submitted without confirmation.
- Deploy to production without authorization.

If requirements are ambiguous, explain the uncertainty instead of guessing.

## 31. Definition of Done

A task is complete only when:

1. Acceptance criteria are satisfied.
2. Architecture rules are respected.
3. Code quality checks pass.
4. Relevant tests pass.
5. Security implications are reviewed.
6. Documentation is updated when needed.
7. Known limitations are reported.
8. No unresolved critical defect remains.
9. The implementation report is accurate.

## 32. Rule Enforcement

### Critical Violations

Block merging or release.

Examples:

- Exposed credentials.
- Unauthorized access to candidate data.
- Email sending without approval.
- Fabricated recruitment information.
- Missing backend authorization.
- Known destructive migration risks.

### Major Violations

Normally block merging until resolved.

Examples:

- Missing required tests.
- Unvalidated external input.
- Uncontrolled retries.
- Broken module boundaries.
- Unreviewed dependencies.

### Advisory Issues

May be scheduled separately when low-risk.

Examples:

- Minor naming improvements.
- Nonessential refactoring.
- Small documentation improvements.

Exceptions require documented justification and approval.

## 33. Final Mandatory Rule

**Implement CareerOS incrementally, according to `TASKS.md`, while respecting `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, and this `RULES.md`.**

Never prioritize speed over security, factual correctness, or maintainability.

Do not start the next task until the current task is verified and the user authorizes further work.

---

**End of RULES.md**