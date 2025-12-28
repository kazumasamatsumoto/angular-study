import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>商品詳細</h2>
    <p>この画面では、ルートパラメータについて次のセクションで学習します。</p>

    <div class="navigation-demo">
      <h3>ナビゲーション例</h3>
      <div class="button-group">
        <a routerLink="/products" class="btn">← 商品一覧に戻る</a>
        <a routerLink="/home" class="btn">ホームに戻る</a>
      </div>
    </div>
  `,
  styles: [`
    .navigation-demo {
      margin-top: 2rem;
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

    .btn {
      padding: 0.75rem 1.5rem;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
      display: inline-block;
    }

    .btn:hover {
      background-color: #1565c0;
    }
  `]
})
export class ProductDetailComponent {}
