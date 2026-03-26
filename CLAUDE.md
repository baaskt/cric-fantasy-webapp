# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Check Prettier formatting
npm run format:fix   # Auto-fix formatting
```

Pre-commit hooks (Husky + lint-staged) automatically run ESLint --fix and Prettier --write on staged `.ts/.tsx/.scss/.html` files.

## Architecture

**Next.js 14 Cricket Fantasy Auction Web App** — TypeScript, MUI v5, Tailwind CSS.

### Path Alias
`@/*` maps to `./src/app/*`

### Route Structure
All pages live under `src/app/(pages)/`:
- `(auth)/` — login, signup, forgotPwd (public)
- `tournaments/[tournamentId]/` — main app (protected)
  - `auction/`, `dashboard/`, `matches/`, `players/`, `teams/`, `analytics/`, `ruleBuilder/`

Middleware at `src/middleware.ts` handles auth-based redirects.

### Key Directories
- `src/app/components/` — UI components; custom design system in `ui/` (17 `Cric*` components like `CricButton`, `CricTable`, `CricModal`)
- `src/app/providers/` — React Context providers: `AppProvider` (theme+auth), `AuthProvider`, `AuctionProvider`, `TournamentProvider`, `TeamProvider`, `MatchProvider`
- `src/app/model/` — TypeScript interfaces split into `entities/`, `context/`, `request/`, `response/`, `enum/`, `types/`
- `src/app/util/` — Constants (routes, API endpoints, labels), helpers, validation, bidding logic, color palette
- `src/app/lib/` — `apiHelper.ts` (Axios wrapper), `auth.ts` (token management), `NetworkInterceptor.ts` (401 refresh), `cookieHelper.ts`
- `src/app/hooks/` — Custom hooks: `useRequest` (SWR-based), `useMutateRequest` (Axios mutations)

### Data Fetching
- **SWR** via `useRequest` hook for reads (with caching)
- **Axios** via `useMutateRequest` hook for writes
- Backend base URL: `https://cric-fantasy-backend-test.onrender.com/api/` (120s timeout)

### Authentication
Cookie-based JWT: `accessToken` + `refreshToken` cookies. The Axios `NetworkInterceptor` auto-refreshes on 401 and retries the failed request. Admin role check: `user.roles.includes('admin')`.

### Rule Builder
Admin-only feature (`/ruleBuilder`). Files are `.jsx`/`.js` (not `.tsx`/`.ts`) — this is intentional for this section. Located in `src/app/components/ruleBuilder/` with utils in `ruleBuilderUtils.js` and `ruleBuilderConstants.js`.

### Styling Conventions
- MUI components + Emotion for component-level styles
- Tailwind for utility classes
- Global theme in `src/app/styles/themes/global`
- Color palette in `src/app/util/colors.ts`
- Prettier config: 100-char width, single quotes, no semicolons, 2-space tabs
