import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h2>ホームページ</h2>
    <p>Angular Routing の基本的な例へようこそ！</p>
    <div class="info">
      <h3>このサンプルで学べること</h3>
      <ul>
        <li>基本的なルート定義</li>
        <li>router-outlet の使用方法</li>
        <li>routerLink によるナビゲーション</li>
        <li>Standalone コンポーネントでのルーティング設定</li>
      </ul>
    </div>
  `,
  styles: [`
    .info {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    h3 {
      margin-top: 0;
    }
  `]
})
export class HomeComponent {}
