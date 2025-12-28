import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserPostComponent } from './components/user-post/user-post.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'users/:username', component: UserProfileComponent },
  { path: 'users/:username/posts/:postId', component: UserPostComponent }
];
