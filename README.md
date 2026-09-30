# Bitly Clone Frontend

A modern, fast, and feature-rich URL Shortener and Analytics web client built with React 19, TypeScript, Vite, Tailwind CSS v4, and Recharts.

---

## Tech Stack

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query_v5-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand_5-443E38?style=flat-square&logo=react&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts_3-22B5BF?style=flat-square&logo=d3.js&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)

---

## Key Features

- **Intuitive Link Shortening & Management**: Quick URL shortening with custom aliases, tags, expiration dates, QR code generation, and one-click copy.
- **Server-Side Search & Filtering**: Instant URL searching, active/expired status filtering, and multi-criteria sorting powered by backend pagination.
- **Interactive Traffic Analytics**: Visualized traffic metrics with timeline Area charts, Dynamic Center Donut charts for devices, and horizontal breakdown bars for browsers and OS.
- **Comprehensive KPI Dashboard**: Aggregated summary metrics, 7-day click volume trends, recent URLs, and top-performing links leaderboard.
- **Modern Public Landing Page**: High-converting marketing hero section featuring an interactive instant link shortening preview demo.
- **Account & Security Settings**: User profile customization, unified monogram avatars, collapsible password update flow, and session controls.
- **Resilient Network Handling**: Silent JWT refresh token rotation with request queueing and global toast notifications for rate limit (HTTP 429) warnings.

---

## Project Structure

```text
src/
├── api/             # Global API endpoints & service definitions
├── assets/          # Static assets, brand logos & illustrations
├── components/
│   ├── common/      # ProtectedRoute, NotFoundPage, ForbiddenPage
│   ├── layout/      # AppLayout, Sidebar, Header, UserMenu
│   └── ui/          # Reusable UI primitives (Button, Input, Select, Dialog, etc.)
├── features/
│   ├── analytics/   # AnalyticsPage, charts (DeviceDonut, BrowserBar, OsBar, ClicksOverTime)
│   ├── auth/        # LoginPage, RegisterPage, auth hooks & store
│   ├── dashboard/   # DashboardPage, KPI stats cards, quick shorten widget
│   ├── landing/     # LandingPage (public hero & marketing sections)
│   ├── links/       # LinksPage, LinkTable, Create/Edit modals, QR generator
│   └── profile/     # SettingsPage, profile hooks, schemas & types
├── hooks/           # Custom React utility hooks
├── lib/             # Axios client instance, date formatting, cn utility
├── routes/          # AppRoutes definition
└── stores/          # Zustand client auth store
```

---

## Getting Started

### Prerequisites

Ensure you have installed:
- **Node.js**: v20 or higher
- **npm** (or **pnpm**)

### 1. Clone the repository

```bash
git clone https://github.com/hieu79115/bitly-clone-fe.git
cd bitly-clone-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL pointing to the Spring Boot REST API | `http://localhost:8080` |

### 4. Run the Development Server

```bash
npm run dev
```

The application will be running locally at:
[http://localhost:5173](http://localhost:5173)

---

## Building for Production

### Type Check & Build

```bash
npm run build
```

This compiles TypeScript using `tsc -b` and builds optimized static assets into the `dist/` directory via Vite.

### Preview Production Build Locally

```bash
npm run preview
```

### Linting

```bash
npm run lint
```
