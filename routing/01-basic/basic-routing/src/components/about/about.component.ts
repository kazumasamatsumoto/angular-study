import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <h2>About</h2>
    <p>このアプリケーションは Angular Routing の学習用サンプルです。</p>
    <div class="details">
      <h3>技術スタック</h3>
      <ul>
        <li>Angular 18+</li>
        <li>TypeScript</li>
        <li>Standalone Components</li>
      </ul>
    </div>
  `,
  styles: [`
    .details {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
    }

    h3 {
      margin-top: 0;
    }
  `]
})
export class AboutComponent {}
