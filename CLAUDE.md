@AGENTS.md

# Blog Project Instructions

## Context

Personal technical blog and portfolio built with Next.js.

Current version:

* Next.js (App Router)
* React 19
* TypeScript
* Tailwind CSS
* Shadcn UI
* Supabase
* PostgreSQL

Future version:

* Next.js Frontend
* ASP.NET Core Backend API

Architecture decisions must keep the frontend ready for future migration to .NET APIs.

---

## Development Rules

### TypeScript

Always use strict typing.

Never use:

* any
* as any
* unknown as any

Create explicit types for every entity.

---

### Components

Prefer Server Components.

Use Client Components only when necessary:

* useState
* useEffect
* Event handlers
* Browser APIs

---

### Validation

Always use:

* Zod
* React Hook Form

Never trust user input.

---

### Architecture

Follow feature-based architecture.

Example:

```txt
src/
├── app/
├── components/
├── features/
├── lib/
├── types/
└── constants/
```

Each feature should contain:

```txt
actions/
components/
repositories/
schemas/
types/
utils/
```

---

### Data Access

Use Repository Pattern.

Flow:

```txt
Page
↓
Action
↓
Repository
↓
Database
```

Avoid direct database access inside components.

---

### Code Quality

Always:

* Reusable components
* Explicit typing
* Small functions
* Clean code
* ESLint compliant
* Responsive design

Never:

* Duplicate code
* Hardcoded values
* Business rules inside UI components
* Large components with multiple responsibilities

---

### UI Guidelines

Inspired by:

* Vercel
* Linear
* Stripe

Characteristics:

* Minimalist
* Professional
* Fast
* Accessible
* Mobile-first

---

### Performance

Prefer:

* Server Components
* Streaming
* Suspense
* Lazy loading

Avoid unnecessary client-side rendering.

---

### Project Goal

Build a modern, scalable and professional technical blog that serves as both a content platform and a software engineering portfolio.
