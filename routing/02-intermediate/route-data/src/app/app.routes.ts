import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    data: {
      title: 'ホーム',
      breadcrumb: 'ホーム',
      icon: '🏠',
      description: 'Route Dataのデモアプリケーション'
    }
  },
  {
    path: 'products',
    data: {
      breadcrumb: '商品一覧'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.ProductListComponent),
        data: {
          title: '商品一覧',
          icon: '🛍️',
          description: 'すべての商品を表示',
          animation: 'ProductListPage'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        data: {
          title: '商品詳細',
          breadcrumb: '商品詳細',
          icon: '📦',
          description: '商品の詳細情報',
          animation: 'ProductDetailPage'
        }
      }
    ]
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    data: {
      title: '会社概要',
      breadcrumb: '会社概要',
      icon: 'ℹ️',
      description: '会社の情報と理念',
      showInSitemap: true,
      lastModified: '2024-01-15'
    }
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    data: {
      title: 'お問い合わせ',
      breadcrumb: 'お問い合わせ',
      icon: '✉️',
      description: 'お問い合わせフォーム',
      requiresAuth: false
    }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
