import { Routes } from '@angular/router';
import { canDeactivateGuard } from './guards/can-deactivate.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/article-edit/article-edit.component').then(m => m.ArticleEditComponent),
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: 'profile/edit',
    loadComponent: () => import('./pages/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent),
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
