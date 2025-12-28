import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

interface User {
  username: string;
  name: string;
  email: string;
  bio: string;
  posts: number[];
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (user) {
      <div class="profile">
        <h2>{{ user.name }}</h2>
        <p class="username">&#64;{{ user.username }}</p>
        <p class="email">{{ user.email }}</p>
        <p class="bio">{{ user.bio }}</p>

        <div class="info-box">
          <h3>取得したパラメータ (Observable)</h3>
          <p><strong>Username:</strong> {{ username }}</p>
          <p class="note">※ Observable を使用しているため、同じコンポーネント内での遷移でもパラメータ変更を検知できます。</p>
        </div>

        <div class="posts-section">
          <h3>{{ user.name }} の投稿</h3>
          <ul>
            @for (postId of user.posts; track postId) {
              <li>
                <a [routerLink]="['/users', username, 'posts', postId]">
                  投稿 #{{ postId }}
                </a>
              </li>
            }
          </ul>
        </div>

        <div class="user-links">
          <h3>他のユーザー</h3>
          <div class="button-group">
            @for (u of allUsers; track u.username) {
              @if (u.username !== username) {
                <a [routerLink]="['/users', u.username]" class="btn">
                  {{ u.name }}
                </a>
              }
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="error">
        <h2>ユーザーが見つかりません</h2>
        <p>Username: {{ username }} のユーザーは存在しません。</p>
      </div>
    }
  `,
  styles: [`
    .profile {
      max-width: 800px;
    }

    h2 {
      margin: 0;
    }

    .username {
      color: #1976d2;
      font-size: 1.1rem;
      margin: 0.5rem 0;
    }

    .email {
      color: #666;
      margin: 0.5rem 0;
    }

    .bio {
      margin: 1.5rem 0;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-style: italic;
    }

    .info-box {
      margin: 2rem 0;
      padding: 1rem;
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
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

    .posts-section {
      margin: 2rem 0;
    }

    .posts-section ul {
      list-style: none;
      padding: 0;
    }

    .posts-section li {
      margin: 0.5rem 0;
    }

    .posts-section a {
      color: #1976d2;
      text-decoration: none;
    }

    .posts-section a:hover {
      text-decoration: underline;
    }

    .user-links {
      margin: 2rem 0;
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
    }

    .btn:hover {
      background-color: #1565c0;
    }

    .error {
      text-align: center;
      padding: 2rem;
      color: #d32f2f;
    }
  `]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  user: User | null = null;
  username: string = '';

  allUsers: User[] = [
    {
      username: 'john',
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Web Developer | Angular Enthusiast',
      posts: [1, 2]
    },
    {
      username: 'jane',
      name: 'Jane Smith',
      email: 'jane@example.com',
      bio: 'UI/UX Designer | Creative Thinker',
      posts: [3]
    },
    {
      username: 'bob',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      bio: 'Backend Engineer | Cloud Architecture',
      posts: []
    }
  ];

  ngOnInit() {
    // Observable を使った取得（パラメータ変更を監視）
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.username = params.get('username') || '';
        this.loadUser(this.username);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUser(username: string) {
    const user = this.allUsers.find(u => u.username === username);
    this.user = user || null;
  }
}
