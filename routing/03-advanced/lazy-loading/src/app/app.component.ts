import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <div class="container">
        <ul>
          <li><a routerLink="/home" routerLinkActive="active">ホーム</a></li>
          <li><a routerLink="/admin" routerLinkActive="active">管理画面 (遅延)</a></li>
          <li><a routerLink="/user" routerLinkActive="active">ユーザー (遅延)</a></li>
          <li><a routerLink="/dashboard" routerLinkActive="active">ダッシュボード (遅延)</a></li>
        </ul>
      </div>
    </nav>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    nav {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    ul {
      list-style: none;
      display: flex;
      gap: 0.5rem;
      padding: 1rem 0;
      margin: 0;
    }

    a {
      text-decoration: none;
      color: #666;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    a:hover {
      background-color: #f5f5f5;
    }

    a.active {
      background-color: #1976d2;
      color: white;
    }
  `]
})
export class AppComponent {
  title = 'lazy-loading';
}
