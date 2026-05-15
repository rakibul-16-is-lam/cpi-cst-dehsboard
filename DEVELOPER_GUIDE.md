# CPI CST Dashboard - Developer Handover Guide

This document outlines the technical stack and integration plan for moving the current project to a **Django + React** architecture.

## 1. Current Architecture (Frontend focused)
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS + Bootstrap-like utility patterns.
- **Charts:** Recharts (D3-based).
- **Animation:** Framer Motion.
- **Current DB:** Firebase (Real-time).

## 2. Target Transition (Django + DRF)
To replace the current Node/Firebase logic with Django, follow these steps:

### Backend Structure (Django)
1. **API Models:** 
   - `Notice`: { text, type, createdAt }
   - `Leaderboard`: { name, batch, score, avatar }
   - `Placement`: { student, company, position, year }
   - `Statistic`: { total_students, active_students, alumni, placement_rate }

2. **Endpoints (Django REST Framework):**
   - `GET /api/notices/` - Fetch all notices.
   - `POST /api/notices/` - Create notice (Admin only).
   - `GET /api/stats/` - Fetch dashboard summary.
   - `POST /api/login/` - JWT-based authentication for the Admin Portal.

### Frontend Integration (React)
- Replace `onSnapshot` (Firebase) with `useEffect` + `axios.get()` or `React Query`.
- Update `login` function in `App.tsx` to call your Django login endpoint instead of `signInWithPopup`.

## 3. Necessary Skills for the Developer
| Domain | Priority | Skills |
|--------|----------|--------|
| **Frontend** | High | React, Tailwind CSS, Headless UI, Framer Motion |
| **Backend** | High | Python, Django, DRF, PostgreSQL |
| **DevOps** | Medium | Docker, Nginx, Gunicorn |

## 4. Maintenance Notes
- **Responsive Logic:** Built mobile-first using Tailwind prefixes (`sm:`, `md:`, `lg:`).
- **Admin Security:** Currently checks email `rakib.47g@gmail.com`. This should be replaced with Django's `is_staff` or `is_superuser` permission checks via JWT.

---
*Generated for: Rakib (CPI CST Dashboard v2)*
