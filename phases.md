# Job Tracker Android App — Development Phases

## Project Overview

Build an Android job application tracker using **Expo + React Native + TypeScript**.

### Constraints

- Android app
- Expo
- No login
- No backend
- No remote database
- Local device storage only
- `design.html` is the UI/UX reference only
- Preserve the visual language and main flows from `design.html`
- Do not copy HTML/CSS directly; rebuild the interface using React Native components

---

# Phase 0 — Project Setup

## Goal

Create a clean Expo project ready for Android development.

## Tasks

- [ ] Create Expo project
- [ ] Configure TypeScript
- [ ] Configure Expo Router
- [ ] Configure Android app metadata
- [ ] Install required dependencies only
- [ ] Set up development environment
- [ ] Run app on Android device/emulator
- [ ] Verify Expo project builds successfully

## Deliverable

A clean, running Expo Android application.

---

# Phase 1 — UI/UX Conversion

## Goal

Rebuild the UI from `design.html` as native React Native screens.

## Important Rule

`design.html` is used **only for design reference**.

Do not directly reuse:

- HTML
- CSS
- DOM JavaScript
- browser-specific components

Recreate the UI using React Native.

## Main UI Areas

- [x] Header
- [x] Application Log title
- [x] New Entry button
- [x] Statistics section
- [x] Search tab
- [x] Board tab
- [x] Search filters
- [x] Live listings section
- [x] Job portal section
- [x] Application board
- [x] Application cards
- [x] Empty states
- [x] Modal/form UI
- [x] Footer/settings actions

## Mobile Adaptation

The desktop board should be adapted for Android.

Possible implementation:

- [x] Horizontal Kanban scrolling
- [x] Or mobile status sections

Do not force the desktop layout onto small screens.

## Deliverable

A visually accurate static React Native version of the design.

---

# Phase 2 — Application Data Model

## Goal

Define the application's TypeScript data structures.

## Application Model

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

## Tasks

- [x] Create application types
- [x] Create status constants
- [x] Create status labels
- [x] Create validation rules
- [x] Create date utilities
- [x] Create statistics utilities

## Deliverable

A reusable TypeScript data model used throughout the app.

---

# Phase 3 — Local Storage

## Goal

Persist applications locally on the Android device.

## Storage

Use:

```text
AsyncStorage
```

No server or database.

## Required Operations

- [x] Save application
- [x] Get all applications
- [x] Update application
- [x] Delete application
- [x] Delete all applications
- [x] Save search preferences
- [x] Load search preferences

## Storage Architecture

```text
React Native UI
       ↓
Storage Service
       ↓
AsyncStorage
       ↓
Android Device
```

## Deliverable

Applications remain available after closing and reopening the app.

---

# Phase 4 — New Application

## Goal

Implement the `+ New Entry` functionality.

## Form Fields

### Required

- [x] Company
- [x] Role

### Optional

- [x] Job link
- [x] Status
- [x] Applied date
- [x] Follow-up/deadline
- [x] Notes

## Form Actions

- [x] Save
- [x] Cancel
- [x] Validation
- [x] Close modal/screen
- [x] Reset form

## Validation

- [x] Company cannot be empty
- [x] Role cannot be empty
- [x] Validate URL when supplied
- [x] Validate dates
- [x] Show useful validation messages

## Deliverable

User can create and save a job application locally.

---

# Phase 5 — Application Board

## Goal

Display applications according to their status.

## Columns/Sections

```text
Saved
Applied
Interview
Offer
Rejected
```

## Tasks

- [x] Render status sections
- [x] Show application count
- [x] Render application cards
- [x] Show company
- [x] Show role
- [x] Show applied date
- [x] Show deadline
- [x] Show job link
- [x] Show status
- [x] Show edit action
- [x] Show empty state

## Deliverable

A functional job-tracking board populated from local storage.

---

# Phase 6 — Edit, Delete & Status Changes

## Goal

Allow users to manage existing applications.

## Edit

- [x] Open existing application
- [x] Populate form
- [x] Modify fields
- [x] Save changes
- [x] Update local storage

## Status

- [x] Change status from application form
- [x] Change status directly from card
- [x] Refresh board after status change

## Delete

- [x] Delete individual application
- [x] Confirmation dialog
- [x] Delete all applications
- [x] Strong confirmation for delete-all

## Deliverable

Complete CRUD functionality.

---

# Phase 7 — Statistics

## Goal

Calculate dashboard statistics dynamically.

## Statistics

- [x] Total applications
- [x] Applied count
- [x] Interview count
- [x] Offer count
- [x] Next follow-up/deadline

## Rules

Statistics must be calculated from the current local application list.

No separate database or duplicated statistics storage.

## Deliverable

Dashboard statistics update automatically whenever applications change.

---

# Phase 8 — External Job Portal Search

## Goal

Allow users to search major job portals using the entered search criteria.

## Search Inputs

- [x] Role/keywords
- [x] Location
- [x] Job type
- [x] Work mode
- [x] Experience level

## Portal Links

Use the portal-search behavior represented in `design.html`.

Potential portals:

- [x] LinkedIn
- [x] Indeed
- [x] Naukri
- [x] Internshala
- [x] Glassdoor
- [x] ZipRecruiter
- [x] Monster
- [x] Wellfound
- [x] Google Jobs

## Android Flow

```text
Search criteria
      ↓
Generate portal URL
      ↓
Tap portal
      ↓
Open external browser
```

The app does not need to scrape portal websites.

## Deliverable

One-tap external job searches from the app.

---

# Phase 9 — Live Job Listings

## Goal

Optionally add live job listings from public job APIs.

This phase is intentionally separate from the core tracker.

## Tasks

- [x] Define API service
- [x] Create search request
- [x] Handle loading state
- [x] Handle empty results
- [x] Handle API errors
- [x] Display job cards
- [x] Open job posting
- [x] Save job to tracker

## Important

The core tracker must work without live job APIs.

## Deliverable

Users can discover jobs from supported public APIs and save them to the tracker.

---

# Phase 10 — Export & Import

## Goal

Protect user data because there is no cloud database.

## Export

- [x] Export applications as JSON
- [x] Create export file
- [x] Share/save file using Android sharing

## Import

- [x] Select JSON file
- [x] Validate imported data
- [x] Prevent malformed records
- [x] Import applications
- [x] Handle duplicate IDs safely
- [x] Refresh application board

## Deliverable

Users can back up and restore their job applications.

---

# Phase 11 — Android UX Optimization

## Goal

Make the application feel native on Android.

## Tasks

- [x] Safe area handling
- [x] Keyboard avoidance
- [x] Android back button behavior
- [x] Touch-friendly controls
- [x] Mobile date picker
- [x] Mobile status selector
- [x] Bottom sheets/modals where appropriate
- [x] Smooth scrolling
- [x] Loading indicators
- [x] Empty states
- [x] Error states
- [x] Accessibility labels
- [x] Long-text handling

## Deliverable

A polished Android user experience.

---

# Phase 12 — Error Handling

## Storage Errors

- [x] Handle save failures
- [x] Handle read failures
- [x] Handle corrupted local data

## Network Errors

- [x] Handle no internet
- [x] Handle API timeout
- [x] Handle API errors
- [x] Provide retry action

## Link Errors

- [x] Validate URLs
- [x] Handle unsupported links
- [x] Handle browser-opening failure

## Deliverable

The app fails gracefully instead of crashing.


---

# Phase 13 — Testing

## Functional Testing

- [x] Create application
- [x] Edit application
- [x] Delete application
- [x] Change status
- [x] Calculate statistics
- [x] Add deadline
- [x] Detect upcoming deadline
- [x] Open job link
- [x] Search external portals
- [x] Export data
- [x] Import data
- [x] Delete all data
- [x] Close and reopen app
- [x] Verify local data persists

## UI Testing

- [x] Small Android phone
- [x] Large Android phone
- [x] Portrait orientation
- [x] Keyboard open
- [x] Long company name
- [x] Long role name
- [x] Long notes
- [x] Many applications
- [x] Empty application list
- [x] Empty search results
- [x] Network unavailable

## Deliverable

Stable release candidate.


---

# Phase 14 — Production Build

## Goal

Create the Android release build.

## Tasks

- [x] Configure app name
- [x] Configure package/bundle identifier
- [x] Configure app icon
- [x] Configure splash screen
- [x] Configure version
- [x] Configure Android permissions
- [x] Create production APK
- [x] Create production AAB
- [x] Test production build

## Deliverable

Release-ready Android build.


---

# Recommended Development Order

```text
Phase 0
Project Setup
    ↓
Phase 1
UI Conversion
    ↓
Phase 2
Data Model
    ↓
Phase 3
Local Storage
    ↓
Phase 4
New Application
    ↓
Phase 5
Application Board
    ↓
Phase 6
Edit / Delete / Status
    ↓
Phase 7
Statistics
    ↓
Phase 8
External Job Portals
    ↓
Phase 9
Live Job Listings
    ↓
Phase 10
Export / Import
    ↓
Phase 11
Android UX
    ↓
Phase 12
Error Handling
    ↓
Phase 13
Testing
    ↓
Phase 14
Production Build
```

---

# MVP Scope

The first usable version should include only:

- [ ] Expo Android project
- [ ] UI based on `design.html`
- [ ] Local AsyncStorage
- [ ] Create application
- [ ] Edit application
- [ ] Delete application
- [ ] Change status
- [ ] Application board
- [ ] Statistics
- [ ] External job portal search
- [ ] Job links
- [ ] Basic validation

Do **not** block the MVP on live job APIs.

---

# Version Roadmap

## Version 1.0 — Core Tracker

```text
UI
+
Local Storage
+
CRUD
+
Board
+
Statistics
+
Portal Search
```

## Version 1.1 — Data Safety

```text
Export
+
Import
```

## Version 1.2 — Job Discovery

```text
Live Job APIs
+
Save Job
```

## Version 1.3 — UX Improvements

```text
Better mobile board
+
Animations
+
Notifications/reminders
+
Advanced filtering
```

## Version 2.0 — Optional Future Features

Potential future additions:

- Cloud sync
- Login
- Cross-device synchronization
- Push notifications
- Analytics
- Resume management

These are **out of scope for the current version**.

---

# Architecture Summary

```text
                    Expo Android App
                           │
              ┌────────────┴────────────┐
              │                         │
          UI Layer                 Service Layer
              │                         │
       React Native              ┌──────┴──────┐
       Components                │             │
              │              Storage       Job Search
              │                │               │
              │          AsyncStorage      External APIs
              │                │               │
              └────────────┬───┘               │
                           │                   │
                           ↓                   ↓
                     Local Device       External Browser/APIs
```

## Core Principle

**The job tracker must remain fully functional without login, backend, database, or internet access.**

Internet is only required for external job searches and optional live job listings.
