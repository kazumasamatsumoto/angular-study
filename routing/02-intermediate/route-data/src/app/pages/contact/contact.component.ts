import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      @if (routeData) {
        <div class="page-header">
          <span class="page-icon">{{ routeData['icon'] }}</span>
          <div class="page-title-group">
            <h2>{{ routeData['title'] }}</h2>
            <p class="page-subtitle">{{ routeData['description'] }}</p>
          </div>
        </div>
      }

      <div class="alert alert-info">
        Route Dataの<code>requiresAuth</code>を使って、認証の要否を管理できます。
        （このページはrequiresAuth: falseなので、ログイン不要です）
      </div>

      <p>
        お問い合わせは、以下のフォームからお願いいたします。
      </p>

      <h3>実装例：認証制御</h3>
      <pre><code>// app.routes.ts
{{ '{' }}
  path: 'contact',
  component: ContactComponent,
  data: {{ '{' }}
    requiresAuth: false  // 認証不要
  {{ '}' }}
{{ '}' }},
{{ '{' }}
  path: 'admin',
  component: AdminComponent,
  data: {{ '{' }}
    requiresAuth: true,   // 認証必要
    requiredRoles: ['admin']
  {{ '}' }}
{{ '}' }}

// auth.guard.ts
export const authGuard: CanActivateFn = (route) =&gt; {{ '{' }}
  const authService = inject(AuthService);
  const requiresAuth = route.data['requiresAuth'];

  if (requiresAuth && !authService.isAuthenticated()) {{ '{' }}
    return false;
  {{ '}' }}
  return true;
{{ '}' }};
</code></pre>

      <div class="metadata-box">
        <h4>現在のRoute Data</h4>
        @for (item of getRouteDataEntries(); track item.key) {
          <div class="metadata-item">
            <span class="metadata-label">{{ item.key }}:</span>
            <span class="metadata-value">{{ item.value }}</span>
          </div>
        }
      </div>

      <h3>Route Dataの活用パターン</h3>
      <ul>
        <li><strong>認証・認可:</strong> requiresAuth, requiredRoles</li>
        <li><strong>SEO:</strong> title, description, keywords</li>
        <li><strong>UI制御:</strong> layout, theme, animation</li>
        <li><strong>分析:</strong> category, pageType, trackingId</li>
        <li><strong>キャッシュ:</strong> cacheEnabled, cacheDuration</li>
      </ul>
    </div>
  `
})
export class ContactComponent implements OnInit {
  private route = inject(ActivatedRoute);
  routeData: any;

  ngOnInit(): void {
    this.routeData = this.route.snapshot.data;
  }

  getRouteDataEntries(): { key: string; value: any }[] {
    return Object.entries(this.routeData).map(([key, value]) => ({
      key,
      value: JSON.stringify(value)
    }));
  }
}
