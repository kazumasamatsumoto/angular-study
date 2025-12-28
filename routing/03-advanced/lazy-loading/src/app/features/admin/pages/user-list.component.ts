import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h3>ユーザー管理</h3>

      <p>登録されているユーザーの一覧です。</p>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名前</th>
              <th>メールアドレス</th>
              <th>権限</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users; track user.id) {
              <tr>
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge" [ngClass]="user.role === 'admin' ? 'badge-primary' : 'badge-success'">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="user.status === 'active' ? 'badge-success' : 'badge-warning'">
                    {{ user.status }}
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
      margin: 1.5rem 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    th {
      background: #f5f5f5;
      font-weight: 600;
      color: #666;
    }

    tbody tr:hover {
      background: #f9f9f9;
    }
  `]
})
export class UserListComponent {
  users: User[] = [
    { id: 1, name: '田中太郎', email: 'tanaka&#64;example.com', role: 'admin', status: 'active' },
    { id: 2, name: '佐藤花子', email: 'sato&#64;example.com', role: 'user', status: 'active' },
    { id: 3, name: '鈴木一郎', email: 'suzuki&#64;example.com', role: 'user', status: 'active' },
    { id: 4, name: '高橋美咲', email: 'takahashi&#64;example.com', role: 'user', status: 'inactive' },
    { id: 5, name: '伊藤健太', email: 'ito&#64;example.com', role: 'user', status: 'active' }
  ];
}
