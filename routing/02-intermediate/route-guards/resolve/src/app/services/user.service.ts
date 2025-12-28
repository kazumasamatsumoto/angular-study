import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
  };
  address: {
    city: string;
    street: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // デモ用のユーザーデータ
  private users: User[] = [
    {
      id: 1,
      name: '山田 太郎',
      email: 'yamada@example.com',
      username: 'yamada_taro',
      phone: '090-1234-5678',
      website: 'https://yamada.example.com',
      company: {
        name: '株式会社サンプル',
        catchPhrase: 'イノベーションで未来を創る'
      },
      address: {
        city: '東京',
        street: '渋谷1-2-3'
      }
    },
    {
      id: 2,
      name: '佐藤 花子',
      email: 'sato@example.com',
      username: 'sato_hanako',
      phone: '090-2345-6789',
      website: 'https://sato.example.com',
      company: {
        name: 'テックカンパニー',
        catchPhrase: 'テクノロジーで世界を変える'
      },
      address: {
        city: '大阪',
        street: '梅田4-5-6'
      }
    },
    {
      id: 3,
      name: '鈴木 一郎',
      email: 'suzuki@example.com',
      username: 'suzuki_ichiro',
      phone: '090-3456-7890',
      website: 'https://suzuki.example.com',
      company: {
        name: 'デジタルソリューションズ',
        catchPhrase: 'デジタル変革のパートナー'
      },
      address: {
        city: '福岡',
        street: '博多7-8-9'
      }
    }
  ];

  /**
   * すべてのユーザーを取得
   * ネットワーク遅延をシミュレート（1秒）
   */
  getUsers(): Observable<User[]> {
    console.log('[UserService] ユーザー一覧を取得中...');
    return of(this.users).pipe(
      delay(1000) // 1秒の遅延をシミュレート
    );
  }

  /**
   * IDで特定のユーザーを取得
   * ネットワーク遅延をシミュレート（1.5秒）
   */
  getUserById(id: number): Observable<User> {
    console.log(`[UserService] ユーザー #${id} を取得中...`);

    const user = this.users.find(u => u.id === id);

    if (!user) {
      console.error(`[UserService] ユーザー #${id} が見つかりません`);
      return throwError(() => new Error(`ユーザーID ${id} は存在しません`)).pipe(
        delay(1500)
      );
    }

    return of(user).pipe(
      delay(1500) // 1.5秒の遅延をシミュレート
    );
  }

  /**
   * ユーザー統計データを取得
   */
  getUserStats(): Observable<{ total: number; active: number; premium: number }> {
    console.log('[UserService] 統計データを取得中...');
    return of({
      total: this.users.length,
      active: this.users.length,
      premium: Math.floor(this.users.length / 2)
    }).pipe(
      delay(800)
    );
  }
}
