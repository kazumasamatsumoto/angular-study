import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <h1>Route Configuration Example</h1>
      <nav>
        <a routerLink="/home" routerLinkActive="active">ホーム</a>
        <a routerLink="/about" routerLinkActive="active">このサイトについて</a>
        <a routerLink="/old-path" routerLinkActive="active">旧パス (リダイレクト)</a>
        <a routerLink="/invalid-route" routerLinkActive="active">無効なルート (404)</a>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    header {
      background-color: #1976d2;
      color: white;
      padding: 1rem;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0 0 1rem 0;
    }

    nav {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s;
    }

    nav a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    nav a.active {
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: bold;
    }

    main {
      padding: 0 1rem;
    }
  `]
})
export class AppComponent {}
