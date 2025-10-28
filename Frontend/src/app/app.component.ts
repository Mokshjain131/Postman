import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1rem;
    }
    `
  ]
})
export class AppComponent {
  title = 'request-explorer-ng';
}
