# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build (output in `dist/`)
- `npm run lint` — ESLint (flat config, JS/JSX only)
- `npm run preview` — Preview production build

There is no test runner configured.

## Architecture

React 19 SPA using Vite 7, Tailwind CSS 4 (via `@tailwindcss/vite`; theme tokens live in the `@theme` block of `src/index.css`), and React Router 7. No TypeScript — plain JSX throughout.

### State Management

Two context directories with different roles (note the similar names):

- **`src/context/`** — Core contexts: `AuthContext` (login/register against dummy + registered users, localStorage persistence, `isEmployer`/`isJobSeeker`/`isAdmin` flags), `JobContext` (applications, saved jobs, employer job CRUD), `ThemeContext` (toggles `light`/`dark` class on `<html>`, persisted as `job-portal-theme`)
- **`src/contexts/`** — Data-fetching contexts with a 5-minute cache (`CACHE_DURATION`): `JobsDataContext` (job list), `CompaniesContext`

Provider nesting order (in `App.jsx`): AuthProvider → JobsDataProvider → JobProvider → CompaniesProvider → ThemeProvider → Router. Contexts lower in the tree can depend on those above (e.g. `JobContext` uses auth + jobs data).

### Data Layer

No real backend. Everything is **mock data** persisted in localStorage:

- `src/data/mockData.js` generates ~1000 jobs and derived companies/salary data at module load (`generateJobs`, `generateCompanies`, `generateSalaryData`).
- `src/services/` simulate async API calls by awaiting `delay()` from `src/utils/delay.js`. Services derive per-user keys from the current user stored in localStorage (e.g. `jobApplicationService`, `profileService` use a `getStorageKey()` helper).
- Some pages (e.g. `MyJobs.jsx`) read/write localStorage directly rather than going through a service.

Key localStorage keys: `jobPortalUser`, `authToken` (fake `mock-jwt-*`), `registeredUsers`, `globalPostedJobs`, `globalApplications`, `companiesOverrides`, `deletedCompanyIds`, `contactMessages`, `job-portal-theme`, and per-user `jobApplications_{userId}`, `savedJobs_{userId}`, `postedJobs_{userId}`, `userProfile_{userId}`. Clearing localStorage resets the app to seed data.

User IDs appear as both `user.userId` and `user.id` in different places — code often uses `user.userId || user.id`.

### Routing & Roles

All routes are nested under `Layout` in `App.jsx`. Role protection is done by wrapping elements in `<ProtectedRoute allowedRoles={[...]}>` — unauthenticated users go to `/login`, wrong role redirects to `/`.

- **ROLE_JOB_SEEKER** — `profile`, `applied-jobs`, `saved-jobs`
- **ROLE_EMPLOYER** — `post-job`, `employer/jobs`, `job-applicants/:jobId`
- **ROLE_ADMIN** — `admin`, `admin/companies`, `admin/employers`, `admin/contact-messages` (pages in `src/pages/admin/`)

Job seekers get a `profileComplete` flag computed at login from `profileService`; employers/admins are always complete.

### Test Accounts

Hardcoded in `DUMMY_USERS` in `src/context/AuthContext.jsx`:

- Employer: `employer@company.com` / `employer123`, `hr@startup.com` / `hr123`
- Job seeker: `jobseeker@email.com` / `jobseeker123`, `candidate@email.com` / `candidate123`
- Admin: `admin@portal.com` / `admin123`

Newly registered users are stored in `registeredUsers` and registered as job seekers.

### Key Libraries

- Font Awesome + Lucide React for icons
- react-toastify for notifications

### ESLint

Flat config (`eslint.config.js`) with react-hooks and react-refresh rules. The `no-unused-vars` rule ignores variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`).
