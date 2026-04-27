# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint (next lint)
```

Pre-commit hooks run automatically via husky + lint-staged: ESLint `--fix` on `.ts/.tsx` files, Prettier on `.md/.json`.

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXTAUTH_SECRET
NEXTAUTH_URL
NAVER_CLIENT_ID
NAVER_CLIENT_SECRET
NEXT_PUBLIC_GOOGLE_ANALYTICS   # optional
```

## Architecture

**NaviyNote** is a memo & todo management app with Naver OAuth login, built on Next.js 15 App Router.

### Directory Layout

- `src/app/(pages)/` — page routes: `landing`, `main`, `memo`, `todo`, `stats`, `friend`
- `src/app/api/` — API routes: `auth/[...nextauth]` (NextAuth), `naver/add-schedule`
- `src/store/` — Zustand stores: `memoStore.ts`, `todoStore.ts`
- `components/` — UI components grouped by feature: `Header/`, `Main/`, `Memo/`, `ToDo/`
- `lib/` — shared utilities: `supabase.ts` (Supabase client), `GoogleAnalytics.tsx`

### Data Flow Pattern

Server fetch functions (e.g., `components/Memo/memosServer.tsx`, `components/ToDo/todosServer.ts`) call Supabase directly. Client components fetch on mount via `useSession`, then populate Zustand stores (`useMemoStore`, `useTodoStore`). Subsequent CRUD operations update both Supabase and the
store optimistically.

### Modal Pattern

Memo and Todo detail pages use **Next.js parallel + intercepting routes**:

- `src/app/(pages)/memo/@memoModal/(.)memoItem/` — intercepts `/memo/memoItem/*` navigation to show a modal overlay without full page reload
- `src/app/(pages)/todo/@todoModal/(.)todoItem/` — same pattern for todos

### Memo Classification

Memos have two boolean flags (`active`, `important`) forming a 2×2 grid. Drag-and-drop between the four zones (via `react-dnd`) updates these flags. The `connect` flag marks a memo as linkable to a Todo.

### Memo–Todo 1:1 Link Invariant

Each memo can be linked to at most one todo (`memo.todo_id`) and each todo to at most one memo (`todo.memo_id`). When a new link is created, `addMemo`/`updateMemo` in `memosServer.tsx` automatically nullifies the previous memo's `todo_id` to preserve this invariant.

### Auth

`SessionWrapper` (`src/app/api/auth/[...nextauth]/SessionWrapper.tsx`) wraps children with `next-auth/react`'s `SessionProvider`. The root layout passes the server-side session to avoid a client-side flash.

### Styling

Tailwind CSS with custom colors: `navy` (#003366), `navy2` (#4169E1), `navy3` (#6495ED), `lightnavy` (#99CCFF), `red` (#FF6347). Breakpoint `sm` is set to `max: 1104px`. Font family is NanumGothic (Regular/Bold/ExtraBold) loaded via `next/font/local`.
