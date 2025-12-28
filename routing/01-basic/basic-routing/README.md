# 基本的なルーティング設定（Basic Routing Setup）

このセクションでは、Angular Routerの最も基本的な設定方法を学びます。

## 学習内容

1. **Angular Routerの導入**
2. **基本的なルート定義**
3. **router-outletの使用**
4. **ルーティングモジュールの設定**

## 実装例

### 1. ルーティングモジュールの作成

**app.routes.ts**
```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent }
];
```

### 2. アプリケーションの設定

**app.config.ts**
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

### 3. メインコンポーネント

**app.component.ts**
```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Basic Routing Example';
}
```

**app.component.html**
```html
<header>
  <h1>{{ title }}</h1>
  <nav>
    <a routerLink="/">ホーム</a>
    <a routerLink="/about">About</a>
    <a routerLink="/contact">お問い合わせ</a>
  </nav>
</header>

<main>
  <router-outlet></router-outlet>
</main>
```

### 4. 各ページコンポーネント

**home.component.ts**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h2>ホームページ</h2>
    <p>Angular Routing の基本的な例へようこそ！</p>
  `
})
export class HomeComponent {}
```

**about.component.ts**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <h2>About</h2>
    <p>このアプリケーションは Angular Routing の学習用です。</p>
  `
})
export class AboutComponent {}
```

**contact.component.ts**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <h2>お問い合わせ</h2>
    <p>ご質問やフィードバックをお待ちしております。</p>
  `
})
export class ContactComponent {}
```

## 重要なポイント

### 1. Routes の定義
```typescript
{ path: 'about', component: AboutComponent }
```
- `path`: URLのパス部分（スラッシュなしで記述）
- `component`: 表示するコンポーネント

### 2. 空のパス
```typescript
{ path: '', component: HomeComponent }
```
- ルートパス（`/`）にアクセスした際に表示されるコンポーネント

### 3. router-outlet
```html
<router-outlet></router-outlet>
```
- ルーティングされたコンポーネントが表示される場所
- プレースホルダーとして機能

### 4. RouterLink ディレクティブ
```html
<a routerLink="/about">About</a>
```
- ページ遷移を行うためのディレクティブ
- 通常の `href` とは異なり、ページ全体をリロードしない（SPA）

## よくある間違い

❌ **間違い**: パスに先頭のスラッシュを含める
```typescript
{ path: '/about', component: AboutComponent }  // NG
```

✅ **正しい**: スラッシュなしで記述
```typescript
{ path: 'about', component: AboutComponent }  // OK
```

❌ **間違い**: RouterOutletやRouterLinkをインポートし忘れる
```typescript
imports: []  // NG
```

✅ **正しい**: 必要なモジュールをインポート
```typescript
imports: [RouterOutlet, RouterLink]  // OK
```

## 演習問題

### 初級
1. 新しいページ「Services」を追加してください
   - パス: `/services`
   - コンポーネント名: `ServicesComponent`
   - ナビゲーションメニューにリンクを追加

2. ルートパス（`/`）を `/home` にリダイレクトしてみてください

### 中級
3. 各ページにユニークなタイトルを設定してみてください
   - Hint: `Title` サービスを使用

4. アクティブなリンクに異なるスタイルを適用してみてください
   - Hint: `routerLinkActive` ディレクティブを調べてみましょう

## 実行方法

### 初回セットアップ
```bash
cd 01-basic/basic-routing
npm install
```

### 開発サーバーの起動
```bash
npm start
# または
ng serve
```

ブラウザで `http://localhost:4200` を開いてください。

### ビルド（本番用）
```bash
npm run build
```

### 動作確認のポイント
1. ナビゲーションリンクをクリックして、各ページに遷移できることを確認
2. URLが `/`, `/about`, `/contact` に変化することを確認
3. ブラウザの戻る・進むボタンが正常に動作することを確認
4. ページ全体がリロードされず、SPA として動作していることを確認

## 次のステップ

次は [navigation](../navigation/README.md) で、より詳細なナビゲーション方法を学びます。
