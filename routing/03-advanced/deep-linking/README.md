# Deep Linking (深いリンクとフラグメント)

## 概要

Deep Linkingは、アプリケーション内の特定のコンテンツや状態に直接アクセスできるようにする技術です。Angularでは、URLフラグメント、クエリパラメータ、スクロール位置の制御などを組み合わせて、ブックマーク可能で共有しやすいリンクを作成できます。

この機能は、ドキュメントサイト、ブログ、ECサイトなど、特定のコンテンツへの直接アクセスが重要なアプリケーションで特に有用です。

## 学習内容

- URLフラグメントの基本と活用方法
- スクロール位置の制御とカスタマイズ
- クエリパラメータとの組み合わせ
- ブックマーク対応のベストプラクティス
- SEOとアクセシビリティの考慮事項

## 詳細な説明

### Deep Linkingとは

Deep Linkingは、Webアプリケーション内の特定のページやコンテンツに直接リンクする機能です。以下の要素で構成されます：

1. **URLフラグメント**: `#section1`のような、ページ内の特定位置を示す識別子
2. **クエリパラメータ**: `?filter=active&sort=date`のような、ページの状態を示すパラメータ
3. **パスパラメータ**: `/products/123`のような、リソースを特定するパラメータ

### なぜDeep Linkingが重要か

1. **ユーザーエクスペリエンス**: 特定のコンテンツに直接アクセスできる
2. **共有性**: URLを共有することで、同じコンテンツを他のユーザーと共有できる
3. **ブックマーク**: ユーザーが特定の状態をブックマークできる
4. **SEO**: 検索エンジンがコンテンツを適切にインデックス化できる
5. **アクセシビリティ**: スクリーンリーダーなどの支援技術との親和性

### フラグメントの種類

1. **静的フラグメント**: HTML要素のIDに対応
2. **動的フラグメント**: JavaScriptで制御されるスクロール位置
3. **仮想フラグメント**: 実際のDOM要素に対応しない論理的な位置

## 実装例

### 例1: 基本的なフラグメントナビゲーション

```typescript
// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  InMemoryScrollingOptions
} from '@angular/router';
import { routes } from './app.routes';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'enabled', // ナビゲーション時にスクロール位置を復元
  anchorScrolling: 'enabled' // フラグメントへのスクロールを有効化
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling(scrollConfig)
    )
  ]
};
```

```typescript
// documentation.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="doc-container">
      <aside class="sidebar">
        <nav class="toc">
          <h3>Table of Contents</h3>
          <ul>
            <li>
              <a [routerLink]="[]" [fragment]="'introduction'">Introduction</a>
            </li>
            <li>
              <a [routerLink]="[]" [fragment]="'installation'">Installation</a>
            </li>
            <li>
              <a [routerLink]="[]" [fragment]="'configuration'">Configuration</a>
            </li>
            <li>
              <a [routerLink]="[]" [fragment]="'usage'">Usage</a>
            </li>
            <li>
              <a [routerLink]="[]" [fragment]="'api'">API Reference</a>
            </li>
            <li>
              <a [routerLink]="[]" [fragment]="'examples'">Examples</a>
            </li>
            <li>
              <a [routerLink]="[]" [fragment]="'troubleshooting'">Troubleshooting</a>
            </li>
          </ul>
        </nav>
      </aside>

      <main class="content">
        <section id="introduction" class="section">
          <h2>Introduction</h2>
          <p>
            Welcome to our comprehensive documentation. This guide will help you
            get started with our framework and explore its powerful features.
          </p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        </section>

        <section id="installation" class="section">
          <h2>Installation</h2>
          <p>Follow these steps to install the framework:</p>
          <pre><code>npm install @example/framework</code></pre>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        </section>

        <section id="configuration" class="section">
          <h2>Configuration</h2>
          <p>Configure your application with the following options:</p>
          <pre><code>{{ configExample }}</code></pre>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        </section>

        <section id="usage" class="section">
          <h2>Usage</h2>
          <p>Here's how to use the framework in your application:</p>
          <pre><code>{{ usageExample }}</code></pre>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        </section>

        <section id="api" class="section">
          <h2>API Reference</h2>
          <p>Complete API documentation for all methods and properties.</p>
          <div *ngFor="let api of apiMethods" class="api-item">
            <h3>{{ api.name }}</h3>
            <p>{{ api.description }}</p>
          </div>
        </section>

        <section id="examples" class="section">
          <h2>Examples</h2>
          <p>Practical examples to help you get started:</p>
          <div *ngFor="let example of examples" class="example-item">
            <h3>{{ example.title }}</h3>
            <pre><code>{{ example.code }}</code></pre>
          </div>
        </section>

        <section id="troubleshooting" class="section">
          <h2>Troubleshooting</h2>
          <p>Common issues and their solutions:</p>
          <ul>
            <li *ngFor="let issue of issues">
              <strong>{{ issue.problem }}</strong>: {{ issue.solution }}
            </li>
          </ul>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .doc-container {
      display: flex;
      height: 100vh;
    }

    .sidebar {
      width: 250px;
      background: #f5f5f5;
      border-right: 1px solid #ddd;
      overflow-y: auto;
      position: sticky;
      top: 0;
      height: 100vh;
    }

    .toc {
      padding: 20px;
    }

    .toc h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .toc ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .toc li {
      margin-bottom: 8px;
    }

    .toc a {
      color: #333;
      text-decoration: none;
      display: block;
      padding: 8px 12px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .toc a:hover {
      background: #e0e0e0;
      color: #1976d2;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 40px;
    }

    .section {
      margin-bottom: 60px;
      scroll-margin-top: 20px; /* スクロール時のオフセット */
    }

    .section h2 {
      color: #1976d2;
      border-bottom: 2px solid #1976d2;
      padding-bottom: 8px;
      margin-bottom: 20px;
    }

    pre {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      overflow-x: auto;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }

    .api-item, .example-item {
      margin-bottom: 24px;
      padding: 16px;
      background: #f9f9f9;
      border-left: 4px solid #1976d2;
    }
  `]
})
export class DocumentationComponent {
  configExample = `{
  apiKey: 'your-api-key',
  timeout: 5000,
  retries: 3
}`;

  usageExample = `import { Framework } from '@example/framework';

const app = new Framework({
  apiKey: 'your-api-key'
});

app.initialize();`;

  apiMethods = [
    {
      name: 'initialize()',
      description: 'Initializes the framework with the provided configuration.'
    },
    {
      name: 'configure(options)',
      description: 'Updates the framework configuration.'
    },
    {
      name: 'destroy()',
      description: 'Cleans up resources and destroys the framework instance.'
    }
  ];

  examples = [
    {
      title: 'Basic Usage',
      code: 'const result = await framework.doSomething();'
    },
    {
      title: 'Advanced Configuration',
      code: 'framework.configure({ advanced: true });'
    }
  ];

  issues = [
    {
      problem: 'Installation fails',
      solution: 'Make sure you have Node.js 18+ installed'
    },
    {
      problem: 'Configuration not working',
      solution: 'Check that all required fields are provided'
    }
  ];
}
```

### 例2: カスタムスクロール動作

```typescript
// custom-scroll.service.ts
import { Injectable, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomScrollService {
  private viewportScroller = inject(ViewportScroller);
  private router = inject(Router);
  private scrollOffset: [number, number] = [0, 70]; // x, y オフセット

  init(): void {
    this.router.events
      .pipe(
        filter((e): e is Scroll => e instanceof Scroll)
      )
      .subscribe(e => {
        if (e.position) {
          // 戻る/進むの場合は前の位置に戻る
          setTimeout(() => {
            this.viewportScroller.scrollToPosition(e.position!);
          }, 100);
        } else if (e.anchor) {
          // フラグメントがある場合
          setTimeout(() => {
            this.scrollToAnchor(e.anchor!);
          }, 100);
        } else {
          // 新しいナビゲーションの場合はトップへ
          setTimeout(() => {
            this.viewportScroller.scrollToPosition([0, 0]);
          }, 100);
        }
      });
  }

  scrollToAnchor(anchor: string): void {
    const element = document.getElementById(anchor);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const top = rect.top + scrollTop - this.scrollOffset[1];

      window.scrollTo({
        top,
        behavior: 'smooth'
      });

      // アクセシビリティのためにフォーカスを移動
      element.setAttribute('tabindex', '-1');
      element.focus();
      element.addEventListener('blur', () => {
        element.removeAttribute('tabindex');
      }, { once: true });
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  scrollToElement(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  setScrollOffset(x: number, y: number): void {
    this.scrollOffset = [x, y];
  }
}
```

```typescript
// app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomScrollService } from './services/custom-scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  private scrollService = inject(CustomScrollService);

  ngOnInit(): void {
    this.scrollService.init();
  }
}
```

### 例3: フラグメントとクエリパラメータの組み合わせ

```typescript
// blog-post.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <article class="blog-post">
      <header>
        <h1 id="title">{{ post.title }}</h1>
        <div class="meta">
          <span>By {{ post.author }}</span>
          <span>{{ post.date | date }}</span>
        </div>
      </header>

      <div class="content" id="content">
        <p *ngFor="let paragraph of post.paragraphs">
          {{ paragraph }}
        </p>
      </div>

      <section id="comments" class="comments-section">
        <h2>Comments ({{ comments.length }})</h2>

        <div class="filter-bar">
          <button
            [class.active]="sortBy === 'newest'"
            (click)="setSortBy('newest')">
            Newest
          </button>
          <button
            [class.active]="sortBy === 'oldest'"
            (click)="setSortBy('oldest')">
            Oldest
          </button>
        </div>

        <div class="comments">
          <div
            *ngFor="let comment of sortedComments"
            [id]="'comment-' + comment.id"
            class="comment"
            [class.highlighted]="highlightedCommentId === comment.id">
            <div class="comment-header">
              <strong>{{ comment.author }}</strong>
              <span class="timestamp">{{ comment.timestamp | date:'short' }}</span>
              <a
                [routerLink]="[]"
                [queryParams]="{ sort: sortBy }"
                [fragment]="'comment-' + comment.id"
                class="permalink">
                #
              </a>
            </div>
            <p>{{ comment.content }}</p>
          </div>
        </div>
      </section>

      <nav class="quick-nav">
        <h3>Quick Navigation</h3>
        <ul>
          <li>
            <a [routerLink]="[]" [fragment]="'title'">Title</a>
          </li>
          <li>
            <a [routerLink]="[]" [fragment]="'content'">Content</a>
          </li>
          <li>
            <a
              [routerLink]="[]"
              [queryParams]="{ sort: sortBy }"
              [fragment]="'comments'">
              Comments
            </a>
          </li>
        </ul>
      </nav>
    </article>
  `,
  styles: [`
    .blog-post {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    header {
      margin-bottom: 40px;
    }

    h1 {
      margin: 0 0 16px 0;
      color: #333;
      scroll-margin-top: 80px;
    }

    .meta {
      display: flex;
      gap: 16px;
      color: #666;
      font-size: 14px;
    }

    .content {
      margin-bottom: 60px;
      line-height: 1.8;
      scroll-margin-top: 80px;
    }

    .content p {
      margin-bottom: 20px;
    }

    .comments-section {
      margin-top: 60px;
      scroll-margin-top: 80px;
    }

    .filter-bar {
      display: flex;
      gap: 8px;
      margin: 20px 0;
    }

    .filter-bar button {
      padding: 8px 16px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-bar button:hover {
      background: #f5f5f5;
    }

    .filter-bar button.active {
      background: #1976d2;
      color: white;
      border-color: #1976d2;
    }

    .comment {
      padding: 20px;
      margin-bottom: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      scroll-margin-top: 80px;
    }

    .comment.highlighted {
      border-color: #ffd700;
      background: #fffef0;
      animation: highlight 2s ease;
    }

    @keyframes highlight {
      0%, 100% { background: #f9f9f9; }
      50% { background: #fffef0; }
    }

    .comment-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .timestamp {
      color: #666;
      font-size: 12px;
    }

    .permalink {
      margin-left: auto;
      color: #1976d2;
      text-decoration: none;
      font-weight: bold;
    }

    .permalink:hover {
      text-decoration: underline;
    }

    .quick-nav {
      position: fixed;
      top: 100px;
      right: 40px;
      background: white;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .quick-nav h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
    }

    .quick-nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .quick-nav li {
      margin-bottom: 8px;
    }

    .quick-nav a {
      color: #1976d2;
      text-decoration: none;
      font-size: 14px;
    }

    .quick-nav a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .quick-nav {
        display: none;
      }
    }
  `]
})
export class BlogPostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  sortBy: 'newest' | 'oldest' = 'newest';
  highlightedCommentId: string | null = null;

  post = {
    title: 'Understanding Deep Linking in Angular',
    author: 'John Doe',
    date: new Date('2024-01-15'),
    paragraphs: [
      'Deep linking is a powerful feature that allows users to navigate directly to specific content within your application.',
      'In this article, we will explore how to implement deep linking in Angular applications using fragments and query parameters.',
      'We will also discuss best practices for creating bookmarkable and shareable URLs.'
    ]
  };

  comments: Comment[] = [
    {
      id: '1',
      author: 'Alice',
      content: 'Great article! Very helpful.',
      timestamp: new Date('2024-01-16T10:30:00')
    },
    {
      id: '2',
      author: 'Bob',
      content: 'Thanks for sharing this information.',
      timestamp: new Date('2024-01-16T14:20:00')
    },
    {
      id: '3',
      author: 'Charlie',
      content: 'I have a question about the implementation...',
      timestamp: new Date('2024-01-17T09:15:00')
    }
  ];

  ngOnInit(): void {
    // クエリパラメータからソート順を取得
    this.route.queryParams.subscribe(params => {
      if (params['sort'] === 'newest' || params['sort'] === 'oldest') {
        this.sortBy = params['sort'];
      }
    });

    // フラグメントからハイライト対象のコメントを取得
    this.route.fragment.subscribe(fragment => {
      if (fragment?.startsWith('comment-')) {
        this.highlightedCommentId = fragment.replace('comment-', '');
        setTimeout(() => {
          this.highlightedCommentId = null;
        }, 3000);
      }
    });
  }

  get sortedComments(): Comment[] {
    return [...this.comments].sort((a, b) => {
      if (this.sortBy === 'newest') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
    });
  }

  setSortBy(sort: 'newest' | 'oldest'): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort },
      queryParamsHandling: 'merge',
      fragment: 'comments'
    });
  }
}
```

### 例4: 動的フラグメント生成

```typescript
// table-of-contents.service.ts
import { Injectable } from '@angular/core';

export interface TocItem {
  id: string;
  title: string;
  level: number;
  element?: HTMLElement;
}

@Injectable({
  providedIn: 'root'
})
export class TableOfContentsService {
  /**
   * ドキュメントから見出しを抽出してTOCを生成
   */
  generateToc(containerSelector: string): TocItem[] {
    const container = document.querySelector(containerSelector);
    if (!container) return [];

    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocItems: TocItem[] = [];

    headings.forEach((heading, index) => {
      const element = heading as HTMLElement;
      const level = parseInt(element.tagName.substring(1));
      const title = element.textContent || '';

      // IDがない場合は自動生成
      let id = element.id;
      if (!id) {
        id = this.generateId(title, index);
        element.id = id;
      }

      tocItems.push({
        id,
        title,
        level,
        element
      });
    });

    return tocItems;
  }

  /**
   * タイトルからIDを生成
   */
  private generateId(title: string, index: number): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return base || `heading-${index}`;
  }

  /**
   * アクティブな見出しを検出
   */
  detectActiveHeading(tocItems: TocItem[]): string | null {
    const scrollPosition = window.pageYOffset + 100; // オフセット

    for (let i = tocItems.length - 1; i >= 0; i--) {
      const item = tocItems[i];
      if (item.element) {
        const rect = item.element.getBoundingClientRect();
        const elementTop = rect.top + window.pageYOffset;

        if (scrollPosition >= elementTop) {
          return item.id;
        }
      }
    }

    return null;
  }
}
```

```typescript
// dynamic-toc.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableOfContentsService, TocItem } from '../services/table-of-contents.service';
import { fromEvent, Subject } from 'rxjs';
import { throttleTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-toc',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <aside class="toc-sidebar">
        <nav class="toc">
          <h3>On This Page</h3>
          <ul>
            <li
              *ngFor="let item of tocItems"
              [style.paddingLeft.px]="(item.level - 1) * 16"
              [class.active]="item.id === activeHeadingId">
              <a
                [routerLink]="[]"
                [fragment]="item.id"
                (click)="onTocClick(item.id)">
                {{ item.title }}
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main class="content" #contentContainer>
        <article>
          <h1>Dynamic Table of Contents</h1>

          <h2>Introduction</h2>
          <p>
            This example demonstrates how to automatically generate a table of contents
            from the headings in your document.
          </p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>

          <h2>Features</h2>
          <p>The TOC automatically:</p>
          <ul>
            <li>Extracts all headings from the document</li>
            <li>Generates IDs for headings without them</li>
            <li>Highlights the active section</li>
            <li>Supports smooth scrolling</li>
          </ul>

          <h3>Automatic ID Generation</h3>
          <p>Headings without IDs are automatically assigned one based on their content.</p>

          <h3>Active Section Detection</h3>
          <p>The TOC highlights the currently visible section as you scroll.</p>

          <h2>Implementation</h2>
          <p>Here's how to implement this feature:</p>

          <h3>Step 1: Service Creation</h3>
          <p>Create a service to handle TOC generation and active section detection.</p>

          <h3>Step 2: Component Integration</h3>
          <p>Integrate the service into your component.</p>

          <h3>Step 3: Styling</h3>
          <p>Add appropriate styles for the TOC navigation.</p>

          <h2>Best Practices</h2>
          <p>Follow these best practices:</p>

          <h3>Semantic HTML</h3>
          <p>Use proper heading hierarchy (h1 -> h2 -> h3).</p>

          <h3>Accessibility</h3>
          <p>Ensure the TOC is keyboard navigable.</p>

          <h3>Performance</h3>
          <p>Throttle scroll events to avoid performance issues.</p>

          <h2>Conclusion</h2>
          <p>Dynamic TOC generation improves navigation and user experience.</p>
        </article>
      </main>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      max-width: 1400px;
      margin: 0 auto;
    }

    .toc-sidebar {
      width: 250px;
      position: sticky;
      top: 20px;
      height: fit-content;
      max-height: calc(100vh - 40px);
      overflow-y: auto;
    }

    .toc {
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .toc h3 {
      margin: 0 0 16px 0;
      font-size: 14px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
    }

    .toc ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .toc li {
      margin-bottom: 4px;
      transition: all 0.2s ease;
    }

    .toc li.active {
      background: #e3f2fd;
      border-radius: 4px;
    }

    .toc li.active a {
      color: #1976d2;
      font-weight: 600;
    }

    .toc a {
      display: block;
      padding: 6px 8px;
      color: #555;
      text-decoration: none;
      font-size: 13px;
      line-height: 1.4;
      transition: color 0.2s ease;
    }

    .toc a:hover {
      color: #1976d2;
    }

    .content {
      flex: 1;
      padding: 40px;
      min-width: 0;
    }

    article h1, article h2, article h3 {
      scroll-margin-top: 80px;
      margin-top: 40px;
      margin-bottom: 20px;
    }

    article h1 {
      color: #1976d2;
      border-bottom: 3px solid #1976d2;
      padding-bottom: 12px;
    }

    article h2 {
      color: #333;
      border-bottom: 2px solid #ddd;
      padding-bottom: 8px;
    }

    article h3 {
      color: #555;
    }

    article p {
      line-height: 1.8;
      margin-bottom: 16px;
      color: #444;
    }

    article ul {
      margin-bottom: 16px;
      padding-left: 24px;
    }

    article li {
      margin-bottom: 8px;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .page-container {
        flex-direction: column;
      }

      .toc-sidebar {
        width: 100%;
        position: static;
        margin-bottom: 20px;
      }
    }
  `]
})
export class DynamicTocComponent implements OnInit, OnDestroy {
  private tocService = inject(TableOfContentsService);
  private destroy$ = new Subject<void>();

  tocItems: TocItem[] = [];
  activeHeadingId: string | null = null;

  ngOnInit(): void {
    // DOMが準備できてからTOCを生成
    setTimeout(() => {
      this.tocItems = this.tocService.generateToc('.content article');
      this.detectActiveHeading();
    }, 100);

    // スクロールイベントをリッスン
    fromEvent(window, 'scroll')
      .pipe(
        throttleTime(100),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.detectActiveHeading();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  detectActiveHeading(): void {
    this.activeHeadingId = this.tocService.detectActiveHeading(this.tocItems);
  }

  onTocClick(id: string): void {
    // クリック後、少し待ってからアクティブ状態を更新
    setTimeout(() => {
      this.activeHeadingId = id;
    }, 100);
  }
}
```

### 例5: ブックマーク可能な検索結果

```typescript
// search-results.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'name' | 'price' | 'relevance';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="search-container">
      <div class="search-header">
        <h1>Product Search</h1>
        <div class="share-url">
          <input
            type="text"
            [value]="currentUrl"
            readonly
            class="url-input"
            #urlInput>
          <button (click)="copyUrl(urlInput)" class="btn-copy">
            {{ urlCopied ? 'Copied!' : 'Copy URL' }}
          </button>
        </div>
      </div>

      <div class="search-controls">
        <input
          type="text"
          [(ngModel)]="filters.query"
          (ngModelChange)="onSearchChange()"
          placeholder="Search products..."
          class="search-input">

        <select
          [(ngModel)]="filters.category"
          (ngModelChange)="onFilterChange()"
          class="filter-select">
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="home">Home & Garden</option>
        </select>

        <div class="price-range">
          <input
            type="number"
            [(ngModel)]="filters.minPrice"
            (ngModelChange)="onFilterChange()"
            placeholder="Min Price"
            class="price-input">
          <span>-</span>
          <input
            type="number"
            [(ngModel)]="filters.maxPrice"
            (ngModelChange)="onFilterChange()"
            placeholder="Max Price"
            class="price-input">
        </div>

        <label class="checkbox-label">
          <input
            type="checkbox"
            [(ngModel)]="filters.inStockOnly"
            (ngModelChange)="onFilterChange()">
          In Stock Only
        </label>

        <select
          [(ngModel)]="filters.sortBy"
          (ngModelChange)="onFilterChange()"
          class="sort-select">
          <option value="relevance">Relevance</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>

        <button
          (click)="toggleSortOrder()"
          class="btn-sort-order">
          {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
        </button>
      </div>

      <div class="results-info">
        <p>
          Found {{ filteredProducts.length }} products
          <span *ngIf="filters.query"> for "{{ filters.query }}"</span>
        </p>
        <button (click)="clearFilters()" class="btn-clear">
          Clear Filters
        </button>
      </div>

      <div class="results-grid">
        <div
          *ngFor="let product of paginatedProducts"
          [id]="'product-' + product.id"
          class="product-card"
          [class.highlighted]="highlightedProductId === product.id">
          <h3>{{ product.name }}</h3>
          <p class="category">{{ product.category }}</p>
          <p class="price">\${{ product.price }}</p>
          <p class="stock" [class.out-of-stock]="!product.inStock">
            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
          </p>
          <a
            [routerLink]="[]"
            [queryParams]="currentQueryParams"
            [fragment]="'product-' + product.id"
            class="permalink">
            Share
          </a>
        </div>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button
          (click)="goToPage(filters.page - 1)"
          [disabled]="filters.page === 1"
          class="btn-page">
          Previous
        </button>
        <span class="page-info">
          Page {{ filters.page }} of {{ totalPages }}
        </span>
        <button
          (click)="goToPage(filters.page + 1)"
          [disabled]="filters.page === totalPages"
          class="btn-page">
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .search-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .share-url {
      display: flex;
      gap: 8px;
    }

    .url-input {
      width: 400px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
    }

    .btn-copy {
      padding: 8px 16px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn-copy:hover {
      background: #1565c0;
    }

    .search-controls {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
      align-items: center;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .filter-select, .sort-select {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }

    .price-range {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .price-input {
      width: 100px;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .btn-sort-order {
      padding: 12px 16px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
    }

    .results-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .btn-clear {
      padding: 8px 16px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .product-card {
      padding: 20px;
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      transition: all 0.3s ease;
      scroll-margin-top: 100px;
      position: relative;
    }

    .product-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .product-card.highlighted {
      border-color: #1976d2;
      background: #e3f2fd;
    }

    .product-card h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .category {
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      margin: 0 0 12px 0;
    }

    .price {
      font-size: 24px;
      font-weight: bold;
      color: #1976d2;
      margin: 0 0 8px 0;
    }

    .stock {
      margin: 0 0 16px 0;
      font-weight: 500;
      color: #4caf50;
    }

    .stock.out-of-stock {
      color: #f44336;
    }

    .permalink {
      color: #1976d2;
      text-decoration: none;
      font-size: 12px;
    }

    .permalink:hover {
      text-decoration: underline;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
    }

    .btn-page {
      padding: 10px 20px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-page:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .page-info {
      font-size: 14px;
      color: #666;
    }
  `]
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  filters: SearchFilters = {
    query: '',
    category: '',
    minPrice: 0,
    maxPrice: 0,
    inStockOnly: false,
    sortBy: 'relevance',
    sortOrder: 'asc',
    page: 1,
    pageSize: 12
  };

  highlightedProductId: number | null = null;
  urlCopied = false;

  products: Product[] = [
    { id: 1, name: 'Laptop Pro', category: 'electronics', price: 1299, inStock: true },
    { id: 2, name: 'Wireless Mouse', category: 'electronics', price: 29, inStock: true },
    { id: 3, name: 'Cotton T-Shirt', category: 'clothing', price: 19, inStock: false },
    { id: 4, name: 'Programming Book', category: 'books', price: 49, inStock: true },
    { id: 5, name: 'Garden Tools Set', category: 'home', price: 79, inStock: true },
    // ... more products
  ];

  ngOnInit(): void {
    // URLからフィルターを復元
    this.route.queryParams.subscribe(params => {
      this.filters = {
        query: params['q'] || '',
        category: params['category'] || '',
        minPrice: params['minPrice'] ? +params['minPrice'] : 0,
        maxPrice: params['maxPrice'] ? +params['maxPrice'] : 0,
        inStockOnly: params['inStock'] === 'true',
        sortBy: params['sort'] || 'relevance',
        sortOrder: params['order'] || 'asc',
        page: params['page'] ? +params['page'] : 1,
        pageSize: 12
      };
    });

    // フラグメントから商品をハイライト
    this.route.fragment.subscribe(fragment => {
      if (fragment?.startsWith('product-')) {
        this.highlightedProductId = +fragment.replace('product-', '');
        setTimeout(() => {
          this.highlightedProductId = null;
        }, 3000);
      }
    });
  }

  get currentUrl(): string {
    return window.location.href;
  }

  get currentQueryParams(): any {
    const params: any = {};
    if (this.filters.query) params['q'] = this.filters.query;
    if (this.filters.category) params['category'] = this.filters.category;
    if (this.filters.minPrice) params['minPrice'] = this.filters.minPrice;
    if (this.filters.maxPrice) params['maxPrice'] = this.filters.maxPrice;
    if (this.filters.inStockOnly) params['inStock'] = 'true';
    if (this.filters.sortBy !== 'relevance') params['sort'] = this.filters.sortBy;
    if (this.filters.sortOrder !== 'asc') params['order'] = this.filters.sortOrder;
    if (this.filters.page !== 1) params['page'] = this.filters.page;
    return params;
  }

  get filteredProducts(): Product[] {
    let results = [...this.products];

    // テキスト検索
    if (this.filters.query) {
      const query = this.filters.query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // カテゴリフィルター
    if (this.filters.category) {
      results = results.filter(p => p.category === this.filters.category);
    }

    // 価格フィルター
    if (this.filters.minPrice > 0) {
      results = results.filter(p => p.price >= this.filters.minPrice);
    }
    if (this.filters.maxPrice > 0) {
      results = results.filter(p => p.price <= this.filters.maxPrice);
    }

    // 在庫フィルター
    if (this.filters.inStockOnly) {
      results = results.filter(p => p.inStock);
    }

    // ソート
    results.sort((a, b) => {
      let comparison = 0;
      if (this.filters.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (this.filters.sortBy === 'price') {
        comparison = a.price - b.price;
      }
      return this.filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return results;
  }

  get paginatedProducts(): Product[] {
    const start = (this.filters.page - 1) * this.filters.pageSize;
    const end = start + this.filters.pageSize;
    return this.filteredProducts.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.filters.pageSize);
  }

  onSearchChange(): void {
    // 検索時はページをリセット
    this.filters.page = 1;
    this.updateUrl();
  }

  onFilterChange(): void {
    // フィルター変更時はページをリセット
    this.filters.page = 1;
    this.updateUrl();
  }

  toggleSortOrder(): void {
    this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    this.updateUrl();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.filters.page = page;
      this.updateUrl();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  clearFilters(): void {
    this.filters = {
      query: '',
      category: '',
      minPrice: 0,
      maxPrice: 0,
      inStockOnly: false,
      sortBy: 'relevance',
      sortOrder: 'asc',
      page: 1,
      pageSize: 12
    };
    this.updateUrl();
  }

  private updateUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.currentQueryParams,
      queryParamsHandling: 'merge'
    });
  }

  copyUrl(input: HTMLInputElement): void {
    input.select();
    document.execCommand('copy');
    this.urlCopied = true;
    setTimeout(() => {
      this.urlCopied = false;
    }, 2000);
  }
}
```

### 例6: SEO対応のプリレンダリング設定

```typescript
// prerender.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrerenderService {
  private platformId = inject(PLATFORM_ID);
  private meta = inject(Meta);
  private title = inject(Title);
  private router = inject(Router);

  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.setupRouterListener();
  }

  /**
   * ページメタデータを設定
   */
  setMetadata(metadata: PageMetadata): void {
    // タイトル設定
    this.title.setTitle(metadata.title);

    // メタタグ設定
    this.meta.updateTag({ name: 'description', content: metadata.description });

    if (metadata.keywords) {
      this.meta.updateTag({ name: 'keywords', content: metadata.keywords });
    }

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: metadata.title });
    this.meta.updateTag({ property: 'og:description', content: metadata.description });

    if (metadata.image) {
      this.meta.updateTag({ property: 'og:image', content: metadata.image });
    }

    if (metadata.url) {
      this.meta.updateTag({ property: 'og:url', content: metadata.url });
    }

    if (metadata.type) {
      this.meta.updateTag({ property: 'og:type', content: metadata.type });
    }

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: metadata.title });
    this.meta.updateTag({ name: 'twitter:description', content: metadata.description });

    if (metadata.image) {
      this.meta.updateTag({ name: 'twitter:image', content: metadata.image });
    }

    // Canonical URL
    if (metadata.url) {
      this.updateCanonicalUrl(metadata.url);
    }
  }

  /**
   * Canonical URLを更新
   */
  private updateCanonicalUrl(url: string): void {
    if (!this.isBrowser) return;

    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  /**
   * 構造化データを追加
   */
  addStructuredData(data: any): void {
    if (!this.isBrowser) return;

    let script: HTMLScriptElement | null =
      document.querySelector('script[type="application/ld+json"]');

    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);
  }

  /**
   * ルーター変更を監視してメタデータを更新
   */
  private setupRouterListener(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // URLが変更されたらスクロール位置をリセット（フラグメント以外）
        if (!event.url.includes('#')) {
          if (this.isBrowser) {
            window.scrollTo(0, 0);
          }
        }
      });
  }
}
```

```typescript
// product-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrerenderService } from '../services/prerender.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  template: `
    <div class="product-detail">
      <h1>{{ product.name }}</h1>
      <img [src]="product.image" [alt]="product.name">
      <p>{{ product.description }}</p>
      <p class="price">\${{ product.price }}</p>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private prerenderService = inject(PrerenderService);

  product: any = {};

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    // 商品データを取得...

    // メタデータを設定
    this.prerenderService.setMetadata({
      title: `${this.product.name} - My Store`,
      description: this.product.description,
      keywords: this.product.tags.join(', '),
      image: this.product.image,
      url: `https://example.com/products/${id}`,
      type: 'product'
    });

    // 構造化データを追加
    this.prerenderService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: this.product.name,
      description: this.product.description,
      image: this.product.image,
      offers: {
        '@type': 'Offer',
        price: this.product.price,
        priceCurrency: 'USD',
        availability: this.product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock'
      }
    });
  }
}
```

### 例7: アクセシビリティ対応のフラグメントナビゲーション

```typescript
// accessible-navigation.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AccessibleNavigationService {
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);

  /**
   * アクセシブルなフラグメントナビゲーション
   */
  navigateToFragment(fragment: string, options?: {
    offset?: number;
    focus?: boolean;
    announceToScreenReader?: boolean;
  }): void {
    const defaults = {
      offset: 80,
      focus: true,
      announceToScreenReader: true
    };

    const config = { ...defaults, ...options };

    // ルーター経由でナビゲーション
    this.router.navigate([], { fragment });

    // 少し待ってからスクロール
    setTimeout(() => {
      const element = document.getElementById(fragment);
      if (!element) return;

      // スクロール
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetTop = rect.top + scrollTop - config.offset;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      // フォーカス管理
      if (config.focus) {
        this.setFocusToElement(element);
      }

      // スクリーンリーダーへのアナウンス
      if (config.announceToScreenReader) {
        this.announceToScreenReader(element);
      }
    }, 100);
  }

  /**
   * 要素にフォーカスを設定
   */
  private setFocusToElement(element: HTMLElement): void {
    // 元々フォーカス可能な要素かチェック
    const focusableElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
    const isFocusable = focusableElements.includes(element.tagName) ||
                       element.hasAttribute('tabindex');

    if (!isFocusable) {
      // フォーカス可能にする
      element.setAttribute('tabindex', '-1');
      element.addEventListener('blur', () => {
        element.removeAttribute('tabindex');
      }, { once: true });
    }

    element.focus();
  }

  /**
   * スクリーンリーダーにアナウンス
   */
  private announceToScreenReader(element: HTMLElement): void {
    const text = this.getElementText(element);
    if (!text) return;

    // ARIAライブリージョンを作成
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';

    document.body.appendChild(liveRegion);

    // テキストを設定
    setTimeout(() => {
      liveRegion.textContent = `Navigated to ${text}`;

      // 5秒後に削除
      setTimeout(() => {
        document.body.removeChild(liveRegion);
      }, 5000);
    }, 100);
  }

  /**
   * 要素のテキストを取得
   */
  private getElementText(element: HTMLElement): string {
    // aria-labelがあればそれを使用
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    // 見出し要素のテキスト
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) return heading.textContent || '';

    // 要素自体のテキスト
    return element.textContent?.trim().substring(0, 50) || '';
  }

  /**
   * スキップリンクの実装
   */
  addSkipLinks(sections: Array<{ id: string; label: string }>): void {
    const skipNav = document.createElement('nav');
    skipNav.className = 'skip-links';
    skipNav.setAttribute('aria-label', 'Skip links');

    const list = document.createElement('ul');

    sections.forEach(section => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${section.id}`;
      link.textContent = `Skip to ${section.label}`;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToFragment(section.id);
      });

      item.appendChild(link);
      list.appendChild(item);
    });

    skipNav.appendChild(list);
    document.body.insertBefore(skipNav, document.body.firstChild);

    // スキップリンクのスタイル
    const style = document.createElement('style');
    style.textContent = `
      .skip-links {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
      }
      .skip-links ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .skip-links a {
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }
      .skip-links a:focus {
        position: static;
        width: auto;
        height: auto;
        padding: 10px 15px;
        background: #000;
        color: #fff;
        text-decoration: none;
        display: inline-block;
      }
    `;
    document.head.appendChild(style);
  }
}
```

## ベストプラクティス

### 1. フラグメントスクロールの設定

RouterモジュールでanchorScrollingを有効にします。

```typescript
// app.config.ts
provideRouter(
  routes,
  withInMemoryScrolling({
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })
)
```

### 2. scroll-margin-topの使用

固定ヘッダーがある場合、CSSでスクロールオフセットを設定します。

```css
section {
  scroll-margin-top: 80px; /* ヘッダーの高さ */
}
```

### 3. スムーズスクロールの実装

JavaScriptでスムーズスクロールを制御します。

```typescript
window.scrollTo({
  top: targetPosition,
  behavior: 'smooth'
});
```

### 4. フォーカス管理

フラグメントに移動したら、その要素にフォーカスを移します。

```typescript
element.setAttribute('tabindex', '-1');
element.focus();
```

### 5. ブックマーク可能なURL設計

すべての重要な状態をURLに反映させます。

```typescript
// 良い例：すべての状態がURLに反映
/search?q=laptop&category=electronics&sort=price&order=asc#results

// 悪い例：状態がコンポーネント内部にのみ存在
/search
```

### 6. クエリパラメータの正規化

不要なパラメータは削除し、URLをクリーンに保ちます。

```typescript
private normalizeQueryParams(params: any): any {
  const normalized: any = {};
  Object.keys(params).forEach(key => {
    if (params[key] && params[key] !== '' && params[key] !== '0') {
      normalized[key] = params[key];
    }
  });
  return normalized;
}
```

### 7. SEO対応のメタデータ

各ページに適切なメタデータを設定します。

```typescript
this.meta.updateTag({ name: 'description', content: description });
this.meta.updateTag({ property: 'og:title', content: title });
this.title.setTitle(title);
```

### 8. 構造化データの追加

検索エンジンがコンテンツを理解しやすくします。

```typescript
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description: description
};
this.addStructuredData(structuredData);
```

### 9. アクセシビリティの考慮

スクリーンリーダーユーザーのためにARIA属性を使用します。

```typescript
<nav aria-label="Table of contents">
  <a href="#section1" aria-describedby="section1-desc">
    Section 1
  </a>
</nav>
```

### 10. パフォーマンスの最適化

スクロールイベントをthrottleして処理します。

```typescript
fromEvent(window, 'scroll')
  .pipe(throttleTime(100))
  .subscribe(() => {
    this.updateActiveSection();
  });
```

## よくある間違い

### 1. anchorScrollingの未設定

RouterモジュールでanchorScrollingを有効にし忘れる。

```typescript
// 悪い例
provideRouter(routes)

// 良い例
provideRouter(
  routes,
  withInMemoryScrolling({ anchorScrolling: 'enabled' })
)
```

### 2. scroll-margin-topの未使用

固定ヘッダーでコンテンツが隠れてしまう。

```css
/* 悪い例：オフセットなし */
section {
  /* scroll-margin-topなし */
}

/* 良い例 */
section {
  scroll-margin-top: 80px;
}
```

### 3. フォーカス管理の欠如

スクリーンリーダーユーザーが現在位置を把握できない。

```typescript
// 悪い例：スクロールのみ
element.scrollIntoView();

// 良い例：フォーカスも移動
element.scrollIntoView();
element.setAttribute('tabindex', '-1');
element.focus();
```

### 4. URLの状態不一致

コンポーネントの状態とURLが同期していない。

```typescript
// 悪い例
this.currentPage = 2; // URLは更新されない

// 良い例
this.router.navigate([], {
  queryParams: { page: 2 },
  queryParamsHandling: 'merge'
});
```

### 5. 不要なパラメータの蓄積

デフォルト値もURLに含めてしまう。

```typescript
// 悪い例
{ page: 1, sort: 'default', filter: '' }

// 良い例
{ page: 2 } // デフォルトでない値のみ
```

### 6. メタデータの更新忘れ

ページ遷移時にメタデータが更新されない。

```typescript
// 悪い例：メタデータがindex.htmlのまま

// 良い例：各ページで更新
ngOnInit(): void {
  this.metaService.setMetadata({
    title: this.product.name,
    description: this.product.description
  });
}
```

### 7. フラグメントIDの重複

同じIDが複数の要素に設定されている。

```html
<!-- 悪い例 -->
<div id="section">...</div>
<div id="section">...</div>

<!-- 良い例 -->
<div id="section-1">...</div>
<div id="section-2">...</div>
```

### 8. 非同期処理のタイミング

DOMが準備できる前にスクロールしようとする。

```typescript
// 悪い例
this.scrollToFragment('section1');

// 良い例
setTimeout(() => {
  this.scrollToFragment('section1');
}, 100);
```

### 9. スクロールイベントのパフォーマンス

スクロールイベントをthrottleせずに処理する。

```typescript
// 悪い例
window.addEventListener('scroll', () => {
  this.checkActiveSection(); // 頻繁に実行
});

// 良い例
fromEvent(window, 'scroll')
  .pipe(throttleTime(100))
  .subscribe(() => this.checkActiveSection());
```

### 10. ブラウザの戻る/進むの考慮不足

戻る/進む時にスクロール位置が復元されない。

```typescript
// 良い例
provideRouter(
  routes,
  withInMemoryScrolling({
    scrollPositionRestoration: 'enabled'
  })
)
```

## 演習問題

### 初級

#### 演習1: 基本的な目次ナビゲーション

タスク：
1. 3つのセクションを持つページを作成
2. 各セクションに一意のIDを設定
3. 目次からフラグメントリンクでナビゲーション
4. スムーズスクロールを実装

期待される動作：
- 目次のリンクをクリックすると該当セクションにスクロール
- スクロールがスムーズに行われる
- URLにフラグメントが反映される

#### 演習2: クエリパラメータでのフィルタリング

タスク：
1. 商品リストページを作成
2. カテゴリとソートのフィルターを実装
3. フィルターの状態をクエリパラメータに反映
4. URLから状態を復元

期待される動作：
- フィルター変更がURLに反映される
- URLを共有すると同じフィルター状態が再現される
- ブラウザの戻る/進むで状態が復元される

### 中級

#### 演習1: アクティブセクションのハイライト

タスク：
1. スクロール位置に応じてアクティブセクションを検出
2. 目次のアクティブ項目をハイライト
3. スクロールイベントを最適化（throttle）
4. 固定ヘッダーのオフセットを考慮

期待される動作：
- スクロールに応じて目次のアクティブ項目が変わる
- パフォーマンスの問題がない
- 固定ヘッダーの下にコンテンツが隠れない

#### 演習2: ブックマーク可能な検索結果

タスク：
1. 検索、フィルター、ソート、ページネーションを実装
2. すべての状態をURLに反映
3. URLから完全に状態を復元
4. URL共有機能を実装

期待される動作：
- すべての検索・フィルター状態がURLに反映
- URLをコピーして共有できる
- 共有されたURLで同じ結果が表示される

### 上級

#### 演習1: SEO対応の動的メタデータ

タスク：
1. ページごとに適切なメタデータを設定
2. Open GraphとTwitter Cardタグを実装
3. 構造化データ（JSON-LD）を追加
4. Canonical URLを設定
5. プリレンダリング対応

期待される動作：
- 各ページに適切なタイトルと説明が設定される
- SNSでシェアした際に適切なプレビューが表示される
- 検索エンジンが構造化データを認識する

実装のヒント：
```typescript
interface PageMetadata {
  title: string;
  description: string;
  image?: string;
  structuredData?: any;
}
```

#### 演習2: アクセシブルなフラグメントナビゲーション

タスク：
1. スクリーンリーダー対応のスキップリンクを実装
2. フラグメント移動時に適切にフォーカスを管理
3. ARIAライブリージョンでナビゲーションをアナウンス
4. キーボードナビゲーションを完全にサポート

期待される動作：
- スクリーンリーダーで現在位置が明確に伝わる
- キーボードだけで完全に操作できる
- WCAG 2.1 AA基準を満たす

実装のヒント：
```typescript
// フォーカス管理
element.setAttribute('tabindex', '-1');
element.focus();

// ARIAライブリージョン
<div role="status" aria-live="polite">
  Navigated to {{ sectionTitle }}
</div>
```

## 次のステップへのリンク

Deep Linkingの基礎を学んだら、次のトピックに進みましょう：

- [Routing Animations](../routing-animations/README.md) - ルート遷移のアニメーション
- [I18n Routing](../i18n-routing/README.md) - 国際化対応のルーティング
- [Error Handling](../error-handling/README.md) - エラーハンドリング戦略
- [Performance](../performance/README.md) - ルーティングのパフォーマンス最適化

## 参考リンク

- [Angular Router - Anchor Scrolling](https://angular.dev/api/router/ExtraOptions#anchorScrolling)
- [ViewportScroller API](https://angular.dev/api/common/ViewportScroller)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Schema.org Structured Data](https://schema.org/)

## まとめ

Deep Linkingは、Angularアプリケーションのユーザーエクスペリエンス、SEO、アクセシビリティを大幅に向上させる重要な機能です。適切に実装することで、以下のメリットが得られます：

- ユーザーが特定のコンテンツに直接アクセスできる
- URLの共有とブックマークが可能になる
- 検索エンジンがコンテンツを適切にインデックス化できる
- アクセシビリティが向上する
- ブラウザの戻る/進む機能が正しく動作する

フラグメント、クエリパラメータ、メタデータを適切に組み合わせて、使いやすく、共有しやすく、SEOに強いアプリケーションを構築しましょう。
