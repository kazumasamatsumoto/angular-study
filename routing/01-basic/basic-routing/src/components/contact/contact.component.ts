import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <h2>お問い合わせ</h2>
    <p>ご質問やフィードバックをお待ちしております。</p>
    <div class="contact-info">
      <p><strong>Email:</strong> example&#64;example.com</p>
      <p><strong>GitHub:</strong> https://github.com/your-repo</p>
    </div>
  `,
  styles: [`
    .contact-info {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #fff3e0;
      border-left: 4px solid #ff9800;
    }

    .contact-info p {
      margin: 0.5rem 0;
    }
  `]
})
export class ContactComponent {}
