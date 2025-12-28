import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>ページ1</h2>

      <div class="alert alert-success">
        このページに遷移した時のイベントがログに記録されています。
      </div>

      <p>
        ナビゲーションイベントのタイムスタンプを確認することで、
        ページ遷移にかかった時間を計測できます。
      </p>

      <h3>記録されたイベント</h3>
      <ul>
        <li><strong>NavigationStart:</strong> /page1 への遷移開始</li>
        <li><strong>NavigationEnd:</strong> /page1 への遷移完了</li>
      </ul>

      <h3>イベントの流れ</h3>
      <pre><code>1. ユーザーがリンクをクリック
2. NavigationStart イベント発火
3. ルートガード実行（設定されている場合）
4. Resolver実行（設定されている場合）
5. コンポーネント読み込み
6. NavigationEnd イベント発火
</code></pre>

      <p>
        上記のイベントログを確認して、実際の動作を見てみましょう。
      </p>
    </div>
  `
})
export class Page1Component {}
