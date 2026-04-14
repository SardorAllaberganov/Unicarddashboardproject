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
import SellersManagementPage from './pages/SellersManagementPage';
import SellerDetailPage from './pages/SellerDetailPage';
import OrgDetailPage from './pages/OrgDetailPage';
import OrgCardsPage from './pages/OrgCardsPage';
import CardAssignmentPage from './pages/CardAssignmentPage';
import OrgFinancePage from './pages/OrgFinancePage';
import OrgWithdrawalsPage from './pages/OrgWithdrawalsPage';
import OrgSettingsPage from './pages/OrgSettingsPage';
import NewOrganizationPage from './pages/NewOrganizationPage';
import EditOrganizationPage from './pages/EditOrganizationPage';
import NewBatchWizardPage from './pages/NewBatchWizardPage';
import CardBatchDetailPage from './pages/CardBatchDetailPage';
import EditCardBatchPage from './pages/EditCardBatchPage';
import BulkCardAssignmentPage from './pages/BulkCardAssignmentPage';
import ReportPreviewPage from './pages/ReportPreviewPage';
import OverdueKpiReportPage from './pages/OverdueKpiReportPage';
import NotificationsHistoryPage from './pages/NotificationsHistoryPage';

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
    path: '/organizations/new',
    Component: NewOrganizationPage,
  },
  {
    path: '/organizations/:id',
    Component: OrgDetailPage,
  },
  {
    path: '/organizations/:id/edit',
    Component: EditOrganizationPage,
  },
  {
    path: '/card-batches',
    Component: CardBatchesPage,
  },
  {
    path: '/card-batches/new',
    Component: NewBatchWizardPage,
  },
  {
    path: '/card-batches/:id',
    Component: CardBatchDetailPage,
  },
  {
    path: '/card-batches/:id/edit',
    Component: EditCardBatchPage,
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
    path: '/reports/preview/:reportId',
    Component: ReportPreviewPage,
  },
  {
    path: '/reports/overdue-kpi',
    Component: OverdueKpiReportPage,
  },
  {
    path: '/notifications',
    Component: NotificationsHistoryPage,
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
  {
    path: '/sellers',
    Component: SellersManagementPage,
  },
  {
    path: '/sellers/:id',
    Component: SellerDetailPage,
  },
  {
    path: '/org-cards',
    Component: OrgCardsPage,
  },
  {
    path: '/card-assignment',
    Component: CardAssignmentPage,
  },
  {
    path: '/card-assignment/bulk',
    Component: BulkCardAssignmentPage,
  },
  {
    path: '/org-rewards',
    Component: OrgFinancePage,
  },
  {
    path: '/org-withdrawals',
    Component: OrgWithdrawalsPage,
  },
  {
    path: '/org-settings',
    Component: OrgSettingsPage,
  },
]);