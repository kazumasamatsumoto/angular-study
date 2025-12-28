import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h2>ホームページ</h2>
    <p>ナビゲーションの様々な方法を学びます。</p>

    <div class="demo-section">
      <h3>プログラム的なナビゲーション</h3>
      <p>ボタンクリックで他のページに遷移します。</p>

      <div class="button-group">
        <button (click)="navigateToProducts()">商品一覧へ</button>
        <button (click)="navigateToProductDetail(1)">商品詳細へ (ID: 1)</button>
        <button (click)="navigateToSearch('angular')">検索へ (query: angular)</button>
      </div>
    </div>

    <div class="demo-section">
      <h3>ナビゲーションの特徴</h3>
      <ul>
        <li>routerLink: 宣言的なナビゲーション</li>
        <li>router.navigate(): プログラム的なナビゲーション</li>
        <li>routerLinkActive: アクティブリンクのスタイリング</li>
        <li>相対パスと絶対パスの使い分け</li>
      </ul>
    </div>
  `,
  styles: [`
    .demo-section {
      margin: 2rem 0;
      padding: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    h3 {
      margin-top: 0;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    button {
      padding: 0.75rem 1.5rem;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #1565c0;
    }
  `]
})
export class HomeComponent {
  private router = inject(Router);

  navigateToProducts() {
    this.router.navigate(['/products']);
  }

  navigateToProductDetail(id: number) {
    this.router.navigate(['/products', id]);
  }

  navigateToSearch(query: string) {
    this.router.navigate(['/search'], {
      queryParams: { q: query }
    });
  }
}
