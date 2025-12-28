import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { OverviewComponent } from './pages/overview.component';
import { StatsComponent } from './pages/stats.component';
import { ReportsComponent } from './pages/reports.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'stats', component: StatsComponent },
      { path: 'reports', component: ReportsComponent }
    ]
  }
];
