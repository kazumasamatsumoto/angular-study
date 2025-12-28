# I18n Routing (国際化とルーティング)

## 概要

I18n Routing（国際化ルーティング）は、多言語対応のWebアプリケーションにおいて、言語ごとに異なるURLを提供し、ロケールの切り替えを管理する機能です。Angularの国際化機能とルーティングを組み合わせることで、SEOに優れた多言語サイトを構築できます。

適切なi18nルーティングの実装により、ユーザーは母国語でコンテンツにアクセスでき、検索エンジンは各言語のページを適切にインデックス化できます。

## 学習内容

- Angular i18nの基本概念とセットアップ
- ロケール別URLパターンの設計
- 言語切り替え機能の実装
- SEO対応とhreflangタグの設定
- ロケール検出と自動リダイレクト

## 詳細な説明

### Angular i18nとは

Angular i18n（Internationalization）は、アプリケーションを複数の言語とロケールに対応させるための公式機能です。主な特徴：

1. **ビルド時翻訳**: パフォーマンスが高い
2. **ICU形式**: 複数形やジェンダーに対応
3. **ロケール固有の書式**: 日付、数値、通貨
4. **AOTコンパイル**: 最適化された出力

### なぜi18nルーティングが重要か

1. **グローバル展開**: 世界中のユーザーにリーチ
2. **SEO最適化**: 各言語ページが検索エンジンにインデックス
3. **ユーザーエクスペリエンス**: 母国語でのアクセス
4. **法的要件**: 多くの国で多言語対応が必要
5. **ブランドイメージ**: プロフェッショナルな印象

### URLパターンの種類

1. **サブディレクトリ**: `/en/products`, `/ja/products`
2. **サブドメイン**: `en.example.com`, `ja.example.com`
3. **ドメイン**: `example.com`, `example.jp`
4. **クエリパラメータ**: `/products?lang=en`（非推奨）

## 実装例

### 例1: 基本的なi18nセットアップ

```json
// angular.json
{
  "projects": {
    "my-app": {
      "i18n": {
        "sourceLocale": "en-US",
        "locales": {
          "ja": {
            "translation": "src/locale/messages.ja.xlf",
            "baseHref": "/ja/"
          },
          "es": {
            "translation": "src/locale/messages.es.xlf",
            "baseHref": "/es/"
          },
          "fr": {
            "translation": "src/locale/messages.fr.xlf",
            "baseHref": "/fr/"
          }
        }
      },
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "localize": true
            },
            "development": {
              "localize": false
            },
            "ja": {
              "localize": ["ja"]
            },
            "es": {
              "localize": ["es"]
            },
            "fr": {
              "localize": ["fr"]
            }
          }
        },
        "serve": {
          "configurations": {
            "ja": {
              "buildTarget": "my-app:build:development,ja"
            },
            "es": {
              "buildTarget": "my-app:build:development,es"
            },
            "fr": {
              "buildTarget": "my-app:build:development,fr"
            }
          }
        }
      }
    }
  }
}
```

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <header>
      <h1 i18n="@@app.title">My Application</h1>
      <p i18n="@@app.welcome">Welcome to our application!</p>
    </header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
```

### 例2: ロケール検出と切り替えサービス

```typescript
// services/locale.service.ts
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private router = inject(Router);
  private currentLocaleId = inject(LOCALE_ID);

  private supportedLocales: LocaleInfo[] = [
    {
      code: 'en-US',
      name: 'English',
      nativeName: 'English',
      direction: 'ltr',
      flag: '🇺🇸'
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      direction: 'ltr',
      flag: '🇯🇵'
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      direction: 'ltr',
      flag: '🇪🇸'
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      direction: 'ltr',
      flag: '🇫🇷'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      direction: 'rtl',
      flag: '🇸🇦'
    },
    {
      code: 'zh-CN',
      name: 'Chinese (Simplified)',
      nativeName: '简体中文',
      direction: 'ltr',
      flag: '🇨🇳'
    }
  ];

  /**
   * 現在のロケールを取得
   */
  getCurrentLocale(): LocaleInfo {
    return this.supportedLocales.find(
      locale => locale.code === this.currentLocaleId
    ) || this.supportedLocales[0];
  }

  /**
   * サポートされているすべてのロケールを取得
   */
  getSupportedLocales(): LocaleInfo[] {
    return this.supportedLocales;
  }

  /**
   * ブラウザの言語設定から最適なロケールを検出
   */
  detectBrowserLocale(): string {
    if (typeof navigator === 'undefined') {
      return 'en-US';
    }

    const browserLang = navigator.language;
    const supportedCodes = this.supportedLocales.map(l => l.code);

    // 完全一致
    if (supportedCodes.includes(browserLang)) {
      return browserLang;
    }

    // 言語コードのみで一致（例: en-GB -> en-US）
    const langCode = browserLang.split('-')[0];
    const match = supportedCodes.find(code => code.startsWith(langCode));

    return match || 'en-US';
  }

  /**
   * ロケールを切り替え
   */
  switchLocale(localeCode: string): void {
    const locale = this.supportedLocales.find(l => l.code === localeCode);
    if (!locale) {
      console.error(`Locale ${localeCode} not supported`);
      return;
    }

    // 現在のパスを取得
    const currentPath = window.location.pathname;

    // ベースHrefを削除
    const baseHref = this.getBaseHref();
    let pathWithoutBase = currentPath.replace(baseHref, '');

    // 現在のロケールプレフィックスを削除
    const currentLocale = this.getCurrentLocale();
    const currentPrefix = `/${currentLocale.code}`;
    if (pathWithoutBase.startsWith(currentPrefix)) {
      pathWithoutBase = pathWithoutBase.replace(currentPrefix, '');
    }

    // 新しいロケールのURLを構築
    const newLocalePrefix = locale.code === 'en-US' ? '' : `/${locale.code}`;
    const newUrl = `${newLocalePrefix}${pathWithoutBase}`;

    // リロードして新しいロケールのアプリケーションを読み込む
    window.location.href = newUrl;
  }

  /**
   * ベースHrefを取得
   */
  private getBaseHref(): string {
    const base = document.querySelector('base');
    return base ? base.getAttribute('href') || '/' : '/';
  }

  /**
   * 現在のURLをロケール別URLに変換
   */
  getLocalizedUrl(localeCode: string, path?: string): string {
    const locale = this.supportedLocales.find(l => l.code === localeCode);
    if (!locale) return path || '/';

    const targetPath = path || window.location.pathname;
    const localePrefix = locale.code === 'en-US' ? '' : `/${locale.code}`;

    return `${localePrefix}${targetPath}`;
  }

  /**
   * hreflang用の代替URLを生成
   */
  getAlternateUrls(currentPath: string): Array<{ locale: string; url: string }> {
    return this.supportedLocales.map(locale => ({
      locale: locale.code,
      url: this.getLocalizedUrl(locale.code, currentPath)
    }));
  }
}
```

### 例3: 言語切り替えコンポーネント

```typescript
// components/language-switcher.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocaleService, LocaleInfo } from '../services/locale.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button
        class="current-language"
        (click)="toggleDropdown()"
        [attr.aria-expanded]="isOpen"
        [attr.aria-label]="'Select language. Current: ' + currentLocale.nativeName">
        <span class="flag">{{ currentLocale.flag }}</span>
        <span class="name">{{ currentLocale.nativeName }}</span>
        <span class="arrow" [class.open]="isOpen">▼</span>
      </button>

      <div class="dropdown" *ngIf="isOpen" @slideDown>
        <button
          *ngFor="let locale of otherLocales"
          class="locale-option"
          (click)="selectLocale(locale)"
          [attr.aria-label]="'Switch to ' + locale.nativeName"
          [dir]="locale.direction">
          <span class="flag">{{ locale.flag }}</span>
          <div class="locale-info">
            <span class="native-name">{{ locale.nativeName }}</span>
            <span class="english-name">{{ locale.name }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- オーバーレイ -->
    <div
      class="overlay"
      *ngIf="isOpen"
      (click)="toggleDropdown()"
      @fadeIn>
    </div>
  `,
  styles: [`
    .language-switcher {
      position: relative;
      z-index: 1000;
    }

    .current-language {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .current-language:hover {
      background: #f5f5f5;
      border-color: #1976d2;
    }

    .flag {
      font-size: 20px;
    }

    .name {
      font-weight: 500;
      color: #333;
    }

    .arrow {
      font-size: 10px;
      color: #666;
      transition: transform 0.2s ease;
    }

    .arrow.open {
      transform: rotate(180deg);
    }

    .dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      min-width: 250px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      overflow: hidden;
    }

    .locale-option {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 16px;
      background: white;
      border: none;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .locale-option:last-child {
      border-bottom: none;
    }

    .locale-option:hover {
      background: #f5f5f5;
    }

    .locale-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .native-name {
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .english-name {
      font-size: 12px;
      color: #666;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.1);
      z-index: 999;
    }

    @media (max-width: 768px) {
      .dropdown {
        right: 0;
        left: auto;
      }
    }
  `],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LanguageSwitcherComponent {
  private localeService = inject(LocaleService);

  currentLocale: LocaleInfo;
  isOpen = false;

  constructor() {
    this.currentLocale = this.localeService.getCurrentLocale();
  }

  get otherLocales(): LocaleInfo[] {
    return this.localeService.getSupportedLocales()
      .filter(locale => locale.code !== this.currentLocale.code);
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectLocale(locale: LocaleInfo): void {
    this.localeService.switchLocale(locale.code);
  }
}
```

### 例4: SEO対応のメタタグ管理

```typescript
// services/seo.service.ts
import { Injectable, inject, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LocaleService } from './locale.service';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private router = inject(Router);
  private localeService = inject(LocaleService);
  private localeId = inject(LOCALE_ID);

  private baseUrl = 'https://example.com';

  init(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateAlternateLinks();
      });
  }

  /**
   * ページメタデータを設定
   */
  setMetadata(metadata: PageMetadata): void {
    const currentLocale = this.localeService.getCurrentLocale();

    // タイトル設定
    const fullTitle = `${metadata.title} | My App`;
    this.title.setTitle(fullTitle);

    // 基本メタタグ
    this.meta.updateTag({ name: 'description', content: metadata.description });
    this.meta.updateTag({ name: 'keywords', content: metadata.keywords || '' });
    this.meta.updateTag({ name: 'language', content: currentLocale.code });

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: metadata.description });
    this.meta.updateTag({ property: 'og:type', content: metadata.type || 'website' });
    this.meta.updateTag({ property: 'og:locale', content: this.formatLocaleForOG(currentLocale.code) });

    if (metadata.image) {
      this.meta.updateTag({ property: 'og:image', content: metadata.image });
    }

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: metadata.description });

    if (metadata.image) {
      this.meta.updateTag({ name: 'twitter:image', content: metadata.image });
    }

    // Canonical URL
    this.updateCanonicalUrl();

    // Alternate hreflang links
    this.updateAlternateLinks();

    // RTL support
    this.updateDirection(currentLocale.direction);
  }

  /**
   * Canonical URLを更新
   */
  private updateCanonicalUrl(): void {
    const currentPath = window.location.pathname;
    const canonicalUrl = `${this.baseUrl}${currentPath}`;

    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }

  /**
   * hreflang代替リンクを更新
   */
  private updateAlternateLinks(): void {
    // 既存のhreflangリンクを削除
    const existingLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingLinks.forEach(link => link.remove());

    const currentPath = this.router.url;
    const alternates = this.localeService.getAlternateUrls(currentPath);

    // 各ロケールのhreflangリンクを追加
    alternates.forEach(({ locale, url }) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', locale);
      link.setAttribute('href', `${this.baseUrl}${url}`);
      document.head.appendChild(link);
    });

    // x-defaultリンクを追加（英語をデフォルトとする）
    const defaultLink = document.createElement('link');
    defaultLink.setAttribute('rel', 'alternate');
    defaultLink.setAttribute('hreflang', 'x-default');
    const defaultUrl = this.localeService.getLocalizedUrl('en-US', currentPath);
    defaultLink.setAttribute('href', `${this.baseUrl}${defaultUrl}`);
    document.head.appendChild(defaultLink);
  }

  /**
   * HTML directionを更新
   */
  private updateDirection(direction: 'ltr' | 'rtl'): void {
    document.documentElement.setAttribute('dir', direction);
  }

  /**
   * ロケールコードをOG形式に変換
   */
  private formatLocaleForOG(locale: string): string {
    // en-US -> en_US
    return locale.replace('-', '_');
  }

  /**
   * 代替ロケールをOGメタタグに追加
   */
  addAlternateLocales(): void {
    const alternates = this.localeService.getSupportedLocales()
      .filter(l => l.code !== this.localeId)
      .map(l => this.formatLocaleForOG(l.code));

    // og:locale:alternateタグを追加
    alternates.forEach((locale, index) => {
      this.meta.updateTag({
        property: 'og:locale:alternate',
        content: locale
      }, `property='og:locale:alternate'[${index}]`);
    });
  }
}
```

### 例5: ロケール検出とリダイレクト

```typescript
// guards/locale-redirect.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocaleService } from '../services/locale.service';

export const localeRedirectGuard: CanActivateFn = (route, state) => {
  const localeService = inject(LocaleService);
  const router = inject(Router);

  // ルートパス（/）の場合のみリダイレクト
  if (state.url === '/') {
    const detectedLocale = localeService.detectBrowserLocale();
    const currentLocale = localeService.getCurrentLocale();

    // 検出されたロケールと現在のロケールが異なる場合
    if (detectedLocale !== currentLocale.code) {
      const newUrl = localeService.getLocalizedUrl(detectedLocale, '/');
      window.location.href = newUrl;
      return false;
    }
  }

  return true;
};
```

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { localeRedirectGuard } from './guards/locale-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [localeRedirectGuard]
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component')
      .then(m => m.ProductsComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component')
      .then(m => m.AboutComponent)
  }
];
```

### 例6: 翻訳ファイルの管理

```xml
<!-- src/locale/messages.ja.xlf -->
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-US" trgLang="ja">
  <file id="ngi18n" original="ng.template">
    <unit id="app.title">
      <segment>
        <source>My Application</source>
        <target>私のアプリケーション</target>
      </segment>
    </unit>
    <unit id="app.welcome">
      <segment>
        <source>Welcome to our application!</source>
        <target>私たちのアプリケーションへようこそ！</target>
      </segment>
    </unit>
    <unit id="nav.home">
      <segment>
        <source>Home</source>
        <target>ホーム</target>
      </segment>
    </unit>
    <unit id="nav.products">
      <segment>
        <source>Products</source>
        <target>製品</target>
      </segment>
    </unit>
    <unit id="nav.about">
      <segment>
        <source>About</source>
        <target>について</target>
      </segment>
    </unit>
    <unit id="product.count">
      <segment>
        <source>{VAR_PLURAL, plural, =0 {No products} =1 {One product} other {<ph id="0"/> products}}</source>
        <target>{VAR_PLURAL, plural, =0 {製品なし} =1 {1つの製品} other {<ph id="0"/>個の製品}}</target>
      </segment>
    </unit>
  </file>
</xliff>
```

### 例7: 動的ロケール切り替え（実行時）

```typescript
// services/runtime-locale.service.ts
import { Injectable, signal } from '@angular/core';

export interface Translation {
  [key: string]: string | Translation;
}

@Injectable({
  providedIn: 'root'
})
export class RuntimeLocaleService {
  private currentLocale = signal<string>('en-US');
  private translations = signal<Map<string, Translation>>(new Map());

  /**
   * 翻訳を読み込み
   */
  async loadTranslations(locale: string): Promise<void> {
    if (this.translations().has(locale)) {
      this.currentLocale.set(locale);
      return;
    }

    try {
      const response = await fetch(`/assets/i18n/${locale}.json`);
      const data = await response.json();

      this.translations.update(map => {
        const newMap = new Map(map);
        newMap.set(locale, data);
        return newMap;
      });

      this.currentLocale.set(locale);
      this.saveLocalePreference(locale);
    } catch (error) {
      console.error(`Failed to load translations for ${locale}`, error);
    }
  }

  /**
   * 翻訳を取得
   */
  translate(key: string, params?: Record<string, any>): string {
    const locale = this.currentLocale();
    const translation = this.translations().get(locale);

    if (!translation) {
      return key;
    }

    let value = this.getNestedValue(translation, key);

    if (typeof value !== 'string') {
      return key;
    }

    // パラメータ置換
    if (params) {
      Object.keys(params).forEach(paramKey => {
        value = value.replace(`{{${paramKey}}}`, params[paramKey]);
      });
    }

    return value;
  }

  /**
   * ネストされた値を取得
   */
  private getNestedValue(obj: Translation, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current?.[key];
    }, obj as any);
  }

  /**
   * ロケール設定を保存
   */
  private saveLocalePreference(locale: string): void {
    localStorage.setItem('preferred-locale', locale);
  }

  /**
   * 保存されたロケール設定を読み込み
   */
  getStoredLocale(): string | null {
    return localStorage.getItem('preferred-locale');
  }

  getCurrentLocale(): string {
    return this.currentLocale();
  }
}
```

```json
// assets/i18n/ja.json
{
  "common": {
    "welcome": "ようこそ",
    "loading": "読み込み中...",
    "error": "エラーが発生しました",
    "save": "保存",
    "cancel": "キャンセル",
    "delete": "削除"
  },
  "navigation": {
    "home": "ホーム",
    "products": "製品",
    "about": "について",
    "contact": "お問い合わせ"
  },
  "products": {
    "title": "製品一覧",
    "search": "製品を検索",
    "filter": "フィルター",
    "sort": "並び替え",
    "addToCart": "カートに追加",
    "outOfStock": "在庫切れ"
  },
  "messages": {
    "itemAdded": "{{item}}をカートに追加しました",
    "itemRemoved": "{{item}}をカートから削除しました",
    "checkoutSuccess": "ご注文ありがとうございます"
  }
}
```

```typescript
// pipes/translate.pipe.ts
import { Pipe, PipeTransform, inject } from '@angular/core';
import { RuntimeLocaleService } from '../services/runtime-locale.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // ロケール変更を検出
})
export class TranslatePipe implements PipeTransform {
  private localeService = inject(RuntimeLocaleService);

  transform(key: string, params?: Record<string, any>): string {
    return this.localeService.translate(key, params);
  }
}
```

## ベストプラクティス

### 1. サブディレクトリパターンの使用

SEOに最適なURLパターンを採用します。

```
https://example.com/en/products
https://example.com/ja/products
https://example.com/es/products
```

### 2. hreflangタグの設定

検索エンジンに各言語ページを通知します。

```html
<link rel="alternate" hreflang="en-US" href="https://example.com/en/products" />
<link rel="alternate" hreflang="ja" href="https://example.com/ja/products" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/products" />
```

### 3. ロケール検出の実装

ユーザーの言語設定を自動検出します。

```typescript
detectBrowserLocale(): string {
  const browserLang = navigator.language;
  // サポートされている言語と照合
  return this.findBestMatch(browserLang);
}
```

### 4. 翻訳の一元管理

翻訳ファイルを整理された構造で管理します。

```
src/
  locale/
    messages.en-US.xlf
    messages.ja.xlf
    messages.es.xlf
    messages.fr.xlf
```

### 5. ICU形式の活用

複数形やジェンダーに対応した翻訳を使用します。

```html
<span i18n>
  {count, plural,
    =0 {No items}
    =1 {One item}
    other {{{count}} items}
  }
</span>
```

### 6. ロケール固有の書式

日付、数値、通貨を適切に書式化します。

```typescript
// 日付
{{ date | date:'short':'':locale }}

// 通貨
{{ price | currency:'JPY':'symbol':'1.0-0':locale }}

// 数値
{{ number | number:'1.2-2':locale }}
```

### 7. RTL言語のサポート

右から左へ読む言語に対応します。

```typescript
<html [dir]="currentLocale.direction">
```

```css
[dir="rtl"] .container {
  text-align: right;
}
```

### 8. SEOメタデータの多言語化

各言語でメタデータを設定します。

```typescript
setMetadata({
  title: this.translate('meta.title'),
  description: this.translate('meta.description'),
  keywords: this.translate('meta.keywords')
});
```

### 9. プリレンダリングの実装

静的サイト生成で各言語ページをプリレンダリングします。

```json
// angular.json
"prerender": {
  "builder": "@nguniversal/builders:prerender",
  "options": {
    "routes": [
      "/en/",
      "/ja/",
      "/es/",
      "/en/products",
      "/ja/products",
      "/es/products"
    ]
  }
}
```

### 10. ユーザー設定の永続化

ユーザーの言語選択を保存します。

```typescript
saveLocalePreference(locale: string): void {
  localStorage.setItem('preferred-locale', locale);
  // またはCookieに保存
  document.cookie = `locale=${locale}; path=/; max-age=31536000`;
}
```

## よくある間違い

### 1. クエリパラメータでの言語切り替え

SEOに不利なURLパターンを使用してしまう。

```typescript
// 悪い例
/products?lang=ja

// 良い例
/ja/products
```

### 2. hreflangタグの未設定

検索エンジンが各言語ページを認識できない。

```html
<!-- 悪い例：hreflangなし -->

<!-- 良い例 -->
<link rel="alternate" hreflang="ja" href="/ja/products" />
<link rel="alternate" hreflang="en" href="/en/products" />
```

### 3. ハードコードされたテキスト

翻訳可能でないテキストが残る。

```html
<!-- 悪い例 -->
<h1>Welcome</h1>

<!-- 良い例 -->
<h1 i18n="@@welcome">Welcome</h1>
```

### 4. ロケール固有の書式の無視

すべてのロケールで同じ書式を使用してしまう。

```typescript
// 悪い例
{{ date | date:'MM/dd/yyyy' }}  // 米国形式のみ

// 良い例
{{ date | date:'short':'':locale }}  // ロケール固有
```

### 5. 翻訳IDの欠如

翻訳の一意性が保証されない。

```html
<!-- 悪い例 -->
<p i18n>Save</p>
<button i18n>Save</button>  <!-- 同じテキストだが異なるコンテキスト -->

<!-- 良い例 -->
<p i18n="@@common.save">Save</p>
<button i18n="@@button.save">Save</button>
```

### 6. RTL言語の未対応

右から左へ読む言語でレイアウトが崩れる。

```css
/* 悪い例 */
.sidebar {
  float: left;  /* RTLで問題 */
}

/* 良い例 */
.sidebar {
  float: inline-start;  /* RTL対応 */
}
```

### 7. デフォルトロケールの未設定

x-defaultの設定がない。

```html
<!-- 悪い例：x-defaultなし -->

<!-- 良い例 -->
<link rel="alternate" hreflang="x-default" href="/en/" />
```

### 8. ロケール切り替え後の状態喪失

言語を切り替えると現在のページ状態が失われる。

```typescript
// 悪い例
switchLocale(locale: string): void {
  window.location.href = `/${locale}/`;  // ホームに戻る
}

// 良い例
switchLocale(locale: string): void {
  const currentPath = this.router.url;
  window.location.href = `/${locale}${currentPath}`;  // 現在のパスを維持
}
```

### 9. 翻訳の同期不足

一部の言語でのみ翻訳が更新される。

```typescript
// 良い例：翻訳チェックスクリプト
// scripts/check-translations.js
const locales = ['en-US', 'ja', 'es', 'fr'];
locales.forEach(locale => {
  // すべてのキーが存在するかチェック
});
```

### 10. パフォーマンスの考慮不足

すべての翻訳を一度に読み込んでしまう。

```typescript
// 悪い例
loadAllTranslations();  // すべての言語を読み込む

// 良い例
loadTranslation(currentLocale);  // 現在の言語のみ
```

## 演習問題

### 初級

#### 演習1: 基本的なi18nセットアップ

タスク：
1. Angular i18nを設定
2. 英語と日本語の2言語をサポート
3. ナビゲーションメニューを翻訳
4. 各言語でビルド

期待される動作：
- `/en/`と`/ja/`でアクセス可能
- ナビゲーションが各言語で表示される
- 翻訳ファイルが正しく生成される

#### 演習2: 言語切り替えコンポーネント

タスク：
1. ドロップダウン型の言語切り替えを作成
2. 現在の言語を表示
3. 他の言語を選択可能
4. 選択時に対応するURLにリダイレクト

期待される動作：
- 言語切り替えUIが表示される
- クリックで他の言語に切り替わる
- 現在のページのパスが維持される

### 中級

#### 演習1: SEO対応のメタタグ設定

タスク：
1. hreflangタグを自動生成
2. 各言語のCanonical URLを設定
3. Open Graphタグを多言語化
4. x-defaultを適切に設定

期待される動作：
- すべての言語ページにhreflangタグがある
- Canonical URLが正しく設定される
- SNS共有時に適切なメタデータが表示される

#### 演習2: ロケール検出と自動リダイレクト

タスク：
1. ブラウザの言語設定を検出
2. サポートされている言語と照合
3. 最適な言語にリダイレクト
4. ユーザーの選択を記憶

期待される動作：
- 初回訪問時に自動的に言語が選択される
- ユーザーが手動で変更した場合は記憶される
- 次回訪問時は保存された言語が使用される

### 上級

#### 演習1: RTL言語の完全サポート

タスク：
1. アラビア語などRTL言語を追加
2. レイアウトをRTLに対応
3. 双方向テキストを適切に処理
4. CSSの論理プロパティを使用

期待される動作：
- RTL言語で正しく表示される
- レイアウトが鏡像反転される
- テキストの方向が適切に処理される
- アイコンやボタンの位置が適切

実装のヒント：
```css
/* 論理プロパティの使用 */
.container {
  margin-inline-start: 16px;  /* LTR: left, RTL: right */
  padding-inline-end: 16px;   /* LTR: right, RTL: left */
}
```

#### 演習2: 動的翻訳システムの構築

タスク：
1. 実行時に翻訳を読み込むシステムを構築
2. JSON形式の翻訳ファイルをサポート
3. 翻訳の遅延読み込みを実装
4. フォールバック機構を実装
5. 翻訳キャッシュを実装

期待される動作：
- ページリロードなしで言語切り替え可能
- 必要な翻訳のみを読み込む
- 翻訳がない場合はデフォルト言語にフォールバック
- パフォーマンスが最適化されている

実装のヒント：
```typescript
interface TranslationLoader {
  loadTranslation(locale: string): Promise<Translation>;
  getTranslation(key: string, locale: string): string;
  preloadLocales(locales: string[]): Promise<void>;
}
```

## 次のステップへのリンク

I18n Routingの基礎を学んだら、次のトピックに進みましょう：

- [Error Handling](../error-handling/README.md) - エラーハンドリング戦略
- [Performance](../performance/README.md) - パフォーマンス最適化
- [State Management](../state-management/README.md) - 状態管理との統合
- [Route Reuse](../route-reuse/README.md) - ルート再利用戦略

## 参考リンク

- [Angular i18n Guide](https://angular.dev/guide/i18n)
- [Angular Localization](https://angular.dev/guide/i18n/localize)
- [Google Hreflang Guide](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [CLDR - Unicode Common Locale Data Repository](https://cldr.unicode.org/)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

## まとめ

I18n Routingは、グローバルなWebアプリケーションを構築する上で不可欠な機能です。適切に実装することで、以下のメリットが得られます：

- 世界中のユーザーにリーチできる
- SEOが大幅に向上する
- ユーザーエクスペリエンスが改善される
- ブランドのグローバル展開が可能になる
- 法的要件を満たせる

ロケール別URL、hreflangタグ、ロケール検出、翻訳管理を適切に実装して、真のグローバルアプリケーションを構築しましょう。
