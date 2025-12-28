import { Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout.component';
import { ProfileComponent } from './pages/profile.component';
import { SettingsComponent } from './pages/settings.component';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];
