import { createBrowserRouter } from 'react-router';
import LoginPage from './pages/LoginPage';
import DesignSystemPage from './pages/DesignSystemPage';
import SidebarShowcasePage from './pages/SidebarShowcasePage';
import OrgSidebarShowcasePage from './pages/OrgSidebarShowcasePage';
import BankAdminDashboardPage from './pages/BankAdminDashboardPage';
import OrganizationsPage from './pages/OrganizationsPage';
import CardBatchesPage from './pages/CardBatchesPage';
import KPIConfigurationPage from './pages/KPIConfigurationPage';
import CardImportPage from './pages/CardImportPage';
import AllCardsPage from './pages/AllCardsPage';
import CardDetailPage from './pages/CardDetailPage';
import RewardsFinancePage from './pages/RewardsFinancePage';
import ReportsExportPage from './pages/ReportsExportPage';
import OrgAdminDashboardPage from './pages/OrgAdminDashboardPage';
import UsersManagementPage from './pages/UsersManagementPage';
import SettingsPage from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/design-system',
    Component: DesignSystemPage,
  },
  {
    path: '/sidebar',
    Component: SidebarShowcasePage,
  },
  {
    path: '/sidebar-org',
    Component: OrgSidebarShowcasePage,
  },
  {
    path: '/dashboard',
    Component: BankAdminDashboardPage,
  },
  {
    path: '/organizations',
    Component: OrganizationsPage,
  },
  {
    path: '/card-batches',
    Component: CardBatchesPage,
  },
  {
    path: '/kpi-config',
    Component: KPIConfigurationPage,
  },
  {
    path: '/card-import',
    Component: CardImportPage,
  },
  {
    path: '/all-cards',
    Component: AllCardsPage,
  },
  {
    path: '/card-detail/:id',
    Component: CardDetailPage,
  },
  {
    path: '/rewards',
    Component: RewardsFinancePage,
  },
  {
    path: '/reports',
    Component: ReportsExportPage,
  },
  {
    path: '/org-dashboard',
    Component: OrgAdminDashboardPage,
  },
  {
    path: '/users',
    Component: UsersManagementPage,
  },
  {
    path: '/settings',
    Component: SettingsPage,
  },
]);