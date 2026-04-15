# Claude Context: Moment Card KPI Platform

> This file provides AI assistants with full context for continuing development on this project.

## Critical Rules

1. **Main content area**: Always `width: 100%`, `padding: 28px 32px`, **never set maxWidth**
2. **Entry point**: `/src/app/App.tsx` must have a default export using `RouterProvider`
3. **Routing**: Use `react-router` (NOT `react-router-dom`). Use `createBrowserRouter` in `/src/app/routes.tsx`
4. **Tailwind v4**: No `tailwind.config.js`. Theme tokens are in `/src/styles/theme.css` using `@theme inline`
5. **Protected files**: Do NOT modify `/src/app/components/figma/ImageWithFallback.tsx` or `/pnpm-lock.yaml`
6. **Font imports**: Only in `/src/styles/fonts.css`
7. **No font-size/font-weight/line-height Tailwind classes** unless explicitly requested (defaults in theme.css)
8. **Components**: Place in `/src/app/components/`. Pages in `/src/app/pages/`
9. **Images**: Use `ImageWithFallback` component or `unsplash_tool`. Never hardcode image URLs
10. **Packages**: Always check `package.json` before installing. Use `install_package` tool

## Design Philosophy

- **Shadcn/ui-inspired**: Light, clean, minimalistic
- **No gradients**: Flat surfaces with 1px borders
- **Dark theme support**: Via `.dark` class and CSS custom properties
- **Desktop-first**: 1920x1080 target resolution
- **Responsive**: Should work on smaller screens but optimized for desktop

## Design Tokens

### Fonts (from `tokens.ts`)
```ts
F.inter  = "'Inter', sans-serif"       // Primary UI
F.dm     = "'DM Sans', sans-serif"     // Headings
F.mono   = "'JetBrains Mono', monospace" // Code, IDs, monetary values
```

### Colors (from `tokens.ts`)
```ts
// Backgrounds
C.pageBg = '#F9FAFB'    C.surface = '#FFFFFF'
C.border = '#E5E7EB'    C.inputBorder = '#D1D5DB'

// Text hierarchy
C.text1 = '#111827'  C.text2 = '#374151'  C.text3 = '#6B7280'  C.text4 = '#9CA3AF'

// Brand blue
C.blue = '#2563EB'  C.blueHover = '#1D4ED8'  C.blueLt = '#EFF6FF'  C.blueTint = '#DBEAFE'

// Semantic
C.success = '#10B981'  C.warning = '#D97706'  C.error = '#EF4444'  C.info = '#0891B2'
// Each has a corresponding Bg variant: successBg, warningBg, errorBg, infoBg
```

### CSS Custom Properties (theme.css)
Light and dark theme variables for: background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1..5, sidebar-*, radius.

## Sidebar Configuration

| Property | Expanded | Collapsed |
|----------|----------|-----------|
| Width | 260px | 68px |
| Components | `BankAdminSidebar`, `OrgAdminSidebar` |
| Behavior | Routing-aware, highlights active menu item |

## Existing Pages & Features

### Authentication
- **LoginPage** (`/`): Entry point, role-based login

### Bank Admin Pages
- **Dashboard** (`/dashboard`): KPI stats, charts, activity
- **Organizations** (`/organizations`): List + detail drawer (`OrgDetailDrawer`)
- **Card Batches** (`/card-batches`): Batch management
- **KPI Configuration** (`/kpi-config`): 4-step stepper wizard
- **Card Import** (`/card-import`): Drag-and-drop, CSV/XLSX validation
- **All Cards** (`/all-cards`): Filterable table registry
- **Card Detail** (`/card-detail/:id`): KPI Stepper Variant B + financial summary
- **Rewards** (`/rewards`): Donut chart + transaction log
- **Reports** (`/reports`): 6 export types
- **Users** (`/users`): Management + add-user modal
- **Settings** (`/settings`): 6 tabs (Profile, Security, Notifications, Default KPI, Integrations, System)

### Organization Admin Pages
- **Org Dashboard** (`/org-dashboard`): Seller rankings, KPI conversion, activity timeline

### Showcase Pages
- **Design System** (`/design-system`): Full DS component showcase
- **Sidebar** (`/sidebar`): Bank admin sidebar demo
- **Sidebar Org** (`/sidebar-org`): Org admin sidebar demo

## Component Architecture

### Design System (`/src/app/components/ds/`)
10 showcase row components + `tokens.ts`:
- Row1: Colors & Typography
- Row2: Sidebar Items, Buttons, Badges
- Row3: Stat/Metric Cards
- Row4: Tables
- Row5: KPI Stepper
- Row6: Charts
- Row7: Forms
- Row8: Drawer, Modal, Toast
- Row9: Miscellaneous
- Row10: Date Picker, Dark Theme

### UI Primitives (`/src/app/components/ui/`)
40+ Shadcn/ui components. All Radix-based. Import as needed.

## Tech Stack Quick Reference

| Category | Package | Version |
|----------|---------|---------|
| Framework | React | 18.3.1 |
| Build | Vite | 6.3.5 |
| CSS | Tailwind CSS | 4.1.12 |
| Routing | react-router | 7.13.0 |
| Charts | recharts | 2.15.2 |
| Animation | motion | 12.23.24 |
| Forms | react-hook-form | 7.55.0 |
| Icons | lucide-react | 0.487.0 |
| Dates | date-fns | 3.6.0 |
| DnD | react-dnd | 16.0.1 |
| Toasts | sonner | 2.0.3 |
| UI Primitives | @radix-ui/* | Various |

## When Adding New Pages

1. Create page component in `/src/app/pages/NewPage.tsx`
2. Add route in `/src/app/routes.tsx`
3. Add sidebar entry in the appropriate sidebar component
4. Use layout pattern: sidebar (260/68px) + main area (width: 100%, padding: 28px 32px)
5. Import design tokens from `../components/ds/tokens`
6. Use existing UI primitives from `../components/ui/`

## When Adding New Components

1. Create in `/src/app/components/ComponentName.tsx`
2. Follow existing patterns: use `C` and `F` tokens for colors/fonts
3. Use Radix primitives where applicable
4. Ensure dark theme compatibility

## Business Domain

- **VISA cards**: Sold through partner organizations
- **KPI system**: 3 stages of seller performance tracking
- **UCOIN wallets**: Automated payout system for rewards
- **Two admin roles**: Bank-level oversight vs Organization-level management
