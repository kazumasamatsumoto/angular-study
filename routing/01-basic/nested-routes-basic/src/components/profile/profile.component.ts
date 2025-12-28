import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  joinDate: string;
  avatar: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile">
      <h2>プロフィール</h2>

      <div class="profile-card">
        <div class="avatar">{{ user.avatar }}</div>
        <div class="profile-info">
          <h3>{{ user.name }}</h3>
          <p class="email">{{ user.email }}</p>
          <div class="details">
            <div class="detail-item">
              <span class="label">役割:</span>
              <span class="value">{{ user.role }}</span>
            </div>
            <div class="detail-item">
              <span class="label">登録日:</span>
              <span class="value">{{ user.joinDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>子ルートについて</h3>
        <p>
          このページは <code>/dashboard/profile</code> というパスで表示されています。
        </p>
        <p>
          親コンポーネント (<code>DashboardComponent</code>) の中にある
          <code>&lt;router-outlet&gt;</code> に、この <code>ProfileComponent</code> が
          レンダリングされています。
        </p>

        <div class="code-example">
          <h4>ルート定義</h4>
          <pre><code>&#123;
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    &#123; path: 'profile', component: ProfileComponent &#125;,
    // ...他の子ルート
  ]
&#125;</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile {
      max-width: 800px;
    }

    h2 {
      color: #1976d2;
      margin-bottom: 1.5rem;
      font-size: 1.75rem;
    }

    .profile-card {
      display: flex;
      gap: 2rem;
      background-color: #f5f5f5;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .avatar {
      font-size: 5rem;
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border-radius: 50%;
    }

    .profile-info {
      flex: 1;
    }

    .profile-info h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.5rem;
    }

    .email {
      color: #666;
      margin-bottom: 1rem;
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item {
      display: flex;
      gap: 0.5rem;
    }

    .label {
      font-weight: 600;
      color: #555;
    }

    .value {
      color: #333;
    }

    .info-section {
      background-color: #e8f5e9;
      border-left: 4px solid #4caf50;
      padding: 1.5rem;
      border-radius: 4px;
    }

    .info-section h3 {
      color: #2e7d32;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .info-section p {
      color: #333;
      margin-bottom: 0.75rem;
    }

    .code-example {
      margin-top: 1.5rem;
    }

    .code-example h4 {
      color: #2e7d32;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    pre {
      background-color: #263238;
      color: #aed581;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 0;
    }

    code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .profile-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  `]
})
export class ProfileComponent {
  user: UserProfile = {
    name: '山田 太郎',
    email: 'yamada@example.com',
    role: '管理者',
    joinDate: '2024年1月15日',
    avatar: '👨‍💼'
  };
}
