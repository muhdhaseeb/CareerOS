# CareerOS — Product Requirements Document

**Version:** 1.0 — Revised Draft  
**Product:** CareerOS  
**Category:** AI-powered job discovery, application management and career assistance SaaS  
**Initial users:** Freshers and recent graduates  
**Initial markets:** India and UAE  
**Initial sectors:** IT, software development, technical support and related technical careers  
**Recruitment coverage:** Private-sector and government opportunities  
**Pricing:** Free at launch  
**Delivery:** Public, multi-user web application  
**Status:** Approved (v1.0 Baseline)

---

# 1. Executive Summary

CareerOS is an AI-powered career platform that helps freshers discover legitimate employment opportunities, evaluate their suitability, prepare applications, contact relevant recruiters and manage their entire job search.

It brings together capabilities that are typically spread across job portals, resume tools, email services, spreadsheets and interview preparation platforms.

Unlike conventional job boards, CareerOS will support both:

1. **Private-sector recruitment:** Companies, startups, technology firms, IT service providers and other employers.
2. **Government recruitment:** Official public-sector vacancies, recruitment notifications, technical posts and eligible graduate-level opportunities.

The platform will initially serve candidates seeking employment in India and the UAE.

CareerOS will not guarantee employment, fabricate candidate qualifications, automatically submit applications, or present unverified information as fact.

# 2. Product Vision

**Make the process of finding and securing an entry-level job more organized, transparent, personalized and effective.**

CareerOS should help candidates answer six questions:

1. Which suitable jobs are currently available?
2. Am I eligible to apply?
3. How closely do my qualifications match the requirements?
4. How should I prepare my application?
5. Who can I legitimately contact about the opportunity?
6. What should I do next to improve my chances?

The product must provide actionable answers, not merely AI-generated encouragement.

# 3. Problem Statement

Freshers face several interconnected problems.

## 3.1 Job discovery fragmentation

Opportunities are scattered across:

- Company career websites.
- Startup hiring pages.
- Job boards.
- Government recruitment portals.
- Official recruitment notices.
- Public-sector organization websites.
- University and graduate recruitment pages.

Candidates must repeatedly visit multiple sources.

## 3.2 Unclear eligibility

Job advertisements may contain complicated or inconsistent requirements regarding:

- Education.
- Graduation year.
- Experience.
- Skills.
- Age.
- Nationality.
- Work authorization.
- Academic performance.
- Certifications.
- Recruitment-specific criteria.

Candidates waste time applying to unsuitable vacancies or miss opportunities for which they qualify.

## 3.3 Poor application preparation

Candidates often submit generic resumes without understanding which projects, internships and skills are most relevant.

## 3.4 Limited recruiter access

Some companies provide official recruitment addresses or publish professional hiring contacts, but candidates struggle to locate them.

## 3.5 Application tracking problems

Candidates lose track of applications, follow-ups, assessments, interviews and deadlines.

## 3.6 Government recruitment complexity

Government vacancies often require candidates to interpret lengthy official notifications and track multiple recruitment stages.

Ordinary job boards may not provide sufficient information about eligibility, application windows, fees, examination schedules or official notices.

# 4. Target Users

## 4.1 Primary users — Phase 1

Freshers, students and recent graduates seeking their first professional opportunity.

Supported candidate categories:

- Computer Science and IT graduates.
- Engineering graduates.
- Diploma holders seeking eligible technical roles.
- Candidates with internship experience.
- Self-taught candidates who meet employer requirements.
- Candidates seeking general graduate-level government opportunities.

## 4.2 Supported private-sector roles

Initial role categories:

- Software Developer / Engineer.
- Frontend Developer.
- Backend Developer.
- Full-Stack Developer.
- Web Developer.
- QA Engineer / Software Tester.
- IT Support / Technical Support.
- Application Support.
- System Administrator Trainee.
- Network Support.
- DevOps / Cloud Trainee.
- Data Analyst Trainee.
- Other relevant entry-level technical roles.

## 4.3 Supported government opportunities

Government recruitment coverage will include:

- Government software and IT positions.
- Public-sector technical support and computer-related roles.
- IT vacancies in public-sector undertakings.
- Technical recruitment in government departments.
- Eligible graduate-level government recruitment examinations.
- Relevant trainee and apprenticeship opportunities.

General government posts may be shown when they match the candidate's qualifications, but unrelated categories should not overwhelm the IT-focused experience.

## 4.4 Markets

### India

Support Indian locations, remote roles, graduate recruitment and relevant central/state government opportunities.

### UAE

Support Dubai, Abu Dhabi, Sharjah and other emirates, plus remote opportunities where eligibility permits.

UAE government and public-sector recruitment must respect published nationality, residency and other eligibility conditions.

**Phase 2:** Extend to experienced professionals.

**Later:** Add additional international markets.

# 5. Product Goals

## Primary goals

- Discover relevant vacancies with less manual searching.
- Reduce exposure to expired, duplicate and misleading listings.
- Help candidates understand eligibility.
- Improve the factual relevance of applications.
- Simplify professional recruiter outreach.
- Organize application progress and deadlines.
- Help users prepare for recruitment assessments and interviews.
- Make job-search performance measurable.

## Non-goals

CareerOS will not:

- Guarantee interviews, offers or employment.
- Invent candidate experience or qualifications.
- Circumvent third-party website protections.
- Automatically submit applications in the MVP.
- Send unsolicited bulk email campaigns.
- Treat recruiter outreach as a substitute for government application procedures.
- Guarantee government recruitment eligibility.
- Replace official recruitment notifications.

# 6. Product Modules

## 6.1 Candidate Profile Management

**Priority: MVP**

Candidates create a reusable professional profile containing:

- Name and contact details.
- Country and preferred locations.
- Education and qualifications.
- Graduation year.
- Academic results.
- Technical skills.
- Projects.
- Internships.
- Certifications.
- Employment history, if applicable.
- Preferred job categories.
- Salary preferences.
- Remote/hybrid/onsite preferences.
- Relocation preferences.
- Work authorization information when relevant.

For government recruitment, optional additional information may include:

- Date of birth or age-related eligibility inputs.
- Nationality.
- Required qualifications.
- Relevant examination preferences.
- Other recruitment-specific eligibility information.

Sensitive information must be collected only when necessary, with appropriate consent and access controls.

## 6.2 Automated Job Discovery Engine

**Priority: MVP**

CareerOS will automatically discover job opportunities from supported online sources.

### Sources

- Official company career pages.
- Startup career websites.
- Authorized job-board APIs and feeds.
- Publicly available recruitment pages where access and collection are permitted.
- Official government recruitment websites.
- Public-sector recruitment notifications.
- Official recruitment feeds and publications.

### Discovery behavior

- Automatically scan supported sources daily.
- Allow users to request manual refreshes.
- Identify newly published opportunities.
- Detect duplicate listings.
- Detect changes in application deadlines.
- Identify vacancies that appear closed or expired.
- Preserve original source links.
- Record discovery and verification timestamps.

Manual refresh may reuse recently collected data rather than trigger an unrestricted live crawl.

### Required listing fields

- Job title.
- Employer or recruiting organization.
- Country and location.
- Recruitment category.
- Employment type.
- Required qualifications.
- Experience requirements.
- Skills.
- Salary, when published.
- Application deadline, when published.
- Official application URL.
- Source URL.
- Source type.
- Discovery timestamp.
- Verification status.

Missing information must remain explicitly unknown.

### Source compliance

CareerOS must not assume every website can be scraped.

Sources must be classified as:

1. Official API/feed.
2. Authorized integration.
3. Permitted public-page collection.
4. Manual or administrator-curated source.
5. Unsupported/restricted source.

Unsupported sources must not be collected through access-control bypasses.

## 6.3 AI Job Matching Engine

**Priority: MVP**

Compare job requirements against the candidate profile.

### Matching dimensions

- Technical skills.
- Education.
- Experience.
- Projects.
- Internships.
- Certifications.
- Location.
- Work authorization.
- Other explicit eligibility requirements.

### Output

- Explainable match score.
- Matching qualifications.
- Missing qualifications.
- Hard eligibility constraints.
- Skills to improve.
- Application recommendation.
- Confidence and missing-data indicators.

The match score is an internal suitability indicator, not a prediction of employer shortlisting.

Hard eligibility requirements must not be overridden by a high skills score.

## 6.4 Government Job Intelligence

**Priority: MVP — focused implementation**

This is a dedicated module, not merely a category filter.

### A. Official notification discovery

Find and register supported government recruitment notifications.

Capture:

- Recruiting organization.
- Notification number, where available.
- Post name.
- Number of vacancies, where published.
- Qualifications.
- Experience requirements.
- Age limits.
- Application opening date.
- Closing date.
- Application fee, where published.
- Selection stages.
- Official notification link.
- Official application portal.

### B. Notification analysis

Use document extraction and AI to summarize lengthy notifications.

The system must distinguish:

- Facts extracted from official notices.
- AI interpretations.
- Missing information.
- Unresolved eligibility questions.

Critical information must link back to the relevant official notice or page.

### C. Eligibility checker

Evaluate candidate eligibility using available information.

Possible statuses:

- Eligible based on available requirements.
- Possibly eligible — confirmation needed.
- Not eligible based on a stated requirement.
- Unknown — insufficient information.

The system must explain the evidence behind its classification.

### D. Recruitment timeline tracking

Track available recruitment milestones:

- Notification publication.
- Application opening.
- Application deadline.
- Correction window.
- Examination or assessment.
- Admit card availability.
- Results.
- Further selection stages.

Only publish confirmed dates as confirmed. Dates that are unknown or subject to change must be labeled accordingly.

### E. Government application assistant

Help candidates:

- Understand the application process.
- Prepare required documents.
- Review eligibility.
- Follow the official application link.
- Track submission status manually.
- Record application references securely.
- Set reminders.

CareerOS will not submit government applications or pay fees on behalf of candidates in the MVP.

### F. Official-source priority

Official government notifications take precedence over third-party summaries.

Where sources conflict, the system must flag the discrepancy rather than silently choose an answer.

## 6.5 Recruiter and Company Contact Discovery

**Priority: MVP — limited release**

CareerOS will help candidates discover legitimate professional recruitment contact channels.

### Supported contact types

- Official company recruitment inboxes.
- Careers or HR email addresses.
- Publicly published professional recruiter contacts where collection and use are permitted.
- Official contact forms.
- Company careers pages.

### Contact information

- Company name.
- Contact name, if publicly and legitimately available.
- Professional role.
- Email address or contact URL.
- Source URL.
- Source publication or verification date.
- Verification status.
- Confidence level.

### Contact rules

- Never invent or guess an address and mark it verified.
- Do not harvest private contact information.
- Do not bypass website restrictions.
- Avoid collecting unnecessary personal data.
- Respect relevant privacy and anti-spam requirements.
- Provide a way to report inaccurate contacts.
- Do not use government recruitment enquiry channels for unrelated promotional outreach.

### Contact availability

Not every vacancy will have a recruiter contact.

CareerOS must display **No verified contact available** when appropriate.

It must never fabricate a contact merely to complete a listing.

## 6.6 AI Recruiter Outreach Assistant

**Priority: MVP**

Candidates can prepare personalized outreach messages.

### Features

- Generate job-specific email drafts.
- Create subject lines.
- Reference relevant candidate skills.
- Reference the actual vacancy.
- Attach or select a resume.
- Draft follow-up emails.
- Track outreach history.
- Support manual copying.
- Support connected Gmail sending after explicit user approval.

### Gmail integration

Where a user connects Gmail and authorizes the required permissions, CareerOS may prepare and send messages through that account.

Each send action requires user confirmation.

### Anti-abuse rules

- No unrestricted mass emailing.
- No sending without user authorization.
- No deceptive sender identities.
- No fabricated experience.
- No automatic repeated follow-ups without explicit authorization.
- Enforce sending quotas and abuse controls.
- Respect recipient opt-outs and applicable communication rules.

## 6.7 AI Resume Builder

**Priority: MVP**

Create and tailor resumes using verified candidate information.

### Features

- Resume upload.
- Resume parsing.
- Candidate review of extracted information.
- Structured resume editor.
- Job-specific tailoring.
- Project and internship prioritization.
- Keyword analysis.
- Formatting checks.
- Resume version history.
- PDF export.

### Rules

- No fabricated qualifications.
- No invented metrics.
- No fabricated experience.
- No unapproved factual changes.
- User review before export or sending.

ATS analysis must explain potential formatting and content issues rather than promise acceptance.

## 6.8 Application Management

**Priority: MVP**

Track private-sector and government applications.

### Common application fields

- Job reference.
- Employer or organization.
- Application date.
- Resume version.
- Application URL.
- Notes.
- Status.
- Important dates.
- Relevant documents.
- Status history.

### Private-sector statuses

- Saved.
- Preparing.
- Applied.
- Assessment.
- Interview scheduled.
- Interview completed.
- Offer received.
- Rejected.
- Withdrawn.

### Government recruitment statuses

- Notification saved.
- Eligibility review.
- Application open.
- Application submitted.
- Correction pending.
- Admit card available.
- Examination scheduled.
- Examination completed.
- Result published.
- Further selection.
- Selected.
- Not selected.
- Closed.

The system must support recruitment-specific stages without forcing government applications into a private-sector interview pipeline.

## 6.9 Reminders and Notifications

**Priority: MVP**

Support:

- Application deadlines.
- Follow-up reminders.
- Assessment dates.
- Interview dates.
- Government recruitment deadlines.
- Examination dates.
- Document submission reminders.
- Changes in tracked vacancy status.

In-app notifications are required initially.

Email notifications may be added when delivery and user-preference controls are ready.

## 6.10 Career Analytics

**Priority: Basic MVP; advanced features later**

Display:

- Jobs discovered.
- Relevant jobs saved.
- Applications submitted.
- Applications by location.
- Applications by role.
- Recruiter outreach sent.
- Outreach responses recorded.
- Interviews received.
- Application conversion rates.
- Government applications in progress.
- Upcoming deadlines.

Metrics must distinguish confirmed outcomes from manually entered or inferred information.

## 6.11 AI Interview Coach

**Priority: Post-MVP**

Future features:

- Role-specific interview questions.
- Job-description-based mock interviews.
- Technical assessment practice.
- Behavioral interview practice.
- Answer evaluation.
- Communication feedback.
- Interview readiness tracking.

## 6.12 Skill Gap Analyzer

**Priority: Post-MVP**

Future features:

- Analyze missing skills across relevant jobs.
- Identify frequently required technologies.
- Recommend targeted learning.
- Generate practice exercises.
- Track learning progress.

# 7. Core User Journeys

## Journey A — Private-sector job application

1. User registers and completes profile.
2. CareerOS discovers suitable jobs.
3. User filters jobs by location, role and eligibility.
4. User opens a vacancy.
5. CareerOS explains the job match.
6. User reviews eligibility.
7. User tailors a resume.
8. User opens the employer application page.
9. User submits the application.
10. User records the application in CareerOS.
11. CareerOS tracks deadlines and follow-ups.

## Journey B — Recruiter outreach

1. User selects a private-sector vacancy.
2. CareerOS searches supported professional contact sources.
3. The system displays a verified or appropriately labeled contact.
4. User generates a personalized email.
5. User reviews and edits the draft.
6. User copies the email or sends it using an authorized Gmail connection.
7. CareerOS records the outreach.
8. User tracks any response and follow-up.

## Journey C — Government recruitment

1. CareerOS discovers an official recruitment notification.
2. User opens the vacancy.
3. CareerOS extracts key requirements and dates.
4. User checks eligibility.
5. CareerOS explains matching and uncertain criteria.
6. User reads the official notification.
7. User prepares the required documents.
8. User applies through the official portal.
9. User records the application.
10. CareerOS tracks available recruitment milestones.
11. User receives relevant reminders.

# 8. User Roles

## Candidate

Can:

- Manage personal profile.
- Discover jobs.
- Review matches.
- Create resumes.
- Find supported professional contacts.
- Draft and send authorized outreach.
- Track applications.
- Manage reminders.
- View personal analytics.

## Platform Administrator

Can:

- Manage job sources.
- Review reported listings.
- Monitor ingestion failures.
- Review public job data quality.
- Manage abusive platform usage.
- Monitor operational metrics.
- Configure source availability.

Administrators must not have unrestricted access to private candidate documents or email contents.

# 9. MVP Definition

The MVP must demonstrate a complete, useful workflow.

## MVP deliverables

**Foundation**
- User registration and authentication.
- Candidate profile.
- Secure resume storage.

**Job intelligence**
- Automated daily discovery.
- Manual refresh.
- India and UAE filters.
- Private-sector job discovery.
- Government recruitment discovery.
- Duplicate detection.
- Source attribution.
- Job eligibility and matching.

**Application assistance**
- AI resume tailoring.
- Resume PDF export.
- Official application links.
- Application tracking.
- Deadline reminders.

**Recruiter outreach**
- Public professional contact discovery.
- Contact source verification.
- Personalized email generation.
- Manual sending workflow.
- Optional Gmail connection and approved sending.

**Management**
- Candidate dashboard.
- Basic analytics.
- Administrator source management.
- Usage limits and abuse controls.

## Deferred features

- Automatic application submission.
- Full browser-based application automation.
- Voice interview coaching.
- Advanced interview simulations.
- Advanced skill learning.
- Recruiter marketplace.
- Employer accounts.
- Subscription billing.
- International markets beyond India and UAE.

# 10. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | Candidate registration and login | Must |
| FR-002 | Candidate profile management | Must |
| FR-003 | Resume upload and extraction | Must |
| FR-004 | Scheduled job discovery | Must |
| FR-005 | Manual discovery refresh | Must |
| FR-006 | Job filtering and search | Must |
| FR-007 | Duplicate and expiry detection | Must |
| FR-008 | Explainable job matching | Must |
| FR-009 | Government notification discovery | Must |
| FR-010 | Government eligibility assessment | Must |
| FR-011 | Government deadline tracking | Must |
| FR-012 | Resume tailoring and PDF export | Must |
| FR-013 | Application tracking | Must |
| FR-014 | Recruiter contact discovery | Must |
| FR-015 | Outreach email drafting | Must |
| FR-016 | Manual outreach workflow | Must |
| FR-017 | Optional Gmail integration | Must |
| FR-018 | Reminders and notifications | Must |
| FR-019 | Basic analytics | Must |
| FR-020 | Administrator source controls | Must |
| FR-021 | AI interview coaching | Later |
| FR-022 | Advanced skill gap analysis | Later |

# 11. Data Quality Requirements

Every discovered vacancy must maintain:

- Source identification.
- Source URL.
- Collection timestamp.
- Last successful verification timestamp.
- Verification state.
- Extracted fields.
- Missing-field indicators.
- Duplicate detection state.
- Expiry or closure status when known.

A listing must not be labeled verified solely because AI generated a plausible summary.

For government jobs, critical eligibility and deadline fields must be traceable to official source material.

If a source cannot be accessed or verified, the system must display that limitation.

# 12. AI Requirements

AI may assist with:

- Job description parsing.
- Recruitment notification summarization.
- Resume extraction.
- Skills normalization.
- Match explanations.
- Eligibility explanations.
- Resume tailoring.
- Outreach drafting.

AI must not independently:

- Invent job listings.
- Invent recruiter contacts.
- Alter verified candidate facts.
- Guarantee eligibility.
- Submit applications.
- Send emails without approval.
- Declare unsupported information verified.

Where possible, hard eligibility checks and deadline comparisons should use deterministic rules rather than relying exclusively on language-model output.

# 13. Security and Privacy

The platform must implement:

- Secure authentication and session management.
- User-level data isolation.
- Authorization checks on all private resources.
- Secure document upload validation.
- Encryption in transit and appropriate encryption at rest.
- Protected email integration credentials.
- Minimal OAuth permissions.
- Explicit user consent for email connections.
- Account deletion and data deletion workflows.
- Audit records for important user actions.
- Rate limits and abuse prevention.
- Protection against malicious instructions embedded in documents and web pages.
- Restricted access to sensitive candidate information.

Government eligibility information that is sensitive must not be collected unnecessarily.

Privacy and outreach practices must be reviewed against applicable India and UAE requirements before public release.

# 14. Reliability and Performance

## Reliability

- Failed ingestion tasks must be retryable.
- Duplicate jobs must not create duplicate applications.
- Source failures must not erase previously saved applications.
- Email sending must avoid duplicate sends.
- Deadline changes must preserve an audit history.
- AI failures must produce recoverable user-facing errors.

## Performance

- Paginated job search.
- Efficient filtering.
- Background document processing.
- Controlled manual refresh.
- Cached reusable job data.
- Responsive dashboard.

## Scalability

The system must support multiple independent users, expanding source coverage and future country-specific recruitment rules.

# 15. Free Product Constraints

CareerOS will be free at launch.

However, operational costs must be controlled.

Required safeguards:

- AI usage quotas.
- Per-user request limits.
- Shared job ingestion rather than duplicating scans for every user.
- Controlled email sending.
- Storage quotas.
- Caching.
- Abuse detection.
- Administrative cost monitoring.

The product must not depend on unlimited free access to third-party AI, scraping or email services.

Monetization is outside the initial scope.

# 16. Success Metrics

## Discovery quality

- Percentage of listings with working official application links.
- Duplicate listing rate.
- Percentage of listings with verified deadlines.
- Percentage of government notices with traceable eligibility data.
- User-reported relevance of discovered jobs.

## Candidate engagement

- Weekly active users.
- Saved-job conversion.
- Application tracking usage.
- Resume tailoring completion.
- Outreach draft usage.
- Candidate retention.

## Career outcomes

- Applications submitted.
- Interview invitations recorded.
- Outreach responses recorded.
- Offers recorded.
- Application-to-interview conversion.

Outcome metrics must be interpreted cautiously because users may not record every application or employer response.

# 17. Key Product Risks

| Risk | Mitigation |
|---|---|
| Restricted access to job websites | Source registry, permitted integrations and official feeds |
| Incomplete job coverage | Transparent source coverage and continuous source expansion |
| Outdated government notices | Official-source verification and scheduled rechecks |
| Incorrect eligibility advice | Rule-based checks, source evidence and uncertainty labels |
| Inaccurate recruiter contacts | Source attribution and verification status |
| Email abuse | User approval, quotas and anti-spam controls |
| AI-generated misinformation | Grounding, validation and review |
| High operating costs | Shared ingestion, caching and AI quotas |
| Sensitive personal data exposure | Minimal collection, isolation and access controls |
| Scope becoming too large | Incremental delivery and strict release gates |

# 18. Delivery Phases

## Phase 1A — Core CareerOS

- Authentication.
- Candidate profile.
- Resume upload.
- Private-sector job discovery.
- Job matching.
- Application tracking.

## Phase 1B — Government Recruitment Intelligence

- Official government job sources.
- Notification extraction.
- Eligibility assessment.
- Government application tracking.
- Deadline reminders.

## Phase 1C — Application and Outreach Intelligence

- Resume tailoring.
- Resume PDF export.
- Professional contact discovery.
- AI outreach drafts.
- Manual outreach.
- Gmail integration.

These phases together constitute the planned initial product. They should be validated incrementally rather than implemented simultaneously.

## Phase 2 — Career Development

- Interview coaching.
- Skill gap analysis.
- Advanced analytics.
- More comprehensive job-source coverage.

## Phase 3 — Audience Expansion

- Experienced professionals.
- Career transitions.
- Additional markets.
- More advanced candidate workflows.

# 19. MVP Acceptance Criteria

The initial product will be ready for controlled public release only when:

1. Users can register and manage private profiles.
2. Users can upload resumes and correct extracted information.
3. The system discovers jobs from working, permitted sources.
4. Job listings preserve their source and verification state.
5. Users can find relevant private-sector IT opportunities in India and the UAE.
6. Users can find supported government recruitment opportunities.
7. Government recruitment summaries link to official source evidence.
8. Eligibility assessments identify uncertainty and hard requirements.
9. Users can receive explainable job matches.
10. Users can create and export truthful tailored resumes.
11. Users can track private-sector and government applications.
12. Users can find available professional recruitment contacts with source attribution.
13. Users can generate and manually send personalized outreach.
14. Gmail-connected users can send messages only after explicit approval.
15. Users can receive reminders for relevant deadlines.
16. The system prevents unauthorized access to other users' information.
17. AI and ingestion failures are recoverable.
18. Rate limits and cost controls are active.
19. Administrative controls allow problematic job sources to be disabled.
20. Core user journeys pass functional, security and integration testing.

# 20. Explicit Product Decisions

**Approved by product owner**

- Initial focus: Freshers.
- Future audience: Experienced professionals.
- Initial markets: India and UAE.
- Initial sectors: IT/software and related technical roles.
- Include government jobs.
- Discover jobs automatically each day.
- Support manual refresh.
- Use company pages, startup websites, job boards and supported public sources.
- Assisted applications only.
- Manual and connected-email outreach.
- Interview preparation after the core application system.
- Public multi-user web application.
- Free at launch.

**Proposed defaults requiring final approval**

- Include eligible graduate-level government posts alongside technical government roles.
- Prioritize official recruitment sources.
- Use evidence-based eligibility statuses.
- Do not automatically submit government applications.
- Require approval for every email send.
- Use quotas to manage operating costs.

# 21. Architecture Handoff Requirements

The future architecture document must address:

- Multi-user security and isolation.
- Job-source integration boundaries.
- Scheduled ingestion.
- Job normalization and deduplication.
- Government notification processing.
- Evidence-based eligibility evaluation.
- Resume processing and generation.
- Recruiter contact provenance.
- Gmail authorization and sending.
- AI orchestration and validation.
- Application state management.
- Reminder delivery.
- Observability and cost control.

No specific programming language, framework, database, AI provider or deployment architecture is approved by this PRD.

Those decisions belong in the System Architecture Document.

---

**End of CareerOS PRD v1.0**

