import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'TechShop-Dashboard';

  ngOnInit(): void {
    // Set default theme
    document.documentElement.setAttribute('data-bs-theme', 'light');
    document.documentElement.setAttribute('data-topbar', 'light');
    document.documentElement.removeAttribute('data-theme'); // Remove any custom theme
    localStorage.setItem('theme', 'default'); // Set default theme in localStorage
  }
}
