import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>Route Events - ルーティングイベントの監視</h2>

      <div class="alert alert-info">
        <strong>このデモについて:</strong><br>
        Angularのルーティングイベントを監視して、ローディングインジケーター、
        プログレスバー、イベントログを表示する実装例です。
      </div>

      <h3>主な機能</h3>
      <div class="grid">
        <div class="feature-card">
          <h3>&#64;1. プログレスバー</h3>
          <p>画面上部にナビゲーション進捗を表示</p>
          <a routerLink="/page1" class="btn btn-primary">試してみる</a>
        </div>

        <div class="feature-card">
          <h3>&#64;2. ローディングオーバーレイ</h3>
          <p>データ取得中の全画面ローディング表示</p>
          <a routerLink="/slow-page" class="btn btn-primary">試してみる</a>
        </div>

        <div class="feature-card">
          <h3>&#64;3. イベントログ</h3>
          <p>すべてのナビゲーションイベントを記録</p>
          <button class="btn btn-primary">ログを確認</button>
        </div>
      </div>

      <h3>監視しているイベント</h3>
      <ul>
        <li><strong>NavigationStart:</strong> ナビゲーション開始時に発火</li>
        <li><strong>NavigationEnd:</strong> ナビゲーション成功時に発火</li>
        <li><strong>NavigationCancel:</strong> ナビゲーションがキャンセルされた時に発火</li>
        <li><strong>NavigationError:</strong> ナビゲーションエラー時に発火</li>
      </ul>

      <h3>実装例</h3>
      <pre><code>// navigation-tracker.service.ts
constructor(private router: Router) {{ '{' }}
  // NavigationStart
  this.router.events.pipe(
    filter(event =&gt; event instanceof NavigationStart)
  ).subscribe(() =&gt; {{ '{' }}
    this.isLoading.set(true);
    this.progress.set(10);
  {{ '}' }});

  // NavigationEnd
  this.router.events.pipe(
    filter(event =&gt; event instanceof NavigationEnd)
  ).subscribe(() =&gt; {{ '{' }}
    this.isLoading.set(false);
    this.progress.set(100);
  {{ '}' }});

  // NavigationError
  this.router.events.pipe(
    filter(event =&gt; event instanceof NavigationError)
  ).subscribe((event) =&gt; {{ '{' }}
    this.isLoading.set(false);
    console.error('Navigation error:', event.error);
  {{ '}' }});
{{ '}' }}
</code></pre>

      <h3>試してみよう</h3>
      <ol>
        <li>上部のナビゲーションから他のページに移動してください</li>
        <li>プログレスバーが表示されることを確認</li>
        <li>「遅いページ」リンクをクリック（3秒のローディング）</li>
        <li>ローディングオーバーレイとプログレスバーが表示される</li>
        <li>イベントログに各イベントが記録される</li>
      </ol>

      <h3>活用シーン</h3>
      <ul>
        <li><strong>UX向上:</strong> データ取得中のフィードバック</li>
        <li><strong>エラーハンドリング:</strong> ナビゲーションエラーの検知と処理</li>
        <li><strong>分析:</strong> ページ遷移のトラッキング</li>
        <li><strong>デバッグ:</strong> ルーティングの問題を特定</li>
      </ul>

      <h3>演習問題</h3>
      <ol>
        <li>ナビゲーション時間を計測する機能を追加してみよう</li>
        <li>エラー発生時にトーストメッセージを表示してみよう</li>
        <li>特定のページのみローディング表示を無効化してみよう</li>
        <li>ページ遷移のアニメーションを追加してみよう</li>
      </ol>
    </div>
  `
})
export class HomeComponent {}
