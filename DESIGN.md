# CareerOS — UI/UX Design Specification

**Document ID:** CAREEROS-DES-001  
**Version:** 1.0 — Draft  
**Status:** Approved (v1.0 Baseline)  
**Source of Truth:** Approved PRD v1.0, SAD v1.0, Engineering Rules v1.0  
**Visual Reference:** Adzuna Core (user-provided)  
**Scope:** Responsive web application, India and UAE, private-sector and government recruitment

---

## 1. Design Vision

CareerOS must feel like a trustworthy professional tool that helps job seekers make decisions and take action.

The interface should be:

- **Clear:** Users immediately understand their next action.
- **Efficient:** Finding and applying to jobs requires minimal unnecessary navigation.
- **Trustworthy:** Source verification, deadlines, and eligibility uncertainty are visible.
- **Accessible:** Usable with keyboard navigation, assistive technologies, and mobile devices.
- **Consistent:** Private and government recruitment share a design system while preserving their different workflows.

The visual language follows Adzuna Core: restrained green accents, navy typography, white surfaces, subtle borders, and limited decoration.

### Primary design principle

**Show the right opportunity, explain why it matters, and make the next action obvious.**

CareerOS should not prioritize decorative AI interfaces over practical job-search functionality.

## 2. Design Tokens

### 2.1 Colors

| Token | Value | Usage |
|---|---|---|
| Primary | `#279B37` | Primary actions, active elements, key links |
| Primary hover | `#228531` | Hover and active feedback |
| Secondary | `#083859` | Headings, navigation, prominent labels |
| Surface | `#FFFFFF` | Cards, forms, dialogs |
| Background | `#F7F7F7` | Application background |
| Text | `#333333` | Primary body content |
| Muted | `#6B7280` | Supporting information |
| Border | `#DDDDDD` | Separators, cards, inputs |
| Error | `#C62828` | Destructive actions, validation errors |
| Overlay | `#00000080` | Modal backdrop |

Additional semantic colors for warning, information, and eligibility states may be introduced only after contrast and accessibility testing.

Color must never be the sole indicator of eligibility or application status.

### 2.2 Typography

Font stack:

`Helvetica Neue, Arial, sans-serif`

| Style | Size | Weight | Line height |
|---|---|---|---|
| Display | 36px | 300 | 40px |
| Page heading | 30px | 300–500 | 36px |
| Section heading | 20px | 500–600 | 28px |
| Card heading | 16px | 600 | 24px |
| Body large | 16px | 400 | 24px |
| Body | 14px | 400 | 22–24px |
| Supporting text | 12px | 400 | 20px |
| Form label | 14px | 600 | 20px |
| Button | 16px | 600 | 20px |

The reference's light headline style is retained where readability permits. Body text is increased to weight 400 for extended reading.

### 2.3 Spacing

Core spacing tokens:

- XS: 8px
- SM: 16px
- MD: 42px
- LG: 64px
- XL: 102px

Component layouts may use smaller intermediate spacing values such as 4px, 12px, 24px, and 32px.

The 42px token should primarily support larger section spacing or reference-specific compositions, not replace ordinary form spacing.

### 2.4 Border radius

- Small: 4px
- Medium: 6px
- Large: 8px
- Extra large: 12px
- Pill: 9999px, reserved for chips and compact tags

### 2.5 Component dimensions

- Standard desktop buttons: minimum 42px height.
- Standard inputs: minimum 42px height.
- Touch targets: aim for at least 44 × 44px on mobile.
- Cards: 16px default padding.
- Dialogs: 32px desktop padding, reduced on narrow screens.
- Borders: generally 1px solid neutral border color.

## 3. Application Information Architecture

### Public navigation

- Home
- Find Jobs
- Government Jobs
- How It Works
- Sign In
- Get Started

Public visitors may browse accessible job listings without creating an account.

Personalized matching, resume management, application tracking, and outreach require authentication.

### Authenticated navigation

**Primary**

1. Dashboard
2. Find Jobs
3. Government Jobs
4. Saved Jobs
5. Applications
6. Resumes
7. Recruiter Outreach

**Secondary**

8. Notifications
9. Profile
10. Settings

**Later releases**

- Interview Coach
- Skill Development

### Administrative navigation

- Overview
- Job Sources
- Ingestion Runs
- Government Notices
- Reported Listings
- Contact Reports
- Platform Usage
- Operational Health

Administrative navigation must not expose private candidate data by default.

## 4. Responsive Layout

### Desktop — 1200px and above

- Persistent left navigation sidebar.
- Main content area with a maximum readable width.
- Optional right-side contextual panel on detail screens.
- Two-column job search layout.
- Tables for dense application management.

### Tablet — 768px to 1199px

- Collapsible sidebar.
- Reduced column count.
- Compact filter controls.
- Detail panels displayed inline or as drawers.

### Mobile — below 768px

- Compact header.
- Accessible navigation drawer.
- Single-column content.
- Filters in a dismissible panel.
- Cards instead of wide tables where necessary.
- Sticky primary action on suitable detail screens.

Horizontal scrolling must not be required for ordinary job discovery or application management.

## 5. Screen Specifications

### Screen 01 — Public Landing Page

**Purpose:** Explain CareerOS and guide visitors into job discovery.

Sections:

1. Header with logo and navigation.
2. Hero with job search.
3. India/UAE location selector.
4. Private-sector and government job discovery entry points.
5. How CareerOS works.
6. Feature overview.
7. Trust and source transparency information.
8. Footer.

Primary CTA: **Find Jobs**

Secondary CTA: **Create Free Account**

Avoid unsupported claims about placement rates or guaranteed employment.

### Screen 02 — Registration and Login

Fields:

- Email.
- Password.
- Password confirmation for registration.

Supporting actions:

- Sign in.
- Register.
- Forgot password.
- Verify email.

States:

- Validation errors.
- Invalid credentials.
- Email verification pending.
- Rate-limited attempt.
- Successful authentication.

Never reveal whether sensitive account information exists unnecessarily.

### Screen 03 — Candidate Onboarding

Use a short multi-step process.

**Step 1 — Career preferences**

- Target roles.
- India/UAE selection.
- Preferred locations.
- Remote/hybrid/onsite preferences.

**Step 2 — Education**

- Qualification.
- Institution.
- Graduation year.
- Relevant academic details.

**Step 3 — Skills and experience**

- Technical skills.
- Projects.
- Internships.
- Certifications.

**Step 4 — Resume**

- Upload existing resume.
- Create a resume later.

**Step 5 — Review**

- Confirm extracted details.
- Correct mistakes.
- Complete onboarding.

Allow users to skip optional information and return later.

Sensitive government eligibility information should be requested contextually, not collected indiscriminately during onboarding.

### Screen 04 — Candidate Dashboard

**Purpose:** Provide a concise view of the user's job search.

Main sections:

- Welcome and profile completion.
- Recommended jobs.
- Newly discovered opportunities.
- Upcoming deadlines.
- Applications in progress.
- Government recruitment updates.
- Recruiter outreach follow-ups.
- Quick actions.

Suggested quick actions:

- Find Jobs.
- Check Government Jobs.
- Tailor Resume.
- Track Application.

The dashboard must distinguish actual application outcomes from recommendations or estimates.

### Screen 05 — Job Discovery

**Purpose:** Find relevant private-sector IT opportunities.

Layout:

**Search header**
- Job title or keyword.
- Location.
- Country.
- Search button.

**Filter panel**
- Experience level.
- Role category.
- Remote/hybrid/onsite.
- Salary when available.
- Posting date.
- Source type.
- Verification state.

**Results**
- Company.
- Job title.
- Location.
- Employment type.
- Experience requirements.
- Posting freshness.
- Match summary when available.
- Save action.

**Detail panel**
- Full description.
- Eligibility requirements.
- Matching and missing skills.
- Source verification.
- Official application link.
- Resume tailoring action.
- Available recruiter contacts.

Do not show an invented match percentage before the candidate profile has sufficient information.

### Screen 06 — Job Details

Sections:

1. Job title and company.
2. Location and employment type.
3. Source and verification information.
4. Description.
5. Responsibilities.
6. Required qualifications.
7. Preferred qualifications.
8. Candidate match explanation.
9. Recruiter contact availability.
10. Application actions.

Primary action: **Apply on Employer Website**

Secondary actions:

- Save Job.
- Tailor Resume.
- Find Recruiter Contact.

External application links must clearly indicate that the user is leaving CareerOS.

### Screen 07 — Government Job Discovery

**Purpose:** Discover and evaluate official government recruitment opportunities.

Filters:

- Country.
- Recruiting organization.
- Central/state government where relevant.
- Role category.
- Qualification.
- Application status.
- Deadline.
- Recruitment type.

Each listing should display:

- Recruiting organization.
- Post name.
- Notification reference.
- Published vacancy count when available.
- Required qualification.
- Application deadline.
- Official notification source.
- Verification state.

Primary action: **View Recruitment Details**

Do not present third-party summaries as official notices.

### Screen 08 — Government Recruitment Details

Sections:

1. Recruiting organization.
2. Post details.
3. Official notification.
4. Qualification requirements.
5. Age and other eligibility requirements.
6. Application fees when published.
7. Application dates.
8. Selection process.
9. Eligibility assessment.
10. Recruitment timeline.
11. Required documents.
12. Official application portal.

Eligibility must use text labels:

- Eligible based on available information.
- Possibly eligible.
- Not eligible.
- Unknown.

Each result includes an explanation and supporting source evidence.

Primary action: **Apply on Official Portal**

Secondary actions:

- Check Eligibility.
- Save Recruitment.
- Set Reminder.

The user must be able to inspect the original official notice before applying.

### Screen 09 — Resume Manager

Features:

- Resume list.
- Upload resume.
- Create resume.
- Edit structured resume.
- Tailor to selected job.
- Preview PDF.
- Export PDF.
- Version history.

Resume tailoring uses a split-screen editor on desktop:

**Left:** Candidate's approved resume content.

**Right:** AI-suggested changes and job requirements.

Changes should be reviewable individually.

Never silently replace factual resume content.

### Screen 10 — Recruiter Outreach

Sections:

- Selected job.
- Available professional contacts.
- Contact source and verification.
- Email subject.
- Email editor.
- Resume attachment selection.
- Manual copy action.
- Gmail connection status.
- Send confirmation.
- Outreach history.

Primary action depends on connection state:

- **Copy Email**
- **Review and Send**

A confirmation step must display the recipient, subject, body, and attachments before Gmail sending.

If no legitimate contact is available, show that explicitly rather than offering a fabricated address.

### Screen 11 — Application Tracker

Provide two views:

**Table view**

Useful for searching, filtering, and reviewing many applications.

**Board view**

Useful for visualizing private-sector application stages.

Government applications should use recruitment-specific stages instead of being forced into an interview-oriented board.

Application detail includes:

- Job snapshot.
- Current status.
- Status history.
- Resume used.
- Application date.
- Notes.
- Deadlines.
- Follow-ups.
- External reference information.

### Screen 12 — Notifications

Group notifications by:

- Application deadlines.
- Government recruitment updates.
- Interview reminders.
- Recruiter follow-ups.
- Source verification warnings.
- System messages.

Notifications should link directly to the relevant record.

### Screen 13 — Profile and Settings

Profile:

- Personal details.
- Education.
- Skills.
- Projects.
- Experience.
- Job preferences.

Settings:

- Password and account security.
- Gmail connection.
- Notification preferences.
- Privacy controls.
- Data export and deletion.
- Account deletion.

### Screen 14 — Administrator Dashboard

Provide operational visibility without unnecessary access to private candidate information.

Sections:

- Source health.
- Failed ingestion runs.
- Stale listings.
- Reported jobs.
- Government notice review.
- Contact correction requests.
- AI usage.
- Queue health.
- Platform abuse signals.

Administrators should be able to disable problematic sources and inspect processing errors.

## 6. Component Library

Reusable components must include:

- Primary button.
- Secondary button.
- Text link.
- Input field.
- Select.
- Search field.
- Filter chip.
- Job card.
- Government recruitment card.
- Eligibility status.
- Source verification indicator.
- Deadline indicator.
- Resume preview.
- Application status indicator.
- Confirmation dialog.
- Toast notification.
- Empty state.
- Loading skeleton.
- Error state.
- Pagination.
- Accessible table.
- Responsive drawer.

### Job Card Requirements

A job card should prioritize:

1. Job title.
2. Employer.
3. Location.
4. Experience requirement.
5. Posting or verification freshness.
6. Match information, if available.
7. Save and details actions.

Avoid overwhelming cards with every available field.

### Government Recruitment Card Requirements

Prioritize:

1. Post name.
2. Recruiting organization.
3. Qualification.
4. Deadline.
5. Official source.
6. Eligibility summary, if evaluated.

## 7. User Experience Workflows

### Private-Sector Job Journey

Dashboard → Find Jobs → Job Details → Match Review → Tailor Resume → Apply Externally → Track Application.

### Government Recruitment Journey

Government Jobs → Official Notice → Eligibility Check → Recruitment Timeline → Official Portal → Track Application.

### Recruiter Outreach Journey

Job Details → Find Contact → Verify Source → Generate Draft → Edit → Confirm → Copy or Send → Track Outreach.

### Resume Journey

Resume Manager → Upload → Extract → Correct Facts → Tailor → Review → Preview → Export.

All workflows must support returning to the previous step without losing valid user input.

## 8. Loading, Empty, and Error States

### Loading

Use skeletons for:

- Job lists.
- Dashboard cards.
- Resume lists.
- Application records.

Use progress indicators for longer tasks:

- Resume extraction.
- Government notice processing.
- AI resume tailoring.
- Eligibility evaluation.

Do not display artificial progress percentages when actual progress is unknown.

### Empty states

Examples:

**No matching jobs**

Explain that no results match the current filters and offer to broaden the search.

**No government vacancies**

Explain the current source coverage and verification freshness.

**No recruiter contact**

Display that no verified professional contact is available.

**No applications**

Offer an action to save or track the first application.

### Error states

Handle:

- Network failure.
- Expired session.
- Unsupported document.
- AI processing failure.
- Unavailable source.
- Invalid external application link.
- Gmail authorization failure.
- Email sending failure.
- Rate-limit exceeded.

Errors must provide a useful recovery action where one exists.

## 9. Trust and Transparency

CareerOS must visually distinguish:

- Official source.
- Third-party source.
- Verified data.
- Unverified data.
- Outdated information.
- AI-generated suggestion.
- User-entered information.

For job and government recruitment details, show the last successful verification timestamp.

Do not use a generic green checkmark to imply all aspects of a vacancy have been independently verified.

Government eligibility explanations must show which criteria passed, failed, or remain unknown.

## 10. Accessibility Standards

Target WCAG 2.2 AA.

Required:

- Keyboard-accessible navigation.
- Visible focus states.
- Semantic headings.
- Accessible form labels.
- Meaningful error messages.
- Adequate text contrast.
- Screen-reader announcements for asynchronous updates.
- Proper dialog focus management.
- Non-color status indicators.
- Reduced-motion support.

All primary workflows must be usable without a mouse.

## 11. Interaction Rules

### Primary actions

Use green primary buttons for the most important action on a screen.

Avoid displaying multiple competing primary buttons in the same immediate context.

### Destructive actions

Require confirmation for:

- Account deletion.
- Resume deletion where recovery is unavailable.
- Disconnecting integrations when consequences matter.
- Other irreversible operations.

### External actions

Clearly distinguish between:

- Opening an application page.
- Recording an application as submitted.
- Sending an email.
- Saving an email draft.

CareerOS must never imply an external application was submitted merely because the application link was opened.

### AI actions

AI-generated content must remain editable and identifiable as a suggestion until approved.

## 12. Content and Microcopy Standards

Use clear, concise, professional language.

Preferred:

- "Apply on official website"
- "Check eligibility"
- "Last verified"
- "Review suggested changes"
- "No verified contact available"
- "Application status not confirmed"

Avoid:

- "Guaranteed ATS success"
- "You will get hired"
- "100% eligible"
- "Recruiter verified" without evidence
- "Application submitted" without confirmation

Use sentence case for labels and navigation.

## 13. Design Deliverables

Before frontend implementation, the design phase should produce:

1. Information architecture and navigation map.
2. Desktop and mobile wireframes.
3. High-fidelity designs for the core screens.
4. Component library.
5. Design token specification.
6. Interaction states.
7. Responsive behavior documentation.
8. Accessibility annotations.
9. Prototype of the private-sector job journey.
10. Prototype of the government recruitment journey.
11. Prototype of the recruiter outreach journey.
12. Developer handoff specifications.

The uploaded Adzuna Core reference supplies visual guidance, but does not replace these CareerOS-specific design deliverables.

## 14. Design Acceptance Criteria

The design is ready for implementation planning when:

- Every MVP workflow has a defined entry and completion point.
- Every primary screen has desktop and mobile behavior.
- Job and government recruitment flows are clearly differentiated.
- Eligibility uncertainty is visible.
- Source verification is understandable.
- Resume changes require review.
- Email sending requires explicit confirmation.
- Empty, loading, and failure states are defined.
- Core interactions meet accessibility requirements.
- Components use consistent tokens.
- No design implies unsupported product capabilities.

## 15. Scope and Change Control

This document defines the approved PRD's user experience and proposed visual implementation.

It does not authorize additional product functionality.

Changes to recruitment workflows, user roles, application automation, data privacy, or external actions must be reconciled with the PRD and architecture.

---

**End of CareerOS Design Specification v1.0**

**Status:** Approved (v1.0 Baseline).

**Next document:** Implementation Task Breakdown, after design approval.

No application code has been generated.