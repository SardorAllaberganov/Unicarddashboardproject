# Moment Card KPI Platform

> Fintech platform for managing VISA card sales through partner organizations, tracking 3-stage seller KPI fulfillment, and automating payouts via UCOIN wallets.

## Overview

- **Resolution**: 1920x1080 (desktop-first)
- **Stack**: React 18 + TypeScript + Tailwind CSS v4 + Vite
- **Routing**: React Router v7 (Data mode with `createBrowserRouter`)
- **UI Library**: Shadcn/ui-inspired custom design system
- **Charts**: Recharts
- **Animations**: Motion (Framer Motion successor)
- **Drag & Drop**: react-dnd

## Roles

| Role | Entry Point | Sidebar |
|------|-------------|---------|
| **Bank Admin** | `/dashboard` | `BankAdminSidebar` |
| **Organization Admin** | `/org-dashboard` | `OrgAdminSidebar` |

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | LoginPage | Authentication entry |
| `/dashboard` | BankAdminDashboardPage | Bank admin main dashboard |
| `/organizations` | OrganizationsPage | Org list + detail drawer |
| `/card-batches` | CardBatchesPage | Card batch management |
| `/kpi-config` | KPIConfigurationPage | 4-step KPI configuration stepper |
| `/card-import` | CardImportPage | Drag-and-drop card import with validation |
| `/all-cards` | AllCardsPage | Full card registry with filters & table |
| `/card-detail/:id` | CardDetailPage | Card detail with KPI Stepper Variant B + financial summary |
| `/rewards` | RewardsFinancePage | Donut chart + transaction log |
| `/reports` | ReportsExportPage | 6 export types |
| `/users` | UsersManagementPage | User management + add modal |
| `/settings` | SettingsPage | 6 vertical tabs |
| `/org-dashboard` | OrgAdminDashboardPage | Org admin dashboard with seller rankings |
| `/design-system` | DesignSystemPage | DS showcase |
| `/sidebar` | SidebarShowcasePage | Bank sidebar demo |
| `/sidebar-org` | OrgSidebarShowcasePage | Org sidebar demo |

## Design System

### Fonts

| Token | Font | Usage |
|-------|------|-------|
| `F.inter` | Inter 300-700 | Primary UI text |
| `F.dm` | DM Sans 400-700 | Headings, display |
| `F.mono` | JetBrains Mono 400-600 | Code, IDs, amounts |

### Color Tokens (`tokens.ts`)

| Category | Tokens |
|----------|--------|
| **Backgrounds** | `pageBg` (#F9FAFB), `surface` (#FFFFFF), `border` (#E5E7EB), `inputBorder` (#D1D5DB) |
| **Text** | `text1` (#111827), `text2` (#374151), `text3` (#6B7280), `text4` (#9CA3AF) |
| **Brand** | `blue` (#2563EB), `blueHover` (#1D4ED8), `blueLt` (#EFF6FF), `blueTint` (#DBEAFE) |
| **Semantic** | `success` (#10B981), `warning` (#D97706), `error` (#EF4444), `info` (#0891B2) |

### Design System Components (22 in `/src/app/components/ds/`)

| File | Content |
|------|---------|
| Row1_ColorTypo | Color palette + typography scale |
| Row2_SidebarBtnBadge | Sidebar items, buttons, badges |
| Row3_StatCards | Stat/metric cards |
| Row4_Table | Table components |
| Row5_KPIStepper | KPI step tracker |
| Row6_Charts | Chart components |
| Row7_Forms | Form elements |
| Row8_DrawerModalToast | Overlays and notifications |
| Row9_Misc | Miscellaneous components |
| Row10_DateDark | Date picker + dark theme |

### Shadcn/ui Components (40+ in `/src/app/components/ui/`)

Full set including: accordion, alert-dialog, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle-group, toggle, tooltip.

## Layout Rules

- **Sidebar**: Expanded = 260px, Collapsed = 68px
- **Main content**: Always `width: 100%`, `padding: 28px 32px`, **no maxWidth**
- **Style**: Light, clean, minimalistic. No gradients. Flat surfaces with 1px borders.
- **Dark theme**: Supported via CSS custom properties and `.dark` class

## Key Features

### Bank Admin
- **Dashboard**: KPI overview stats, charts, activity feed
- **Organizations**: List view + slide-out detail drawer
- **Card Batches**: Batch creation and tracking
- **KPI Configuration**: 4-step wizard stepper
- **Card Import**: Drag-and-drop file upload with CSV/XLSX validation
- **Card Registry**: Full filterable/sortable table
- **Card Detail**: KPI Stepper Variant B, financial summary
- **Rewards**: Donut chart breakdown, transaction history log
- **Reports**: 6 export types (PDF, CSV, XLSX, etc.)
- **Users**: User list, role management, add-user modal
- **Settings**: Profile, Security, Notifications, Default KPI, Integrations, System

### Organization Admin
- **Dashboard**: Seller rankings, KPI conversion metrics, activity timeline

## Dependencies

### Production
- **UI**: @radix-ui/* (full suite), class-variance-authority, clsx, tailwind-merge, cmdk
- **Charts**: recharts
- **Animation**: motion
- **Forms**: react-hook-form
- **Routing**: react-router
- **Date**: date-fns, react-day-picker
- **DnD**: react-dnd, react-dnd-html5-backend
- **Notifications**: sonner
- **Carousel**: react-slick, embla-carousel-react
- **Other**: canvas-confetti, input-otp, vaul, next-themes

### Dev
- tailwindcss v4.1, @tailwindcss/vite, vite 6.3, @vitejs/plugin-react

## Project Structure

```
/src
  /app
    App.tsx                    # Entry point with RouterProvider
    routes.tsx                 # All route definitions
    /components
      BankAdminSidebar.tsx     # Bank admin navigation
      OrgAdminSidebar.tsx      # Org admin navigation
      OrgDetailDrawer.tsx      # Organization detail drawer
      /ds/                     # Design system showcase (10 row components + tokens)
      /ui/                     # Shadcn/ui primitives (40+ components)
      /figma/                  # Figma integration helpers
    /pages
      LoginPage.tsx
      BankAdminDashboardPage.tsx
      OrganizationsPage.tsx
      CardBatchesPage.tsx
      KPIConfigurationPage.tsx
      CardImportPage.tsx
      AllCardsPage.tsx
      CardDetailPage.tsx
      RewardsFinancePage.tsx
      ReportsExportPage.tsx
      OrgAdminDashboardPage.tsx
      UsersManagementPage.tsx
      SettingsPage.tsx
      DesignSystemPage.tsx
      SidebarShowcasePage.tsx
      OrgSidebarShowcasePage.tsx
  /styles
    fonts.css                  # Google Fonts import
    theme.css                  # CSS custom properties + dark theme
    index.css                  # Global styles
    tailwind.css               # Tailwind entry
```
