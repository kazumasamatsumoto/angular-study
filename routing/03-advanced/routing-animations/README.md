# Routing Animations (ルーティングアニメーション)

## 概要

Routing Animationsは、ページ遷移時に視覚的なフィードバックを提供し、ユーザーエクスペリエンスを向上させる強力な機能です。Angularの`@angular/animations`パッケージを使用して、スライド、フェード、ズームなどの様々なトランジション効果を実装できます。

適切なアニメーションは、アプリケーションをより洗練された印象にし、ユーザーの現在位置や遷移方向を直感的に理解させることができます。

## 学習内容

- Angular Animationsの基本概念とAPI
- ルート遷移アニメーションの実装方法
- 様々なトランジション効果（スライド、フェード、ズームなど）
- パフォーマンス最適化とベストプラクティス
- 複雑なアニメーションシーケンスの作成

## 詳細な説明

### Angular Animationsとは

Angular Animationsは、Webアニメーション API (WAAPI) とCSSアニメーションをラップした、宣言的なアニメーションシステムです。主な特徴：

1. **状態ベース**: コンポーネントの状態に基づいてアニメーション
2. **トリガー**: 特定のイベントでアニメーションを開始
3. **トランジション**: 状態間の遷移方法を定義
4. **タイムライン**: 複数のアニメーションを順序付け

### なぜルーティングアニメーションが重要か

1. **視覚的フィードバック**: ユーザーにページ遷移を明確に伝える
2. **方向性の表現**: 前進/後退、階層の上下などを視覚化
3. **ブランディング**: アプリケーション独自の個性を表現
4. **コンテキストの維持**: ユーザーの現在位置を理解しやすくする
5. **プロフェッショナルな印象**: 洗練されたUXを提供

### アニメーションの種類

1. **フェード**: 要素の透明度を変化させる
2. **スライド**: 要素を水平/垂直方向に移動
3. **ズーム**: 要素のスケールを変化させる
4. **回転**: 要素を回転させる
5. **複合**: 複数の効果を組み合わせる

## 実装例

### 例1: 基本的なフェードアニメーション

```typescript
// animations/fade.animation.ts
import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
  AnimationTriggerMetadata
} from '@angular/animations';

export const fadeAnimation: AnimationTriggerMetadata = trigger('routeAnimations', [
  transition('* <=> *', [
    // 初期状態の設定
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        opacity: 0
      })
    ], { optional: true }),

    // 現在のページをフェードアウト、新しいページをフェードイン
    group([
      query(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),

      query(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);
```

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeAnimation } from './animations/fade.animation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container" [@routeAnimations]="prepareRoute(outlet)">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      position: relative;
      width: 100%;
      min-height: 100vh;
    }
  `],
  animations: [fadeAnimation]
})
export class AppComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
```

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { animation: 'HomePage' }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { animation: 'AboutPage' }
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: { animation: 'ContactPage' }
  }
];
```

### 例2: スライドアニメーション

```typescript
// animations/slide.animation.ts
import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
  AnimationTriggerMetadata
} from '@angular/animations';

export const slideInAnimation: AnimationTriggerMetadata = trigger('routeAnimations', [
  // 左から右へスライド
  transition('HomePage => AboutPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ left: '100%' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ left: '-100%' }))
      ], { optional: true }),
      query(':enter', [
        animate('300ms ease-out', style({ left: '0%' }))
      ], { optional: true })
    ])
  ]),

  // 右から左へスライド（戻る）
  transition('AboutPage => HomePage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ left: '-100%' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ left: '100%' }))
      ], { optional: true }),
      query(':enter', [
        animate('300ms ease-out', style({ left: '0%' }))
      ], { optional: true })
    ])
  ])
]);
```

### 例3: 垂直スライドとズーム

```typescript
// animations/slide-zoom.animation.ts
import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
  AnimationTriggerMetadata
} from '@angular/animations';

export const slideZoomAnimation: AnimationTriggerMetadata = trigger('routeAnimations', [
  transition('* => *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        height: '100%'
      })
    ], { optional: true }),

    group([
      // 前のページ: ズームアウト＆フェード
      query(':leave', [
        animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({
          transform: 'scale(0.8)',
          opacity: 0
        }))
      ], { optional: true }),

      // 新しいページ: 下からスライド＆フェードイン
      query(':enter', [
        style({
          transform: 'translateY(100%)',
          opacity: 0
        }),
        animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({
          transform: 'translateY(0)',
          opacity: 1
        }))
      ], { optional: true })
    ])
  ])
]);
```

### 例4: 複雑なステートベースアニメーション

```typescript
// animations/complex.animation.ts
import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
  stagger,
  AnimationTriggerMetadata
} from '@angular/animations';

// ページアニメーションの定義
const optional = { optional: true };

export const complexAnimation: AnimationTriggerMetadata = trigger('routeAnimations', [
  // ホームページ → 詳細ページ（深く潜る）
  transition('HomePage => DetailPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], optional),

    query(':enter', [
      style({
        transform: 'scale(1.2)',
        opacity: 0
      })
    ], optional),

    group([
      query(':leave', [
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({
            transform: 'scale(0.8)',
            opacity: 0
          })
        )
      ], optional),

      query(':enter', [
        animate('400ms 100ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({
            transform: 'scale(1)',
            opacity: 1
          })
        )
      ], optional)
    ]),

    // 要素を順番にアニメーション
    query(':enter .animate-item', [
      style({ opacity: 0, transform: 'translateY(50px)' }),
      stagger(50, [
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({
            opacity: 1,
            transform: 'translateY(0)'
          })
        )
      ])
    ], optional)
  ]),

  // 詳細ページ → ホームページ（浮上）
  transition('DetailPage => HomePage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], optional),

    query(':enter', [
      style({
        transform: 'scale(0.8)',
        opacity: 0
      })
    ], optional),

    group([
      query(':leave', [
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({
            transform: 'scale(1.2)',
            opacity: 0
          })
        )
      ], optional),

      query(':enter', [
        animate('400ms 100ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({
            transform: 'scale(1)',
            opacity: 1
          })
        )
      ], optional)
    ])
  ]),

  // リスト → グリッド（レイアウト変更）
  transition('ListView => GridView', [
    query(':enter .grid-item', [
      style({
        opacity: 0,
        transform: 'scale(0.5)'
      }),
      stagger(30, [
        animate('200ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({
            opacity: 1,
            transform: 'scale(1)'
          })
        )
      ])
    ], optional)
  ])
]);
```

```typescript
// detail-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-container">
      <div class="animate-item">
        <h1>Detail Page</h1>
      </div>

      <div class="animate-item">
        <p>This is the detail page content.</p>
      </div>

      <div class="animate-item">
        <div class="card">
          <h2>Card 1</h2>
          <p>Content for card 1</p>
        </div>
      </div>

      <div class="animate-item">
        <div class="card">
          <h2>Card 2</h2>
          <p>Content for card 2</p>
        </div>
      </div>

      <div class="animate-item">
        <div class="card">
          <h2>Card 3</h2>
          <p>Content for card 3</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      padding: 40px;
    }

    .animate-item {
      margin-bottom: 24px;
    }

    .card {
      padding: 24px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class DetailPageComponent {}
```

### 例5: カスタムイージング関数

```typescript
// animations/custom-easing.animation.ts
import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
  AnimationTriggerMetadata
} from '@angular/animations';

// カスタムイージング関数
const customEasing = {
  // Material Design easing
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',

  // カスタムイージング
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
};

export const customEasingAnimation: AnimationTriggerMetadata = trigger('routeAnimations', [
  transition('* => smooth', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%'
      })
    ], { optional: true }),

    group([
      query(':leave', [
        animate(`400ms ${customEasing.smooth}`,
          style({
            transform: 'translateX(-100%)',
            opacity: 0
          })
        )
      ], { optional: true }),

      query(':enter', [
        style({
          transform: 'translateX(100%)',
          opacity: 0
        }),
        animate(`400ms ${customEasing.smooth}`,
          style({
            transform: 'translateX(0)',
            opacity: 1
          })
        )
      ], { optional: true })
    ])
  ]),

  transition('* => bounce', [
    query(':enter', [
      style({
        transform: 'scale(0)',
        opacity: 0
      }),
      animate(`600ms ${customEasing.bounce}`,
        style({
          transform: 'scale(1)',
          opacity: 1
        })
      )
    ], { optional: true })
  ]),

  transition('* => elastic', [
    query(':enter', [
      style({
        transform: 'translateY(-100%)',
        opacity: 0
      }),
      animate(`800ms ${customEasing.elastic}`,
        style({
          transform: 'translateY(0)',
          opacity: 1
        })
      )
    ], { optional: true })
  ])
]);
```

### 例6: パラレルとシーケンシャルアニメーション

```typescript
// animations/parallel-sequential.animation.ts
import {
  trigger,
  transition,
  style,
  query,
  group,
  sequence,
  animate,
  stagger,
  AnimationTriggerMetadata
} from '@angular/animations';

const optional = { optional: true };

export const parallelSequentialAnimation: AnimationTriggerMetadata =
  trigger('routeAnimations', [
    transition('* => *', [
      // ステップ1: 初期状態の設定
      query(':enter, :leave', [
        style({
          position: 'absolute',
          width: '100%'
        })
      ], optional),

      // ステップ2: シーケンシャルアニメーション
      sequence([
        // 2-1: ヘッダーをフェードアウト
        query(':leave .header', [
          animate('200ms ease-out',
            style({ opacity: 0, transform: 'translateY(-20px)' })
          )
        ], optional),

        // 2-2: コンテンツを並列でアニメーション
        group([
          // 左側をスライドアウト
          query(':leave .sidebar', [
            animate('300ms ease-out',
              style({ transform: 'translateX(-100%)' })
            )
          ], optional),

          // メインコンテンツをフェードアウト
          query(':leave .main-content', [
            animate('300ms ease-out',
              style({ opacity: 0 })
            )
          ], optional)
        ]),

        // 2-3: ページ全体を切り替え
        group([
          query(':leave', [
            animate('200ms ease-out',
              style({ opacity: 0 })
            )
          ], optional),

          query(':enter', [
            style({ opacity: 0 }),
            animate('200ms ease-in',
              style({ opacity: 1 })
            )
          ], optional)
        ]),

        // 2-4: 新しいページの要素を順番に表示
        query(':enter .header', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          animate('300ms ease-out',
            style({ opacity: 1, transform: 'translateY(0)' })
          )
        ], optional),

        query(':enter .content-item', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(80, [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ], optional)
      ])
    ])
  ]);
```

### 例7: アニメーション制御サービス

```typescript
// services/animation-config.service.ts
import { Injectable, signal } from '@angular/core';

export type AnimationType =
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom'
  | 'none';

export interface AnimationConfig {
  enabled: boolean;
  type: AnimationType;
  duration: number;
  easing: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnimationConfigService {
  // Signalで管理
  private config = signal<AnimationConfig>({
    enabled: true,
    type: 'fade',
    duration: 300,
    easing: 'ease-in-out'
  });

  // 読み取り専用のSignal
  readonly animationConfig = this.config.asReadonly();

  /**
   * アニメーションの有効/無効を切り替え
   */
  toggleAnimations(): void {
    this.config.update(c => ({
      ...c,
      enabled: !c.enabled
    }));
  }

  /**
   * アニメーションタイプを設定
   */
  setAnimationType(type: AnimationType): void {
    this.config.update(c => ({
      ...c,
      type
    }));
  }

  /**
   * アニメーション期間を設定
   */
  setDuration(duration: number): void {
    this.config.update(c => ({
      ...c,
      duration: Math.max(0, Math.min(2000, duration)) // 0-2000ms
    }));
  }

  /**
   * イージング関数を設定
   */
  setEasing(easing: string): void {
    this.config.update(c => ({
      ...c,
      easing
    }));
  }

  /**
   * ユーザー設定を保存
   */
  savePreferences(): void {
    localStorage.setItem('animation-config', JSON.stringify(this.config()));
  }

  /**
   * ユーザー設定を読み込み
   */
  loadPreferences(): void {
    const saved = localStorage.getItem('animation-config');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        this.config.set(config);
      } catch (e) {
        console.error('Failed to load animation preferences', e);
      }
    }
  }

  /**
   * prefers-reduced-motionメディアクエリをチェック
   */
  checkReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  }

  /**
   * アクセシビリティ設定を適用
   */
  applyAccessibilitySettings(): void {
    if (this.checkReducedMotion()) {
      this.config.update(c => ({
        ...c,
        enabled: false
      }));
    }
  }
}
```

```typescript
// components/animation-settings.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AnimationConfigService,
  AnimationType
} from '../services/animation-config.service';

@Component({
  selector: 'app-animation-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-panel">
      <h2>Animation Settings</h2>

      <div class="setting-group">
        <label class="toggle">
          <input
            type="checkbox"
            [checked]="config().enabled"
            (change)="toggleAnimations()">
          <span>Enable Animations</span>
        </label>
      </div>

      <div class="setting-group" *ngIf="config().enabled">
        <label>Animation Type</label>
        <select
          [value]="config().type"
          (change)="onTypeChange($event)">
          <option value="fade">Fade</option>
          <option value="slide-left">Slide Left</option>
          <option value="slide-right">Slide Right</option>
          <option value="slide-up">Slide Up</option>
          <option value="slide-down">Slide Down</option>
          <option value="zoom">Zoom</option>
          <option value="none">None</option>
        </select>
      </div>

      <div class="setting-group" *ngIf="config().enabled">
        <label>
          Duration: {{ config().duration }}ms
        </label>
        <input
          type="range"
          min="100"
          max="1000"
          step="50"
          [value]="config().duration"
          (input)="onDurationChange($event)">
      </div>

      <div class="setting-group" *ngIf="config().enabled">
        <label>Easing Function</label>
        <select
          [value]="config().easing"
          (change)="onEasingChange($event)">
          <option value="linear">Linear</option>
          <option value="ease">Ease</option>
          <option value="ease-in">Ease In</option>
          <option value="ease-out">Ease Out</option>
          <option value="ease-in-out">Ease In Out</option>
          <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">Bounce</option>
        </select>
      </div>

      <div class="actions">
        <button (click)="save()" class="btn btn-primary">
          Save Preferences
        </button>
        <button (click)="reset()" class="btn btn-secondary">
          Reset to Default
        </button>
      </div>

      <div class="info" *ngIf="reducedMotion">
        <p>
          ⚠️ Your system has "Reduce Motion" enabled. Animations are disabled
          for accessibility.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .settings-panel {
      padding: 24px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      max-width: 500px;
    }

    h2 {
      margin: 0 0 24px 0;
      color: #333;
    }

    .setting-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }

    .toggle input {
      cursor: pointer;
    }

    select, input[type="range"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    input[type="range"] {
      padding: 0;
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .btn {
      flex: 1;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #1976d2;
      color: white;
    }

    .btn-primary:hover {
      background: #1565c0;
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .info {
      margin-top: 20px;
      padding: 16px;
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 4px;
    }

    .info p {
      margin: 0;
      color: #856404;
      font-size: 14px;
    }
  `]
})
export class AnimationSettingsComponent implements OnInit {
  private animationService = inject(AnimationConfigService);

  config = this.animationService.animationConfig;
  reducedMotion = false;

  ngOnInit(): void {
    this.reducedMotion = this.animationService.checkReducedMotion();
    this.animationService.applyAccessibilitySettings();
  }

  toggleAnimations(): void {
    this.animationService.toggleAnimations();
  }

  onTypeChange(event: Event): void {
    const type = (event.target as HTMLSelectElement).value as AnimationType;
    this.animationService.setAnimationType(type);
  }

  onDurationChange(event: Event): void {
    const duration = parseInt((event.target as HTMLInputElement).value, 10);
    this.animationService.setDuration(duration);
  }

  onEasingChange(event: Event): void {
    const easing = (event.target as HTMLSelectElement).value;
    this.animationService.setEasing(easing);
  }

  save(): void {
    this.animationService.savePreferences();
    alert('Preferences saved!');
  }

  reset(): void {
    this.animationService.setAnimationType('fade');
    this.animationService.setDuration(300);
    this.animationService.setEasing('ease-in-out');
  }
}
```

## ベストプラクティス

### 1. パフォーマンスの最適化

transformとopacityのみを使用してハードウェアアクセラレーションを活用します。

```typescript
// 良い例：GPUアクセラレーション
animate('300ms ease-out', style({
  transform: 'translateX(100%)',
  opacity: 0
}))

// 悪い例：レイアウトの再計算が発生
animate('300ms ease-out', style({
  left: '100px',  // リフローを引き起こす
  width: '500px'  // リフローを引き起こす
}))
```

### 2. 適切な期間の設定

アニメーションは短すぎず長すぎず、200-400msが適切です。

```typescript
// 推奨される期間
const durations = {
  quick: 200,    // 小さな変更
  normal: 300,   // 標準的な遷移
  slow: 400,     // 複雑な遷移
  verySlow: 600  // 特別な効果
};
```

### 3. イージング関数の選択

遷移の性質に合ったイージング関数を使用します。

```typescript
const easings = {
  // Material Design標準
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',  // 標準
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)', // 出現
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',   // 消失

  // カスタム
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
};
```

### 4. optional: trueの使用

存在しない要素でエラーが発生しないようにします。

```typescript
query(':enter, :leave', [
  // アニメーション定義
], { optional: true })  // 要素が存在しない場合もエラーにしない
```

### 5. position: absoluteの設定

オーバーラップするアニメーションでは絶対配置を使用します。

```typescript
query(':enter, :leave', [
  style({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
  })
], { optional: true })
```

### 6. アクセシビリティの考慮

prefers-reduced-motionメディアクエリを尊重します。

```typescript
@Injectable({ providedIn: 'root' })
export class AnimationService {
  shouldAnimate(): boolean {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
```

### 7. データ駆動のアニメーション選択

ルートデータでアニメーションを制御します。

```typescript
export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: {
      animation: 'HomePage',
      animationType: 'fade'
    }
  }
];
```

### 8. アニメーションのグループ化

関連するアニメーションをグループ化します。

```typescript
group([
  query(':leave', [...], { optional: true }),
  query(':enter', [...], { optional: true })
])
```

### 9. staggerの活用

リストアイテムを順番にアニメーションします。

```typescript
query('.list-item', [
  style({ opacity: 0, transform: 'translateY(20px)' }),
  stagger(50, [
    animate('300ms ease-out',
      style({ opacity: 1, transform: 'translateY(0)' })
    )
  ])
], { optional: true })
```

### 10. will-changeの使用

パフォーマンスのためにwill-changeを設定します。

```css
.animating-element {
  will-change: transform, opacity;
}

/* アニメーション終了後は削除 */
.animation-done {
  will-change: auto;
}
```

## よくある間違い

### 1. レイアウトプロパティのアニメーション

width、height、leftなどのレイアウトプロパティをアニメーションしてしまう。

```typescript
// 悪い例：リフローが発生
animate('300ms', style({
  width: '500px',
  height: '300px',
  left: '100px'
}))

// 良い例：transformを使用
animate('300ms', style({
  transform: 'scale(1.2) translateX(100px)'
}))
```

### 2. optional: trueの未使用

要素が存在しない場合にエラーが発生する。

```typescript
// 悪い例
query(':enter .header', [...])  // 要素がないとエラー

// 良い例
query(':enter .header', [...], { optional: true })
```

### 3. アニメーション期間が長すぎる

ユーザーを待たせる長いアニメーション。

```typescript
// 悪い例
animate('2000ms', ...)  // 2秒は長すぎる

// 良い例
animate('300ms', ...)  // 短く快適
```

### 4. z-indexの考慮不足

アニメーション中の要素の重なり順が適切でない。

```typescript
// 良い例：z-indexを明示
query(':enter, :leave', [
  style({
    position: 'absolute',
    zIndex: 1
  })
], { optional: true })
```

### 5. prefers-reduced-motionの無視

アクセシビリティ設定を無視してしまう。

```typescript
// 悪い例：常にアニメーション

// 良い例：ユーザー設定を尊重
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // アニメーションを実行
}
```

### 6. メモリリークの発生

アニメーション完了後のクリーンアップ不足。

```typescript
// 良い例：アニメーション完了後にクリーンアップ
animate('300ms', style({ transform: 'translateX(0)' }))
  .onDone(() => {
    element.style.willChange = 'auto';
  });
```

### 7. 複数のアニメーションの競合

同時に複数のアニメーションが実行されて競合する。

```typescript
// 悪い例：競合するアニメーション
// animationA と animationB が同じ要素を変更

// 良い例：sequenceで順序付け
sequence([
  animate('300ms', ...),  // 先に実行
  animate('200ms', ...)   // 後に実行
])
```

### 8. デバッグの難しさ

アニメーションの問題を特定しにくい。

```typescript
// 良い例：ログを追加
transition('* => *', [
  query(':enter', [
    animate('300ms', ...)
  ], {
    optional: true,
    limit: 1
  })
], {
  params: {
    debug: true
  }
})
```

### 9. ブラウザ互換性の未確認

古いブラウザでアニメーションが動作しない。

```typescript
// 良い例：フォールバック
@supports (transform: translateX(0)) {
  /* transformアニメーション */
}

@supports not (transform: translateX(0)) {
  /* フォールバック */
}
```

### 10. パフォーマンステストの欠如

低スペック端末でのパフォーマンスを確認していない。

```typescript
// 良い例：パフォーマンスモニタリング
const start = performance.now();
// アニメーション実行
const end = performance.now();
console.log(`Animation took ${end - start}ms`);
```

## 演習問題

### 初級

#### 演習1: 基本的なフェードアニメーション

タスク：
1. 2つのページ（HomeとAbout）を作成
2. フェードイン/フェードアウトのトランジションを実装
3. アニメーション期間を300msに設定
4. ease-in-outイージングを使用

期待される動作：
- ページ遷移時に滑らかにフェード
- 前のページと新しいページが重ならない
- アニメーションがスムーズ

#### 演習2: スライドアニメーション

タスク：
1. 3つのページを作成
2. 左から右へのスライドアニメーションを実装
3. 戻るボタンでは右から左へスライド
4. アニメーション期間は400ms

期待される動作：
- 進む時は左から右へスライド
- 戻る時は右から左へスライド
- スムーズな遷移

### 中級

#### 演習1: 複数の要素のステッガードアニメーション

タスク：
1. リスト表示ページを作成
2. リストアイテムを順番にアニメーション
3. 各アイテムの遅延を50msに設定
4. 下から上へフェードインしながら表示

期待される動作：
- リストアイテムが順番に表示される
- 各アイテムが下から上へアニメーション
- 全体の動きが統一感がある

#### 演習2: カスタムイージング関数

タスク：
1. 複数のイージング関数を実装
2. ユーザーが選択できるUIを作成
3. 選択したイージングでアニメーション
4. ローカルストレージに設定を保存

期待される動作：
- ユーザーがイージングを選択できる
- 選択したイージングが即座に反映される
- ブラウザを再起動しても設定が保持される

### 上級

#### 演習1: 階層型ナビゲーションアニメーション

タスク：
1. マスター/詳細ビューを作成
2. 深く潜る時はズームイン＆フェード
3. 戻る時はズームアウト＆フェード
4. 詳細ページの要素を順番にアニメーション
5. prefers-reduced-motionに対応

期待される動作：
- リストから詳細へはズームインで遷移
- 詳細からリストへはズームアウトで遷移
- 詳細ページの要素が順番に表示される
- ユーザーのアクセシビリティ設定を尊重

実装のヒント：
```typescript
// マスター → 詳細
transition('MasterView => DetailView', [
  query(':leave', [
    animate('300ms', style({
      transform: 'scale(0.8)',
      opacity: 0
    }))
  ], { optional: true }),

  query(':enter', [
    style({ transform: 'scale(1.2)', opacity: 0 }),
    animate('400ms', style({
      transform: 'scale(1)',
      opacity: 1
    }))
  ], { optional: true })
])
```

#### 演習2: パフォーマンス最適化されたアニメーションシステム

タスク：
1. アニメーション設定サービスを作成
2. アニメーション有効/無効の切り替え
3. アニメーション期間と種類のカスタマイズ
4. パフォーマンスモニタリング機能
5. 低スペック端末での自動最適化

期待される動作：
- ユーザーがアニメーションを完全に制御できる
- パフォーマンスメトリクスが表示される
- 低スペック端末で自動的に最適化される
- すべての設定が永続化される

実装のヒント：
```typescript
interface PerformanceMetrics {
  avgFrameTime: number;
  droppedFrames: number;
  animationDuration: number;
}

function measureAnimationPerformance(): PerformanceMetrics {
  // Performance APIを使用して測定
  const entries = performance.getEntriesByType('measure');
  // メトリクスを計算
  return metrics;
}
```

## 次のステップへのリンク

Routing Animationsの基礎を学んだら、次のトピックに進みましょう：

- [I18n Routing](../i18n-routing/README.md) - 国際化対応のルーティング
- [Performance](../performance/README.md) - パフォーマンス最適化
- [State Management](../state-management/README.md) - 状態管理との統合
- [Error Handling](../error-handling/README.md) - エラーハンドリング戦略

## 参考リンク

- [Angular Animations Guide](https://angular.dev/guide/animations)
- [Angular Animations API](https://angular.dev/api/animations)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Material Design Motion](https://material.io/design/motion)
- [Reduced Motion Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## まとめ

Routing Animationsは、Angularアプリケーションのユーザーエクスペリエンスを大幅に向上させる強力な機能です。適切に実装することで、以下のメリットが得られます：

- プロフェッショナルな印象
- 直感的なナビゲーション体験
- ブランドアイデンティティの強化
- コンテキストの明確化
- ユーザーエンゲージメントの向上

ただし、パフォーマンスとアクセシビリティに注意し、ユーザーの設定を尊重することが重要です。適切なアニメーション期間、イージング関数、最適化手法を使用して、すべてのユーザーにとって快適な体験を提供しましょう。
