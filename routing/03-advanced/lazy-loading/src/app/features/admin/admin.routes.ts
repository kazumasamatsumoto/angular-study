import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminDashboardComponent } from './pages/dashboard.component';
import { UserListComponent } from './pages/user-list.component';
import { SettingsComponent } from './pages/settings.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: UserListComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];
