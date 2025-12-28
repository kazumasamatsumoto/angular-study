import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

interface Post {
  id: number;
  username: string;
  title: string;
  content: string;
  date: string;
}

@Component({
  selector: 'app-user-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (post) {
      <div class="post-detail">
        <div class="breadcrumb">
          <a routerLink="/home">ホーム</a>
          <span> / </span>
          <a routerLink="/users/{{ username }}">{{ username }}</a>
          <span> / </span>
          <span>投稿 #{{ postId }}</span>
        </div>

        <h2>{{ post.title }}</h2>
        <p class="meta">
          <span class="author">投稿者: {{ post.username }}</span>
          <span class="date">{{ post.date }}</span>
        </p>
        <div class="content">{{ post.content }}</div>

        <div class="info-box">
          <h3>取得した複数のパラメータ</h3>
          <p><strong>Username:</strong> {{ username }}</p>
          <p><strong>Post ID:</strong> {{ postId }}</p>
          <p class="note">※ このルートでは2つのパラメータを同時に使用しています。</p>
        </div>

        <div class="actions">
          <a routerLink="/users/{{ username }}" class="btn">
            {{ username }} のページに戻る
          </a>
          <a routerLink="/home" class="btn btn-secondary">
            ホームに戻る
          </a>
        </div>
      </div>
    } @else {
      <div class="error">
        <h2>投稿が見つかりません</h2>
        <p>指定された投稿は存在しないか、削除されています。</p>
        <p><strong>Username:</strong> {{ username }}</p>
        <p><strong>Post ID:</strong> {{ postId }}</p>
        <a routerLink="/home" class="btn">ホームに戻る</a>
      </div>
    }

    <div class="code-example">
      <h3>複数パラメータのルート定義</h3>
      <pre><code>{{ routeDefinition }}</code></pre>

      <h3>複数パラメータの取得</h3>
      <pre><code>{{ paramExample }}</code></pre>
    </div>
  `,
  styles: [`
    .post-detail {
      max-width: 800px;
    }

    .breadcrumb {
      margin-bottom: 1.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .breadcrumb a {
      color: #1976d2;
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    h2 {
      margin: 0;
      color: #333;
    }

    .meta {
      display: flex;
      gap: 1.5rem;
      margin: 1rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .content {
      padding: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
      line-height: 1.8;
      margin: 2rem 0;
    }

    .info-box {
      margin: 2rem 0;
      padding: 1rem;
      background-color: #fff3e0;
      border-left: 4px solid #ff9800;
      border-radius: 4px;
    }

    .info-box h3 {
      margin-top: 0;
    }

    .note {
      font-size: 0.9rem;
      color: #555;
      margin-top: 1rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin: 2rem 0;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
      transition: background-color 0.3s;
    }

    .btn:hover {
      background-color: #1565c0;
    }

    .btn-secondary {
      background-color: #757575;
    }

    .btn-secondary:hover {
      background-color: #616161;
    }

    .error {
      text-align: center;
      padding: 2rem;
      color: #d32f2f;
    }

    .code-example {
      margin-top: 3rem;
      padding: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .code-example h3 {
      margin-top: 1.5rem;
    }

    .code-example h3:first-child {
      margin-top: 0;
    }

    pre {
      background-color: #263238;
      color: #aed581;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  `]
})
export class UserPostComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  post: Post | null = null;
  username: string = '';
  postId: string = '';

  private posts: Post[] = [
    {
      id: 1,
      username: 'john',
      title: 'Angular入門ガイド',
      content: 'Angularは強力なWebアプリケーションフレームワークです。TypeScriptとの統合により、型安全な開発が可能です。',
      date: '2024-01-15'
    },
    {
      id: 2,
      username: 'john',
      title: 'TypeScript Tips & Tricks',
      content: 'TypeScriptの便利な機能やパターンを紹介します。ジェネリクスやユニオン型などを活用しましょう。',
      date: '2024-01-20'
    },
    {
      id: 3,
      username: 'jane',
      title: 'UIデザインの基本原則',
      content: 'ユーザビリティを重視したデザインの重要性について。一貫性、シンプルさ、フィードバックが鍵です。',
      date: '2024-01-18'
    }
  ];

  routeDefinition = `{
  path: 'users/:username/posts/:postId',
  component: UserPostComponent
}`;

  paramExample = `this.route.paramMap.subscribe(params => {
  this.username = params.get('username') || '';
  this.postId = params.get('postId') || '';
  this.loadPost(this.username, this.postId);
});`;

  ngOnInit() {
    // 複数のパラメータを同時に取得
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.username = params.get('username') || '';
        this.postId = params.get('postId') || '';
        this.loadPost(this.username, this.postId);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPost(username: string, postId: string) {
    const post = this.posts.find(
      p => p.username === username && p.id === Number(postId)
    );
    this.post = post || null;
  }
}
