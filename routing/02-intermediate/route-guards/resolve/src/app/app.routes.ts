import { Routes } from '@angular/router';
import { userResolver } from './resolvers/user.resolver';
import { usersResolver } from './resolvers/users.resolver';
import { dashboardDataResolver } from './resolvers/dashboard-data.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/user-list/user-list.component').then(m => m.UserListComponent),
    resolve: {
      users: usersResolver
    }
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./pages/user-detail/user-detail.component').then(m => m.UserDetailComponent),
    resolve: {
      user: userResolver
    }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    resolve: {
      data: dashboardDataResolver
    }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
