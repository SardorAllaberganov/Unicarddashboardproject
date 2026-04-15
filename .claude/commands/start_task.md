Before writing any code, gather full context on the task.

### Step 1: Read Project Context
1. Read `CLAUDE.md` for critical rules, design tokens, and conventions
2. Read `docs/readme.md` for project overview, routes, and structure
3. Check `.claude/commands/` for any relevant workflow commands

### Step 2: Identify Scope
1. Identify which files will be affected (pages, components, routes, sidebar, navbar)
2. Read each affected file to understand current state
3. Check `src/app/routes.tsx` for existing route structure
4. Check sidebar configs (`BankAdminSidebar.tsx` / `OrgAdminSidebar.tsx`) if adding navigation
5. Check `src/app/components/Navbar.tsx` ORG_PATHS if adding org pages

### Step 3: Review Patterns
1. Read a similar existing page/component for reference patterns
2. Verify design token usage: `C` colors, `F` fonts from `tokens.ts`
3. Confirm layout rules: sidebar + navbar + full-width content with `padding: 28px 32px`
4. Check shared components: `Navbar`, `DateRangePicker`, badge patterns

### Step 4: Propose Approach
Present a plan listing:
- **New files** to create (pages, components)
- **Modified files** (routes, sidebar, navbar)
- **Patterns** to follow (reference which existing page)
- **Data** structures needed (types, mock data)

```
Plan:
1. Create [component/page] — based on [reference file]
2. Add route in routes.tsx
3. Wire sidebar navigation
4. Update Navbar ORG_PATHS (if org page)
```

### Step 5: Wait for Approval
Do NOT write any code until the user approves the plan.

### Rules
- Always use `C` and `F` tokens, never hardcode colors/fonts
- Use `react-router` (NOT `react-router-dom`)
- Import shared `Navbar` component, never duplicate
- Main content: `width: 100%`, `padding: 28px 32px`, no maxWidth
- Pages in `/src/app/pages/`, components in `/src/app/components/`
- Breadcrumbs must be clickable with `navigate()`
- Do NOT modify `ImageWithFallback.tsx` or `pnpm-lock.yaml`
