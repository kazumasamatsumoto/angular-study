import { Routes } from '@angular/router';
import { slowPageResolver } from './resolvers/slow-page.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'page1',
    loadComponent: () => import('./pages/page1/page1.component').then(m => m.Page1Component)
  },
  {
    path: 'page2',
    loadComponent: () => import('./pages/page2/page2.component').then(m => m.Page2Component)
  },
  {
    path: 'slow-page',
    loadComponent: () => import('./pages/slow-page/slow-page.component').then(m => m.SlowPageComponent),
    resolve: {
      data: slowPageResolver
    }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
