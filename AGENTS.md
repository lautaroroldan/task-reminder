# Agent Guidelines for task-reminder

This document provides essential information for AI coding agents working on this codebase.

## Project Overview

Next.js 15 task reminder application with Firebase Cloud Messaging notifications and PostgreSQL database. Built with TypeScript, Tailwind CSS v4, and Drizzle ORM.

## Build & Development Commands

### Development
```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit migrate   # Run migrations
npx drizzle-kit studio    # Open Drizzle Studio
```

### Running Tests
**No test framework is configured.** If tests are added, follow these patterns:
- Test files: `*.test.ts` or `*.test.tsx`
- Location: `__tests__/` directory or colocated with source
- Single test: Would be `npm test -- <filename>` (once configured)

## Technology Stack

- **Framework**: Next.js 15.3.8 (App Router with RSC)
- **Language**: TypeScript 5.x (strict mode)
- **Database**: PostgreSQL with Drizzle ORM 0.43.1
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York style)
- **Backend**: Firebase Admin 13.4.0 (FCM notifications)
- **Package Manager**: pnpm (primary)

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled** - All strict checks must pass
- **Target**: ES2017
- **Module resolution**: bundler
- **Path alias**: `@/*` maps to project root

### Import Organization

Order imports as follows:
```typescript
// 1. React and external libraries
import type React from "react"
import { useState } from "react"

// 2. Internal imports with @ alias
import { Button } from "@/components/ui/button"
import { saveTask } from "@/app/actions/tasks"
import type { Task } from "@/lib/types"

// 3. Relative imports
import { helper } from "./utils"
```

**Import style:**
- Use `import type` for type-only imports
- Prefer named imports over default when possible
- Use `@/*` alias for all project imports (never relative `../..`)
- Keep imports grouped and sorted logically

### Formatting

- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Double quotes for strings
- **Semicolons**: No semicolons at end of statements
- **Line length**: No strict limit, but keep readable
- **Trailing commas**: Use in multiline objects/arrays

### Naming Conventions

- **Components**: PascalCase (`TaskForm.tsx`, `TaskList.tsx`)
- **Files**: kebab-case for non-components (`task-utils.ts`)
- **Functions**: camelCase (`saveTask`, `getTasks`)
- **Types/Interfaces**: PascalCase (`Task`, `TaskFormProps`)
- **Constants**: camelCase or UPPER_CASE for true constants
- **Database tables**: camelCase with `Table` suffix (`tasksTable`)

### Component Patterns

**Client Components:**
```typescript
"use client"

import type React from "react"
import { useState } from "react"

interface ComponentProps {
  onAddTask: (task: Task) => void
  token: string
}

export default function Component({ onAddTask, token }: ComponentProps) {
  // Implementation
}
```

**Server Actions:**
```typescript
"use server"

import { createTask } from "@/db/queries/insert"
import type { Task } from "@/lib/types"

export async function saveTask(task: Task) {
  try {
    // Implementation
    return { success: true }
  } catch (error) {
    console.error("Error message:", error)
    return { success: false, error: "User-friendly message" }
  }
}
```

**API Routes:**
```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Implementation
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error message:', error)
    return NextResponse.json({ error: 'Error message' }, { status: 500 })
  }
}
```

### Type Safety

- **Always** define explicit types for function parameters
- **Always** define return types for exported functions
- Use `type` for object types, `interface` for component props
- Leverage Drizzle's `$inferInsert` and `$inferSelect` for DB types
- Avoid `any` - use `unknown` if type is truly unknown

```typescript
// Database types (db/schema.ts)
export type InsertTask = typeof tasksTable.$inferInsert
export type SelectTask = typeof tasksTable.$inferSelect

// Application types (lib/types.ts)
export type Task = {
  id: string
  title: string
  // ...
}
```

### Error Handling

**Server-side (Actions/API):**
```typescript
try {
  // Operation
  return { success: true }
} catch (error) {
  console.error("Descriptive error:", error)
  return { success: false, error: "User-friendly message" }
}
```

**Client-side:**
```typescript
const [error, setError] = useState("")

try {
  const result = await serverAction()
  if (!result.success) {
    setError(result.error || "Default error message")
    return
  }
} catch (error) {
  setError("User-friendly error message")
  console.error("Error details:", error)
}
```

### Database Queries

- Organize queries by operation: `insert.ts`, `select.ts`, `update.ts`, `delete.ts`
- One function per file for simple operations
- Use Drizzle's type inference for safety

```typescript
// db/queries/insert.ts
import { db } from '../index'
import { InsertTask, tasksTable } from '../schema'

export async function createTask(data: InsertTask) {
  await db.insert(tasksTable).values(data)
}
```

### Styling with Tailwind

- Use Tailwind utility classes directly in JSX
- Use `cn()` helper from `@/lib/utils` for conditional classes
- Follow shadcn/ui patterns for component variants (CVA)
- Prefer semantic color names from CSS variables

```typescript
import { cn } from "@/lib/utils"

<Button 
  className={cn(
    "w-full bg-violet-600 hover:bg-violet-700",
    isSubmitting && "opacity-50"
  )}
/>
```

### File Organization

```
app/
  actions/          # Server Actions only
  api/              # API Routes (REST endpoints)
  page.tsx          # Route pages

components/
  ui/               # shadcn/ui primitives
  feature-*.tsx     # Feature-specific components

db/
  queries/          # Organized by CRUD operation
  schema.ts         # Single source of truth for DB schema
  index.ts          # DB client initialization

lib/
  types.ts          # Shared TypeScript types
  utils.ts          # Utility functions
  *-utils.ts        # Domain-specific utilities
```

## Common Patterns

### Adding a new task feature:
1. Update `db/schema.ts` with new columns
2. Run `npx drizzle-kit generate` and `npx drizzle-kit migrate`
3. Update types in `lib/types.ts`
4. Add query functions in `db/queries/`
5. Create/update Server Action in `app/actions/`
6. Update UI components as needed

### Creating a new component:
1. Determine if it's client or server component
2. Add `"use client"` directive if needed
3. Define props interface with TypeScript
4. Export as default (or named for ui/ components)
5. Use `cn()` for conditional styling

## Notes for Agents

- **Comments**: Code is in English, but user-facing strings are in Spanish
- **Validation**: Always validate user input on both client and server
- **Firebase**: FCM tokens required for notifications, handled in client
- **Dates**: Task dates stored as `startDay`/`endDay` (1-31) in app, full timestamps in DB
- **TODO**: Completions tracking not yet implemented (see schema comment)
- **No tests**: Testing infrastructure needs to be set up if required
- **No Prettier**: Follow existing formatting patterns consistently
