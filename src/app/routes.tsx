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
import EmptyStatesShowcasePage from './pages/EmptyStatesShowcasePage';
import FirstUseEmptyStatesShowcasePage from './pages/FirstUseEmptyStatesShowcasePage';
import SkeletonStatesShowcasePage from './pages/SkeletonStatesShowcasePage';
import PaginationShowcasePage from './pages/PaginationShowcasePage';
import RadioCardShowcasePage from './pages/RadioCardShowcasePage';
import MarkdownShowcasePage from './pages/MarkdownShowcasePage';
import ExportToastShowcasePage from './pages/ExportToastShowcasePage';
import NotificationRulesPage from './pages/NotificationRulesPage';
import NotificationRuleDetailPage from './pages/NotificationRuleDetailPage';
import NotificationRuleEditorPage from './pages/NotificationRuleEditorPage';
import AnnouncementComposePage from './pages/AnnouncementComposePage';
import AnnouncementHistoryPage from './pages/AnnouncementHistoryPage';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage';
import AnnouncementFlowPage from './pages/AnnouncementFlowPage';
import NotificationDeliveryLogPage from './pages/NotificationDeliveryLogPage';
import SellerMessageComposePage from './pages/SellerMessageComposePage';
import SellerMessageHistoryPage from './pages/SellerMessageHistoryPage';
import SellerMessageDetailPage from './pages/SellerMessageDetailPage';
import MobileDesignSystemPage from './pages/MobileDesignSystemPage';
import MobileTabBarShowcasePage from './pages/MobileTabBarShowcasePage';
import MobileHeaderShowcasePage from './pages/MobileHeaderShowcasePage';
import MobileMoreMenuShowcasePage from './pages/MobileMoreMenuShowcasePage';
import MobileMoreMenuOrgShowcasePage from './pages/MobileMoreMenuOrgShowcasePage';
import MobileNavMapPage from './pages/MobileNavMapPage';
import MobileDashboardShowcasePage from './pages/MobileDashboardShowcasePage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/design-system',
    Component: DesignSystemPage,
  },
  {
    path: '/mobile-design-system',
    Component: MobileDesignSystemPage,
  },
  {
    path: '/mobile-tab-bar',
    Component: MobileTabBarShowcasePage,
  },
  {
    path: '/mobile-header',
    Component: MobileHeaderShowcasePage,
  },
  {
    path: '/mobile-more-menu',
    Component: MobileMoreMenuShowcasePage,
  },
  {
    path: '/mobile-more-menu-org',
    Component: MobileMoreMenuOrgShowcasePage,
  },
  {
    path: '/mobile-nav-map',
    Component: MobileNavMapPage,
  },
  {
    path: '/mobile-dashboard',
    Component: MobileDashboardShowcasePage,
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
    path: '/empty-states',
    Component: EmptyStatesShowcasePage,
  },
  {
    path: '/empty-states-first-use',
    Component: FirstUseEmptyStatesShowcasePage,
  },
  {
    path: '/skeleton-states',
    Component: SkeletonStatesShowcasePage,
  },
  {
    path: '/pagination-showcase',
    Component: PaginationShowcasePage,
  },
  {
    path: '/radio-card-showcase',
    Component: RadioCardShowcasePage,
  },
  {
    path: '/markdown-showcase',
    Component: MarkdownShowcasePage,
  },
  {
    path: '/export-toast-showcase',
    Component: ExportToastShowcasePage,
  },
  {
    path: '/notification-rules',
    Component: NotificationRulesPage,
  },
  {
    path: '/notification-rules/new',
    Component: NotificationRuleEditorPage,
  },
  {
    path: '/notification-rules/:id',
    Component: NotificationRuleDetailPage,
  },
  {
    path: '/notification-rules/:id/edit',
    Component: NotificationRuleEditorPage,
  },
  {
    path: '/announcements',
    Component: AnnouncementHistoryPage,
  },
  {
    path: '/announcements/new',
    Component: AnnouncementComposePage,
  },
  {
    path: '/announcements/:id',
    Component: AnnouncementDetailPage,
  },
  {
    path: '/flow/announcements',
    Component: AnnouncementFlowPage,
  },
  {
    path: '/notification-log',
    Component: NotificationDeliveryLogPage,
  },
  {
    path: '/seller-messages',
    Component: SellerMessageHistoryPage,
  },
  {
    path: '/seller-messages/new',
    Component: SellerMessageComposePage,
  },
  {
    path: '/seller-messages/:id',
    Component: SellerMessageDetailPage,
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