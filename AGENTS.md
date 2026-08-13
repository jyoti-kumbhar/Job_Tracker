# AGENTS.md

## Project: Job Tracker Android App

This file defines the development rules and working instructions for AI coding agents working on this project.

---

## 1. Project Goal

Build a native Android job application tracker using:

- Expo
- React Native
- TypeScript
- Expo Router
- AsyncStorage for local persistence

The app is based on the provided `design.html`.

### Core constraints

- Android-first
- Expo-based
- No login
- No backend
- No remote database
- Local device storage only
- Internet is optional for external job searches and live job APIs
- `design.html` is a UI/UX reference only
- Do not copy HTML/CSS directly into the React Native application

---

## 2. Source of Truth

### UI/UX

`design.html` is the primary source of truth for:

- Visual hierarchy
- Colors
- Typography
- Spacing
- Buttons
- Cards
- Tabs
- Forms
- Status presentation
- Search layout
- Board layout
- Empty states
- Modal structure

Recreate these concepts using native React Native components.

Do not assume that browser-specific HTML behavior should be preserved on Android.

### Functional behavior

The project requirements in `phases.md` are the source of truth for the development scope and implementation phases.

If a feature is not required by `phases.md`, do not add it unnecessarily.

---

## 3. Development Principles

### Keep the app simple

Do not introduce:

- Authentication
- User accounts
- Backend servers
- Cloud databases
- Firebase
- Supabase
- PostgreSQL
- MySQL
- MongoDB

unless the project requirements are explicitly changed later.

### Local-first

Application data must work completely offline.

Use:

```text
React Native UI
      ↓
Service Layer
      ↓
AsyncStorage
      ↓
Android Device
```

The core tracker must not depend on an internet connection.

---

## 4. Technology Rules

Use:

- Expo
- React Native
- TypeScript
- Expo Router
- AsyncStorage
- Expo Linking
- Expo FileSystem
- Expo Sharing

Only add another dependency when there is a clear requirement.

Before adding a dependency:

1. Check whether Expo already provides the functionality.
2. Check whether React Native can handle it directly.
3. Prefer the smallest reliable solution.
4. Avoid unnecessary libraries.

Keep dependencies minimal.

---

## 5. Project Structure

Use a structure similar to:

```text
job-tracker/
│
├── app/
│   ├── index.tsx
│   ├── search.tsx
│   ├── board.tsx
│   └── application/
│       ├── new.tsx
│       └── [id].tsx
│
├── components/
│   ├── Header.tsx
│   ├── Stats.tsx
│   ├── SearchForm.tsx
│   ├── JobCard.tsx
│   ├── ApplicationCard.tsx
│   ├── StatusColumn.tsx
│   ├── PortalCard.tsx
│   └── ApplicationForm.tsx
│
├── data/
│   └── portals.ts
│
├── services/
│   ├── storage.ts
│   ├── jobSearch.ts
│   └── export.ts
│
├── types/
│   └── application.ts
│
├── utils/
│   ├── dates.ts
│   ├── validation.ts
│   └── statistics.ts
│
├── constants/
│   ├── colors.ts
│   └── statuses.ts
│
└── assets/
```

Agents may adjust this structure when necessary, but should avoid unnecessary restructuring.

---

## 6. Data Model

The central application model should remain strongly typed.

```ts
type ApplicationStatus =
  | "saved"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

interface JobApplication {
  id: string;
  company: string;
  role: string;
  link?: string;
  status: ApplicationStatus;
  appliedDate?: string;
  deadline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

Do not duplicate this model in multiple files.

Use the shared type everywhere.

---

## 7. Application Statuses

The application statuses are:

```text
Saved
Applied
Interview
Offer
Rejected
```

Do not add additional statuses unless explicitly requested.

Status-related logic should use shared constants rather than hard-coded strings throughout the UI.

---

## 8. Storage Rules

All application records must be stored locally.

Create a dedicated storage service.

Example responsibilities:

```text
saveApplication()
getApplications()
getApplication()
updateApplication()
deleteApplication()
deleteAllApplications()
```

UI components should not directly contain AsyncStorage logic.

Preferred architecture:

```text
Screen
  ↓
Hook / State
  ↓
Service
  ↓
AsyncStorage
```

Always handle storage errors.

---

## 9. UI Rules

### Native React Native

Use:

- `View`
- `Text`
- `Pressable`
- `ScrollView`
- `FlatList`
- `TextInput`
- `Modal`
- `ActivityIndicator`
- Native/Expo date controls where appropriate

Do not use:

- HTML tags
- DOM APIs
- `document`
- `window`
- browser CSS
- browser event handlers

---

## 10. Design Conversion Rules

The desktop HTML design must be adapted for Android.

Do not blindly reproduce desktop layouts.

### Preserve

- Visual hierarchy
- Branding
- Color system
- Typography style
- Card design
- Status colors
- Button hierarchy
- Form structure
- Information hierarchy

### Adapt

- Desktop grid → mobile layout
- `<select>` → mobile selector
- HTML modal → React Native modal/bottom sheet
- Browser links → Expo Linking
- Desktop board → horizontal/mobile Kanban
- CSS hover states → press states

---

## 11. Main Screens

The application should contain the following major areas:

### Main / Application Log

Contains:

- Header
- New Entry
- Statistics
- Search
- Board

### Search

Contains:

- Role/keywords
- Location
- Job type
- Work mode
- Experience level
- Search button
- Live listings
- External job portal links

### Board

Contains:

- Saved
- Applied
- Interview
- Offer
- Rejected

### Application Form

Used for:

- Creating an application
- Editing an application

---

## 12. Application Form Rules

Required:

```text
Company
Role
```

Optional:

```text
Job link
Status
Applied date
Deadline
Notes
```

Validate required fields before saving.

Validate supplied URLs.

Do not silently discard user-entered information.

---

## 13. Application Cards

Application cards should display, where available:

- Company
- Role
- Applied date
- Follow-up/deadline
- Job link
- Status
- Edit action

Long text must not break the layout.

Use truncation or wrapping appropriately.

---

## 14. Statistics

Statistics must be calculated from the application list.

Required statistics:

```text
Total
Applied
Interview
Offers
Next Deadline
```

Do not store duplicated statistics in AsyncStorage.

If applications change, statistics should update automatically.

---

## 15. Job Portal Search

External job portals are opened outside the app.

The app should generate search URLs based on:

- Role
- Location
- Job type
- Work mode
- Experience

Potential portals include:

```text
LinkedIn
Indeed
Naukri
Internshala
Glassdoor
ZipRecruiter
Monster
Wellfound
Google Jobs
```

Use Expo/React Native linking.

Do not scrape websites inside the app.

Do not build unofficial scraping logic unless explicitly requested.

---

## 16. Live Job APIs

Live job listings are optional and should not block the core tracker.

Implement them only after the MVP works.

Requirements:

- Loading state
- Empty state
- Network error state
- Retry
- Job card
- Open posting
- Save to tracker

The tracker must remain functional when APIs are unavailable.

---

## 17. Export and Import

Because there is no backend, data portability is important.

### Export

Export applications as JSON.

### Import

Import previously exported JSON.

Validate imported data before saving.

Do not overwrite all existing data without confirmation.

---

## 18. Error Handling

Never allow expected errors to crash the app.

Handle:

- Storage errors
- Invalid data
- Invalid URLs
- Network errors
- API errors
- Empty search results
- File import errors
- Export errors

Show user-friendly messages.

Avoid exposing raw stack traces to users.

---

## 19. Navigation

Use Expo Router.

Keep navigation predictable.

Do not create unnecessary nested navigation.

Android back behavior must be tested.

---

## 20. State Management

Do not introduce Redux or another large state-management library unless the application actually requires it.

For the current scope, prefer:

- React state
- React hooks
- Context only when necessary
- Service-layer storage

Keep state close to where it is used.

---

## 21. Component Rules

Components should have one clear responsibility.

Good:

```text
ApplicationCard
ApplicationForm
Stats
SearchForm
PortalCard
```

Avoid giant components containing:

- UI
- storage
- API requests
- validation
- statistics
- navigation

Separate responsibilities.

---

## 22. TypeScript Rules

Avoid:

```ts
any
```

unless there is a specific justified reason.

Prefer:

```ts
unknown
```

with proper validation when the data type is uncertain.

Define types for:

- Applications
- Statuses
- Search filters
- Job listings
- Portal configurations
- API responses

---

## 23. Security and Privacy

The application has no account system.

Therefore:

- Do not transmit application data to a server.
- Do not add analytics without explicit approval.
- Do not collect personal information unnecessarily.
- Do not log application notes or sensitive user data to the console.
- Keep application records local.

External websites only receive information when the user opens an external search/link.

---

## 24. Performance Rules

Avoid unnecessary re-renders.

For large application lists:

- Use `FlatList`
- Use stable keys
- Avoid expensive calculations inside render
- Memoize only where there is a measurable benefit

Do not prematurely optimize simple screens.

---

## 25. Accessibility

Use:

- Accessible labels
- Sufficient touch target sizes
- Meaningful button labels
- Proper text hierarchy
- Screen-reader-friendly controls

Do not rely only on icons to communicate important actions.

---

## 26. Testing Requirements

Before declaring a feature complete, test:

### Application CRUD

- Create
- Read
- Update
- Delete

### Status

- Saved
- Applied
- Interview
- Offer
- Rejected

### Persistence

1. Create application.
2. Close app.
3. Reopen app.
4. Verify application still exists.

### Dates

- Applied date
- Deadline
- Upcoming deadline
- Past deadline

### Search

- Empty search
- Normal search
- External portal opening
- Invalid/missing parameters

### Data

- Export
- Import
- Delete all

---

## 27. Development Workflow

Agents should implement work in small phases.

Recommended order:

```text
1. Project setup
2. UI conversion
3. Data model
4. Local storage
5. New application
6. Board
7. Edit/delete/status
8. Statistics
9. External portal search
10. Live APIs
11. Export/import
12. Android UX
13. Error handling
14. Testing
15. Production build
```

Do not jump directly to advanced features while core CRUD is incomplete.

---

## 28. Definition of Done

A feature is complete only when:

- [ ] TypeScript compiles
- [ ] UI matches the design direction
- [ ] Android layout works
- [ ] Required functionality works
- [ ] Loading/empty/error states are handled
- [ ] Local data persists where applicable
- [ ] No unnecessary dependency was added
- [ ] No browser-only APIs are used
- [ ] Existing features still work
- [ ] No obvious console errors remain

---

## 29. MVP Definition

The MVP must contain:

```text
Expo Android App
+
Design-based UI
+
Local AsyncStorage
+
Create Application
+
Edit Application
+
Delete Application
+
Change Status
+
Application Board
+
Statistics
+
External Job Portal Search
+
Job Links
+
Validation
```

Live job APIs, import/export, notifications, and advanced features should not block the first MVP.

---

## 30. Out of Scope

Do not implement these in the current version unless requirements change:

- Login
- Registration
- Backend
- Cloud database
- Account synchronization
- Multi-device sync
- Firebase authentication
- Social login
- Paid services
- Automatic application submission
- Job portal scraping
- Automatic email access
- Gmail integration
- LinkedIn account integration

---

## 31. Agent Behavior

When working on this project, agents should:

1. Read `AGENTS.md` before making changes.
2. Read `phases.md` to understand the development phase.
3. Inspect the existing project before creating files.
4. Reuse existing components when possible.
5. Follow the design reference instead of inventing a new visual style.
6. Keep changes focused on the requested phase.
7. Avoid unrelated refactoring.
8. Test affected functionality after changes.
9. Report important assumptions.
10. Never add backend/login/database functionality without explicit approval.

---

## 32. Priority Order

When requirements conflict, follow this priority:

```text
1. Explicit user requirements
2. AGENTS.md
3. phases.md
4. design.html for visual/UI decisions
5. Existing project architecture
6. General implementation preferences
```

---

## 33. Final Architecture

```text
                  JOB TRACKER
                       │
             ┌─────────┴─────────┐
             │                   │
          UI Layer          Service Layer
             │                   │
      React Native          ┌────┴────┐
      + Expo Router         │         │
                         Storage    Job Search
                            │         │
                       AsyncStorage  APIs
                            │         │
                            ↓         ↓
                       Local Device  Internet
                                      │
                                      ↓
                              External Job Portals
```

### Core rule

> The job tracker itself must remain fully functional without login, backend, database, or internet access.
